import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function EventBanner() {
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('event-banner-dismissed') === '1'
  )

  if (dismissed) return null

  return (
    <div className="relative bg-kaki overflow-hidden z-50">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ocre/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          <span className="hidden sm:flex items-center gap-1.5 bg-ocre/15 border border-ocre/25 px-2.5 py-1 shrink-0">
            <CalendarIcon />
            <span className="font-sans text-[10px] font-bold text-ocre tracking-[0.15em] uppercase whitespace-nowrap">
              03 OCT 2026
            </span>
          </span>

          <p className="font-sans text-sm text-white/90 text-center">
            <strong className="text-white font-semibold">Événement de lancement</strong>
            <span className="hidden md:inline text-white/60">
              {' '}· Challenge 1 tonne · Plus de 7 000 € de lots · Vielle-Saint-Girons
            </span>
          </p>

          <Link
            to="/evenement-lancement-03-octobre-2026/"
            className="shrink-0 border border-ocre text-ocre px-3.5 py-1 text-[11px] font-semibold tracking-wide hover:bg-ocre hover:text-white transition-all duration-200 whitespace-nowrap font-sans"
          >
            En savoir plus →
          </Link>
        </div>
      </div>

      <button
        onClick={() => {
          sessionStorage.setItem('event-banner-dismissed', '1')
          setDismissed(true)
        }}
        aria-label="Fermer la bannière"
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors text-base"
      >
        ×
      </button>
    </div>
  )
}

function CalendarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}
