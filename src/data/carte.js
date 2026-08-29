// Petits utilitaires partagés par les cartes du site (points de vente de la
// tombola, points de collecte du challenge).

// Tracé de l'épingle classique — tête ronde, pointe en bas — dans un repère
// de 24 × 32. Défini ici parce qu'il sert à deux rendus qui ne peuvent pas
// partager de composant : le marqueur Leaflet, qui veut une chaîne HTML, et la
// pastille de la liste, qui veut du JSX. Une seule définition, deux emplois.
// La pointe tombe vers y = 29 : c'est elle qui désigne le lieu, d'où l'ancrage
// des marqueurs à cette hauteur plutôt qu'au centre.
export const EPINGLE_TRACE =
  'M12 1C6.5 1 2 5.5 2 11c0 7.2 8.5 17.1 9.4 18.1a.8.8 0 0 0 1.2 0C13.5 28.1 22 18.2 22 11 22 5.5 17.5 1 12 1Z'

// Un marqueur posé sur les coordonnées plutôt qu'une recherche textuelle : les
// noms d'enseigne ne ressortaient pas, et les libellés descriptifs (« bureau de
// tabac », « épicerie… ») ne donnaient aucun résultat.
export const lienCarte = ({ coords, nom, ville }) =>
  coords
    ? `https://www.openstreetmap.org/?mlat=${coords[0]}&mlon=${coords[1]}#map=18/${coords[0]}/${coords[1]}`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent(
        [nom, ville, 'Landes'].join(' '),
      )}`
