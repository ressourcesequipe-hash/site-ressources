// Actualités — §9 et §22 du cahier des charges.
//
// Toute la mécanique commune aux modules de contenu (droits, transitions de
// statut, verrou optimiste, historique, déclenchement du déploiement) vit
// dans lib/contenus.js. Il ne reste ici que ce qui est propre aux
// actualités : les champs, le calcul du temps de lecture et le nettoyage des
// blocs de contenu.

import { eq } from 'drizzle-orm'
import { actualite } from '../../db/schema.js'
import { creerModuleContenu } from '../../lib/module-contenu.js'
import { CATEGORIES, nettoyerContenu, tempsLecture, valider } from '../../lib/actualites.js'

export default creerModuleContenu({
  table: actualite,
  entite: 'actualite',
  nomPluriel: 'actualites',
  champTitre: 'titre',
  droitGerer: 'actualites.gerer',
  droitSupprimer: 'actualites.supprimer',
  valider,
  reference: { categories: CATEGORIES },

  champs: [
    'titre', 'resume', 'contenu', 'image', 'imageAlt', 'imageCredit',
    'imageLargeur', 'imageHauteur', 'imageCadrage', 'imagePosition',
    'galerie', 'categorie', 'tags', 'lienExterne', 'miseEnAvant',
    'surAccueil', 'seo', 'datePublication', 'dateDepublication',
  ],

  champsDate: ['datePublication', 'dateDepublication'],

  // Champs jamais saisis à la main : le contenu est filtré sur la liste
  // fermée de blocs, le temps de lecture en découle (§9), et la date de
  // publication se pose d'elle-même à la première mise en ligne — sans quoi
  // un article publié apparaîtrait sans date.
  preparer(donnees, { avant, statutVise }) {
    const contenu = 'contenu' in donnees ? nettoyerContenu(donnees.contenu) : avant?.contenu
    const calcules = { contenu, tempsLectureMinutes: tempsLecture(contenu) }

    const dateConnue = donnees.datePublication ?? avant?.datePublication
    if (statutVise === 'publie' && !dateConnue) calcules.datePublication = new Date()

    return calcules
  },

  filtres(query, table) {
    const conditions = []
    if (query.categorie) conditions.push(eq(table.categorie, query.categorie))
    return conditions
  },

  colonnesListe: (table, user) => ({
    id: table.id,
    slug: table.slug,
    titre: table.titre,
    resume: table.resume,
    categorie: table.categorie,
    statut: table.statut,
    datePublication: table.datePublication,
    miseEnAvant: table.miseEnAvant,
    surAccueil: table.surAccueil,
    image: table.image,
    majLe: table.majLe,
    version: table.version,
    auteurNom: user.name,
  }),
})
