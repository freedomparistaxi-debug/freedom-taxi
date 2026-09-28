/**
 * Test navigateur du formulaire de reservation.
 *   node scripts/qa-form.mjs <url> [dossier captures]
 *
 * Simule un vrai client : clic sur Â« Reserver Â», saisie d'une adresse lettre
 * par lettre, selection d'une proposition, remplissage, puis validation.
 * Verifie le champ d'horaire de rappel, le destinataire du mailto de secours
 * et le message affiche quand l'envoi automatique est indisponible.
 *
 * Les libelles accentues sont compares apres normalisation (NFD + suppression
 * des diacritiques) : cela evite tout probleme d'encodage entre le script et
 * la page, sans avoir a echapper le moindre caractere.
 */
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const [, , url = 'http://localhost:4180/', shotDir = ''] = process.argv;
const EDGE = `${process.env['ProgramFiles(x86)']}\\Microsoft\\Edge\\Application\\msedge.exe`;
const PORT = 9700 + Math.floor(Math.random() * 200);
const PROFILE = `C:/Users/bouchouari/AppData/Local/Temp/ft-form-${PORT}`;

const chrome = spawn(EDGE, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--no-default-browser-check', `--user-data-dir=${PROFILE}`,
  `--remote-debugging-port=${PORT}`, '--window-size=800,600', 'about:blank',
], { stdio: 'ignore' });

const problems = [];
const ok = (l) => console.log('  OK   ' + l);
const ko = (l) => { problems.push(l); console.log('  ECHEC ' + l); };

/** Minuscules, sans accents : les accents ne font pas partie des tests. */
const norm = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

    .toLowerCase();
const has = (haystack, needle) => norm(haystack).indexOf(norm(needle)) > -1;

async function findTarget() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === 'page');
      if (page && page.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      /* le navigateur demarre encore */
    }
    await sleep(250);
  }
  throw new Error('Impossible de contacter Chromium');
}

const ws = new WebSocket(await findTarget());
let id = 0;
const pending = new Map();
const send = (method, params = {}) => new Promise((resolve) => {
  id += 1; pending.set(id, resolve); ws.send(JSON.stringify({ id, method, params }));
});
const evaluate = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return r.result && r.result.result ? r.result.result.value : undefined;
};
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
});
await new Promise((r) => ws.addEventListener('open', r));

await send('Runtime.enable');
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await send('Page.navigate', { url });
await sleep(3500);

/** Renseigne un champ React comme le ferait un vrai client. */
const SET = `(id, value) => {
  const el = document.getElementById(id);
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
}`;

/**
 * Saisie au clavier, caractere par caractere : c'est le seul moyen de
 * reproduire fidelement la saisie d'un utilisateur. React n'ecoute en effet
 * que les evenements clavier reels, pas une valeur forcee dans le DOM.
 */
async function type(id, text) {
  await evaluate(`(() => { const el = document.getElementById(${JSON.stringify(id)}); if (el) { el.focus(); el.value = ''; } return true; })()`);
  for (const char of text) {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', text: char });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', text: char });
    await sleep(60);
  }
  await sleep(250);
}


console.log('1. Acces au formulaire via le bouton Reserver');
const scrolled = await evaluate(`(() => {
  const link = [...document.querySelectorAll('a')].find(a => a.getAttribute('href') === '#reservation' && a.querySelector('svg, i'));
  if (!link) return 'lien absent';
  link.click();
  return 'ok';
})()`);
if (scrolled === 'ok') ok('clic sur un bouton de reservation'); else ko(String(scrolled));
await sleep(900);

const visible = await evaluate(`(() => {
  const el = document.getElementById('reservation');
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
})()`);
if (visible) ok('le formulaire est affiche dans la vue'); else ko('formulaire non visible apres le clic');

console.log("2. Champ d'horaire de rappel");
const callbackLabel = await evaluate(`(() => {
  const el = document.getElementById('callbackTime');
  if (!el) return 'absent';
  const label = document.querySelector('label[for="callbackTime"]');
  return label ? label.textContent.replace(/\\s+/g, ' ').trim() : 'pas de label';
})()`);
if (has(callbackLabel, 'quel moment souhaitez-vous etre recontact')) ok('libelle : ' + callbackLabel);
else ko('libelle inattendu : ' + callbackLabel);

console.log("3. Propositions d'adresses");
const count1 = await evaluate(`(() => {
  const el = document.getElementById('pickup');
  if (!el) return { error: 'champ absent' };
  el.focus();
  return { focused: document.activeElement === el, value: el.value };
})()`);
await type('pickup', 'blanc');
const count1b = await evaluate(`document.querySelectorAll('[role="option"]').length`);
if (count1b > 0) ok(count1b + ' propositions au depart'); else ko('aucune proposition au depart (focus=' + JSON.stringify(count1) + ')');
await sleep(300);

