import React from 'react';

/**
 * Bouton universel accessible Freedom Taxi
 * Variantes : 'primary-gold', 'outline-white', 'primary-blue', 'ghost'
 */
export const Button = ({
  children,
  variant = 'primary-gold',
  size = 'md',
  href,
  onClick,
  icon: Icon,
  iconRight: IconRight,
  className = '',
  type = 'button',
  disabled = false,
  ariaLabel,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none select-none";

  const sizeStyles = {
    sm: "px-4 py-2 text-xs gap-2",
    md: "px-6 py-3 text-sm gap-2.5",
    lg: "px-8 py-4 text-base gap-3",
  };

  const variants = {
    // Bouton doré comme sur la maquette "Réserver un taxi"
    'primary-gold': "bg-gold-400 text-navy-950 hover:bg-gold-300 shadow-md hover:shadow-glow-gold focus-visible:ring-gold-400 focus-visible:ring-offset-navy-900 border border-gold-300/40",
    
    // Bouton contour fin, utilisé pour les boutons d'appel sur fond sombre
    'outline-white': "bg-navy-900/40 backdrop-blur-md text-white border border-white/30 hover:border-white hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-navy-900",
    
    // Bouton contour or élégant
    'outline-gold': "bg-transparent text-gold-400 border border-gold-400/50 hover:border-gold-400 hover:bg-gold-400/10 focus-visible:ring-gold-400 focus-visible:ring-offset-navy-900",

    // Bouton bleu signature
    'primary-blue': "bg-brandBlue-500 text-white hover:bg-brandBlue-400 shadow-md hover:shadow-glow-blue focus-visible:ring-brandBlue-500 focus-visible:ring-offset-navy-900",

    // Ghost
    'ghost': "bg-transparent text-slate-300 hover:text-white hover:bg-white/5",
  };

  const combinedClass = `${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={combinedClass}
        aria-label={ariaLabel}
        {...props}
      >
        {Icon && <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />}
        <span>{children}</span>
        {IconRight && <IconRight className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClass}
      aria-label={ariaLabel}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />}
      <span>{children}</span>
      {IconRight && <IconRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />}
    </button>
  );
};
