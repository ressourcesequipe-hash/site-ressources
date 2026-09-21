// Règles des campagnes et bandeaux temporaires — §19 du cahier des charges.
//
// Fichier pur : ni base, ni réseau. Le calcul de visibilité vit ici parce
// qu'il est fait à deux endroits très différents — le back-office, pour dire
// à l'équipe ce qui est en ligne, et le site public, pour l'afficher. Deux
// implémentations finiraient par diverger, et l'écran dirait « visible » de
// quelque chose que personne ne voit.

export const TYPES = [
  { cle: 'information', libelle: 'Information', aide: "Une nouvelle à faire connaître, sans urgence." },
  { cle: 'evenement', libelle: 'Événement', aide: "Une date à venir : portes ouvertes, tirage, inauguration." },
  { cle: 'alerte', libelle: 'Alerte', aide: "Un changement qui gêne le visiteur : fermeture, report, indisponibilité." },
  { cle: 'collecte', libelle: 'Collecte', aide: "Un appel à donner du matériel ou des végétaux." },
  { cle: 'appel_benevoles', libelle: 'Appel à bénévoles', aide: "Un besoin de renfort ponctuel ou durable." },
  { cle: 'soutien', libelle: 'Campagne de soutien', aide: "Un appel aux dons, à l'adhésion ou au mécénat." },
]

export const CLES_TYPES = TYPES.map((t) => t.cle)
export const LIBELLES_TYPE = Object.fromEntries(TYPES.map((t) => [t.cle, t.libelle]))

export const EMPLACEMENTS = [
  { cle: 'bandeau_global', libelle: 'Bandeau en haut de toutes les pages' },
  { cle: 'accueil', libelle: "Page d'accueil uniquement" },
  { cle: 'page_specifique', libelle: 'Une page précise' },
]

export const CLES_EMPLACEMENTS = EMPLACEMENTS.map((e) => e.cle)
export const LIBELLES_EMPLACEMENT = Object.fromEntries(EMPLACEMENTS.map((e) => [e.cle, e.libelle]))

// ── Visibilité ───────────────────────────────────────────────────────────
//
// Deux conditions, et il faut les deux : l'interrupteur `actif`, et la
// fenêtre de dates. Une date absente signifie « pas de borne de ce côté » —
// une campagne sans date de fin reste jusqu'à ce qu'on la désactive.

export const ETATS = {
  inactive: "Désactivée",
  a_venir: 'Programmée',
  en_cours: 'En ligne',
  terminee: 'Terminée',
}

export function etatCampagne(campagne, maintenant = new Date()) {
  if (!campagne?.actif) return 'inactive'
  const t = maintenant.getTime()
  const debut = campagne.debutLe ? new Date(campagne.debutLe).getTime() : null
  const fin = campagne.finLe ? new Date(campagne.finLe).getTime() : null

  if (debut !== null && t < debut) return 'a_venir'
  if (fin !== null && t > fin) return 'terminee'
  return 'en_cours'
}

export function estVisible(campagne, maintenant = new Date()) {
  return etatCampagne(campagne, maintenant) === 'en_cours'
}

/**
 * Les campagnes à afficher à un emplacement donné, dans l'ordre voulu.
 *
 * @param emplacement  'bandeau_global' | 'accueil' | 'page_specifique'
 * @param chemin       chemin de la page courante, pour `page_specifique`
 */
export function campagnesPour(campagnes, emplacement, chemin = null, maintenant = new Date()) {
  return (campagnes || [])
    .filter((c) => c.emplacement === emplacement)
    .filter((c) => emplacement !== 'page_specifique' || normaliserChemin(c.pageCible) === normaliserChemin(chemin))
    .filter((c) => estVisible(c, maintenant))
    .sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0))
}

