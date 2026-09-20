// Actualités — §9 et §22 du cahier des charges.
//
// Un seul fichier plutôt que `actualites/index.js` + `actualites/[id].js` :
// on a constaté en production le 20/09/2026 que Vercel ne résout pas les
// routes dynamiques de `api/` comme la documentation le laisse croire (une
// route « catch-all » n'y couvrait qu'un seul segment). Les fonctions à
// chemin concret, elles, fonctionnent sans surprise. L'identifiant passe
// donc par la requête, pas par le chemin.
//
// Toutes les vérifications de droits sont faites ici, côté serveur, jamais
// seulement en masquant un bouton dans l'interface (§24.3).

import { and, desc, eq, ilike, or } from 'drizzle-orm'
import { auth } from '../../lib/auth.js'
import { fromNodeHeaders } from 'better-auth/node'
import { db } from '../../lib/db.js'
import { actualite, versionContenu, user } from '../../db/schema.js'
import { verifierDroit } from '../../lib/permissions.js'
import { demanderDeploiement } from '../../lib/deploiement.js'
import { CATEGORIES, nettoyerContenu, slugifier, tempsLecture, transitionAutorisee, valider } from '../../lib/actualites.js'

const CHAMPS_MODIFIABLES = [
  'titre', 'resume', 'contenu', 'image', 'imageAlt', 'imageCredit',
  'imageLargeur', 'imageHauteur', 'imageCadrage', 'imagePosition',
  'galerie', 'categorie', 'tags', 'lienExterne', 'miseEnAvant',
  'surAccueil', 'seo', 'datePublication', 'dateDepublication',
]

// Statuts pour lesquels le contenu est (ou devient) visible du public : ce
// sont les seuls qui justifient de reconstruire le site.
const STATUTS_EN_LIGNE = ['publie']

function peutEcrire(role) {
  return verifierDroit(role, 'actualites.gerer') || verifierDroit(role, 'brouillons.creer')
}

async function slugDisponible(base, idAExclure) {
  const racine = base || 'actualite'
  for (let suffixe = 0; suffixe < 50; suffixe++) {
    const candidat = suffixe === 0 ? racine : `${racine}-${suffixe + 1}`
    const [existant] = await db.select({ id: actualite.id }).from(actualite).where(eq(actualite.slug, candidat))
    if (!existant || existant.id === idAExclure) return candidat
  }
  // Repli : un horodatage garantit l'unicité sans boucle infinie.
  return `${racine}-${Date.now()}`
}

function extraire(corps) {
  const donnees = {}
  for (const champ of CHAMPS_MODIFIABLES) {
    if (champ in (corps || {})) donnees[champ] = corps[champ]
  }
  if ('contenu' in donnees) donnees.contenu = nettoyerContenu(donnees.contenu)
  for (const champDate of ['datePublication', 'dateDepublication']) {
    if (donnees[champDate]) donnees[champDate] = new Date(donnees[champDate])
    else if (champDate in donnees) donnees[champDate] = null
  }
  return donnees
}

// Le contenu est déjà enregistré quand on arrive ici. Si le déclenchement du
// déploiement échoue (hook injoignable, variable absente), la publication
// reste valide : renvoyer une erreur ferait croire à un échec alors que le
// contenu est bien publié, et l'utilisateur risquerait de recommencer. On
// signale le fait sans mentir dessus, et l'état réel du déploiement reste
// porté par la machine à états (§5.5, §2 de l'architecture).
async function declencherSansEchouer() {
  try {
    await demanderDeploiement()
    return { deploiementDeclenche: true }
  } catch (e) {
    console.error('[actualites] déclenchement du déploiement impossible :', e.message)
    return { deploiementDeclenche: false, avertissementDeploiement: e.message }
  }
}

async function journaliser(entiteId, utilisateurId, typeModification, contenuPrecedent) {
  await db.insert(versionContenu).values({
    entiteType: 'actualite',
    entiteId,
    utilisateurId,
    typeModification,
    contenuPrecedent,
  })
}

