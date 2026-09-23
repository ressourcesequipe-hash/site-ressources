// Consentement à la mesure d'audience non anonyme — §27 du cahier, et la
// recommandation « cookies et autres traceurs » de la CNIL.
//
// Deux mesures cohabitent sur ce site, et elles ne relèvent pas du même
// régime :
//
//   — Vercel Web Analytics, sans cookie et anonyme, n'a pas besoin d'accord.
//     Elle tourne pour tout le monde, tout le temps.
//   — Google Analytics dépose des cookies. Il n'est chargé qu'après un
//     accord explicite, et rien n'est chargé tant que la personne n'a pas
//     tranché — pas même en mode dégradé.
//
// TROIS RÈGLES QUI NE SE NÉGOCIENT PAS, parce qu'un consentement invalide
// rend les données inexploitables autant qu'il expose l'association :
//
//   1. Refuser demande exactement autant de gestes qu'accepter.
//   2. L'absence de réponse n'est pas un accord. Fermer, ignorer ou faire
//      défiler ne vaut rien.
//   3. Le choix se retire aussi simplement qu'il se donne (voir la section
//      « Vos choix » de la politique de confidentialité).

const CLE = 'ressources.consentement.mesure'

// Six mois, durée recommandée par la CNIL. Au-delà, la question est reposée.
// Le refus est conservé aussi longtemps que l'accord : reposer la question à
// chaque page à qui a dit non serait du harcèlement déguisé, et cela vicie
// le consentement qu'on finirait par obtenir.
export const DUREE_MS = 182 * 24 * 60 * 60 * 1000

export const ACCEPTE = 'accepte'
export const REFUSE = 'refuse'

/**
 * @returns {{ choix: 'accepte'|'refuse'|null, le: number|null }}
 *   `choix: null` signifie « pas encore demandé, ou réponse expirée ».
 */
export function lireChoix(maintenant = Date.now()) {
  // Un navigateur en navigation privée, ou dont le stockage est bloqué, lève
  // à la lecture. C'est un cas normal, pas une erreur : on se comporte alors
  // comme si la question n'avait pas encore été posée — donc sans charger
  // Google Analytics.
  let brut = null
  try {
    brut = window.localStorage.getItem(CLE)
  } catch {
    return { choix: null, le: null }
  }
  if (!brut) return { choix: null, le: null }

  try {
    const { choix, le } = JSON.parse(brut)
    if (choix !== ACCEPTE && choix !== REFUSE) return { choix: null, le: null }
    if (!Number.isFinite(le) || maintenant - le > DUREE_MS) return { choix: null, le: null }
    return { choix, le }
  } catch {
    return { choix: null, le: null }
  }
}

export function enregistrerChoix(choix, maintenant = Date.now()) {
  if (choix !== ACCEPTE && choix !== REFUSE) return false
  try {
    window.localStorage.setItem(CLE, JSON.stringify({ choix, le: maintenant }))
    return true
  } catch {
    // Stockage indisponible : le choix vaut pour la visite en cours, et la
    // question sera reposée à la suivante. Mieux vaut cela que d'ignorer un
    // refus faute de pouvoir l'écrire.
    return false
  }
}

export function oublierChoix() {
  try {
    window.localStorage.removeItem(CLE)
    return true
  } catch {
    return false
  }
}

// Retirer son accord ne suffit pas à effacer ce qui a déjà été déposé :
// tant que les cookies de Google restent dans le navigateur, le suivi peut
// reprendre. On les supprime donc explicitement.
//
// `_ga` et `_ga_<ID>` sont les deux cookies posés par GA4. Ils sont écrits
// sur le domaine racine, d'où la tentative sur plusieurs variantes — on ne
// peut pas lire l'attribut `domain` d'un cookie depuis JavaScript, seulement
// le réécrire expiré.
export function effacerCookiesGoogle(hote = window.location.hostname) {
  const noms = document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((n) => n === '_ga' || n.startsWith('_ga_') || n === '_gid')

  const domaines = [undefined, hote, '.' + hote, '.' + hote.split('.').slice(-2).join('.')]
  for (const nom of noms) {
    for (const domaine of domaines) {
      document.cookie =
        `${nom}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/` +
        (domaine ? `; domain=${domaine}` : '')
    }
  }
  return noms
}
