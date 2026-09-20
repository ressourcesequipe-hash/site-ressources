// Lecture seule de l'API Vercel — sert uniquement à connaître l'état réel
// d'un déploiement déjà déclenché (§2 de l'architecture technique :
// « interroge l'API Vercel sur l'état réel de ce déploiement précis »).
//
// Ce module ne déclenche jamais de déploiement : le seul chemin qui en
// déclenche un reste le deploy hook appelé par lib/deploiement.js.
//
// Pourquoi une recherche par fenêtre temporelle plutôt que par identifiant :
// un deploy hook Vercel répond `{ job: { id, state, createdAt } }`, où
// `job.id` identifie le *travail* de déclenchement, pas le déploiement
// (`dpl_…`) que l'API et les webhooks manipulent. On ne peut donc pas
// rapprocher les deux directement. On retrouve le déploiement par le seul
// lien fiable dont on dispose — le moment où le hook a été appelé — puis on
// mémorise son vrai identifiant `dpl_…` pour les interrogations suivantes.

const BASE = 'https://api.vercel.com'

// Marge avant `declencheLe`, pour absorber le seul écart d'horloge entre la
// base Neon et la plateforme Vercel. Elle doit rester PETITE : mesuré en
// conditions réelles le 20/09/2026, un déploiement est créé 5 secondes APRÈS
// l'appel au hook, jamais avant. Une marge d'une minute (valeur initiale) a
// provoqué un vrai défaut : la fenêtre du cycle suivant remontait jusqu'au
// déploiement du cycle précédent et le réattribuait, refermant le cycle
// prématurément sur un build déjà terminé — le back-office aurait annoncé
// « en ligne » un contenu dont le build tournait encore.
const MARGE_MS = 15 * 1000

export function apiVercelConfiguree() {
  return Boolean(process.env.VERCEL_API_TOKEN && process.env.VERCEL_PROJECT_ID)
}

// L'URL d'un deploy hook a la forme :
//   https://api.vercel.com/v1/integrations/deploy/<projectId>/<hookId>
// On en extrait l'identifiant du hook, que Vercel reporte ensuite dans
// `meta.deployHookId` de chaque déploiement qu'il a déclenché. Cela permet un
// rapprochement EXACT, sans variable d'environnement supplémentaire.
//
// Pourquoi c'est nécessaire : le projet a plusieurs deploy hooks actifs sur la
// même branche (`BACKOFFICE_HOOK` et `VITRINE_HOOK` au 20/09/2026). Sans ce
// critère, un déploiement déclenché par l'autre hook au même moment serait
// confondu avec le nôtre par la seule fenêtre temporelle.
export function idDuDeployHook() {
  const m = (process.env.VERCEL_DEPLOY_HOOK_URL || '').match(/\/deploy\/[^/]+\/([A-Za-z0-9_-]+)/)
  return m ? m[1] : null
}

function parametres() {
  const params = new URLSearchParams({
    projectId: process.env.VERCEL_PROJECT_ID,
    target: 'production',
    limit: '20',
  })
  // Le projet appartient à une équipe (`team_…`) : sans ce paramètre, l'API
  // répond 403 même avec un jeton valide.
  if (process.env.VERCEL_TEAM_ID) params.set('teamId', process.env.VERCEL_TEAM_ID)
  return params
}

async function listerDeploiementsProduction() {
  const reponse = await fetch(`${BASE}/v6/deployments?${parametres()}`, {
    headers: { Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}` },
  })
  if (!reponse.ok) {
    throw new Error(`API Vercel HTTP ${reponse.status} — jeton ou identifiants de projet à vérifier`)
  }
  const donnees = await reponse.json()
  return donnees?.deployments ?? []
}

// `readyState` (ou `state` selon les versions d'API) vaut QUEUED,
// INITIALIZING, BUILDING, READY, ERROR ou CANCELED.
function etatFinal(deploiementVercel) {
  const etat = deploiementVercel.readyState || deploiementVercel.state
  if (etat === 'READY') return 'pret'
  // Un déploiement annulé n'a pas mis le site à jour : du point de vue du
  // back-office, c'est un échec de publication, pas un succès.
  if (etat === 'ERROR' || etat === 'CANCELED') return 'echec'
  return null // encore en cours
}

/**
 * Retrouve le déploiement correspondant à une demande de publication.
 *
 * @param {object} options
 * @param {string|null} options.vercelDeploymentId identifiant `dpl_…` déjà
 *   connu (recherche directe, sans ambiguïté) ; null au premier passage.
 * @param {Date|null} options.declencheLe moment de l'appel au deploy hook,
 *   utilisé pour retrouver le déploiement la première fois.
 * @param {string[]} options.idsExclus déploiements déjà attribués à un cycle
 *   précédent et refermés. Deux publications successives passent par le MÊME
 *   deploy hook : `meta.deployHookId` ne permet donc pas de les distinguer
 *   l'une de l'autre, et c'est cette liste qui garantit qu'un déploiement
 *   n'est jamais compté deux fois.
 * @returns {Promise<{id: string, statut: string|null, erreur: string|null}|null>}
 *   null si aucun déploiement ne correspond (pas encore créé, par exemple).
 */
export async function trouverDeploiement({ vercelDeploymentId, declencheLe, idsExclus = [] }) {
  const deploiements = await listerDeploiementsProduction()
  const exclus = new Set(idsExclus)

  let trouve = null
  if (vercelDeploymentId?.startsWith('dpl_')) {
    trouve = deploiements.find((d) => (d.uid || d.id) === vercelDeploymentId)
  } else if (declencheLe) {
    const seuil = new Date(declencheLe).getTime() - MARGE_MS
    const candidats = deploiements
      .filter((d) => !exclus.has(d.uid || d.id))
      .filter((d) => new Date(d.created ?? d.createdAt).getTime() >= seuil)
      .sort((a, b) => new Date(a.created ?? a.createdAt) - new Date(b.created ?? b.createdAt))

    // 1) Critère exact : le déploiement porte l'identifiant de NOTRE deploy
    //    hook. C'est le cas normal, et il écarte d'emblée un déploiement
    //    déclenché au même instant par un autre hook du projet.
    const hookId = idDuDeployHook()
    if (hookId) {
      trouve = candidats.find((d) => d.meta?.deployHookId === hookId)
    }

    // 2) Repli : si Vercel ne renseigne pas cette métadonnée (version d'API,
    //    déploiement créé autrement), on retombe sur le plus ancien
    //    déploiement postérieur au déclenchement. Moins précis, mais jamais
    //    bloquant : la boucle se referme quand même, et une publication
    //    restée en attente repart au cycle suivant grâce à `redemande`.
    if (!trouve) trouve = candidats[0]
  }

  if (!trouve) return null

  return {
    id: trouve.uid || trouve.id,
    statut: etatFinal(trouve),
    erreur: etatFinal(trouve) === 'echec' ? `Déploiement Vercel en échec (${trouve.readyState || trouve.state})` : null,
  }
}
