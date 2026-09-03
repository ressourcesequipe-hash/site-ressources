import { useEffect, useRef } from 'react'
import {
  LIBELLE_EN_COURS,
  LOTS_PAR_CATEGORIE,
  LOTS_PODIUM,
  LOT_PRINCIPAL,
  NB_LOTS_CONFIRMES,
  formatEuros,
  formatValeurLot,
} from '../data/lotsTombola'

// Liste complete des lots, ouverte depuis le podium.
// Reprend la structure de TombolaModal (overlay, fermeture Echap, scroll bloque)
// pour que les deux fenetres de la page se comportent pareil.
export default function TousLesLotsModal({ isOpen, onClose }) {
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

  // Le gros lot est le n° 1, le podium suit, puis les lots secondaires.
  const numeroDepartSecondaires = LOTS_PODIUM.length + 2

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Liste complète des lots de la tombola"
    >
      <div className="absolute inset-0 bg-terre/70 backdrop-blur-sm" aria-hidden />

      <div className="relative w-full max-w-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]">

        <div className="flex items-center justify-between px-6 py-4 border-b border-beige">
          <div>
            <p className="font-sans text-xs font-semibold tracking-[0.18em] uppercase text-ocre mb-0.5">
              Tombola solidaire · 03 octobre 2026
            </p>
            <h2 className="font-serif text-xl text-terre leading-tight">
              Les {NB_LOTS_CONFIRMES + 1} lots à gagner
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-8 h-8 flex items-center justify-center text-terre/40 hover:text-ocre transition-colors shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="h-0.5 bg-ocre" />

        <div className="flex-1 overflow-auto px-6 py-6">

          {/* Gros lot */}
          <div className="bg-kaki text-white p-5 mb-6">
            <p className="font-sans text-[10px] font-bold tracking-[0.22em] uppercase text-ocre mb-2">
              Lot n° {LOT_PRINCIPAL.numero} · {LOT_PRINCIPAL.titre}
            </p>
            <h3 className="font-serif text-lg leading-snug mb-1.5">
              {LOT_PRINCIPAL.statut === 'en-cours' ? LIBELLE_EN_COURS : LOT_PRINCIPAL.lot}
            </h3>
            {LOT_PRINCIPAL.statut !== 'en-cours' && (
              <div className="flex flex-wrap items-baseline gap-x-3">
                {LOT_PRINCIPAL.valeur && (
                  <span className="font-serif text-xl text-ocre leading-none">
                    {formatEuros(LOT_PRINCIPAL.valeur)}
                  </span>
                )}
                <span className="text-xs text-white/45">{LOT_PRINCIPAL.detail}</span>
              </div>
            )}
          </div>

          {/* Podium */}
          <div className="mb-7">
            <h3 className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-ocre mb-3">
              Les grands lots
            </h3>
            <ul className="divide-y divide-beige">
              {LOTS_PODIUM.map(({ lot, partenaire, valeur, valeurMax, detail, statut }, i) => (
                <LigneLot
                  key={`podium-${lot}-${partenaire}-${i}`}
                  numero={i + 2}
                  lot={lot}
                  partenaire={partenaire}
                  valeur={valeur}
                  valeurMax={valeurMax}
                  detail={detail}
                  statut={statut}
                />
              ))}
            </ul>
          </div>

          {/* Lots secondaires, groupes par categorie */}
          {LOTS_PAR_CATEGORIE.map(({ id, label, lots }, indexCategorie) => {
            // Numerotation continue d'une categorie a l'autre.
            const decalage = LOTS_PAR_CATEGORIE
              .slice(0, indexCategorie)
              .reduce((total, c) => total + c.lots.length, 0)

            return (
              <div key={id} className="mb-7 last:mb-0">
                <h3 className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-ocre mb-3">
                  {label}
                </h3>
                <ul className="divide-y divide-beige">
                  {lots.map(({ lot, partenaire, valeur, valeurMax, detail, statut }, i) => (
                    <LigneLot
                      key={`${id}-${lot}-${partenaire}-${i}`}
                      numero={numeroDepartSecondaires + decalage + i}
                      lot={lot}
                      partenaire={partenaire}
                      valeur={valeur}
                      valeurMax={valeurMax}
                      detail={detail}
                      statut={statut}
                    />
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="px-6 py-3 border-t border-beige bg-beige-light">
          <p className="text-xs text-terre/45 leading-snug">
            Dotation complète : voici l'intégralité des lots mis en jeu.
            Tirage au sort en public à Vielle-Saint-Girons.
          </p>
        </div>
      </div>
    </div>
  )
}

function LigneLot({ numero, lot, partenaire, valeur, valeurMax, detail, statut }) {
  const enCours = statut === 'en-cours'

  return (
    <li className="flex items-baseline gap-3 py-2.5">
      <span className="font-sans text-[10px] text-terre/35 tabular-nums shrink-0 w-7">
        n° {numero}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`font-sans text-sm leading-snug ${enCours ? 'text-terre/50 italic' : 'text-terre'}`}>
          {enCours ? LIBELLE_EN_COURS : lot}
        </p>
        {!enCours && (
          <p className="text-xs text-terre/45 mt-0.5">
            {partenaire || 'Partenaire à confirmer'}
            {detail ? ` · ${detail}` : ''}
          </p>
        )}
      </div>
      {!enCours && valeur != null && (
        <span className="font-serif text-sm text-ocre shrink-0 tabular-nums whitespace-nowrap">
          {formatValeurLot({ valeur, valeurMax })}
        </span>
      )}
    </li>
  )
}
