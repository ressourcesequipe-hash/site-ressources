/**
 * Optimise les logos servis par le site (marque, partenaires, tombola).
 *
 * Les originaux vivent dans design/logos-sources/ et ne sont jamais deployes :
 * le logo de marque est un master 5000x5000 de 1,7 Mo alors qu'il s'affiche en
 * 80 a 96 px dans le header, et plusieurs logos partenaires depassaient 1 Mo
 * pour un rendu en 48 px. Seules les sorties dans public/logos/ sont servies.
 *
 * Les tailles ciblees correspondent au double du rendu CSS, pour rester nettes
 * sur les ecrans a haute densite :
 *   - header       80 px (mobile) / 96 px (desktop) -> variantes 96 / 192 / 288
 *   - footer       40 px                            -> la variante 96 suffit
 *   - partenaires  max 160x64 px                    -> 320x128
 *   - tombola      48x48 px                         -> 96x96
 *
 * Les logos deja en SVG (logo-sitcom40, maison-lassalle) restent tels quels :
 * ils sont vectoriels et pesent moins que n'importe quelle rasterisation.
 *
 * Usage : node scripts/optimiser-logos.mjs
 * (necessite sharp : npm install --no-save sharp)
 */
import sharp from 'sharp';
import { mkdirSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const SRC = 'design/logos-sources';
const OUT = 'public/logos';

// Le master de marque, decline en plusieurs tailles. Le PNG 192 sert de repli
// pour les rares navigateurs sans WebP ; le 512 est le logo declare dans le
// schema.org Organization.
const MARQUE = [
  { src: 'marque/LOGO_ressources-recyclerie.png', out: 'logo-ressources-96.webp', taille: 96 },
  { src: 'marque/LOGO_ressources-recyclerie.png', out: 'logo-ressources-192.webp', taille: 192 },
  { src: 'marque/LOGO_ressources-recyclerie.png', out: 'logo-ressources-288.webp', taille: 288 },
  { src: 'marque/LOGO_ressources-recyclerie.png', out: 'logo-ressources-192.png', taille: 192 },
  { src: 'marque/LOGO_ressources-recyclerie.png', out: 'logo-ressources-512.png', taille: 512 },
];

// Icones de navigateur : ecrites a la racine de public/, pas dans logos/, car
// index.html les reference au meme titre que le favicon.
//
// L'icone iOS est aplatie sur le beige clair de la charte : iOS ignore le canal
// alpha et composerait le logo sur du noir. Le repli PNG du favicon est
// rasterise depuis favicon.svg et non depuis le master : a 48 px l'arbre du
// logo n'est plus qu'une tache, la lettre du favicon SVG reste lisible.
const ICONES = [
  { src: `${SRC}/marque/LOGO_ressources-recyclerie.png`, out: 'public/apple-touch-icon.png', taille: 180, fond: '#F7F3ED' },
  { src: 'public/favicon.svg', out: 'public/favicon-48.png', taille: 48 },
];

// Dossiers traites en lot : tout raster trouve est converti en WebP de meme nom.
const LOTS = [
  { dossier: 'partenaires', largeur: 320, hauteur: 128 },
  { dossier: 'tombola', largeur: 96, hauteur: 96 },
];

const RASTERS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

let avant = 0;
let apres = 0;
const vus = new Set();

/** Redimensionne sans jamais agrandir, en conservant le rapport d'aspect. */
async function generer(cheminSrc, cheminOut, largeur, hauteur, fond = null) {
  let image = sharp(cheminSrc).resize({
    width: largeur,
    height: hauteur,
    fit: 'inside',
    withoutEnlargement: true,
  });

  if (fond) image = image.flatten({ background: fond });

  const format = extname(cheminOut) === '.webp'
    ? image.webp({ quality: 88, effort: 6 })
    : image.png({ compressionLevel: 9, palette: true });

  await format.toFile(cheminOut);

  // Un meme original decline en plusieurs tailles ne doit compter qu'une fois
  // dans le total "avant", sinon le ratio affiche est fantaisiste.
  if (!vus.has(cheminSrc)) {
    vus.add(cheminSrc);
    avant += statSync(cheminSrc).size;
  }
  const taille = statSync(cheminOut).size;
  apres += taille;
  console.log(`${cheminOut.replace('public/', '').padEnd(36)} ${Math.round(taille / 1024)} Ko`);
}

mkdirSync(OUT, { recursive: true });

console.log('— Marque —');
for (const { src, out, taille } of MARQUE) {
  await generer(join(SRC, src), join(OUT, out), taille, taille);
}

console.log('\n— Icones —');
for (const { src, out, taille, fond } of ICONES) {
  await generer(src, out, taille, taille, fond);
}

for (const { dossier, largeur, hauteur } of LOTS) {
  console.log(`\n— ${dossier} (${largeur}x${hauteur}) —`);
  const fichiers = readdirSync(join(SRC, dossier))
    .filter((f) => RASTERS.has(extname(f).toLowerCase()))
    .sort();

  for (const fichier of fichiers) {
    const sortie = fichier.replace(/\.[^.]+$/, '.webp').toLowerCase();
    await generer(join(SRC, dossier, fichier), join(OUT, sortie), largeur, hauteur);
  }
}

console.log(
  `\nOriginaux ${Math.round(avant / 1024)} Ko  ->  sortie ${Math.round(apres / 1024)} Ko ` +
  `(${(avant / apres).toFixed(1)}x plus leger)`
);
