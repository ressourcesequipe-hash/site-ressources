// Règles du module Demandes — §15 et §16 du cahier des charges.
//
// Fichier volontairement sans aucun import de base de données ni de réseau :
// tout ce qui décide (routage, statuts, validation, anti-spam) est testable
// sans connexion, et partagé tel quel entre le serveur et l'interface.

import { ENGAGEMENTS, SUJETS_CONTACT } from './brevo.js'

// ── Rubriques (§15) ──────────────────────────────────────────────────────

export const RUBRIQUES = [
  { cle: 'don_materiel', libelle: 'Don de matériel' },
  { cle: 'partenariat_vegetal', libelle: 'Partenariat végétal' },
  { cle: 'partenariat', libelle: 'Partenariats' },
  { cle: 'benevolat_adhesion', libelle: 'Bénévolat et adhésion' },
  { cle: 'evenement_atelier', libelle: 'Événements et ateliers' },
  { cle: 'contact_general', libelle: 'Contact général' },
]

export const CLES_RUBRIQUES = RUBRIQUES.map((r) => r.cle)
export const LIBELLES_RUBRIQUE = Object.fromEntries(
  RUBRIQUES.map((r) => [r.cle, r.libelle])
)

// ── Routage (§5 de l'architecture) ───────────────────────────────────────
//
// Le visiteur ne choisit jamais de rubrique : elle se déduit du formulaire
// qu'il a rempli et, pour les deux formulaires à menu déroulant, de l'option
// qu'il a choisie — exactement la même option qui décide déjà de sa liste
// Brevo. Une seule décision côté visiteur, deux conséquences côté équipe :
// impossible que la demande arrive dans une rubrique et le contact dans une
// liste sans rapport.

const RUBRIQUE_PAR_FORMULAIRE = {
  donMateriel: 'don_materiel',
  partenaireVegetal: 'partenariat_vegetal',
  pointCollecte: 'partenariat',
  benevole: 'benevolat_adhesion',
  evenement: 'evenement_atelier',
}

const RUBRIQUE_PAR_ENGAGEMENT = {
  'Bénévolat — filière informatique': 'benevolat_adhesion',
  'Bénévolat — filière végétale': 'benevolat_adhesion',
  'Bénévolat — événements': 'benevolat_adhesion',
  'Mécénat / Sponsoring': 'partenariat',
  'Partenariat institutionnel': 'partenariat',
  Autre: 'benevolat_adhesion',
}

// « Don de plantes ou végétaux » rejoint la filière végétale et non la
// rubrique « Don de matériel », qui désigne le matériel informatique : c'est
// la même équipe qui traite les dons de végétaux et les partenariats
// végétaux, et la router ailleurs ferait passer la demande par des mains qui
// n'en font rien.
const RUBRIQUE_PAR_SUJET = {
  'Don de matériel informatique': 'don_materiel',
  'Don de plantes ou végétaux': 'partenariat_vegetal',
  'Achat solidaire (équipement reconditionné)': 'contact_general',
  'Bénévolat ou adhésion': 'benevolat_adhesion',
  'Partenariat ou mécénat': 'partenariat',
  'Autre question': 'contact_general',
}

// Le formulaire newsletter ne crée pas de demande : il n'y a rien à traiter,
// et le §15 exclut explicitement la newsletter du module.
export const SANS_DEMANDE = ['newsletter']

// Une option renommée sur le site sans l'être ici ne doit jamais faire perdre
// une demande : elle atterrit dans « Contact général », visible, plutôt que
// dans une rubrique inexistante ou dans le vide.
export function rubriqueDe(typeFormulaire, donnees = {}) {
  if (SANS_DEMANDE.includes(typeFormulaire)) return null

  const directe = RUBRIQUE_PAR_FORMULAIRE[typeFormulaire]
  if (directe) return directe

  if (typeFormulaire === 'rejoindre') {
    return RUBRIQUE_PAR_ENGAGEMENT[donnees.engagement] || 'benevolat_adhesion'
  }
  if (typeFormulaire === 'contact') {
    return RUBRIQUE_PAR_SUJET[donnees.sujet] || 'contact_general'
  }
  return 'contact_general'
}

// Garde-fou de cohérence : si une option est ajoutée aux menus de
// lib/brevo.js sans être routée ici, la demande partirait silencieusement
// dans « Contact général ». Le test unitaire appelle cette fonction pour que
// l'oubli se voie au moment où il est commis, pas six mois plus tard.
export function optionsNonRoutees() {
  const manquantes = []
  for (const o of ENGAGEMENTS) {
    if (!RUBRIQUE_PAR_ENGAGEMENT[o.label]) manquantes.push(`rejoindre : « ${o.label} »`)
  }
  for (const o of SUJETS_CONTACT) {
    if (!RUBRIQUE_PAR_SUJET[o.label]) manquantes.push(`contact : « ${o.label} »`)
  }
  return manquantes
}

