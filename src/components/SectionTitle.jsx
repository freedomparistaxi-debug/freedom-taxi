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
    <div className={`mb-10 md:mb-14 ${isCenter ? 'text-center mx-auto max-w-3xl' : 'text-left max-w-2xl'} ${className}`}>
      {/* Sur-titre discret, bleu de marque */}
      {badge && (
        <div className={`inline-flex items-center gap-2.5 mb-3.5 ${isCenter ? 'justify-center' : 'justify-start'}`}>
          <span className="w-5 h-px bg-brand-300"></span>
          <span className="text-[11px] md:text-xs font-bold tracking-[0.2em] text-brand-600 uppercase">
            {badge}
          </span>
        </div>
      )}

      <h2 className={`text-[1.75rem] sm:text-3xl lg:text-[2.125rem] font-bold tracking-tight leading-[1.2] ${light ? 'text-white' : 'text-ink-900'}`}>
        {title}
      </h2>

      {subtitle && (
        <p className={`mt-3.5 text-[15px] sm:text-base leading-relaxed ${light ? 'text-slate-300' : 'text-ink-700'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
