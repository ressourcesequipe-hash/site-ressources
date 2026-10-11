// Logos des communes et des points de collecte du challenge, tels que fournis
// pour la journée du 3 octobre (public/logos/inauguration, générés par
// scripts/logos-inauguration.mjs). Aucune recoloration.
//
// sombre  : logo blanc, posé sur une tuile verte.
// legende : logo sans nom écrit, le nom est ajouté dessous.
// Une entrée sans `fichier` s'affiche en texte : pas de logo fourni.
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
]