export default async function handler(req, res) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
  if (!session) return res.status(401).json({ error: 'Non authentifié' })
  const utilisateur = session.user

  // ── Lecture ────────────────────────────────────────────────────────────
  // Ouverte à tout compte connecté : le §21 prévoit qu'un profil Lecture
  // seule puisse consulter le back-office.
  if (req.method === 'GET') {
    const { id, statut, categorie, recherche } = req.query || {}

    if (id) {
      const [ligne] = await db.select().from(actualite).where(eq(actualite.id, Number(id)))
      if (!ligne) return res.status(404).json({ error: 'Actualité introuvable' })
      const historique = await db
        .select()
        .from(versionContenu)
        .where(and(eq(versionContenu.entiteType, 'actualite'), eq(versionContenu.entiteId, ligne.id)))
        .orderBy(desc(versionContenu.id))
        .limit(20)
      return res.status(200).json({ actualite: ligne, historique, categories: CATEGORIES })
    }

    const conditions = []
    if (statut) conditions.push(eq(actualite.statut, statut))
    if (categorie) conditions.push(eq(actualite.categorie, categorie))
    if (recherche) {
      const motif = `%${recherche}%`
      conditions.push(or(ilike(actualite.titre, motif), ilike(actualite.resume, motif)))
    }

    const lignes = await db
      .select({
        id: actualite.id,
        slug: actualite.slug,
        titre: actualite.titre,
        resume: actualite.resume,
        categorie: actualite.categorie,
        statut: actualite.statut,
        datePublication: actualite.datePublication,
        miseEnAvant: actualite.miseEnAvant,
        surAccueil: actualite.surAccueil,
        image: actualite.image,
        majLe: actualite.majLe,
        version: actualite.version,
        auteurNom: user.name,
      })
      .from(actualite)
      .leftJoin(user, eq(actualite.auteurId, user.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(actualite.majLe))

    return res.status(200).json({ actualites: lignes, categories: CATEGORIES })
  }

  // ── Création ───────────────────────────────────────────────────────────
  if (req.method === 'POST') {
    if (!peutEcrire(utilisateur.role)) return res.status(403).json({ error: 'Droits insuffisants' })

    const donnees = extraire(req.body)
    const statutVise = req.body?.statut || 'brouillon'

    const transition = transitionAutorisee('brouillon', statutVise, {
      peutPublier: verifierDroit(utilisateur.role, 'actualites.gerer'),
    })
    if (!transition.ok) return res.status(403).json({ error: transition.raison })

    const erreurs = valider(donnees, { statutVise })
    if (erreurs.length) return res.status(400).json({ erreurs })

    const slug = await slugDisponible(slugifier(req.body?.slug || donnees.titre))

    const [creee] = await db
      .insert(actualite)
      .values({
        ...donnees,
        slug,
        statut: statutVise,
        tempsLectureMinutes: tempsLecture(donnees.contenu),
        auteurId: utilisateur.id,
        modifieParId: utilisateur.id,
        datePublication: statutVise === 'publie' && !donnees.datePublication ? new Date() : donnees.datePublication,
      })
      .returning()

    await journaliser(creee.id, utilisateur.id, 'creation', null)
    const deploiement = STATUTS_EN_LIGNE.includes(creee.statut) ? await declencherSansEchouer() : {}

    return res.status(201).json({ actualite: creee, ...deploiement })
  }

  // ── Modification ───────────────────────────────────────────────────────
  if (req.method === 'PUT') {
    if (!peutEcrire(utilisateur.role)) return res.status(403).json({ error: 'Droits insuffisants' })

    const id = Number(req.body?.id)
    if (!id) return res.status(400).json({ error: 'Identifiant manquant' })

    const [avant] = await db.select().from(actualite).where(eq(actualite.id, id))
    if (!avant) return res.status(404).json({ error: 'Actualité introuvable' })

    // Verrou optimiste (§2 de l'architecture) : plutôt qu'écraser en silence
    // le travail d'un collègue, on refuse et on explique.
    const versionEnvoyee = Number(req.body?.version)
    if (versionEnvoyee && versionEnvoyee !== avant.version) {
      const [modificateur] = avant.modifieParId
        ? await db.select({ name: user.name }).from(user).where(eq(user.id, avant.modifieParId))
        : [null]
      return res.status(409).json({
        error: 'conflit',
        message: `Ce contenu a été modifié par ${modificateur?.name || 'quelqu’un d’autre'} entretemps. Rechargez la page pour voir les changements avant de continuer.`,
      })
    }

    const donnees = extraire(req.body)
    const statutVise = req.body?.statut || avant.statut

    const transition = transitionAutorisee(avant.statut, statutVise, {
      peutPublier: verifierDroit(utilisateur.role, 'actualites.gerer'),
    })
    if (!transition.ok) return res.status(403).json({ error: transition.raison })

    const erreurs = valider({ ...avant, ...donnees }, { statutVise })
    if (erreurs.length) return res.status(400).json({ erreurs })

    const slug = req.body?.slug !== undefined && slugifier(req.body.slug) !== avant.slug
      ? await slugDisponible(slugifier(req.body.slug), id)
      : avant.slug

    const [apres] = await db
      .update(actualite)
      .set({
        ...donnees,
        slug,
        statut: statutVise,
        tempsLectureMinutes: tempsLecture('contenu' in donnees ? donnees.contenu : avant.contenu),
        modifieParId: utilisateur.id,
        version: avant.version + 1,
        majLe: new Date(),
        datePublication:
          statutVise === 'publie' && !avant.datePublication && !donnees.datePublication
            ? new Date()
            : 'datePublication' in donnees
              ? donnees.datePublication
              : avant.datePublication,
      })
      .where(eq(actualite.id, id))
      .returning()

    await journaliser(id, utilisateur.id, avant.statut === statutVise ? 'modification' : 'changement_statut', avant)

    // Un déploiement est nécessaire si le contenu est en ligne, ou s'il
    // vient d'en sortir : dans les deux cas le site doit être reconstruit.
    const deploiement =
      STATUTS_EN_LIGNE.includes(apres.statut) || STATUTS_EN_LIGNE.includes(avant.statut)
        ? await declencherSansEchouer()
        : {}

    return res.status(200).json({ actualite: apres, ...deploiement })
  }

  // ── Suppression définitive ─────────────────────────────────────────────
  // §24.7 : réservée aux rôles autorisés. Le chemin normal reste
  // l'archivage, qui conserve le contenu et reste réversible.
  if (req.method === 'DELETE') {
    if (!verifierDroit(utilisateur.role, 'actualites.supprimer')) {
      return res.status(403).json({ error: 'Seules la Coordination et le Super administrateur peuvent supprimer définitivement.' })
    }
    const id = Number(req.query?.id)
    if (!id) return res.status(400).json({ error: 'Identifiant manquant' })

    const [avant] = await db.select().from(actualite).where(eq(actualite.id, id))
    if (!avant) return res.status(404).json({ error: 'Actualité introuvable' })

    await db.delete(actualite).where(eq(actualite.id, id))
    await journaliser(id, utilisateur.id, 'suppression', avant)
    const deploiement = STATUTS_EN_LIGNE.includes(avant.statut) ? await declencherSansEchouer() : {}

    return res.status(200).json({ ok: true, ...deploiement })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
