// Machine à états du déploiement — §2 (révisé) de l'architecture technique.
//
// Remplace le minuteur de regroupement (« debounce ») de la première version
// du document, qui supposait à tort qu'une fonction serverless pouvait
// continuer de tourner après avoir répondu à sa requête. Ici, chaque appel
// tient entièrement dans une seule requête : rien n'a besoin de survivre
// entre deux invocations, tout l'état vit dans `etat_deploiement`.
//
// À appeler après toute publication de contenu (Étape 2), et après tout
// ajout/remplacement/suppression de média effectivement rattaché à un
// contenu publié (§4 — jamais pour un média « en réserve » non utilisé).
//
// FERMETURE DU CYCLE (ajoutée le 20/09/2026) — sans elle, l'état passait à
// `en_cours` et n'en ressortait jamais : toute publication suivante se
// contentait de poser `redemande = true`, et plus aucun déploiement n'était
// déclenché. Trois chemins la referment désormais, du plus réactif au plus
// tardif, tous passant par la même fonction `resoudreDeploiement()` :
//   1. opportuniste — toute nouvelle demande de publication commence par
//      vérifier si le déploiement précédent est terminé (`resoudreSiTermine`) ;
//   2. manuel — le bouton « Vérifier et publier maintenant » réservé à
//      Coordination/Super administrateur (api/admin/deploiement/verifier.js) ;
//   3. filet de sécurité — la tâche planifiée quotidienne (api/cron/taches.js).

import { eq, isNotNull } from 'drizzle-orm'
import { db } from './db.js'
import { etatDeploiement, deploiement } from '../db/schema.js'
import { apiVercelConfiguree, trouverDeploiement } from './vercel.js'

const ID_ETAT = 1
const DEPLOY_HOOK_URL = process.env.VERCEL_DEPLOY_HOOK_URL

// Au-delà de ce délai, un déploiement qu'on n'a pas réussi à rapprocher de
// l'API Vercel est considéré comme perdu et le cycle est refermé d'office.
// Un build de ce site dure une trentaine de secondes ; 30 minutes laissent
// une marge très large tout en garantissant qu'aucune panne d'API, aucun
// jeton expiré et aucun déploiement disparu ne peut bloquer durablement la
// publication. C'est la propriété importante : le système se débloque seul,
// même quand la lecture de l'état réel est impossible.
const DELAI_ABANDON_MS = 30 * 60 * 1000

async function lireOuCreerEtat() {
  const [ligne] = await db.select().from(etatDeploiement).where(eq(etatDeploiement.id, ID_ETAT))
  if (ligne) return ligne
  const [creee] = await db.insert(etatDeploiement).values({ id: ID_ETAT, statut: 'repos' }).returning()
  return creee
}

async function appelerDeployHook() {
  if (!DEPLOY_HOOK_URL) {
    throw new Error('VERCEL_DEPLOY_HOOK_URL manquante — voir docs/backoffice-variables-environnement.md')
  }
  const reponse = await fetch(DEPLOY_HOOK_URL, { method: 'POST' })
  if (!reponse.ok) throw new Error(`Deploy hook HTTP ${reponse.status}`)
  // Vercel répond `{ job: { id, state, createdAt } }`. Confirmé en conditions
  // réelles le 20/09/2026 : `job.id` fait 20 caractères sans préfixe (ex.
  // `jVBP2KJpD3Xls3yI6hQA`) et n'est PAS le `dpl_…` que manipulent l'API et
  // les webhooks — il ne sert donc pas à rapprocher le résultat. Conservé
  // uniquement pour le journal applicatif. Le rapprochement réel combine
  // `meta.deployHookId`, l'horodatage et l'exclusion des déploiements déjà
  // consommés (voir lib/vercel.js).
  const donnees = await reponse.json().catch(() => ({}))
  return donnees?.job?.id ?? null
}

