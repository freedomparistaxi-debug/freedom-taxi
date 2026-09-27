import React from 'react';

/**
 * Image responsive servie en WebP avec repli sur le fichier original.
 *
 * L'original (PNG/JPEG) reste la source de verite : il n'est jamais
 * supprime, il sert simplement de <img> de secours pour les navigateurs
 * qui ne savent pas lire le WebP. Le derive WebP est produit par
 * `npm run images` (voir scripts/optimize-images.mjs).
 */
const toWebp = (src) => src.replace(/\.(png|jpe?g)$/i, '.webp');

export const PhotoImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  imgClassName = '',
  priority = false,
  sizes,
  loading,
  decoding,
  draggable = false,
  ...rest
}) => {
  const loadingAttr = loading ?? (priority ? 'eager' : 'lazy');
  const decodingAttr = decoding ?? (priority ? 'sync' : 'async');

  return (
    <picture className={className}>
      <source srcSet={toWebp(src)} type="image/webp" sizes={sizes} />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loadingAttr}
        decoding={decodingAttr}
        className={imgClassName}
        // React 18 ne gère que l'attribut en minuscules. Passé via {...} pour
        // éviter l'avertissement « React does not recognize the fetchPriority
        // prop » tout en produisant le bon attribut HTML.
        {...{ fetchpriority: priority ? 'high' : undefined }}
        draggable={draggable}
        {...rest}
      />
    </picture>
  );
};

export default PhotoImage;
