// Objectifs chiffres de la premiere annee.
//
// Ces quatre valeurs etaient recopiees a six endroits du site — deux fois dans
// la seule page d'accueil, plus la page presse et la page gouvernance — sans
// rien qui garantisse qu'elles restent d'accord entre elles. Meme raison d'etre
// que PRIX_BILLET dans lotsTombola.js et que les statuts dans partenaires.js :
// une seule valeur a changer si un objectif evolue, jamais plusieurs pages a
// resynchroniser a la main.
//
// La page d'accueil fait autorite : c'est son jeu d'objectifs qui est repris
// ailleurs, jamais l'inverse. Chaque bloc n'en affiche qu'un sous-ensemble,
// d'ou objectifs() plus bas.
//
// `valeur` est un nombre et non une chaine : le compteur anime de la page
// d'accueil incremente jusqu'a la valeur brute et ne saurait pas quoi faire
// d'un « 1 000 » deja formate.

export const OBJECTIFS = [
  { cle: 'equipements', valeur: 120, suffixe: '', label: 'équipements à collecter' },
  { cle: 'reemploi', valeur: 80, suffixe: '%', label: 'réemployés ou valorisés' },
  { cle: 'plantes', valeur: 1000, valeurAffichee: '1 000', suffixe: '', label: 'plantes à redistribuer' },
  { cle: 'communes', valeur: 5, suffixe: '', label: 'communes partenaires' },
]

/**
 * Selectionne des objectifs par cle, dans l'ordre demande.
 * Leve si une cle est inconnue : une faute de frappe doit casser le build,
 * pas afficher un trou silencieux dans la page.
 */
export function objectifs(...cles) {
  return cles.map((cle) => {
    const trouve = OBJECTIFS.find((o) => o.cle === cle)
    if (!trouve) throw new Error(`Objectif inconnu : « ${cle} »`)
    return trouve
  })
}

/**
 * Rend un objectif tel qu'il s'ecrit dans une page : « 120 », « 1 000 »,
 * « 80 % ». L'espace avant le pourcent est insecable, comme le veut l'usage
 * typographique francais.
 */
export function afficher({ valeur, valeurAffichee, suffixe }) {
  const nombre = valeurAffichee ?? String(valeur)
  return suffixe ? `${nombre} ${suffixe}` : nombre
}

// Accompagne les chiffres partout ou ils sont montres. L'association ne s'etant
// pas encore lancee, ces objectifs pourraient sinon se lire comme un bilan.
export const MENTION_PHASE_PILOTE =
  "Ces chiffres sont des objectifs de la phase pilote, et non des résultats acquis : " +
  "l'association se lance publiquement le 03 octobre 2026."
