/**
 * Optimisation des images de public/images.
 *
 * - AUCUN fichier source n'est renommé, supprimé ni écrasé.
 * - Pour chaque image, on generate un derive WebP (qualite 80) qui sera
 *   servi en premier via <picture>, avec le fichier original en fallback.
 * - Les photos de la galerie "Notre vehicule" sont des portraits 900x1600 :
 *   on conserve les proportions originales.
 *
 * Usage : npm run images
 */
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');

/** Extensions pour lesquelles on genere un derive WebP. */
const EXTENSIONS = new Set(['.png', '.jpeg', '.jpg']);

/** Images produit de la limite : pas de derive, on garde le JPEG d'origine. */
const SKIP = new Set(['freedom-taxi-hero.jpeg']);

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} Ko`;

const formatBytes = async (file) => kb((await stat(file)).size);

async function main() {
  const entries = await readdir(IMAGES_DIR, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => !name.endsWith('.webp'))
    .filter((name) => EXTENSIONS.has(path.extname(name).toLowerCase()))
    .filter((name) => !SKIP.has(name))
    .sort();

  let before = 0;
  let after = 0;

  for (const name of files) {
    const source = path.join(IMAGES_DIR, name);
    const target = path.join(IMAGES_DIR, `${path.parse(name).name}.webp`);

    const sourceBytes = await formatBytes(source);
    const sourceMeta = await sharp(source).metadata();

    await sharp(source)
      .webp({ quality: 80, effort: 6 })
      .toFile(target);

    const targetBytes = await formatBytes(target);
    before += (await stat(source)).size;
    after += (await stat(target)).size;

    console.log(
      `${name.padEnd(26)} ${String(sourceMeta.width).padStart(5)}x${String(
        sourceMeta.height
      ).padEnd(5)} ${sourceBytes.padStart(9)}  ->  ${targetBytes.padStart(9)}`
    );
  }

  console.log(
    `\nTotal servi aux visiteurs : ${kb(before)} -> ${kb(after)} ` +
      `(-${(100 - (after / before) * 100).toFixed(0)} %)`
  );
  console.log('Les fichiers originaux sont conserves intacts comme fallback.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
