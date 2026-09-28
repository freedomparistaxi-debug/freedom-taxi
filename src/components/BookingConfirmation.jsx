import React from 'react';
import { CheckCircle, Phone, Mail, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { BUSINESS_CONFIG } from '../config/business';

/**
 * Écran de fin de demande.
 *
 * `sentByMail` distingue les deux situations :
 *  - false : la demande a été transmise automatiquement par le site ;
 *  - true  : l'envoi automatique a échoué, le message n'est que PRÉPARÉ et
 *            le client doit encore l'envoyer depuis sa messagerie. On ne
 *            affiche alors jamais une fausse confirmation d'envoi.
 */
export const BookingConfirmation = ({
  formData,
  onReset,
  sentByMail = false,
  mailtoHref,
  serverMessage,
}) => {
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

  return (
    <div className="text-center py-8 sm:py-12 space-y-4 animate-fadeIn">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-9 h-9" />
      </div>
      <h3 className="text-2xl font-bold text-navy-900">
        Merci, votre demande a bien été prise en compte
      </h3>
      <p className="text-slate-600 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
        Merci <span className="font-semibold text-navy-900">{formData.name}</span>. Freedom Taxi
        reviendra vers vous rapidement pour confirmer votre réservation. N'hésitez pas à nous
        contacter directement au{' '}
        <a
          href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
          className="font-semibold text-navy-900 underline underline-offset-2"
        >
          {BUSINESS_CONFIG.phone}
        </a>{' '}
        si vous avez besoin d'une information ou si votre demande est urgente.
      </p>

      {sentByMail && (
        <div role="alert" className="max-w-lg mx-auto mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-left text-sm text-amber-900">
          <p className="font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            Il reste une étape : votre e-mail n'a pas encore été envoyé
          </p>
          <p className="mt-2 leading-relaxed">
            L'envoi automatique n'a pas abouti de notre côté. Votre message a été préparé avec
            toutes vos informations : il ne vous reste qu'à l'envoyer en cliquant sur le bouton
            ci-dessous, depuis votre messagerie.
          </p>
          {serverMessage && <p className="mt-2 text-xs opacity-80">{serverMessage}</p>}
          {mailtoHref && (
            <a
              href={mailtoHref}
              className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-navy-900 text-white font-semibold text-sm hover:bg-navy-800 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Ouvrir mon e-mail et l'envoyer
            </a>
          )}
        </div>
      )}

      <div className="pt-4 mx-auto max-w-md rounded-2xl bg-surface-light border border-slate-200 p-4 text-left text-sm space-y-1.5">
        <div className="flex justify-between gap-4"><span className="text-slate-500">Départ</span><span className="font-semibold text-navy-900 text-right">{formData.pickup}</span></div>
        <div className="flex justify-between gap-4"><span className="text-slate-500">Destination</span><span className="font-semibold text-navy-900 text-right">{formData.destination}</span></div>
        <div className="flex justify-between gap-4"><span className="text-slate-500">Date et heure</span><span className="font-semibold text-navy-900 text-right">{formatDate(formData.date)} à {formData.time}</span></div>
        <div className="flex justify-between gap-4"><span className="text-slate-500">Passagers</span><span className="font-semibold text-navy-900 text-right">{formData.passengers || '1'}</span></div>
        <div className="flex justify-between gap-4"><span className="text-slate-500">Type de trajet</span><span className="font-semibold text-navy-900 text-right">{formData.rideType}</span></div>
        {formData.callbackTime && (
          <div className="flex justify-between gap-4"><span className="text-slate-500">Rappel souhaité</span><span className="font-semibold text-navy-900 text-right">{formData.callbackTime}</span></div>
        )}
      </div>

      <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          onClick={onReset}
          variant="outline-navy"
          size="md"
          className="!text-navy-900 !border-slate-300 hover:!bg-slate-100"
        >
          Faire une autre demande
        </Button>
        <Button
          href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
          variant="primary-gold"
          size="md"
          icon={Phone}
        >
          Appeler {BUSINESS_CONFIG.phone}
        </Button>
      </div>
    </div>
  );
};
