import React from 'react';
import { ShieldCheck, Clock, Users, MapPin } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';

export const TrustBar = () => {
  const items = [
    {
      icon: ShieldCheck,
      title: "Fiabilité",
      desc: "Un service de confiance"
    },
    {
      icon: Clock,
      title: "Ponctualité",
      desc: "Toujours à l'heure"
    },
    {
      icon: Users,
      title: "À votre écoute",
      desc: "Un accompagnement personnalisé"
    },
    {
      icon: MapPin,
      title: BUSINESS_CONFIG.area,
      desc: "Paris et la proche région"
    }
  ];

  return (
    <section className="relative z-20 bg-navy-950/80 border-y border-white/10 py-8 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="flex items-center gap-3.5 sm:gap-4 group p-2 rounded-xl transition-all duration-300 hover:bg-white/[0.03]"
              >
                {/* Icône circulaire stylisée comme sur la maquette */}
                <div className="w-12 h-12 rounded-full border border-white/20 bg-navy-900/80 flex items-center justify-center flex-shrink-0 text-white group-hover:border-gold-400 group-hover:text-gold-400 transition-colors duration-300">
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                
                {/* Titre et description */}
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 truncate">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
