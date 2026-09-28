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

  /**
   * Barre d'action mobile : masquée tant que l'utilisateur est en haut de page
   * (elle n'y est pas utile et retirerait de l'espace), réapparue dès qu'il
   * commence à défiler, et masquée à nouveau tout en bas de la page pour ne
   * jamais recouvrir la dernière ligne de contenu.
   */
  const [mobileBarVisible, setMobileBarVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const doc = document.documentElement;
      const atBottom = y + window.innerHeight >= doc.scrollHeight - 120;
      setMobileBarVisible(y > 220 && !atBottom);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
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
            ? 'bg-white/95 backdrop-blur-md py-2.5 shadow-nav border-b border-slate-200/80'
            : 'bg-white/80 backdrop-blur-sm py-3.5 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Navigation principale">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-ink-700 hover:text-brand-700 transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:-bottom-0.5 after:left-0 after:w-0 after:h-[2px] after:bg-brand-500 hover:after:w-full after:transition-all after:duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions a droite : appel + reservation */}
          <div className="hidden sm:flex items-center gap-2.5 flex-shrink-0">
            <Button
              href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
              variant="primary-blue"
              size="sm"
              icon={Phone}
              ariaLabel={`Appeler Freedom Taxi au ${BUSINESS_CONFIG.phone}`}
            >
              {BUSINESS_CONFIG.phone}
            </Button>
            <Button href="#reservation" variant="outline-navy" size="sm" icon={Calendar}>
              Réserver
            </Button>
          </div>

          {/* Mobile : appel + menu */}
          <div className="flex items-center gap-2 sm:hidden">
            <a
              href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
              className="p-2.5 text-brand-600 bg-brand-50 border border-brand-200 rounded-full hover:bg-brand-100 transition-colors"
              aria-label={`Appeler Freedom Taxi au ${BUSINESS_CONFIG.phone}`}
            >
              <Phone className="w-[18px] h-[18px]" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-ink-700 hover:text-brand-700 bg-white border border-slate-200 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              aria-expanded={mobileMenuOpen}
              aria-controls="menu-mobile"
              aria-label={mobileMenuOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div
          id="menu-mobile"
          className="fixed inset-0 z-40 bg-white sm:hidden flex flex-col justify-between pt-24 pb-8 px-6 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
        >
          <nav className="flex flex-col" aria-label="Navigation mobile">
            <div className="text-[11px] uppercase tracking-[0.2em] text-brand-600 font-semibold mb-3">
              Menu
            </div>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMobile}
                className="text-lg font-semibold text-ink-900 hover:text-brand-700 py-3.5 border-b border-slate-100 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
              variant="primary-blue"
              size="lg"
              icon={Phone}
              className="w-full"
              ariaLabel={`Appeler Freedom Taxi au ${BUSINESS_CONFIG.phone}`}
            >
              Appeler {BUSINESS_CONFIG.phone}
            </Button>
            <Button
              href="#reservation"
              variant="outline-navy"
              size="lg"
              icon={Calendar}
              onClick={closeMobile}
              className="w-full"
            >
              Réserver en ligne
            </Button>
          </div>
        </div>
      )}

      {/* Barre fixe mobile : deux actions seulement, hauteur contenue.
          Masquée en haut de page et en bas de page, visible pendant le defilement. */}
      <div
        className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/97 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] flex gap-2.5 shadow-[0_-2px_16px_-8px_rgba(21,33,46,0.18)] transition-transform duration-300 ease-out ${
          mobileBarVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        aria-hidden={!mobileBarVisible}
      >
        <a
          href={`tel:${BUSINESS_CONFIG.phoneRaw}`}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full bg-brand-600 text-white font-semibold text-sm active:scale-[0.99] transition-colors hover:bg-brand-700"
          aria-label={`Appeler Freedom Taxi au ${BUSINESS_CONFIG.phone}`}
        >
          <Phone className="w-4 h-4" aria-hidden="true" />
          Appeler
        </a>
        <a
          href="#reservation"
          onClick={closeMobile}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full border border-slate-300 bg-white text-ink-900 font-semibold text-sm active:scale-[0.99] transition-colors hover:border-brand-400 hover:text-brand-700"
        >
          <Calendar className="w-4 h-4" aria-hidden="true" />
          Réserver
        </a>
      </div>
    </>
  );
};
