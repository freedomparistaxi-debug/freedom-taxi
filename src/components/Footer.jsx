import React from 'react';
import { Shield, ChevronUp } from 'lucide-react';
import { Logo } from './Logo';
import { BUSINESS_CONFIG } from '../config/business';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-navy-950 text-white border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          <div className="space-y-4">
            <Logo light={true} />
            <p className="text-sm text-slate-400 leading-relaxed">
              Taxi parisien et taxi conventionné. Nous assurons vos déplacements à Paris, en Seine-Saint-Denis et aux alentours. Ponctualité, confort et rigueur professionnelle.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-900 border border-gold-400/30 text-xs text-gold-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Taxi conventionné</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-bold uppercase tracking-wider text-white">
              Navigation
            </div>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><a href="#services" className="hover:text-gold-400 transition-colors">Nos Services</a></li>
              <li><a href="#medical" className="hover:text-gold-400 transition-colors">Taxi conventionné</a></li>
              <li><a href="#reservation" className="hover:text-gold-400 transition-colors">Réserver une course</a></li>
              <li><a href="#apropos" className="hover:text-gold-400 transition-colors">À propos</a></li>
              <li><a href="#contact" className="hover:text-gold-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-bold uppercase tracking-wider text-white">
              Prestations
            </div>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {BUSINESS_CONFIG.serviceList.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {BUSINESS_CONFIG.name}. Tous droits réservés.
          </p>

          <div className="flex items-center gap-6">
            {/*
              Liens vers de vraies pages (documents HTML séparés) plutôt qu'une
              modale : elles sont indexables par les moteurs, partageables, et
              fonctionnent au clavier sans dépendre de JavaScript.
            */}
            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2" aria-label="Informations légales">
              <a
                href="/politique-confidentialite"
                className="hover:text-slate-300 underline underline-offset-4 transition-colors"
              >
                Confidentialité
              </a>
              <a
                href="/cookies"
                className="hover:text-slate-300 underline underline-offset-4 transition-colors"
              >
                Cookies
              </a>
              <a
                href="/conditions-reservation"
                className="hover:text-slate-300 underline underline-offset-4 transition-colors"
              >
                Conditions de réservation
              </a>
            </nav>

            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full bg-navy-900 border border-white/10 hover:border-gold-400/50 flex items-center justify-center text-slate-300 hover:text-gold-400 transition-all"
              aria-label="Retour en haut"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
};
