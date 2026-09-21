// Pages institutionnelles — §8 du cahier des charges.
//
// Particularité de ce module : les pages protégées du §8.4. Certaines pages
// engagent l'association sur le plan juridique — mentions légales,
// politique de confidentialité, effacement des données, garanties du
// matériel reconditionné. Leur formulation a été validée avec soin et ne
// doit pas pouvoir être modifiée et publiée par n'importe quel profil
// disposant de droits éditoriaux.
//
// Deux garanties, portées par lib/module-contenu.js :
//   - seules la Coordination et le Super administrateur peuvent les créer
//     ou les modifier, quel que soit ce que les autres rôles publient par
//     ailleurs ;
//   - toute modification, même par un profil autorisé, passe par « à
//     valider » avant publication, sans exception.

import { page } from '../../db/schema.js'
import { creerModuleContenu } from '../../lib/module-contenu.js'
import { BLOCS, estProtegee, nettoyerContenu, valider } from '../../lib/pages.js'

export default creerModuleContenu({
  table: page,
  entite: 'page',
  nomPluriel: 'pages',
  champTitre: 'titreInterne',
  // §21 : les pages relèvent de la Coordination, pas de Communication.
  droitGerer: 'pages.gerer',
  droitSupprimer: 'pages.supprimer',
  valider,
  protege: estProtegee,
  reference: { blocsAutorises: Object.keys(BLOCS) },

  champs: [
    'titreInterne', 'titrePublic', 'extrait', 'contenu',
    'image', 'imageAlt', 'imageCredit',
    'protegee', 'ordre', 'seo', 'datePublication',
  ],

  champsDate: ['datePublication'],

  preparer(donnees, { avant, statutVise }) {
    const calcules = {}
    if ('contenu' in donnees) calcules.contenu = nettoyerContenu(donnees.contenu)
    if ('ordre' in donnees) calcules.ordre = Number(donnees.ordre) || 0

    const dateConnue = donnees.datePublication ?? avant?.datePublication
    if (statutVise === 'publie' && !dateConnue) calcules.datePublication = new Date()

    return calcules
  },

  colonnesListe: (table, user) => ({
    id: table.id,
    slug: table.slug,
    titreInterne: table.titreInterne,
    titrePublic: table.titrePublic,
    statut: table.statut,
    protegee: table.protegee,
    image: table.image,
    ordre: table.ordre,
    majLe: table.majLe,
    version: table.version,
    auteurNom: user.name,
  }),
})
