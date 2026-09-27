import React from 'react';
import { Plane, Luggage, Clock, CheckCircle2, Phone, Calendar } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { PhotoImage } from './PhotoImage';
import { Button } from './Button';
import { BUSINESS_CONFIG } from '../config/business';

const POINTS = [
  {
    icon: Luggage,
    title: 'Bagages et volume',
    desc: "Un habitacle prepare pour recevoir vos bagages, y compris pour plusieurs voyageurs.",
  },
  {
    icon: Clock,
    title: 'Course a l’heure',
    desc: 'Nous ajustons le rendez-vous a l’atterrissement ou au depart du vol.',
  },
  {
    icon: CheckCircle2,
    title: 'Mise en place',
    desc: 'Un chauffeur designe vous attend directement a la sortie du terminal.',
  },
];

/**
 * Transferts aeroportuaires et gares.
 * Photo : public.jpg (CDG) — utilisee uniquement ici.
 */
export const AirportTransfers = () => {
  return (
    <section id="aeroport" className="py-20 lg:py-28 bg-surface-light relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="TRANSFERTS & AEROPORTS"
          title="Aeroports et gares, sans mauvaise surprise"
          subtitle="Un chauffeur a l'heure, un vehicule pret et vous tranquille : nous gerons votre transfert depuis l'aeroport comme la suite de votre voyage."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <figure className="relative rounded-3xl overflow-hidden shadow-card-hover border border-slate-200">
            <PhotoImage
              src="/images/aéroport.jpg"
              alt="Freedom Taxi devant le terminal de l'aeroport Paris-Charles-de-Gaulle avec des bagages"
              width={1672}
              height={941}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="block aspect-[16/10] sm:aspect-[16/9] w-full"
              imgClassName="h-full w-full object-cover"
            />
            <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950/90 to-transparent px-5 py-4 flex items-center gap-2">
              <Plane className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-white">
                Transferts aeroportuaires a Paris-Charles-de-Gaulle et Orly
              </span>
            </figcaption>
          </figure>

          <div className="space-y-6">
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              Que vous arriviez sur un vol de nuit, que vous partiez en famille ou que vous
              transportiez plusieurs bagages, nous adaptons le trajet et l'equipement du
              vehicule a votre situation.
            </p>

            <div className="space-y-4">
              {POINTS.map((point) => {
                const Icon = point.icon;
                return (
                  <div
                    key={point.title}
                    className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-gold-400/50 transition-colors"
                  >
                    <div className="w-11 h-11 rounded-xl bg-blue-100 text-brandBlue-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-navy-900 text-sm mb-1">{point.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{point.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Button
                href="#reservation"
                variant="primary-gold"
                size="md"
                icon={Calendar}
              >
                Reserver mon transfert
              </Button>
              <Button
                href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
                variant="outline-white"
                size="md"
                icon={Phone}
                className="!text-navy-900 !border-slate-300 hover:!bg-slate-100"
              >
                {BUSINESS_CONFIG.phone}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AirportTransfers;
