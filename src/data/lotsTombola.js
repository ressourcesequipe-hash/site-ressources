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
  { lot: '1 nuit pour 2 personnes avec petit-déjeuner', partenaire: 'Moxy Bordeaux', categorie: 'sejours', valeur: 130, detail: '1 nuit pour 2 avec PDJ', podium: true },

  // Informatique reconditionnée
  { lot: 'Ordinateur gaming reconditionné', partenaire: 'Ressources', categorie: 'informatique', valeur: 500, detail: '1 équipement' },
  // L'ordinateur portable reconditionné est retire de la tombola : conserve
  // pour un jeu annexe (demande du 2026-08-01).
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
  // Douze menus, un par mois pendant un an, valables dans n'importe quel
  // établissement de l'enseigne. Le montant dépend du menu que le gagnant
  // choisira : de 110 € s'il prend chaque fois le moins cher à 240 € s'il prend
  // chaque fois le plus cher (précision de Boris, 03/09/2026). D'où la
  // fourchette, seul lot de la dotation à en porter une.
  // C'est le plancher qui compte dans VALEUR_CONFIRMEE : mieux vaut une
  // accroche que la dotation dépasse qu'une accroche qu'elle ne tient pas.
  // podium: true — le lot est mis en avant malgré une valeur sous le seuil.
  // Il y prend la place de la carte cadeau E.Leclerc Express Linxe (29/08/2026).
  { lot: 'Un menu offert chaque mois pendant un an', partenaire: 'Jack’s Burgers', categorie: 'gourmand', valeur: 110, valeurMax: 240, detail: '12 menus · 1 par mois', podium: true },
  // Dotation offerte par une particulière. Son nom n'est pas publié sans son accord.
  { lot: 'Carton de 6 bouteilles de Jurançon moelleux', partenaire: 'Don d’un particulier', categorie: 'gourmand', valeur: 70, detail: '6 bouteilles' },
  { lot: 'Bon d’achat', partenaire: 'Chez Paulette', categorie: 'gourmand', valeur: 60, detail: '1 bon' },
  { lot: 'Deux plateaux de 12 huîtres et leur verre de vin', partenaire: 'Maison Labadie', categorie: 'gourmand', valeur: 34, detail: '2 bons de dégustation' },
  { lot: 'Deux pizzas', partenaire: 'Linxe Pizza', categorie: 'gourmand', valeur: 32, detail: '1 lot de 2 pizzas' },
  { lot: 'Lot de 3 bouteilles de Côtes de Gascogne', partenaire: 'Olivier de Léon', categorie: 'gourmand', valeur: 30, detail: '3 bouteilles' },
  { lot: 'Lot de 3 kg de myrtilles', partenaire: 'Les Jardins Bio du Médoc', categorie: 'gourmand', valeur: 20, detail: '3 kg' },
  { lot: 'Lot de 3 kg de myrtilles', partenaire: 'Les Jardins Bio du Médoc', categorie: 'gourmand', valeur: 20, detail: '3 kg' },
  { lot: 'Lot de 3 kg de myrtilles', partenaire: 'Les Jardins Bio du Médoc', categorie: 'gourmand', valeur: 20, detail: '3 kg' },
  { lot: 'Panier garni du Sud-Ouest', partenaire: 'Les 4’S', categorie: 'gourmand', valeur: 20, detail: '1 panier' },
  { lot: 'Deux menus', partenaire: 'Restaurant La Ferme d’Huchet', categorie: 'gourmand', valeur: null, detail: '1 lot de 2 menus' },
  { lot: 'Bon cadeau', partenaire: 'Restaurant Léontine', categorie: 'gourmand', valeur: 25, detail: '1 bon cadeau' },

  // Bons d'achat & commerces
  // Dotation revue a la hausse le 13/08/2026 : deux cartes cadeaux de 150 €.
  // podium: true car elles depassent desormais des lots deja mis en avant.
  { lot: 'Carte cadeau', partenaire: 'E.Leclerc Soustons', categorie: 'commerce', valeur: 150, detail: '1 carte cadeau', podium: true },
  // Celle de Linxe redescend dans la liste complète le 29/08/2026 : le lot
  // Jack’s Burgers prend sa place sur le podium. Elle reste publiée, dans
  // « Bons d'achat & commerces », à égalité de valeur avec celle de Soustons.
  { lot: 'Carte cadeau', partenaire: 'E.Leclerc Express Linxe', categorie: 'commerce', valeur: 150, detail: '1 carte cadeau', podium: false },
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
// Adresses relevées le 13/08/2026, chacune recoupée par au moins deux sources
// puis géocodée sur Nominatim (OpenStreetMap) pour en tirer les coordonnées.
// coords : [latitude, longitude] de l'épingle sur la carte, et cible du lien
// « Y aller ↗ ». Le niveau de certitude est noté commerce par commerce.
export const POINTS_VENTE = [
  // La commune de l'association, en tête de liste. Le numéro n'est pas
  // cartographié, mais OpenStreetMap connaît un commerce (shop=kiosk) à
  // l'emplacement que donne la numérotation de la route des Lacs : la
  // pharmacie est au 3073, la boulangerie au 3092, et le pas de 106 numéros
  // jusqu'au 3198 tombe à 8 m de ce point. Nom et adresse recoupés sur
  // l'annuaire des buralistes, le registre des sociétés et l'annuaire PMU.
  { nom: 'Bar Tabac Presse du Marensin', ville: 'Vielle-Saint-Girons', adresse: '3198 route des Lacs', coords: [43.9500, -1.3020] },
  // OpenStreetMap connaît la boulangerie elle-même (shop=bakery) : position exacte.
  { nom: 'Boulangerie La Linxoise', ville: 'Linxe', adresse: '254 route de l’Océan', coords: [43.9221, -1.2480] },
  // Le numéro n'est pas cartographié : épingle sur la place, qui est petite.
  { nom: 'Boulangerie La Linxoise', ville: 'Castets', adresse: '26 place Pierre-Barrère', coords: [43.8824, -1.1473] },
  // Le moins précis de la liste : ni le numéro ni l'enseigne ne sont cartographiés,
  // l'épingle est posée sur l'avenue. À resserrer si tu passes devant.
  { nom: 'Boulangerie La Linxoise', ville: 'Lit-et-Mixe', adresse: '3 avenue de la Côte d’Argent', coords: [44.0318, -1.2548] },
  { nom: 'Le Moustache Café', ville: 'Tosse', adresse: '42 avenue du Général-de-Gaulle', coords: [43.6900, -1.3319] },
  // OpenStreetMap connaît le camping (tourism=camp_site) : position exacte.
  { nom: 'Épicerie et restaurant du camping Capfun La Pomme de Pin', ville: 'Saubion', adresse: '825 route de Seignosse', coords: [43.6752, -1.3566] },
  // Adresse confirmée par le site officiel de la commune, numéro cartographié.
  { nom: 'Tabac Presse des Estagnots', ville: 'Seignosse', adresse: '52 avenue du Penon', coords: [43.6913, -1.4363] },
  // Le restaurant est au cœur du camping, qu'OpenStreetMap connaît
  // (tourism=camp_site) : position exacte. Son enseigne complète est
  // « Casa Pia — Océan », qui le distingue du « Casa Pia — Circus » de Tosse ;
  // on lui préfère le nom du camping, plus parlant pour s'y rendre. Adresse
  // reprise du site du restaurant, qui écrit « route de la plage des
  // Casernes » là où OpenStreetMap s'en tient à « route des Casernes ».
  { nom: 'Restaurant Casa Pia — camping Siblu Les Oyats', ville: 'Seignosse', adresse: 'route de la plage des Casernes', coords: [43.7231, -1.4217] },
]

