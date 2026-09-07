// Configuration Brevo partagée entre l'API du site (api/contact.js), les
// formulaires (src/) et le script d'installation (scripts/brevo-setup.mjs).
// Un seul endroit décrit les listes, les attributs et la façon dont chaque
// formulaire les alimente.

// Les listes existent déjà dans Brevo et sont gérées à la main : le script ne
// les crée pas, il retrouve leur identifiant par le nom. Ces noms doivent donc
// correspondre au caractère près à ceux du compte.
export const LISTES = {
  newsletter: {
    nom: '001-NEWSLETTERS',
    role: 'Consentement à recevoir la lettre d\'information. SEULE liste utilisable pour une campagne marketing.',
  },
  donateurs: {
    nom: '002 - Donateurs / Apports',
    role: 'Dons de matériel informatique et de végétaux.',
  },
  benevoles: {
    nom: '003 - Bénévoles / Candidats',
    role: 'Candidatures bénévoles et envies d\'engagement.',
  },
  partenaires: {
    nom: '004 - Partenaires / Prospects',
    role: 'Points de collecte, partenaires végétaux, mécénat, partenariat institutionnel.',
  },
  tombola: {
    nom: '005 - Tombola',
    role: 'Billetterie de la tombola. Alimentée hors site.',
  },
}

// Attributs de contact créés dans Brevo. PRENOM et NOM existent déjà sur le
// compte (configuré en français) ; le script ne crée que ce qui manque.
// Le téléphone est volontairement un attribut texte et non l'attribut standard
// SMS : Brevo rejette tout le contact si le numéro n'est pas au format E.164,
// et les visiteurs saisissent « 06 12 34 56 78 ».
export const ATTRIBUTS = {
  PRENOM: 'text',
  NOM: 'text',
  TELEPHONE: 'text',
  COMMUNE: 'text',
  ADRESSE: 'text',
  STRUCTURE: 'text',
  TYPE_STRUCTURE: 'text',
  MISSION: 'text',
  SOURCE: 'text',
  OPTIN_NEWSLETTER: 'boolean',
  // Réécrit à chaque envoi de formulaire : c'est la date qui fait courir la
  // durée de conservation annoncée dans la politique de confidentialité
  // (« 3 ans après le dernier contact »).
  DATE_DERNIER_CONTACT: 'date',
}

// ── Menus déroulants ────────────────────────────────────────────────────────
//
// Les formulaires « Nous rejoindre » et « Contact » demandent au visiteur ce
// qui l'amène ; sa réponse décide de la liste où il atterrit. Les options sont
// définies ici et non dans les pages, pour que le libellé affiché et la règle
// de routage ne puissent pas diverger : renommer une option ici la renomme à
// l'écran et met à jour le routage du même coup.
//
// `liste: null` signifie « aucune liste » : le contact est bien enregistré dans
// Brevo avec ses attributs, et l'équipe reçoit la notification, mais il n'entre
// dans aucune liste de diffusion.

export const ENGAGEMENTS = [
  { label: 'Bénévolat — filière informatique', liste: 'benevoles' },
  { label: 'Bénévolat — filière végétale', liste: 'benevoles' },
  { label: 'Bénévolat — événements', liste: 'benevoles' },
  { label: 'Mécénat / Sponsoring', liste: 'partenaires' },
  { label: 'Partenariat institutionnel', liste: 'partenaires' },
  { label: 'Autre', liste: 'benevoles' },
]

export const SUJETS_CONTACT = [
  { label: 'Don de matériel informatique', liste: 'donateurs' },
  { label: 'Don de plantes ou végétaux', liste: 'donateurs' },
  { label: 'Achat solidaire (équipement reconditionné)', liste: null },
  { label: 'Bénévolat ou adhésion', liste: 'benevoles' },
  { label: 'Partenariat ou mécénat', liste: 'partenaires' },
  { label: 'Autre question', liste: null },
]

// Retrouve la liste associée à une option choisie. Une valeur vide ou inconnue
// — menu non renseigné, libellé modifié — retombe sur `defaut` plutôt que de
// perdre le contact en silence.
function selonMenu(options, valeur, defaut = null) {
  const trouve = options.find((o) => o.label === valeur)
  if (!trouve) return defaut
  return trouve.liste
}

