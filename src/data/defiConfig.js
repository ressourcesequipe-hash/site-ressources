// Interface de projection du 3 octobre 2026 (route /defi).
// Toutes les données modifiables de l'écran sont ici, et nulle part ailleurs.

export const challenge = {
  target: 500, // kg
  startDate: '2026-09-01',
  endDate: '2026-10-03',
}

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
  'Mairies partenaires',
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
// Le navigateur ne les joue qu'après un geste (la saisie du PIN en est un).
export const SOUND_ENABLED = true

// Musique de fond facultative : déposer un fichier libre de droits à cet
// emplacement (public/audio/fond.mp3), puis touche M (ou bouton « Musique »)
// pour la lancer / la couper. Sans fichier, le bouton reste sans effet.
export const MUSIC_FILE = '/audio/fond.mp3'
export const MUSIC_VOLUME = 0.3

// Empreinte SHA-256 de « ressources-defi: » + PIN. Verrou d'usage, pas de
// sécurité : il évite un geste malheureux sur le portable de la salle. Pour
// changer de PIN : voir docs/defi-projection.md.
export const PIN_HASH = '8495879a2eb6889446a59be29ffb64941692560b8d234c09203c175324845a3b'

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
