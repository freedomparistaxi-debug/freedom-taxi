import React from 'react';
import { Plus, Briefcase, Route, Users, ArrowRight, MapPin } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { BUSINESS_CONFIG } from '../config/business';

export const Services = () => {
  const serviceCards = [
    {
      id: "private",
      icon: Users,
      iconBg: "bg-brand-50 text-brand-600",
      title: "Transport de particuliers",
      desc: "Vos déplacements du quotidien, familiaux ou dépannages, en toute simplicité.",
      anchor: "#reservation"
    },
    {
      id: "business",
      icon: Briefcase,
      iconBg: "bg-brand-50 text-brand-600",
      title: "Trajets professionnels",
      desc: "Rendez-vous d'affaires, séminaires et déplacements professionnels, en toute discrétion.",
      anchor: "#reservation"
    },
    {
      id: "medical",
      icon: Plus,
      iconBg: "bg-brand-50 text-brand-600",
      title: "Établissements de santé",
      desc: "Consultations, examens et soins : nous vous accompagnons en taxi conventionné.",
      anchor: "#medical"
    },
    {
      id: "longDistance",
      icon: Route,
      iconBg: "bg-brand-50 text-brand-600",
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
          title="Un service de qualité pour tous vos trajets"
          subtitle="Transport de particuliers, trajets professionnels, taxi conventionné et longues distances : une offre pensée pour chaque situation."
        />

        {/* 4 cartes de services sur 2 colonnes (2 x 2 equilibre), puis la carte
            zone d'intervention en pleine largeur sur une ligne dediee. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {serviceCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white rounded-3xl p-7 shadow-card-soft hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between border border-slate-200 group hover:-translate-y-0.5"
              >
                <div>
                  {/* Icône carrée arrondie bleue comme maquette */}
                  <div className={`w-14 h-14 rounded-2xl ${card.iconBg} flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300`}>
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
                    <span>En savoir plus</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                  </a>
                </div>
              </div>
            );
          })}

          {/* Carte zone d'intervention : pleine largeur, mis en avant */}
          <div className="md:col-span-2 bg-brand-800 text-white rounded-3xl p-7 sm:p-8 shadow-card-soft border border-brand-700 relative overflow-hidden">
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-gold-300 flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-brand-200 font-semibold mb-1.5">
                    Zone d'intervention
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                    Paris &amp; Seine-Saint-Denis
                  </h3>
                  <p className="text-sm text-brand-100 leading-relaxed max-w-xl">
                    Paris, la Seine-Saint-Denis et les communes limitrophes, ainsi que les longues distances sur réservation.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4 lg:text-right">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm font-medium text-brand-50">
                  Île-de-France
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
