import { useEffect, useState } from 'react'
import {
  ACCEPTE,
  REFUSE,
  effacerCookiesGoogle,
  enregistrerChoix,
  lireChoix,
} from '../lib/consentement'
import { demarrer } from '../lib/googleAnalytics'

// Retrait et rétablissement du consentement — politique de confidentialité.
//
// Le RGPD demande que retirer son accord soit aussi simple que le donner.
// « Aussi simple » se mesure : ici, deux clics depuis n'importe quelle page
// du site — le lien vers cette page, puis le bouton. C'est le même nombre
// que pour accepter depuis le bandeau.
//
// Le composant dit toujours où en est la personne AVANT de proposer de
// changer : un bouton « Refuser » seul laisserait croire que le suivi est
// actif alors qu'il ne l'est peut-être pas.

export default function ChoixMesure() {
  const [choix, setChoix] = useState(undefined)
  const [confirmation, setConfirmation] = useState(null)

  useEffect(() => {
    setChoix(lireChoix().choix)
  }, [])

  function repondre(reponse) {
    enregistrerChoix(reponse)
    setChoix(reponse)
    if (reponse === ACCEPTE) {
      demarrer()
      setConfirmation('Merci — votre accord est enregistré.')
    } else {
      // Retirer l'accord sans effacer les cookies déjà posés ne retirerait
      // rien : le suivi reprendrait à la page suivante.
      const effaces = effacerCookiesGoogle()
      setConfirmation(
        effaces.length > 0
          ? 'Votre refus est enregistré, et les cookies déjà déposés ont été supprimés.'
          : 'Votre refus est enregistré.'
      )
    }
  }

  // Rendu uniquement après montage : l'état dépend du navigateur de chaque
  // visiteur, il n'a rien à faire dans le HTML prérendu.
  if (choix === undefined) return null

  const etat =
    choix === ACCEPTE
      ? 'Vous avez accepté la mesure Google Analytics.'
      : choix === REFUSE
        ? 'Vous avez refusé la mesure Google Analytics.'
        : "Vous n'avez pas encore répondu : la mesure Google Analytics n'est pas active."

  return (
    <div className="border border-beige rounded-xl p-4 bg-beige/20 mt-3">
      <p className="text-sm text-terre">{etat}</p>

      {confirmation && (
        <p className="text-sm text-olive mt-2">{confirmation}</p>
      )}

      <div className="flex flex-wrap gap-2.5 mt-3">
        {choix !== ACCEPTE && (
          <button
            type="button"
            onClick={() => repondre(ACCEPTE)}
            className="px-4 py-2 rounded-lg bg-ocre text-white text-sm font-semibold hover:bg-ocre-dark transition-colors"
          >
            Accepter la mesure
          </button>
        )}
        {choix !== REFUSE && (
          <button
            type="button"
            onClick={() => repondre(REFUSE)}
            className="px-4 py-2 rounded-lg bg-ocre text-white text-sm font-semibold hover:bg-ocre-dark transition-colors"
          >
            Refuser la mesure
          </button>
        )}
      </div>

      <p className="text-xs text-terre/55 leading-relaxed mt-3">
        La mesure anonyme sans cookie, décrite plus haut, n'est pas concernée par ce
        choix : elle ne permet pas de vous identifier et fonctionne dans tous les cas.
      </p>
    </div>
  )
}
