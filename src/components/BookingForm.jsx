import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { PhotoImage } from './PhotoImage';
import { BookingConfirmation } from './BookingConfirmation';
import { BookingFormFields } from './BookingFormFields';
import { BOOKING_RECIPIENT } from '../config/business';

export const BookingForm = () => {
  const EMPTY_FORM = {
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    pickup: '',
    destination: '',
    passengers: '1',
    rideType: 'Trajet classique',
    message: '',
  };

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [serverMessage, setServerMessage] = useState('');

  // Empêche de choisir une date passée
  const today = new Date().toISOString().split('T')[0];

  const rideTypes = [
    "Trajet classique",
    "Déplacement professionnel",
    "Établissement de santé",
    "Longue distance",
    "Autre",
  ];

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Nom requis";
    if (!formData.phone.trim()) {
      errs.phone = "Téléphone requis";
    } else if (!/^[0-9+().\s-]{8,20}$/.test(formData.phone.trim())) {
      errs.phone = "Numéro invalide";
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Email invalide";
    }
    if (!formData.date) errs.date = "Date requise";
    if (!formData.time) errs.time = "Heure requise";
    if (!formData.pickup.trim()) errs.pickup = "Adresse de départ requise";
    if (!formData.destination.trim()) errs.destination = "Destination requise";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, rideType: type }));
  };

  /** mailto: de secours, utilisé si le serveur n'est pas joignable. */
  const buildMailto = (data) => {
    const lines = [
      'Nouvelle demande de réservation — Freedom Taxi',
      '',
      `Nom : ${data.name}`,
      `Téléphone : ${data.phone}`,
      `Email : ${data.email || 'Non renseigné'}`,
      `Date : ${data.date}`,
      `Heure : ${data.time}`,
      `Départ : ${data.pickup}`,
      `Destination : ${data.destination}`,
      `Passagers : ${data.passengers || '1'}`,
      `Type de trajet : ${data.rideType}`,
      `Message : ${data.message || '—'}`,
    ];
    return `mailto:${BOOKING_RECIPIENT}?subject=${encodeURIComponent('Nouvelle demande de réservation — Freedom Taxi')}&body=${encodeURIComponent(lines.join('\n'))}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    setServerMessage('');

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.message || "L'envoi a échoué. Merci de réessayer.");
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setServerMessage(
        err.message ||
          "Le service d'envoi est momentanément indisponible."
      );
    }
  };

  const handleReset = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setServerMessage('');
    setStatus('idle');
  };

  return (
    <section id="reservation" className="py-20 lg:py-28 bg-surface-light relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="RÉSERVATION"
          title="Demander une réservation"
          subtitle="Planifiez votre course à Paris, en Seine-Saint-Denis et aux alentours. Votre demande nous est transmise directement par e-mail."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Photo reelle + reassurance */}
          <aside className="lg:col-span-5 xl:col-span-4 space-y-5">
            <figure className="relative rounded-3xl overflow-hidden shadow-card-hover border border-slate-200">
              <PhotoImage
                src="/images/reservation.jpg"
                alt="Freedom Taxi a l'arret devant un hotel : reservation et prise en charge sur place"
                width={1672}
                height={941}
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="block aspect-[16/10] w-full"
                imgClassName="h-full w-full object-cover"
              />
              <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950/90 to-transparent px-5 py-4">
                <span className="text-xs sm:text-sm font-semibold text-white">
                  Reservez en ligne ou par telephone
                </span>
              </figcaption>
            </figure>

            <ul className="space-y-3 bg-white rounded-3xl p-6 border border-slate-200/80">
              {[
                'Réponse rapide par e-mail ou par téléphone',
                'Réservation immédiate ou à l’avance',
                'Départ à l’heure, à votre adresse',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="lg:col-span-7 xl:col-span-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-card-soft border border-slate-200/80">
              {status === 'success' ? (
                <BookingConfirmation formData={formData} onReset={handleReset} />
              ) : (
                <BookingFormFields
                  formData={formData}
                  errors={errors}
                  status={status}
                  serverMessage={serverMessage}
                  today={today}
                  mailtoHref={buildMailto(formData)}
                  rideTypes={rideTypes}
                  onTypeSelect={handleTypeSelect}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
