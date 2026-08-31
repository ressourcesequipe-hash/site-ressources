// Défi collecte : du 1er septembre au 3 octobre 2026, 500 kg de matériel
// informatique et électronique à réunir sur le territoire.

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
//
// statut   : 'confirme' (affiché) ou 'a-venir' (compté mais non nommé).
// mention  : réserve affichée en pastille à côté du type. Tant qu'elle est là,
//            le point n'accueille pas de dépôt libre : il reste hors de la
//            carte et sans horaires. La retirer dès que le point est formalisé.
// coords   : [latitude, longitude] de l'épingle, et cible du lien « Y aller ↗ ».
//            Absentes tant que le point n'est pas ouvert au dépôt libre.
// horaires : créneaux d'accès au public, une entrée par groupe de jours.
// note     : précision affichée sous les horaires (facultatif).
//
// Adresses, coordonnées et horaires des mairies relevés le 29/08/2026 dans
// l'annuaire de l'administration (api-lannuaire.service-public.fr), puis
// recoupés un à un sur le site officiel de chaque commune.
export const POINTS_COLLECTE = [
  {
    nom: 'Mairie de Vielle-Saint-Girons',
    ville: 'Vielle-Saint-Girons',
    adresse: '80 allée des Cigales',
    coords: [43.9157, -1.3041],
    type: 'Point communal',
    statut: 'confirme',
    mention: null,
    // La mairie est ouverte du mardi au vendredi ; le dépôt du matériel n'est
    // possible que le mercredi et le jeudi. On n'affiche donc que ces deux
    // jours, et la note dit pourquoi les deux autres n'y sont pas.
    horaires: [{ jours: 'Mercredi et jeudi', creneaux: ['10h–12h', '15h–18h'] }],
    note: 'La mairie est ouverte du mardi au vendredi ; le dépôt de matériel se fait le mercredi et le jeudi.',
  },
  {
    nom: 'Mairie de Linxe',
    ville: 'Linxe',
    adresse: '2 place de l’Église',
    coords: [43.9201, -1.2462],
    type: 'Point communal',
    statut: 'confirme',
    mention: null,
    horaires: [
      { jours: 'Lundi au jeudi', creneaux: ['8h30–13h', '14h–17h'] },
      { jours: 'Vendredi', creneaux: ['8h30–13h'] },
    ],
    note: null,
  },
  {
    nom: 'Mairie de Saint-Michel-Escalus',
    ville: 'Saint-Michel-Escalus',
    adresse: '178 route de la Mairie',
    coords: [43.8942, -1.2617],
    type: 'Point communal',
    statut: 'confirme',
    mention: null,
    horaires: [
      { jours: 'Lundi et jeudi', creneaux: ['9h30–12h30', '13h30–17h'] },
      { jours: 'Mardi et vendredi', creneaux: ['9h30–12h30'] },
    ],
    note: null,
  },
  {
    nom: 'Mairie de Saint-Geours-de-Maremne',
    ville: 'Saint-Geours-de-Maremne',
    adresse: '1 place des Arènes',
    coords: [43.6912, -1.2164],
    type: 'Point communal',
    statut: 'confirme',
    mention: null,
    horaires: [{ jours: 'Lundi au vendredi', creneaux: ['8h30–12h', '13h30–17h30'] }],
    note: null,
  },
  {
    nom: 'Mairie de Seignosse',
    ville: 'Seignosse',
    adresse: '1998 avenue Charles-de-Gaulle',
    coords: [43.6873, -1.3738],
    type: 'Point communal',
    statut: 'confirme',
    mention: null,
    horaires: [
      { jours: 'Lundi au jeudi', creneaux: ['8h30–12h30', '13h30–17h'] },
      { jours: 'Vendredi', creneaux: ['8h30–12h30', '13h30–16h30'] },
    ],
    note: null,
  },
  {
    nom: 'Mairie de Vieux-Boucau',
    ville: 'Vieux-Boucau-les-Bains',
    adresse: '1 place de la Mairie',
    coords: [43.7862, -1.4005],
    type: 'Point communal',
    statut: 'confirme',
    mention: null,
    // L'annuaire de l'administration donne 14h30 pour la reprise de
    // l'après-midi, le site de la commune 14h. C'est le site communal qui fait
    // foi ici. À revérifier si un donateur signale porte close.
    horaires: [
      { jours: 'Lundi au vendredi', creneaux: ['9h–12h', '14h–17h30'] },
      { jours: 'Samedi', creneaux: ['9h–12h'] },
    ],
    note: null,
  },
  {
    nom: 'Mairie de Saint-Vincent-de-Tyrosse',
    ville: 'Saint-Vincent-de-Tyrosse',
    adresse: '24 avenue Nationale',
    coords: [43.6607, -1.3041],
    type: 'Point communal',
    statut: 'confirme',
    mention: null,
    horaires: [{ jours: 'Lundi au vendredi', creneaux: ['8h30–12h15', '13h30–17h30'] }],
    note: null,
  },
  // Structures partenaires — adresses, coordonnées et horaires relevés le
  // 29/08/2026 sur le site officiel de chaque structure, recoupés sur les
  // annuaires. Toutes deux sont cartographiées nommément dans OpenStreetMap :
  // les coordonnées sont celles du bâtiment, pas de la voie.
  {
    // Tiers-lieu associatif. OpenStreetMap connaît le lieu par son nom
    // (leisure=garden, « le Jardin d'Imagine ») : l'épingle est exacte, à 35 m
    // du milieu de la rue. Le siège social est déclaré 26 route de la Forêt,
    // mais c'est ici que le lieu accueille du public — donc ici qu'on dépose.
    nom: 'Imagine — le tiers-lieu',
    ville: 'Linxe',
    adresse: 'rue du Château d’Eau',
    coords: [43.9203, -1.2498],
    type: 'Point partenaire',
    statut: 'confirme',
    mention: null,
    // Le seul point ouvert le dimanche.
    horaires: [{ jours: 'Jeudi et dimanche', creneaux: ['9h–12h'] }],
    note: null,
  },
  {
    nom: 'Landes Partage',
    ville: 'Hagetmau',
    adresse: '570 chemin de Bellegarde',
    coords: [43.6398, -0.6166],
    type: 'Point partenaire',
    statut: 'confirme',
    mention: null,
    horaires: [{ jours: 'Lundi au samedi', creneaux: ['10h–13h', '14h–17h'] }],
    note: null,
  },
  {
    nom: 'Le Comptoir de l’Électroménager Solidaire',
    ville: 'Saint-Paul-lès-Dax',
    adresse: '106 boulevard Saint-Vincent-de-Paul',
    coords: [43.7243, -1.0498],
    type: 'Point partenaire',
    statut: 'confirme',
    mention: null,
    // Les annuaires donnent 9h30–12h et 13h30–17h, et se contredisent entre
    // eux. Deux pages du site de la structure donnent l'amplitude retenue ici.
    horaires: [{ jours: 'Lundi au vendredi', creneaux: ['9h–12h30', '13h30–17h'] }],
    note: null,
  },
  {
    nom: 'E.Leclerc',
    ville: 'Soustons',
    adresse: null,
    coords: null,
    type: 'Point partenaire',
    statut: 'confirme',
    mention: 'En cours de formalisation',
    horaires: null,
    note: null,
  },
  {
    nom: 'E.Leclerc Express',
    ville: 'Linxe',
    adresse: null,
    coords: null,
    type: 'Point partenaire',
    statut: 'confirme',
    mention: 'En cours de formalisation',
    horaires: null,
    note: null,
  },
]

