// Contrôle des droits — §1 et §5 de l'architecture technique : chaque route
// d'API appelle l'une de ces fonctions avant d'agir, jamais seulement l'état
// de l'interface (§24.3 du cahier des charges : masquer un bouton ne suffit
// jamais à sécuriser une action).

// Droits généraux, hors module Demandes (qui a son propre modèle par
// rubrique ci-dessous). Fixés dans le code : contrairement aux demandes, le
// cahier ne demande pas que ces droits soient reconfigurables sans
// redéploiement.
const DROITS_GENERAUX = {
  super_admin: new Set(['*']),
  coordination: new Set(['*']),
  communication: new Set([
    'actualites.gerer',
    'evenements.gerer',
    'medias.gerer',
    'mediatheque.televerser',
    'seo.editorial',
    'campagnes.gerer',
  ]),
  contributeur: new Set(['brouillons.creer', 'mediatheque.televerser']),
  lecture_seule: new Set(['lecture.seule']),
}

export function verifierDroit(role, action) {
  const droits = DROITS_GENERAUX[role]
  if (!droits) return false
  return droits.has('*') || droits.has(action)
}

// Droits sur les demandes, par rubrique (§5 de l'architecture — révisé
// après relecture pour être configurable sans changement de code).
//
// Super administrateur et Coordination ont un plancher garanti ICI, dans le
// code, pas seulement par la donnée : une erreur de configuration dans
// `rubrique_permissions` ne peut donc jamais leur retirer l'accès. Tous les
// autres rôles dépendent entièrement de cette table, modifiable depuis
// l'écran Utilisateurs & rôles sans redéploiement.
export async function verifierDroitDemande(db, utilisateur, rubriqueCle, action) {
  const { role, id: utilisateurId } = utilisateur
  if (role === 'super_admin' || role === 'coordination') return true

  const { rubriquePermission } = await import('../db/schema.js')
  const { and, eq, or } = await import('drizzle-orm')

  const lignes = await db
    .select()
    .from(rubriquePermission)
    .where(
      and(
        eq(rubriquePermission.rubriqueCle, rubriqueCle),
        or(eq(rubriquePermission.role, role), eq(rubriquePermission.utilisateurId, utilisateurId))
      )
    )

  // Une exception individuelle (rattachée à utilisateur_id) prime sur la
  // règle de rôle correspondante.
  const ligne = lignes.find((l) => l.utilisateurId === utilisateurId) || lignes.find((l) => l.role === role)
  if (!ligne) return false

  return action === 'consulter' ? ligne.peutConsulter : ligne.peutRepondre
}
