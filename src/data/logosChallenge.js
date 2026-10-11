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
export const LOGOS_CHALLENGE = [
  { nom: 'Vielle-Saint-Girons', fichier: 'vielle-saint-girons', legende: true },
  { nom: 'Linxe', fichier: 'linxe' },
  { nom: 'Saint-Michel-Escalus', fichier: 'saint-michel-escalus' },
  { nom: 'Lit-et-Mixe', fichier: 'lit-et-mixe' },
  { nom: 'Saint-Geours-de-Maremne', fichier: 'saint-geours-de-maremne', sombre: true },
  { nom: 'Seignosse', fichier: 'seignosse', sombre: true },
  { nom: 'Vieux-Boucau', fichier: 'vieux-boucau', sombre: true },
  { nom: 'Saint-Vincent-de-Tyrosse', fichier: 'saint-vincent-de-tyrosse', sombre: true },
  { nom: 'Labenne', fichier: 'labenne', sombre: true },
  { nom: 'E.Leclerc Soustons', fichier: 'leclerc-soustons' },
  { nom: 'E.Leclerc Linxe', fichier: 'leclerc-linxe' },
  { nom: 'Imagine Linxe', fichier: 'imagine-linxe' },
]
