/**
 * Serveur de production Freedom Taxi.
 *
 *   npm run build   -> génère dist/
 *   npm start       -> sert dist/ + l'API /api/booking
 *
 * Les secrets sont lus depuis .env (jamais commités).
 */

import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createBookingHandler } from './booking-handler.js';
import { isMailConfigured, REQUIRED_ENV } from './booking-mailer.js';
import { securityHeaders } from './security.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, '..', 'dist');

const app = express();
const PORT = Number(process.env.PORT) || 5175;

/**
 * Derriere un reverse proxy (Nginx, Caddy, un hebergeur type Vercel/Railway),
 * `req.ip` vaut l'IP du proxy : TOUS les visiteurs partagent alors le meme
 * compteur de rate limit, et un seul spammer bloque le formulaire pour tout
 * le monde. `trust proxy` oblige Express a lire le vrai client dans
 * X-Forwarded-For.
 *
 * 1 = un seul proxy devant l'application (le cas d'un hebergement classique).
 * La valeur est configurable pour les architectures plus complexes.
 */
app.set('trust proxy', Number(process.env.TRUST_PROXY) || 1);

app.disable('x-powered-by');
app.use(securityHeaders);
app.use(express.json({ limit: '100kb' }));

/**
 * Sonde de disponibilite. Elle ne renvoie volontairement QUE l'etat du
 * service : exposer `mailConfigured` permettrait a un tiers de savoir si les
 * e-mails sont configures, ce qui n'aide personne.
 */
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.all('/api/booking', createBookingHandler());

// Pages légales : URL propres, sans le suffixe .html.
// Les fichiers vivent dans public/legal/ et sont copiés dans dist/legal/ par le
// build, donc express.static les sert deja. On ne fait ici qu'ajouter
// l'alias sans extension et imposer le type MIME explicite (certains
// hebergeurs ne complètent pas le Content-Type des .html statiques).
const LEGAL_PAGES = {
  '/mentions-legales': 'mentions-legales.html',
  '/politique-confidentialite': 'politique-confidentialite.html',
  '/cookies': 'cookies.html',
  '/conditions-reservation': 'conditions-reservation.html',
};

for (const [route, file] of Object.entries(LEGAL_PAGES)) {
  app.get(route, (_req, res) => {
    res.type('html').sendFile(path.join(DIST, 'legal', file));
  });
}

// API inconnue : 404 en JSON. Sans ce bloc, une route /api/xxx tombe dans le
// fallback SPA et renvoie index.html avec un 200, ce qui fait croire a un bug
// de reseau au lieu d'une route manquante.
app.use('/api', (_req, res) => {
  res.status(404).json({ ok: false, message: 'Route introuvable.' });
});

// Fichiers statiques (le build Vite)
app.use(express.static(DIST, { maxAge: '1h', index: false }));

// Fallback SPA (Express 5 : plus de chemin '*', on utilise un middleware)
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  res.sendFile(path.join(DIST, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  FREEDOM TAXI — serveur démarré sur http://localhost:${PORT}`);
  if (isMailConfigured()) {
    console.log('  ✓ Envoi des réservations : CONFIGURÉ (SMTP)');
  } else {
    console.log('\n  ⚠ Envoi des réservations : NON CONFIGURÉ');
    console.log('    Créez un fichier .env à la racine avec les variables suivantes :');
    REQUIRED_ENV.forEach((key) => console.log(`      ${key}=`));
    console.log('    → voir .env.example\n');
  }
});
