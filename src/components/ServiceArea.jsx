import React from 'react';
import { MapPin, Navigation, CheckCircle } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { AreaMapGraphic } from './AreaMapGraphic';
import { PhotoImage } from './PhotoImage';
import { BUSINESS_CONFIG } from '../config/business';

export const ServiceArea = () => {
  return (
    <section className="py-14 sm:py-20 lg:py-28 bg-brand-800 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle
          badge="PÉRIMÈTRE D'INTERVENTION"
          title="Paris / Seine-Saint-Denis et alentours"
          subtitle="Freedom Taxi intervient dans Paris, la Seine-Saint-Denis et les communes limitrophes, ainsi que sur les longues distances."
          light={true}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3 leading-snug">
                <MapPin className="w-6 h-6 text-gold-300 flex-shrink-0" />
                <span>Une zone d'intervention élargie</span>
              </h3>
              <p className="text-brand-100 text-sm sm:text-base leading-relaxed">
                Freedom Taxi intervient au quotidien pour toutes vos prises en charge à Paris et en Seine-Saint-Denis, que ce soit pour un trajet local, une liaison vers les gares parisiennes ou un transfert aéroportuaire.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="text-[11px] uppercase tracking-[0.18em] text-brand-200 font-bold">
                Zones régulières
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-brand-50">
                {BUSINESS_CONFIG.coverage.map((area, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.07] border border-white/10">
                    <CheckCircle className="w-4 h-4 text-gold-300 flex-shrink-0" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-navy-900/90 border border-gold-400/30 flex items-center gap-4 text-xs sm:text-sm text-slate-300">
              <Navigation className="w-8 h-8 text-gold-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-white">Longues distances possibles : </span>
                Trajets vers la province et transferts interurbains disponibles sur réservation préalable.
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            {/* Photo reelle : notre taxi a Paris, sur les quais de Seine */}
            <figure className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <PhotoImage
                src="/images/Paris.jpg"
                alt="Freedom Taxi, taxi parisien, devant la tour Eiffel a Paris au coucher du soleil"
                width={1672}
                height={941}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="block aspect-[16/9] w-full"
                imgClassName="h-full w-full object-cover"
              />
              <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950/95 via-navy-950/40 to-transparent px-5 sm:px-7 py-5">
                <span className="text-[11px] uppercase tracking-[0.2em] text-gold-400 font-semibold">
                  Paris
                </span>
                <p className="text-sm sm:text-base text-white font-semibold mt-1">
                  Courses dans Paris intra-muros et vers les communes limitrophes
                </p>
              </figcaption>
            </figure>

            <AreaMapGraphic />
          </div>
        </div>
      </div>
    </section>
  );
};
