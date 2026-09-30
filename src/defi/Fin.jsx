import { useEffect } from 'react'
import { challenge } from '../data/defiConfig'
import { nombreFr } from './store'

// Écran de clôture : remerciements, puis ouverture sur la suite. Ouvert par le
// bouton FIN de la barre du bas, refermé par Échap, un clic dehors ou le bouton.
export default function Fin({ totalKg, onFermer, onContinuer }) {
  useEffect(() => {
    const touche = (e) => { if (e.key === 'Escape') onFermer() }
    window.addEventListener('keydown', touche)
    return () => window.removeEventListener('keydown', touche)
  }, [onFermer])

  const decimales = totalKg % 1 ? 1 : 0
  const surplus = Math.max(totalKg - challenge.target, 0)

  return (
    <div className="dfi-fin" role="dialog" aria-modal="true" aria-label="Remerciements" onMouseDown={(e) => e.target === e.currentTarget && onFermer()}>
      <div className="dfi-fin-carte">
        <h2>Merci !</h2>
        <p className="dfi-fin-total">
          <b>{nombreFr(totalKg, decimales)} kg</b> de matériel informatique
          <br />sauvés de l’oubli, grâce à vous tous
        </p>
        {surplus > 0 && (
          <p className="dfi-fin-surplus">
            L’objectif de {challenge.target} kg est dépassé de {nombreFr(surplus, decimales)} kg
          </p>
        )}
        <p className="dfi-fin-texte">
          Merci aux communes, aux points de collecte, aux partenaires
          <br />et à tous les habitants qui se sont mobilisés.
        </p>
        <p className="dfi-fin-avenir">
          Ce n’est pas une fin, c’est un début.
          <br />Ensemble, continuons à donner une seconde vie au matériel du territoire.
        </p>
        {onContinuer && <button type="button" className="dfi-fin-continuer" onClick={onContinuer}>Continuer →</button>}
        <button type="button" className="dfi-fin-ferme" onClick={onFermer}>Fermer</button>
      </div>
    </div>
  )
}
