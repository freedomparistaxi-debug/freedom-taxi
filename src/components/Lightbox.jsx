import React, { useCallback, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Visionneuse plein ecran (lightbox) pour la galerie vehicule.
 *
 * - Fermeture : bouton, clic sur le fond, touche Echap
 * - Navigation clavier : fleches gauche / droite
 * - Defilement de la page bloque pendant l'ouverture
 */
export const Lightbox = ({ photos, index, onClose, onNavigate }) => {
  const closeButtonRef = useRef(null);

  const total = photos.length;
  const photo = photos[index];
  const hasSeveral = total > 1;

  const goPrevious = useCallback(() => {
    if (!hasSeveral) return;
    onNavigate((index - 1 + total) % total);
  }, [hasSeveral, index, onNavigate, total]);

  const goNext = useCallback(() => {
    if (!hasSeveral) return;
    onNavigate((index + 1) % total);
  }, [hasSeveral, index, onNavigate, total]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, goNext, goPrevious]);

  // Blocage du defilement de l'arriere-plan + focus sur le bouton de fermeture.
  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      className="fixed inset-0 z-[100] flex flex-col bg-navy-950/95 backdrop-blur-md animate-[fadeIn_.2s_ease-out]"
      onClick={onClose}
    >
      {/* Barre superieure : legende + compteur */}
      <div
        className="flex items-start justify-between gap-4 px-4 sm:px-8 py-4 sm:py-6 shrink-0"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.2em] text-gold-400 font-semibold">
            Notre vehicule
          </p>
          <p className="text-sm sm:text-base text-white font-semibold truncate">
            {photo.caption ?? photo.alt}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {hasSeveral && (
            <span className="text-xs sm:text-sm text-slate-300 font-semibold tabular-nums bg-white/10 border border-white/15 rounded-full px-3 py-1.5">
              {index + 1} / {total}
            </span>
          )}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Fermer la visionneuse"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Zone image */}
      <div
        className="flex-1 min-h-0 flex items-center justify-center px-3 sm:px-16 pb-4"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl ring-1 ring-white/10"
        />
      </div>

      {/* Navigation */}
      {hasSeveral && (
        <div
          className="flex items-center justify-center gap-4 py-5 shrink-0"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={goPrevious}
            aria-label="Photo precedente"
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {photos.map((item, itemIndex) => (
              <button
                key={item.src}
                type="button"
                onClick={() => onNavigate(itemIndex)}
                aria-label={`Afficher la photo ${itemIndex + 1}`}
                aria-current={itemIndex === index}
                className={`h-2 rounded-full transition-all ${
                  itemIndex === index
                    ? 'w-7 bg-gold-400'
                    : 'w-2 bg-white/35 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label="Photo suivante"
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Lightbox;