// ── Statuts (§15) ────────────────────────────────────────────────────────

export const STATUTS = [
  { cle: 'nouveau', libelle: 'Nouveau' },
  { cle: 'a_traiter', libelle: 'À traiter' },
  { cle: 'en_cours', libelle: 'En cours' },
  { cle: 'en_attente', libelle: 'En attente' },
  { cle: 'traite', libelle: 'Traité' },
  { cle: 'cloture', libelle: 'Clôturé' },
  { cle: 'spam', libelle: 'Spam' },
]

export const CLES_STATUTS = STATUTS.map((s) => s.cle)
export const LIBELLES_STATUT_DEMANDE = Object.fromEntries(
  STATUTS.map((s) => [s.cle, s.libelle])
)

// Ce qui reste à faire, par opposition à ce qui est refermé. Sert au filtre
// par défaut de la boîte et au compteur des rubriques : une équipe ouvre sa
// boîte pour voir ce qui l'attend, pas l'historique complet.
export const STATUTS_OUVERTS = ['nouveau', 'a_traiter', 'en_cours', 'en_attente']
export const STATUTS_CLOS = ['traite', 'cloture', 'spam']

// Aucune contrainte d'enchaînement, sauf une : « Nouveau » est l'état
// d'arrivée, personne ne peut y revenir. Une demande lue ne redevient pas
// non lue, sinon le compteur de la boîte cesse de vouloir dire quelque chose.
// Tout le reste est libre, y compris sortir de « Spam » : un faux positif
// doit pouvoir être rattrapé.
export function transitionStatutAutorisee(depuis, vers) {
  if (!CLES_STATUTS.includes(vers)) {
    return { ok: false, raison: `Statut inconnu : ${vers}` }
  }
  if (depuis === vers) return { ok: true }
  if (vers === 'nouveau') {
    return {
      ok: false,
      raison:
        "« Nouveau » signale une demande que personne n'a encore ouverte : on ne peut pas y revenir. Utilisez « À traiter » pour signaler qu'elle reste à prendre en charge.",
    }
  }
  return { ok: true }
}

// ── Lecture d'une demande ────────────────────────────────────────────────
//
// Les formulaires n'ont pas les mêmes champs et le §15 interdit d'en faire un
// éditeur de formulaires : la fiche doit donc savoir afficher des données
// dont elle ne connaît pas la forme à l'avance. Ce tableau donne l'ordre et
// les libellés des champs connus ; tout champ absent d'ici reste affiché,
// avec sa clé brute pour libellé. Un champ ajouté au site apparaît donc tout
// seul dans la fiche, sans rien casser ni rien perdre.

export const CHAMPS_FORMULAIRE = {
  rejoindre: [
    ['nom', 'Nom'], ['email', 'Email'], ['commune', 'Commune'],
    ['engagement', 'Engagement souhaité'], ['message', 'Message'],
  ],
  benevole: [
    ['nom', 'Nom'], ['email', 'Email'], ['telephone', 'Téléphone'],
    ['commune', 'Commune'], ['mission', 'Mission souhaitée'], ['message', 'Message'],
  ],
  donMateriel: [
    ['nom', 'Nom'], ['telephone', 'Téléphone'], ['email', 'Email'],
    ['adresse', 'Adresse'], ['materiel', 'Matériel proposé'],
  ],
  evenement: [
    ['prenom', 'Prénom'], ['nom', 'Nom'], ['email', 'Email'],
    ['commune', 'Commune'], ['message', 'Message'],
  ],
  pointCollecte: [
    ['structure', 'Structure'], ['nom', 'Nom du contact'], ['email', 'Email'],
    ['telephone', 'Téléphone'], ['commune', 'Commune'],
    ['typeStructure', 'Type de structure'], ['message', 'Message'],
  ],
  partenaireVegetal: [
    ['structure', 'Structure'], ['contact', 'Nom du contact'], ['email', 'Email'],
    ['commune', 'Commune'], ['partenariat', 'Partenariat envisagé'],
  ],
  contact: [
    ['nom', 'Nom'], ['email', 'Email'], ['telephone', 'Téléphone'],
    ['sujet', 'Sujet'], ['message', 'Message'],
  ],
}

// Champs internes au transport, jamais montrés dans la fiche : ils ne disent
// rien à l'équipe, et deux d'entre eux n'existent que pour l'anti-spam.
const CHAMPS_TECHNIQUES = ['type', 'optinNewsletter', 'piege', 'remplile', 'source']

