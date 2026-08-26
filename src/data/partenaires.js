// Partenaires et coopérations territoriales.
//
// Distinction volontairement stricte entre ce qui est formalise et ce qui ne
// l'est pas : afficher une collectivite comme partenaire etabli alors qu'aucune
// convention n'existe encore peut poser un probleme institutionnel. La page
// d'accueil et la page territoire listaient les quatre structures a plat, sans
// nuance, alors que la page partenaires les distinguait deja — d'ou cette source
// unique, consommee par les trois.
//
// Deplacer une entree d'un tableau a l'autre suffit a mettre a jour tout le site.

export const PARTENAIRES_CONFIRMES = [
  {
    nom: 'Réseau ReNAITRe',
    label: 'Réseau professionnel rejoint',
    categorie: 'Réseaux & partenaires opérationnels',
    logo: '/logos/logo-renaitre.webp',
    desc: "Ressources rejoint le réseau ReNAITRe, réseau régional du réemploi solidaire en Nouvelle-Aquitaine.",
    lien: 'https://www.reseau-renaitre.com/page/1502390-accueil',
  },
  {
    nom: 'SITCOM40',
    label: 'Partenariat convenu',
    categorie: 'Réseaux & partenaires opérationnels',
    logo: '/logos/logo-sitcom40.svg',
    desc: "Un partenariat a été convenu avec le SITCOM40 pour l'installation de points de collecte de matériel informatique dans deux déchèteries du département.",
    lien: null,
  },
  {
    nom: 'Mairie de Vielle-Saint-Girons',
    label: 'Partenaire local confirmé',
    categorie: 'Collectivités locales',
    logo: '/logos/logo-mairie-vsg.webp',
    desc: "La commune de Vielle-Saint-Girons s'est positionnée comme partenaire du lancement de Ressources sur son territoire.",
    lien: null,
  },
]

export const COOPERATIONS_EN_COURS = [
  {
    nom: 'CC Côte Landes Nature',
    label: 'Échange en cours',
    categorie: 'Intercommunalités',
    logo: '/logos/logo-cln.webp',
    desc: "Ressources souhaite développer des coopérations territoriales autour du réemploi, de l'inclusion numérique et de la recyclerie végétale.",
    lien: null,
  },
  {
    nom: 'Territoire MACS',
    label: 'Présentation du projet en cours',
    categorie: 'Intercommunalités',
    logo: '/logos/logo-macs.webp',
    desc: "Ressources engage une démarche de présentation du projet sur le territoire MACS afin d'identifier de futures pistes de coopération locale.",
    lien: null,
  },
]

// Formulation employee partout pour introduire le second bloc : elle dit
// explicitement qu'aucun partenariat n'est encore formalise avec ces structures.
export const MENTION_COOPERATIONS =
  "Aucun partenariat n'est formalisé à ce stade avec ces structures : les " +
  "échanges en cours portent sur de futures coopérations territoriales."
