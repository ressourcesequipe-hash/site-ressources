// Fabrique de gestionnaire HTTP pour un module de contenu.
//
// Les six modules (pages, actualités, événements, ateliers, organisations,
// points de collecte) partagent exactement les mêmes règles : mêmes statuts,
// mêmes transitions selon le rôle, même verrou optimiste, même historique,
// même déclenchement de déploiement. Les écrire six fois reviendrait à
// garantir qu’ils finiraient par diverger — un module où l’on oublierait le
// verrou, un autre où l’historique manquerait.
//
// Ce qui reste propre à chaque module : la table, la liste de ses champs,
// ses contrôles de cohérence et le nom du droit qui le gouverne.
//
// Les règles elles-mêmes (statuts, transitions, slug) vivent dans
// lib/contenus.js, volontairement sans dépendance à la base.

import { and, desc, eq, ilike, or } from 'drizzle-orm'
import { auth } from './auth.js'
import { fromNodeHeaders } from 'better-auth/node'
import { db } from './db.js'
import { versionContenu, user } from '../db/schema.js'
import { verifierDroit } from './permissions.js'
import { demanderDeploiement } from './deploiement.js'
import { STATUTS_EN_LIGNE, slugifier, transitionAutorisee } from './contenus.js'

/**
 * Le contenu est déjà enregistré quand on appelle ceci. Si le déclenchement
 * du déploiement échoue, la publication reste valide : renvoyer une erreur
 * ferait croire à un échec et l'utilisateur recommencerait (§5.5).
 */
async function declencherSansEchouer(nomModule) {
  try {
    await demanderDeploiement()
    return { deploiementDeclenche: true }
  } catch (e) {
    console.error(`[${nomModule}] déclenchement du déploiement impossible :`, e.message)
    return { deploiementDeclenche: false, avertissementDeploiement: e.message }
  }
}

/**
 * Fabrique le gestionnaire HTTP complet d'un module de contenu.
 *
 * Une seule route par module, en fichier concret : Vercel ne résout pas les
 * routes dynamiques de `api/` comme annoncé (constaté en production le
 * 20/09/2026), donc l'identifiant passe par la requête et non par le chemin.
 *
 * @param {object} config
 * @param {object} config.table              table Drizzle du module
 * @param {string} config.entite             nom utilisé dans l'historique
 * @param {string} config.nomPluriel         clé de la liste dans la réponse JSON
 * @param {string[]} config.champs           champs modifiables depuis l'interface
 * @param {string} config.champTitre         champ dont se déduit le slug
 * @param {string} config.droitGerer         droit permettant de publier
 * @param {string} config.droitSupprimer     droit permettant la suppression définitive
 * @param {Function} config.valider          (donnees, {statutVise}) => erreurs[]
 * @param {string[]} [config.champsDate]     champs a convertir en dates
 * @param {Function} [config.preparer]       (donnees, {avant, statutVise}) => champs calculés
 * @param {Function} [config.colonnesListe]  colonnes renvoyées par la liste
 * @param {Function} [config.filtres]        (query, table) => conditions
 * @param {object|Function} [config.reference] données de référence jointes aux réponses ;
 *   une fonction (éventuellement asynchrone) quand elles vivent en base
 * @param {Function} [config.protege]        (ligne) => vrai si le contenu est protégé (§8.4)
 */
