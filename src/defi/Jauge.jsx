import { forwardRef } from 'react'
import { challenge } from '../data/defiConfig'
import { PART_OBJECTIF, position } from './store'

const GRADUATIONS = [0, 100, 250, 400]
const pct = (x) => `${(x * 100).toFixed(3)}%`

export function IconeCible() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="dfi-cible">
      <circle cx="24" cy="24" r="21" fill="#fff" stroke="#C8973A" strokeWidth="4" />
      <circle cx="24" cy="24" r="13" fill="none" stroke="#3D4A2D" strokeWidth="4" />
      <circle cx="24" cy="24" r="5.5" fill="#C8973A" />
    </svg>
  )
}

// Grande flèche horizontale. `valeur` est la valeur ANIMÉE : le remplissage
// et le compteur lisent la même, donc avancent exactement ensemble.
const Jauge = forwardRef(function Jauge({ valeur, pulse }, refMarqueur) {
  const cible = challenge.target
  const pos = position(valeur, cible)
  const vert = Math.min(pos, PART_OBJECTIF)
  const ocre = Math.max(pos - PART_OBJECTIF, 0)

  return (
    <div className="dfi-jauge">
      <div className={`dfi-marqueur${pulse ? ' dfi-pulse' : ''}`} style={{ left: pct(PART_OBJECTIF) }} ref={refMarqueur}>
        <div className="dfi-marqueur-carte">
          <IconeCible />
          <div>
            <b>{cible} kg</b>
            <span>OBJECTIF</span>
          </div>
        </div>
        <i className="dfi-marqueur-tige" />
      </div>

      <div className="dfi-fleche">
        <div className="dfi-remplissage" style={{ width: pct(vert) }} />
        {ocre > 0 && <div className="dfi-depassement" style={{ left: pct(PART_OBJECTIF), width: pct(ocre) }} />}
        {GRADUATIONS.slice(1).map((g) => (
          <i key={g} className="dfi-grad" style={{ left: pct(PART_OBJECTIF * (g / cible)) }} />
        ))}
      </div>

      <div className="dfi-graduations">
        {GRADUATIONS.map((g) => (
          <span key={g} className={g === 0 ? 'dfi-grad-zero' : ''} style={{ left: pct(PART_OBJECTIF * (g / cible)) }}>
            {g} kg
          </span>
        ))}
        <span className="dfi-au-dela" style={{ left: pct(PART_OBJECTIF + (1 - PART_OBJECTIF) / 2 - 0.02) }}>
          <b>{cible} kg et +</b>
          <em>{valeur >= cible ? 'Au-delà de l’objectif' : 'On continue !'}</em>
        </span>
      </div>
    </div>
  )
})

export default Jauge
