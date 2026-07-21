import { useEffect, useState } from 'react'

// Date de l'événement : samedi 3 octobre 2026, 10 h, heure locale.
export const DATE_EVENEMENT = new Date('2026-10-03T10:00:00+02:00')

function joursRestants() {
  const diff = DATE_EVENEMENT.getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 86400000))
}

/**
 * Compte à rebours jusqu'à la journée de lancement.
 * variant 'clair' pour un fond sombre, 'sombre' pour un fond clair.
 */
export default function CompteARebours({ variant = 'sombre', className = '' }) {
  const [jours, setJours] = useState(joursRestants)

  useEffect(() => {
    // Une actualisation par heure suffit pour un décompte en jours.
    const id = setInterval(() => setJours(joursRestants()), 3600000)
    return () => clearInterval(id)
  }, [])

  const clair = variant === 'clair'

  if (jours === 0) {
    return (
      <p className={`font-serif text-2xl ${clair ? 'text-ocre' : 'text-ocre'} ${className}`}>
        C'est aujourd'hui !
      </p>
    )
  }

  return (
    <div className={`inline-flex items-baseline gap-2.5 ${className}`}>
      <span className={`font-serif text-4xl md:text-5xl leading-none ${clair ? 'text-ocre' : 'text-ocre'}`}>
        J−{jours}
      </span>
      <span className={`font-sans text-sm ${clair ? 'text-white/45' : 'text-terre/50'}`}>
        avant le 03 octobre
      </span>
    </div>
  )
}
