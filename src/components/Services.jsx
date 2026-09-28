import React from 'react';
import { Plus, Briefcase, Route, Users, ArrowRight, MapPin } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { BUSINESS_CONFIG } from '../config/business';

export const Services = () => {
  // Ordre d'importance de l'activité : le taxi conventionné occupe la
  // premiere carte, en pleine largeur. Particuliers et professionnels
  // restent disponibles, mais passent au second plan.
  const mainService = {
    id: "medical",
    icon: Plus,
    title: "Taxi conventionné — établissements de santé",
    desc: "Notre activité principale : déplacements vers les hôpitaux, cliniques et centres de soins, planifiés et pris en charge à l'heure demandée.",
    anchor: "#medical"
  };

  const secondaryServices = [
    {
      id: "private",
      icon: Users,
      title: "Trajets personnels",
      desc: "Vos déplacements du quotidien, familiaux ou dépannages, en toute simplicité.",
      anchor: "#reservation"
    },
    {
      id: "business",
      icon: Briefcase,
      title: "Trajets professionnels",
      desc: "Rendez-vous d'affaires, séminaires et déplacements professionnels, en toute discrétion.",
      anchor: "#reservation"
    },
    {
      id: "longDistance",
      icon: Route,
      title: "Local et longue distance",
      desc: "Trajets en Île-de-France et longues distances, sur réservation préalable.",
      anchor: "#reservation"
    }
  ];

  return (
    <section id="services" className="py-14 sm:py-20 lg:py-28 bg-surface-light relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Titre de section inspiré du bas de la maquette */}
        <SectionTitle
          badge="NOS SERVICES"
          title="Le taxi conventionné, notre activité principale"
          subtitle="Déplacements vers les établissements de santé en priorité, puis trajets personnels et professionnels sur demande."
        />

        {/* Carte principale : taxi conventionné, pleine largeur et mise en
            avant par la couleur de marque, avant les autres prestations. */}
        <div className="bg-brand-800 text-white rounded-3xl p-7 sm:p-8 shadow-card-soft border border-brand-700 relative overflow-hidden mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
              <Plus className="w-7 h-7 text-gold-300" strokeWidth={2.2} />
            </div>
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-[0.18em] text-gold-300 font-semibold mb-1.5">
                Service principal
              </div>
              <h3 className="text-xl font-bold text-white mb-2 leading-snug tracking-tight">
                {mainService.title}
              </h3>
              <p className="text-sm text-brand-100 leading-relaxed">
                {mainService.desc}
              </p>
            </div>
            <a
              href={mainService.anchor}
              className="inline-flex items-center gap-2 self-start sm:self-center text-sm font-semibold text-gold-300 hover:text-gold-200 transition-colors whitespace-nowrap"
            >
              <span>En savoir plus</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Autres prestations : secondaire, sur une ligne dediee. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {secondaryServices.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white rounded-3xl p-7 shadow-card-soft hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between border border-slate-200 group hover:-translate-y-0.5"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-7 h-7" strokeWidth={2.2} />
                  </div>

                  <h3 className="text-lg font-bold text-ink-900 mb-3 leading-snug tracking-tight group-hover:text-brand-700 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-sm text-ink-700 leading-relaxed mb-6">
                    {card.desc}
                  </p>
                </div>

                <div>
                  <a
                    href={card.anchor}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors group/link pt-3.5 border-t border-slate-100 w-full"
                  >
                    <span>Réserver</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

          {/* Zone d'intervention : rappel du secteur, entre le service
              principal et les autres prestations. */}
          <div className="bg-navy-900 text-white rounded-3xl p-7 sm:p-8 border border-navy-800 relative overflow-hidden mt-6">
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-gold-300 flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-gold-300 font-semibold mb-1.5">
                    Zone d'intervention
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                    Le Blanc-Mesnil · Drancy · Le Bourget · Aulnay-sous-Bois
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                    Nos courses conventionnées partent principalement de ces quatre communes, vers les établissements de santé environnants et selon les trajets.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4 lg:text-right">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm font-medium text-slate-200">
                  Seine-Saint-Denis
                </span>
              </div>
            </div>
          </div>

      </div>
    </section>
  );
};
