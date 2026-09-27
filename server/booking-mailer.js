/**
 * Service d'envoi des demandes de réservation Freedom Taxi.
 *
 * L'envoi réel est assuré par nodemailer via un serveur SMTP (Gmail, mais
 * tout autre SMTP fonctionne). Les identifiants sont lus EXCLUSIVEMENT
 * depuis les variables d'environnement : aucun secret n'est stocké ici
 * ni dans le dépôt Git.
 *
 * Variables attendues (voir .env.example) :
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS
 *   BOOKING_TO   -> adresse de destination des demandes
 *   BOOKING_FROM -> adresse d'expéditeur
 */

import nodemailer from 'nodemailer';

const RECIPIENT_FALLBACK = 'freedom.paris.taxi@gmail.com';

export const REQUIRED_ENV = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'BOOKING_TO',
  'BOOKING_FROM',
];

export const isMailConfigured = (env = process.env) =>
  REQUIRED_ENV.every((key) => Boolean(env[key] && env[key].trim()));

const getConfig = (env = process.env) => ({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT) || 587,
  secure: String(env.SMTP_SECURE) === 'true',
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  to: (env.BOOKING_TO && env.BOOKING_TO.trim()) || RECIPIENT_FALLBACK,
  from: env.BOOKING_FROM,
});

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Normalise la date ISO (yyyy-mm-dd) en format lisible français. */
const formatDate = (value) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const LABELS = {
  name: 'Nom',
  phone: 'Téléphone',
  email: 'Email',
  date: 'Date',
  time: 'Heure',
  pickup: 'Départ',
  destination: 'Destination',
  passengers: 'Passagers',
  rideType: 'Type de trajet',
  message: 'Message',
};

/** Construit le corps du mail, en texte brut et en HTML. */
export const buildMessage = (booking) => {
  const value = (key) => (booking[key] ?? '').toString().trim();
  const display = {
    ...booking,
    date: formatDate(value('date')) || '—',
    email: value('email') || 'Non renseigné',
    passengers: value('passengers') ? `${value('passengers')} passager(s)` : '—',
    message: value('message') || '—',
  };

  const subject = 'Nouvelle demande de réservation — Freedom Taxi';

  const textBody = [
    'Nouvelle demande de réservation — Freedom Taxi',
    '',
    ...Object.keys(LABELS).map((key) => `${LABELS[key]} : ${display[key] || '—'}`),
    '',
    '— Message envoyé automatiquement par le site Freedom Taxi.',
  ].join('\n');

  const rows = Object.keys(LABELS)
    .map(
      (key) =>
        `<tr><th align="left" style="padding:10px 16px 10px 0;white-space:nowrap;vertical-align:top;font:600 13px/1.5 Arial,sans-serif;color:#0B1D33;border-bottom:1px solid #E6EAF0;">${LABELS[key]}</th>` +
        `<td style="padding:10px 0;font:400 14px/1.5 Arial,sans-serif;color:#22303F;border-bottom:1px solid #E6EAF0;">${escapeHtml(display[key] || '—')}</td></tr>`,
    )
    .join('');

  const htmlBody = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:24px;background:#F7F9FC;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#FFFFFF;border:1px solid #E6EAF0;border-radius:16px;overflow:hidden;">
<tr><td style="background:#071426;padding:24px 28px;">
<div style="font:800 20px/1.2 Arial,Helvetica,sans-serif;color:#FFFFFF;letter-spacing:0.08em;">FREEDOM <span style="color:#E8C96A;">TAXI</span></div>
<div style="margin-top:6px;font:400 12px/1.4 Arial,sans-serif;color:#9AA8B8;">Taxi parisien — Taxi conventionné</div>
</td></tr>
<tr><td style="padding:28px;">
<h1 style="margin:0 0 6px;font:800 20px/1.3 Arial,sans-serif;color:#071426;">Nouvelle demande de réservation</h1>
<p style="margin:0 0 20px;font:400 14px/1.6 Arial,sans-serif;color:#5A6875;">Une demande a été envoyée depuis le site Freedom Taxi.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
</td></tr>
</table>
</body></html>`;

  return { subject, textBody, htmlBody };
};


/** Envoie la demande. Lève une erreur explicite si la config SMTP manque. */
export const sendBookingEmail = async (booking, env = process.env) => {
  if (!isMailConfigured(env)) {
    const error = new Error(
      'Configuration SMTP incomplète. Vérifiez les variables d’environnement (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, BOOKING_TO, BOOKING_FROM).',
    );
    error.code = 'SMTP_NOT_CONFIGURED';
    throw error;
  }

  const config = getConfig(env);
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  });

  const { subject, textBody, htmlBody } = buildMessage(booking);

  return transporter.sendMail({
    from: config.from,
    to: config.to,
    replyTo: booking.email?.trim() ? booking.email.trim() : booking.phone,
    subject,
    text: textBody,
    html: htmlBody,
  });
};

/* ------------------------------------------------------------------ */
/* Validation côté serveur (ne jamais faire confiance au client)        */
/* ------------------------------------------------------------------ */

const MAX_LENGTH = 500;

const clean = (value) =>
  typeof value === 'string' ? value.trim().slice(0, MAX_LENGTH) : '';

const isValidPhone = (value) => /^[0-9+().\s-]{8,20}$/.test(value);

/**
 * Valide et normalise une réservation.
 * @returns {{ ok: true, booking: object } | { ok: false, errors: object }}
 */
export const validateBooking = (payload = {}) => {
  const booking = {
    name: clean(payload.name),
    phone: clean(payload.phone),
    email: clean(payload.email),
    date: clean(payload.date),
    time: clean(payload.time),
    pickup: clean(payload.pickup),
    destination: clean(payload.destination),
    passengers: clean(payload.passengers),
    rideType: clean(payload.rideType),
    message: clean(payload.message),
  };

  const errors = {};

  if (!booking.name) errors.name = 'Nom requis';
  if (!booking.phone) {
    errors.phone = 'Téléphone requis';
  } else if (!isValidPhone(booking.phone)) {
    errors.phone = 'Numéro invalide';
  }
  if (booking.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email)) {
    errors.email = 'Email invalide';
  }
  if (!booking.date) errors.date = 'Date requise';
  if (!booking.time) errors.time = 'Heure requise';
  if (!booking.pickup) errors.pickup = 'Lieu de départ requis';
  if (!booking.destination) errors.destination = 'Destination requise';
  if (booking.passengers && !/^[0-9]{1,2}$/.test(booking.passengers)) {
    errors.passengers = 'Nombre de passagers invalide';
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, booking };
};

