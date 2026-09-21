// Utilisateurs et rôles — §21 du cahier des charges, et §5 de l'architecture
// pour les permissions par rubrique du module Demandes.
//
// Réservé au Super administrateur. Le contrôle ne passe pas par
// `verifierDroit` : le joker `*` de la Coordination l'accorderait, alors que
// le §21 réserve les comptes au Super administrateur. Voir
// `peutGererLesComptes` dans lib/utilisateurs.js.
//
// Aucun mot de passe ne transite jamais par cet écran : un compte se crée
// sans, et la personne choisit le sien depuis le lien qu'elle reçoit.

import { and, asc, eq, inArray, ne, sql } from 'drizzle-orm'
import { randomBytes } from 'node:crypto'
import { auth } from '../../lib/auth.js'
import { fromNodeHeaders } from 'better-auth/node'
import { db } from '../../lib/db.js'
import { rubriquePermission, session, user } from '../../db/schema.js'
import {
  ROLES,
  motDePasseProvisoire,
  peutGererLesComptes,
  validerNouveauCompte,
  verifierModification,
} from '../../lib/utilisateurs.js'
import { CLES_RUBRIQUES, RUBRIQUES, messageSansDonnees } from '../../lib/demandes.js'

export default async function handler(req, res) {
  const sessionActuelle = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
  if (!sessionActuelle) return res.status(401).json({ error: 'Non authentifié' })
  const acteur = sessionActuelle.user

  if (!peutGererLesComptes(acteur.role)) {
    return res.status(403).json({
      error: "La gestion des comptes est réservée au Super administrateur.",
    })
  }

  const id = req.query?.id || null
  const action = req.query?.action || null

  try {
    if (req.method === 'GET') return await lister(res)
    if (req.method === 'POST' && action === 'reinviter' && id) return await reinviter(req, res, id)
    if (req.method === 'POST' && !action) return await creer(req, res, acteur)
    if (req.method === 'PATCH' && id) return await modifier(req, res, acteur, id)
    if (req.method === 'PUT' && action === 'permissions') return await enregistrerPermissions(req, res)
    return res.status(405).json({ error: 'Méthode non autorisée' })
  } catch (e) {
    console.error(`[utilisateurs] ${req.method} ${action || ''} :`, messageSansDonnees(e))
    return res.status(500).json({ error: "Une erreur est survenue. Rien n'a été modifié." })
  }
}

// ── Lecture ──────────────────────────────────────────────────────────────

async function lister(res) {
  const comptes = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      actif: user.actif,
      desactiveLe: user.desactiveLe,
      doitDefinirMotDePasse: user.doitDefinirMotDePasse,
      creeLe: user.createdAt,
    })
    .from(user)
    .orderBy(asc(user.name))

  const permissions = await db.select().from(rubriquePermission)

  return res.status(200).json({
    utilisateurs: comptes,
    permissions,
    roles: ROLES,
    rubriques: RUBRIQUES,
  })
}

// Compte les Super administrateurs actifs autres que celui qu'on s'apprête à
// modifier : c'est ce nombre qui dit si l'on est sur le point de se priver du
// dernier.
async function autresSuperAdminsActifs(sauf) {
  const [compte] = await db
    .select({ n: sql`count(*)::int` })
    .from(user)
    .where(and(eq(user.role, 'super_admin'), eq(user.actif, true), ne(user.id, sauf)))
  return Number(compte?.n || 0)
}

// ── Création et invitation ───────────────────────────────────────────────

async function creer(req, res, acteur) {
  const validation = validerNouveauCompte(req.body)
  if (!validation.ok) return res.status(400).json({ erreurs: validation.erreurs })
  const { nom, email, role } = validation.valeurs

  const [existant] = await db.select({ id: user.id }).from(user).where(eq(user.email, email))
  if (existant) {
    return res.status(409).json({
      erreurs: [{ champ: 'email', message: 'Un compte existe déjà avec cette adresse.' }],
    })
  }

  // La création passe par better-auth plutôt que par une insertion directe :
  // c'est lui qui génère l'identifiant et le hachage du mot de passe, et il
  // ne faut pas deux façons de créer un compte dans le projet.
  const ctx = await auth.$context
  const compte = await ctx.internalAdapter.createUser({ name: nom, email, emailVerified: true })
  await ctx.internalAdapter.linkAccount({
    userId: compte.id,
    providerId: 'credential',
    accountId: compte.id,
    password: await ctx.password.hash(motDePasseProvisoire(randomBytes(32))),
  })
  await db.update(user).set({ role, doitDefinirMotDePasse: true }).where(eq(user.id, compte.id))

  const envoi = await inviter(email)

  return res.status(201).json({
    utilisateur: { id: compte.id, name: nom, email, role, actif: true, doitDefinirMotDePasse: true },
    invitation: envoi,
  })
}