// ── Formulaires ─────────────────────────────────────────────────────────────

// Découpe « Prénom Nom » saisi dans un champ unique. Le dernier mot est le nom,
// tout ce qui précède le prénom — imparfait pour les noms composés, mais c'est
// ce que permet un formulaire à un seul champ.
function nomComplet(valeur) {
  const parts = String(valeur || '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return {}
  if (parts.length === 1) return { NOM: parts[0] }
  return { PRENOM: parts.slice(0, -1).join(' '), NOM: parts[parts.length - 1] }
}

// Pour chaque type de formulaire : les listes où atterrit le contact — un
// tableau de clés, ou une fonction des données saisies — et la traduction de
// ses champs en attributs Brevo.
//
// `optinImplicite` marque les formulaires dont l'envoi vaut consentement à la
// lettre d'information, parce que c'est précisément ce que le visiteur y
// demande. Partout ailleurs il faut une case à cocher, sinon on inscrirait à
// une liste de diffusion des gens venus demander un enlèvement de matériel.
export const FORMULAIRES = {
  newsletter: {
    listes: ['newsletter'],
    optinImplicite: true,
    attributs: () => ({}),
  },
  // Le formulaire d'inscription à l'événement de lancement est présenté comme
  // une inscription à la lettre d'information : le visiteur y demande à être
  // tenu informé, l'envoi vaut donc consentement.
  evenement: {
    listes: ['newsletter'],
    optinImplicite: true,
    attributs: (d) => ({
      PRENOM: d.prenom,
      NOM: d.nom,
      COMMUNE: d.commune,
    }),
  },
  rejoindre: {
    listes: (d) => [selonMenu(ENGAGEMENTS, d.engagement, 'benevoles')],
    attributs: (d) => ({
      ...nomComplet(d.nom),
      COMMUNE: d.commune,
      MISSION: d.engagement,
    }),
  },
  contact: {
    listes: (d) => [selonMenu(SUJETS_CONTACT, d.sujet)],
    attributs: (d) => ({
      ...nomComplet(d.nom),
      TELEPHONE: d.telephone,
    }),
  },
  benevole: {
    listes: ['benevoles'],
    attributs: (d) => ({
      ...nomComplet(d.nom),
      TELEPHONE: d.telephone,
      COMMUNE: d.commune,
      MISSION: d.mission,
    }),
  },
  donMateriel: {
    listes: ['donateurs'],
    attributs: (d) => ({
      ...nomComplet(d.nom),
      TELEPHONE: d.telephone,
      ADRESSE: d.adresse,
    }),
  },
  pointCollecte: {
    listes: ['partenaires'],
    attributs: (d) => ({
      ...nomComplet(d.nom),
      TELEPHONE: d.telephone,
      COMMUNE: d.commune,
      STRUCTURE: d.structure,
      TYPE_STRUCTURE: d.typeStructure,
    }),
  },
  partenaireVegetal: {
    listes: ['partenaires'],
    attributs: (d) => ({
      ...nomComplet(d.contact),
      COMMUNE: d.commune,
      STRUCTURE: d.structure,
      TYPE_STRUCTURE: 'Filière végétale',
    }),
  },
}

// Résout les listes d'un formulaire, qu'elles soient fixes ou déduites du menu
// choisi, en écartant les `null` (« aucune liste »).
export function listesDe(type, data) {
  const conf = FORMULAIRES[type]
  if (!conf) return []
  const brut = typeof conf.listes === 'function' ? conf.listes(data) : conf.listes
  return brut.filter(Boolean)
}

// Libellé lisible du formulaire, stocké dans l'attribut SOURCE pour savoir d'où
// vient un contact sans avoir à croiser les listes.
export const SOURCES = {
  newsletter: 'Newsletter',
  rejoindre: 'Nous rejoindre',
  benevole: 'Bénévolat',
  donMateriel: 'Demande d\'enlèvement',
  evenement: 'Événement lancement 2026',
  pointCollecte: 'Point de collecte',
  partenaireVegetal: 'Partenariat végétal',
  contact: 'Contact général',
}
