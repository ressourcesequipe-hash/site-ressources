// Interface de projection du 3 octobre 2026 (route /defi).
// Toutes les données modifiables de l'écran sont ici, et nulle part ailleurs.

export const challenge = {
  target: 500, // kg
  startDate: '2026-09-01',
  endDate: '2026-10-03',
}

// Jauge : à ce cumul (kg), la flèche est entièrement pleine et le repère
// « objectif » s'est replié au tiers gauche de la flèche. Avant, le repère glisse
// peu à peu vers la gauche (il est aux 3/4 tant que l'objectif n'est pas atteint).
export const ECHELLE_PLEINE = 1900

// Paliers célébrés : 500 kg est l'objectif, les suivants sont des multiples.
// `niveau` règle l'ampleur de la fête (confettis, applaudissements, durée du
// bandeau). Un palier ne se célèbre qu'une fois ; si une seule étape en
// franchit plusieurs, seul le plus haut est célébré.
export const paliers = [
  { kg: 500, niveau: 1, titre: 'OBJECTIF ATTEINT !', suite: 'ET ON CONTINUE !' },
  { kg: 1000, niveau: 2, titre: '1 TONNE COLLECTÉE !', suite: 'LE DOUBLE DE L’OBJECTIF !' },
  { kg: 1500, niveau: 3, titre: '1 500 KG !', suite: 'TROIS FOIS L’OBJECTIF !' },
  { kg: 2000, niveau: 4, titre: '2 TONNES !', suite: 'QUATRE FOIS L’OBJECTIF !' },
]

// Aucun poids n'est jamais rattaché à une commune, un point ou un partenaire :
// ces listes ne servent qu'à dire « qui est mobilisé », toutes au même rang.
export const communes = [
  'Vielle-Saint-Girons',
  'Linxe',
  'Saint-Michel-Escalus',
  'Lit-et-Mixe',
  'Saint-Geours-de-Maremne',
  'Seignosse',
  'Vieux-Boucau',
  'Saint-Vincent-de-Tyrosse',
  'Labenne',
]

export const collectionPoints = [
  'E.Leclerc Soustons',
  'Imagine Linxe',
]

// Pour ajouter un partenaire : une ligne de plus dans ce tableau.
export const partners = [
  'Landes Attractivité',
  'Domolandes',
  'Agrolandes',
  'Landes Partage',
  'Comptoir Électroménager Solidaire',
]

// Sons de la célébration des 500 kg : fanfare + applaudissements synthétisés.
// Le navigateur ne les joue qu'après un geste (un clic ou une touche).
export const SOUND_ENABLED = true

// Musique de fond : démarre à l'ouverture de la page (ou au premier clic si le
// navigateur l'exige). L'icône en haut à droite et la touche M coupent / remettent le son.
export const MUSIC_FILE = '/audio/fond.mp3'
export const MUSIC_VOLUME = 0.3

// Scénario de répétition (panneau opérateur → Charger la démonstration).
export const demoCollectes = [
  { date: '2026-09-03', poids: 32 },
  { date: '2026-09-08', poids: 51 },
  { date: '2026-09-12', poids: 64 },
  { date: '2026-09-17', poids: 38 },
  { date: '2026-09-21', poids: 92 },
  { date: '2026-09-24', poids: 117 },
  { date: '2026-09-27', poids: 61 },
  { date: '2026-09-30', poids: 208 },
  { date: '2026-10-02', poids: 184 },
]
