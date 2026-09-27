/**
 * Habillage des plaques d'immatriculation.
 *
 * On ne floute plus les plaques : on REMPLACE leurs caracteres par le nom de la
 * marque, comme sur les plaques advertising des taxis parisiens. Le but est que
 * la plaque se lise comme une vraie plaque photographiee, pas comme une etiquette
 * collee sur la photo.
 *
 * Pour chaque plaque :
 *   1. la couleur du fond est RELEVEE sur la photo (bande haute / bande basse,
 *      ou il n'y a pas de caractere) et reappliquee en degrade, pour que la
 *      plaque prenne la lumiere du clichet au lieu d'etre un aplat ;
 *   2. la plaque est redessinee a sa position et a son angle reels ;
 *   3. le tout passe dans un flou tres leger, bords fondus dans l'image, pour
 *      rester dans le grain de la photo.
 *
 * Les originaux ne sont JAMAIS detruits : ils sont deplaces dans
 * `originals-images/` (hors de public/, donc jamais deploye par Vite ni servi
 * par server/index.js). Le script est idempotent : il repart toujours de ces
 * originaux, donc relancer la commande ne cumule pas les traitements.
 *
 * Apres execution, lancer `npm run images` pour regenerer les derives WebP.
 *
 * Usage : npm run images:plates
 */
