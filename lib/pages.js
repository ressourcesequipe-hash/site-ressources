// Logique métier des pages institutionnelles — §8 du cahier des charges.
//
// Fonctions pures, vérifiables sans base ni requête.

export { STATUTS, LIBELLES_STATUT, slugifier, transitionAutorisee } from './contenus.js'
import { nettoyerBlocs } from './contenus.js'

// §8.3 : blocs réutilisables et contrôlés, plutôt qu'un page builder libre.
// « Les styles graphiques restent définis dans le code. L'utilisateur admin
// choisit le contenu, pas la charte graphique. »
//
// Un champ déclaré `{ cle, sousChamps }` décrit une suite d'éléments
// répétables — les images d'une galerie, les questions d'une FAQ.
export const BLOCS = {
  paragraph: ['text'],
  heading: ['text'],
  image: ['src', 'alt', 'credit', 'legende'],
  imageTexte: ['src', 'alt', 'text'],
  galerie: [{ cle: 'images', sousChamps: ['src', 'alt'] }],
  chiffresCles: [{ cle: 'chiffres', sousChamps: ['valeur', 'libelle'] }],
  cartes: [{ cle: 'cartes', sousChamps: ['titre', 'texte', 'href'] }],
  appelAction: ['titre', 'text', 'label', 'href'],
  citation: ['text', 'auteur', 'fonction'],
  faq: [{ cle: 'questions', sousChamps: ['question', 'reponse'] }],
  logos: [{ cle: 'logos', sousChamps: ['src', 'alt', 'href'] }],
  video: ['src', 'title', 'sourceUrl', 'sourceLabel', 'credit'],
  document: ['href', 'label', 'poids'],
  encadre: ['titre', 'text'],
  liste: [{ cle: 'elements', sousChamps: ['text'] }],
  tableau: ['entetes', { cle: 'lignes', sousChamps: ['cellules'] }],
  link: ['label', 'href'],
}

export function nettoyerContenu(blocs) {
  return nettoyerBlocs(blocs, BLOCS)
}

// §8.4 : « la liste exacte des pages protégées est établie pendant l'audit
// à partir du contenu existant ». Liste confirmée par l'association le
// 21/09/2026 : mentions légales, politique de confidentialité, effacement
// des données, et le bloc garanties de la page Boutique.
//
// Ces slugs sont figés dans le code, pas en base, et c'est délibéré : une
// protection qui se désactiverait depuis l'interface n'en serait pas une.
// Le §8.4 précise que ces pages « restent hors de portée des rôles
// Communication et Contributeur, quel que soit le contenu qu'ils peuvent
// par ailleurs publier : ce n'est pas une autorisation qui peut être
// étendue à un autre rôle sans revoir ce cahier des charges ».
export const SLUGS_PROTEGES = [
  'mentions-legales',
  'confidentialite',
  'effacement-des-donnees',
  'garanties-materiel-reconditionne',
]

/**
 * Une page est protégée si son slug figure dans la liste ci-dessus, ou si
 * elle a été explicitement marquée comme telle. Le marquage manuel permet
 * d'en protéger une de plus sans redéploiement ; il ne permet jamais d'en
 * déprotéger une de la liste.
 */
export function estProtegee(page) {
  if (!page) return false
  if (SLUGS_PROTEGES.includes(page.slug)) return true
  return Boolean(page.protegee)
}

/**
 * Contrôles de cohérence. Messages destinés à être lus tels quels (§24.4).
 */
export function valider(donnees, { statutVise }) {
  const erreurs = []

  if (!donnees.titreInterne || !String(donnees.titreInterne).trim()) {
    erreurs.push({ champ: 'titreInterne', message: 'Le nom de la page est obligatoire.' })
  }

  if (statutVise === 'publie' || statutVise === 'programme' || statutVise === 'a_valider') {
    if (!String(donnees.titrePublic || '').trim()) {
      erreurs.push({
        champ: 'titrePublic',
        message: 'Indiquez le titre qui apparaîtra sur la page, vu par les visiteurs.',
      })
    }
  }

  if (statutVise === 'publie' || statutVise === 'programme') {
    const contenu = Array.isArray(donnees.contenu) ? donnees.contenu : []
    if (contenu.length === 0) {
      erreurs.push({ champ: 'contenu', message: 'Une page sans contenu ne peut pas être mise en ligne.' })
    }
    if (donnees.image && !String(donnees.imageAlt || '').trim()) {
      erreurs.push({
        champ: 'imageAlt',
        message: "Décrivez l'image pour les personnes qui ne la voient pas. Exemple : « Vue de l'atelier de reconditionnement. »",
      })
    }
  }

  return erreurs
}
