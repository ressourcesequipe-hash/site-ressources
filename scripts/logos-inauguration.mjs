/**
 * Logos de la slide « Un territoire qui se mobilise » (/inauguration).
 *
 * Les originaux vivent dans design/logos-sources/partenaires/ (jamais
 * déployés). Ils sont convertis en WebP dans public/logos/inauguration/, à
 * 520 × 300 au plus : assez pour un affichage de 260 × 150 px en Full HD avec
 * marge de netteté. Jamais d'agrandissement, jamais de recoloration : un logo
 * officiel blanc reste blanc et s'affiche sur une tuile sombre (voir la liste
 * `logosPartenaires` dans src/pages/Inauguration.jsx).
 *
 * Usage : node scripts/logos-inauguration.mjs
 */
import sharp from 'sharp';
import { mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'design/logos-sources/partenaires';
const OUT = 'public/logos/inauguration';

const LOGOS = [
  ['logo-mairie-vsg.png', 'vielle-saint-girons'],
  ['Mairie-LINXE.webp', 'linxe'],
  ['logo-mairie de Saint-Michel-Escalus.webp', 'saint-michel-escalus'],
  ['logo Lit et MiXe.jpg', 'lit-et-mixe', true],
  ['Mairie de St Geours de Maremne.jpg', 'saint-geours-de-maremne', true],
  ['Logo-Seignosse.png', 'seignosse'],
  ['LOGO DÉFINITIF VIEUX BOUCAU.png', 'vieux-boucau'],
  ['07-saint-vincent-de-tyrosse-logo-officiel.png', 'saint-vincent-de-tyrosse'],
  ['08-labenne-logo-officiel-blanc.png', 'labenne'],
  ['Leclerc-Soustons-pour-PEG.jpg', 'leclerc-soustons', true],
  ['11-landes-partage-logo-officiel.png', 'landes-partage'],
  ['14-domolandes-logo-officiel.jpg', 'domolandes', true],
  ['logo Agrolandes.png', 'agrolandes'],
  ["LOGO_HORIZONTAL_comptoire de l'éclectroménagé.webp", 'comptoir-electromenager-solidaire'],
];

mkdirSync(OUT, { recursive: true });
// Le 3e champ (true) retire les marges blanches des JPG : le logo lui-même
// n'est pas modifié, il occupe simplement toute la tuile.
for (const [source, nom, rogner] of LOGOS) {
  const sortie = join(OUT, `${nom}.webp`);
  let image = sharp(join(SRC, source));
  if (rogner) image = sharp(await image.trim({ background: '#ffffff', threshold: 30 }).toBuffer());
  await image
    .resize({ width: 520, height: 300, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 92, effort: 6 })
    .toFile(sortie);
  console.log(`${nom.padEnd(36)} ${Math.round(statSync(sortie).size / 1024)} Ko`);
}
