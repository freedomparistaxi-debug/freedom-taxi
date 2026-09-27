import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, Calendar } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { Logo } from './Logo';
import { Button } from './Button';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Accueil', href: '#hero' },
    { label: 'Nos services', href: '#services' },
    { label: 'Taxi conventionné', href: '#medical' },
    { label: 'Réservation', href: '#reservation' },
    { label: 'À propos', href: '#apropos' },
    { label: 'Contact', href: '#contact' },
  ];

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-navy-950/95 backdrop-blur-md py-3 shadow-lg border-b border-white/10'
            : 'bg-gradient-to-b from-navy-950/90 via-navy-950/60 to-transparent py-5 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Navigation principale">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-200 hover:text-white transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gold-400 hover:after:w-full after:transition-all after:duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action button Call — visible sur desktop ET tablette */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
              variant="outline-white"
              size="sm"
              icon={Phone}
              className="font-semibold tracking-wide border-gold-400/40 text-gold-300 hover:border-gold-400 hover:bg-gold-400/10"
              ariaLabel={`Appeler Freedom Taxi au ${BUSINESS_CONFIG.phone}`}
            >
              {BUSINESS_CONFIG.phone}
            </Button>
          </div>

          {/* Mobile Hamburger toggle */}
          <div className="flex items-center gap-2 sm:hidden">
            <a
              href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
              className="p-2 text-gold-400 bg-navy-800/80 border border-gold-400/30 rounded-full hover:bg-navy-700"
              aria-label="Appeler maintenant"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-white bg-navy-800/80 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-gold-400"
              aria-expanded={mobileMenuOpen}
              aria-label="Ouvrir le menu de navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/95 backdrop-blur-xl sm:hidden flex flex-col justify-between pt-24 pb-8 px-6 transition-all duration-300 animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex flex-col gap-5">
            <div className="text-xs uppercase tracking-widest text-gold-400 font-semibold mb-2">
              Menu Freedom Taxi
            </div>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMobile}
                className="text-xl font-semibold text-white hover:text-gold-400 py-2 border-b border-white/5 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
              variant="primary-gold"
              size="lg"
              icon={Phone}
              className="w-full text-center"
              ariaLabel={`Appeler Freedom Taxi au ${BUSINESS_CONFIG.phone}`}
            >
              Appeler {BUSINESS_CONFIG.phone}
            </Button>
            <a
              href={`tel:${BUSINESS_CONFIG.phones[1].raw}`}
              className="text-center py-3 rounded-full border border-gold-400/40 text-gold-300 font-semibold text-sm hover:border-gold-400 hover:bg-gold-400/10 transition-all"
            >
              ou {BUSINESS_CONFIG.phones[1].label}
            </a>
            <Button
              href="#reservation"
              variant="outline-white"
              size="md"
              onClick={closeMobile}
              className="w-full text-center text-slate-200"
            >
              Réserver en ligne
            </Button>
          </div>
        </div>
      )}

      {/* Barre d'appel permanente sur mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy-950/95 backdrop-blur-md border-t border-gold-400/20 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex gap-3">
        <a
          href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full bg-gold-400 text-navy-950 font-bold text-sm shadow-lg active:scale-[0.98] transition-transform"
          aria-label={`Appeler Freedom Taxi au ${BUSINESS_CONFIG.phone}`}
        >
          <Phone className="w-4 h-4" />
          Appeler maintenant
        </a>
        <a
          href="#reservation"
          onClick={closeMobile}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full border border-white/25 text-white font-semibold text-sm active:scale-[0.98] transition-transform"
        >
          <Calendar className="w-4 h-4" />
          Réserver
        </a>
      </div>
    </>
  );
};