export function creerModuleContenu(config) {
  const {
    table, entite, nomPluriel, champs, champsDate = [], champTitre = 'titre',
    droitGerer, droitSupprimer, valider, preparer,
    colonnesListe, filtres, reference = {}, protege = () => false,
  } = config

  const peutEcrire = (role) => verifierDroit(role, droitGerer) || verifierDroit(role, 'brouillons.creer')

  async function slugDisponible(base, idAExclure) {
    const racine = base || entite
    for (let suffixe = 0; suffixe < 50; suffixe++) {
      const candidat = suffixe === 0 ? racine : `${racine}-${suffixe + 1}`
      const [existant] = await db.select({ id: table.id }).from(table).where(eq(table.slug, candidat))
      if (!existant || existant.id === idAExclure) return candidat
    }
    return `${racine}-${Date.now()}`
  }

  function extraire(corps) {
    const donnees = {}
    for (const champ of champs) {
      if (champ in (corps || {})) donnees[champ] = corps[champ]
    }
    // Les dates arrivent en texte depuis le navigateur. La liste est
    // déclarée par le module plutôt que devinée d'après le nom du champ :
    // deviner marcherait jusqu'au jour où un champ s'appellerait autrement.
    for (const champ of champsDate) {
      if (champ in donnees) donnees[champ] = donnees[champ] ? new Date(donnees[champ]) : null
    }
    return donnees
  }

  async function journaliser(entiteId, utilisateurId, typeModification, contenuPrecedent) {
    await db.insert(versionContenu).values({
      entiteType: entite, entiteId, utilisateurId, typeModification, contenuPrecedent,
    })
  }

  const lireReference = async () => (typeof reference === 'function' ? await reference() : reference)

  return async function handler(req, res) {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
    if (!session) return res.status(401).json({ error: 'Non authentifié' })
    const utilisateur = session.user
    const peutPublier = verifierDroit(utilisateur.role, droitGerer)

    // ── Lecture : ouverte à tout compte connecté (§21, Lecture seule) ────
    if (req.method === 'GET') {
      const { id } = req.query || {}

      if (id) {
        const [ligne] = await db.select().from(table).where(eq(table.id, Number(id)))
        if (!ligne) return res.status(404).json({ error: 'Contenu introuvable' })
        const historique = await db
          .select()
          .from(versionContenu)
          .where(and(eq(versionContenu.entiteType, entite), eq(versionContenu.entiteId, ligne.id)))
          .orderBy(desc(versionContenu.id))
          .limit(20)
        return res.status(200).json({ [entite]: ligne, historique, ...(await lireReference()) })
      }

      const conditions = filtres ? filtres(req.query || {}, table) : []
      if (req.query?.statut) conditions.push(eq(table.statut, req.query.statut))
      if (req.query?.recherche) {
        const motif = `%${req.query.recherche}%`
        conditions.push(or(ilike(table[champTitre], motif)))
      }

      const lignes = await db
        .select(colonnesListe ? colonnesListe(table, user) : undefined)
        .from(table)
        .leftJoin(user, eq(table.auteurId, user.id))
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(table.majLe))

      return res.status(200).json({ [nomPluriel]: lignes, ...(await lireReference()) })
    }

    // ── Création ─────────────────────────────────────────────────────────
    if (req.method === 'POST') {
      if (!peutEcrire(utilisateur.role)) return res.status(403).json({ error: 'Droits insuffisants' })

      const donnees = extraire(req.body)
      const statutVise = req.body?.statut || 'brouillon'

      const transition = transitionAutorisee('brouillon', statutVise, {
        peutPublier,
        toujoursAValider: protege(donnees),
      })
      if (!transition.ok) return res.status(403).json({ error: transition.raison })

      const erreurs = valider(donnees, { statutVise })
      if (erreurs.length) return res.status(400).json({ erreurs })

      const slug = await slugDisponible(slugifier(req.body?.slug || donnees[champTitre]))

      const [creee] = await db
        .insert(table)
        .values({
          ...donnees,
          ...(preparer ? await preparer(donnees, { avant: null, statutVise }) : {}),
          slug,
          statut: statutVise,
          auteurId: utilisateur.id,
          modifieParId: utilisateur.id,
        })
        .returning()

      await journaliser(creee.id, utilisateur.id, 'creation', null)
      const deploiement = STATUTS_EN_LIGNE.includes(creee.statut) ? await declencherSansEchouer(entite) : {}
      return res.status(201).json({ [entite]: creee, ...deploiement })
    }

    // ── Modification ─────────────────────────────────────────────────────
    if (req.method === 'PUT') {
      if (!peutEcrire(utilisateur.role)) return res.status(403).json({ error: 'Droits insuffisants' })

      const id = Number(req.body?.id)
      if (!id) return res.status(400).json({ error: 'Identifiant manquant' })

      const [avant] = await db.select().from(table).where(eq(table.id, id))
      if (!avant) return res.status(404).json({ error: 'Contenu introuvable' })

      // §8.4 : une page protégée reste hors de portée de Communication et
      // Contributeur, quel que soit ce qu'ils peuvent publier par ailleurs.
      if (protege(avant) && !verifierDroit(utilisateur.role, 'pages_protegees.modifier')) {
        return res.status(403).json({
          error: "Cette page engage l'association sur le plan juridique. Seules la Coordination et le Super administrateur peuvent la modifier.",
        })
      }

      // Verrou optimiste (§2 de l'architecture) : plutôt qu'écraser en
      // silence le travail d'un collègue, on refuse et on explique.
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
        peutPublier,
        toujoursAValider: protege({ ...avant, ...donnees }),
      })
      if (!transition.ok) return res.status(403).json({ error: transition.raison })

      const erreurs = valider({ ...avant, ...donnees }, { statutVise })
      if (erreurs.length) return res.status(400).json({ erreurs })

      const slug =
        req.body?.slug !== undefined && slugifier(req.body.slug) !== avant.slug
          ? await slugDisponible(slugifier(req.body.slug), id)
          : avant.slug

      const [apres] = await db
        .update(table)
        .set({
          ...donnees,
          ...(preparer ? await preparer(donnees, { avant, statutVise }) : {}),
          slug,
          statut: statutVise,
          modifieParId: utilisateur.id,
          version: avant.version + 1,
          majLe: new Date(),
        })
        .where(eq(table.id, id))
        .returning()

      await journaliser(id, utilisateur.id, avant.statut === statutVise ? 'modification' : 'changement_statut', avant)

      const deploiement =
        STATUTS_EN_LIGNE.includes(apres.statut) || STATUTS_EN_LIGNE.includes(avant.statut)
          ? await declencherSansEchouer(entite)
          : {}

      return res.status(200).json({ [entite]: apres, ...deploiement })
    }

    // ── Suppression définitive (§24.7 : réservée) ────────────────────────
    if (req.method === 'DELETE') {
      if (!verifierDroit(utilisateur.role, droitSupprimer)) {
        return res.status(403).json({
          error: 'Seules la Coordination et le Super administrateur peuvent supprimer définitivement.',
        })
      }
      const id = Number(req.query?.id)
      if (!id) return res.status(400).json({ error: 'Identifiant manquant' })

      const [avant] = await db.select().from(table).where(eq(table.id, id))
      if (!avant) return res.status(404).json({ error: 'Contenu introuvable' })

      await db.delete(table).where(eq(table.id, id))
      await journaliser(id, utilisateur.id, 'suppression', avant)
      const deploiement = STATUTS_EN_LIGNE.includes(avant.statut) ? await declencherSansEchouer(entite) : {}

      return res.status(200).json({ ok: true, ...deploiement })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  }
}
