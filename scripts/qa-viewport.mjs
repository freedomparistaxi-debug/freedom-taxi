/**
 * QA responsive via le protocole DevTools de Chromium (Edge/Chrome headless).
 * Mesure le debordement horizontal et collecte les erreurs console.
 * Usage : node scripts/qa-viewport.mjs <url> <largeur> <hauteur>
 */
const [, , url = 'http://localhost:5175/', width = '390', height = '844', shotDir = ''] = process.argv;
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { writeFile, mkdir } from 'node:fs/promises';

const EDGE = `${process.env['ProgramFiles(x86)']}\\Microsoft\\Edge\\Application\\msedge.exe`;
const PORT = 9300 + Math.floor(Math.random() * 300);
const PROFILE = `C:/Users/bouchouari/AppData/Local/Temp/ft-qa-${PORT}`;

const chrome = spawn(EDGE, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${PROFILE}`,
  `--remote-debugging-port=${PORT}`,
  '--window-size=800,600',
  'about:blank',
], { stdio: 'ignore' });

async function findTarget() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      /* le navigateur demarre encore */
    }
    await sleep(250);
  }
  throw new Error('Impossible de contacter Chromium');
}

const wsUrl = await findTarget();
const ws = new WebSocket(wsUrl);
await new Promise((resolve) => ws.addEventListener('open', resolve, { once: true }));

let id = 0;
const pending = new Map();
const consoleErrors = [];
const failedRequests = [];

ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
    return;
  }
  if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
    consoleErrors.push(msg.params.args.map((a) => a.value ?? a.description).join(' '));
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    consoleErrors.push(msg.params.exceptionDetails.text);
  }
  if (msg.method === 'Network.responseReceived' && msg.params.response.status >= 400) {
    failedRequests.push(`${msg.params.response.status} ${msg.params.response.url}`);
  }
});

const send = (method, params = {}) =>
  new Promise((resolve) => {
    id += 1;
    const timer = setTimeout(() => {
      pending.delete(id);
      resolve({ error: 'timeout' });
    }, 15000);
    pending.set(id, (msg) => {
      clearTimeout(timer);
      resolve(msg);
    });
    ws.send(JSON.stringify({ id, method, params }));
  });

await send('Runtime.enable');
await send('Network.enable');
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width: Number(width),
  height: Number(height),
  deviceScaleFactor: 1,
  mobile: Number(width) < 768,
});

await send('Page.navigate', { url });
await sleep(3500);

// Force le chargement de toutes les images lazy
await send('Runtime.evaluate', {
  expression: 'window.scrollTo(0, document.body.scrollHeight); new Promise(r => setTimeout(r, 1200))',
  awaitPromise: true,
});
await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
await sleep(600);

const probe = await send('Runtime.evaluate', {
  returnByValue: true,
  expression: `(() => {
    const doc = document.documentElement;
    const overflowing = [];
    document.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > doc.clientWidth + 1 || r.left < -1)) {
        if (getComputedStyle(el).pointerEvents === 'none') return;
        const parent = el.parentElement;
        const parentScrolls = parent && /auto|scroll/.test(getComputedStyle(parent).overflowX);
        if (!parentScrolls) {
          overflowing.push(el.tagName + '.' + String(el.className).slice(0, 70) + ' | right=' + Math.round(r.right) + ' left=' + Math.round(r.left));
        }
      }
    });
    const broken = [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src);
    const served = [...document.images].map((i) => {
      const src = i.currentSrc || i.src;
      const entry = performance.getEntriesByName(src)[0];
      return { file: src.split('/').pop(), natural: i.naturalWidth + 'x' + i.naturalHeight, ko: Math.round((entry?.transferSize || 0) / 1024) + ' Ko' };
    });
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      overflowing: overflowing.slice(0, 12),
      images: document.images.length,
      broken,
      served,
      totalKo: Math.round([...performance.getEntriesByType('resource')].reduce((sum, r) => sum + (r.transferSize || 0), 0) / 1024),
    };
  })()`,
});

const result = probe.result?.result?.value ?? {};
console.log(`\n=== ${width}x${height} ===`);
console.log(`scrollWidth=${result.scrollWidth}  clientWidth=${result.clientWidth}  ${result.scrollWidth > result.clientWidth ? 'DEBORDEMENT' : 'OK'}`);
console.log(`images dans le DOM : ${result.images}  |  images cassees : ${result.broken.length ? result.broken.join(', ') : 'aucune'}`);
console.log('Fichiers servis :');
result.served?.forEach((s) => console.log(`  - ${String(s.file).padEnd(28)} ${s.natural.padEnd(11)} ${s.ko}`));
console.log(`Poids total de la page : ${result.totalKo} Ko`);
if (result.overflowing?.length) {
  console.log('Elements hors ecran :');
  result.overflowing.forEach((o) => console.log('  - ' + o));
}
if (failedRequests.length) {
  console.log('Requetes en echec :');
  [...new Set(failedRequests)].forEach((r) => console.log('  - ' + r));
} else {
  console.log('Requetes en echec : aucune');
}
console.log('Erreurs console : ' + (consoleErrors.length ? consoleErrors.join(' | ') : 'aucune'));

ws.close();
chrome.kill();

async function shoot() {
  const PORT2 = PORT + 1;
  const PROFILE2 = `${PROFILE}-s`;
  const browser = spawn(EDGE, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    `--user-data-dir=${PROFILE2}`, `--remote-debugging-port=${PORT2}`,
    `--window-size=${width},${height}`, 'about:blank',
  ], { stdio: 'ignore' });

  let target;
  for (let i = 0; i < 40; i += 1) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT2}/json/list`)).json();
      target = list.find((t) => t.type === 'page')?.webSocketDebuggerUrl;
      if (target) break;
    } catch { /* attente */ }
    await sleep(250);
  }

  const sock = new WebSocket(target);
  await new Promise((r) => sock.addEventListener('open', r, { once: true }));
  let sid = 0;
  const jobs = new Map();
  sock.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.id && jobs.has(m.id)) { jobs.get(m.id)(m); jobs.delete(m.id); }
  });
  const call = (method, params = {}) => new Promise((r) => {
    sid += 1; jobs.set(sid, r);
    sock.send(JSON.stringify({ id: sid, method, params }));
  });

  await call('Page.enable');
  await call('Emulation.setDeviceMetricsOverride', {
    width: Number(width), height: Number(height), deviceScaleFactor: 1, mobile: false,
  });
  await call('Page.navigate', { url });
  await sleep(3000);
  // Defiler en bas pour declencher le chargement paresseux de toutes les images
  await call('Runtime.evaluate', { expression: 'window.scrollTo(0, document.body.scrollHeight)' });
  await sleep(2000);
  // Agrandir la fenetre a la hauteur totale du document pour tout peindre
  const full = await call('Runtime.evaluate', {
    returnByValue: true,
    expression: 'Math.min(document.documentElement.scrollHeight + 40, 30000)',
  });
  const fullHeight = full.result?.result?.value ?? Number(height);
  await call('Emulation.setDeviceMetricsOverride', {
    width: Number(width), height: fullHeight, deviceScaleFactor: 1, mobile: false,
  });
  await call('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
  await sleep(1500);

  await mkdir(shotDir, { recursive: true });

  // Une seule capture pleine page : le decoupage se fait ensuite hors navigateur.
  const bounds = await call('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const out = {};
      for (const id of ['medical', 'aeroport', 'vehicule', 'reservation']) {
        const el = document.getElementById(id);
        if (el) { const r = el.getBoundingClientRect(); out[id] = { top: Math.round(r.top + window.scrollY), height: Math.round(r.height) }; }
      }
      return out;
    })()`,
  });

  const shot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  await writeFile(`${shotDir}/${width}-full.png`, Buffer.from(shot.result.data, 'base64'));
  await writeFile(`${shotDir}/${width}-bounds.json`, JSON.stringify(bounds.result?.result?.value ?? {}, null, 2));
  console.log(`capture ${shotDir}/${width}-full.png`);

  sock.close();
  browser.kill();
}

if (shotDir) await shoot();
process.exit(0);
