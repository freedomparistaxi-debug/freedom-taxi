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
      desc: "Transport de particuliers pour vos rendez-vous médicaux, sur prescription médicale de transport."
    },
    {
      title: "Tous centres de soins & hôpitaux",
      desc: "Liaisons régulières vers les hôpitaux et cliniques de Paris et de la Seine-Saint-Denis."
    },
    {
      title: "Accompagnement bienveillant",
      desc: "Aide à la montée, à la descente et prise en charge attentionnée pour les personnes en soins."
    },
    {
      title: "Ponctualité pour vos rendez-vous",
      desc: "Respect strict des horaires de vos consultations, séances ou examens."
    }
  ];

  return (
    <section id="medical" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="TAXI CONVENTIONNÉ"
          title="Vos déplacements de santé en toute sérénité"
          subtitle="Freedom Taxi assure vos déplacements vers les établissements de santé avec rigueur, confort et discrétion."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              En tant que taxi conventionné, Freedom Taxi propose des déplacements adaptés à vos besoins de santé au départ de Paris, de la Seine-Saint-Denis et des communes limitrophes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {points.map((pt, idx) => (
                <div key={idx} className="bg-surface-light rounded-2xl p-5 border border-slate-200/80 hover:border-brandBlue-500/40 transition-colors">
                  <div className="flex items-center gap-2.5 text-brandBlue-600 font-bold text-sm mb-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                    <span>{pt.title}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/60 flex items-start gap-3 text-xs sm:text-sm text-slate-700">
              <FileText className="w-5 h-5 text-brandBlue-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-navy-900">Documents utiles : </span>
                Pour un trajet conventionné, penser à vous munir de votre prescription médicale de transport et de votre carte Vitale.
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
                variant="primary-blue"
                size="md"
                icon={Phone}
              >
                Nous contacter ({BUSINESS_CONFIG.phone})
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

          <div className="lg:col-span-5 space-y-6">
            {/* Photo reelle : prise en charge devant un etablissement de sante */}
            <figure className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-card-soft">
              <PhotoImage
                src=".jpg"
                alt="Freedom Taxi devant l'entree d'un hopital : prise en charge pour un rendez-vous medical"
                width={1672}
                height={941}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="block aspect-[16/9] w-full"
                imgClassName="h-full w-full object-cover"
              />
              <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950/90 to-transparent px-5 py-4">
                <span className="text-xs sm:text-sm font-semibold text-white">
                  Prise en charge devant les hopitaux et cliniques parisiens
                </span>
              </figcaption>
            </figure>

            <div className="bg-gradient-to-br from-navy-900 to-navy-950 text-white p-8 rounded-3xl shadow-xl border border-navy-800 relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-brandBlue-500/20 border border-brandBlue-400/40 flex items-center justify-center text-brandBlue-400 mb-6">
                <HeartPulse className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-bold mb-3 text-white">
                Un accompagnement humain &amp; attentionné
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
                  <span>Aide au port de bagages</span>
                  <span className="text-gold-400">✓</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Attente sur place</span>
                  <span className="text-gold-400">✓ Sur demande</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
