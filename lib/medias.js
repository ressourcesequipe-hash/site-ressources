// Règles de la médiathèque — §14 du cahier des charges.
//
// Fichier pur : aucune base, aucun réseau, aucun accès à GitHub. Tout ce qui
// décide — catégories autorisées, validation, détection des usages — se
// vérifie sans rien démarrer.
//
// RAPPEL DE PÉRIMÈTRE (§14.2, qui prime sur le reste du §14) : cette
// médiathèque ne concerne QUE les médias publics, stockés dans le dépôt Git,
// qui est public. Aucune pièce jointe de demande, aucun document contenant
// des données personnelles n'a sa place ici, quelle que soit la commodité du
// mécanisme.

// Liste fermée, définie côté serveur : jamais une valeur texte libre venue du
// navigateur, sans quoi le chemin d'écriture pourrait sortir de public/medias
// (§4 de l'architecture).
export const CATEGORIES = [
  { cle: 'actualites', libelle: 'Actualités' },
  { cle: 'evenements', libelle: 'Événements' },
  { cle: 'partenaires', libelle: 'Partenaires' },
  { cle: 'ateliers', libelle: 'Ateliers' },
  { cle: 'points-collecte', libelle: 'Points de collecte' },
  { cle: 'pages', libelle: 'Pages' },
]

export const CLES_CATEGORIES = CATEGORIES.map((c) => c.cle)
export const LIBELLES_CATEGORIE = Object.fromEntries(CATEGORIES.map((c) => [c.cle, c.libelle]))

export const TAILLE_MAX_OCTETS = 12 * 1024 * 1024

// Largeur de la variante produite à l'import. Une seule, et non les cinq
// déclinaisons du §14 (miniature, carte, article, hero, partage).
//
// Ce n'est pas un renoncement mais un ordre : produire cinq fichiers par
// image alourdirait l'historique du dépôt — ce que le §14.1 demande
// justement d'éviter — sans qu'aucune page ne les utilise, puisque le site
// sert aujourd'hui une balise <img> simple. Les déclinaisons prendront leur
// sens le jour où les pages publiques émettront un `srcset`, et c'est ce
// jour-là qu'il faudra les générer, pour les images déjà importées comprises.
export const LARGEUR_MAX = 1600
export const QUALITE_WEBP = 82

export function validerMetadonnees(donnees = {}) {
  const erreurs = []
  const titre = String(donnees.titre ?? '').trim()
  const alt = String(donnees.alt ?? '').trim()
  const credit = String(donnees.credit ?? '').trim()
  const description = String(donnees.description ?? '').trim()

  if (titre.length > 200) erreurs.push({ champ: 'titre', message: 'Le titre ne peut pas dépasser 200 caractères.' })
  if (alt.length > 500) {
    erreurs.push({
      champ: 'alt',
      message: "La description pour l'accessibilité ne peut pas dépasser 500 caractères. Décrivez ce que montre l'image, pas ce qu'elle évoque.",
    })
  }
  if (credit.length > 200) erreurs.push({ champ: 'credit', message: 'Le crédit ne peut pas dépasser 200 caractères.' })
  if (description.length > 2000) erreurs.push({ champ: 'description', message: 'La description ne peut pas dépasser 2 000 caractères.' })

  const point = donnees.pointFocal
  if (point != null) {
    const bon =
      typeof point === 'object' &&
      Number.isFinite(Number(point.x)) && Number(point.x) >= 0 && Number(point.x) <= 100 &&
      Number.isFinite(Number(point.y)) && Number(point.y) >= 0 && Number(point.y) <= 100
    if (!bon) erreurs.push({ champ: 'pointFocal', message: 'Le point focal doit être exprimé en pourcentages entre 0 et 100.' })
  }

  return {
    ok: erreurs.length === 0,
    erreurs,
    valeurs: {
      titre: titre || null,
      alt: alt || null,
      credit: credit || null,
      description: description || null,
      pointFocal: point == null ? null : { x: Number(point.x), y: Number(point.y) },
    },
  }
}