// L'échec d'envoi ne défait pas la création — le compte est valide, il lui
// manque seulement son invitation, qu'on peut relancer. Mais il est remonté
// sans détour : sans email, la personne n'a aucun moyen d'entrer.
async function inviter(email) {
  try {
    await auth.api.requestPasswordReset({
      body: { email, redirectTo: '/admin/definir-mot-de-passe' },
    })
    return { envoyee: true }
  } catch (e) {
    console.error('[utilisateurs] invitation non envoyée :', messageSansDonnees(e))
    return { envoyee: false, erreur: "L'email d'invitation n'a pas pu partir. Le compte existe : utilisez « Renvoyer l'invitation »." }
  }
}

async function reinviter(req, res, id) {
  const [compte] = await db.select().from(user).where(eq(user.id, id))
  if (!compte) return res.status(404).json({ error: 'Compte introuvable.' })
  if (!compte.actif) {
    return res.status(409).json({ error: "Ce compte est désactivé : réactivez-le avant de renvoyer une invitation." })
  }
  const envoi = await inviter(compte.email)
  if (!envoi.envoyee) return res.status(502).json({ error: envoi.erreur })
  return res.status(200).json({ invitation: envoi })
}

// ── Rôle et activation ───────────────────────────────────────────────────

async function modifier(req, res, acteur, id) {
  const [cible] = await db
    .select({ id: user.id, role: user.role, actif: user.actif, name: user.name })
    .from(user)
    .where(eq(user.id, id))
  if (!cible) return res.status(404).json({ error: 'Compte introuvable.' })

  const modifications = {}
  if ('role' in (req.body || {})) modifications.role = req.body.role
  if ('actif' in (req.body || {})) modifications.actif = Boolean(req.body.actif)
  if (Object.keys(modifications).length === 0) {
    return res.status(400).json({ error: 'Rien à modifier.' })
  }

  const controle = verifierModification({
    acteurId: acteur.id,
    cible,
    modifications,
    autresSuperAdminsActifs: await autresSuperAdminsActifs(cible.id),
  })
  if (!controle.ok) return res.status(403).json({ error: controle.raison })

  const champs = { ...modifications, updatedAt: new Date() }
  if ('actif' in modifications) {
    champs.desactiveLe = modifications.actif ? null : new Date()
  }

  const [apres] = await db.update(user).set(champs).where(eq(user.id, id)).returning({
    id: user.id, name: user.name, email: user.email, role: user.role,
    actif: user.actif, desactiveLe: user.desactiveLe,
    doitDefinirMotDePasse: user.doitDefinirMotDePasse,
  })

  // Désactiver sans fermer les sessions ne désactiverait rien : la personne
  // resterait connectée jusqu'à l'expiration de son cookie. Le contrôle à
  // l'ouverture de session (lib/auth.js) ne couvre que les connexions à venir.
  if (modifications.actif === false) {
    await db.delete(session).where(eq(session.userId, id))
  }

  return res.status(200).json({ utilisateur: apres })
}

// ── Permissions par rubrique (module Demandes) ───────────────────────────
//
// Super administrateur et Coordination ne figurent pas ici : leur accès à
// toutes les rubriques est garanti par le code (lib/permissions.js), pas par
// cette table. Les y ajouter laisserait croire qu'on peut le leur retirer.

const ROLES_CONFIGURABLES = ['communication', 'contributeur', 'lecture_seule']

async function enregistrerPermissions(req, res) {
  const lignes = Array.isArray(req.body?.permissions) ? req.body.permissions : null
  if (!lignes) return res.status(400).json({ error: 'Aucune permission transmise.' })

  const nettoyees = []
  for (const l of lignes) {
    if (!CLES_RUBRIQUES.includes(l?.rubriqueCle)) {
      return res.status(400).json({ error: `Rubrique inconnue : ${l?.rubriqueCle}` })
    }
    if (!ROLES_CONFIGURABLES.includes(l?.role)) {
      return res.status(400).json({
        error: `Le rôle ${l?.role} ne se configure pas ici : son accès aux demandes est fixé par le code.`,
      })
    }
    const peutConsulter = Boolean(l.peutConsulter)
    // Répondre sans pouvoir consulter n'a pas de sens : on corrige plutôt
    // que de refuser, l'intention est évidente.
    const peutRepondre = Boolean(l.peutRepondre) && peutConsulter
    nettoyees.push({ role: l.role, rubriqueCle: l.rubriqueCle, peutConsulter, peutRepondre })
  }

  // Remplacement complet des règles de rôle, en laissant intactes les
  // exceptions individuelles (utilisateur_id renseigné), qui ne se gèrent pas
  // depuis cet écran.
  await db
    .delete(rubriquePermission)
    .where(
      and(
        sql`${rubriquePermission.utilisateurId} is null`,
        inArray(rubriquePermission.role, ROLES_CONFIGURABLES)
      )
    )

  const aInserer = nettoyees.filter((l) => l.peutConsulter || l.peutRepondre)
  if (aInserer.length) await db.insert(rubriquePermission).values(aInserer)

  return res.status(200).json({ permissions: await db.select().from(rubriquePermission) })
}