/**
 * Point d'entrée unique pour déclencher (ou différer) un déploiement.
 * Ne dépend d'aucun état en mémoire : sûr à appeler depuis n'importe quelle
 * invocation de fonction serverless, dans n'importe quel ordre.
 *
 * @param {object} options
 * @param {boolean} options.resoudreDabord tente d'abord de refermer un cycle
 *   précédent déjà terminé. Mis à false uniquement par `resoudreDeploiement`,
 *   qui vient justement de le faire — évite une récursion entre les deux.
 */
export async function demanderDeploiement({ resoudreDabord = true } = {}) {
  if (resoudreDabord) await resoudreSiTermine()

  const etat = await lireOuCreerEtat()

  if (etat.statut === 'repos') {
    await db
      .update(etatDeploiement)
      .set({ statut: 'en_attente', majLe: new Date() })
      .where(eq(etatDeploiement.id, ID_ETAT))

    const declencheLe = new Date()
    try {
      const jobId = await appelerDeployHook()
      await db
        .update(etatDeploiement)
        .set({
          statut: 'en_cours',
          // Volontairement laissé vide : le vrai `dpl_…` n'est connu qu'au
          // premier rapprochement réussi avec l'API Vercel, qui l'écrit ici.
          vercelDeploymentId: null,
          declencheLe,
          majLe: new Date(),
        })
        .where(eq(etatDeploiement.id, ID_ETAT))
      await db.insert(deploiement).values({ statut: 'en_cours', declencheLe, erreur: null })
      return { declenche: true, jobId }
    } catch (e) {
      // L'appel au hook lui-même a échoué (rare) : on revient à `repos`
      // plutôt que de rester bloqué en `en_attente` indéfiniment.
      await db.update(etatDeploiement).set({ statut: 'repos' }).where(eq(etatDeploiement.id, ID_ETAT))
      throw e
    }
  }

  // Un déploiement est déjà en attente ou en cours : pas de second appel au
  // hook (c'est ce qui évite les déploiements redondants, §5.5 du cahier) —
  // seulement la marque qu'il faudra en redéclencher un à sa clôture.
  await db.update(etatDeploiement).set({ redemande: true }).where(eq(etatDeploiement.id, ID_ETAT))
  return { declenche: false, regroupe: true }
}

/**
 * Vérifie si le déploiement en cours est terminé et, le cas échéant, referme
 * le cycle. Ne fait rien si aucun déploiement n'est en cours.
 *
 * Ne lève jamais : une panne d'API Vercel ne doit pas faire échouer la
 * publication qui appelle cette fonction en passant. Le garde-fou de délai
 * ci-dessous garantit de toute façon le déblocage.
 *
 * @returns {Promise<{resolu: boolean, statut?: string, raison?: string}>}
 */
