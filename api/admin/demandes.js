// Boîte de demandes — §15 et §16 du cahier des charges.
//
// Ce module ne ressemble pas aux six modules de contenu et n'utilise pas leur
// fabrique : on n'y crée rien, on n'y publie rien, et le droit d'agir ne
// dépend pas du rôle seul mais de la rubrique (§5 de l'architecture). Le
// verrou n'y est pas optimiste mais actif, parce qu'un email parti en double
// ne se rattrape pas comme un contenu écrasé.
//
// Une seule fonction serverless pour toutes les actions, l'action passant par
// la requête : le forfait Vercel en autorise douze au total (constaté en
// production le 20/09/2026, un treizième fichier fait échouer le
// déploiement).

import { and, desc, eq, ilike, inArray, or, sql } from 'drizzle-orm'
import { auth } from '../../lib/auth.js'
import { fromNodeHeaders } from 'better-auth/node'
import { db } from '../../lib/db.js'
import { demande, demandeEmail, demandeNote, demandeVerrou, user } from '../../db/schema.js'
import { rubriquesAccessibles } from '../../lib/permissions.js'
import { envoyerReponse, rafraichirEnvoisOrphelins } from '../../lib/envoi-reponse.js'
import {
  CLES_RUBRIQUES,
  DUREE_VERROU_MS,
  messageSansDonnees,
  STATUTS_OUVERTS,
  transitionStatutAutorisee,
  validerReponse,
  verrouActif,
  versCsv,
} from '../../lib/demandes.js'

export default async function handler(req, res) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
  if (!session) return res.status(401).json({ error: 'Non authentifié' })
  const utilisateur = session.user

  const acces = await rubriquesAccessibles(db, utilisateur, CLES_RUBRIQUES)
  if (acces.consulter.length === 0) {
    return res.status(403).json({
      error:
        "Aucune rubrique de demandes ne vous est ouverte. La Coordination peut vous en donner l'accès depuis l'écran Utilisateurs et rôles.",
    })
  }

  const id = req.query?.id ? Number(req.query.id) : null
  const action = req.query?.action || null

  try {
    if (req.method === 'GET' && !id) return await lister(req, res, acces)
    if (req.method === 'GET' && id) return await fiche(req, res, acces, id)
    if (req.method === 'PATCH' && id) return await modifier(req, res, acces, utilisateur, id)
    if (req.method === 'POST' && id) return await agir(req, res, acces, utilisateur, id, action)
    if (req.method === 'DELETE' && id && action === 'verrou') {
      return await relacherVerrou(res, utilisateur, id)
    }
    return res.status(405).json({ error: 'Méthode non autorisée' })
  } catch (e) {
    // Jamais de donnée personnelle dans les journaux (§16) : l'identifiant
    // de la demande suffit à la retrouver, son contenu n'a rien à faire ici.
    // `e.message` ne suffit pas à s'en assurer — Drizzle y recopie les
    // valeurs de la requête, ici le corps d'une réponse ou d'une note.
    console.error(`[demandes] ${req.method} ${action || ''} demande=${id || '-'} :`, messageSansDonnees(e))
    return res.status(500).json({ error: "Une erreur est survenue. La demande n'a pas été modifiée." })
  }
}

// ── Lecture ──────────────────────────────────────────────────────────────

