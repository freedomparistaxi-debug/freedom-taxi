import React from 'react';
import { CheckCircle, Phone } from 'lucide-react';
import { Button } from './Button';
import { BUSINESS_CONFIG } from '../config/business';

export const BookingConfirmation = ({ formData, onReset }) => {
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
        Votre demande a bien été envoyée
      </h3>
      <p className="text-slate-600 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
        Merci <span className="font-semibold text-navy-900">{formData.name}</span>. Votre demande pour le{' '}
        <span className="font-semibold text-navy-900">{formatDate(formData.date)} à {formData.time}</span>{' '}
        a bien été transmise à Freedom Taxi par e-mail. Nous vous recontacterons au{' '}
        <span className="font-semibold text-navy-900">{formData.phone}</span> pour confirmer la prise en charge.
      </p>

      <div className="pt-4 mx-auto max-w-md rounded-2xl bg-surface-light border border-slate-200 p-4 text-left text-sm space-y-1.5">
        <div className="flex justify-between gap-4"><span className="text-slate-500">Départ</span><span className="font-semibold text-navy-900 text-right">{formData.pickup}</span></div>
        <div className="flex justify-between gap-4"><span className="text-slate-500">Destination</span><span className="font-semibold text-navy-900 text-right">{formData.destination}</span></div>
        <div className="flex justify-between gap-4"><span className="text-slate-500">Passagers</span><span className="font-semibold text-navy-900 text-right">{formData.passengers || '1'}</span></div>
        <div className="flex justify-between gap-4"><span className="text-slate-500">Type de trajet</span><span className="font-semibold text-navy-900 text-right">{formData.rideType}</span></div>
      </div>

      <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          onClick={onReset}
          variant="outline-white"
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
