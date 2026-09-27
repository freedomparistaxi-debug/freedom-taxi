import React from 'react';
import { Plus, Briefcase, Route, Users, ArrowRight, MapPin } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { BUSINESS_CONFIG } from '../config/business';

export const Services = () => {
  const serviceCards = [
    {
      id: "private",
      icon: Users,
      iconBg: "bg-blue-100 text-brandBlue-600",
      title: "Transport de particuliers",
      desc: "Vos déplacements du quotidien, familiaux ou dépannages, en toute simplicité.",
      anchor: "#reservation"
    },
    {
      id: "business",
      icon: Briefcase,
      iconBg: "bg-blue-100 text-brandBlue-600",
      title: "Trajets professionnels",
      desc: "Rendez-vous d'affaires, séminaires et déplacements professionnels, en toute discrétion.",
      anchor: "#reservation"
    },
    {
      id: "medical",
      icon: Plus,
      iconBg: "bg-blue-100 text-brandBlue-600",
      title: "Établissements de santé",
      desc: "Consultations, examens et soins : nous vous accompagnons en taxi conventionné.",
      anchor: "#medical"
    },
    {
      id: "longDistance",
      icon: Route,
      iconBg: "bg-blue-100 text-brandBlue-600",
      title: "Local et longue distance",
      desc: "Trajets en Île-de-France et longues distances, sur réservation préalable.",
      anchor: "#reservation"
    }
  ];

  return (
    <section id="services" className="py-20 lg:py-28 bg-surface-light relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Titre de section inspiré du bas de la maquette */}
        <SectionTitle
          badge="NOS SERVICES"
          title="Un service de qualité pour tous vos trajets"
          subtitle="Transport de particuliers, trajets professionnels, taxi conventionné et longues distances : une offre pensée pour chaque situation."
        />

        {/* Grille des 3 cartes blanches + Carte de localisation sombre comme sur la maquette */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          
          {serviceCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white rounded-3xl p-7 shadow-card-soft hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between border border-slate-100 group hover:-translate-y-1.5"
              >
                <div>
                  {/* Icône carrée arrondie bleue comme maquette */}
                  <div className={`w-14 h-14 rounded-2xl ${card.iconBg} flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-7 h-7" strokeWidth={2.2} />
                  </div>

                  <h3 className="text-xl font-bold text-navy-900 mb-3 tracking-tight group-hover:text-brandBlue-600 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {card.desc}
                  </p>
                </div>

                <div>
                  <a
                    href={card.anchor}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brandBlue-500 hover:text-brandBlue-600 transition-colors group/link pt-2 border-t border-slate-100 w-full"
                  >
                    <span>En savoir plus</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                  </a>
                </div>
              </div>
            );
          })}

          {/* 4ème carte sombre : Zone d'intervention */}
          <div className="bg-navy-950 text-white rounded-3xl p-7 shadow-card-soft border border-navy-800 flex flex-col justify-between relative overflow-hidden group">
            {/* Texture graphique stylisée */}
            <div className="absolute top-0 right-0 w-36 h-36 opacity-20 pointer-events-none">
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-gold-400 w-full h-full" aria-hidden="true">
                <circle cx="50" cy="50" r="45" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="30" strokeDasharray="2 2" />
                <circle cx="50" cy="50" r="4" fill="#E8C96A" />
              </svg>
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-navy-800 border border-white/10 flex items-center justify-center mb-6 text-gold-400">
                <MapPin className="w-6 h-6" />
              </div>

              <div className="text-xs uppercase tracking-widest text-gold-400 font-semibold mb-1">
                Zone d'intervention
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Paris &amp; Seine-Saint-Denis
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Paris, la Seine-Saint-Denis et les communes limitrophes, ainsi que les longues distances sur réservation.
              </p>
            </div>

            <div className="pt-4 border-t border-navy-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Zone d'intervention</span>
              <span className="text-gold-400 font-medium">Île-de-France</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
