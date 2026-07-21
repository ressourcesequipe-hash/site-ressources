import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function EventBanner() {
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('event-banner-dismissed') === '1'
  )
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!dismissed) {
      const t = setTimeout(() => setVisible(true), 200)
      return () => clearTimeout(t)
    }
  }, [dismissed])

  if (dismissed) return null

  return (
    <div
      className={`relative overflow-hidden z-50 transition-all duration-500 ${visible ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}
      style={{ background: 'linear-gradient(135deg, #2B3520 0%, #3D4A2D 50%, #4a5935 100%)' }}
    >
      {/* Ligne accent top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ocre/70 to-transparent" />

      {/* Shimmer animé */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(200,151,58,0.07) 50%, transparent 60%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 4s linear infinite',
        }}
        aria-hidden
      />

      {/* Points décoratifs */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-ocre/40 hidden lg:block" aria-hidden />
      <div className="absolute right-16 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-ocre/30 hidden lg:block" aria-hidden />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-center gap-4 sm:gap-6">

          {/* Badge date */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-ocre/20 border border-ocre/35 px-3 py-1.5 rounded-sm">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ocre opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-ocre" />
              </span>
              <span className="font-sans text-[10px] font-bold text-ocre tracking-[0.18em] uppercase whitespace-nowrap">
                Sam. 03 Oct 2026
              </span>
            </div>
          </div>

          {/* Séparateur vertical */}
          <div className="hidden sm:block w-px h-4 bg-white/15 shrink-0" aria-hidden />

          {/* Texte */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-serif text-white text-sm sm:text-base font-normal whitespace-nowrap">
              Événement de lancement
            </span>
            <span className="hidden md:flex items-center gap-2 text-white/45 text-xs font-sans">
              <span className="w-px h-3 bg-white/20" />
              <Link to="/defi-collecte/" className="hover:text-white transition-colors">
                Challenge 1/2 tonne
              </Link>
              <span className="w-px h-3 bg-white/20" />
              <span className="text-ocre/80">+ de 30 lots</span>
              <span className="w-px h-3 bg-white/20" />
              Vielle-Saint-Girons
            </span>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/evenement-lancement-03-octobre-2026/"
              className="group relative inline-flex items-center gap-1.5 border border-white/20 text-white/65 px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase font-sans overflow-hidden transition-all duration-300 hover:border-white/50 hover:text-white whitespace-nowrap rounded-sm"
            >
              Découvrir
            </Link>
            <Link
              to="/soutenir/tombola/"
              className="group relative inline-flex items-center gap-1.5 bg-ocre text-white px-4 py-1.5 text-[11px] font-semibold tracking-wider uppercase font-sans overflow-hidden transition-all duration-300 hover:bg-ocre-dark hover:shadow-sm hover:shadow-ocre/30 whitespace-nowrap rounded-sm"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2"/><path d="M8 7V5a2 2 0 0 0-4 0v2"/>
              </svg>
              Billets tombola
            </Link>
          </div>
        </div>
      </div>

      {/* Ligne accent bas */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      {/* Bouton fermer */}
      <button
        onClick={() => {
          sessionStorage.setItem('event-banner-dismissed', '1')
          setDismissed(true)
        }}
        aria-label="Fermer la bannière"
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-white/25 hover:text-white/70 transition-colors duration-200 rounded-full hover:bg-white/10"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}
