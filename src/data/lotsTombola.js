// Lots de la tombola solidaire du 03 octobre 2026.
// Source : Suivi_lots_tombola_RESSOURCES au 21/07/2026 (révision du 29/07).
// valeur = null lorsque le montant reste à confirmer avec le partenaire.

export const CATEGORIES = [
  { id: 'sejours', label: 'Séjours & expériences' },
  { id: 'informatique', label: 'Informatique reconditionnée' },
  { id: 'loisirs', label: 'Loisirs & bien-être' },
  { id: 'artisanat', label: 'Artisanat & créations' },
  { id: 'gourmand', label: 'Restauration & produits locaux' },
  { id: 'commerce', label: "Bons d'achat & commerces" },
]

// Le gros lot, mis en vedette en haut de la page.
// Dotation validée au 21/07/2026, dévoilée le 29/07 sur accord de Boris.
// Offerte par des particuliers : leur nom n'est pas publié, comme pour les
// autres dons privés de la page.
// Pour remasquer le lot (si le bien, actuellement en vente, était cédé),
// rajouter `statut: 'en-cours'` : la page réaffiche alors LIBELLE_EN_COURS.
export const LOT_PRINCIPAL = {
  numero: '1',
  titre: 'Le gros lot',
  lot: 'Un séjour d’une semaine en villa sur la côte landaise pour 4 personnes',
  detail: 'Don d’un particulier',
  valeur: 1500,
  // Photo d'extérieur de la villa (fichier dans /public/lots/).
  // Mettre à null pour revenir à un bandeau sans visuel.
  photo: '/lots/villa-cote-landaise.jpg',
  photoAlt:
    'Villa avec piscine sur la côte landaise, gros lot de la tombola solidaire de l’association Ressources',
}

export const LIBELLE_EN_COURS = 'En cours de finalisation'

