/**
 * Verification numerique de la galerie "Notre vehicule" via DevTools.
 * Usage : node scripts/qa-gallery.mjs <url> <largeur>
 */
const [, , url = 'http://localhost:5175/', width = '1440'] = process.argv;
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const EDGE = `${process.env['ProgramFiles(x86)']}\\Microsoft\\Edge\\Application\\msedge.exe`;
const PORT = 9700 + Math.floor(Math.random() * 200);
const PROFILE = `C:/Users/bouchouari/AppData/Local/Temp/ft-gal-${PORT}`;

const browser = spawn(EDGE, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  `--user-data-dir=${PROFILE}`, `--remote-debugging-port=${PORT}`, 'about:blank',
], { stdio: 'ignore' });

let target;
for (let i = 0; i < 40; i += 1) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    target = list.find((t) => t.type === 'page')?.webSocketDebuggerUrl;
    if (target) break;
  } catch { /* attente */ }
  await sleep(250);
}

const ws = new WebSocket(target);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0;
const jobs = new Map();
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && jobs.has(m.id)) { jobs.get(m.id)(m); jobs.delete(m.id); }
});
const call = (method, params = {}) => new Promise((r) => {
  id += 1; jobs.set(id, r);
  ws.send(JSON.stringify({ id, method, params }));
});

await call('Page.enable');
await call('Runtime.enable');
await call('Emulation.setDeviceMetricsOverride', {
  width: Number(width), height: 900, deviceScaleFactor: 1, mobile: Number(width) < 768,
});
await call('Page.navigate', { url });
await sleep(3000);
await call('Runtime.evaluate', { expression: 'document.getElementById("vehicule").scrollIntoView()' });
await sleep(1500);

const probe = await call('Runtime.evaluate', {
  returnByValue: true,
  expression: `(() => {
    const track = document.getElementById('ft-vehicle-track');
    const items = [...track.querySelectorAll(':scope > button')];
    const rects = items.map((el) => {
      const r = el.getBoundingClientRect();
      const img = el.querySelector('img');
      return {
        left: Math.round(r.left), right: Math.round(r.right),
        top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height),
        radius: getComputedStyle(el).borderTopLeftRadius,
        natural: img ? img.naturalWidth + 'x' + img.naturalHeight : null,
        complete: img ? img.complete : null,
        source: img ? img.currentSrc.split('/').pop() : null,
      };
    });
    const cs = getComputedStyle(track);
    return {
      rects,
      trackOverflowX: cs.overflowX,
      trackClientWidth: Math.round(track.clientWidth),
      trackScrollWidth: Math.round(track.scrollWidth),
      display: cs.display,
      columns: cs.gridTemplateColumns,
    };
  })()`,
});

const d = probe.result?.result?.value;
if (!d) {
  console.log('Sonde vide :', JSON.stringify(probe.result?.exceptionDetails?.exception?.description ?? probe).slice(0, 600));
  ws.close(); browser.kill(); process.exit(1);
}
console.log(`\n=== Galerie vehicule @ ${width}px ===`);
console.log(`Affichage : ${d.display}  |  colonnes : ${d.columns}  |  defilement : ${d.trackOverflowX}`);
console.log(`Piste : visible ${d.trackClientWidth}px / contenu ${d.trackScrollWidth}px ${d.trackScrollWidth > d.trackClientWidth ? '(defilement horizontal actif)' : '(tout visible)'}`);
d.rects.forEach((r, i) => {
  console.log(
    `  Photo ${i + 1} : ${r.width}x${r.height}  top=${r.top}  left=${r.left}->${r.right}  rayon=${r.radius}  source=${r.source} (${r.natural}) chargee=${r.complete}`
  );
});

const heights = new Set(d.rects.map((r) => r.height));
const tops = new Set(d.rects.map((r) => r.top));
const ratios = d.rects.map((r) => (r.width / r.height).toFixed(3));
console.log(`Meme hauteur : ${heights.size === 1 ? 'OUI (' + [...heights][0] + 'px)' : 'NON ' + [...heights]}`);
console.log(`Meme ligne (top identique) : ${tops.size === 1 ? 'OUI' : 'NON'}`);
console.log(`Proportions (largeur/hauteur) : ${ratios.join(' / ')} -> ${new Set(ratios).size === 1 ? 'identiques' : 'differentes'}`);
if (d.trackOverflowX !== 'visible') {
  const gaps = d.rects.slice(1).map((r, i) => r.left - d.rects[i].right);
  console.log(`Espacements : ${gaps.join('px, ')}px`);
}

// --- Test d'interaction de la visionneuse ---
const evaluate = (expression) =>
  call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    .then((r) => r.result?.result?.value);

const click = async (selector, index = 0) => {
  const box = await evaluate(`(() => {
    const el = document.querySelectorAll(${JSON.stringify(selector)})[${index}];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  })()`);
  if (!box) return false;
  await call('Input.dispatchMouseEvent', { type: 'mousePressed', x: box.x, y: box.y, button: 'left', clickCount: 1 });
  await call('Input.dispatchMouseEvent', { type: 'mouseReleased', x: box.x, y: box.y, button: 'left', clickCount: 1 });
  return true;
};

const key = async (k) => {
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code: k, windowsVirtualKeyCode: k === 'ArrowRight' ? 39 : 27 });
  await call('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code: k });
};

const dialogOpen = () => evaluate(`Boolean(document.querySelector('[role="dialog"][aria-modal="true"]'))`);
const dialogInfo = () => evaluate(`(() => {
  const d = document.querySelector('[role="dialog"][aria-modal="true"]');
  if (!d) return null;
  const img = d.querySelector('img');
  return { source: img.getAttribute('src'), alt: img.alt, compteur: (d.textContent.match(/\\d \\/ \\d/) || [''])[0], scrollLock: document.body.style.overflow };
})()`);

console.log('\n=== Visionneuse (clic + clavier) ===');
await click('#ft-vehicle-track > button', 1);
await sleep(700);
console.log('Ouverture au clic sur la photo 2 : ' + (await dialogOpen() ? 'OK' : 'ECHEC'));
let info = await dialogInfo();
console.log(`  image affichee : ${info?.source} | compteur : "${info?.compteur}" | scroll body bloque : "${info?.scrollLock}"`);

await key('ArrowRight');
await sleep(500);
info = await dialogInfo();
console.log('Fleche droite -> ' + info?.source);

await key('ArrowRight');
await sleep(500);
info = await dialogInfo();
console.log('Fleche droite (boucle) -> ' + info?.source);

await key('Escape');
await sleep(500);
console.log('Echap -> ' + ((await dialogOpen()) ? 'ECHEC, encore ouverte' : 'OK, fermee'));

const afterClose = await evaluate('document.body.style.overflow');
console.log('Scroll body restaure : "' + afterClose + '" ' + (afterClose === '' ? '(OK)' : '(ANORMAL)'));

ws.close();
browser.kill();
process.exit(0);