export const POINTS_CONFIRMES = POINTS_COLLECTE.filter(
  ({ statut }) => statut === 'confirme',
)

// Points réellement ouverts au dépôt libre : confirmés, sans réserve en cours,
// et donc localisés. Ce sont eux, et eux seuls, que porte la carte, dans cet
// ordre. La liste se met à jour toute seule dès qu'une `mention` est retirée
// ci-dessus et que des `coords` sont posées.
//
// L'ordre est celui de l'affichage, pas un classement : les points de collecte
// se valent, et rien dans la page ne doit laisser entendre le contraire.
export const POINTS_OUVERTS = POINTS_CONFIRMES.filter(
  ({ mention, coords }) => !mention && coords,
)

// Points annoncés mais pas encore formalisés : listés sans adresse, sans
// horaires et hors carte, le dépôt s'y convient au cas par cas.
export const POINTS_EN_COURS = POINTS_CONFIRMES.filter(({ mention }) => mention)

// Horaires d'un point en une ligne : « Lundi au jeudi 8h30–13h et 14h–17h ».
export const horairesTexte = (horaires) =>
  (horaires || [])
    .map(({ jours, creneaux }) => `${jours} ${creneaux.join(' et ')}`)
    .join(' · ')

// Partenariat SITCOM40 : points de collecte en déchèterie.
// Renseigner `decheteries` avec les communes dès qu'elles sont arrêtées ;
// la page les affiche alors nommément à la place de la mention générique.
export const PARTENARIAT_SITCOM = {
  nom: 'SITCOM Côte Sud des Landes',
  nombre: 2,
  decheteries: [],
}