export const LOTS_CONFIRMES = [
  // Séjours & expériences
  { lot: 'Vol en montgolfière', partenaire: 'Sud Ouest Montgolfière', categorie: 'sejours', valeur: 200, detail: '1 vol · départ en Béarn' },
  { lot: 'Randonnée découverte d’1 h', partenaire: 'Jet Landes Family', categorie: 'sejours', valeur: 120, detail: '1 bon' },
  { lot: 'Découverte du surfcasting', partenaire: 'Pêcheur de Capbreton', categorie: 'sejours', valeur: 100, detail: '1 bon cadeau' },
  { lot: 'Découverte de la pêche en mer', partenaire: 'Cap Pêche Loisirs', categorie: 'sejours', valeur: 80, detail: '1 bon cadeau · sortie de 2 h' },
  { lot: 'Séance découverte de surf', partenaire: 'Max Respect', categorie: 'sejours', valeur: 35, detail: '1 séance de 2 h' },

  // Informatique reconditionnée
  { lot: 'Ordinateur gaming reconditionné', partenaire: 'Ressources', categorie: 'informatique', valeur: 500, detail: '1 équipement' },
  { lot: 'Ordinateur portable reconditionné', partenaire: 'Ressources', categorie: 'informatique', valeur: 200, detail: '1 équipement' },
  // Maintenu hors podium malgré sa valeur, pour ne pas y aligner trois ordinateurs.
  { lot: 'Ordinateur de bureau reconditionné', partenaire: 'Ressources', categorie: 'informatique', valeur: 200, detail: '1 équipement', podium: false },

  // Loisirs & bien-être
  { lot: 'Vélo de ville avec son panier', partenaire: 'Joe Bike', categorie: 'loisirs', valeur: 398, detail: '1 vélo · à retirer au magasin' },
  { lot: 'Location de vélos pour 2 personnes', partenaire: 'La Cyclerie de Léon', categorie: 'loisirs', valeur: 70, detail: '1 location' },
  { lot: 'Location de vélos pour 2 personnes', partenaire: 'La Cyclerie de Léon', categorie: 'loisirs', valeur: 70, detail: '1 location' },
  { lot: 'Massage crânien', partenaire: 'Naturellement Nomade', categorie: 'loisirs', valeur: 55, detail: '1 prestation' },
  { lot: 'Entrées à la base de loisirs', partenaire: 'Evad’Sport', categorie: 'loisirs', valeur: 50.5, detail: '3 entrées' },

  // Artisanat & créations
  { lot: 'Céramiques faites main', partenaire: 'Rose M la Céramique', categorie: 'artisanat', valeur: 80, detail: '1 lot' },
  { lot: 'Deux trousses de toilette faites main', partenaire: 'Kallista Création', categorie: 'artisanat', valeur: 40, detail: '1 lot de 2 trousses' },
  { lot: 'Cours de poterie d’1 h 30', partenaire: 'Cécilou Ceramics', categorie: 'artisanat', valeur: 35, detail: '1 cours' },

  // Restauration & produits locaux
  // Dotation offerte par une particulière. Son nom n'est pas publié sans son accord.
  { lot: 'Carton de 6 bouteilles de Jurançon moelleux', partenaire: 'Don d’un particulier', categorie: 'gourmand', valeur: 70, detail: '6 bouteilles' },
  { lot: 'Bon d’achat', partenaire: 'Chez Paulette', categorie: 'gourmand', valeur: 60, detail: '1 bon' },
  { lot: 'Deux plateaux de 12 huîtres et leur verre de vin', partenaire: 'Maison Labadie', categorie: 'gourmand', valeur: 34, detail: '2 bons de dégustation' },
  { lot: 'Deux pizzas', partenaire: 'Linxe Pizza', categorie: 'gourmand', valeur: 32, detail: '1 lot de 2 pizzas' },
  { lot: 'Lot de 3 bouteilles de Côtes de Gascogne', partenaire: 'Olivier de Léon', categorie: 'gourmand', valeur: 30, detail: '3 bouteilles' },
  { lot: 'Dégustation d’huîtres pour 2 personnes au lac d’Hossegor', partenaire: 'Maison Labadie', categorie: 'gourmand', valeur: 22, detail: '1 bon cadeau' },
  { lot: 'Lot de 3 kg de myrtilles', partenaire: 'Les Jardins Bio du Médoc', categorie: 'gourmand', valeur: 20, detail: '3 kg' },
  { lot: 'Lot de 3 kg de myrtilles', partenaire: 'Les Jardins Bio du Médoc', categorie: 'gourmand', valeur: 20, detail: '3 kg' },
  { lot: 'Lot de 3 kg de myrtilles', partenaire: 'Les Jardins Bio du Médoc', categorie: 'gourmand', valeur: 20, detail: '3 kg' },
  { lot: 'Panier garni du Sud-Ouest', partenaire: 'Les 4’S', categorie: 'gourmand', valeur: 20, detail: '1 panier' },
  { lot: 'Deux menus', partenaire: 'Restaurant La Ferme d’Huchet', categorie: 'gourmand', valeur: null, detail: '1 lot de 2 menus' },
  { lot: 'Bon cadeau', partenaire: 'Restaurant Léontine', categorie: 'gourmand', valeur: 25, detail: '1 bon cadeau' },

  // Bons d'achat & commerces
  { lot: 'Bon d’achat', partenaire: 'E.Leclerc Soustons', categorie: 'commerce', valeur: 100, detail: '1 bon' },
  { lot: 'Bon d’achat', partenaire: 'E.Leclerc Express Linxe', categorie: 'commerce', valeur: 50, detail: '1 bon' },
  { lot: 'Bon d’achat', partenaire: 'Atelier Saint-Antoine', categorie: 'commerce', valeur: 40, detail: '1 bon' },
  { lot: 'Bon d’achat', partenaire: 'Wild Marcel', categorie: 'commerce', valeur: 30, detail: '1 bon' },
  { lot: 'Bon d’achat', partenaire: 'Maison Lassalle — Artisan Joaillier', categorie: 'commerce', valeur: 30, detail: '1 bon' },
  { lot: 'Bon d’achat', partenaire: 'Bain 2 Soleil', categorie: 'commerce', valeur: 30, detail: '1 bon' },
  { lot: 'Bon d’achat', partenaire: 'Épicerie 5', categorie: 'commerce', valeur: 30, detail: '1 bon' },
  { lot: 'Bon d’achat', partenaire: 'La Boucherie de Léon', categorie: 'commerce', valeur: 30, detail: '1 bon' },
  { lot: 'Bon d’achat', partenaire: 'La Linxoise', categorie: 'commerce', valeur: 10, detail: '1 bon' },
]

export const PRIX_BILLET = 5

// Points de vente physiques des billets.
// adresse : renseigner la rue dès qu'elle est vérifiée — le lien carte utilise
// une recherche par nom + commune tant qu'elle est absente, pour ne rien inventer.
export const POINTS_VENTE = [
  { nom: 'Boulangerie La Linxoise', ville: 'Linxe', adresse: null },
  { nom: 'Boulangerie La Linxoise', ville: 'Castets', adresse: null },
  { nom: 'Boulangerie La Linxoise', ville: 'Lit-et-Mixe', adresse: null },
  { nom: 'Tabac Presse', ville: 'Linxe', adresse: null },
]

export const lienCarte = ({ nom, ville, adresse }) =>
  `https://www.openstreetmap.org/search?query=${encodeURIComponent(
    [adresse, nom, ville, 'Landes'].filter(Boolean).join(' '),
  )}`

