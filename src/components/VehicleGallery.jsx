import React, { useState } from 'react';
import { Car, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionTitle } from './SectionTitle';
import { PhotoImage } from './PhotoImage';
import { Lightbox } from './Lightbox';

/**
 * Galerie "Decouvrez notre vehicule".
 *
 * photo1.jpeg / photo2.jpeg / photo3.jpeg : les trois photos reelles de la
 * meme Toyota Corolla. Elles sont toutes en portrait 900x1600, donc un meme
 * ratio 9/16 : une hauteur identique garantit des proportions preservees.
 *
 * - Ordinateur : les 3 photos sur une meme ligne, memes dimensions, espace regulier.
 * - Mobile : defilement horizontal avec accrochage (scroll-snap).
 * - Clic sur une photo : ouverture en grand (Lightbox).
 */
const VEHICLE_PHOTOS = [
  {
    src: '/images/photo1.jpeg',
    width: 900,
    height: 1600,
    alt: 'Freedom Taxi - Toyota Corolla, vue avant trois quarts',
    caption: 'Notre Toyota Corolla - vue avant',
  },
  {
    src: '/images/photo2.jpeg',
    width: 900,
    height: 1600,
    alt: 'Freedom Taxi - Toyota Corolla, vue arriere',
    caption: 'Notre Toyota Corolla - vue arriere',
  },
  {
    src: '/images/photo3.jpeg',
    width: 900,
    height: 1600,
    alt: 'Freedom Taxi - Toyota Corolla de profil',
    caption: 'Notre Toyota Corolla - vue de profil',
  },
];

const HIGHLIGHTS = [
  'Berline Toyota Corolla spacieuse',
  'Climatisation et habitacle non-fumeur',
  'Animaux non acceptes',
  'Bouquin de taxi parisien',
];

export const VehicleGallery = () => {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const closeLightbox = () => setLightboxIndex(null);

  const scrollGallery = (direction) => {
    const track = document.getElementById('ft-vehicle-track');
    if (!track) return;
    track.scrollBy({ left: track.clientWidth * 0.8 * direction, behavior: 'smooth' });
  };

  return (
    <section id="vehicule" className="py-20 lg:py-28 bg-navy-950 text-white relative overflow-hidden">
      {/* Halos decoratifs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-brandBlue-600/20 blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-40 -right-24 w-[26rem] h-[26rem] rounded-full bg-gold-500/10 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle
          badge="NOTRE VEHICULE"
          title="Decouvrez notre Toyota Corolla"
          subtitle="Un vehicule unique, entretenu avec soin et retenu pour son confort, sa discretion et sa tenue de route. Voici quelques vues reelles de notre berline."
          light={true}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-8">
            {/* Aide a la navigation sur mobile */}
            <div className="flex sm:hidden items-center justify-between mb-3">
              <p className="text-xs text-slate-400 font-medium">
                Faites defiler pour voir les 3 photos
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollGallery(-1)}
                  aria-label="Photos precedentes"
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white active:bg-white/20"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollGallery(1)}
                  aria-label="Photos suivantes"
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white active:bg-white/20"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>


            <div
              id="ft-vehicle-track"
              className="ft-no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 flex snap-x snap-mandatory gap-3 sm:gap-4 lg:gap-5 overflow-x-auto sm:grid sm:grid-cols-3 sm:overflow-visible"
            >
              {VEHICLE_PHOTOS.map((photo, index) => (
                <button
                  key={photo.src}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`Agrandir : ${photo.caption}`}
                  className="group relative shrink-0 w-[72vw] max-w-[290px] sm:w-auto sm:max-w-none snap-center
                             aspect-[9/16] overflow-hidden rounded-2xl sm:rounded-3xl
                             border border-white/10 bg-navy-900 shadow-2xl
                             transition duration-300 hover:border-gold-400/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
                >
                  <PhotoImage
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    priority={index === 0}
                    sizes="(min-width: 1024px) 26vw, (min-width: 640px) 30vw, 72vw"
                    className="block h-full w-full"
                    imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Voile degrade + zoom au survol */}
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent opacity-70 group-hover:opacity-95 transition-opacity duration-300"></span>
                  <span className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="text-[11px] sm:text-xs font-semibold text-white/95 drop-shadow text-left">
                      {photo.caption}
                    </span>
                    <span className="w-8 h-8 shrink-0 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300">
                      <ZoomIn className="w-4 h-4" />
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Points forts */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl bg-navy-900/70 border border-white/10 p-7 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-gold-400 text-navy-950 flex items-center justify-center mb-5">
                <Car className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-white mb-4">
                Un vehicule entretenu pour vous
              </h3>

              <ul className="space-y-3 text-sm text-slate-300">
                {HIGHLIGHTS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-2 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 pt-5 border-t border-white/10 text-xs text-slate-400 leading-relaxed">
                Photos reelles de notre vehicule. Cliquez sur une image pour la voir en grand.
              </p>
            </div>
          </div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={VEHICLE_PHOTOS}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  );
};

export default VehicleGallery;
