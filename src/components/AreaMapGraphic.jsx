import React from 'react';
import { Compass } from 'lucide-react';

export const AreaMapGraphic = () => {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-navy-900 to-[#050D18] border border-white/10 p-6 sm:p-8 shadow-2xl">
      <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400">
          <Compass className="w-4 h-4 text-gold-400" />
          <span>Cartographie d'action</span>
        </div>
        <div className="text-xs font-semibold text-gold-400 bg-gold-400/10 px-3 py-1 rounded-full border border-gold-400/30">
          Paris • Seine-Saint-Denis • 93 / 75
        </div>
      </div>

      <div className="relative aspect-[16/10] w-full rounded-2xl bg-navy-950/80 border border-white/5 flex items-center justify-center p-4">
        <svg className="w-full h-full opacity-75" viewBox="0 0 400 250" fill="none">
          <circle cx="200" cy="125" r="35" stroke="#1D67B1" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="200" cy="125" r="75" stroke="#1D67B1" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
          <circle cx="200" cy="125" r="115" stroke="#1D67B1" strokeWidth="0.8" strokeDasharray="5 5" opacity="0.4" />
          
          <line x1="200" y1="10" x2="200" y2="240" stroke="#1D304A" strokeWidth="1" />
          <line x1="50" y1="125" x2="350" y2="125" stroke="#1D304A" strokeWidth="1" />

          {/* Zone centrale : Paris */}
          <circle cx="200" cy="125" r="8" fill="#E8C96A" />
          <circle cx="200" cy="125" r="16" stroke="#E8C96A" strokeWidth="1" opacity="0.4" />
          
          {/* Points repères */}
          <circle cx="200" cy="65" r="5" fill="#FFFFFF" />
          <text x="200" y="55" fill="#E2E8F0" fontSize="11" fontWeight="bold" textAnchor="middle">Paris</text>

          <circle cx="170" cy="170" r="4.5" fill="#38BDF8" />
          <text x="170" y="188" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle">Aéroport Orly (ORY)</text>

          <circle cx="250" cy="100" r="4" fill="#94A3B8" />
          <text x="252" y="98" fill="#94A3B8" fontSize="9.5" textAnchor="start">Seine-Saint-Denis</text>

          <circle cx="270" cy="35" r="4.5" fill="#38BDF8" />
          <text x="270" y="27" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle">CDG Roissy</text>

          <text x="200" y="146" fill="#E8C96A" fontSize="11" fontWeight="extrabold" textAnchor="middle">
            PARIS / SEINE-SAINT-DENIS
          </text>
        </svg>

        <div className="absolute bottom-3 right-3 bg-navy-900/90 border border-white/10 px-2.5 py-1 rounded text-[11px] text-slate-300">
          Prise en charge rapide
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>Intervention Paris &amp; Seine-Saint-Denis</span>
        <span className="text-gold-400">Disponibilité immédiate</span>
      </div>
    </div>
  );
};
