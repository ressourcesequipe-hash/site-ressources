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

// Photo de groupe de la journée, avec les élus présents. Elle sert à l'accueil
// et à la galerie de la page événement : la légende, qui nomme les personnes,
// ne s'écrit qu'ici. L'ordre est celui de la photo, de gauche à droite.
export const PHOTO_ELUS = {
  src: '/photos/3-octobre/equipe-elus.webp',
  largeur: 1400,
  hauteur: 788,
  alt: "L'équipe de l'association Ressources posant avec les élus présents lors de la journée du 3 octobre, devant le stand de la recyclerie",
  legende:
    'De gauche à droite : le maire de Lit-et-Mixe, délégué communautaire de Côte Landes Nature ; ' +
    'Florian Chabaud, chargé de mission économie circulaire au Sitcom Côte Sud des Landes ; ' +
    'Rose Maury, secrétaire et trésorière de Ressources ; ' +
    'Sandrine Vestris, présidente de Ressources ; ' +
    'Patrice Galléa, 4e adjoint au maire de Vielle-Saint-Girons ; ' +
    'Régis Dubus, président du Sitcom 40, adjoint au maire de Saint-Vincent-de-Tyrosse et conseiller communautaire de Macs ; ' +
    'Boris Lalanne, coordonnateur de projet de Ressources ; ' +
    'François Archambot, technicien informatique de Ressources.',
}
