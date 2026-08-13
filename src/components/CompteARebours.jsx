import { useEffect, useState } from 'react'

// Date de l'événement : samedi 3 octobre 2026, 10 h, heure locale.
export const DATE_EVENEMENT = new Date('2026-10-03T10:00:00+02:00')

function joursRestants() {
  const diff = DATE_EVENEMENT.getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 86400000))
}

/**
 * Compte à rebours jusqu'à la journée de lancement.
 * variant 'clair' pour un fond sombre, 'sombre' pour un fond clair,
 * 'kaki' pour les fonds très clairs où l'ocre décroche : sur le beige du
 * menu il ne fait que 2,4:1, en dessous du seuil de lisibilité.
 */
export default function CompteARebours({ variant = 'sombre', className = '' }) {
  const [jours, setJours] = useState(joursRestants)

  useEffect(() => {
    // Une actualisation par heure suffit pour un décompte en jours.
    const id = setInterval(() => setJours(joursRestants()), 3600000)
    return () => clearInterval(id)
  }, [])

  const kaki = variant === 'kaki'
  const chiffre = kaki ? 'text-kaki-dark' : 'text-ocre'
  const legende = kaki
    ? 'text-terre/70'
    : variant === 'clair'
      ? 'text-white/45'
      : 'text-terre/50'

  if (jours === 0) {
    return (
      <p className={`font-serif text-2xl ${chiffre} ${className}`}>
        C'est aujourd'hui !
      </p>
    )
  }

  return (
    <div className={`inline-flex items-baseline gap-2.5 ${className}`}>
      <span className={`font-serif text-4xl md:text-5xl leading-none ${chiffre}`}>
        J−{jours}
      </span>
      <span className={`font-sans text-sm ${legende}`}>
        avant le 03 octobre
      </span>
    </div>
  )
}
