// Chargement de Google Analytics, uniquement après accord.
//
// Le fragment fourni par Google charge la mesure dès l'ouverture de la page :
// les cookies sont déposés avant que le visiteur ait pu dire quoi que ce
// soit. C'est précisément ce que la CNIL interdit, et ce qui rend un
// consentement invalide — donc les données inexploitables.
//
// Ici, rien n'est chargé tant que `demarrer()` n'a pas été appelé, et il ne
// l'est que sur un clic explicite. Pas de « consent mode » qui chargerait
// quand même en mode dégradé : tant que la personne n'a pas tranché, aucune
// requête ne part vers Google.

const MESURE_ID = 'G-3YJ7LR1X7Q'
const SOURCE = `https://www.googletagmanager.com/gtag/js?id=${MESURE_ID}`

let demarre = false

export function estDemarre() {
  return demarre
}

export function demarrer() {
  if (demarre || typeof document === 'undefined') return
  if (document.querySelector(`script[src="${SOURCE}"]`)) { demarre = true; return }

  const script = document.createElement('script')
  script.async = true
  script.src = SOURCE
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag() { window.dataLayer.push(arguments) }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', MESURE_ID, {
    // Le back-office n'est pas le site : y mesurer l'audience gonflerait les
    // chiffres avec le travail de l'équipe. Même principe que l'exclusion
    // posée sur Vercel Web Analytics, pour que les deux outils comptent la
    // même chose.
    send_page_view: !estBackOffice(window.location.pathname),
  })

  demarre = true
}

export function estBackOffice(chemin) {
  return chemin === '/admin' || String(chemin).startsWith('/admin/')
}

/**
 * Vue de page, à appeler à chaque navigation.
 *
 * Nécessaire parce que le site est une application à page unique : sans cet
 * appel, Google ne verrait que la première page ouverte et compterait tout
 * le reste de la visite comme un seul écran.
 */
export function vuePage(chemin) {
  if (!demarre || typeof window.gtag !== 'function') return
  if (estBackOffice(chemin)) return
  window.gtag('event', 'page_view', {
    page_path: chemin,
    page_location: window.location.href,
    page_title: document.title,
  })
}
