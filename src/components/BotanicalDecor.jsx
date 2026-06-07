/**
 * BotanicalDecor — éléments graphiques botaniques réels en filigrane
 * Source : images extraites du document charte graphique Ressources Recyclerie
 * botanical_3 = branche feuilles alternes (haute résolution)
 * botanical_4 = tige eucalyptus (haute résolution)
 * botanical_5 = feuilles ginkgo biloba (haute résolution)
 *
 * Usage CSS :
 * - Sur fonds clairs (#EDECCE, #E5E4D5, white) : filter invert + opacity faible
 * - Sur fonds sombres (kaki) : opacity faible seule
 */

const BASE = '/botanicals/'

/** Branche de feuilles alternes — filigrane */
export function BrancheFeuilles({ className = '', style = {} }) {
  return (
    <img
      src={`${BASE}botanical_3.png`}
      alt=""
      aria-hidden
      className={className}
      style={{
        filter: 'invert(1)',
        opacity: 0.07,
        pointerEvents: 'none',
        userSelect: 'none',
        ...style,
      }}
    />
  )
}

/** Tige d'eucalyptus — filigrane */
export function EucalyptusStem({ className = '', style = {} }) {
  return (
    <img
      src={`${BASE}botanical_4.png`}
      alt=""
      aria-hidden
      className={className}
      style={{
        filter: 'invert(1)',
        opacity: 0.07,
        pointerEvents: 'none',
        userSelect: 'none',
        ...style,
      }}
    />
  )
}

/** Feuilles de ginkgo biloba — filigrane */
export function GinkgoLeaves({ className = '', style = {} }) {
  return (
    <img
      src={`${BASE}botanical_5.png`}
      alt=""
      aria-hidden
      className={className}
      style={{
        filter: 'invert(1)',
        opacity: 0.07,
        pointerEvents: 'none',
        userSelect: 'none',
        ...style,
      }}
    />
  )
}

/** Feuilles dispersées = alias branche petite taille */
export function FeuillsDispers({ className = '', style = {} }) {
  return (
    <img
      src={`${BASE}botanical_3.png`}
      alt=""
      aria-hidden
      className={className}
      style={{
        filter: 'invert(1)',
        opacity: 0.06,
        pointerEvents: 'none',
        userSelect: 'none',
        ...style,
      }}
    />
  )
}

/** Blob beige décoratif (inchangé, SVG pur) */
export function BlobBeige({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={{ pointerEvents: 'none', userSelect: 'none', ...style }} aria-hidden>
      <path d="M160 40 C190 60 200 100 185 135 C170 170 130 180 90 175 C50 170 15 150 5 115 C-5 80 15 40 50 20 C85 0 130 20 160 40Z"
        fill="#EDECCE" opacity="0.55"/>
    </svg>
  )
}

/** Blob vert pâle décoratif (inchangé, SVG pur) */
export function BlobVert({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={{ pointerEvents: 'none', userSelect: 'none', ...style }} aria-hidden>
      <path d="M155 35 C188 58 198 105 178 142 C158 178 112 185 72 174 C32 163 4 132 2 95 C0 58 28 22 68 8 C108 -6 122 12 155 35Z"
        fill="#E5E4D5" opacity="0.6"/>
    </svg>
  )
}
