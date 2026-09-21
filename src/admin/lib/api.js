// Appels aux routes d'administration — enveloppe minimale autour de `fetch`.
//
// Tout passe par ici pour deux raisons : les cookies de session doivent être
// joints à chaque requête, et les erreurs doivent arriver aux écrans sous une
// forme exploitable plutôt qu'en exception brute. Un écran ne doit jamais
// avoir à deviner ce qui s'est passé (§24.7 : ne jamais laisser l'utilisateur
// dans l'incertitude).

const BASE = '/api/admin'

// Les sept modules de contenu sont servis par une seule fonction
// serverless (`api/admin/contenus.js`), parce que le palier Vercel du
// projet limite leur nombre par déploiement — treize fonctions avaient fait
// refuser le déploiement du 21/09/2026.
//
// Cette traduction est faite ici, en un seul endroit, pour que les écrans
// continuent d'appeler `/actualites` ou `/pages` : ils n'ont pas à connaître
// une contrainte d'hébergement, et le jour où elle disparaîtra, seule cette
// liste sera à retirer.
const MODULES_REGROUPES = [
  'actualites', 'ateliers', 'categories-ateliers',
  'evenements', 'organisations', 'pages', 'points-collecte',
]

function versUrl(chemin) {
  const [base, requete] = chemin.replace(/^\//, '').split('?')
  if (!MODULES_REGROUPES.includes(base)) return BASE + chemin
  const params = new URLSearchParams(requete || '')
  params.set('module', base)
  return `${BASE}/contenus?${params}`
}

/**
 * @returns {Promise<{ok: boolean, statut: number, donnees: any, erreur: string|null,
 *   erreurs: Array<{champ: string, message: string}>|null, conflit: boolean}>}
 */
export async function appelerApi(chemin, options = {}) {
  let reponse
  try {
    reponse = await fetch(versUrl(chemin), {
      method: options.methode || 'GET',
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
      body: options.corps ? JSON.stringify(options.corps) : undefined,
    })
  } catch {
    // Coupure réseau, navigateur hors ligne : cas courant sur un poste
    // associatif, qui mérite un message compréhensible plutôt qu'un plantage.
    return {
      ok: false, statut: 0, donnees: null, conflit: false, erreurs: null,
      erreur: "La connexion au serveur a échoué. Vérifiez votre accès à internet, puis réessayez.",
    }
  }

  // Une réponse HTML là où on attend du JSON signale une route non servie —
  // exactement le symptôme rencontré en production le 20/09/2026. Mieux vaut
  // le dire que laisser une exception d'analyse remonter.
  const typeContenu = reponse.headers.get('content-type') || ''
  if (!typeContenu.includes('json')) {
    return {
      ok: false, statut: reponse.status, donnees: null, conflit: false, erreurs: null,
      erreur: "Le serveur n'a pas répondu comme prévu. Rechargez la page ; si cela persiste, signalez-le.",
    }
  }

  const donnees = await reponse.json().catch(() => null)

  if (reponse.ok) {
    return { ok: true, statut: reponse.status, donnees, erreur: null, erreurs: null, conflit: false }
  }

  return {
    ok: false,
    statut: reponse.status,
    donnees,
    conflit: reponse.status === 409,
    erreurs: Array.isArray(donnees?.erreurs) ? donnees.erreurs : null,
    erreur: donnees?.message || donnees?.error || "L'opération n'a pas pu aboutir.",
  }
}
