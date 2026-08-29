// Petits utilitaires partagés par les cartes du site (points de vente de la
// tombola, points de collecte du challenge).

// Un marqueur posé sur les coordonnées plutôt qu'une recherche textuelle : les
// noms d'enseigne ne ressortaient pas, et les libellés descriptifs (« bureau de
// tabac », « épicerie… ») ne donnaient aucun résultat.
export const lienCarte = ({ coords, nom, ville }) =>
  coords
    ? `https://www.openstreetmap.org/?mlat=${coords[0]}&mlon=${coords[1]}#map=18/${coords[0]}/${coords[1]}`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent(
        [nom, ville, 'Landes'].join(' '),
      )}`
