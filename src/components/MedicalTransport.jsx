import React from 'react';
import { HeartPulse, CheckCircle2, Phone, Calendar, FileText } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { PhotoImage } from './PhotoImage';
import { Button } from './Button';
import { BUSINESS_CONFIG } from '../config/business';

export const MedicalTransport = () => {
  const points = [
    {
      title: "Prise en charge en taxi conventionné",
      desc: "Transport de particuliers vers vos rendez-vous médicaux, en taxi conventionné."
    },
    {
      title: "Tous centres de soins & hôpitaux",
      desc: "Liaisons régulières vers les hôpitaux et cliniques du Blanc-Mesnil, de Drancy, du Bourget, d'Aulnay-sous-Bois et de Paris."
    },
    {
      title: "Ponctualité pour vos rendez-vous",
      desc: "Respect strict des horaires de vos consultations, séances ou examens."
    }
  ];

  /** Prises en charge déjà prévues sur le site, à titre d'exemples. */
  const destinations = [
    "Hôpitaux et cliniques",
    "Centres de soins et cabinets médicaux",
    "Laboratoires d'analyses",
    "Kinésithérapie et rééducation",
    "Dialyse et soins réguliers",
  ];

  return (
    <section id="medical" className="py-14 sm:py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="TAXI CONVENTIONNÉ"
          title="Vos déplacements vers les établissements de santé"
          subtitle="L'activité principale de Freedom Taxi : des courses planifiées vers les hôpitaux, cliniques et centres de soins, au Blanc-Mesnil, à Drancy, au Bourget, à Aulnay-sous-Bois et aux alentours."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <p className="text-base sm:text-lg text-ink-700 leading-relaxed">
              Vos déplacements vers les établissements de santé en taxi conventionné. Ponctualité, confort et accompagnement, sur réservation.
            </p>

            <div className="pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-700 mb-3">
                Prises en charge prévues
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {destinations.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-ink-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {points.map((pt, idx) => (
                <div key={idx} className="bg-surface-light rounded-2xl p-5 border border-slate-200/80 hover:border-brand-300 transition-colors">
                  <div className="flex items-center gap-2.5 text-brand-700 font-bold text-sm mb-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                    <span>{pt.title}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-brand-50/70 border border-brand-100 flex items-start gap-3 text-xs sm:text-sm text-ink-700">
              <FileText className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-navy-900">Réservation : </span>
                Appelez-nous ou passez par le formulaire de réservation en ligne, en précisant votre lieu de départ, la destination et l'heure souhaitée.
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
                variant="primary-blue"
                size="md"
                icon={Phone}
              >
                Appeler {BUSINESS_CONFIG.phone}
              </Button>

              <Button
                href="#reservation"
                variant="primary-gold"
                size="md"
                icon={Calendar}
              >
                Réserver un transport médical
              </Button>
            </div>
          </div>

            <div className="lg:col-span-5 space-y-6 order-first lg:order-none">
            {/* Photo reelle : prise en charge devant un etablissement de sante */}
            <figure className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-card-soft">
              <PhotoImage
                src="/images/hopital-clinique.jpg"
                alt="Freedom Taxi devant l'entree d'un hopital : prise en charge pour un rendez-vous medical"
                width={1672}
                height={941}
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="block aspect-[4/3] sm:aspect-[16/9] w-full"
                imgClassName="h-full w-full object-cover"
              />
              <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950/90 to-transparent px-5 py-4">
                <span className="text-xs sm:text-sm font-semibold text-white">
                  Prise en charge devant les hopitaux et cliniques parisiens
                </span>
              </figcaption>
            </figure>

            <div className="bg-brand-800 text-white p-8 rounded-3xl shadow-xl border border-brand-700 relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-gold-300 mb-6">
                <HeartPulse className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-bold mb-3 text-white">
                Courses planifiées à l'avance
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Nous comprenons les impératifs des trajets de santé. Chaque course est planifiée avec soin pour vous assurer une arrivée à l'heure, sans stress.
              </p>

              <div className="space-y-3 border-t border-white/10 pt-6 text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Véhicule spacieux &amp; confortable</span>
                  <span className="text-gold-400">✓</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Prise en charge à l'heure demandée</span>
                  <span className="text-gold-400">✓</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Attente sur place</span>
                  <span className="text-gold-400">✓ Sur demande</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Rendez-vous réguliers</span>
                  <span className="text-gold-400">✓</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
