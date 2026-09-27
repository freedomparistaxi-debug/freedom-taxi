import React from 'react';
import { Calendar, Phone, ArrowRight, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { Button } from './Button';

export const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] lg:min-h-screen flex items-center pt-28 pb-16 overflow-hidden bg-navy-950"
    >
      {/* Arrière-plan avec la véritable photo Freedom Taxi (voiture réelle + coucher de soleil) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/freedom-taxi-hero.jpeg"
          alt="Freedom Taxi : notre Toyota Corolla taxi parisien devant la tour Eiffel au coucher du soleil"
          width={1600}
          height={900}
          // React 18 ne reconnait pas `fetchPriority` (camelCase) : il ne
          // connaissait que `fetchpriority` en minuscules, et le prop camelCase
          // se retrouve parasite sur le DOM. On passe par une variable en
          // minuscules via {...} pour que l'attribut HTML soit correct sans
          // déclencher l'avertissement React.
          {...{ fetchpriority: 'high' }}
          decoding="sync"
          className="w-full h-full object-cover object-[72%_60%] sm:object-[70%_center] lg:object-[right_center]"
        />

        {/* Dégradés superposés pour garantir une lisibilité optimale du texte à gauche tout en laissant la voiture visible à droite */}
        {/* Dégradé horizontal : sombre et opaque à gauche, s'estompant vers la droite pour révéler la berline */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 sm:via-navy-950/80 md:via-navy-950/70 to-transparent"></div>

        {/* Dégradé vertical haut/bas pour l'intégration douce avec le header et la section suivante */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/70"></div>

        {/* Voile assombrissant léger supplémentaire sur mobile pour préserver le contraste */}
        <div className="absolute inset-0 bg-navy-950/40 sm:bg-transparent pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl lg:max-w-3xl text-left space-y-6">
          
          {/* Badge officiel de réassurance */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-900/90 backdrop-blur-md border border-gold-400/40 text-gold-400 text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-lg">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse"></span>
            VOS DÉPLACEMENTS EN TOUTE SÉRÉNITÉ
          </div>

          {/* Titre Freedom Taxi */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold text-white tracking-tight uppercase leading-[1.08] drop-shadow-md">
              FREEDOM <span className="text-gold-400">TAXI</span>
            </h1>
            <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-gold-400 flex-shrink-0" />
              <span>Taxi parisien — <span className="text-white underline decoration-gold-400/70 decoration-2 underline-offset-4">Taxi conventionné</span></span>
            </div>
          </div>

          <div className="w-20 h-1.5 bg-gold-400 rounded-full shadow-sm"></div>

          {/* Texte de présentation */}
          <p className="text-base sm:text-lg text-slate-200 max-w-xl font-normal leading-relaxed drop-shadow">
            Freedom Taxi assure vos déplacements personnels, professionnels et vers les établissements de santé à <strong className="text-white font-semibold">Paris, en Seine-Saint-Denis et aux alentours</strong>. Ponctualité, discrétion et confort.
          </p>

          {/* Boutons d'action fonctionnels */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Button
              href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
              variant="primary-gold"
              size="lg"
              icon={Phone}
              className="shadow-xl text-base font-bold"
              ariaLabel={`Appeler Freedom Taxi au ${BUSINESS_CONFIG.phone}`}
            >
              Appeler {BUSINESS_CONFIG.phone}
            </Button>

            <Button
              href="#reservation"
              variant="outline-white"
              size="lg"
              icon={Calendar}
              iconRight={ArrowRight}
              className="backdrop-blur-md bg-navy-950/40 hover:bg-white hover:text-navy-900 border-white/30 text-base font-semibold"
            >
              Réserver un taxi
            </Button>
          </div>

          {/* Second numéro */}
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
            <span>Ou appelez-nous au</span>
            <a
              href={`tel:${BUSINESS_CONFIG.phones[1].raw}`}
              className="font-bold text-white hover:text-gold-400 underline underline-offset-4 transition-colors"
            >
              {BUSINESS_CONFIG.phones[1].label}
            </a>
          </div>

          {/* Informations de confiance */}
          <div className="pt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-900/80 backdrop-blur-md border border-white/10 text-gold-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>Taxi conventionné</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900/80 backdrop-blur-md border border-white/10 text-slate-200">
              <Clock className="w-4 h-4 text-brandBlue-400 flex-shrink-0" />
              <span>{BUSINESS_CONFIG.availability}</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900/80 backdrop-blur-md border border-white/10 text-slate-200">
              <span>Réservation immédiate ou à l'avance</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

