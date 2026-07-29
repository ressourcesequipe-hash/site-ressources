// Défi collecte : du 1er septembre au 3 octobre 2026, 500 kg de matériel
// informatique à réunir sur le territoire.

export const DEFI = {
  objectifKg: 500,
  debut: '1er septembre 2026',
  fin: '3 octobre 2026',
  // Mettre à jour au fil des pesées. null tant qu'aucune pesée n'a eu lieu :
  // la page affiche alors le compteur comme « à venir » plutôt que « 0 kg ».
  collecteKg: null,
  dernierePesee: null,
}

// Points de collecte du défi.
// statut : 'confirme' (affiché) ou 'a-venir' (compté mais non nommé).
// mention : précision affichée en pastille à côté du type (facultatif).
//   Retirer la mention dès que le point est formalisé.
export const POINTS_COLLECTE = [
  {
    nom: 'Association Ressources',
    ville: 'Vielle-Saint-Girons',
    adresse: '80 allée des Cigales',
    type: 'Point permanent',
    statut: 'confirme',
  },
  {
    nom: 'E.Leclerc',
    ville: 'Soustons',
    adresse: null,
    type: 'Point partenaire',
    statut: 'confirme',
    mention: 'En cours de formalisation',
  },
  {
    nom: 'E.Leclerc Express',
    ville: 'Linxe',
    adresse: null,
    type: 'Point partenaire',
    statut: 'confirme',
    mention: 'En cours de formalisation',
  },
]

export const POINTS_CONFIRMES = POINTS_COLLECTE.filter(
  ({ statut }) => statut === 'confirme',
)

// Points réellement ouverts au dépôt : confirmés et sans réserve en cours.
// Sert au compteur affiché en tête de section — il se met à jour tout seul
// dès qu'une `mention` est retirée ci-dessus.
export const POINTS_OUVERTS = POINTS_CONFIRMES.filter(({ mention }) => !mention)

// Partenariat SITCOM40 : points de collecte en déchèterie.
// Renseigner `decheteries` avec les communes dès qu'elles sont arrêtées ;
// la page les affiche alors nommément à la place de la mention générique.
export const PARTENARIAT_SITCOM = {
  nom: 'SITCOM Côte Sud des Landes',
  nombre: 2,
  decheteries: [],
}

export const ACCEPTE = [
  'Ordinateurs portables et fixes',
  'Écrans, claviers, souris',
  'Tablettes et smartphones',
  'Câbles, chargeurs, périphériques',
  'Imprimantes et petits équipements réseau',
]

export const ETAPES = [
  {
    num: '01',
    titre: 'Vous déposez',
    desc: 'Apportez vos équipements inutilisés dans l’un des points de collecte du territoire, à partir du 1er septembre.',
  },
  {
    num: '02',
    titre: 'Nous pesons',
    desc: 'Chaque dépôt est pesé et enregistré. Le total progresse semaine après semaine vers l’objectif des 500 kg.',
  },
  {
    num: '03',
    titre: 'Pesée finale le 3 octobre',
    desc: 'L’ensemble du matériel est rassemblé et pesé en public lors de la journée de lancement à Vielle-Saint-Girons.',
  },
  {
    num: '04',
    titre: 'Tout est revalorisé',
    desc: 'Tri, effacement certifié des données, reconditionnement, puis redistribution solidaire sur le territoire.',
  },
]
