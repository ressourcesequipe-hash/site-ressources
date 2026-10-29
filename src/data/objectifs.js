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

import { DEFI, POINTS_OUVERTS } from './defiCollecte'

export const OBJECTIFS = [
  // Relevé le 29/10/2026 après le challenge : 120 équipements collectés était
  // déjà dépassé, la cible devient le reconditionnement.
  { cle: 'equipements', valeur: 300, suffixe: '', label: 'équipements reconditionnés' },
  { cle: 'reemploi', valeur: 80, suffixe: '%', label: 'réemployés ou valorisés' },
  { cle: 'plantes', valeur: 1000, valeurAffichee: '1 000', suffixe: '', label: 'plantes à redistribuer' },
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

// Accompagne les objectifs partout ou ils sont montres, pour qu'ils ne se
// lisent pas comme un bilan : le bilan, c'est REALISE ci-dessous.
export const MENTION_PHASE_PILOTE =
  "Objectifs de la première année d'activité, lancée le 3 octobre 2026. " +
  "Le challenge collecte de septembre a déjà dépassé les premières ambitions."

// Ce qui est acquis, en cinq semaines de challenge (1er septembre – 3 octobre
// 2026). Les communes partenaires sont les mairies qui ont accueilli un point
// de dépôt — neuf —, et non toutes les communes où l'on pouvait déposer.
export const REALISE = [
  { cle: 'kg', valeur: `${DEFI.collecteKg} kg`, label: 'de matériel collectés' },
  { cle: 'communes', valeur: '9', label: 'communes partenaires' },
  { cle: 'points', valeur: String(POINTS_OUVERTS.length), label: 'points de collecte' },
]