// Énumération des points de vente en toutes lettres, construite depuis la liste
// ci-dessus pour que la FAQ et son balisage schema.org ne dérivent jamais de
// l'affichage. Les communes d'une même enseigne sont regroupées.
const enumerer = (items) =>
  items.length < 2
    ? items.join('')
    : `${items.slice(0, -1).join(', ')} et ${items[items.length - 1]}`

export const POINTS_VENTE_TEXTE = enumerer(
  [...POINTS_VENTE.reduce((parEnseigne, { nom, ville }) => {
    parEnseigne.set(nom, [...(parEnseigne.get(nom) || []), ville])
    return parEnseigne
  }, new Map())].map(([nom, villes]) => `${nom} à ${enumerer(villes)}`),
)

// Les commerçants, artisans et producteurs qui offrent une dotation.
// logo : chemin dans /public/logos/ — null tant que le logo n'a pas été fourni.
//   Déposer l'original dans design/logos-sources/tombola/ (fond transparent de
//   préférence), lancer `node scripts/optimiser-logos.mjs` — il en sort un WebP
//   96 px de même nom dans public/logos/ — puis renseigner par ex.
//   logo: '/logos/joe-bike.webp'. Un SVG se dépose directement dans
//   public/logos/, le script le laisse tel quel.
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
  { nom: 'E.Leclerc Soustons', logo: '/logos/leclerc.webp', ville: 'Soustons', site: 'https://www.e.leclerc/mag/e-leclerc-soustons' },
  { nom: 'E.Leclerc Express Linxe', logo: '/logos/leclerc.webp', ville: 'Linxe' },
  { nom: 'La Cyclerie de Léon', logo: '/logos/la-cyclerie-de-leon.webp', ville: 'Léon', site: 'https://lacyclerie-leon.fr/' },
  // Commune issue de l'adresse de retrait du lot (40150 Soorts-Hossegor).
  { nom: 'Joe Bike', logo: '/logos/joe-bike.webp', ville: 'Soorts-Hossegor', site: 'https://joebike.fr/' },
  { nom: 'Jet Landes Family', logo: '/logos/jet-landes-family.webp', ville: 'Capbreton', site: 'https://www.jetlandesfamily-capbreton.com/' },
  // Sans commune, contrairement aux autres : le lot vaut dans n'importe lequel
  // des établissements de l'enseigne. La carte omet alors la ligne de commune.
  { nom: 'Jack’s Burgers', logo: null, ville: null, site: 'https://www.jacksburgers.fr/' },
  // Aucun site ni logo (précisé dans le tableau de suivi).
  { nom: 'Pêcheur de Capbreton', logo: null, ville: 'Capbreton' },
  { nom: 'Cap Pêche Loisirs', logo: '/logos/cap-peche-loisirs.webp', ville: 'Capbreton', site: 'https://www.cappecheloisirs.com/' },
  // Base de loisirs exploitée par Centrenautique, à Soustons.
  { nom: 'Evad’Sport', logo: '/logos/evad-sport.webp', ville: 'Soustons', site: 'https://www.centrenautique-soustons.com/' },
  { nom: 'Max Respect', logo: '/logos/max-respect.webp', ville: 'Vielle-Saint-Girons', site: 'https://www.max-respect.com/' },
  { nom: 'Moxy Bordeaux', logo: '/logos/moxy.webp', ville: 'Bordeaux (Gironde)', site: 'https://www.marriott.com/en-us/hotels/bodox-moxy-bordeaux/overview' },
  { nom: 'Naturellement Nomade', logo: null, ville: 'Vielle-Saint-Girons' },
  { nom: 'Chez Paulette', logo: '/logos/chez-paulette.webp', ville: 'Vielle-Saint-Girons', site: 'https://www.instagram.com/chezpauletterotisserie/' },
  { nom: 'Maison Labadie', logo: '/logos/maison-labadie.webp', ville: 'Hossegor', site: 'https://www.instagram.com/maisonlabadie/' },
  // Enseigne « Les 4'S » (cave · bar à manger) : le « LINX » du fichier source
  // désignait la commune, pas le nom. Orthographe confirmée par le logo.
  { nom: 'Les 4’S', logo: '/logos/les-4s.webp', ville: 'Linxe', site: 'https://les4s.com/' },
  { nom: 'Linxe Pizza', logo: '/logos/linxe-pizza.webp', ville: 'Linxe', site: 'https://www.facebook.com/linxepizza' },
  { nom: 'Restaurant La Ferme d’Huchet', logo: '/logos/ferme-huchet.webp', ville: 'Vielle-Saint-Girons', site: 'https://www.facebook.com/lafermedhuchet/' },
  { nom: 'Restaurant Léontine', logo: '/logos/restaurant-leontine.webp', ville: 'Léon', site: 'https://www.instagram.com/leontinerestaurant/' },
  { nom: 'La Boucherie de Léon', logo: '/logos/boucherie-de-leon.webp', ville: 'Léon', site: 'https://www.facebook.com/Jerometurin2411/' },
  { nom: 'Épicerie 5', logo: '/logos/epicerie-5.webp', ville: 'Léon', site: 'https://www.instagram.com/epicerie.5/' },
  { nom: 'La Linxoise', logo: '/logos/la-linxoise.webp', ville: 'Linxe', site: 'https://www.instagram.com/la.linxoise__' },
  { nom: 'Olivier de Léon', logo: '/logos/olivier-de-leon.webp', ville: 'Léon', site: 'https://www.facebook.com/p/olivier-de-l%C3%A9on-100063292146573/' },
  { nom: 'Les Jardins Bio du Médoc', logo: '/logos/jardins-bio-du-medoc.webp', ville: 'Le Temple (Gironde)', site: 'https://jardinsbiodumedoc.fr/' },
  // Atelier itinérant : présent au marché de Linxe le vendredi matin.
  { nom: 'Atelier Saint-Antoine', logo: '/logos/atelier-saint-antoine.webp', ville: 'Linxe', site: 'https://ateliersaintantoine.com/' },
  { nom: 'Maison Lassalle — Artisan Joaillier', logo: '/logos/maison-lassalle.svg', ville: 'Dax', site: 'https://www.joaillerie-lassalle.com/' },
  { nom: 'Wild Marcel', logo: '/logos/wild-marcel.webp', ville: 'Vielle-Saint-Girons', site: 'https://www.instagram.com/wildmarcel_laboutique/' },
  { nom: 'Bain 2 Soleil', logo: null, ville: 'Léon' },

  { nom: 'Rose M la Céramique', logo: '/logos/rose-m-ceramique.webp', ville: 'Vielle-Saint-Girons', site: 'https://www.instagram.com/rosemlaceramique/' },
  { nom: 'Cécilou Ceramics', logo: null, ville: 'Vielle-Saint-Girons' },
  { nom: 'Kallista Création', logo: '/logos/kallista-creation.webp', ville: 'Lacanau', site: 'https://www.instagram.com/kallista_creations/' },
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

