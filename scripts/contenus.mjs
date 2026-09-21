/**
 * Exporte le contenu publié du back-office vers le site — Phase 3 du §36.
 *
 * Le site est prérendu : il n'interroge aucune base à l'exécution. Le contenu
 * doit donc être figé au moment du build, exactement comme le catalogue de la
 * boutique l'est déjà par `scripts/vitrine.mjs`. Ce script suit le même
 * principe, et pour les mêmes raisons.
 *
 * DEUX RÈGLES, héritées de vitrine.mjs :
 *
 *   1. Une base injoignable ne fait jamais échouer un build. Le fichier
 *      précédent est conservé et le site se reconstruit avec le contenu de la
 *      veille. Une panne de base ne doit pas pouvoir mettre le site hors
 *      ligne.
 *
 *   2. Un contenu vide n'écrase jamais un contenu existant. Une base joignable
 *      mais vide — mauvaise branche, migration en cours — produirait sinon un
 *      site sans aucun article, et le mal serait fait au déploiement suivant.
 *
 * Le fichier produit est committé : c'est lui qui sert de repli, et il permet
 * de construire le site sans accès à la base.
 *
 * Usage : node scripts/contenus.mjs   (appelé par `npm run build`)
 */

import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const RACINE = path.join(__dirname, '..')
const CIBLE = path.join(RACINE, 'src', 'data', 'cms.json')

// Le fichier .env.local n'existe pas sur Vercel, où les variables sont
// fournies par la plateforme. Il est lu ici pour que `npm run build` marche
// à l'identique en local.
const fichierEnv = path.join(RACINE, '.env.local')
if (fs.existsSync(fichierEnv)) {
  // Découpage sur /\r?\n/ et non sur '\n' : en CRLF le \r resterait en fin de
  // ligne, et `.` ne matche pas \r en JavaScript — la ligne ne correspondrait
  // alors jamais, sans le moindre message. Constaté le 21/09/2026.
  for (const ligne of fs.readFileSync(fichierEnv, 'utf-8').split(/\r?\n/)) {
    const m = ligne.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
  }
}

function conserverExistant(raison) {
  console.warn(`[contenus] ${raison}`)
  if (fs.existsSync(CIBLE)) {
    console.warn('[contenus] Le build continue avec le contenu précédent.')
  } else {
    console.warn('[contenus] Aucun contenu précédent : écriture d\'un fichier vide.')
    // Même forme que le fichier nominal, les deux blocs de partenaires
    // compris : un repli d'une autre forme ferait échouer les pages au moment
    // précis où l'on cherche à les protéger.
    fs.writeFileSync(
      CIBLE,
      JSON.stringify({ maj: null, actualites: [], organisations: { confirmes: [], cooperations: [] } }, null, 2) + '\n'
    )
  }
  process.exit(0)
}

if (!process.env.DATABASE_URL) {
  conserverExistant('DATABASE_URL absente.')
}

const { db } = await import('../lib/db.js')
const { actualite, organisation } = await import('../db/schema.js')
const { STATUTS_EN_LIGNE } = await import('../lib/contenus.js')
const { inArray, asc, desc } = await import('drizzle-orm')

// Le libellé de date (« Septembre 2026 ») était saisi à la main à côté de la
// date elle-même, et pouvait donc la contredire. Il se déduit.
function libelleDate(valeur) {
  if (!valeur) return ''
  const t = new Date(valeur).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  return t.charAt(0).toUpperCase() + t.slice(1)
}

// Le site attend les articles sous la forme qu'il a toujours connue. La
// traduction est faite ici, en un seul endroit : les pages n'ont pas à savoir
// que le contenu vient désormais d'une base.
function versArticlePublic(a) {
  return {
    slug: a.slug,
    title: a.titre,
    excerpt: a.resume ?? '',
    category: a.categorie ?? '',
    date: a.datePublication ? new Date(a.datePublication).toISOString().slice(0, 10) : '',
    dateLabel: libelleDate(a.datePublication),
    readingTime: `${a.tempsLectureMinutes ?? 1} min`,
    featured: Boolean(a.miseEnAvant),
    image: a.image ?? undefined,
    imageAlt: a.imageAlt ?? undefined,
    imageCredit: a.imageCredit ?? undefined,
    imageWidth: a.imageLargeur ?? undefined,
    imageHeight: a.imageHauteur ?? undefined,
    imageFit: a.imageCadrage ?? undefined,
    imagePosition: a.imagePosition ?? undefined,
    externalLink: a.lienExterne ?? undefined,
    content: a.contenu ?? [],
  }
}

// Le site présente les partenaires en deux blocs : ce qui est formalisé, et
// ce qui ne l'est pas encore. La distinction se déduit du suivi interne, si
// bien que faire passer une structure d'un bloc à l'autre revient à mettre
// son statut à jour — et non à la déplacer à la main dans un fichier.
const STATUTS_FORMALISES = ['formalisation', 'actif', 'convention_signee']

function versOrganisationPublique(o) {
  return {
    nom: o.nom,
    label: o.libellePublic ?? '',
    categorie: o.categorieAffichage ?? '',
    logo: o.logo ?? null,
    logoAlt: o.logoAlt ?? null,
    desc: o.descriptionCourte ?? '',
    lien: o.siteInternet ?? null,
  }
}

let actualites = []
let organisations = []

try {
  const [lignesA, lignesO] = await Promise.all([
    db.select().from(actualite)
      .where(inArray(actualite.statut, STATUTS_EN_LIGNE))
      .orderBy(desc(actualite.datePublication)),
    db.select().from(organisation)
      .where(inArray(organisation.statut, STATUTS_EN_LIGNE))
      .orderBy(asc(organisation.ordre), asc(organisation.nom)),
  ])
  actualites = lignesA
  organisations = lignesO
} catch (e) {
  // Drizzle recopie la requête entière, et ses paramètres, dans le message.
  // Un journal de build reste lisible : la première ligne suffit à situer
  // l'erreur, et les valeurs n'y ont rien à faire (§16).
  const bref = String(e.message || e).split(/\bparams:/)[0].split('\n')[0].slice(0, 160)
  conserverExistant(`Base injoignable (${bref}).`)
}

if (actualites.length === 0 && organisations.length === 0) {
  conserverExistant('La base ne contient aucun contenu publié.')
}

const sortie = {
  maj: new Date().toISOString(),
  actualites: actualites.map(versArticlePublic),
  organisations: {
    confirmes: organisations
      .filter((o) => STATUTS_FORMALISES.includes(o.statutPartenariat))
      .map(versOrganisationPublique),
    cooperations: organisations
      .filter((o) => !STATUTS_FORMALISES.includes(o.statutPartenariat))
      .map(versOrganisationPublique),
  },
}

fs.writeFileSync(CIBLE, JSON.stringify(sortie, null, 2) + '\n')
console.log(
  `[contenus] ${sortie.actualites.length} article(s), ` +
    `${sortie.organisations.confirmes.length} partenaire(s) confirmé(s), ` +
    `${sortie.organisations.cooperations.length} coopération(s) en cours.`
)
