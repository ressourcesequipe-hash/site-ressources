/**
 * Reprise des images déjà présentes dans le dépôt — §14.
 *
 * La médiathèque ne connaît que ce qu'elle a elle-même reçu. Les photos et
 * logos du site, commités bien avant elle, lui étaient donc invisibles : le
 * sélecteur d'image s'ouvrait sur une grille vide, et il aurait fallu
 * redéposer des fichiers déjà là.
 *
 * Ce que le script NE reprend PAS :
 *   - `public/vitrine/` : régénéré à chaque build par scripts/vitrine.mjs
 *     depuis Ressources 360. Enregistrer ces fichiers créerait des lignes
 *     pointant vers des images qui disparaissent au déploiement suivant ;
 *   - les favicons et images de partage (`og-*`) : habillage du site, pas
 *     du contenu éditorial. Ils se changent dans le code.
 *
 * Tout ce qu'il reprend est marqué `protege` : ces fichiers sont référencés
 * dans du code (src/data/lotsTombola.js, les pages Ateliers) autant qu'en
 * base, et la recherche d'usages ne regarde que la base. Sans ce marqueur,
 * supprimer un logo de la tombola depuis la médiathèque passerait pour une
 * opération sans conséquence.
 *
 * Idempotent : un chemin déjà enregistré est laissé tel quel, jamais
 * réécrit — une description corrigée depuis le back-office survit.
 *
 * Usage : node --env-file=.env.local scripts/importer-medias-existants.mjs [--dry]
 *         (--production pour viser la base de production)
 */

import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { eq, sql } from 'drizzle-orm'
import * as schema from '../db/schema.js'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const RACINE = path.join(__dirname, '..')
const SEC = process.argv.includes('--dry')
const PROD = process.argv.includes('--production')

const chaine = process.env[PROD ? 'DATABASE_URL_PROD' : 'DATABASE_URL']
if (!chaine) {
  console.error(`${PROD ? 'DATABASE_URL_PROD' : 'DATABASE_URL'} absente.`)
  process.exit(1)
}
const db = drizzle(neon(chaine), { schema })

// Dossiers repris, et la catégorie sous laquelle ranger ce qu'ils
// contiennent. Le reste de `public/` est ignoré.
const DOSSIERS = [
  { chemin: 'photos', categorie: 'actualites' },
  { chemin: 'logos', categorie: 'partenaires' },
  { chemin: 'lots', categorie: 'evenements' },
]

const EXTENSIONS = /\.(webp|jpg|jpeg|png|svg)$/i

// Un titre lisible depuis le nom de fichier : « logo-mairie-vsg.webp »
// devient « Logo mairie vsg ». Approximatif, mais toujours mieux que « Sans
// titre » — et corrigeable depuis l'écran.
function titreDepuisNom(nom) {
  const base = nom.replace(EXTENSIONS, '').replace(/[-_]+/g, ' ').trim()
  return base.charAt(0).toUpperCase() + base.slice(1)
}

// Le texte alternatif et le crédit existent déjà, dans les contenus qui
// référencent l'image. Les recopier vaut mieux que de créer des entrées
// vides que personne ne remplira ensuite.
async function metadonneesConnues(cheminPublic) {
  const sources = [
    { table: schema.actualite, image: 'image', alt: 'imageAlt', credit: 'imageCredit' },
    { table: schema.organisation, image: 'logo', alt: 'logoAlt', credit: null },
  ]
  for (const s of sources) {
    try {
      const [ligne] = await db.select().from(s.table).where(eq(s.table[s.image], cheminPublic))
      if (ligne) {
        return {
          alt: ligne[s.alt] || null,
          credit: s.credit ? ligne[s.credit] || null : null,
        }
      }
    } catch {
      // Une table sans la colonne attendue ne doit pas interrompre la reprise.
    }
  }
  return { alt: null, credit: null }
}

async function auteurParDefaut() {
  const [admin] = await db
    .select({ id: schema.user.id })
    .from(schema.user)
    .where(eq(schema.user.role, 'super_admin'))
  return admin?.id ?? null
}

const auteurId = await auteurParDefaut()
const branche = await db
  .execute(sql`select current_setting('neon.branch_id', true) as b`)
  .then((r) => (r.rows ?? r)[0]?.b ?? '(inconnue)')
  .catch(() => '(inconnue)')

console.log(`\nCible   : ${PROD ? 'PRODUCTION' : 'développement'}`)
console.log(`Branche : ${branche}`)
console.log(SEC ? 'Mode    : simulation, rien ne sera écrit\n' : 'Mode    : écriture\n')

let crees = 0
let ignores = 0
let absents = 0

for (const dossier of DOSSIERS) {
  const repertoire = path.join(RACINE, 'public', dossier.chemin)
  if (!fs.existsSync(repertoire)) { absents++; continue }

  const fichiers = fs.readdirSync(repertoire).filter((f) => EXTENSIONS.test(f)).sort()
  console.log(`${dossier.chemin}/ — ${fichiers.length} fichier(s)`)

  for (const nom of fichiers) {
    const cheminPublic = `/${dossier.chemin}/${nom}`
    const [existant] = await db
      .select({ id: schema.media.id })
      .from(schema.media)
      .where(eq(schema.media.chemin, cheminPublic))
    if (existant) { ignores++; continue }

    const { alt, credit } = await metadonneesConnues(cheminPublic)
    const ligne = {
      chemin: cheminPublic,
      titre: titreDepuisNom(nom),
      alt,
      credit,
      categorie: dossier.categorie,
      protege: true,
      utilisateurId: auteurId,
      // Pas de SHA GitHub : ces fichiers n'ont pas été écrits par la
      // médiathèque. Il sera lu à la demande si une suppression devient
      // possible un jour (voir api/admin/medias.js).
      shaGithub: null,
    }

    if (SEC) {
      console.log(`  [à créer] ${cheminPublic}${alt ? ' — description reprise' : ' — SANS description'}`)
    } else {
      await db.insert(schema.media).values(ligne)
    }
    crees++
  }
}

console.log(`\n${crees} média(s) ${SEC ? 'à créer' : 'créé(s)'}, ${ignores} déjà présent(s).`)
if (absents) console.log(`${absents} dossier(s) introuvable(s), ignoré(s).`)
console.log('Tous sont marqués « protégé » : ils peuvent être référencés dans du code.')
