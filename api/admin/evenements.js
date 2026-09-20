// Événements — §10 du cahier des charges.
//
// Toute la mécanique commune (droits, transitions de statut, verrou
// optimiste, historique, déclenchement du déploiement) vient de
// lib/module-contenu.js. Il ne reste ici que ce qui est propre aux
// événements.

import { eq } from 'drizzle-orm'
import { evenement } from '../../db/schema.js'
import { creerModuleContenu } from '../../lib/module-contenu.js'
import { nettoyerContenu, valider } from '../../lib/evenements.js'

export default creerModuleContenu({
  table: evenement,
  entite: 'evenement',
  nomPluriel: 'evenements',
  champTitre: 'titre',
  // §21 : Communication gère les événements, au même titre que les
  // actualités. La suppression définitive reste réservée (§24.7).
  droitGerer: 'evenements.gerer',
  droitSupprimer: 'evenements.supprimer',
  valider,

  champs: [
    'titre', 'descriptionCourte', 'descriptionComplete', 'programme',
    'image', 'imageAlt', 'imageCredit',
    'debutLe', 'finLe', 'journeeEntiere',
    'lieu', 'adresse', 'codePostal', 'commune', 'lienCarte',
    'urlInscription', 'appelAction', 'partenaires', 'documents',
    'annule', 'motifAnnulation',
    'miseEnAvant', 'surAccueil', 'seo', 'datePublication',
  ],

  champsDate: ['debutLe', 'finLe', 'datePublication'],

  preparer(donnees, { avant, statutVise }) {
    const calcules = {}

    // Les deux champs de contenu passent par la liste fermée de blocs.
    if ('descriptionComplete' in donnees) calcules.descriptionComplete = nettoyerContenu(donnees.descriptionComplete)
    if ('programme' in donnees) calcules.programme = nettoyerContenu(donnees.programme)

    const dateConnue = donnees.datePublication ?? avant?.datePublication
    if (statutVise === 'publie' && !dateConnue) calcules.datePublication = new Date()

    // Un événement remis en service voit son motif d'annulation effacé :
    // le laisser traîner afficherait une explication sans objet.
    if (donnees.annule === false) calcules.motifAnnulation = null

    return calcules
  },

  filtres(query, table) {
    const conditions = []
    if (query.commune) conditions.push(eq(table.commune, query.commune))
    if (query.annule === 'oui') conditions.push(eq(table.annule, true))
    return conditions
  },

  colonnesListe: (table, user) => ({
    id: table.id,
    slug: table.slug,
    titre: table.titre,
    descriptionCourte: table.descriptionCourte,
    statut: table.statut,
    debutLe: table.debutLe,
    finLe: table.finLe,
    lieu: table.lieu,
    commune: table.commune,
    annule: table.annule,
    image: table.image,
    miseEnAvant: table.miseEnAvant,
    surAccueil: table.surAccueil,
    majLe: table.majLe,
    version: table.version,
    auteurNom: user.name,
  }),
})
