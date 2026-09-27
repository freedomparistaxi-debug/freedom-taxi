/**
 * Captures d'ecran via le protocole DevTools de Chromium (Edge headless).
 * Usage : node scripts/shots.mjs <url> <dossier> [largeurxhauteur:sortie]
 * Exemple : node scripts/shots.mjs http://localhost:5175 desktop 1440x900:accueil
 */
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const [, , url = 'http://localhost:5175/', outDir = 'shots', spec = ''] = process.argv;

const EDGE = `${process.env['ProgramFiles(x86)']}\\Microsoft\\Edge\\Application\\msedge.exe`;
const PORT = 9600 + Math.floor(Math.random() * 300);
const PROFILE = `C:/Users/bouchouari/AppData/Local/Temp/ft-shot-${PORT}`;

const chrome = spawn(EDGE, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${PROFILE}`,
  `--remote-debugging-port=${PORT}`,
  'about:blank',
], { stdio: 'ignore' });

async function findTarget() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch { /* le navigateur demarre encore */ }
    await sleep(250);
  }
  throw new Error('Impossible de contacter Chromium');
}

const wsUrl = await findTarget();
const ws = new WebSocket(wsUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

let id = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) {
    const { res, rej } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? rej(new Error(msg.error.message)) : res(msg.result);
  }
};
const send = (method, params = {}) => new Promise((res, rej) => {
  id += 1;
  pending.set(id, { res, rej });
  ws.send(JSON.stringify({ id, method, params }));
});

await send('Page.enable');
await mkdir(outDir, { recursive: true });

// [largeur, hauteur, nom, ancre]
const SHOTS = spec
  ? [spec.split(':').map((s, i) => (i === 0 ? s : s))].map(([dim, name]) => {
      const [w, h] = dim.split('x');
      return { w: +w, h: +h, name: name || 'vue', anchor: null };
    })
  : [
      { w: 1440, h: 900, name: 'desktop-accueil', anchor: null },
      { w: 1440, h: 900, name: 'desktop-services', anchor: '#services' },
      { w: 1440, h: 900, name: 'desktop-medical', anchor: '#medical' },
      { w: 1440, h: 900, name: 'desktop-reservation', anchor: '#reservation' },
      { w: 430, h: 932, name: 'mobile-430', anchor: null },
      { w: 390, h: 844, name: 'mobile-390', anchor: null },
      { w: 375, h: 812, name: 'mobile-375', anchor: null },
    ];

for (const s of SHOTS) {
  await send('Emulation.setDeviceMetricsOverride', {
    width: s.w, height: s.h, deviceScaleFactor: 1, mobile: s.w < 768,
  });
  await send('Page.navigate', { url });
  await sleep(1800);
  if (s.anchor) {
    await send('Runtime.evaluate', { expression: `document.querySelector('${s.anchor}')?.scrollIntoView()` });
    await sleep(700);
  }
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  const file = join(outDir, `${s.name}.png`);
  await writeFile(file, Buffer.from(data, 'base64'));
  console.log(file);
}

ws.close();
chrome.kill();
process.exit(0);
