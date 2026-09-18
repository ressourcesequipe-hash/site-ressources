// Affiche de la journée du 3 octobre 2026, le Festival du réemploi.
//
// Un seul endroit décrit le fichier et son texte alternatif : la page de
// l'événement, l'accueil, l'espace presse et les actualités l'affichent tous.
//
// Le fichier est servi tel quel, en JPEG. Il est déjà compressé : le passer en
// WebP ne gagnait que 18 Ko et abîmait les petits textes et le QR code.
//
// Temporaire, comme les autres blocs de la tombola : à retirer de l'accueil et
// de l'espace presse après le 3 octobre 2026.

export const AFFICHE = {
  src: '/photos/affiche-3-octobre-2026.jpg',
  largeur: 904,
  hauteur: 1280,
  poids: '121 Ko',
  nomTelechargement: 'affiche-festival-du-reemploi-3-octobre-2026.jpg',
  // L'affiche est une image de texte : l'alternative reprend ce qu'elle dit,
  // pour qui ne la voit pas.
  alt:
    'Affiche du Festival du réemploi, le « E-Waste Day », informatique et végétal : ' +
    'samedi 3 octobre 2026 à partir de 10 h à Vielle-Saint-Girons, salle Yvonne Meister, ' +
    'route de Pichelèbe. Au programme : village associatif, ateliers de sensibilisation, ' +
    'atelier repair, ateliers sauvetage de plantes, mini concert, tirage au sort de la ' +
    'tombola et remise des lots. Challenge territorial : objectif une demi-tonne de déchets ' +
    'électroniques et informatiques. Concert de DuoDangar et Evie à 20 h, entrée à prix ' +
    'libre. Buvette et food truck sur place.',
}