// Les commerçants, artisans et producteurs qui offrent une dotation.
// logo : chemin dans /public/logos/ — null tant que le logo n'a pas été fourni.
//   Déposer le fichier dans public/logos/ (PNG ou SVG à fond transparent de
//   préférence), puis renseigner par ex. logo: '/logos/joe-bike.png'.
//   Sans logo, la carte affiche les initiales du partenaire : rien ne casse.
// site : site web du partenaire — la carte devient alors cliquable.
// ville : commune du partenaire — null tant qu'elle n'a pas été vérifiée.
// Communes issues du tableau de bord interne tombola-ressources (21/07/2026).
// Ne jamais reprendre ici les téléphones et e-mails du tableau de bord : ce sont
// des coordonnées personnelles, la page est publique.
export const PARTENAIRES = [
  // Décollage depuis le lac du Gabas, en Béarn — hors Landes.
  // logo : le fichier fourni était vide (métadonnées macOS) — à redemander.
  { nom: 'Sud Ouest Montgolfière', logo: null, ville: 'Lourenties (Béarn)', site: 'https://sudouest-montgolfiere.fr/' },
  { nom: 'E.Leclerc Soustons', logo: '/logos/leclerc.png', ville: 'Soustons', site: 'https://www.e.leclerc/mag/e-leclerc-soustons' },
  { nom: 'E.Leclerc Express Linxe', logo: '/logos/leclerc.png', ville: 'Linxe' },
  { nom: 'La Cyclerie de Léon', logo: '/logos/la-cyclerie-de-leon.png', ville: 'Léon', site: 'https://lacyclerie-leon.fr/' },
  // Commune issue de l'adresse de retrait du lot (40150 Soorts-Hossegor).
  { nom: 'Joe Bike', logo: '/logos/joe-bike.png', ville: 'Soorts-Hossegor', site: 'https://joebike.fr/' },
  { nom: 'Jet Landes Family', logo: '/logos/jet-landes-family.webp', ville: 'Capbreton', site: 'https://www.jetlandesfamily-capbreton.com/' },
  // Aucun site ni logo (précisé dans le tableau de suivi).
  { nom: 'Pêcheur de Capbreton', logo: null, ville: 'Capbreton' },
  { nom: 'Cap Pêche Loisirs', logo: '/logos/cap-peche-loisirs.png', ville: 'Capbreton', site: 'https://www.cappecheloisirs.com/' },
  // Base de loisirs exploitée par Centrenautique, à Soustons.
  { nom: 'Evad’Sport', logo: '/logos/evad-sport.png', ville: 'Soustons', site: 'https://www.centrenautique-soustons.com/' },
  { nom: 'Max Respect', logo: '/logos/max-respect.png', ville: 'Vielle-Saint-Girons', site: 'https://www.max-respect.com/' },
  { nom: 'Naturellement Nomade', logo: null, ville: 'Vielle-Saint-Girons' },
  { nom: 'Chez Paulette', logo: '/logos/chez-paulette.png', ville: 'Vielle-Saint-Girons', site: 'https://www.instagram.com/chezpauletterotisserie/' },
  { nom: 'Maison Labadie', logo: '/logos/maison-labadie.png', ville: 'Hossegor', site: 'https://www.instagram.com/maisonlabadie/' },
  // Enseigne « Les 4'S » (cave · bar à manger) : le « LINX » du fichier source
  // désignait la commune, pas le nom. Orthographe confirmée par le logo.
  { nom: 'Les 4’S', logo: '/logos/les-4s.jpg', ville: 'Linxe', site: 'https://les4s.com/' },
  { nom: 'Linxe Pizza', logo: '/logos/linxe-pizza.jpg', ville: 'Linxe', site: 'https://www.facebook.com/linxepizza' },
  { nom: 'Restaurant La Ferme d’Huchet', logo: '/logos/ferme-huchet.jpg', ville: 'Vielle-Saint-Girons', site: 'https://www.facebook.com/lafermedhuchet/' },
  { nom: 'Restaurant Léontine', logo: '/logos/restaurant-leontine.png', ville: 'Léon', site: 'https://www.instagram.com/leontinerestaurant/' },
  { nom: 'La Boucherie de Léon', logo: '/logos/boucherie-de-leon.jpg', ville: 'Léon', site: 'https://www.facebook.com/Jerometurin2411/' },
  { nom: 'Épicerie 5', logo: '/logos/epicerie-5.jpg', ville: 'Léon', site: 'https://www.instagram.com/epicerie.5/' },
  { nom: 'La Linxoise', logo: '/logos/la-linxoise.jpg', ville: 'Linxe', site: 'https://www.instagram.com/la.linxoise__' },
  { nom: 'Olivier de Léon', logo: '/logos/olivier-de-leon.jpg', ville: 'Léon', site: 'https://www.facebook.com/p/olivier-de-l%C3%A9on-100063292146573/' },
  { nom: 'Les Jardins Bio du Médoc', logo: '/logos/jardins-bio-du-medoc.png', ville: 'Le Temple (Gironde)', site: 'https://jardinsbiodumedoc.fr/' },
  // Atelier itinérant : présent au marché de Linxe le vendredi matin.
  { nom: 'Atelier Saint-Antoine', logo: '/logos/atelier-saint-antoine.jpg', ville: 'Linxe', site: 'https://ateliersaintantoine.com/' },
  { nom: 'Maison Lassalle — Artisan Joaillier', logo: '/logos/maison-lassalle.svg', ville: 'Dax', site: 'https://www.joaillerie-lassalle.com/' },
  { nom: 'Wild Marcel', logo: '/logos/wild-marcel.jpg', ville: 'Vielle-Saint-Girons', site: 'https://www.instagram.com/wildmarcel_laboutique/' },
  { nom: 'Bain 2 Soleil', logo: null, ville: 'Léon' },

  { nom: 'Rose M la Céramique', logo: '/logos/rose-m-ceramique.jpg', ville: 'Vielle-Saint-Girons', site: 'https://www.instagram.com/rosemlaceramique/' },
  { nom: 'Cécilou Ceramics', logo: null, ville: 'Vielle-Saint-Girons' },
  { nom: 'Kallista Création', logo: '/logos/kallista-creation.png', ville: 'Lacanau', site: 'https://www.instagram.com/kallista_creations/' },
]