// podium: true force la mise en avant d'un lot sous le seuil (ex. partenariat
// a valoriser malgre une valeur < 200 €) ; podium: false fait l'inverse.
const estSurPodium = ({ valeur, podium }) => podium === true || (podium !== false && valeur >= SEUIL_PODIUM)

// Seuls les lots dont le partenaire est confirmé sont affichés publiquement.
const LOTS_PUBLIES = LOTS_CONFIRMES.filter(({ statut }) => statut !== 'a-confirmer')

export const LOTS_PODIUM = LOTS_PUBLIES
  .filter(estSurPodium)
  .sort((a, b) => b.valeur - a.valeur)

export const LOTS_SECONDAIRES = LOTS_PUBLIES.filter((lot) => !estSurPodium(lot))

// Résumé par catégorie : nombre de lots secondaires, affiché sur la page.
export const RESUME_CATEGORIES = CATEGORIES.map(({ id, label }) => ({
  id,
  label,
  nombre: LOTS_SECONDAIRES.filter((lot) => lot.categorie === id).length,
})).filter(({ nombre }) => nombre > 0)

// Detail complet des lots secondaires, groupe par categorie, pour la fenetre
// « Voir tous les lots » ouverte depuis le podium. Les lots sont tries du plus
// cher au moins cher ; ceux dont la valeur reste a confirmer passent en dernier.
export const LOTS_PAR_CATEGORIE = CATEGORIES.map(({ id, label }) => ({
  id,
  label,
  lots: LOTS_SECONDAIRES
    .filter((lot) => lot.categorie === id)
    .sort((a, b) => (b.valeur ?? -1) - (a.valeur ?? -1)),
})).filter(({ lots }) => lots.length > 0)

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

// Valeur de la dotation complète : les lots publiés + le gros lot, qui est
// stocké à part et n'entre donc pas dans VALEUR_CONFIRMEE.
export const VALEUR_TOTALE = VALEUR_CONFIRMEE + (LOT_PRINCIPAL.valeur || 0)

// Arrondi au demi-millier inférieur pour l'accroche : elle reste vraie sans
// avoir à la retoucher à chaque nouvelle dotation.
export const VALEUR_ARRONDIE = Math.floor(VALEUR_TOTALE / 500) * 500

export const formatEuros = (valeur) =>
  valeur % 1 === 0
    ? `${valeur.toLocaleString('fr-FR')} €`
    : `${valeur.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`

// Valeur d'un lot telle qu'elle s'affiche. Un lot dont le montant dépend d'un
// choix du gagnant porte `valeurMax` en plus de `valeur` et s'annonce en
// fourchette — « 110 à 240 € ». L'euro n'est écrit qu'une fois, sur la borne
// haute : c'est la lecture courante d'un prix en français.
export const formatValeurLot = ({ valeur, valeurMax }) =>
  valeurMax
    ? `${valeur.toLocaleString('fr-FR')} à ${formatEuros(valeurMax)}`
    : formatEuros(valeur)
