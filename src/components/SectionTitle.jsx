import React from 'react';

export const SectionTitle = ({
  badge = "FREEDOM TAXI",
  title,
  subtitle,
  align = 'center', // 'center' | 'left'
  light = false,
  className = ''
}) => {
  const isCenter = align === 'center';

  return (
    <div className={`mb-12 md:mb-16 ${isCenter ? 'text-center mx-auto max-w-3xl' : 'text-left max-w-2xl'} ${className}`}>
      {/* Badge fin avec filet doré dans l'esprit de la maquette */}
      {badge && (
        <div className={`inline-flex items-center gap-3 mb-3 ${isCenter ? 'justify-center' : 'justify-start'}`}>
          <span className="w-6 h-[1.5px] bg-gold-400"></span>
          <span className="text-xs md:text-sm font-semibold tracking-[0.25em] text-gold-400 uppercase">
            {badge}
          </span>
          <span className="w-6 h-[1.5px] bg-gold-400"></span>
        </div>
      )}

      {/* Titre principal */}
      <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-navy-900'}`}>
        {title}
      </h2>

      {/* Sous-titre ou court descriptif */}
      {subtitle && (
        <p className={`mt-3 text-base sm:text-lg leading-relaxed ${light ? 'text-slate-300' : 'text-slate-600'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