// Un partenaire peut être mis en attente en lui ajoutant statut: 'a-confirmer'.
export const PARTENAIRES_PUBLIES = PARTENAIRES.filter(
  ({ statut }) => statut !== 'a-confirmer',
)

// Initiales utilisées comme vignette tant qu'aucun logo n'est fourni.
// Un nom d'un seul mot donne ses deux premières lettres (Léontine → Lé).
export const initiales = (nom) => {
  const mots = nom
    .replace(/^(Restaurant|Domaine|Atelier|Maison|Les|La|Le|L’|E\.)\s*/i, '')
    .split(/[\s’'—-]+/)
    .filter(Boolean)

  if (!mots.length) return nom.slice(0, 2).toUpperCase()
  if (mots.length === 1) return mots[0].slice(0, 2).toUpperCase()

  return mots.slice(0, 2).map((mot) => mot[0].toUpperCase()).join('')
}

// Seuil d'entrée sur le podium : les lots à partir de 200 € sont mis en avant,
// numérotés à la suite du gros lot.
export const SEUIL_PODIUM = 200

const estSurPodium = ({ valeur, podium }) => podium !== false && valeur >= SEUIL_PODIUM

// Seuls les lots dont le partenaire est confirmé sont affichés publiquement.
const LOTS_PUBLIES = LOTS_CONFIRMES.filter(({ statut }) => statut !== 'a-confirmer')

export const LOTS_PODIUM = LOTS_PUBLIES
  .filter(estSurPodium)
  .sort((a, b) => b.valeur - a.valeur)

export const LOTS_SECONDAIRES = LOTS_PUBLIES.filter((lot) => !estSurPodium(lot))

// Résumé par catégorie affiché à la place du détail chiffré des petits lots,
// tant que la billetterie n'est pas lancée. Repasser au détail en réutilisant
// LOTS_SECONDAIRES dans la page.
export const RESUME_CATEGORIES = CATEGORIES.map(({ id, label }) => ({
  id,
  label,
  nombre: LOTS_SECONDAIRES.filter((lot) => lot.categorie === id).length,
})).filter(({ nombre }) => nombre > 0)

export const NB_LOTS_CONFIRMES = LOTS_PUBLIES.length

// Lots réellement acquis : on exclut ceux encore en cours de finalisation,
// y compris le gros lot. Arrondi à la dizaine inférieure pour l'accroche, afin
// qu'elle reste vraie sans avoir à la retoucher à chaque nouvelle dotation.
const NB_LOTS_ACQUIS =
  LOTS_PUBLIES.filter(({ statut }) => statut !== 'en-cours').length +
  (LOT_PRINCIPAL.statut === 'en-cours' ? 0 : 1)

export const NOMBRE_LOTS_ARRONDI = Math.floor(NB_LOTS_ACQUIS / 10) * 10

export const VALEUR_CONFIRMEE = LOTS_PUBLIES.reduce(
  (total, { valeur }) => total + (valeur || 0),
  0,
)

export const formatEuros = (valeur) =>
  valeur % 1 === 0
    ? `${valeur.toLocaleString('fr-FR')} €`
    : `${valeur.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`
