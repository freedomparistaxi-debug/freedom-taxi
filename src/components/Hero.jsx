import React from 'react';
import { Calendar, Phone, ArrowRight, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { Button } from './Button';
import { PhotoImage } from './PhotoImage';

export const Hero = () => {
  return (
    <section id="hero" className="relative bg-white overflow-hidden">
      {/* pt-20 : le header est en position fixed (~72px) et recouvrait donc la photo
          du Hero, qui semblait "cachée par un bloc blanc". On garde une marge juste
          suffisante pour que la photo ne passe jamais sous le header. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 sm:pt-28 sm:pb-14 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Texte : colonne de gauche sur desktop, empilee sous la photo sur mobile. */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="space-y-6">

              {/* Positionnement */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[10px] sm:text-[13px] font-semibold tracking-[0.12em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0"></span>
                Taxi parisien — Taxi conventionné
              </div>

              <div className="space-y-3">
                <h1 className="text-[2.5rem] sm:text-5xl lg:text-6xl font-extrabold text-ink-900 tracking-tight leading-[1.05]">
                  FREEDOM <span className="text-brand-600">TAXI</span>
                </h1>
                <div className="flex items-start gap-2 text-[15px] sm:text-lg font-semibold text-ink-900">
                  <MapPin className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-brand-500 flex-shrink-0 mt-0.5" />
                  <span>
                    {BUSINESS_CONFIG.sectorShort}
                    <span className="block font-medium text-ink-700 text-sm sm:text-base">
                      et les communes limitrophes, Paris selon les trajets
                    </span>
                  </span>
                </div>
              </div>

              <div className="w-16 h-1 bg-gold-400 rounded-full"></div>

              <p className="text-[15px] sm:text-lg text-ink-700 leading-relaxed">
                Taxis personnels, professionnels et taxi conventionné vers les établissements de santé, au départ du Blanc-Mesnil, Drancy, Le Bourget, Aulnay-sous-Bois et alentours. Ponctualité et confort, <strong className="text-ink-900 font-semibold">sur réservation ou par téléphone</strong>.
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

              {/* Element de reassurance */}
              <div className="pt-1 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[13px] sm:text-sm text-ink-700">
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

          {/* Photo principale : element majeur du Hero, jamais masquee par le texte.
              Colonne de droite sur desktop, pleine largeur au-dessus du texte sur mobile.
              Sur mobile elle est en pleine largeur (marge negative compensee par le
              padding du conteneur) pour une presence visuelle forte des le 1er ecran. */}
          <div className="lg:col-span-7 order-1 lg:order-2 -mx-4 sm:mx-0">
            <figure className="relative sm:rounded-3xl overflow-hidden shadow-card-hover border-y sm:border border-slate-200 bg-slate-50">
              {/* PNG de 2,8 Mo remplacé par la même photo en JPEG/WebP existante :
                  visuellement identique, mais ~8x plus légère. Aucun fichier supprimé. */}
              <PhotoImage
                src="/images/freedom-taxi-hero.jpg"
                alt="Freedom Taxi, taxi parisien et taxi conventionne, a Paris"
                width={1672}
                height={941}
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="block w-full aspect-[3/2] sm:aspect-[16/10] lg:aspect-[16/9]"
                imgClassName="h-full w-full object-cover object-[72%_center] sm:object-center"
              />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};