export function champsLisibles(demande) {
  const donnees = demande?.donnees || {}
  const connus = CHAMPS_FORMULAIRE[demande?.typeFormulaire] || []
  const vus = new Set()
  const sortie = []

  for (const [cle, libelle] of connus) {
    vus.add(cle)
    const valeur = donnees[cle]
    if (valeur === undefined || valeur === null || valeur === '') continue
    sortie.push({ cle, libelle, valeur: String(valeur) })
  }
  for (const [cle, valeur] of Object.entries(donnees)) {
    if (vus.has(cle) || CHAMPS_TECHNIQUES.includes(cle)) continue
    if (valeur === undefined || valeur === null || valeur === '') continue
    if (typeof valeur === 'object') continue
    sortie.push({ cle, libelle: cle, valeur: String(valeur) })
  }
  return sortie
}

// Colonnes extraites à l'enregistrement pour la liste et la recherche. Elles
// ne remplacent pas `donnees`, qui garde le formulaire d'origine intact : ce
// sont des copies, et la fiche lit toujours l'original.
const ALIAS_NOM = ['nom', 'contact', 'structure', 'prenom']

export function colonnesExtraites(typeFormulaire, donnees = {}) {
  const prendre = (cles) => {
    for (const c of cles) {
      const v = donnees[c]
      if (typeof v === 'string' && v.trim()) return v.trim().slice(0, 300)
    }
    return null
  }
  // Le formulaire d'inscription à l'événement sépare prénom et nom.
  const nom =
    typeFormulaire === 'evenement' && (donnees.prenom || donnees.nom)
      ? [donnees.prenom, donnees.nom].filter(Boolean).join(' ').trim().slice(0, 300)
      : prendre(ALIAS_NOM)

  return {
    nom,
    email: prendre(['email']),
    telephone: prendre(['telephone']),
    commune: prendre(['commune']),
    message: prendre(['message', 'materiel', 'partenariat', 'mission']),
  }
}

// ── Validation d'une réponse par email (§15) ─────────────────────────────

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validerReponse(corpsRequete = {}) {
  const erreurs = []
  const destinataire = String(corpsRequete.destinataire || '').trim()
  const sujet = String(corpsRequete.sujet || '').trim()
  const corps = String(corpsRequete.corps || '').trim()

  if (!destinataire) erreurs.push('Le destinataire est obligatoire.')
  else if (!EMAIL.test(destinataire)) erreurs.push("L'adresse du destinataire n'est pas valide.")
  if (!sujet) erreurs.push("L'objet du message est obligatoire.")
  else if (sujet.length > 200) erreurs.push("L'objet ne peut pas dépasser 200 caractères.")
  if (!corps) erreurs.push('Le message ne peut pas être vide.')
  else if (corps.length > 20000) erreurs.push('Le message est trop long (20 000 caractères maximum).')

  return { ok: erreurs.length === 0, erreurs, valeurs: { destinataire, sujet, corps } }
}

// ── Journalisation (§16) ─────────────────────────────────────────────────
//
// « Aucune donnée personnelle dans les journaux » ne s'obtient pas en
// écrivant des `console.error` prudents : Drizzle recopie les paramètres de
// la requête dans le message de ses erreurs. Journaliser `e.message` après
// un échec d'insertion enverrait donc le nom, l'email, le téléphone,
// l'adresse et le message du visiteur dans les journaux Vercel — vérifié le
// 21/09/2026 en provoquant l'échec.
//
// Le nom de la requête et des colonnes suffit à diagnostiquer ; les valeurs
// n'apprennent rien qu'on ne puisse retrouver en base, par identifiant.

export function messageSansDonnees(erreur) {
  let texte = String(erreur?.message ?? erreur ?? 'erreur inconnue')
  // « params: … » de Drizzle, et « Key (colonne)=(valeur) » de Postgres :
  // les deux seuls endroits où des valeurs se glissent dans un message.
  texte = texte.split(/\bparams:/)[0]
  texte = texte.replace(/Key \([^)]*\)=\([^)]*\)/g, 'Key (…)=(…)')
  texte = texte.replace(/\s+/g, ' ').trim()
  return texte.slice(0, 300) || 'erreur inconnue'
}

// ── Verrou de rédaction (§15) ────────────────────────────────────────────
//
// Un verrou actif, et non un simple contrôle de version comme pour les
// contenus : une modification concurrente se rattrape, un email parti en
// double ne se rattrape pas. Il expire de lui-même pour qu'un onglet laissé
// ouvert ne bloque jamais définitivement une demande.

export const DUREE_VERROU_MS = 10 * 60 * 1000

