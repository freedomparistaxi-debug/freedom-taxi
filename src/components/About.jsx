import React from 'react';
import { ShieldCheck, Award, Sparkles, Phone } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { Button } from './Button';
import { BUSINESS_CONFIG } from '../config/business';

export const About = () => {
  const pillars = [
    {
      icon: Award,
      title: "Excellence & Proximité",
      desc: "Freedom Taxi privilégie une relation de proximité fondée sur le respect, la rigueur et l'attention aux besoins de chaque passager."
    },
    {
      icon: ShieldCheck,
      title: "Sérieux & Ponctualité",
      desc: "La ponctualité est notre engagement premier. Chaque déplacement est minutieusement anticipé pour vous assurer des arrivées sereines et sans mauvaise surprise."
    },
    {
      icon: Sparkles,
      title: "Confort & Propreté",
      desc: "Un habitacle soigné, non-fumeur, tempéré et parfaitement entretenu pour faire de chaque minute passée à bord un moment de quiétude."
    }
  ];

  return (
    <section id="apropos" className="py-14 sm:py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="À PROPOS DE NOUS"
          title="Freedom Taxi : l'exigence du service"
          subtitle="Votre partenaire de confiance pour tous vos trajets du quotidien, vos impératifs professionnels et vos soins de santé."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-surface-light rounded-2xl p-6 border border-slate-200/80 hover:border-gold-400/50 transition-all duration-300 hover:shadow-card-soft group"
              >
                <div className="w-12 h-12 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-8 rounded-3xl bg-navy-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-navy-800">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl font-bold">Un besoin spécifique ou une question ?</h4>
            <p className="text-sm text-slate-300">Freedom Taxi est à votre disposition {BUSINESS_CONFIG.availability.toLowerCase()} pour vous renseigner.</p>
          </div>
          <Button
            href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
            variant="primary-gold"
            size="md"
            icon={Phone}
            ariaLabel={`Appeler Freedom Taxi au ${BUSINESS_CONFIG.phone}`}
          >
            Appeler {BUSINESS_CONFIG.phone}
          </Button>
        </div>

      </div>
    </section>
  );
};
