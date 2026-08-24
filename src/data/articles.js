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
    // image: '/photos/mon-fichier.jpg', imageAlt: 'Description de la photo',
    image: '/photos/mains-reparation.webp',
    imageAlt: 'Les mains d\'un bénévole de l\'association Ressources démontant une carte mère à l\'établi, lors du reconditionnement d\'un ordinateur.',
    imageCredit: 'Atelier de reconditionnement de l\'association Ressources.',
    imageWidth: 900,
    imageHeight: 1227,
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
        text: 'Née à Vielle-Saint-Girons en 2025, l\'association Ressources s\'est donné en 2026 une nouvelle direction : structurer une filière informatique solidaire sur le territoire. Le projet se construit progressivement, en lien avec les collectivités et les partenaires locaux : communes, syndicats intercommunaux, associations de solidarité.',
      },
      {
        type: 'heading',
        text: 'Collecter, reconditionner, redistribuer',
      },
      {
        type: 'paragraph',
        text: 'Le fonctionnement est simple : des points de collecte sont organisés sur le territoire pour récupérer les équipements inutilisés (ordinateurs, tablettes, smartphones). Ces appareils sont ensuite triés, diagnostiqués, sécurisés — avec effacement sécurisé des données personnelles — puis reconditionnés par des bénévoles formés avant d\'être redistribués à ceux qui en ont besoin.',
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

  // ── Retombée presse — ICI Gascogne « ça marche » (24/08/2026) ──
  {
    slug: 'ressources-ici-gascogne-ca-marche-500-kilos-placards',
    title: 'Ressources invitée d\'« ICI Gascogne, ça marche » : le réemploi informatique au micro',
    excerpt: 'Lundi 24 août 2026, notre coordinateur Boris Lalanne était l\'invité de Marie-Cécile Gardey dans l\'émission « ICI Gascogne, ça marche ». Douze minutes d\'antenne pour parler du défi collecte, du reconditionnement et de la seconde vie du matériel informatique. Réécoutez l\'émission en replay.',
    category: 'association',
    date: '2026-08-24',
    dateLabel: 'Août 2026',
    readingTime: '2 min',
    featured: false,
    image: '/photos/ici-gascogne-ca-marche.webp',
    imageAlt: 'Selfie de Boris Lalanne, coordinateur de l\'association Ressources, avec l\'équipe d\'ICI Gascogne dans le studio de la radio.',
    imageCredit: 'Studio d\'ICI Gascogne, 24 août 2026 — photo association Ressources.',
    imageFit: 'natural',
    imageWidth: 1280,
    imageHeight: 960,
    content: [
      {
        type: 'paragraph',
        text: 'Après la chronique du 18 août, ICI Gascogne (France Bleu) nous a de nouveau tendu le micro. Lundi 24 août 2026, notre coordinateur Boris Lalanne était l\'invité de Marie-Cécile Gardey dans l\'émission « ICI Gascogne, ça marche » : douze minutes en direct pour raconter le projet de la recyclerie et le défi que l\'association lance sur tout le territoire d\'ici au 3 octobre.',
      },
      {
        type: 'link',
        label: 'Écouter l\'émission (12 min) sur ici.fr',
        href: 'https://www.ici.fr/emissions/ici-gascogne-ca-marche-avec-marie-cecile-gardey/ordinateurs-telephones-tablettes-la-recyclerie-landaise-ressources-veut-sortir-500-kilos-de-materiel-de-vos-placards-8294630',
        note: 'Replay et podcast disponibles sur le site d\'ICI Gascogne — émission « ICI Gascogne, ça marche » avec Marie-Cécile Gardey, 24 août 2026.',
      },
      {
        type: 'heading',
        text: 'Ce que nous avons partagé à l\'antenne',
      },
      {
        type: 'paragraph',
        text: 'Le cœur du sujet, c\'est le défi collecte : du 1er septembre au 3 octobre, réunir 500 kilos de matériel informatique oublié dans les tiroirs et les placards des Landes. Mais l\'émission a surtout permis d\'expliquer le pourquoi. L\'enjeu environnemental d\'abord : fabriquer un seul ordinateur mobilise près de 800 kilos de matières premières. Prolonger la vie d\'un appareil, c\'est éviter tout cela. L\'enjeu social ensuite : chaque équipement reconditionné peut rejoindre une famille, un senior ou une association qui en a besoin, et réduire un peu la fracture numérique sur le territoire.',
      },
      {
        type: 'paragraph',
        text: 'Nous avons aussi évoqué la tombola solidaire à 5 € qui accompagne le lancement — avec, parmi les lots, un ordinateur gamer reconditionné par nos soins — et dont les recettes serviront en priorité à créer le premier emploi de la recyclerie.',
      },
      {
        type: 'heading',
        text: 'Merci à ICI Gascogne',
      },
      {
        type: 'paragraph',
        text: 'Pour une association qui démarre, ces rendez-vous à l\'antenne comptent énormément : ils font connaître le projet bien au-delà de Vielle-Saint-Girons et donnent envie de participer. Merci à Marie-Cécile Gardey et à toute la rédaction d\'ICI Gascogne pour leur accueil et leur soutien renouvelé.',
      },
      {
        type: 'heading',
        text: 'Participer au défi',
      },
      {
        type: 'paragraph',
        text: 'Vous avez du matériel informatique qui dort ? Rendez-vous sur la page du défi collecte pour connaître les points de dépôt et suivre la progression vers les 500 kilos. Et pour soutenir l\'association tout en tentant votre chance, la tombola solidaire est ouverte. La pesée finale et la journée de lancement, c\'est le samedi 3 octobre 2026 à Vielle-Saint-Girons.',
      },
    ],
  },

  // ── Retombée presse — ICI Gascogne ──
  {
    slug: 'ici-gascogne-defi-500-kg-collecte-informatique-landes',
    title: 'La recyclerie Ressources sur ICI Gascogne : 500 kilos de matériel informatique à collecter dans les Landes',
    excerpt: 'Le 18 août 2026, la chronique « L\'éco d\'ici dans les Landes » d\'ICI Gascogne consacrait trois minutes au défi collecte de l\'association Ressources : réunir 500 kilos de matériel informatique entre le 1er septembre et le 3 octobre. Réécoutez la chronique et retrouvez tout ce qu\'il faut savoir pour y participer.',
    category: 'association',
    date: '2026-08-18',
    dateLabel: 'Août 2026',
    readingTime: '3 min',
    featured: false,
    image: '/photos/chronique-ici-gascogne-eco-d-ici.webp',
    imageAlt: 'Micro de studio de radio sur son bras articulé, devant une table de mixage et un écran d\'ordinateur, en noir et blanc.',
    imageCredit: 'Studio de radio — photo d\'illustration.',
    imageWidth: 1027,
    imageHeight: 862,
    content: [
      {
        type: 'paragraph',
        text: 'Mardi 18 août 2026, la chronique « L\'éco d\'ici dans les Landes », sur ICI Gascogne, est venue parler de nous. Trois minutes pour présenter le défi que l\'association Ressources lance sur le territoire : rassembler 500 kilos de matériel informatique inutilisé avant sa journée de lancement, le 3 octobre à Vielle-Saint-Girons. Merci à la rédaction d\'ICI Gascogne pour cette mise en lumière.',
      },
      {
        type: 'audio',
        label: 'Réécouter la chronique',
        src: '/audio/chronique-ici-gascogne-18-08-2026.mp3',
        title: 'L\'éco d\'ici dans les Landes — « 500 kilos de déchets numériques à collecter dans les Landes à la recyclerie de Vielle-Saint-Girons »',
        duration: '3 min 09',
        durationIso: 'PT3M9S',
        credit: '© Radio France — ICI Gascogne. Chronique « L\'éco d\'ici dans les Landes » de Thibault Menanteau, diffusée le 18 août 2026. Reproduite avec l\'aimable autorisation de la rédaction.',
        sourceUrl: 'https://www.ici.fr/radio/gascogne/derniers-podcasts',
        sourceLabel: 'Les podcasts d\'ICI Gascogne',
      },
      {
        type: 'heading',
        text: 'Le défi : 500 kilos entre le 1er septembre et le 3 octobre',
      },
      {
        type: 'paragraph',
        text: 'Du 1er septembre au 3 octobre 2026, Ressources invite les habitants, les entreprises et les collectivités des Landes à sortir de leurs tiroirs et de leurs placards les équipements informatiques dont ils ne se servent plus. Chaque dépôt est pesé et enregistré, et le total progresse semaine après semaine vers l\'objectif. La pesée finale se fera en public le 3 octobre, lors de la journée de lancement de l\'association à Vielle-Saint-Girons.',
      },
      {
        type: 'heading',
        text: '« Déchets numériques » : le mot mérite une nuance',
      },
      {
        type: 'paragraph',
        text: 'La chronique parle de déchets numériques, et c\'est bien de cela qu\'il s\'agit tant que le matériel dort dans un tiroir. Mais notre travail consiste précisément à faire en sorte qu\'il n\'en soit pas un. Un ordinateur de cinq ou six ans, un écran, une tablette : la plupart de ces appareils fonctionnent encore, ou se réparent à un coût raisonnable. Notre priorité est le réemploi — remettre l\'appareil en service chez quelqu\'un d\'autre — et le recyclage n\'intervient que pour ce qui ne peut vraiment plus servir.',
      },
      {
        type: 'heading',
        text: 'Ce que nous collectons',
      },
      {
        type: 'paragraph',
        text: 'Ordinateurs portables et fixes, écrans, claviers et souris, tablettes et smartphones, câbles, chargeurs et périphériques, imprimantes et petits équipements réseau. En état de marche ou en panne : le diagnostic, c\'est notre travail, pas le vôtre. Inutile d\'effacer quoi que ce soit avant de déposer votre appareil — l\'effacement sécurisé des données fait partie de notre processus, et un certificat peut être remis sur demande.',
      },
      {
        type: 'heading',
        text: 'Où déposer son matériel ?',
      },
      {
        type: 'paragraph',
        text: 'Trois points de collecte sont annoncés pour ce défi — à Vielle-Saint-Girons auprès de l\'association, et chez deux enseignes partenaires à Soustons et à Linxe — auxquels s\'ajoutent des déchèteries du SITCOM Côte Sud des Landes. Ces points sont en cours de formalisation avec nos partenaires : la liste à jour, avec les adresses et les horaires dès qu\'ils sont arrêtés, est publiée sur la page du défi collecte. En attendant, un message à contact@ressourcesrecyclerie.fr suffit pour convenir d\'une remise.',
      },
      {
        type: 'heading',
        text: 'Et ensuite ?',
      },
      {
        type: 'paragraph',
        text: 'Le matériel collecté est trié, ses données sont effacées de façon sécurisée, puis il est diagnostiqué et reconditionné par nos bénévoles avant d\'être redistribué sur le territoire — à des familles, des seniors, des associations ou des structures d\'accompagnement social des Landes. Ce qui ne peut être réemployé part vers les filières de recyclage agréées. C\'est tout l\'objet de la recyclerie : que ce qui est jeté ici serve à quelqu\'un juste à côté.',
      },
      {
        type: 'paragraph',
        text: 'Rendez-vous le samedi 3 octobre 2026 à Vielle-Saint-Girons pour la pesée finale, la journée de lancement et la tombola solidaire. D\'ici là, chaque appareil déposé compte.',
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
    image: '/photos/console-reconditionnee.webp',
    imageAlt: 'Une console de jeu portable reconditionnée, allumée sur l\'écran d\'accueil d\'un jeu, posée sur un établi en bois.',
    imageCredit: 'Console reconditionnée par l\'association Ressources.',
    imageWidth: 900,
    imageHeight: 594,
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
        text: 'L\'effacement sécurisé des données est une étape non négociable : avant toute redistribution, les disques durs sont effacés selon des standards reconnus, et un certificat peut être remis au donateur.',
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
    image: '/photos/reinitialisation-ordinateur.webp',
    imageAlt: 'L\'écran d\'un ordinateur portable affichant « Réinitialisation de ce PC, 41 % », étape de remise à zéro avant redistribution.',
    imageCredit: 'Remise à zéro d\'un ordinateur avant redistribution — photo Ressources.',
    imageWidth: 1440,
    imageHeight: 802,
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
    image: '/photos/demontage-ordinateur-etabli.webp',
    imageAlt: 'Un ordinateur portable entièrement démonté sur un établi : châssis, carte mère, écran et coffret de tournevis disposés côte à côte.',
    imageCredit: 'Démontage complet d\'un ordinateur portable à l\'atelier — photo Ressources.',
    imageWidth: 1200,
    imageHeight: 678,
    content: [
      {
        type: 'paragraph',
        text: 'Depuis le lancement de son projet de recyclerie au début de l\'année 2026, l\'association Ressources en construit progressivement les bases opérationnelles. Ces premiers mois ont été consacrés à la consolidation des partenariats institutionnels et à la mobilisation de l\'équipe bénévole.',
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

  // ── Article comment soutenir ──
  {
    slug: 'comment-soutenir-association-recyclerie-landes',
    title: 'Comment soutenir une association solidaire dans les Landes ? Dons, bénévolat, mécénat',
    excerpt: 'Vous souhaitez soutenir une initiative citoyenne dans les Landes ? Voici les différentes façons de contribuer à l\'association Ressources : don financier, achat de billets de tombola, bénévolat ou mécénat d\'entreprise.',
    category: 'association',
    date: '2026-09-15',
    dateLabel: 'Septembre 2026',
    readingTime: '4 min',
    featured: false,
    image: '/photos/carte-mere-pate-thermique.webp',
    imageAlt: 'Gros plan sur la carte mère d\'un ordinateur portable en cours de remise en état, avec un tube de pâte thermique posé près du processeur.',
    imageCredit: 'Remise en état d\'une carte mère à l\'atelier — photo Ressources.',
    imageWidth: 1200,
    imageHeight: 554,
    content: [
      {
        type: 'paragraph',
        text: 'Soutenir une association locale, c\'est agir concrètement pour son territoire. L\'association Ressources, recyclerie informatique et végétale solidaire basée à Vielle-Saint-Girons dans les Landes, propose plusieurs formes d\'engagement adaptées à chaque profil — particulier, entreprise, ou simplement curieux.',
      },
      {
        type: 'heading',
        text: 'Le don financier : simple et direct',
      },
      {
        type: 'paragraph',
        text: 'Le don est la façon la plus directe de soutenir la recyclerie. Dès 10 €, votre contribution participe au tri, à l\'étiquetage et à la préparation des ressources collectées. À 100 €, vous financez le reconditionnement complet d\'un ordinateur redistribué à une famille, un senior ou une association du territoire. Les dons sont acceptés en ligne via HelloAsso, sur la page dédiée du site.',
      },
      {
        type: 'heading',
        text: 'La tombola solidaire du 03 octobre 2026',
      },
      {
        type: 'paragraph',
        text: 'Pour les amateurs de sensations fortes, la tombola solidaire est une façon festive de soutenir l\'association tout en tentant de gagner l\'un des nombreux lots offerts par les partenaires locaux — plus de 30 dotations. Les billets sont disponibles en ligne et sur place le jour de l\'événement à Vielle-Saint-Girons. Le tirage au sort se déroule en public le 03 octobre 2026.',
      },
      {
        type: 'heading',
        text: 'Le bénévolat : donner de son temps',
      },
      {
        type: 'paragraph',
        text: 'L\'association recherche activement des bénévoles pour ses deux filières. Pas besoin d\'être technicien informatique : des profils variés sont les bienvenus — logistique, communication, accueil, tri, jardinage. Un engagement flexible, adapté à votre disponibilité, au service d\'un projet ancré dans le territoire landais.',
      },
      {
        type: 'heading',
        text: 'Le mécénat : pour les entreprises et commerces locaux',
      },
      {
        type: 'paragraph',
        text: 'Entreprises, artisans et commerçants des Landes peuvent soutenir Ressources via un partenariat de mécénat. En échange d\'un soutien financier ou matériel, votre structure bénéficie d\'une visibilité sur les supports de l\'association et d\'une association d\'image à un projet solidaire et citoyen. Plusieurs formules sont proposées, adaptées à la taille et aux objectifs de chaque partenaire.',
      },
      {
        type: 'paragraph',
        text: 'Quelle que soit la forme de votre soutien, chaque contribution compte pour faire vivre la recyclerie solidaire des Landes. Contactez l\'association à contact@ressourcesrecyclerie.fr pour en savoir plus ou pour toute question.',
      },
    ],
  },

  // ── Article tombola ──
  {
    slug: 'tombola-solidaire-recyclerie-landes-2026',
    title: 'Tombola solidaire : soutenez la recyclerie Ressources et tentez de gagner plus de 30 lots',
    excerpt: 'Le 03 octobre 2026 à Vielle-Saint-Girons, l\'association Ressources organise une grande tombola solidaire. Plus de 30 lots offerts par nos partenaires locaux, et des fonds directement investis dans la recyclerie informatique et végétale des Landes.',
    category: 'evenements',
    date: '2026-09-05',
    dateLabel: 'Septembre 2026',
    readingTime: '4 min',
    featured: false,
    image: '/photos/tombola-vignette.webp',
    imageFit: 'natural',
    imageAlt: 'Visuel de la tombola solidaire de l\'association Ressources : plus de 4 000 € de lots à gagner, ticket à 5 €, tirage le 3 octobre 2026.',
    imageWidth: 1280,
    imageHeight: 720,
    content: [
      {
        type: 'paragraph',
        text: 'Pour soutenir le lancement de la recyclerie solidaire Ressources dans les Landes, l\'association organise une tombola lors de son événement de lancement le 03 octobre 2026 à Vielle-Saint-Girons. Une façon festive et concrète de contribuer au réemploi informatique et végétal sur le territoire.',
      },
      {
        type: 'heading',
        text: 'Pourquoi une tombola solidaire ?',
      },
      {
        type: 'paragraph',
        text: 'Une tombola, c\'est un don qui donne quelque chose en retour. En achetant un billet, vous soutenez directement les actions de l\'association — équipement de l\'atelier, outils de reconditionnement, frais de collecte — tout en tentant votre chance pour remporter l\'un des nombreux lots offerts par les partenaires locaux. Un modèle simple, transparent et ancré dans la tradition associative française.',
      },
      {
        type: 'heading',
        text: 'Plus de 30 lots à gagner',
      },
      {
        type: 'paragraph',
        text: 'Nos partenaires locaux — commerçants, artisans, entreprises et structures du territoire landais — ont répondu présent pour constituer une dotation exceptionnelle de plus de 30 lots. Les lots seront annoncés en détail courant septembre 2026. Restez connectés sur nos actualités pour la révélation complète.',
      },
      {
        type: 'heading',
        text: 'Comment participer ?',
      },
      {
        type: 'paragraph',
        text: 'Les billets sont disponibles en ligne via notre partenaire HelloAsso, directement depuis la page Tombola de notre site. Vous pouvez également en acheter sur place le jour de l\'événement, le 03 octobre 2026 à Vielle-Saint-Girons. Le tirage au sort aura lieu en public lors de la journée de lancement, en présence des participants et des partenaires.',
      },
      {
        type: 'heading',
        text: 'À quoi servent les fonds récoltés ?',
      },
      {
        type: 'paragraph',
        text: 'Les recettes de la tombola financent directement les actions de la recyclerie : collectes et logistique territoriale (35 %), diagnostic et reconditionnement informatique et végétal (25 %), stockage et traçabilité (15 %), redistribution solidaire et ateliers de sensibilisation (15 %), communication locale (10 %). Chaque billet acheté contribue concrètement à ces actions.',
      },
      {
        type: 'paragraph',
        text: 'L\'association Ressources est une association loi 1901 à but non lucratif, basée à Vielle-Saint-Girons (Landes, 40560). La transparence financière fait partie de nos engagements fondateurs. Un bilan de l\'événement sera publié sur nos actualités après le 03 octobre 2026.',
      },
    ],
  },

  // ── Actualité associative ──
  {
    slug: 'evenement-lancement-03-octobre-2026',
    title: 'Événement de lancement — 03 octobre 2026 à Vielle-Saint-Girons',
    excerpt: 'L\'association Ressources organise sa grande journée de lancement le 03 octobre 2026 à Vielle-Saint-Girons. Au programme : challenge collecte 1/2 tonne, tombola solidaire avec plus de 30 lots, et festivités.',
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
