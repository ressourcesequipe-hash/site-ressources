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

// ── Horaires tels que le site les affiche ────────────────────────────────
//
// Le back-office stocke un créneau par ligne et par jour ; le site les lit
// regroupés (« Lundi au jeudi 8h30–13h et 14h–17h »). Le regroupement se fait
// ici, au moment de l'export, pour que personne n'ait à saisir deux fois la
// même information sous deux formes.

/** « 08:30 » → « 8h30 », « 09:00 » → « 9h ». */
export function formaterHeure(valeur) {
  const m = String(valeur ?? '').trim().match(/^(\d{1,2})[:h](\d{2})?/)
  if (!m) return String(valeur ?? '').trim()
  const minutes = m[2] && m[2] !== '00' ? m[2] : ''
  return `${Number(m[1])}h${minutes}`
}

/** Libellé d'un ensemble de jours : « Vendredi », « Lundi et jeudi », « Lundi au vendredi ». */
export function libelleJours(cles) {
  const ordre = JOURS.map((j) => j.cle)
  const index = [...new Set(cles)].map((c) => ordre.indexOf(c)).filter((i) => i >= 0).sort((a, b) => a - b)
  const noms = index.map((i) => JOURS[i].libelle.toLowerCase())
  if (noms.length === 0) return ''
  const majuscule = (t) => t.charAt(0).toUpperCase() + t.slice(1)
  const suite = index.every((i, k) => k === 0 || i === index[k - 1] + 1)
  if (noms.length >= 3 && suite) return majuscule(`${noms[0]} au ${noms[noms.length - 1]}`)
  if (noms.length === 1) return majuscule(noms[0])
  return majuscule(`${noms.slice(0, -1).join(', ')} et ${noms[noms.length - 1]}`)
}

/**
 * Créneaux par jour → groupes affichés. Les jours qui partagent exactement
 * les mêmes créneaux sont réunis, qu'ils se suivent ou non ; les groupes
 * suivent l'ordre de la semaine.
 *
 * @returns {{ jours: string, creneaux: string[] }[]}
 */
export function regrouperHoraires(horaires) {
  const parJour = new Map()
  for (const h of nettoyerHoraires(horaires)) {
    if (!parJour.has(h.jour)) parJour.set(h.jour, [])
    parJour.get(h.jour).push(h)
  }

  const groupes = new Map()
  for (const { cle } of JOURS) {
    const creneaux = parJour.get(cle)
    if (!creneaux) continue
    const textes = creneaux
      .sort((a, b) => a.ouverture.localeCompare(b.ouverture))
      .map((c) => `${formaterHeure(c.ouverture)}–${formaterHeure(c.fermeture)}`)
    const signature = textes.join('|')
    if (!groupes.has(signature)) groupes.set(signature, { jours: [], creneaux: textes })
    groupes.get(signature).jours.push(cle)
  }

  return [...groupes.values()].map((g) => ({ jours: libelleJours(g.jours), creneaux: g.creneaux }))
}

/**
 * Opération inverse, pour reprendre les horaires écrits à la main sur le
 * site : « Lundi au jeudi » + « 8h30–13h » → un créneau par jour.
 */
export function deplierHoraires(groupes) {
  const ordre = JOURS.map((j) => j.cle)
  const heure = (t) => {
    const m = String(t).trim().match(/^(\d{1,2})h(\d{2})?$/)
    return m ? `${m[1].padStart(2, '0')}:${m[2] ?? '00'}` : null
  }
  const sortie = []
  for (const { jours, creneaux } of groupes || []) {
    const mots = jours.toLowerCase().split(/\s*(?:,|\bet\b)\s*/).filter(Boolean)
    let cles = []
    for (const mot of mots) {
      const plage = mot.match(/^(\S+) au (\S+)$/)
      if (plage) {
        const a = ordre.indexOf(plage[1])
        const b = ordre.indexOf(plage[2])
        if (a < 0 || b < a) throw new Error(`Jours illisibles : « ${jours} »`)
        cles.push(...ordre.slice(a, b + 1))
      } else {
        if (!ordre.includes(mot)) throw new Error(`Jour illisible : « ${mot} »`)
        cles.push(mot)
      }
    }
    for (const cle of cles) {
      for (const c of creneaux) {
        const [o, f] = c.split('–').map(heure)
        if (!o || !f) throw new Error(`Créneau illisible : « ${c} »`)
        sortie.push({ jour: cle, ouverture: o, fermeture: f })
      }
    }
  }
  return sortie
}
