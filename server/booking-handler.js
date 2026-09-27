/**
 * Middleware Express : POST /api/booking
 * Utilisé par le plugin Vite (développement) et par le serveur de prod.
 */

import { sendBookingEmail, validateBooking, isMailConfigured } from './booking-mailer.js';

/** Rate limiter en mémoire (par IP) : max 5 demandes / minute. */
const bookingHits = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_PER_WINDOW = 5;

/**
 * Purge periodique. Sans elle, la Map garde une entree par IP vue pendant toute
 * la duree de vie du processus : sur un serveur qui tourne des mois, c'est une
 * fuite memoire lente. On vide ce qui a expire a chaque passage.
 */
const SWEEP_EVERY_MS = 5 * 60_000;
const sweep = () => {
  const now = Date.now();
  for (const [ip, times] of bookingHits) {
    const alive = times.filter((t) => now - t < RATE_WINDOW_MS);
    if (alive.length === 0) bookingHits.delete(ip);
    else bookingHits.set(ip, alive);
  }
};
const sweeper = setInterval(sweep, SWEEP_EVERY_MS);
// Ne pas garder le process en vie uniquement pour ce timer.
sweeper.unref?.();

/** Repond 429 si l'IP a deja depasse le quota dans la fenetre courante. */
const isRateLimited = (ip) => {
  const now = Date.now();
  const hits = (bookingHits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX_PER_WINDOW) return true;
  hits.push(now);
  bookingHits.set(ip, hits);
  return false;
};

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    // En production, express.json() a déjà analysé et consommé le corps.
    if (req.body !== undefined) return resolve(req.body || {});

    let raw = '';
    let settled = false;

    const fail = (err) => {
      if (settled) return;
      settled = true;
      reject(err);
    };

    req.on('data', (chunk) => {
      raw += chunk;
      // Garde-fou : 100 Ko max pour éviter les abus
      if (raw.length > 100_000) {
        fail(Object.assign(new Error('Requête trop volumineuse'), { status: 413 }));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (settled) return;
      settled = true;
      if (!raw.trim()) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(Object.assign(new Error('JSON invalide'), { status: 400 }));
      }
    });
    req.on('error', fail);
    req.on('aborted', () => fail(Object.assign(new Error('Requête interrompue'), { status: 400 })));
  });

/**
 * Adaptateur de réponse.
 *
 * En production (Express), res.status().json() existent. En développement,
 * le middleware Vite ne fournit que les méthodes brutes de Node (res.statusCode
 * + res.end). On unifie les deux cas ici.
 */
const sendJson = (res, statusCode, payload) => {
  const body = JSON.stringify(payload);

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.statusCode = statusCode;

  if (typeof res.status === 'function') {
    res.status(statusCode);
  }

  res.end(body);
};

export const createBookingHandler = () => async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { ok: false, message: 'Méthode non autorisée.' });
  }

  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (err) {
    return sendJson(res, err.status || 400, { ok: false, message: err.message });
  }

  // Honeypot : champ invisible que seuls les robots remplissent. Un humain ne
  // le voit jamais, donc il reste vide ; un bot qui envoit tous les champs le
  // remplit et se fait rejeter silencieusement (reponse identique a un succes,
  // pour ne pas lui indiquer qu'il a ete detecte).
  if (typeof payload.website === 'string' && payload.website.trim()) {
    return sendJson(res, 200, { ok: true });
  }

  const { ok, errors, booking } = validateBooking(payload);

  if (!ok) {
    return sendJson(res, 400, {
      ok: false,
      message: 'Certains champs sont invalides ou manquants.',
      errors,
    });
  }

  // Anti-spam : limitation du débit par IP, fenêtre glissante d'une minute.
  // Appliqué AVANT l'envoi SMTP, sinon un robot sature la boite mail.
  if (isRateLimited(req.ip)) {
    return sendJson(res, 429, {
      ok: false,
      message: 'Trop de demandes envoyées. Merci de réessayer dans quelques minutes.',
    });
  }

  try {
    const info = await sendBookingEmail(booking);
    return sendJson(res, 200, { ok: true, messageId: info.messageId });
  } catch (err) {
    const configured = isMailConfigured();
    console.error('[Freedom Taxi] Échec de l’envoi de la réservation :', err.message);
    return sendJson(res, 500, {
      ok: false,
      configured,
      message: configured
        ? 'L’envoi a échoué. Merci de nous appeler directement pour confirmer votre course.'
        : 'Le service d’envoi n’est pas encore configuré sur ce serveur. Merci de nous appeler pour confirmer votre réservation.',
    });
  }
};
