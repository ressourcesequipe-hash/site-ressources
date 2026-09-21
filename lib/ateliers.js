// Logique métier des ateliers — §11 du cahier des charges.
//
// Fonctions pures, vérifiables sans base ni requête.

export { STATUTS, LIBELLES_STATUT, slugifier, transitionAutorisee } from './contenus.js'
import { nettoyerBlocs } from './contenus.js'

// Blocs autorisés pour la description, les objectifs et le programme.
export const BLOCS = {
  paragraph: ['text'],
  heading: ['text'],
  link: ['label', 'href'],
}

export function nettoyerContenu(blocs) {
  return nettoyerBlocs(blocs, BLOCS)
}

// §11 : les catégories sont administrables, donc elles ne figurent PAS ici.
// Elles vivent en base (`categories_ateliers`). Cette liste ne sert qu'à
// amorcer une base vide, à partir des exemples cités par le cahier —
// « par exemple : numérique, informatique, réemploi, végétal,
// sensibilisation, collectivités, entreprises, établissements scolaires ».
// L'équipe peut ensuite en ajouter, en renommer ou en retirer.
export const CATEGORIES_INITIALES = [
  { cle: 'numerique', libelle: 'Numérique', ordre: 1 },
  { cle: 'informatique', libelle: 'Informatique', ordre: 2 },
  { cle: 'reemploi', libelle: 'Réemploi', ordre: 3 },
  { cle: 'vegetal', libelle: 'Végétal', ordre: 4 },
  { cle: 'sensibilisation', libelle: 'Sensibilisation', ordre: 5 },
  { cle: 'collectivites', libelle: 'Collectivités', ordre: 6 },
  { cle: 'entreprises', libelle: 'Entreprises', ordre: 7 },
  { cle: 'scolaires', libelle: 'Établissements scolaires', ordre: 8 },
]

/** Ne conserve que des clés de catégories réellement connues, sans doublon. */
export function nettoyerCategories(valeurs, categoriesConnues) {
  if (!Array.isArray(valeurs)) return []
  const cles = new Set(categoriesConnues.map((c) => c.cle))
  return [...new Set(valeurs.filter((v) => cles.has(v)))]
}

/**
 * Contrôles de cohérence. Messages destinés à être lus tels quels (§24.4).
 */
export function valider(donnees, { statutVise }) {
  const erreurs = []

  if (!donnees.nom || !String(donnees.nom).trim()) {
    erreurs.push({ champ: 'nom', message: "Le nom de l'atelier est obligatoire." })
  }

  if (donnees.capacite !== undefined && donnees.capacite !== null && donnees.capacite !== '') {
    const n = Number(donnees.capacite)
    if (!Number.isInteger(n) || n <= 0) {
      erreurs.push({ champ: 'capacite', message: 'La jauge doit être un nombre entier de personnes, supérieur à zéro.' })
    }
  }

  // §11 : « tarif ou mention sur devis ». Cocher « sur devis » et remplir un
  // tarif dit deux choses contradictoires : le site ne saurait pas laquelle
  // afficher.
  if (donnees.surDevis && String(donnees.tarif || '').trim()) {
    erreurs.push({
      champ: 'tarif',
      message: "Choisissez l'un ou l'autre : soit un tarif, soit la mention « sur devis ».",
    })
  }

  if (donnees.disponible === false && !String(donnees.motifIndisponibilite || '').trim()) {
    erreurs.push({
      champ: 'motifIndisponibilite',
      message: "Indiquez pourquoi l'atelier n'est pas proposé : la fiche reste visible, autant que la raison le soit aussi.",
    })
  }

  if (statutVise === 'publie' || statutVise === 'programme') {
    if (!String(donnees.publicCible || '').trim()) {
      erreurs.push({ champ: 'publicCible', message: "Indiquez à qui s'adresse cet atelier avant la mise en ligne." })
    }
    if (!Array.isArray(donnees.categories) || donnees.categories.length === 0) {
      erreurs.push({ champ: 'categories', message: 'Choisissez au moins une catégorie avant la mise en ligne.' })
    }
    if (!donnees.surDevis && !String(donnees.tarif || '').trim()) {
      erreurs.push({
        champ: 'tarif',
        message: "Indiquez un tarif, ou cochez « sur devis » si le prix dépend de la demande.",
      })
    }
    if (donnees.image && !String(donnees.imageAlt || '').trim()) {
      erreurs.push({
        champ: 'imageAlt',
        message: "Décrivez l'image pour les personnes qui ne la voient pas. Exemple : « Des enfants démontent un ordinateur portable. »",
      })
    }
  }

  return erreurs
}

/**
 * Contrôles d'une catégorie d'atelier (§11 : liste administrable).
 */
export function validerCategorie(donnees) {
  const erreurs = []
  if (!String(donnees.libelle || '').trim()) {
    erreurs.push({ champ: 'libelle', message: 'Le nom de la catégorie est obligatoire.' })
  }
  return erreurs
}
