// Partenaires et coopérations territoriales — lus depuis le back-office.
//
// La distinction entre ce qui est formalisé et ce qui ne l'est pas reste
// aussi stricte qu'avant : afficher une collectivité comme partenaire établi
// alors qu'aucune convention n'existe peut poser un problème institutionnel.
// Elle ne se fait simplement plus en déplaçant une entrée d'un tableau à
// l'autre, mais en changeant le suivi de la relation dans /admin/partenaires
// — d'où découlent les deux blocs ci-dessous.
//
// La mention affichée à côté de chaque nom (« Partenariat convenu »,
// « Échange en cours »…) est saisie à part du suivi interne : les deux ne
// disent pas la même chose, et on n'écrit pas publiquement « prospect » d'une
// mairie.
//
// Le nombre de déchèteries du partenariat SITCOM était autrefois repris des
// données du challenge pour ne pas se démoder. Il est désormais figé dans le
// texte de la fiche : décision du 21/09/2026. S'il change, la fiche est à
// corriger dans le back-office, et rien ne le signalera.

import cms from './cms.json' with { type: 'json' }

export const PARTENAIRES_CONFIRMES = cms.organisations.confirmes
export const COOPERATIONS_EN_COURS = cms.organisations.cooperations

// Formulation employée partout pour introduire le second bloc : elle dit
// explicitement qu'aucun partenariat n'est encore formalisé avec ces
// structures. Ce n'est pas une organisation, elle n'a donc rien à faire en
// base — c'est une phrase du site, qui suivra les pages institutionnelles.
export const MENTION_COOPERATIONS =
  "Aucun partenariat n'est formalisé à ce stade avec ces structures : les " +
  "échanges en cours portent sur de futures coopérations territoriales."

// Pays traversés par la zone d'action, celle des deux intercommunalités du
// littoral — Côte Landes Nature et MACS. La liste était écrite en dur sur la
// page d'accueil et dans l'espace presse, et elle disait « Côte landaise,
// Marensin, Born, Marsan » :
//   — le Marsan est le pays de Mont-de-Marsan, où aucune des deux n'a de
//     commune ;
//   — le Maremne, lui, manquait, alors qu'il donne son nom à MACS ;
//   — le Born ne touche CLN que par sa frange nord, autour de
//     Saint-Julien-en-Born.
// Seul le Marensin chevauche réellement les deux, de Vielle-Saint-Girons et
// Linxe jusqu'à Soustons et Vieux-Boucau.
// Vérifié le 04/09/2026 sur les listes de communes des deux EPCI.
//
// Pas davantage une organisation que la mention ci-dessus : reste ici.
// Le séparateur reste à la charge de chaque page : puces sur l'accueil,
// virgules dans les repères presse.
export const PAYS_ZONE_ACTION = ['Côte landaise', 'Marensin', 'Maremne']
