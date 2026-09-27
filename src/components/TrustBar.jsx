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
    <section className="relative z-20 bg-white border-b border-slate-200 py-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 sm:gap-x-8">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 sm:gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0 text-brand-600">
                  <Icon className="w-5 h-5" strokeWidth={1.9} aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm sm:text-[15px] font-bold text-ink-900 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-ink-500 leading-snug">
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
