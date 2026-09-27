import React from 'react';

/**
 * Bouton universel accessible Freedom Taxi
 * Variantes : 'primary-blue', 'primary-navy', 'primary-gold', 'outline-light',
 *             'outline-navy', 'ghost'
 *
 * Toutes les variantes sont pensees pour rester lisibles sur fond clair :
 * le site est désormais blanc et gris tres clair, donc on ne pose plus de
 * texte blanc sur un fond sombre « au pif ».
 */
export const Button = ({
  children,
  variant = 'primary-blue',
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
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none select-none";

  const sizeStyles = {
    sm: "px-4 py-2 text-[13px] gap-2",
    md: "px-6 py-3 text-sm gap-2",
    lg: "px-7 py-3.5 text-[15px] gap-2.5",
  };

  const variants = {
    // Bleu de marque : action principale, sur fond clair.
    'primary-blue': "bg-brand-600 text-white hover:bg-brand-700 shadow-sm hover:shadow-glow-blue focus-visible:ring-brand-600 focus-visible:ring-offset-white",

    // Bleu profond : action secondaire, plus institutionnel.
    'primary-navy': "bg-navy-900 text-white hover:bg-navy-800 shadow-sm focus-visible:ring-navy-900 focus-visible:ring-offset-white",

    // Or : accent unique, reserve a un element mis en avant parmis les boutons.
    'primary-gold': "bg-gold-400 text-ink-900 hover:bg-gold-300 shadow-sm hover:shadow-glow-gold focus-visible:ring-gold-500 focus-visible:ring-offset-white",

    // Contour fin, sur fond clair.
    'outline-navy': "bg-white text-navy-900 border border-slate-300 hover:border-brand-400 hover:text-brand-700 hover:bg-brand-50 focus-visible:ring-brand-500 focus-visible:ring-offset-white",

    // Contour fin, a poser sur une image ou un fond sombre.
    'outline-light': "bg-white/10 backdrop-blur-sm text-white border border-white/40 hover:bg-white hover:text-navy-900 focus-visible:ring-white focus-visible:ring-offset-transparent",

    'outline-gold': "bg-transparent text-gold-500 border border-gold-500/50 hover:border-gold-500 hover:bg-gold-400/10 focus-visible:ring-gold-500 focus-visible:ring-offset-white",

    'ghost': "bg-transparent text-ink-700 hover:text-brand-700 hover:bg-brand-50",
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
