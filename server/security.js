/**
 * Headers de securite HTTP.
 *
 * Volontairement ecrit a la main plutot qu'avec `helmet` : une dependance de
 * plus, c'est une dependance de plus a maintenir et a mettre a jour. Les
 * regles appliquees ici sont en nombre petit et stable, et couvrent ce qui
 * compte pour ce site.
 *
 * ⚠️ La CSP autorise 'unsafe-inline' pour les styles : Tailwind et les styles
 *    inline de React en ont besoin. C'est un compromis delibere. Le point
 *    important reste qu'aucun script externe non declare ne peut s'executer.
 */
const CSP = [
  "default-src 'self'",
  // Vite compile le JS dans dist/ : tout le code est local, rien d' externe.
  "script-src 'self'",
  // Les styles inline sont utilises (styles calcules par les composants), et la
  // feuille de style de la police est chargee chez Google Fonts.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Aucune image tierce : tout est servi depuis le meme domaine.
  "img-src 'self' data:",
  // Les fichiers de police (Plus Jakarta Sans) sont servis par Google Fonts.
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join('; ');

const HEADERS = {
  'Content-Security-Policy': CSP,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

export const securityHeaders = (req, res, next) => {
  for (const [name, value] of Object.entries(HEADERS)) res.setHeader(name, value);

  // HSTS : le navigateur force HTTPS pendant 1 an. Inactif en local, actif
  // uniquement sur une requete reellement en HTTPS.
  //
  // `res.req.secure` n'existe que sur Express. Sur Vercel (et en general
  // derriere un proxy qui ne fait pas de TLS), la requete arrive en HTTP et le
  // booleen est absent : lire `res.req.secure` y leverait une TypeError. On
  // interroge donc la source reelle du serveur, en tenant compte du
  // protocole annonce par le proxy.
  const proto = String(req?.headers?.['x-forwarded-proto'] || '').split(',')[0].trim();
  const isHttps = Boolean(res.req?.secure) || proto === 'https';

  if (isHttps) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  next?.();
};

export default securityHeaders;