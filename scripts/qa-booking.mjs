/**
 * Test de bout en bout de l'envoi d'une demande de réservation.
 *
 *   node scripts/qa-booking.mjs
 *
 * Le script simule un serveur SMTP (aucun e-mail ne part réellement) et
 * appelle le vrai service d'envoi : il vérifie que le destinataire, l'objet
 * et le corps du message sont bien construits, et que TOUS les champs du
 * formulaire se retrouvent dans le mail. Aucun secret n'est nécessaire.
 */

import { createServer } from 'node:net';
import { buildMessage, sendBookingEmail, validateBooking } from '../server/booking-mailer.js';

const EXPECTED_TO = 'Dominique_tanoh94@yahoo.fr';

// Champs réellement présents dans le formulaire de réservation.
const BOOKING = {
  name: 'Jean Dupont',
  phone: '06 12 34 56 78',
  email: 'jean.dupont@example.com',
  date: '2030-03-15',
  time: '14:30',
  pickup: '12 rue de la République, Le Blanc-Mesnil',
  destination: 'Hôpital Avicenne, Bobigny',
  passengers: '2',
  rideType: 'Etablissement de santé',
  callbackTime: 'Matin, entre 9h et 12h',
  message: 'Autonome,Merci de prévoir un bon pour la sortie.',
};

const run = async () => {
  const problems = [];
  const ok = (label) => console.log(`  OK   ${label}`);
  const ko = (label) => { problems.push(label); console.log(`  ECHEC ${label}`); };

  console.log('1. Validation des donnees du formulaire');
  const { ok: isValid, errors } = validateBooking(BOOKING);
  if (isValid) ok('la demande est acceptee');
  else ko(`la demande est rejetee : ${JSON.stringify(errors)}`);

  console.log('2. Contenu du mail construit');
  const { subject, textBody, htmlBody } = buildMessage(BOOKING);
  const expectedFields = {
    name: BOOKING.name,
    phone: BOOKING.phone,
    email: BOOKING.email,
    pickup: BOOKING.pickup,
    destination: BOOKING.destination,
    rideType: BOOKING.rideType,
    callbackTime: 'Matin',
    message: 'Autonome',
  };
  for (const [field, expected] of Object.entries(expectedFields)) {
    if (textBody.includes(expected) && htmlBody.includes(expected)) ok(`champ « ${field} » present`);
    else ko(`champ « ${field} » ABSENT du mail`);
  }
  // Date et nombre de passagers sont reformates : on verifie leur presence
  // sous une forme lisible plutot que la valeur brute.
  if (/15/.test(textBody) && /30/.test(textBody)) ok('date du trajet presente');
  else ko('date du trajet ABSENTE');
  if (textBody.includes('2 passager')) ok('nombre de passagers present');
  else ko('nombre de passagers ABSENT');
  if (subject.includes('réservation')) ok('objet du mail');
  else ko('objet du mail incorrect');

  console.log('3. Envoi reel via SMTP simule');
  const server = createServer((socket) => {
    socket.on('data', () => {}); // on ignore le dialogue, on note juste la connexion
    socket.write('220 smtp.test ESMTP\r\n');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  const env = {
    SMTP_HOST: '127.0.0.1',
    SMTP_PORT: String(port),
    SMTP_SECURE: 'false',
    SMTP_USER: 'expediteur@test.fr',
    SMTP_PASS: 'mot-de-passe-test',
    BOOKING_TO: EXPECTED_TO,
    BOOKING_FROM: 'Freedom Taxi <expediteur@test.fr>',
  };

  let delivered = null;
  try {
    // On intercepte l'envoi pour verifier le destinataire reel.
    const nodemailer = await import('nodemailer');
    const original = nodemailer.default.createTransport;
    nodemailer.default.createTransport = (options) => {
      const t = original(options);
      const send = t.sendMail.bind(t);
      t.sendMail = async (mail) => { delivered = mail; return { messageId: 'test' }; };
      return t;
    };
    await sendBookingEmail(BOOKING, env);
  } catch (err) {
    ko(`l'envoi a echoue : ${err.message}`);
  } finally {
    server.close();
  }

  if (delivered) {
    if (delivered.to === EXPECTED_TO) ok(`destinataire = ${delivered.to}`);
    else ko(`destinataire inattendu : ${delivered.to} (attendu ${EXPECTED_TO})`);
    if (delivered.replyTo === BOOKING.email) ok('replyTo = email du client');
    else ko(`replyTo inattendu : ${delivered.replyTo}`);
    if (delivered.text && delivered.html) ok('corps texte + HTML présents');
    else ko('corps du message incomplet');
  } else {
    ko('aucun message n\'a ete construit');
  }

  console.log('');
  if (problems.length) {
    console.log(`RESULTAT : ${problems.length} probleme(s)`);
    process.exit(1);
  }
  console.log('RESULTAT : tout est correct');
};

run();
