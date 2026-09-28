/**
 * Endpoint serverless Vercel : POST /api/booking
 *
 * Vercel n'exécute PAS de serveur Express persistant : `npm start` ne peut pas
 * y tourner. Le site statique (dist/) est servi par le CDN Vercel, et chaque
 * appel /api/booking invoque cette fonction à la demande.
 *
 * On ne réécrit donc pas la logique métier : on fait le pont entre le
 * (req, res) de Vercel et le middleware Express existant, qui sait déjà gérer
 * le honeypot, la validation, le rate limiting et l'envoi SMTP.
 */

import { createBookingHandler } from '../server/booking-handler.js';
import { securityHeaders } from '../server/security.js';

// Une seule instance réutilisée entre les invocations (« warm »).
const bookingHandler = createBookingHandler();

/** Rate limiting : l'IP réelle est dans X-Forwarded-For derrière le proxy Vercel. */
const clientIp = (req) => {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
};

export default async function handler(req, res) {
  // Vercel ne fait pas confiance à X-Forwarded-For par défaut : sans ceci,
  // req.ip vaudrait l'IP du proxy et TOUS les visiteurs partageraient le
  // même quota de rate limiting (5/min pour le site entier).
  req.ip = clientIp(req);

  // Vercel a peut-être déjà analysé le corps ( objet, chaîne ou Buffer ),
  // mais parfois il ne le fait pas et laisse le flux intact : dans ce cas
  // req.body vaut undefined et readJsonBody doit consommer le flux.
  // On ne met donc JAMAIS un objet vide à la place : cela ferait échouer la
  // lecture et toutes les demandes seraient rejetées.
  let body = req.body;
  if (body === undefined) {
    // Rien à faire : on laisse readJsonBody lire le flux de la requête.
  } else {
    if (Buffer.isBuffer(body)) body = body.toString('utf8');
    if (typeof body === 'string') {
      try {
        body = body.trim() ? JSON.parse(body) : {};
      } catch {
        body = {};
      }
    }
    req.body = body && typeof body === 'object' ? body : {};
  }

  // securityHeaders est un middleware Express : il appelle next() en fin de
  // chaine. Sur Vercel il n'y a pas de chaine, on lui passe un no-op.
  securityHeaders(req, res, () => {});

  return bookingHandler(req, res);
}