console.log("4. Selection d'une adresse");
const picked = await evaluate(`(() => {
  const option = document.querySelector('[role="option"]');
  if (!option) return null;
  option.click();
  return true;
})()`);
// React planifie le rendu : on laisse le temps a l'etat de se propager.
await sleep(500);
const pickedValue = await evaluate(`document.getElementById('pickup').value`);
if (pickedValue && pickedValue.indexOf(',') > -1) ok('adresse retenue : ' + pickedValue);
else ko('selection sans effet : ' + JSON.stringify(pickedValue));

await type('destination', 'hopital');
const count2 = await evaluate(`document.querySelectorAll('[role="option"]').length`);
if (count2 > 0) ok(count2 + ' propositions a la destination'); else ko('aucune proposition a la destination');
await sleep(300);

// On selectionne reellement une proposition a la destination.
await evaluate(`(() => { const o = document.querySelector('[role="option"]'); if (o) o.click(); return true; })()`);
await sleep(500);

console.log('5. Envoi de la demande');
for (const [field, value] of [
  ['name', 'Jean Dupont'],
  ['phone', '0612345678'],
  ['email', 'jean.dupont@example.com'],
  ['callbackTime', 'Matin 9h-12h'],
]) {
  await type(field, value);
}
await evaluate(`(() => {
  const setDate = (id, value) => {
    const el = document.getElementById(id);
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  setDate('date', '2030-03-15');
  setDate('time', '14:30');
  return true;
})()`);
const values = await evaluate(`(() => {
  const g = (id) => { const el = document.getElementById(id); return el ? el.value : null; };
  return { name: g('name'), phone: g('phone'), email: g('email'), date: g('date'), time: g('time'), pickup: g('pickup'), destination: g('destination'), callbackTime: g('callbackTime') };
})()`);
for (const [k, v] of Object.entries(values)) {
  if (!v) ko('champ vide : ' + k);
}

const submitted = await evaluate(`(async () => {
  document.getElementById('reservation').querySelector('form').requestSubmit();
  await new Promise(r => setTimeout(r, 2500));
  const alert = document.querySelector('[role="alert"]');
  const mailLink = alert ? alert.querySelector('a[href^="mailto:"]') : null;
  const h3 = document.querySelector('#reservation h3');
  return {
    title: h3 ? h3.textContent.trim() : '',
    hasAlert: Boolean(alert),
    mailto: mailLink ? mailLink.getAttribute('href') : null,
    recap: document.getElementById('reservation').textContent,
  };
})()`);

if (has(submitted.title, 'bien ete prise en compte')) {
  ok('message de confirmation : ' + submitted.title);
} else {
  ko('message de confirmation inattendu : ' + submitted.title);
}
if (has(submitted.recap, 'Matin 9h-12h')) {
  ok('horaire de rappel repris dans le recapitulatif');
} else {
  ko('horaire de rappel absent du recapitulatif');
}
if (submitted.hasAlert) {
  ok("l'ecran precise que l'envoi reste a faire");
} else {
  ko("aucun avertissement : le client pourrait croire l'e-mail envoye");
}

if (submitted.mailto) {
  const decoded = decodeURIComponent(submitted.mailto);
  if (has(submitted.mailto, 'Dominique_tanoh94@yahoo.fr')) {
    ok('destinataire = Dominique_tanoh94@yahoo.fr');
  } else {
    ko('destinataire inattendu : ' + submitted.mailto.slice(0, 60));
  }
  const checks = [
    ['nom', 'Jean Dupont'],
    ['telephone', '0612345678'],
    ['depart', 'Le Blanc-Mesnil'],
    ['destination', 'Avicenne'],
    ['passagers', 'Passagers'],
    ['horaire de rappel', 'Matin 9h-12h'],
  ];
  for (const [label, needle] of checks) {
    if (has(decoded, needle)) ok('champ ' + label + ' present dans le mail prepare');
    else ko('champ ' + label + ' ABSENT du mail prepare');
  }
} else {
  ko('aucun lien mailto propose au client');
}

if (shotDir) {
  await mkdir(shotDir, { recursive: true });
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  if (shot.result && shot.result.data) {
    await writeFile(join(shotDir, 'form-confirmation.png'), Buffer.from(shot.result.data, 'base64'));
  }
}

console.log('');
if (problems.length) {
  console.log('RESULTAT : ' + problems.length + ' probleme(s)');
} else {
  console.log('RESULTAT : tout est correct');
}

ws.close();
chrome.kill();
process.exit(problems.length ? 1 : 0);
