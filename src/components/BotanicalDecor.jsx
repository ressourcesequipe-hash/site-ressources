/**
 * BotanicalDecor — éléments graphiques décoratifs botaniques
 * Inspirés de l'aquarelle fournie : feuilles, branches, ginkgo, eucalyptus, blobs organiques
 * Usage : positionnés en absolute dans les sections héros
 */

/** Branche de feuilles alternes (fougère / laurier) */
export function BrancheFeuilles({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 120 280" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={style} aria-hidden>
      {/* tige centrale */}
      <path d="M60 270 Q58 200 60 10" stroke="#6c7c49" strokeWidth="1.2" strokeLinecap="round" opacity="0.35"/>
      {/* feuilles gauche */}
      <ellipse cx="38" cy="60" rx="18" ry="9" transform="rotate(-35 38 60)" fill="#6c7c49" opacity="0.18"/>
      <ellipse cx="32" cy="100" rx="16" ry="8" transform="rotate(-30 32 100)" fill="#6c7c49" opacity="0.15"/>
      <ellipse cx="36" cy="138" rx="17" ry="8" transform="rotate(-32 36 138)" fill="#6c7c49" opacity="0.18"/>
      <ellipse cx="30" cy="175" rx="15" ry="7" transform="rotate(-28 30 175)" fill="#6c7c49" opacity="0.13"/>
      <ellipse cx="34" cy="210" rx="13" ry="6" transform="rotate(-30 34 210)" fill="#6c7c49" opacity="0.12"/>
      {/* feuilles droite */}
      <ellipse cx="82" cy="80" rx="18" ry="9" transform="rotate(35 82 80)" fill="#6c7c49" opacity="0.18"/>
      <ellipse cx="88" cy="118" rx="16" ry="8" transform="rotate(30 88 118)" fill="#6c7c49" opacity="0.15"/>
      <ellipse cx="84" cy="155" rx="17" ry="8" transform="rotate(32 84 155)" fill="#6c7c49" opacity="0.18"/>
      <ellipse cx="90" cy="192" rx="14" ry="7" transform="rotate(28 90 192)" fill="#6c7c49" opacity="0.13"/>
      <ellipse cx="86" cy="228" rx="12" ry="6" transform="rotate(30 86 228)" fill="#6c7c49" opacity="0.11"/>
    </svg>
  )
}

/** Tige d'eucalyptus — feuilles rondes superposées */
export function EucalyptusStem({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 90 320" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={style} aria-hidden>
      <path d="M45 315 Q42 240 45 20" stroke="#6c7c49" strokeWidth="1.1" strokeLinecap="round" opacity="0.3"/>
      {[40, 90, 140, 190, 240, 285].map((y, i) => (
        <ellipse key={y} cx={i % 2 === 0 ? 30 : 60} cy={y} rx="20" ry="14"
          fill="#6c7c49" opacity={0.13 + (i % 2) * 0.03}
          transform={`rotate(${i % 2 === 0 ? -15 : 15} ${i % 2 === 0 ? 30 : 60} ${y})`}/>
      ))}
    </svg>
  )
}

/** Feuilles de ginkgo biloba — deux feuilles en éventail */
export function GinkgoLeaves({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 140 130" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={style} aria-hidden>
      {/* tige */}
      <path d="M70 125 L68 85" stroke="#6c7c49" strokeWidth="1.2" strokeLinecap="round" opacity="0.35"/>
      <path d="M70 125 L72 85" stroke="#6c7c49" strokeWidth="1" strokeLinecap="round" opacity="0.25"/>
      {/* feuille gauche */}
      <path d="M68 85 Q30 75 15 40 Q35 20 55 50 Q60 65 68 85Z"
        fill="#6c7c49" opacity="0.18"/>
      <path d="M68 85 Q35 70 25 35" stroke="#6c7c49" strokeWidth="0.8" opacity="0.2"/>
      <path d="M68 85 Q42 72 35 42" stroke="#6c7c49" strokeWidth="0.6" opacity="0.15"/>
      <path d="M68 85 Q50 75 48 50" stroke="#6c7c49" strokeWidth="0.6" opacity="0.15"/>
      {/* feuille droite */}
      <path d="M72 85 Q110 75 125 40 Q105 20 85 50 Q80 65 72 85Z"
        fill="#6c7c49" opacity="0.18"/>
      <path d="M72 85 Q105 70 115 35" stroke="#6c7c49" strokeWidth="0.8" opacity="0.2"/>
      <path d="M72 85 Q98 72 105 42" stroke="#6c7c49" strokeWidth="0.6" opacity="0.15"/>
      <path d="M72 85 Q90 75 92 50" stroke="#6c7c49" strokeWidth="0.6" opacity="0.15"/>
    </svg>
  )
}

/** Petites feuilles dispersées / qui s'envolent */
export function FeuillsDispers({ className = '', style = {} }) {
  const leaves = [
    { x: 20, y: 10, r: -20, s: 0.9 }, { x: 55, y: 5, r: 15, s: 0.7 },
    { x: 85, y: 18, r: -35, s: 0.8 }, { x: 35, y: 38, r: 25, s: 1.0 },
    { x: 70, y: 45, r: -10, s: 0.6 }, { x: 15, y: 60, r: 40, s: 0.7 },
    { x: 50, y: 65, r: -30, s: 0.9 }, { x: 90, y: 55, r: 20, s: 0.75 },
  ]
  return (
    <svg viewBox="0 0 110 80" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={style} aria-hidden>
      {leaves.map(({ x, y, r, s }, i) => (
        <ellipse key={i} cx={x} cy={y} rx={7 * s} ry={4 * s}
          transform={`rotate(${r} ${x} ${y})`}
          fill="#6c7c49" opacity={0.12 + (i % 3) * 0.04}/>
      ))}
    </svg>
  )
}

/** Blob organique beige (pour sections non-végétales) */
export function BlobBeige({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={style} aria-hidden>
      <path d="M160 40 C190 60 200 100 185 135 C170 170 130 180 90 175 C50 170 15 150 5 115 C-5 80 15 40 50 20 C85 0 130 20 160 40Z"
        fill="#EDECCE" opacity="0.55"/>
    </svg>
  )
}

/** Blob organique vert pâle (pour sections non-végétales) */
export function BlobVert({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} style={style} aria-hidden>
      <path d="M155 35 C188 58 198 105 178 142 C158 178 112 185 72 174 C32 163 4 132 2 95 C0 58 28 22 68 8 C108 -6 122 12 155 35Z"
        fill="#E5E4D5" opacity="0.6"/>
    </svg>
  )
}