// « /defi-collecte », « /defi-collecte/ » et « defi-collecte » désignent la
// même page. Quelqu'un qui recopie une adresse depuis son navigateur y met
// la barre finale ; quelqu'un qui la tape, rarement.
export function normaliserChemin(chemin) {
  if (!chemin) return null
  const propre = String(chemin).trim().replace(/[?#].*$/, '')
  if (!propre) return null
  return '/' + propre.replace(/^\/+|\/+$/g, '')
}

// ── Validation ───────────────────────────────────────────────────────────

export function valider(donnees = {}) {
  const erreurs = []
  const titreInterne = String(donnees.titreInterne ?? '').trim()
  const message = String(donnees.message ?? '').trim()
  const lien = String(donnees.lien ?? '').trim()
  const texteBouton = String(donnees.texteBouton ?? '').trim()

  if (!titreInterne) {
    erreurs.push({ champ: 'titreInterne', message: "Donnez un nom à cette campagne : il ne s'affiche nulle part, il sert à la retrouver." })
  } else if (titreInterne.length > 150) {
    erreurs.push({ champ: 'titreInterne', message: 'Ce nom ne peut pas dépasser 150 caractères.' })
  }

  if (!message) erreurs.push({ champ: 'message', message: 'Le message est obligatoire : c’est ce que lira le visiteur.' })
  else if (message.length > 400) {
    erreurs.push({ champ: 'message', message: "Un bandeau se lit d'un coup d'œil : 400 caractères au maximum." })
  }

  if (donnees.type && !CLES_TYPES.includes(donnees.type)) {
    erreurs.push({ champ: 'type', message: "Ce type de campagne n'existe pas." })
  }
  if (donnees.emplacement && !CLES_EMPLACEMENTS.includes(donnees.emplacement)) {
    erreurs.push({ champ: 'emplacement', message: "Cet emplacement n'existe pas." })
  }

  if (donnees.emplacement === 'page_specifique' && !normaliserChemin(donnees.pageCible)) {
    erreurs.push({ champ: 'pageCible', message: "Indiquez la page concernée, par exemple /defi-collecte." })
  }

  // Un bouton sans lien ne mène nulle part ; un lien sans bouton reste
  // invisible. L'un appelle l'autre.
  if (texteBouton && !lien) {
    erreurs.push({ champ: 'lien', message: "Vous avez saisi un texte de bouton : indiquez l'adresse vers laquelle il mène." })
  }
  if (lien && !texteBouton) {
    erreurs.push({ champ: 'texteBouton', message: "Vous avez saisi un lien : indiquez le texte du bouton, par exemple « Découvrir »." })
  }
  if (texteBouton.length > 40) {
    erreurs.push({ champ: 'texteBouton', message: 'Le texte du bouton ne peut pas dépasser 40 caractères.' })
  }

  const debut = donnees.debutLe ? new Date(donnees.debutLe) : null
  const fin = donnees.finLe ? new Date(donnees.finLe) : null
  if (debut && Number.isNaN(debut.getTime())) erreurs.push({ champ: 'debutLe', message: "Cette date de début n'est pas valide." })
  if (fin && Number.isNaN(fin.getTime())) erreurs.push({ champ: 'finLe', message: "Cette date de fin n'est pas valide." })
  if (debut && fin && !Number.isNaN(debut.getTime()) && !Number.isNaN(fin.getTime()) && fin <= debut) {
    erreurs.push({ champ: 'finLe', message: 'La fin doit venir après le début.' })
  }

  // Activer une campagne déjà terminée ne produirait rien, et personne ne
  // comprendrait pourquoi. Mieux vaut le dire à l'enregistrement.
  if (donnees.actif && fin && !Number.isNaN(fin.getTime()) && fin.getTime() < Date.now()) {
    erreurs.push({
      champ: 'finLe',
      message: "Cette date de fin est déjà passée : la campagne ne s'afficherait pas. Repoussez-la, ou laissez la campagne désactivée.",
    })
  }

  return { ok: erreurs.length === 0, erreurs }
}
