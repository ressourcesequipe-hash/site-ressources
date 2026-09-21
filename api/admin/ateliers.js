// Ateliers — §11 du cahier des charges.
//
// Particularité de ce module : ses catégories sont administrables, comme le
// §11 l'exige. Elles ne sont donc pas figées dans le code — elles sont lues
// en base à chaque requête, et servent à la fois de liste de référence pour
// l'interface et de filtre à l'enregistrement.

import { asc, eq } from 'drizzle-orm'
import { atelier, categorieAtelier } from '../../db/schema.js'
import { db } from '../../lib/db.js'
import { creerModuleContenu } from '../../lib/module-contenu.js'
import { nettoyerCategories, nettoyerContenu, valider } from '../../lib/ateliers.js'

const lireCategories = () =>
  db.select().from(categorieAtelier).where(eq(categorieAtelier.actif, true)).orderBy(asc(categorieAtelier.ordre))

export default creerModuleContenu({
  table: atelier,
  entite: 'atelier',
  nomPluriel: 'ateliers',
  champTitre: 'nom',
  // §21 : les ateliers relèvent de la Coordination, pas de Communication.
  droitGerer: 'ateliers.gerer',
  droitSupprimer: 'ateliers.supprimer',
  valider,

  // Données de référence lues en base plutôt que figées : c'est ce qui rend
  // les catégories réellement administrables.
  reference: async () => ({ categories: await lireCategories() }),

  champs: [
    'nom', 'theme', 'publicCible', 'image', 'imageAlt', 'imageCredit',
    'description', 'objectifs', 'programme',
    'duree', 'capacite', 'lieuPossible', 'materielNecessaire', 'modalites',
    'surDevis', 'tarif', 'disponible', 'motifIndisponibilite',
    'categories', 'urlDemande', 'libelleBoutonDemande',
    'ordre', 'seo', 'datePublication',
  ],

  champsDate: ['datePublication'],

  async preparer(donnees, { avant, statutVise }) {
    const calcules = {}

    for (const champ of ['description', 'objectifs', 'programme']) {
      if (champ in donnees) calcules[champ] = nettoyerContenu(donnees[champ])
    }

    // Une catégorie envoyée par le navigateur n'est retenue que si elle
    // existe réellement en base : renommer ou retirer une catégorie ne peut
    // donc pas laisser de valeur orpheline dans une fiche.
    if ('categories' in donnees) {
      calcules.categories = nettoyerCategories(donnees.categories, await lireCategories())
    }

    if ('capacite' in donnees) {
      calcules.capacite = donnees.capacite === '' || donnees.capacite === null ? null : Number(donnees.capacite)
    }
    if ('ordre' in donnees) calcules.ordre = Number(donnees.ordre) || 0

    // Cohérence du couple tarif / sur devis : cocher « sur devis » efface le
    // tarif, plutôt que de laisser deux informations contradictoires.
    if (donnees.surDevis === true) calcules.tarif = null
    if (donnees.disponible === true) calcules.motifIndisponibilite = null

    const dateConnue = donnees.datePublication ?? avant?.datePublication
    if (statutVise === 'publie' && !dateConnue) calcules.datePublication = new Date()

    return calcules
  },

  filtres(query, table) {
    const conditions = []
    if (query.disponible === 'oui') conditions.push(eq(table.disponible, true))
    if (query.disponible === 'non') conditions.push(eq(table.disponible, false))
    return conditions
  },

  colonnesListe: (table, user) => ({
    id: table.id,
    slug: table.slug,
    nom: table.nom,
    theme: table.theme,
    publicCible: table.publicCible,
    categories: table.categories,
    duree: table.duree,
    capacite: table.capacite,
    surDevis: table.surDevis,
    tarif: table.tarif,
    disponible: table.disponible,
    image: table.image,
    statut: table.statut,
    ordre: table.ordre,
    majLe: table.majLe,
    version: table.version,
    auteurNom: user.name,
  }),
})
