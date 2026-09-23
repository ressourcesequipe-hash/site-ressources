import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ACCEPTE,
  REFUSE,
  effacerCookiesGoogle,
  enregistrerChoix,
  lireChoix,
} from '../lib/consentement'
import { demarrer, estDemarre, vuePage } from '../lib/googleAnalytics'

// Demande de consentement à la mesure Google Analytics.
//
// Vercel Web Analytics, anonyme et sans cookie, tourne indépendamment de ce
// bandeau : refuser ici ne prive l'association d'aucune mesure de base, et
// c'est ce qui permet de poser la question honnêtement plutôt que de forcer.
//
// TROIS CHOSES QUE CE COMPOSANT NE FAIT PAS, volontairement :
//
//   — il ne bloque pas la page. Un mur de consentement pousse à cliquer
//     n'importe quoi pour s'en débarrasser, et un accord arraché ainsi ne
//     vaut rien ;
//   — il ne traite ni la fermeture, ni le défilement, ni l'inaction comme
//     un accord ;
//   — il ne donne pas plus de poids visuel à « Accepter » qu'à « Refuser ».
//     La persuasion est dans le texte, où elle est légitime.
//
// Rien n'est rendu côté serveur : le composant décide après montage, comme
// les bandeaux de campagne, pour ne pas figer dans le HTML prérendu un état
// qui dépend du navigateur de chaque visiteur.

export default function BandeauConsentement() {
  const { pathname } = useLocation()
  const [choix, setChoix] = useState(undefined) // undefined = pas encore lu

  useEffect(() => {
    const { choix: enregistre } = lireChoix()
    setChoix(enregistre)
    if (enregistre === ACCEPTE) demarrer()
  }, [])

  // Le site est une application à page unique : sans cet appel, Google ne
  // verrait que la première page ouverte.
  useEffect(() => {
    if (choix === ACCEPTE && estDemarre()) vuePage(pathname)
  }, [pathname, choix])

  const repondre = useCallback((reponse) => {
    enregistrerChoix(reponse)
    setChoix(reponse)
    if (reponse === ACCEPTE) demarrer()
    // Un refus après un accord doit aussi effacer ce qui a déjà été déposé :
    // tant que les cookies de Google restent là, le suivi peut reprendre.
    else effacerCookiesGoogle()
  }, [])

  // `undefined` : la lecture n'a pas eu lieu (rendu serveur ou tout premier
  // instant). `ACCEPTE`/`REFUSE` : la question est tranchée.
  if (choix !== null) return null

  // Le back-office n'est pas le site public : ses utilisateurs sont
  // identifiés et n'ont pas à répondre à une question posée aux visiteurs.
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return null

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consentement-titre"
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
    >
      <div className="max-w-3xl mx-auto bg-white border border-beige-dark rounded-2xl shadow-2xl shadow-terre/20 p-5 sm:p-6">
        <h2 id="consentement-titre" className="font-serif text-lg text-terre mb-3">
          Nous aider à faire mieux
        </h2>

        <div className="text-[13.5px] text-terre/75 leading-relaxed space-y-2.5">
          <p>
            <strong className="text-terre">Ressources</strong> est une association d'intérêt
            général. Pour bien faire notre travail — savoir quelles pages vous sont vraiment
            utiles, où nos informations manquent, quelles collectes touchent leur public —
            nous avons besoin de comprendre comment ce site est utilisé.
          </p>
          <p>
            <strong className="text-terre">Ce que nous en faisons, et rien d'autre</strong> :
            améliorer le site et orienter nos actions de collecte, de réemploi et de
            solidarité. Vos données ne sont ni vendues, ni échangées, ni utilisées à des fins
            publicitaires. Nous ne cherchons pas à savoir qui vous êtes.
          </p>
          <p>Accepter, c'est nous donner un coup de main qui ne vous coûte rien.</p>
        </div>

        {/* Deux boutons de présentation identique : même taille, même style,
            un seul clic chacun. Une apparence qui pousse vers l'acceptation
            vicie le consentement, et c'est le premier point que regarde un
            contrôle. */}
        <div className="flex flex-wrap gap-2.5 mt-5">
          <button
            type="button"
            onClick={() => repondre(ACCEPTE)}
            className="px-5 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark transition-colors"
          >
            Accepter
          </button>
          <button
            type="button"
            onClick={() => repondre(REFUSE)}
            className="px-5 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark transition-colors"
          >
            Refuser
          </button>
        </div>

        <p className="text-[11.5px] text-terre/50 leading-relaxed mt-4">
          Mesure assurée par Google Analytics. Vous pouvez changer d'avis à tout moment ; le
          site fonctionne de la même façon dans les deux cas. Détails dans notre{' '}
          <Link to="/confidentialite/" className="text-ocre hover:underline">
            politique de confidentialité
          </Link>.
        </p>
      </div>
    </div>
  )
}
