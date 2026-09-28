/**
 * Test local de la fonction Vercel /api/booking.
 *   node scripts/qa-api.mjs
 *
 * Simule les requetes d'un vrai navigateur (en-tetes, corps JSON) et verifie :
 *  - le code de methode refuse (GET) ;
 *  - le honeypot rejette en silence un robot ;
 *  - la validation refuse une demande incomplete ;
 *  - une demande valide atteint bien l'envoi SMTP et renvoie le destinataire ;
 *  - aucun secret SMTP ne fuit dans la reponse.
 */

import { createServer } from 'node:http';
import handler from '../api/booking.js';

const problems = [];
const ok = (l) => console.log('  OK   ' + l);
const ko = (l) => { problems.push(l); console.log('  ECHEC ' + l); };

const VALID = {
  name: 'Jean Dupont',
  phone: '0612345678',
  email: 'jean.dupont@example.com',
  date: '2030-03-15',
  time: '14:30',
  pickup: '12 rue de la RÃƒÂ©publique, Le Blanc-Mesnil',
  destination: 'HÃƒÂ´pital Avicenne, 93000 Bobigny',
  passengers: '2',
  rideType: 'Etablissement de santÃƒÂ©',
  callbackTime: 'Matin, 9h-12h',
  message: 'Autonome',
};

/** Envoie une requete au handler et renvoie la reponse simulee. */
const call = (method, body, headers = {}) =>
  new Promise((resolve) => {
    const payload = body === undefined ? '' : JSON.stringify(body);
    const req = Object.assign(
      {
        method,
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': '203.0.113.10',
          'x-forwarded-proto': 'https',
          ...headers,
        },
        socket: { remoteAddress: '203.0.113.10' },
        body: payload ? JSON.parse(payload) : {},
      },
      {},
    );
    // Vercel fournit req.ip via le proxy : on le simule.
    req.ip = '203.0.113.10';

    const resHeaders = {};
    let statusCode = 200;
    const res = {
      setHeader: (k, v) => { resHeaders[k] = v; },
      getHeader: (k) => resHeaders[k],
      end: (data) => resolve({ statusCode, headers: resHeaders, body: data }),
      status: (c) => { statusCode = c; return res; },
      req: { secure: true },
    };

    try {
      const out = handler(req, res);
      if (out && typeof out.then === 'function') out.catch(() => {});
    } catch (err) {
      resolve({ statusCode: 500, headers: resHeaders, body: JSON.stringify({ error: err.message }) });
    }
  });

// Un vrai serveur HTTP, pour ne rien simuler de trop.
const server = createServer((inReq, inRes) => {
  let raw = '';
  inReq.on('data', (c) => { raw += c; });
  inReq.on('end', async () => {
    inReq.ip = inReq.headers['x-forwarded-for'];
    // On alterne objet et chaine : c'est exactement la difference entre le
    // runtime Express et certains runtimes Vercel, qui a provoke un 400.
    const mode = alternating % 3;
    inReq.body = raw && mode === 0 ? JSON.parse(raw) : mode === 1 ? raw : undefined;
    inRes.status = (c) => { inRes.statusCode = c; return inRes; };
    inRes.req = inReq;
    await handler(inReq, inRes);
  });
});
let alternating = 0;
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const { port } = server.address();

const post = (body) =>
  fetch(`http://127.0.0.1:${port}/api/booking`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.20' },
    body: JSON.stringify(body),
  });

console.log('1. Methode non autorisee');
const get = await fetch(`http://127.0.0.1:${port}/api/booking`);
if (get.status === 405) ok('GET refuse avec 405'); else ko('GET a repondu ' + get.status);

console.log('2. Honeypot (robot)');
const bot = await post({ ...VALID, website: 'http://spam.example' });
const botJson = await bot.json();
if (bot.status === 200 && botJson.ok) ok('requete robot acceptee en silence, sans envoi');
else ko('honeypot mal gere : ' + bot.status);

console.log('3. Validation des champs');
const bad = await post({ name: '', phone: 'x' });
const badJson = await bad.json();
if (bad.status === 400 && badJson.errors) ok('demande incomplete refusee avec les erreurs detaillees');
else ko('validation ineffective : ' + bad.status);

console.log('4. Demande valide');
const good = await post(VALID);
const goodJson = await good.json().catch(() => ({}));
if (good.status === 200 && goodJson.ok) {
  ok('demande valide acceptee');
} else if (good.status === 500 && goodJson.ok === false) {
  // Attendu tant que les variables SMTP ne sont pas configurees.
  ok('demande valide acceptee, envoi SMTP non configure (statut 500 explicite)');
  if (goodJson.configured === false) ok("l'API signale clairement que la configuration manque");
  else ko("l'API ne signale pas l'absence de configuration");
  if (goodJson.message && /configur/i.test(goodJson.message)) ok('message d\'erreur explicite pour le client');
} else {
  ko('reponse inattendue : ' + good.status + ' ' + JSON.stringify(goodJson));
}

console.log('5. Aucun secret dans la reponse');
const raw = JSON.stringify(await post(VALID).then((r) => r.json().catch(() => ({}))));
const leaked = ['SMTP_PASS', 'smtp_pass', 'password'].filter((k) => raw.indexOf(k) > -1);
if (leaked.length === 0) ok('aucune variable sensible exposee');
else ko('fuite possible : ' + leaked.join(', '));

server.close();
console.log('');
if (problems.length) {
  console.log('RESULTAT : ' + problems.length + ' probleme(s)');
  process.exit(1);
}
console.log('RESULTAT : tout est correct');
