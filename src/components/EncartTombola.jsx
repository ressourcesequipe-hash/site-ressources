import { Link } from 'react-router-dom'
import CompteARebours from './CompteARebours'
import {
  NB_LOTS_CONFIRMES,
  POINTS_VENTE,
  PRIX_BILLET,
  VALEUR_ARRONDIE,
} from '../data/lotsTombola'

// Encart de promotion de la tombola, dessiné pour une colonne latérale étroite.
//
// Bloc temporaire, à retirer après le tirage du 03 octobre 2026, au même titre
// que celui de la page d'accueil.
//
// Il renvoie vers /soutenir/tombola/ plutôt que d'ouvrir la billetterie : sur
// une page qui parle d'autre chose, le visiteur a besoin de voir les lots et
// les points de vente avant d'acheter.
export default function EncartTombola() {
  // + 1 pour le gros lot, stocké à part de la liste des lots confirmés.
  const nombreLots = NB_LOTS_CONFIRMES + 1

  return (
    // Le beige du menu ne se distingue quasiment pas du blanc de la section
    // (1,1:1) : la bordure n'est pas décorative, c'est elle qui dessine la
    // carte. Même couple fond + bordure que les autres blocs encadrés du site.
    <aside className="relative bg-beige-light border border-beige-dark text-terre p-6 overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-ocre to-transparent"
        aria-hidden
      />
      <div
        className="absolute right-0 top-0 w-40 h-40 pointer-events-none"
        style={{ background: 'radial-gradient(circle at top right, rgba(200,151,58,0.10), transparent 70%)' }}
        aria-hidden
      />

      <div className="relative">
        {/* Le filet et la pastille restent ocre : purement décoratifs, ils
            gardent l'accent de la marque là où le texte ne peut pas —
            l'ocre ne fait que 2,4:1 sur ce beige. */}
        <p className="font-sans text-sm font-bold tracking-[0.2em] uppercase text-kaki-dark mb-4 flex items-center gap-2.5">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ocre opacity-70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-ocre" />
          </span>
          Tombola solidaire
        </p>

        {/* flex-wrap : dans une colonne étroite, « J−100 avant le 03 octobre »
            déborderait sur une seule ligne. */}
        <CompteARebours variant="kaki" className="flex-wrap mb-5" />

        <p className="font-serif text-2xl text-terre leading-snug mb-1.5">
          Plus de {VALEUR_ARRONDIE.toLocaleString('fr-FR')} € de lots
        </p>
        <p className="font-sans text-sm text-terre/70 leading-relaxed mb-5">
          {nombreLots} lots offerts par les commerçants, artisans et producteurs
          du territoire.
        </p>

        <div className="flex items-baseline gap-2 border-y border-beige-dark py-3 mb-5">
          <span className="font-serif text-2xl text-kaki-dark leading-none">{PRIX_BILLET} €</span>
          <span className="font-sans text-xs text-terre/70">le billet</span>
        </div>

        {/* btn-kaki et non btn-ocre : sur ce beige, l'ocre du bouton ne se
            détache pas du fond (2,4:1), le kaki oui (8,6:1). */}
        <Link to="/soutenir/tombola/" className="btn-kaki w-full text-sm">
          Voir la tombola
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>

        <p className="font-sans text-[11px] text-terre/70 leading-relaxed mt-4">
          En ligne à tout moment, ou chez {POINTS_VENTE.length} commerçants du
          territoire. 100 % des fonds pour la recyclerie.
        </p>
      </div>
    </aside>
  )
}