export async function resoudreSiTermine() {
  const etat = await lireOuCreerEtat()
  if (etat.statut === 'repos') return { resolu: false, raison: 'aucun déploiement en cours' }

  const depuis = etat.declencheLe ? Date.now() - new Date(etat.declencheLe).getTime() : 0
  const expire = etat.declencheLe && depuis > DELAI_ABANDON_MS

  if (apiVercelConfiguree()) {
    try {
      // Déploiements déjà attribués à un cycle refermé : ils ne doivent
      // jamais être réattribués au cycle courant. Deux publications
      // successives passent par le même deploy hook, donc ni l'horodatage ni
      // `meta.deployHookId` ne suffisent à les distinguer — c'est cette
      // exclusion qui le fait. Défaut constaté en conditions réelles le
      // 20/09/2026, avant ce correctif.
      const dejaConsommes = await db
        .select({ id: deploiement.vercelDeploymentId })
        .from(deploiement)
        .where(isNotNull(deploiement.resoluLe))

      const trouve = await trouverDeploiement({
        vercelDeploymentId: etat.vercelDeploymentId,
        declencheLe: etat.declencheLe,
        idsExclus: dejaConsommes.map((l) => l.id).filter(Boolean),
      })

      // Déploiement identifié mais pas encore terminé : on mémorise son
      // identifiant réel pour que les passages suivants soient directs.
      if (trouve && !trouve.statut) {
        if (trouve.id !== etat.vercelDeploymentId) {
          await db
            .update(etatDeploiement)
            .set({ vercelDeploymentId: trouve.id, majLe: new Date() })
            .where(eq(etatDeploiement.id, ID_ETAT))
          await db
            .update(deploiement)
            .set({ vercelDeploymentId: trouve.id })
            .where(eq(deploiement.declencheLe, etat.declencheLe))
        }
        return { resolu: false, raison: 'déploiement toujours en cours' }
      }

      if (trouve?.statut) {
        await resoudreDeploiement(trouve.id, trouve.statut, trouve.erreur, etat)
        return { resolu: true, statut: trouve.statut }
      }
    } catch (e) {
      // Journalisé, jamais propagé : voir le commentaire de la fonction.
      console.error('[deploiement] lecture de l’état réel impossible :', e.message)
    }
  }

  if (expire) {
    await resoudreDeploiement(
      etat.vercelDeploymentId,
      'echec',
      "État réel du déploiement inconnu au-delà du délai d'attente — cycle refermé d'office pour ne pas bloquer les publications suivantes.",
      etat
    )
    return { resolu: true, statut: 'echec', raison: 'délai dépassé' }
  }

  return { resolu: false, raison: 'état réel indisponible, délai non dépassé' }
}

/**
 * Referme le cycle : enregistre le résultat, remet l'état au repos, et
 * redéclenche aussitôt un déploiement si une publication est arrivée
 * pendant celui qui vient de se terminer (§2).
 *
 * @param {string|null} vercelDeploymentId identifiant `dpl_…`, s'il est connu
 * @param {string} statutFinal `pret` | `echec`
 * @param {string|null} erreur message conservé pour diagnostic (§2 : jamais
 *   exposé en clair aux profils non techniques)
 * @param {object|null} etatConnu évite une relecture quand l'appelant vient
 *   déjà de lire l'état
 */
export async function resoudreDeploiement(vercelDeploymentId, statutFinal, erreur = null, etatConnu = null) {
  const etat = etatConnu ?? (await lireOuCreerEtat())

  // La ligne de journal est retrouvée par son horodatage de déclenchement :
  // c'est la seule clé disponible tant que le `dpl_…` n'a pas été rapproché.
  const cible = etat.declencheLe
    ? eq(deploiement.declencheLe, etat.declencheLe)
    : eq(deploiement.vercelDeploymentId, vercelDeploymentId)

  await db
    .update(deploiement)
    .set({ vercelDeploymentId, statut: statutFinal, resoluLe: new Date(), erreur })
    .where(cible)

  await db
    .update(etatDeploiement)
    .set({ statut: 'repos', vercelDeploymentId: null, declencheLe: null, majLe: new Date() })
    .where(eq(etatDeploiement.id, ID_ETAT))

  if (etat.redemande) {
    await db.update(etatDeploiement).set({ redemande: false }).where(eq(etatDeploiement.id, ID_ETAT))
    // `resoudreDabord: false` : on vient précisément de refermer le cycle,
    // inutile (et risque de récursion) de le revérifier immédiatement.
    await demanderDeploiement({ resoudreDabord: false })
  }
}

/**
 * État courant, pour affichage dans l'interface (§2 : ne jamais présenter un
 * contenu comme en ligne tant que le déploiement n'est pas `pret`).
 */
export async function lireEtatDeploiement() {
  const etat = await lireOuCreerEtat()
  const journal = await db
    .select()
    .from(deploiement)
    .orderBy(deploiement.id)
    .limit(10)
  return { etat, derniers: journal.slice(-10).reverse() }
}
