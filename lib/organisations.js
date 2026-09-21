// Logique métier des organisations — §12 du cahier des charges.
//
// Fonctions pures, vérifiables sans base ni requête.

export { STATUTS, LIBELLES_STATUT, slugifier, transitionAutorisee } from './contenus.js'

// §12 : « prévoir au minimum » ces types. Liste fermée côté serveur — une
// valeur envoyée par le navigateur n'est jamais reprise telle quelle.
export const TYPES = [
  { cle: 'commune', libelle: 'Commune' },
  { cle: 'intercommunalite', libelle: 'Intercommunalité' },
  { cle: 'etablissement_public', libelle: 'Établissement public' },
  { cle: 'association', libelle: 'Association' },
  { cle: 'entreprise', libelle: 'Entreprise' },
  { cle: 'mecene', libelle: 'Mécène' },
  { cle: 'reseau', libelle: 'Réseau' },
  { cle: 'partenaire_technique', libelle: 'Partenaire technique' },
  { cle: 'partenaire_logistique', libelle: 'Partenaire logistique' },
]

// Longueur maximale du libellé public affiché sur le site : c'est une
// pastille à côté du nom, pas un champ de texte. Voir le commentaire de
// `libellePublic` dans db/schema.js pour la raison d'être des deux champs.
export const LIBELLE_PUBLIC_MAX = 60

// §12 : suivi interne de la relation, jamais publié. Ce que le site affiche
// est `libellePublic`, saisi à part — le §12 autorise à publier un statut
// (« pas nécessairement visibles »), mais pas à confondre « prospect » avec
// ce qu'on dit publiquement d'une mairie.
export const STATUTS_PARTENARIAT = [
  { cle: 'prospect', libelle: 'Prospect' },
  { cle: 'contact_etabli', libelle: 'Contact établi' },
  { cle: 'echange_en_cours', libelle: 'Échange en cours' },
  { cle: 'formalisation', libelle: 'Partenariat en formalisation' },
  { cle: 'actif', libelle: 'Actif' },
  { cle: 'convention_signee', libelle: 'Convention signée' },
  { cle: 'termine', libelle: 'Terminé' },
  { cle: 'archive', libelle: 'Archivé' },
]

/**
 * Contrôles de cohérence. Messages destinés à être lus tels quels (§24.4).
 *
 * Volontairement peu exigeant : le §24.4 décrit le parcours attendu pour
 * un partenaire — « saisir le nom, ajouter son logo, sélectionner le type,
 * saisir une courte présentation, prévisualiser, publier ». Rien d'autre ne
 * doit être imposé pour cette opération simple.
 */
export function valider(donnees, { statutVise }) {
  const erreurs = []

  if (!donnees.nom || !String(donnees.nom).trim()) {
    erreurs.push({ champ: 'nom', message: 'Le nom est obligatoire.' })
  }
  if (donnees.type && !TYPES.some((t) => t.cle === donnees.type)) {
    erreurs.push({ champ: 'type', message: "Ce type d'organisation n'existe pas." })
  }
  if (donnees.statutPartenariat && !STATUTS_PARTENARIAT.some((s) => s.cle === donnees.statutPartenariat)) {
    erreurs.push({ champ: 'statutPartenariat', message: "Ce statut de partenariat n'existe pas." })
  }
  // Le libellé public s'affiche dans une pastille à côté du nom : une phrase
  // entière y déborderait. Les formulations existantes tiennent en une
  // trentaine de caractères (« Présentation du projet en cours »).
  if (String(donnees.libellePublic || '').trim().length > LIBELLE_PUBLIC_MAX) {
    erreurs.push({
      champ: 'libellePublic',
      message: `Ce libellé s'affiche dans une petite pastille sur le site : ${LIBELLE_PUBLIC_MAX} caractères au maximum. Exemple : « Partenariat convenu ».`,
    })
  }

  const debut = donnees.debutLe ? new Date(donnees.debutLe) : null
  const fin = donnees.finLe ? new Date(donnees.finLe) : null
  if (debut && fin && !Number.isNaN(debut.getTime()) && !Number.isNaN(fin.getTime()) && fin < debut) {
    erreurs.push({ champ: 'finLe', message: 'La fin du partenariat ne peut pas précéder son début.' })
  }

  if (statutVise === 'publie' || statutVise === 'programme') {
    if (!donnees.type) {
      erreurs.push({ champ: 'type', message: "Choisissez le type d'organisation avant la mise en ligne." })
    }
    if (donnees.logo && !String(donnees.logoAlt || '').trim()) {
      erreurs.push({
        champ: 'logoAlt',
        message: "Décrivez le logo pour les personnes qui ne le voient pas. Exemple : « Logo de la commune de Castets. »",
      })
    }
  }

  return erreurs
}
