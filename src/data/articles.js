/**
 * Articles & actualités — Association Ressources
 * Structure de données centrale pour le hub éditorial.
 * Ajouter un article ici suffit pour l'afficher sur le site.
 */

export const CATEGORIES = [
  { id: 'all',              label: 'Tous les articles' },
  { id: 'association',      label: 'Vie de l\'association' },
  { id: 'informatique',     label: 'Réemploi informatique' },
  { id: 'numerique',        label: 'Inclusion numérique' },
  { id: 'vegetale',         label: 'Recyclerie végétale' },
  { id: 'circulaire',       label: 'Économie circulaire' },
  { id: 'partenariats',     label: 'Partenariats & territoire' },
  { id: 'evenements',       label: 'Événements' },
]

export const ARTICLES = [
  // ── Article mis en avant ──
  {
    slug: 'pourquoi-creer-une-recyclerie-informatique-solidaire-landes',
    title: 'Pourquoi créer une recyclerie informatique solidaire dans les Landes ?',
    excerpt: 'Derrière chaque ordinateur inutilisé se cache une ressource potentielle pour un habitant, une association ou une école du territoire. L\'association Ressources naît de cette conviction : le réemploi numérique est un levier d\'inclusion concret, ancré dans les Landes.',
    category: 'informatique',
    date: '2026-09-10',
    dateLabel: 'Septembre 2026',
    readingTime: '5 min',
    featured: true,
    image: null,
    content: [
      {
        type: 'paragraph',
        text: 'Dans les Landes, comme partout en France rurale, de nombreux équipements informatiques finissent au fond d\'un tiroir ou au dépôt-vente, alors que des familles, des associations et des structures sociales manquent de matériel numérique fonctionnel. C\'est ce décalage que l\'association Ressources cherche à combler.',
      },
      {
        type: 'heading',
        text: 'Un territoire, un projet',
      },
      {
        type: 'paragraph',
        text: 'Née à Vielle-Saint-Girons en 2025, l\'association Ressources se structure autour d\'une filière informatique solidaire. Le projet se construit progressivement, en lien avec les collectivités et les partenaires locaux : communes, syndicats intercommunaux, associations de solidarité.',
      },
      {
        type: 'heading',
        text: 'Collecter, reconditionner, redistribuer',
      },
      {
        type: 'paragraph',
        text: 'Le fonctionnement est simple : des points de collecte sont organisés sur le territoire pour récupérer les équipements inutilisés (ordinateurs, tablettes, smartphones). Ces appareils sont ensuite triés, diagnostiqués, sécurisés — avec effacement certifié des données personnelles — puis reconditionnés par des bénévoles formés avant d\'être redistribués à ceux qui en ont besoin.',
      },
      {
        type: 'heading',
        text: 'Un enjeu environnemental autant que social',
      },
      {
        type: 'paragraph',
        text: 'Chaque appareil reconditionné, c\'est une tonne de CO₂ évitée par rapport à la fabrication d\'un équipement neuf, selon les estimations de l\'ADEME. La démarche de Ressources s\'inscrit donc dans une logique d\'économie circulaire locale, où l\'impact social et l\'impact environnemental se renforcent mutuellement.',
      },
      {
        type: 'paragraph',
        text: 'L\'association prépare ses premières actions de collecte pour l\'automne 2026. Si vous souhaitez contribuer — en donnant du matériel, en devenant bénévole, ou en soutenant le projet — toutes les informations sont disponibles sur ce site.',
      },
    ],
  },

  // ── Article 2 ──
  {
    slug: 'reemploi-informatique-seconde-vie-materiel-numerique',
    title: 'Réemploi informatique : donner une seconde vie au matériel numérique',
    excerpt: 'Un ordinateur portable de 5 ans peut encore fonctionner parfaitement après reconditionnement. Le réemploi informatique est une pratique en plein essor, portée par des associations comme Ressources dans les Landes.',
    category: 'informatique',
    date: '2026-08-20',
    dateLabel: 'Août 2026',
    readingTime: '4 min',
    featured: false,
    image: null,
    content: [
      {
        type: 'paragraph',
        text: 'Le réemploi informatique consiste à collecter des appareils numériques fonctionnels ou réparables, à les remettre en état, puis à les redistribuer à de nouveaux utilisateurs. Cette pratique s\'inscrit dans le cadre plus large de l\'économie circulaire et répond à un double enjeu : réduire les déchets électroniques et lutter contre la fracture numérique.',
      },
      {
        type: 'heading',
        text: 'Quels équipements peuvent être reconditionnés ?',
      },
      {
        type: 'paragraph',
        text: 'La plupart des équipements informatiques grand public peuvent bénéficier d\'un reconditionnement : ordinateurs portables et fixes, tablettes, smartphones, écrans, claviers, souris. La condition principale est que l\'appareil soit en état de fonctionner ou réparable à un coût raisonnable.',
      },
      {
        type: 'heading',
        text: 'Le processus chez Ressources',
      },
      {
        type: 'paragraph',
        text: 'L\'association Ressources prépare un processus structuré en six étapes : collecte, tri, sécurisation des données, diagnostic technique, reconditionnement et redistribution. Chaque étape est documentée pour garantir la traçabilité du matériel et la sécurité des données personnelles des donateurs.',
      },
      {
        type: 'paragraph',
        text: 'L\'effacement certifié des données est une étape non négociable : avant toute redistribution, les disques durs sont effacés selon des standards reconnus, et un certificat peut être remis au donateur.',
      },
    ],
  },

  // ── Article 3 ──
  {
    slug: 'inclusion-numerique-enjeu-local',
    title: 'Inclusion numérique : un enjeu local pour les habitants et les associations',
    excerpt: 'L\'accès au numérique n\'est pas uniforme sur le territoire des Landes. Des familles, des seniors, des demandeurs d\'emploi manquent d\'équipements ou de compétences pour s\'intégrer pleinement dans la vie numérique.',
    category: 'numerique',
    date: '2026-07-15',
    dateLabel: 'Juillet 2026',
    readingTime: '4 min',
    featured: false,
    image: null,
    content: [
      {
        type: 'paragraph',
        text: 'En France, plusieurs millions de personnes restent éloignées du numérique. Ce phénomène, appelé fracture numérique, touche particulièrement les zones rurales, les seniors, les personnes en situation de précarité et les familles monoparentales. Dans les Landes, cette réalité est présente sur le territoire, même si elle reste difficile à quantifier précisément.',
      },
      {
        type: 'heading',
        text: 'L\'équipement, premier obstacle',
      },
      {
        type: 'paragraph',
        text: 'Avant même la question des compétences numériques, l\'accès à un équipement fonctionnel représente le premier frein pour de nombreuses personnes. Un ordinateur neuf d\'entrée de gamme coûte entre 300 et 500 euros, une somme inaccessible pour certains budgets. C\'est là que le réemploi informatique joue un rôle essentiel.',
      },
      {
        type: 'heading',
        text: 'Ce que Ressources souhaite développer',
      },
      {
        type: 'paragraph',
        text: 'L\'association souhaite développer des partenariats avec les structures locales d\'accompagnement social — CCAS, épiceries sociales, structures d\'insertion — pour orienter les équipements reconditionnés vers les personnes qui en ont le plus besoin. Des échanges sont engagés avec plusieurs acteurs du territoire dans cette perspective.',
      },
      {
        type: 'paragraph',
        text: 'À plus long terme, Ressources envisage également d\'accompagner la redistribution de matériel avec des actions de sensibilisation aux usages numériques de base, en lien avec des organismes de formation ou des aidants numériques locaux.',
      },
    ],
  },

  // ── Article 4 ──
  {
    slug: 'recyclerie-vegetale-ressources-locales',
    title: 'Recyclerie végétale : valoriser les plantes, les boutures et les ressources locales',
    excerpt: 'En parallèle de la filière informatique, Ressources développe une filière végétale originale : collecter plantes, boutures, contenants et outils de jardinage pour les redistribuer sur le territoire landais.',
    category: 'vegetale',
    date: '2026-07-01',
    dateLabel: 'Juillet 2026',
    readingTime: '3 min',
    featured: false,
    image: null,
    content: [
      {
        type: 'paragraph',
        text: 'La filière végétale de l\'association Ressources part d\'un constat simple : chaque jardin recèle des ressources inexploitées. Des plantes en surplus, des boutures à partager, des contenants inutilisés, des outils de jardinage dormants… Ces ressources pourraient bénéficier à d\'autres habitants, à des jardins partagés ou à des espaces verts associatifs.',
      },
      {
        type: 'heading',
        text: 'Une filière complémentaire et ancrée localement',
      },
      {
        type: 'paragraph',
        text: 'La recyclerie végétale s\'inscrit dans la même logique que la filière informatique : collecter, trier, soigner si nécessaire, puis redistribuer. Des points de collecte sont prévus sur le territoire, en lien avec les communes partenaires et les structures locales.',
      },
      {
        type: 'heading',
        text: 'Ce que nous acceptons',
      },
      {
        type: 'paragraph',
        text: 'Plantes d\'intérieur et d\'extérieur, boutures et jeunes plants, pots et contenants en bon état, outils de jardinage, graines et bulbes, petit matériel de jardinage. Une liste détaillée est disponible sur la page dédiée à la recyclerie végétale.',
      },
      {
        type: 'paragraph',
        text: 'Les partenaires végétaux — pépiniéristes, jardins partagés, communes — sont également invités à se rapprocher de l\'association pour envisager des collaborations.',
      },
    ],
  },

  // ── Article 5 ──
  {
    slug: 'ressources-prepare-premieres-actions-collecte',
    title: 'Ressources prépare ses premières actions de collecte solidaire',
    excerpt: 'L\'association Ressources entre dans une phase active de préparation. Les partenariats institutionnels se structurent, les bénévoles se mobilisent, et les premières opérations de collecte se dessinent pour l\'automne 2026.',
    category: 'association',
    date: '2026-05-20',
    dateLabel: 'Mai 2026',
    readingTime: '3 min',
    featured: false,
    image: null,
    content: [
      {
        type: 'paragraph',
        text: 'Depuis sa création en 2025, l\'association Ressources construit progressivement les bases opérationnelles de son projet. Le premier semestre 2026 a été consacré à la consolidation des partenariats institutionnels et à la mobilisation de l\'équipe bénévole.',
      },
      {
        type: 'heading',
        text: 'Des partenariats qui se structurent',
      },
      {
        type: 'paragraph',
        text: 'Des échanges sont engagés avec plusieurs collectivités du territoire : communes, communautés de communes, syndicats intercommunaux. Ces discussions visent à définir les modalités pratiques des collectes — lieux, fréquences, logistique — et à identifier les bénéficiaires potentiels des équipements reconditionnés.',
      },
      {
        type: 'heading',
        text: 'Un appel aux bénévoles lancé',
      },
      {
        type: 'paragraph',
        text: 'Ressources recherche activement des bénévoles pour ses deux filières. Les profils recherchés sont variés : personnes avec des compétences en informatique pour le reconditionnement, mais aussi des personnes motivées sans compétences techniques particulières pour la logistique, la communication ou l\'animation.',
      },
      {
        type: 'paragraph',
        text: 'Si vous souhaitez rejoindre l\'équipe, toutes les informations sont disponibles sur la page "Nous rejoindre". L\'association accueille les candidatures tout au long de l\'année.',
      },
    ],
  },

  // ── Actualité associative ──
  {
    slug: 'evenement-lancement-03-octobre-2026',
    title: 'Événement de lancement — 03 octobre 2026 à Vielle-Saint-Girons',
    excerpt: 'L\'association Ressources organise sa grande journée de lancement le 03 octobre 2026 à Vielle-Saint-Girons. Au programme : challenge collecte 1 tonne, tombola solidaire avec plus de 7 000 € de lots, et festivités.',
    category: 'evenements',
    date: '2026-09-01',
    dateLabel: 'Septembre 2026',
    readingTime: '2 min',
    featured: false,
    image: null,
    externalLink: '/evenement-lancement-03-octobre-2026/',
    content: [],
  },
]

/* Helpers */
export function getArticleBySlug(slug) {
  return ARTICLES.find(a => a.slug === slug) || null
}

export function getFeaturedArticle() {
  return ARTICLES.find(a => a.featured) || ARTICLES[0]
}

export function getArticlesByCategory(categoryId) {
  if (categoryId === 'all') return ARTICLES
  return ARTICLES.filter(a => a.category === categoryId)
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}
