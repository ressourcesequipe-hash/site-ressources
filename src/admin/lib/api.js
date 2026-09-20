// Appels aux routes d'administration — enveloppe minimale autour de `fetch`.
//
// Tout passe par ici pour deux raisons : les cookies de session doivent être
// joints à chaque requête, et les erreurs doivent arriver aux écrans sous une
// forme exploitable plutôt qu'en exception brute. Un écran ne doit jamais
// avoir à deviner ce qui s'est passé (§24.7 : ne jamais laisser l'utilisateur
// dans l'incertitude).

const BASE = '/api/admin'

/**
 * @returns {Promise<{ok: boolean, statut: number, donnees: any, erreur: string|null,
 *   erreurs: Array<{champ: string, message: string}>|null, conflit: boolean}>}
 */
export async function appelerApi(chemin, options = {}) {
  let reponse
  try {
    reponse = await fetch(BASE + chemin, {
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
