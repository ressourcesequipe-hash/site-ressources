// Points de collecte publics — §13 du cahier des charges.
//
// Attention (§13) : lieux de dépôt ouverts au public, pas la traçabilité
// des collectes, qui reste dans Ressources 360.
//
// Le §13 exige qu'une information corrigée ici soit répercutée partout.
// C'est la conséquence directe d'avoir une seule ligne qui fait foi : il
// n'existe aucun second endroit à modifier.

import { eq } from 'drizzle-orm'
import { pointCollecte } from '../../db/schema.js'
import { creerModuleContenu } from '../../lib/module-contenu.js'
import { JOURS, TYPES, nettoyerHoraires, valider } from '../../lib/points-collecte.js'

export default creerModuleContenu({
  table: pointCollecte,
  entite: 'pointCollecte',
  nomPluriel: 'pointsCollecte',
  champTitre: 'nom',
  droitGerer: 'points_collecte.gerer',
  droitSupprimer: 'points_collecte.supprimer',
  valider,
  reference: { types: TYPES, jours: JOURS },

  champs: [
    'nom', 'organisationId', 'adresse', 'complementAdresse', 'codePostal',
    'commune', 'latitude', 'longitude', 'horaires', 'consignes',
    'informationsTemporaires', 'type', 'campagne', 'debutLe', 'finLe',
    'fermeTemporairement', 'motifFermeture', 'visibleCarte', 'visibleListe',
    'ordre', 'seo', 'datePublication',
  ],

  champsDate: ['debutLe', 'finLe', 'datePublication'],

  preparer(donnees, { avant, statutVise }) {
    const calcules = {}
    if ('horaires' in donnees) calcules.horaires = nettoyerHoraires(donnees.horaires)
    if ('ordre' in donnees) calcules.ordre = Number(donnees.ordre) || 0
    if ('organisationId' in donnees) {
      calcules.organisationId = donnees.organisationId ? Number(donnees.organisationId) : null
    }

    const dateConnue = donnees.datePublication ?? avant?.datePublication
    if (statutVise === 'publie' && !dateConnue) calcules.datePublication = new Date()

    // Point rouvert : le motif de fermeture n'a plus d'objet et ne doit
    // pas rester affiché.
    if (donnees.fermeTemporairement === false) calcules.motifFermeture = null

    return calcules
  },

  filtres(query, table) {
    const conditions = []
    if (query.type) conditions.push(eq(table.type, query.type))
    if (query.commune) conditions.push(eq(table.commune, query.commune))
    return conditions
  },

  colonnesListe: (table, user) => ({
    id: table.id,
    slug: table.slug,
    nom: table.nom,
    type: table.type,
    commune: table.commune,
    adresse: table.adresse,
    statut: table.statut,
    debutLe: table.debutLe,
    finLe: table.finLe,
    fermeTemporairement: table.fermeTemporairement,
    visibleCarte: table.visibleCarte,
    visibleListe: table.visibleListe,
    organisationId: table.organisationId,
    ordre: table.ordre,
    majLe: table.majLe,
    version: table.version,
    auteurNom: user.name,
  }),
})
