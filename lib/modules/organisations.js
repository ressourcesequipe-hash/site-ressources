// Organisations : partenaires et mécènes — §12 du cahier des charges.
//
// Collection unique, conformément au §12 : « cela évite de dupliquer les
// fiches ». La mécanique commune vient de lib/module-contenu.js.
//
// §21 : les partenaires ne figurent pas dans le périmètre de Communication.
// Seules la Coordination et le Super administrateur les gèrent ; un
// Contributeur peut en préparer un brouillon.

import { eq } from 'drizzle-orm'
import { organisation } from '../../db/schema.js'
import { creerModuleContenu } from '../../lib/module-contenu.js'
import { STATUTS_PARTENARIAT, TYPES, valider } from '../../lib/organisations.js'

export default creerModuleContenu({
  table: organisation,
  entite: 'organisation',
  nomPluriel: 'organisations',
  champTitre: 'nom',
  droitGerer: 'organisations.gerer',
  droitSupprimer: 'organisations.supprimer',
  valider,
  reference: { types: TYPES, statutsPartenariat: STATUTS_PARTENARIAT },

  champs: [
    'nom', 'type', 'descriptionCourte', 'siteInternet', 'commune',
    'emailPublic', 'telephonePublic', 'logo', 'logoAlt',
    'statutPartenariat', 'libellePublic', 'notesInternes', 'debutLe', 'finLe',
    'categorieAffichage', 'ordre', 'surAccueil', 'seo', 'datePublication',
  ],

  champsDate: ['debutLe', 'finLe', 'datePublication'],

  preparer(donnees, { avant, statutVise }) {
    const calcules = {}
    const dateConnue = donnees.datePublication ?? avant?.datePublication
    if (statutVise === 'publie' && !dateConnue) calcules.datePublication = new Date()
    if ('ordre' in donnees) calcules.ordre = Number(donnees.ordre) || 0
    return calcules
  },

  filtres(query, table) {
    const conditions = []
    if (query.type) conditions.push(eq(table.type, query.type))
    if (query.statutPartenariat) conditions.push(eq(table.statutPartenariat, query.statutPartenariat))
    return conditions
  },

  // `notesInternes` et `statutPartenariat` ne sortent pas de la liste :
  // ils ne servent qu'à la fiche, et n'ont rien à faire dans une vue
  // d'ensemble susceptible d'être montrée à l'écran devant quelqu'un.
  colonnesListe: (table, user) => ({
    id: table.id,
    slug: table.slug,
    nom: table.nom,
    type: table.type,
    commune: table.commune,
    logo: table.logo,
    statut: table.statut,
    statutPartenariat: table.statutPartenariat,
    libellePublic: table.libellePublic,
    surAccueil: table.surAccueil,
    ordre: table.ordre,
    majLe: table.majLe,
    version: table.version,
    auteurNom: user.name,
  }),
})
