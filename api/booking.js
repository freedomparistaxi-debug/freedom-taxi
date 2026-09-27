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

  // Vercel a déjà analysé le corps JSON : on le laisse tel quel.
  req.body = req.body ?? {};

  securityHeaders(req, res);

  return bookingHandler(req, res);
}
