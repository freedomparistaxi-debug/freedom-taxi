import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FormContactFields } from './FormContactFields';
import { FormRideFields } from './FormRideFields';
import { Button } from './Button';
import { BUSINESS_CONFIG } from '../config/business';

export const BookingFormFields = ({
  formData,
  errors,
  status,
  serverMessage,
  today,
  mailtoHref,
  rideTypes,
  onTypeSelect,
  onChange,
  onSubmit,
}) => {
  const isSubmitting = status === 'submitting';

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {/*
        Piège anti-robot (« honeypot »). Le champ est présent dans le HTML
        mais invisible et retiré de l'écran ; seuls les robots qui envoient
        tous les champs le remplissent. Le serveur rejette alors la demande
        en silence. Masqué avec `hidden` (et pas seulement `opacity-0`) pour
        qu'il sorte aussi de la navigation au clavier et des lecteurs d'écran.
      */}
      <div hidden aria-hidden="true">
        <label htmlFor="website">Ne pas remplir ce champ</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Type de trajet *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {rideTypes.map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => onTypeSelect(type)}
              aria-pressed={formData.rideType === type}
              className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-medium border text-left transition-all ${
                formData.rideType === type
                  ? 'bg-navy-900 text-white border-navy-900 ring-2 ring-gold-400/40 shadow-sm'
                  : 'bg-surface-light text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <FormContactFields formData={formData} errors={errors} onChange={onChange} />
      <FormRideFields formData={formData} errors={errors} onChange={onChange} today={today} />

      <div>
        <label htmlFor="message" className="block text-xs font-semibold text-slate-700 mb-1">
          Message / informations complémentaires <span className="text-slate-400 font-normal">(optionnel)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          aria-describedby="message-avertissement"
          placeholder="Bagages, contraintes particulières, bon de transport..."
          value={formData.message}
          onChange={onChange}
          className="w-full p-3 rounded-xl border border-slate-200 text-sm text-navy-900 bg-surface-light focus:bg-white focus:outline-none focus:ring-2 focus:ring-brandBlue-500/40"
        />
        {/*
          Le site propose des trajets vers des établissements de santé. On
          demande donc explicitement de ne pas transmettre d'information de
          santé ici : ces données sont sensibles, une demande de réservation
          n'a pas à les contenir, et les éviter limite les obligations de
          traitement de données de santé.
        */}
        <p id="message-avertissement" className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          Merci de ne pas transmettre d'informations médicales ou de données de santé dans ce champ.
        </p>
      </div>

      {/* Message d'erreur réel du serveur + solution de secours */}
      {status === 'error' && (
        <div role="alert" className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-800 space-y-2">
          <p className="font-semibold">{serverMessage}</p>
          <p>
            Vous pouvez aussi envoyer votre demande directement par e-mail :{' '}
            <a href={mailtoHref} className="font-semibold underline underline-offset-2">
              ouvrir le message pré-rempli
            </a>
          </p>
        </div>
      )}

      <div>
        <Button
          type="submit"
          variant="primary-gold"
          size="lg"
          disabled={isSubmitting}
          iconRight={ArrowRight}
          className="w-full text-base font-bold shadow-md"
        >
          {isSubmitting ? "Envoi de votre demande en cours..." : "Envoyer ma demande de réservation"}
        </Button>
        <p className="text-center text-xs text-slate-500 mt-3">
          Besoin immédiat ? Appelez le{' '}
          <a href={`tel:${BUSINESS_CONFIG.phoneRaw}`} className="text-navy-900 font-bold underline">
            {BUSINESS_CONFIG.phone}
          </a>{' '}
          ou le{' '}
          <a href={`tel:${BUSINESS_CONFIG.phones[1].raw}`} className="text-navy-900 font-bold underline">
            {BUSINESS_CONFIG.phones[1].label}
          </a>
          .
        </p>
      </div>
    </form>
  );
};