export function verrouActif(verrou, maintenant = new Date()) {
  if (!verrou?.expireLe) return false
  return new Date(verrou.expireLe).getTime() > maintenant.getTime()
}

// ── Anti-spam (§16) ──────────────────────────────────────────────────────
//
// Un score, pas un verdict : le message est enregistré dans tous les cas et
// reste consultable. Au-delà du seuil il arrive dans « Spam » au lieu de
// « Nouveau », ce qui le sort de la boîte sans le supprimer — une erreur de
// jugement de cette fonction coûte un clic, jamais une demande perdue.

export const SEUIL_SPAM = 3

const MOTS_SUSPECTS = [
  'seo', 'backlink', 'crypto', 'bitcoin', 'casino', 'viagra',
  'loan offer', 'investment opportunity', 'dear sir/madam', 'guest post',
]

// Contrôle de cadence (§16), à deux niveaux parce qu'une rafale n'est pas
// toujours une attaque : cinq envois en dix minutes depuis une même origine,
// c'est ce que produit une mairie ou une école dont tous les postes sortent
// par la même adresse — c'est suspect, ce n'est pas une preuve. Au-delà de
// douze, plus aucune explication ordinaire ne tient.
export const FENETRE_CADENCE_MS = 10 * 60 * 1000
export const ENVOIS_AVANT_SUSPICION = 5
export const ENVOIS_MANIFESTEMENT_ABUSIFS = 12

export function scorerSpam(donnees = {}, { piegeRempli = false, envoisRecents = 0 } = {}) {
  let score = 0
  const raisons = []

  // Champ caché rempli : aucun visiteur ne le voit, seul un automate le
  // remplit. À lui seul il suffit à classer le message.
  if (piegeRempli) {
    score += SEUIL_SPAM
    raisons.push('champ piège rempli')
  }

  if (envoisRecents >= ENVOIS_MANIFESTEMENT_ABUSIFS) {
    score += SEUIL_SPAM
    raisons.push(`${envoisRecents} envois en moins de dix minutes`)
  } else if (envoisRecents >= ENVOIS_AVANT_SUSPICION) {
    score += 2
    raisons.push(`${envoisRecents} envois en moins de dix minutes`)
  }

  const texte = Object.values(donnees)
    .filter((v) => typeof v === 'string')
    .join(' ')
    .toLowerCase()

  const liens = (texte.match(/https?:\/\//g) || []).length
  if (liens >= 3) { score += 2; raisons.push(`${liens} liens`) }
  else if (liens === 2) { score += 1; raisons.push('2 liens') }

  const mots = MOTS_SUSPECTS.filter((m) => texte.includes(m))
  if (mots.length) { score += mots.length; raisons.push(`termes : ${mots.join(', ')}`) }

  // Un message intégralement en majuscules, au-delà de quelques mots.
  const message = String(donnees.message || '')
  if (message.length > 40 && message === message.toUpperCase()) {
    score += 1
    raisons.push('message tout en majuscules')
  }

  return { score, raisons, suspect: score >= SEUIL_SPAM }
}

export function statutInitial(resultatSpam) {
  return resultatSpam?.suspect ? 'spam' : 'nouveau'
}

// ── Export CSV (§15) ─────────────────────────────────────────────────────
//
// Séparateur point-virgule et BOM en tête : c'est ce qu'attend Excel en
// configuration française, et ce fichier est destiné à être ouvert dans
// Excel, pas relu par un programme.

function celluleCsv(valeur) {
  const texte = String(valeur ?? '').replace(/\r?\n/g, ' ')
  // Une cellule commençant par =, +, - ou @ est interprétée comme une
  // formule par Excel. Ces données viennent d'un formulaire public : on la
  // neutralise en la forçant en texte.
  const sur = /^[=+\-@]/.test(texte) ? `'${texte}` : texte
  return `"${sur.replace(/"/g, '""')}"`
}

export function versCsv(demandes = []) {
  const entetes = [
    'Reçue le', 'Rubrique', 'Formulaire', 'Statut', 'Nom', 'Email',
    'Téléphone', 'Commune', 'Message',
  ]
  const lignes = demandes.map((d) => [
    d.creeLe ? new Date(d.creeLe).toLocaleString('fr-FR') : '',
    LIBELLES_RUBRIQUE[d.rubrique] || d.rubrique,
    d.typeFormulaire,
    LIBELLES_STATUT_DEMANDE[d.statut] || d.statut,
    d.nom, d.email, d.telephone, d.commune, d.message,
  ])
  return '﻿' + [entetes, ...lignes].map((l) => l.map(celluleCsv).join(';')).join('\r\n')
}
