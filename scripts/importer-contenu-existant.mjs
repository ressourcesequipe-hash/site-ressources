/**
 * Reprise du contenu codé en dur du site dans la base du back-office — §31.
 *
 * S'exécute une fois par base. Idempotent : une entrée déjà présente (même
 * slug) est laissée telle quelle, jamais réécrite. Relancer le script après
 * que l'équipe a corrigé un texte depuis le back-office ne défait donc rien.
 *
 * Ce qu'il NE reprend pas, et pourquoi :
 *   - les ateliers : ils n'existent nulle part comme données, ils sont
 *     rédigés dans six pages JSX au SEO travaillé, qui restent en dur
 *     (décision du 21/09/2026) ;
 *   - l'affiche du 3 octobre (`src/data/evenement.js`) : c'est un fichier
 *     média, pas un événement au sens du §10 ;
 *   - `src/data/carte.js` : du code partagé, pas du contenu.
 *
 * Usage : node --env-file=.env.local scripts/importer-contenu-existant.mjs
 *         (ajouter --dry pour voir ce qui serait créé, sans rien écrire)
 */

import { register } from 'node:module'
import { eq } from 'drizzle-orm'

// `src/data/partenaires.js` importe './defiCollecte' sans extension : Vite le
// résout, Node non. Plutôt que de modifier un fichier qu'on s'apprête à
// remplacer, on apprend à Node à réessayer avec l'extension.
register(
  'data:text/javascript,' +
    encodeURIComponent(`
      export async function resolve(spec, ctx, next) {
        try { return await next(spec, ctx) } catch (e) {
          if (spec.startsWith('.') && !/\\.[a-z]+$/.test(spec)) return next(spec + '.js', ctx)
          throw e
        }
      }`),
  import.meta.url
)

const { db } = await import('../lib/db.js')
const { actualite, organisation, pointCollecte, user } = await import('../db/schema.js')
const { deplierHoraires } = await import('../lib/points-collecte.js')
const { tempsLecture } = await import('../lib/actualites.js')
const { slugifier } = await import('../lib/contenus.js')

const SEC = process.argv.includes('--dry')

// ── Correspondances établies le 21/09/2026 ──────────────────────────────
//
// Le type d'organisation et le suivi interne de la relation n'existaient pas
// dans les données du site : ils se déduisent du nom et du libellé public.
// Ces choix sont éditoriaux, pas techniques — ils sont écrits ici plutôt que
// devinés dans le code, pour qu'on puisse les relire et les corriger.

const ORGANISATIONS = {
  'Réseau ReNAITRe': { type: 'reseau', statutPartenariat: 'actif' },
  SITCOM40: { type: 'etablissement_public', statutPartenariat: 'formalisation' },
  'Mairie de Vielle-Saint-Girons': { type: 'commune', statutPartenariat: 'actif' },
  'CC Côte Landes Nature': { type: 'intercommunalite', statutPartenariat: 'echange_en_cours' },
  'Territoire MACS': { type: 'intercommunalite', statutPartenariat: 'contact_etabli' },
}

// Les logos n'avaient aucun texte alternatif dans les données du site, alors
// que le module l'exige avant publication (§33). Une description générique
// vaut mieux qu'un champ vide : elle dit au moins de quoi il s'agit.
const alt = (nom) => `Logo de ${nom}.`

async function auteurParDefaut() {
  const [admin] = await db.select({ id: user.id }).from(user).where(eq(user.role, 'super_admin'))
  return admin?.id ?? null
}

async function importerActualites(auteurId) {
  const { ARTICLES } = await import('../src/data/articles.js')
  let crees = 0
  let ignores = 0

  for (const a of ARTICLES) {
    const [existant] = await db.select({ id: actualite.id }).from(actualite).where(eq(actualite.slug, a.slug))
    if (existant) { ignores++; continue }

    const ligne = {
      slug: a.slug,
      titre: a.title,
      resume: a.excerpt ?? null,
      contenu: a.content ?? [],
      image: a.image ?? null,
      imageAlt: a.imageAlt ?? null,
      imageCredit: a.imageCredit ?? null,
      imageLargeur: a.imageWidth ?? null,
      imageHauteur: a.imageHeight ?? null,
      imageCadrage: a.imageFit ?? null,
      imagePosition: a.imagePosition ?? null,
      categorie: a.category ?? null,
      lienExterne: a.externalLink ?? null,
      miseEnAvant: Boolean(a.featured),
      statut: 'publie',
      datePublication: a.date ? new Date(a.date) : null,
      tempsLectureMinutes: tempsLecture(a.content),
      auteurId,
    }
    if (SEC) { console.log(`  [à créer] ${ligne.slug} — ${ligne.tempsLectureMinutes} min`); crees++; continue }
    await db.insert(actualite).values(ligne)
    crees++
  }
  return { crees, ignores, total: ARTICLES.length }
}

