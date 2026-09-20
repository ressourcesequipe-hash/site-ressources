// Logique métier des points de collecte publics — §13 du cahier.
//
// Attention (§13) : ce module concerne les lieux de dépôt ouverts au
// public. Il ne remplace pas la traçabilité des collectes, qui reste dans
// Ressources 360.
//
// Fonctions pures, vérifiables sans base ni requête.

export { STATUTS, LIBELLES_STATUT, slugifier, transitionAutorisee } from './contenus.js'

export const TYPES = [
  { cle: 'mairie', libelle: 'Mairie' },
  { cle: 'entreprise', libelle: 'Entreprise' },
  { cle: 'association', libelle: 'Association' },
  { cle: 'commerce', libelle: 'Commerce' },
  { cle: 'decheterie', libelle: 'Déchèterie' },
  { cle: 'evenement', libelle: 'Événement' },
  { cle: 'autre', libelle: 'Autre' },
]

export const JOURS = [
  { cle: 'lundi', libelle: 'Lundi' },
  { cle: 'mardi', libelle: 'Mardi' },
  { cle: 'mercredi', libelle: 'Mercredi' },
  { cle: 'jeudi', libelle: 'Jeudi' },
  { cle: 'vendredi', libelle: 'Vendredi' },
  { cle: 'samedi', libelle: 'Samedi' },
  { cle: 'dimanche', libelle: 'Dimanche' },
]

/**
 * État d'ouverture, DÉDUIT des dates plutôt que stocké — même principe que
 * pour les événements, et pour la même raison : un point dont la campagne
 * est terminée doit sortir de lui-même des points actifs, sans que
 * personne ait à changer un statut qui finirait par contredire le
 * calendrier.
 *
 * La fermeture temporaire, elle, est une décision humaine : elle prime, et
 * ne dépend d'aucune date.
 *
 * @returns {'ferme_temporairement'|'prevu'|'actif'|'termine'}
 */
export function etatOuverture(point, maintenant = new Date()) {
  if (point?.fermeTemporairement) return 'ferme_temporairement'

  const debut = point?.debutLe ? new Date(point.debutLe) : null
  const fin = point?.finLe ? new Date(point.finLe) : null

  if (debut && !Number.isNaN(debut.getTime()) && maintenant < debut) return 'prevu'
  if (fin && !Number.isNaN(fin.getTime()) && maintenant > fin) return 'termine'
  return 'actif'
}

export const LIBELLES_OUVERTURE = {
  ferme_temporairement: 'Fermé temporairement',
  prevu: 'Prévu',
  actif: 'Actif',
  termine: 'Terminé',
}

/** Ne garde que des créneaux exploitables, et ignore les lignes vides. */
export function nettoyerHoraires(horaires) {
  if (!Array.isArray(horaires)) return []
  const clesJours = JOURS.map((j) => j.cle)
  return horaires
    .filter((h) => h && clesJours.includes(h.jour) && String(h.ouverture || '').trim() && String(h.fermeture || '').trim())
    .map((h) => ({
      jour: h.jour,
      ouverture: String(h.ouverture).trim(),
      fermeture: String(h.fermeture).trim(),
      ...(String(h.precision || '').trim() ? { precision: String(h.precision).trim() } : {}),
    }))
}

/**
 * Contrôles de cohérence. Messages destinés à être lus tels quels (§24.4).
 */
export function valider(donnees, { statutVise }) {
  const erreurs = []

  if (!donnees.nom || !String(donnees.nom).trim()) {
    erreurs.push({ champ: 'nom', message: 'Le nom du lieu est obligatoire.' })
  }
  if (donnees.type && !TYPES.some((t) => t.cle === donnees.type)) {
    erreurs.push({ champ: 'type', message: "Ce type de point n'existe pas." })
  }

  const debut = donnees.debutLe ? new Date(donnees.debutLe) : null
  const fin = donnees.finLe ? new Date(donnees.finLe) : null
  if (debut && fin && !Number.isNaN(debut.getTime()) && !Number.isNaN(fin.getTime()) && fin < debut) {
    erreurs.push({ champ: 'finLe', message: 'La date de fin ne peut pas précéder la date de début.' })
  }

  // Les coordonnées sont facultatives, mais si l'une est saisie l'autre
  // l'est aussi : un point à moitié localisé ne s'affiche nulle part.
  const lat = String(donnees.latitude ?? '').trim()
  const lon = String(donnees.longitude ?? '').trim()
  if ((lat && !lon) || (lon && !lat)) {
    erreurs.push({ champ: lat ? 'longitude' : 'latitude', message: 'Indiquez les deux coordonnées, ou aucune.' })
  }
  for (const [cle, valeur, min, max] of [['latitude', lat, -90, 90], ['longitude', lon, -180, 180]]) {
    if (!valeur) continue
    const nombre = Number(valeur.replace(',', '.'))
    if (Number.isNaN(nombre) || nombre < min || nombre > max) {
      erreurs.push({ champ: cle, message: `Cette ${cle} n'est pas valide (attendu entre ${min} et ${max}).` })
    }
  }

  if (donnees.fermeTemporairement && !String(donnees.motifFermeture || '').trim()) {
    erreurs.push({
      champ: 'motifFermeture',
      message: 'Indiquez pourquoi le point est fermé : le message sera lu par les personnes qui comptaient y déposer du matériel.',
    })
  }

  if (statutVise === 'publie' || statutVise === 'programme') {
    if (!String(donnees.commune || '').trim()) {
      erreurs.push({ champ: 'commune', message: 'Indiquez la commune avant la mise en ligne : sans elle, on ne sait pas où se rendre.' })
    }
    if (!String(donnees.adresse || '').trim()) {
      erreurs.push({ champ: 'adresse', message: "Indiquez l'adresse avant la mise en ligne." })
    }
    if (!donnees.type) {
      erreurs.push({ champ: 'type', message: 'Choisissez le type de point avant la mise en ligne.' })
    }
    if (donnees.visibleCarte && (!lat || !lon)) {
      erreurs.push({
        champ: 'latitude',
        message: "Ce point doit apparaître sur la carte, mais n'a pas de coordonnées : renseignez-les, ou décochez l'affichage sur la carte.",
      })
    }
  }

  return erreurs
}
