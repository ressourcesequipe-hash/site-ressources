// Logos des communes, des points de collecte et des partenaires du challenge, tels que fournis
// pour la journée du 3 octobre (public/logos/inauguration, générés par
// scripts/logos-inauguration.mjs). Aucune recoloration.
//
// sombre  : logo blanc, posé sur une tuile verte.
// legende : logo sans nom écrit, le nom est ajouté dessous.
// large   : logo très allongé, tuile un peu plus large pour qu'il reste lisible.
// src     : chemin complet du logo, quand il n'est pas dans logos/inauguration.
// Une entrée sans `fichier` ni `src` s'affiche en texte : pas de logo fourni.
//
// Ordre : communes de Côte Landes Nature, puis de Maremne Adour Côte-Sud, puis
// les points de collecte hors mairie. Pas de classement entre elles.
// ligne : chaque groupe a sa propre ligne (les cinq communes de la MACS tiennent
// sur une seule), qui se replie normalement sur petit écran.
export const LOGOS_CHALLENGE = [
  { ligne: 1, nom: 'Vielle-Saint-Girons', fichier: 'vielle-saint-girons', legende: true },
  { ligne: 1, nom: 'Linxe', fichier: 'linxe' },
  { ligne: 1, nom: 'Saint-Michel-Escalus', fichier: 'saint-michel-escalus' },
  { ligne: 1, nom: 'Lit-et-Mixe', fichier: 'lit-et-mixe' },
  { ligne: 2, nom: 'Saint-Geours-de-Maremne', fichier: 'saint-geours-de-maremne', sombre: true },
  { ligne: 2, nom: 'Seignosse', fichier: 'seignosse', sombre: true },
  { ligne: 2, nom: 'Vieux-Boucau', fichier: 'vieux-boucau', sombre: true },
  { ligne: 2, nom: 'Saint-Vincent-de-Tyrosse', fichier: 'saint-vincent-de-tyrosse', sombre: true },
  { ligne: 2, nom: 'Labenne', fichier: 'labenne', sombre: true },
  { ligne: 3, nom: 'E.Leclerc Soustons', fichier: 'leclerc-soustons' },
  { ligne: 3, nom: 'E.Leclerc Linxe', fichier: 'leclerc-linxe' },
  { ligne: 3, nom: 'Imagine Linxe', fichier: 'imagine-linxe' },
  { ligne: 3, nom: 'Comptoir Électroménager Solidaire', fichier: 'comptoir-electromenager-solidaire', large: true },
  { ligne: 3, nom: 'Landes Partage', fichier: 'landes-partage' },
  { ligne: 4, nom: 'Domolandes', fichier: 'domolandes' },
  { ligne: 4, nom: 'Agrolandes', fichier: 'agrolandes' },
  { ligne: 4, nom: 'Landes Attractivité', fichier: 'landes-attractivite' },
  { ligne: 4, nom: 'SITCOM 40', src: '/logos/logo-sitcom40.svg', large: true },
  { ligne: 4, nom: 'Réseau Re', fichier: 'reseau-re' },
]