async function importerOrganisations(auteurId) {
  const src = await import('../src/data/partenaires.js')
  const toutes = [...src.PARTENAIRES_CONFIRMES, ...src.COOPERATIONS_EN_COURS]
  let crees = 0
  let ignores = 0
  const inconnues = []

  for (const [index, o] of toutes.entries()) {
    const correspondance = ORGANISATIONS[o.nom]
    if (!correspondance) { inconnues.push(o.nom); continue }

    const slug = slugifier(o.nom)
    const [existant] = await db.select({ id: organisation.id }).from(organisation).where(eq(organisation.slug, slug))
    if (existant) { ignores++; continue }

    const ligne = {
      slug,
      nom: o.nom,
      type: correspondance.type,
      descriptionCourte: o.desc ?? null,
      siteInternet: o.lien ?? null,
      logo: o.logo ?? null,
      logoAlt: o.logo ? alt(o.nom) : null,
      statutPartenariat: correspondance.statutPartenariat,
      libellePublic: o.label ?? null,
      categorieAffichage: o.categorie ?? null,
      ordre: index,
      statut: 'publie',
      datePublication: new Date(),
      auteurId,
    }
    if (SEC) { console.log(`  [à créer] ${slug} — ${ligne.statutPartenariat} — « ${ligne.libellePublic} »`); crees++; continue }
    await db.insert(organisation).values(ligne)
    crees++
  }
  return { crees, ignores, inconnues, total: toutes.length }
}

// Le site ne distingue que « Point communal » et « Point partenaire » ; le
// back-office veut un type précis. Choix éditoriaux du 29/10/2026.
const TYPES_POINTS = {
  'Imagine — le tiers-lieu': 'association',
  'Landes Partage': 'association',
  'Le Comptoir de l’Électroménager Solidaire': 'association',
  'E.Leclerc': 'commerce',
  'E.Leclerc Express': 'commerce',
  Domolandes: 'entreprise',
  Agrolandes: 'entreprise',
}

async function importerPointsCollecte(auteurId) {
  const { POINTS_ECRITS: POINTS_COLLECTE } = await import('../src/data/defiCollecte.js')
  let crees = 0
  let ignores = 0

  for (const [index, p] of POINTS_COLLECTE.entries()) {
    const slug = slugifier(p.nom)
    const [existant] = await db.select({ id: pointCollecte.id }).from(pointCollecte).where(eq(pointCollecte.slug, slug))
    if (existant) { ignores++; continue }

    const ligne = {
      slug,
      nom: p.nom,
      adresse: p.adresse ?? null,
      commune: p.ville,
      latitude: p.coords ? String(p.coords[0]) : null,
      longitude: p.coords ? String(p.coords[1]) : null,
      // Lève une erreur sur un libellé de jours imprévu : mieux vaut un
      // import arrêté qu'un point affiché sans ses horaires.
      horaires: deplierHoraires(p.horaires),
      consignes: p.note ?? null,
      mention: p.mention ?? null,
      type: p.type === 'Point communal' ? 'mairie' : (TYPES_POINTS[p.nom] ?? 'autre'),
      campagne: 'Défi collecte 2026',
      // Pas de date de fin : les points restent ouverts après le défi.
      visibleCarte: Boolean(p.coords) && !p.mention,
      ordre: index,
      statut: p.statut === 'confirme' ? 'publie' : 'brouillon',
      datePublication: new Date(),
      auteurId,
    }
    if (SEC) { console.log(`  [à créer] ${slug} — ${ligne.type} — ${ligne.horaires.length} créneau(x)`); crees++; continue }
    await db.insert(pointCollecte).values(ligne)
    crees++
  }
  return { crees, ignores, total: POINTS_COLLECTE.length }
}

const auteurId = await auteurParDefaut()
if (!auteurId) {
  console.warn("Aucun compte super administrateur : le contenu sera importé sans auteur.\n")
}

console.log(SEC ? '── Simulation, rien ne sera écrit ──\n' : '── Import ──\n')

console.log('Actualités :')
const art = await importerActualites(auteurId)
console.log(`  ${art.crees} créée(s), ${art.ignores} déjà présente(s), sur ${art.total}.\n`)

console.log('Organisations :')
const org = await importerOrganisations(auteurId)
console.log(`  ${org.crees} créée(s), ${org.ignores} déjà présente(s), sur ${org.total}.`)
if (org.inconnues.length) {
  console.warn(`  NON IMPORTÉES, faute de correspondance : ${org.inconnues.join(', ')}`)
  console.warn('  Ajoutez-les au tableau ORGANISATIONS en haut de ce script.')
}

console.log('\nPoints de collecte :')
const pts = await importerPointsCollecte(auteurId)
console.log(`  ${pts.crees} créé(s), ${pts.ignores} déjà présent(s), sur ${pts.total}.`)

console.log(SEC ? '\nSimulation terminée.' : '\nImport terminé.')
