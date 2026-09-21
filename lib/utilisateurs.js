// Règles de l'écran Utilisateurs et rôles — §21 du cahier des charges.
//
// Fichier pur, sans base ni réseau : les garde-fous ci-dessous sont ceux dont
// dépend l'accès au back-office lui-même, ils doivent pouvoir être vérifiés
// sans rien démarrer.

export const ROLES = [
  {
    cle: 'super_admin',
    libelle: 'Super administrateur',
    description: "Accès complet, y compris la gestion des comptes et les réglages techniques.",
  },
  {
    cle: 'coordination',
    libelle: 'Coordination',
    description: "Gère tous les contenus, les demandes et les paramètres éditoriaux. Ne gère pas les comptes.",
  },
  {
    cle: 'communication',
    libelle: 'Communication',
    description: "Actualités, événements, médias, SEO éditorial et campagnes.",
  },
  {
    cle: 'contributeur',
    libelle: 'Contributeur',
    description: "Crée des brouillons. Ne publie jamais directement.",
  },
  {
    cle: 'lecture_seule',
    libelle: 'Lecture seule',
    description: "Consulte le back-office sans rien pouvoir modifier.",
  },
]

export const CLES_ROLES = ROLES.map((r) => r.cle)
export const LIBELLES_ROLE = Object.fromEntries(ROLES.map((r) => [r.cle, r.libelle]))

// La gestion des comptes n'est pas un droit comme les autres : `verifierDroit`
// l'accorderait à la Coordination, dont le joker `*` couvre tout. Or le §21
// réserve « utilisateurs » au Super administrateur, et ajoute que la
// Coordination « ne doit pas avoir accès aux paramètres techniques critiques
// si ce n'est pas nécessaire ». D'où ce contrôle explicite, qui ne passe pas
// par la table des droits généraux.
export function peutGererLesComptes(role) {
  return role === 'super_admin'
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validerNouveauCompte(donnees = {}) {
  const erreurs = []
  const nom = String(donnees.nom || '').trim()
  const email = String(donnees.email || '').trim().toLowerCase()
  const role = String(donnees.role || '').trim()

  if (!nom) erreurs.push({ champ: 'nom', message: 'Le nom est obligatoire.' })
  else if (nom.length > 120) erreurs.push({ champ: 'nom', message: 'Le nom ne peut pas dépasser 120 caractères.' })

  if (!email) erreurs.push({ champ: 'email', message: "L'adresse email est obligatoire." })
  else if (!EMAIL.test(email)) erreurs.push({ champ: 'email', message: "Cette adresse email n'est pas valide." })

  if (!role) erreurs.push({ champ: 'role', message: 'Choisissez un rôle.' })
  else if (!CLES_ROLES.includes(role)) erreurs.push({ champ: 'role', message: "Ce rôle n'existe pas." })

  return { ok: erreurs.length === 0, erreurs, valeurs: { nom, email, role } }
}

// ── Garde-fous d'accès ───────────────────────────────────────────────────
//
// Les trois règles ci-dessous protègent d'une seule et même erreur : se
// retirer à soi-même, ou retirer au dernier administrateur, le droit de
// revenir. Elle est irrattrapable depuis l'interface — il faudrait un accès
// direct à la base pour s'en sortir.

/**
 * @param {object} params
 * @param {string} params.acteurId           qui agit
 * @param {object} params.cible              le compte visé { id, role, actif }
 * @param {object} params.modifications      { role?, actif? }
 * @param {number} params.autresSuperAdminsActifs
 *   nombre de super administrateurs actifs AUTRES que la cible
 */
export function verifierModification({ acteurId, cible, modifications, autresSuperAdminsActifs }) {
  const estSoiMeme = cible.id === acteurId

  if ('role' in modifications && modifications.role !== cible.role) {
    if (estSoiMeme) {
      return {
        ok: false,
        raison: "Vous ne pouvez pas changer votre propre rôle. Demandez-le à un autre Super administrateur — c'est ce qui évite de se retirer l'accès par inadvertance.",
      }
    }
    if (!CLES_ROLES.includes(modifications.role)) {
      return { ok: false, raison: "Ce rôle n'existe pas." }
    }
    if (cible.role === 'super_admin' && modifications.role !== 'super_admin' && autresSuperAdminsActifs === 0) {
      return {
        ok: false,
        raison: "C'est le dernier Super administrateur actif : lui retirer ce rôle laisserait le back-office sans personne pour gérer les comptes. Nommez-en un autre d'abord.",
      }
    }
  }

  if ('actif' in modifications && modifications.actif !== cible.actif) {
    if (estSoiMeme && modifications.actif === false) {
      return {
        ok: false,
        raison: "Vous ne pouvez pas désactiver votre propre compte : vous seriez déconnecté sans pouvoir revenir.",
      }
    }
    if (
      modifications.actif === false &&
      cible.role === 'super_admin' &&
      autresSuperAdminsActifs === 0
    ) {
      return {
        ok: false,
        raison: "C'est le dernier Super administrateur actif : le désactiver rendrait la gestion des comptes impossible.",
      }
    }
  }

  return { ok: true }
}

// Mot de passe initial d'un compte invité.
//
// La personne ne le connaîtra jamais : il n'existe que pour que la ligne
// d'authentification existe, le temps que le lien d'invitation soit suivi.
// Il est tiré au hasard plutôt que fixé, pour qu'un compte invité mais jamais
// activé ne reste pas ouvert avec un mot de passe connu du code.
export function motDePasseProvisoire(octetsAleatoires) {
  return Array.from(octetsAleatoires)
    .map((o) => o.toString(16).padStart(2, '0'))
    .join('')
}
