// Fréquentation du site — lecture de l'API Web Analytics de Vercel.
//
// Le §7 du cahier veut un tableau de bord qui dise ce qui se passe. La
// fréquentation en fait partie, et jusqu'ici elle n'était consultable que
// dans le tableau de bord Vercel — donc par les seules personnes ayant un
// compte Vercel, c'est-à-dire une.
//
// Ce qui est mesuré est anonyme et agrégé : aucune donnée personnelle ne
// transite par ce fichier, et il n'y a donc rien à protéger ici au sens du
// §16 — seulement des nombres.
//
// Endpoint et paramètres vérifiés le 23/09/2026 dans la référence REST de
// Vercel : GET /v1/query/web-analytics/visits/aggregate, avec `by` (tableau
// d'au plus deux dimensions), `since` et `until` (millisecondes ou date
// lisible), tous requis.

const BASE = 'https://api.vercel.com'

// Le forfait Hobby ne conserve qu'un mois de données (vérifié le 23/09/2026
// sur la page de tarification). Demander davantage ne renverrait pas plus,
// mais laisserait croire à l'équipe qu'elle regarde un trimestre.
export const JOURS_MAX = 30
export const JOURS_DEFAUT = 28

export function statistiquesConfigurees() {
  return Boolean(process.env.VERCEL_API_TOKEN && process.env.VERCEL_PROJECT_ID)
}

// La documentation publique ne montre pas le nom du champ portant la mesure,
// seulement les dimensions. Plutôt que de parier sur `pageviews` et de livrer
// un écran à zéro si Vercel le nomme autrement, on accepte les variantes
// plausibles — et `champsInconnus` plus bas permet de le signaler au lieu
// d'afficher silencieusement des zéros.
const NOMS_VUES = ['pageviews', 'views', 'pageViews', 'count', 'total']
const NOMS_VISITEURS = ['visitors', 'uniqueVisitors', 'devices', 'sessions']

function nombre(ligne, noms) {
  for (const nom of noms) {
    const v = ligne?.[nom]
    if (typeof v === 'number') return v
    if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v)
  }
  return null
}

function premiereDimension(ligne, dimension) {
  const v = ligne?.[dimension]
  return typeof v === 'string' && v.trim() ? v.trim() : null
}

