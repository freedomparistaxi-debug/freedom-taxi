import React from 'react';

/**
 * Logo Freedom Taxi reprenant la silhouette fluide et moderne de la référence
 */
export const Logo = ({ className = "h-8", light = true }) => {
  return (
    <a 
      href="#hero" 
      className="inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-lg p-1"
      aria-label="Freedom Taxi - Retour à l'accueil"
    >
      <div className="flex flex-col items-center">
        {/* Silhouette de voiture stylisée dorée / premium */}
        <svg
          viewBox="0 0 160 40"
          className="w-24 sm:w-28 transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ligne de toit épurée */}
          <path
            d="M 10 32 C 40 31, 55 12, 85 10 C 115 8, 135 24, 150 32"
            stroke="#E8C96A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Ligne secondaire dynamique */}
          <path
            d="M 35 28 C 60 18, 90 17, 125 28"
            stroke="#E8C96A"
            strokeWidth="1.2"
            strokeOpacity="0.75"
            strokeLinecap="round"
          />
          {/* Témoin lumineux taxi discret */}
          <rect x="76" y="5" width="14" height="4" rx="1.5" fill="#E8C96A" />
        </svg>

        <div className="flex flex-col items-center -mt-1 tracking-[0.25em]">
          <span className={`text-base sm:text-lg font-extrabold uppercase leading-tight ${light ? 'text-white' : 'text-navy-900'}`}>
            FREEDOM
          </span>
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.45em] text-gold-400 -mr-1">
            TAXI
          </span>
        </div>
      </div>
    </a>
  );
};