import { copyFile, mkdir, readdir, rename, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');
const ORIGINALS_DIR = path.join(ROOT, 'originals-images');

/** Texte affiche a la place du numero d'immatriculation. */
const WORD = 'FREEDOM';

/**
 * Plaques, en pixels de l'image d'origine.
 *
 * x, y, w, h : la plaque EST ellememe, pas une zone de flou. Les quatre coins
 *              ont ete releves sur des zooms 4x a 12x, puis l'angle deduit de
 *              la pente des bords haut et bas.
 * angle      : en degres, horaire positif (comme sharp). Negatif = le cote
 *              droit de la plaque est plus haut que le cote gauche.
 * out        : nom du fichier ecrit dans public/images/. Par defaut, identique
 *              a `file`. On s'en sert pour les images d'originees en PNG :
 *              elles sont ecrites en JPEG (~250 Ko au lieu de ~2,4 Mo), ce qui
 *              divise le poids de dist/ par quatre. Les originaux PNG, eux,
 *              restent intacts dans originals-images/.
 *
 * Le fichier "aéroport.png" porte un accent : le script est donc encode en
 * UTF-8, et `npm run` doit etre lance depuis un shell qui respecte l'encodage.
 */
const PLATES = [
  // photo1.jpeg : plaque avant du Corolla, en forte perspective, puis plaque du
  // vehicule noir gare a gauche, coupee par le bord de l'image.
  { file: 'photo1.jpeg', x: 760, y: 830, w: 61, h: 44, angle: -11.7 },
  { file: 'photo1.jpeg', x: 0, y: 706, w: 39, h: 15, angle: -1.9 },
  { file: 'photo2.jpeg', x: 46, y: 760, w: 79, h: 43, angle: -6.5 },
  { file: 'photo3.jpeg', x: 701, y: 879, w: 100, h: 37, angle: 3.3 },
  { file: 'freedom-taxi-hero.jpeg', x: 1343, y: 638, w: 122, h: 31, angle: -0.6 },
  { file: 'aéroport.png', out: 'aéroport.jpg', x: 310, y: 594, w: 178, h: 46, angle: -0.6 },
  { file: 'hopital-clinique.png', out: 'hopital-clinique.jpg', x: 166, y: 561, w: 166, h: 44, angle: -1.2 },
  { file: 'reservation.png', out: 'reservation.jpg', x: 157, y: 574, w: 175, h: 50, angle: -0.7 },
  { file: 'Paris.png', out: 'Paris.jpg', x: 222, y: 611, w: 179, h: 51, angle: -0.6 },
];

/** Marge de contexte autour de la plaque, pour que le flou ait de la matiere. */
const PAD = 24;

/** Anneau laisse intact, pour que la zone ne commence pas net. */
const EDGE = 1;

/** Longueur du degrade entre l'anneau intact et le flou plein. */
const featherFor = ({ h }) => Math.max(3, Math.min(10, h / 3));

/**
 * Sigma : tres leger. La plaque doit rester nette comme dans la photo, sinon
 * on retombe dans le flou et le mot devient illisible.
 */
const sigmaFor = ({ h }) => Math.min(2, Math.max(1, h / 35));

/** Taille lisible. Le fichier cible peut ne pas encore exister (premiere fois). */
const formatBytes = async (file) => {
  const info = await stat(file).catch(() => null);
  return info ? `${(info.size / 1024).toFixed(0)} Ko` : 'nouveau';
};

/** Sauvegarde les originaux une seule fois, puis on les reutilise comme source. */
async function ensureOriginals() {
  const existing = await readdir(ORIGINALS_DIR).catch(() => null);
  if (existing && existing.length > 0) {
    console.log('Originaux deja sauvegardes dans originals-images/ : reutilises.');
    return;
  }

  await mkdir(ORIGINALS_DIR, { recursive: true });
  const files = [...new Set(PLATES.map((plate) => plate.file))];
  for (const file of files) {
    await copyFile(path.join(IMAGES_DIR, file), path.join(ORIGINALS_DIR, file));
  }
  console.log(`Originaux sauvegardes dans originals-images/ (${files.length} fichiers).`);
}

/**
 * Couleur mediane d'une bande de la plaque. On echantillonne au CENTRE de la
 * plaque, bande par bande horizontale : sur une plaque inclinee, une bande
 * posee en haut ou en bas de la boite sort de la plaque et tombe sur la
 * calandre, ce quiPeint la plaque en noir.
 */
async function sampleBand(source, { x, y, w, h }, ratio) {
  const bandH = Math.max(1, Math.round(h * 0.18));
  const top = Math.round(y + h * ratio - bandH / 2);
  const left = Math.round(x + w * 0.12);
  const width = Math.max(1, Math.round(w * 0.76));

  const { data, info } = await sharp(source)
    .extract({ left, top, width, height: bandH })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { channels } = info;
  const medians = [];
  for (let c = 0; c < 3; c += 1) {
    const values = [];
    for (let i = c; i < data.length; i += channels) values.push(data[i]);
    values.sort((a, b) => a - b);
    medians.push(values[Math.floor(values.length / 2)]);
  }
  return medians;
}

/**
 * Garde-fou : une plaque est claire. Si l'echantillon sort tres sombre, c'est
 * qu'on a preleve a cote, on garde alors un blanc de plaque plausible plutot
 * que de peindre une plaque noire.
 */
const PLAQUE_FLOOR = 120;

const toHex = (rgb) =>
  `#${rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`;

const asPlateColor = (rgb) => {
  const luma = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  return luma < PLAQUE_FLOOR ? [PLAQUE_FLOOR, PLAQUE_FLOOR, PLAQUE_FLOOR - 4] : rgb;
};

/**
 * On dessine le porte-plaque (cadre sombre) en plus de la plaque : sans lui,
 * la photo montre un double contour, et l'ancien cadre noir de la vraie plaque
 * reste visible autour de la nouvelle.
 */
const FRAME = 12;

/** Marge de securite : le cadre dessine doit depasser la vraie plaque. */
const GROW = 3;

/** Boite de dessin, elargie et rognee au cadre de l'image. */
const growBox = ({ x, y, w, h, angle }, meta) => {
  const left = Math.max(0, x - GROW);
  const top = Math.max(0, y - GROW);
  return {
    x: left,
    y: top,
    w: Math.min(meta.width, x + w + GROW) - left,
    h: Math.min(meta.height, y + h + GROW) - top,
    angle,
  };
};

/**
 * Dessine la plaque. Le SVG est rendu a la taille NON inclinee, puis tourne
 * par sharp : la taille de l'artwork est calculee pour qu'une fois tournee elle
 * tombe pile dans la boite mesuree sur la photo.
 */
async function plateLayer(source, plate, meta) {
  // La couleur est relevee dans la plaque d'origine, avant elargissement : les
  // bandes echantillonnees ne doivent pas tomber sur le cadre sombre.
  const top = toHex(asPlateColor(await sampleBand(source, plate, 0.32)));
  const bottom = toHex(asPlateColor(await sampleBand(source, plate, 0.68)));

  const box = growBox(plate, meta);
  const { w, h, angle } = box;
  const rad = (Math.abs(angle) * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));

  // sharp.rotate() NE DEGONDE PAS le canevas : il rogne. On rend donc la plaque
  // sur un canevas deja dimensionne pour sa boite de rotation, sinon les angles
  // de la plaque (et les bandes bleues) sont coupes.
  const artW = w;
  const artH = h;
  const canvasW = Math.max(8, artW * cos + artH * sin);
  const canvasH = Math.max(8, artW * sin + artH * cos);
  const dx = (canvasW - artW) / 2;
  const dy = (canvasH - artH) / 2;

  // Bandes bleues aux proportions d'une plaque francaise : 11 % a gauche,
  // 10 % a droite, les caracteres occupent le reste.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasW}" height="${canvasH}" viewBox="0 0 ${canvasW} ${canvasH}">
  <defs>
    <linearGradient id="fond" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${top}"/>
      <stop offset="1" stop-color="${bottom}"/>
    </linearGradient>
  </defs>
  <g transform="translate(${dx} ${dy}) scale(${artW / 552} ${artH / 134})">
    <rect x="-${FRAME}" y="-12" width="552" height="134" rx="13" fill="#2c2c2a"/>
    <rect x="0" y="0" width="520" height="110" rx="5" fill="url(#fond)"/>
    <rect x="0" y="0" width="58" height="110" fill="#123a8f"/>
    <rect x="470" y="0" width="50" height="110" fill="#123a8f"/>
    <text x="29" y="86" font-family="Bahnschrift" font-weight="bold" font-size="44" fill="#e8ecf6" text-anchor="middle">F</text>
    <text x="495" y="66" font-family="Bahnschrift" font-weight="bold" font-size="30" fill="#e8ecf6" text-anchor="middle">75</text>
    <text x="264" y="87" font-family="Bahnschrift" font-weight="bold" font-size="80" fill="#101010"
          text-anchor="middle" textLength="372" lengthAdjust="spacing">${WORD}</text>
  </g>
</svg>`;

  const rotated = await sharp(Buffer.from(svg)).rotate(angle).png().toBuffer();
  const { info } = await sharp(rotated).raw().toBuffer({ resolveWithObject: true });
  return {
    input: rotated,
    left: Math.round(box.x + w / 2 - info.width / 2),
    top: Math.round(box.y + h / 2 - info.height / 2),
  };
}


/**
 * Traite une image en UNE seule passe : toutes ses plaques sont composees sur
 * le meme original. C'est indispensable, sinon la deuxieme plaque ecrase la
 * premiere (les deux ecritures repartent de l'original).
 */
async function processFile(source, target, regions) {
  const meta = await sharp(source).metadata();

  const layers = [];
  for (const region of regions) layers.push(await plateLayer(source, region, meta));

  const base = await sharp(source).composite(layers).removeAlpha().png().toBuffer();

  const boxes = regions.map((r) => growBox(r, meta));

  // Une seule zone de travail, union des plaques et de leur marge.
  const area = {
    left: Math.max(0, Math.min(...boxes.map((b) => b.x)) - PAD),
    top: Math.max(0, Math.min(...boxes.map((b) => b.y)) - PAD),
  };
  area.width = Math.min(meta.width, Math.max(...boxes.map((b) => b.x + b.w)) + PAD) - area.left;
  area.height = Math.min(meta.height, Math.max(...boxes.map((b) => b.y + b.h)) + PAD) - area.top;

  const { data: original, info } = await sharp(base).extract(area).raw().toBuffer({ resolveWithObject: true });
  const { channels } = info;

  // Un flou par sigma distinct, mis en cache : deux plaques de tailles
  // differentes n'entrainent pas deux flous de 4 Mo.
  const blurred = new Map();
  const blurredFor = async (sigma) => {
    if (!blurred.has(sigma)) {
      blurred.set(sigma, await sharp(base).extract(area).blur(sigma).raw().toBuffer());
    }
    return blurred.get(sigma);
  };

  const composites = [];
  for (const region of boxes) {
    const { x, y, w, h } = region;
    const feather = featherFor(region);
    const blur = await blurredFor(sigmaFor(region));
    const patch = Buffer.alloc(w * h * channels);

    for (let row = 0; row < h; row += 1) {
      for (let col = 0; col < w; col += 1) {
        // Distance au bord de la zone : 0 sur la tranche, puis rampe jusqu'a 1,
        // en smoothstep pour que la transition ne se voie pas.
        const t = Math.min(1, Math.max(0, (Math.min(col, row, w - 1 - col, h - 1 - row) - EDGE) / feather));
        const k = t * t * (3 - 2 * t);
        const at = ((y + row - area.top) * area.width + (x + col - area.left)) * channels;
        for (let c = 0; c < channels; c += 1) {
          const o = original[at + c];
          patch[row * w * channels + col * channels + c] = Math.round(o + (blur[at + c] - o) * k);
        }
      }
    }

    composites.push({ input: patch, raw: { width: w, height: h, channels }, left: x, top: y });
  }

  const isPng = path.extname(target).toLowerCase() === '.png';
  const tmp = `${target}.tmp`;
  const out = sharp(base).composite(composites);
  // Le format doit etre impose : le fichier temporaire n'a pas d'extension
  // exploitable, sharp se rabattrait sinon sur le format PNG de l'intermediaire
  // et les JPEG passeraient de 290 Ko a 2 Mo.
  await (isPng ? out.png({ compressionLevel: 9 }) : out.jpeg({ quality: 90 })).toFile(tmp);

  await rename(tmp, target);
}

async function main() {
  await ensureOriginals();

  // La source est TOUJOURS l'original de originals-images/ ; la cible peut
  // avoir un autre nom (et donc un autre format) : c'est ainsi que les PNG
  // d'origine sont publies en JPEG, sans jamais toucher a l'original.
  const byOut = new Map();
  for (const plate of PLATES) {
    const out = plate.out || plate.file;
    if (!byOut.has(out)) byOut.set(out, { source: plate.file, regions: [] });
    byOut.get(out).regions.push(plate);
  }

  for (const [out, { source, regions }] of byOut) {
    const target = path.join(IMAGES_DIR, out);
    const before = await formatBytes(target);

    await processFile(path.join(ORIGINALS_DIR, source), target, regions);
    const after = await formatBytes(target);

    const detail = regions.map((r) => `(${r.x},${r.y},${r.w}x${r.h} @${r.angle}deg)`).join(' + ');
    console.log(`${out.padEnd(24)} ${before} -> ${after}   ${detail}`);
  }

  console.log(`\n${PLATES.length} plaques « ${WORD} » sur ${byOut.size} images.`);
  console.log('Lancer `npm run images` pour regenerer les derives WebP.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