async function interroger({ by, since, until, limit = 10 }) {
  const params = new URLSearchParams({
    projectId: process.env.VERCEL_PROJECT_ID,
    since: String(since),
    until: String(until),
    limit: String(limit),
  })
  // `by` est un tableau : chaque dimension est passée séparément, sinon
  // l'API reçoit la chaîne « day,requestPath » et ne reconnaît ni l'une ni
  // l'autre.
  for (const d of by) params.append('by', d)
  // Le projet peut appartenir à une équipe : sans ce paramètre, l'API répond
  // 403 malgré un jeton valide (constaté à l'Étape 1 sur les déploiements).
  if (process.env.VERCEL_TEAM_ID) params.set('teamId', process.env.VERCEL_TEAM_ID)

  const reponse = await fetch(`${BASE}/v1/query/web-analytics/visits/aggregate?${params}`, {
    headers: { Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}` },
    signal: AbortSignal.timeout(10_000),
  })

  if (reponse.status === 404) {
    // Vercel répond 404 quand Web Analytics n'est pas activé sur le projet :
    // ce n'est pas une panne, c'est un réglage qui manque, et l'équipe doit
    // lire cela plutôt qu'« une erreur est survenue ».
    const erreur = new Error("Web Analytics n'est pas activé sur le projet Vercel.")
    erreur.code = 'non_active'
    throw erreur
  }
  if (!reponse.ok) {
    const detail = await reponse.text().catch(() => '')
    const erreur = new Error(`API Vercel HTTP ${reponse.status}. ${detail.slice(0, 200)}`.trim())
    erreur.code = 'api'
    throw erreur
  }

  const corps = await reponse.json().catch(() => null)
  return Array.isArray(corps?.data) ? corps.data : []
}

/**
 * Fréquentation sur les `jours` derniers jours.
 *
 * Quatre interrogations en parallèle plutôt qu'en série : l'écran s'ouvre en
 * une fois, et un tableau de bord qui met quatre secondes à s'afficher n'est
 * pas consulté.
 */
export async function lireFrequentation({ jours = JOURS_DEFAUT } = {}) {
  const fenetre = Math.min(Math.max(1, Number(jours) || JOURS_DEFAUT), JOURS_MAX)
  const until = Date.now()
  const since = until - fenetre * 24 * 60 * 60 * 1000

  const [parJour, parPage, parProvenance, parAppareil] = await Promise.all([
    interroger({ by: ['day'], since, until, limit: JOURS_MAX }),
    interroger({ by: ['requestPath'], since, until, limit: 8 }),
    interroger({ by: ['referrerHostname'], since, until, limit: 6 }),
    interroger({ by: ['deviceType'], since, until, limit: 5 }),
  ])

  const jourAvecMesure = parJour.find((l) => nombre(l, NOMS_VUES) !== null)
  const champsInconnus = parJour.length > 0 && !jourAvecMesure

  const serie = parJour
    .map((l) => ({
      jour: premiereDimension(l, 'day') || premiereDimension(l, 'date'),
      vues: nombre(l, NOMS_VUES) ?? 0,
      visiteurs: nombre(l, NOMS_VISITEURS) ?? 0,
    }))
    .filter((l) => l.jour)
    .sort((a, b) => String(a.jour).localeCompare(String(b.jour)))

  const repartition = (lignes, dimension, defaut) =>
    lignes
      .map((l) => ({
        cle: premiereDimension(l, dimension) || defaut,
        vues: nombre(l, NOMS_VUES) ?? 0,
        visiteurs: nombre(l, NOMS_VISITEURS) ?? 0,
      }))
      .sort((a, b) => b.vues - a.vues)

  return {
    fenetreJours: fenetre,
    champsInconnus,
    total: {
      vues: serie.reduce((s, l) => s + l.vues, 0),
      visiteurs: serie.reduce((s, l) => s + l.visiteurs, 0),
    },
    serie,
    pages: repartition(parPage, 'requestPath', '(inconnue)'),
    // Un référent vide, c'est un accès direct : quelqu'un qui tape l'adresse,
    // suit un lien depuis un message ou revient par un favori. C'est une
    // information, pas un trou dans les données.
    provenances: repartition(parProvenance, 'referrerHostname', 'Accès direct'),
    appareils: repartition(parAppareil, 'deviceType', '(inconnu)'),
  }
}

// ── Mise en forme, côté interface comme côté serveur ─────────────────────

export function nombreLisible(n) {
  const v = Number(n) || 0
  return v.toLocaleString('fr-FR')
}

// « / » ne dit rien dans une liste de pages : c'est l'accueil.
export function cheminLisible(chemin) {
  if (!chemin || chemin === '/') return 'Accueil'
  return chemin
}

/**
 * Évolution entre la première et la seconde moitié de la période.
 *
 * Volontairement pas un « + 12 % » sec : sur des volumes faibles — ce qui est
 * le cas d'un site associatif qui démarre — un écart de trois visites produit
 * des pourcentages spectaculaires et faux. En dessous d'un seuil, on préfère
 * ne rien affirmer.
 */
export const SEUIL_TENDANCE = 20

export function tendance(serie = []) {
  if (serie.length < 4) return { fiable: false }
  const milieu = Math.floor(serie.length / 2)
  const avant = serie.slice(0, milieu).reduce((s, l) => s + l.vues, 0)
  const apres = serie.slice(milieu).reduce((s, l) => s + l.vues, 0)
  if (avant + apres < SEUIL_TENDANCE) return { fiable: false, avant, apres }
  if (avant === 0) return { fiable: false, avant, apres }
  return {
    fiable: true,
    avant,
    apres,
    variation: Math.round(((apres - avant) / avant) * 100),
  }
}
