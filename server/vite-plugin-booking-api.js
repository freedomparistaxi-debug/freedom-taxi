/**
 * Plugin Vite : expose l'API de réservation en développement,
 * afin que le front et le backend partagent exactement le même code.
 */

// Charge le .env pour que le serveur de dev dispose des mêmes variables
// que le serveur de production. Sans .env, l'import ne fait rien de plus.
import 'dotenv/config';
import { createBookingHandler } from './booking-handler.js';

export function bookingApiPlugin() {
  const handler = createBookingHandler();

  /**
   * En développement, le flux de la requête peut déjà avoir été consommé
   * par la pile de middlewares de Vite. On lit donc le corps nous-mêmes
   * AVANT de déléguer au handler, et on le place dans req.body.
   */
  const devMiddleware = (req, res, next) => {
    if (req.method !== 'POST') return handler(req, res, next);

    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 100_000) {
        res.statusCode = 413;
        res.end(JSON.stringify({ ok: false, message: 'Requête trop volumineuse.' }));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        req.body = raw.trim() ? JSON.parse(raw) : {};
      } catch {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ ok: false, message: 'JSON invalide' }));
        return;
      }
      handler(req, res, next);
    });
    req.on('error', () => {
      res.statusCode = 400;
      res.end(JSON.stringify({ ok: false, message: 'Requête interrompue' }));
    });
  };

  return {
    name: 'freedom-taxi-booking-api',
    configureServer(server) {
      server.middlewares.use('/api/booking', devMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/booking', devMiddleware);
    },
  };
}