async function lister(req, res, acces) {
  const q = req.query || {}
  const conditions = [inArray(demande.rubrique, acces.consulter)]

  if (q.rubrique) {
    if (!acces.consulter.includes(q.rubrique)) {
      return res.status(403).json({ error: "Cette rubrique ne vous est pas ouverte." })
    }
    conditions.push(eq(demande.rubrique, q.rubrique))
  }
  if (q.statut) conditions.push(eq(demande.statut, q.statut))
  // Filtre par défaut de la boîte : ce qui reste à traiter. L'historique
  // complet reste accessible, mais n'encombre pas la vue de travail.
  else if (q.ouvertes !== 'toutes') conditions.push(inArray(demande.statut, STATUTS_OUVERTS))

  if (q.assigne === 'personne') conditions.push(sql`${demande.assigneAId} is null`)
  else if (q.assigne) conditions.push(eq(demande.assigneAId, q.assigne))

  if (q.recherche) {
    const motif = `%${q.recherche}%`
    conditions.push(
      or(
        ilike(demande.nom, motif),
        ilike(demande.email, motif),
        ilike(demande.commune, motif),
        ilike(demande.message, motif)
      )
    )
  }

  const colonnes = {
    id: demande.id,
    typeFormulaire: demande.typeFormulaire,
    rubrique: demande.rubrique,
    nom: demande.nom,
    email: demande.email,
    telephone: demande.telephone,
    commune: demande.commune,
    message: demande.message,
    statut: demande.statut,
    assigneAId: demande.assigneAId,
    assigneANom: user.name,
    creeLe: demande.creeLe,
    majLe: demande.majLe,
  }

  const lignes = await db
    .select(colonnes)
    .from(demande)
    .leftJoin(user, eq(demande.assigneAId, user.id))
    .where(and(...conditions))
    .orderBy(desc(demande.creeLe))

  if (q.format === 'csv') {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="demandes-${new Date().toISOString().slice(0, 10)}.csv"`)
    return res.status(200).send(versCsv(lignes))
  }

  // Compteurs par rubrique, sur les seules demandes ouvertes : c'est ce que
  // l'équipe lit en arrivant — ce qui l'attend, pas ce qui est archivé.
  const compteurs = await db
    .select({ rubrique: demande.rubrique, total: sql`count(*)::int` })
    .from(demande)
    .where(and(inArray(demande.rubrique, acces.consulter), inArray(demande.statut, STATUTS_OUVERTS)))
    .groupBy(demande.rubrique)

  return res.status(200).json({
    demandes: lignes,
    compteurs: Object.fromEntries(compteurs.map((c) => [c.rubrique, c.total])),
    acces,
    equipe: await listerEquipe(),
  })
}

// Destinataires possibles d'une assignation. Les comptes en lecture seule en
// sont exclus : leur assigner une demande serait lui promettre un traitement
// qu'ils n'ont pas le droit d'effectuer.
async function listerEquipe() {
  return db
    .select({ id: user.id, name: user.name, role: user.role })
    .from(user)
    .where(sql`${user.role} <> 'lecture_seule'`)
    .orderBy(user.name)
}

async function fiche(req, res, acces, id) {
  const [ligne] = await db.select().from(demande).where(eq(demande.id, id))
  if (!ligne) return res.status(404).json({ error: 'Demande introuvable' })
  if (!acces.consulter.includes(ligne.rubrique)) {
    return res.status(403).json({ error: "Cette rubrique ne vous est pas ouverte." })
  }

  // Avant d'afficher l'historique, on requalifie les envois restés « en
  // cours » depuis trop longtemps. Attendre le cron quotidien laisserait la
  // demande bloquée jusqu'au lendemain, alors que la personne qui ouvre la
  // fiche est précisément celle qui veut savoir où en est son message.
  await rafraichirEnvoisOrphelins(db, id)

  const [notes, emails, verrou] = await Promise.all([
    db
      .select({
        id: demandeNote.id, contenu: demandeNote.contenu, creeLe: demandeNote.creeLe,
        auteurNom: user.name,
      })
      .from(demandeNote)
      .leftJoin(user, eq(demandeNote.auteurId, user.id))
      .where(eq(demandeNote.demandeId, id))
      .orderBy(desc(demandeNote.creeLe)),
    db
      .select({
        id: demandeEmail.id, destinataire: demandeEmail.destinataire, sujet: demandeEmail.sujet,
        corps: demandeEmail.corps, statutEnvoi: demandeEmail.statutEnvoi, erreur: demandeEmail.erreur,
        tentativeLe: demandeEmail.tentativeLe, confirmeLe: demandeEmail.confirmeLe,
        auteurNom: user.name,
      })
      .from(demandeEmail)
      .leftJoin(user, eq(demandeEmail.auteurId, user.id))
      .where(eq(demandeEmail.demandeId, id))
      .orderBy(desc(demandeEmail.tentativeLe)),
    lireVerrou(id),
  ])

  return res.status(200).json({
    demande: ligne,
    notes,
    emails,
    verrou,
    peutRepondre: acces.repondre.includes(ligne.rubrique),
    equipe: await listerEquipe(),
  })
}

async function lireVerrou(id) {
  const [v] = await db
    .select({
      demandeId: demandeVerrou.demandeId,
      verrouilleParId: demandeVerrou.verrouilleParId,
      verrouilleLe: demandeVerrou.verrouilleLe,
      expireLe: demandeVerrou.expireLe,
      parNom: user.name,
    })
    .from(demandeVerrou)
    .leftJoin(user, eq(demandeVerrou.verrouilleParId, user.id))
    .where(eq(demandeVerrou.demandeId, id))
  return v && verrouActif(v) ? v : null
}

// ── Statut et assignation ────────────────────────────────────────────────

async function modifier(req, res, acces, utilisateur, id) {
  const [avant] = await db.select().from(demande).where(eq(demande.id, id))
  if (!avant) return res.status(404).json({ error: 'Demande introuvable' })
  if (!acces.repondre.includes(avant.rubrique)) {
    return res.status(403).json({
      error: "Vous pouvez consulter cette rubrique, mais pas y agir. La Coordination peut vous ouvrir ce droit.",
    })
  }

  const corps = req.body || {}
  const champs = {}

  if ('statut' in corps) {
    const transition = transitionStatutAutorisee(avant.statut, corps.statut)
    if (!transition.ok) return res.status(403).json({ error: transition.raison })
    champs.statut = corps.statut
  }

  if ('assigneAId' in corps) {
    const valeur = corps.assigneAId || null
    if (valeur) {
      const [cible] = await db.select({ id: user.id, role: user.role }).from(user).where(eq(user.id, valeur))
      if (!cible) return res.status(400).json({ error: 'Cette personne est introuvable.' })
      if (cible.role === 'lecture_seule') {
        return res.status(400).json({
          error: "Ce compte est en lecture seule : lui assigner une demande l'engagerait à un traitement qu'il ne peut pas faire.",
        })
      }
    }
    champs.assigneAId = valeur
  }

  if (Object.keys(champs).length === 0) {
    return res.status(400).json({ error: 'Rien à modifier.' })
  }

  champs.majLe = new Date()
  const [apres] = await db.update(demande).set(champs).where(eq(demande.id, id)).returning()
  return res.status(200).json({ demande: apres })
}

// ── Actions (note, verrou, réponse) ──────────────────────────────────────

async function agir(req, res, acces, utilisateur, id, action) {
  const [ligne] = await db.select().from(demande).where(eq(demande.id, id))
  if (!ligne) return res.status(404).json({ error: 'Demande introuvable' })

  // Une note est un commentaire interne : la consultation suffit à en
  // écrire une, c'est ainsi qu'on signale un doute sans prendre la main.
  if (action === 'note') {
    if (!acces.consulter.includes(ligne.rubrique)) {
      return res.status(403).json({ error: "Cette rubrique ne vous est pas ouverte." })
    }
    const contenu = String(req.body?.contenu || '').trim()
    if (!contenu) return res.status(400).json({ error: 'La note est vide.' })
    if (contenu.length > 5000) return res.status(400).json({ error: 'La note est trop longue (5 000 caractères maximum).' })

    await db.insert(demandeNote).values({ demandeId: id, auteurId: utilisateur.id, contenu })
    await db.update(demande).set({ majLe: new Date() }).where(eq(demande.id, id))
    const notes = await db
      .select({ id: demandeNote.id, contenu: demandeNote.contenu, creeLe: demandeNote.creeLe, auteurNom: user.name })
      .from(demandeNote)
      .leftJoin(user, eq(demandeNote.auteurId, user.id))
      .where(eq(demandeNote.demandeId, id))
      .orderBy(desc(demandeNote.creeLe))
    return res.status(200).json({ notes })
  }

  // Tout le reste engage l'association vis-à-vis du demandeur.
  if (!acces.repondre.includes(ligne.rubrique)) {
    return res.status(403).json({
      error: "Vous pouvez consulter cette rubrique, mais pas y répondre. La Coordination peut vous ouvrir ce droit.",
    })
  }

  if (action === 'verrou') return await prendreVerrou(res, utilisateur, id)
  if (action === 'repondre') return await repondre(req, res, utilisateur, ligne)
  if (action === 'confirmer-envoi') return await confirmerEnvoi(req, res, id)

  return res.status(400).json({ error: `Action inconnue : ${action || '(aucune)'}` })
}

async function prendreVerrou(res, utilisateur, id) {
  const existant = await lireVerrou(id)
  if (existant && existant.verrouilleParId !== utilisateur.id) {
    return res.status(409).json({
      error: `${existant.parNom || 'Quelqu’un'} est en train de rédiger une réponse à cette demande. Attendez la fin de sa rédaction pour éviter deux réponses au même message.`,
      verrou: existant,
    })
  }

  const maintenant = new Date()
  const expireLe = new Date(maintenant.getTime() + DUREE_VERROU_MS)
  await db
    .insert(demandeVerrou)
    .values({ demandeId: id, verrouilleParId: utilisateur.id, verrouilleLe: maintenant, expireLe })
    .onConflictDoUpdate({
      target: demandeVerrou.demandeId,
      set: { verrouilleParId: utilisateur.id, verrouilleLe: maintenant, expireLe },
    })
  return res.status(200).json({ verrou: await lireVerrou(id) })
}

async function relacherVerrou(res, utilisateur, id) {
  const existant = await lireVerrou(id)
  // Un verrou qu'on ne détient pas ne se relâche pas : sinon il ne protège
  // plus de rien, il suffirait de le retirer pour écrire par-dessus.
  if (existant && existant.verrouilleParId !== utilisateur.id) {
    return res.status(409).json({ error: 'Ce verrou appartient à quelqu’un d’autre.', verrou: existant })
  }
  await db.delete(demandeVerrou).where(eq(demandeVerrou.demandeId, id))
  return res.status(200).json({ verrou: null })
}

async function repondre(req, res, utilisateur, ligne) {
  const verrou = await lireVerrou(ligne.id)
  if (verrou && verrou.verrouilleParId !== utilisateur.id) {
    return res.status(409).json({
      error: `${verrou.parNom || 'Quelqu’un'} rédige actuellement une réponse à cette demande. Votre message n'a pas été envoyé.`,
      verrou,
    })
  }

  await rafraichirEnvoisOrphelins(db, ligne.id)

  // Un envoi encore « en cours » ou « incertain » interdit d'en lancer un
  // second : c'est exactement la situation où l'on crée un doublon en
  // croyant rattraper un échec.
  const enSuspens = await db
    .select({ id: demandeEmail.id, statutEnvoi: demandeEmail.statutEnvoi })
    .from(demandeEmail)
    .where(
      and(
        eq(demandeEmail.demandeId, ligne.id),
        inArray(demandeEmail.statutEnvoi, ['en_cours', 'incertain'])
      )
    )
  if (enSuspens.length > 0) {
    const incertain = enSuspens.some((e) => e.statutEnvoi === 'incertain')
    return res.status(409).json({
      error: incertain
        ? "Un précédent envoi n'a jamais été confirmé : nous ne savons pas s'il est parti. Vérifiez la boîte d'envoi de l'association, puis indiquez dans l'historique s'il est parti ou non — vous pourrez alors renvoyer."
        : "Un envoi est en cours pour cette demande. Rechargez la page dans quelques instants.",
      enSuspens,
    })
  }

  const validation = validerReponse(req.body)
  if (!validation.ok) return res.status(400).json({ error: validation.erreurs.join(' ') })

  const suivi = await envoyerReponse(db, {
    demandeId: ligne.id,
    auteurId: utilisateur.id,
    ...validation.valeurs,
  })

  // L'envoi réussi fait avancer la demande, sauf si l'équipe l'a déjà
  // classée plus loin : répondre à une demande « traitée » ne la rouvre pas.
  if (suivi.statutEnvoi === 'envoye' && ['nouveau', 'a_traiter'].includes(ligne.statut)) {
    await db.update(demande).set({ statut: 'en_cours', majLe: new Date() }).where(eq(demande.id, ligne.id))
  } else {
    await db.update(demande).set({ majLe: new Date() }).where(eq(demande.id, ligne.id))
  }

  if (suivi.statutEnvoi === 'envoye') {
    await db.delete(demandeVerrou).where(eq(demandeVerrou.demandeId, ligne.id))
  }

  return res.status(suivi.statutEnvoi === 'envoye' ? 200 : 502).json({ envoi: suivi })
}

