import React from 'react';
import { Phone, Mail, MapPin, Clock, Car, Calendar } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { Button } from './Button';
import { BUSINESS_CONFIG, BOOKING_RECIPIENT } from '../config/business';

export const Contact = () => {
  return (
    <section id="contact" className="py-14 sm:py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="CONTACT & INFORMATIONS"
          title="Joindre Freedom Taxi"
          subtitle="Une question, une course immédiate ou une demande de réservation ? Appelez-nous : c'est le plus rapide."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Bloc 1: Téléphone */}
          <div className="bg-surface-light rounded-3xl p-8 border border-slate-200/80 flex flex-col justify-between hover:shadow-card-soft transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gold-400 text-navy-950 flex items-center justify-center font-bold">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy-900">Appel direct</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Le moyen le plus rapide pour commander une course immédiate ou confirmer une heure de départ.
              </p>

              <div className="space-y-2 pt-1">
                {BUSINESS_CONFIG.phones.map((phone, idx) => (
                  <a
                    key={phone.raw}
                    href={`tel:${phone.raw}`}
                    aria-label={`Appeler Freedom Taxi au ${phone.label}`}
                    className="block text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight hover:text-gold-600 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                      {phone.label}
                    </span>
                    {idx === 1 && (
                      <span className="block text-xs font-medium text-slate-500 mt-1 pl-6">
                        Ligne secondaire
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
            <div className="pt-6 space-y-2.5">
              {BUSINESS_CONFIG.phones.map((phone) => (
                <Button
                  key={phone.raw}
                  href={`tel:${phone.raw}`}
                  variant={phone.raw === BUSINESS_CONFIG.phoneRaw ? 'primary-blue' : 'outline-navy'}
                  size="md"
                  icon={Phone}
                  ariaLabel={`Appeler Freedom Taxi au ${phone.label}`}
                  className={`w-full text-center ${phone.raw !== BUSINESS_CONFIG.phoneRaw ? '!text-navy-900 !border-slate-300 hover:!bg-slate-100' : ''}`}
                >
                  Appeler {phone.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Bloc 2: Coordonnées & Horaires */}
          <div className="bg-surface-light rounded-3xl p-8 border border-slate-200/80 flex flex-col justify-between hover:shadow-card-soft transition-all">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-navy-900 text-gold-400 flex items-center justify-center font-bold">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy-900">Zone d'intervention</h3>

              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brandBlue-600 mt-1 flex-shrink-0" />
                  <span>
                    <strong className="text-navy-900">Zone desservie :</strong><br />
                    {BUSINESS_CONFIG.area}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-brandBlue-600 mt-1 flex-shrink-0" />
                  <span>
                    <strong className="text-navy-900">Disponibilité :</strong><br />
                    {BUSINESS_CONFIG.availability}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-brandBlue-600 mt-1 flex-shrink-0" />
                  <span>
                    <strong className="text-navy-900">Réservation en ligne :</strong><br />
                    <span className="break-all">{BOOKING_RECIPIENT}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200/60 mt-6">
              <p className="text-xs text-slate-500">
                Prise en charge à domicile, en gare, aéroport ou établissement de santé.
              </p>
            </div>
          </div>

          {/* Bloc 3: Modes de paiement & Reassurance */}
          <div className="bg-surface-light rounded-3xl p-8 border border-slate-200/80 flex flex-col justify-between hover:shadow-card-soft transition-all">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-brandBlue-700 text-white flex items-center justify-center font-bold">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy-900">Nos prestations</h3>

              <ul className="space-y-2.5 text-sm text-slate-600">
                {BUSINESS_CONFIG.serviceList.map((service) => (
                  <li key={service} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0"></span>
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-slate-200/60 mt-6 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gold-500 flex-shrink-0" />
              <a href="#reservation" className="text-xs text-slate-600 font-semibold hover:text-navy-900 transition-colors">
                Réserver en ligne
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