// ── Usages d'un média ────────────────────────────────────────────────────
//
// Supprimer une image encore affichée quelque part laisserait un trou sur le
// site, sans avertissement et sans retour possible (§24.7). Avant toute
// suppression on cherche donc où elle sert — et on le montre, plutôt que de
// refuser sèchement.
//
// La recherche est textuelle sur le chemin public, parce qu'un média peut
// être référencé de deux façons : dans une colonne dédiée (`image`, `logo`)
// ou au fond d'un bloc de contenu JSON. Chercher la chaîne couvre les deux,
// là où une jointure ne verrait que la première.

// Où chercher : la table, son libellé, et la colonne qui porte son nom
// affichable. Les colonnes à fouiller ne sont PAS listées ici — elles sont
// découvertes dans le schéma au moment de la recherche.
//
// Recopier une liste de colonnes à la main était la première version, et
// elle s'est trompée sur quatre tables sur six (21/09/2026) : `blocs` et
// `galerie` n'existaient que dans ma tête, les événements rangent leur
// contenu dans `description_complete` et `programme`, et les points de
// collecte n'ont aucune colonne image. Une liste figée se désaligne du
// schéma en silence, et ici ce silence coûte une page cassée.
export const TABLES_CHERCHEES = [
  { table: 'actualites', libelle: 'Actualité', titre: 'titre' },
  { table: 'evenements', libelle: 'Événement', titre: 'titre' },
  { table: 'ateliers', libelle: 'Atelier', titre: 'nom' },
  { table: 'organisations', libelle: 'Partenaire', titre: 'nom' },
  { table: 'points_collecte', libelle: 'Point de collecte', titre: 'nom' },
  { table: 'pages', libelle: 'Page', titre: 'titre_interne' },
]

/**
 * Quelles colonnes d'une table peuvent contenir un chemin de média.
 *
 * @param colonnes  [{ column_name, data_type }] tel que le renvoie
 *                  information_schema.columns
 *
 * Tout le JSON est fouillé, y compris `seo` : une image de partage y a sa
 * place, et chercher là où il n'y a rien ne coûte qu'une comparaison.
 */
export function colonnesAFouiller(colonnes = []) {
  const texte = []
  const json = []
  for (const c of colonnes) {
    const nom = c.column_name
    if (c.data_type === 'jsonb' || c.data_type === 'json') json.push(nom)
    // `image_alt`, `image_credit` ou `logo_alt` décrivent l'image, ils ne la
    // désignent pas : les fouiller ne ferait que ralentir.
    else if (/^(image|logo|photo|visuel|fichier)$/.test(nom)) texte.push(nom)
  }
  return { texte, json }
}

/**
 * Un média est-il supprimable ? Renvoie toujours la liste des usages, pour
 * que l'interface puisse les nommer plutôt que d'afficher un refus opaque.
 */
export function verifierSuppression(usages = []) {
  if (usages.length === 0) return { ok: true, usages }
  return {
    ok: false,
    usages,
    raison:
      usages.length === 1
        ? `Cette image est utilisée par ${usages[0].libelle.toLowerCase()} « ${usages[0].titre} ». Retirez-la de ce contenu avant de la supprimer.`
        : `Cette image est utilisée par ${usages.length} contenus. Retirez-la de chacun avant de la supprimer.`,
  }
}

// Taille lisible, pour dire à quelqu'un pourquoi son fichier est refusé avec
// un nombre qu'il reconnaît — « 18,4 Mo », pas « 19293798 octets ».
export function tailleLisible(octets) {
  const n = Number(octets) || 0
  if (n < 1024) return `${n} octets`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} Ko`
  return `${(n / (1024 * 1024)).toFixed(1).replace('.', ',')} Mo`
}