// Sortie d'un envoi « incertain » : seule l'équipe peut trancher, après
// avoir regardé la boîte d'envoi. Le code ne devine pas à sa place.
async function confirmerEnvoi(req, res, id) {
  const emailId = Number(req.body?.emailId)
  const resultat = req.body?.resultat
  if (!emailId || !['envoye', 'echec'].includes(resultat)) {
    return res.status(400).json({ error: 'Indiquez si ce message est parti ou non.' })
  }

  const [ligne] = await db
    .select()
    .from(demandeEmail)
    .where(and(eq(demandeEmail.id, emailId), eq(demandeEmail.demandeId, id)))
  if (!ligne) return res.status(404).json({ error: 'Envoi introuvable.' })
  if (!['incertain', 'en_cours'].includes(ligne.statutEnvoi)) {
    return res.status(409).json({ error: 'Cet envoi a déjà été tranché.' })
  }

  const [apres] = await db
    .update(demandeEmail)
    .set({
      statutEnvoi: resultat,
      confirmeLe: new Date(),
      erreur: resultat === 'envoye'
        ? 'Confirmé manuellement comme parti, après vérification de la boîte d’envoi.'
        : 'Confirmé manuellement comme non parti, après vérification de la boîte d’envoi.',
    })
    .where(eq(demandeEmail.id, emailId))
    .returning()

  return res.status(200).json({ envoi: apres })
}
