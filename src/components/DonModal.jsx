import { useEffect, useRef } from 'react'

export default function DonModal({ isOpen, onClose }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-terre/70 backdrop-blur-sm" aria-hidden />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col max-h-[90vh]">

        {/* En-tête */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-beige">
          <div>
            <p className="font-sans text-xs font-semibold tracking-[0.18em] uppercase text-ocre mb-0.5">
              Soutien direct
            </p>
            <h2 className="font-serif text-xl text-terre leading-tight">Faire un don</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-8 h-8 flex items-center justify-center text-terre/40 hover:text-ocre transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Barre décorative ocre */}
        <div className="h-0.5 bg-ocre" />

        {/* Widget HelloAsso */}
        <div className="flex-1 overflow-auto">
          <iframe
            id="haWidgetLight"
            allowTransparency="true"
            allow="payment"
            scrolling="auto"
            src="https://www.helloasso.com/associations/ressources-association/formulaires/3/widget?view=form"
            style={{ width: '100%', border: 'none', display: 'block', minHeight: '500px' }}
            onLoad={(e) => {
              window.addEventListener('message', (msg) => {
                const h = msg.data?.height
                if (h && h > 0) e.target.style.height = h + 'px'
              })
            }}
            title="Faire un don — HelloAsso"
          />
        </div>

        {/* Pied de page */}
        <div className="px-6 py-3 border-t border-beige bg-beige-light flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="text-terre/30 shrink-0">
            <path d="M7 1a6 6 0 100 12A6 6 0 007 1zm0 2.5a.75.75 0 110 1.5.75.75 0 010-1.5zM6.25 6h1.5v4h-1.5V6z" fill="currentColor"/>
          </svg>
          <p className="text-xs text-terre/40 leading-snug">
            Paiement sécurisé géré par HelloAsso. L'association reçoit 100 % de votre don.
          </p>
        </div>
      </div>
    </div>
  )
}
