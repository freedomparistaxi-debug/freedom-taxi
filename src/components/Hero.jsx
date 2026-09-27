import React from 'react';
import { Calendar, Phone, ArrowRight, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { Button } from './Button';

export const Hero = () => {
  return (
    <section
      id="hero"
      className="relative flex items-center pt-32 pb-20 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-32 bg-white overflow-hidden"
    >
      {/* Photo reelle du vehicule. Voiles tres legers : le texte est pose sur
          une carte blanche plutot que sur l'image, ce qui garantit un contraste
          fiable sans assombrir le vehicule. */}
      <div className="absolute inset-0 z-0">
        <picture className="block w-full h-full">
          <source srcSet="/images/freedom-taxi-hero.webp" type="image/webp" />
          <img
            src="/images/freedom-taxi-hero.jpg"
            alt="Freedom Taxi, taxi parisien et taxi conventionne, a Paris"
            width={1672}
            height={941}
            {...{ fetchpriority: 'high' }}
            decoding="sync"
            className="w-full h-full object-cover object-[68%_center] sm:object-center"
          />
        </picture>
        {/* Voile blanc tres leger : adoucit l'image sans la ternir. */}
        <div className="absolute inset-0 bg-white/35"></div>
        {/* Fondu vers le bas : la photo se prolonge dans la section suivante
            au lieu de s'arreter net. */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface-light to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Carte blanche semi-opaque : porte le texte et garantit un contraste
            fiable quelle que soit la luminosite de la photo. */}
        <div className="max-w-2xl bg-white/95 rounded-3xl sm:rounded-4xl border border-slate-200 shadow-card-hover px-6 py-9 sm:px-10 sm:py-11 lg:px-12 lg:py-12">
          <div className="space-y-6">

            {/* Positionnement */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[10px] sm:text-[13px] font-semibold tracking-[0.12em] uppercase whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0"></span>
              Taxi parisien — Taxi conventionné
            </div>

            <div className="space-y-3">
              <h1 className="text-[2.5rem] sm:text-5xl lg:text-6xl font-extrabold text-ink-900 tracking-tight leading-[1.05]">
                FREEDOM <span className="text-brand-600">TAXI</span>
              </h1>
              <div className="flex items-center gap-2 text-base sm:text-lg font-semibold text-ink-700">
                <MapPin className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-brand-500 flex-shrink-0" />
                <span>Paris, Seine-Saint-Denis et alentours</span>
              </div>
            </div>

            <div className="w-16 h-1 bg-gold-400 rounded-full"></div>

            <p className="text-[15px] sm:text-lg text-ink-700 leading-relaxed">
              Vos déplacements personnels, professionnels et vers les établissements de santé.
              Ponctualité, discrétion et confort, <strong className="text-ink-900 font-semibold">sur réservation ou par téléphone</strong>.
            </p>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Button
                href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
                variant="primary-blue"
                size="lg"
                icon={Phone}
                ariaLabel={`Appeler Freedom Taxi au ${BUSINESS_CONFIG.phone}`}
              >
                Appeler
              </Button>

              <Button
                href="#reservation"
                variant="primary-navy"
                size="lg"
                icon={Calendar}
                iconRight={ArrowRight}
              >
                Réserver un taxi
              </Button>
            </div>

            {/* Second numero et elements de reassurance */}
            <div className="pt-1 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[13px] sm:text-sm text-ink-700">
              <span className="inline-flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-brand-500 flex-shrink-0" />
                ou
                <a
                  href={`tel:${BUSINESS_CONFIG.phones[1].raw}`}
                  className="font-semibold text-ink-900 underline decoration-brand-300 decoration-2 underline-offset-4 hover:text-brand-600 transition-colors"
                >
                  {BUSINESS_CONFIG.phones[1].label}
                </a>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-500 flex-shrink-0" />
                Taxi conventionné
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-500 flex-shrink-0" />
                {BUSINESS_CONFIG.availability}
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