// Liste reprise mot pour mot de l'affiche « Liste de matériel à récolter » du
// kit de communication du challenge (version MAJ 2026). C'est cette page que
// le QR code de l'affiche ouvre : les deux doivent dire la même chose.
// Le catalogue complet de ce que l'association collecte hors challenge —
// imprimantes, scanners, box, téléphones fixes — vit sur la page « matériel
// accepté », vers laquelle cette page renvoie en bas.
export const ACCEPTE = [
  'Ordinateurs portables',
  'Unités centrales / ordinateurs fixes',
  'Mini-PC et tablettes',
  'Consoles de jeux',
  'Écrans informatiques',
  'Claviers, souris, webcams',
  'Casques et petits périphériques',
  'Smartphones et téléphones',
  'Chargeurs, câbles et adaptateurs',
  'Disques durs / SSD, mémoire, cartes graphiques',
  'Cartes mères, alimentations et composants',
]

// Énumération pour la FAQ et son balisage schema.org, construite depuis la
// liste ci-dessus pour que les deux ne divergent jamais.
export const ACCEPTE_TEXTE = ACCEPTE.join(' ; ')

// Consignes de dépôt, elles aussi reprises de l'affiche. La formulation sur
// les données personnelles est celle du kit : elle décrit le traitement et
// recommande une précaution, sans promettre de résultat — le détail de
// l'effacement sécurisé reste sur la page qui lui est consacrée.
export const CONSIGNES = [
  {
    titre: 'Même en panne ?',
    texte:
      'Oui. Le matériel n’a pas besoin d’être fonctionnel. Ressources assure le tri et le diagnostic afin d’identifier ce qui peut être réemployé, reconditionné ou orienté vers la filière adaptée.',
  },
  {
    titre: 'Données personnelles',
    texte:
      'Ressources intègre la sécurisation des données dans le traitement du matériel collecté. Par précaution, effectuez vos sauvegardes et déconnectez-vous de vos comptes avant le dépôt.',
  },
  {
    titre: 'En cas de doute',
    texte:
      'Les équipements électriques ou électroniques ne relevant pas directement de l’informatique ou du numérique doivent être vérifiés au préalable auprès de Ressources.',
  },
]

// Kit de communication du challenge, hébergé sur le kDrive de l'association :
// affiches, visuels pour les réseaux sociaux et textes prêts à publier, à
// l'usage des communes, des entreprises et des partenaires qui le relaient.
// Lien de partage — le remplacer ici si le dossier est déplacé.
export const KIT_COMMUNICATION =
  'https://kdrive.infomaniak.com/app/share/3253949/4dc72b5e-bec9-460c-99fe-e0b9ef5820ee'

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
    desc: 'Tri, effacement sécurisé des données, reconditionnement, puis redistribution solidaire sur le territoire.',
  },
]
