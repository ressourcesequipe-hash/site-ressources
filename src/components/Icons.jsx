/**
 * Bibliothèque d'icônes SVG — Association Ressources
 * Trait fin, strokeWidth 1.8, style cohérent avec la charte ocre/kaki.
 * Toutes les icônes acceptent className pour la taille et la couleur.
 */

const defaults = { width: 20, height: 20, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function IconReemploi({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
}

export function IconSolidarite({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
}

export function IconProximite({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
}

export function IconChallenge({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>
}

export function IconTombola({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-4 0v2M8 7V5a2 2 0 0 0-4 0v2" />
    <line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" />
  </svg>
}

export function IconEquipe({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
}

export function IconTerritoire({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
  </svg>
}

export function IconPartenaires({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 11l-4 4-2-2" />
  </svg>
}

export function IconActualites({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
    <line x1="10" y1="7" x2="18" y2="7" /><line x1="10" y1="11" x2="18" y2="11" /><line x1="10" y1="15" x2="14" y2="15" />
  </svg>
}

export function IconNousRejoindre({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
  </svg>
}

export function IconCollecte({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
}

export function IconOrdinateur({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
  </svg>
}

export function IconOutil({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
}

export function IconSecurite({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
}

export function IconDocument({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" />
  </svg>
}

export function IconConformite({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
}

export function IconFeuille({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <path d="M17 8C8 10 5.9 16.17 3.82 19.5M9.5 9.5C8 12 8 13 9 15c.5 1 1.5 2 3 2 4 0 7-3 7-7 0-3.5-2-6.5-5-8C12 4 10 5.5 9 8" />
  </svg>
}

export function IconFleur({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zM12 14a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4zM2 12a4 4 0 0 1 4-4 4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4zM14 12a4 4 0 0 1 4-4 4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4z" />
  </svg>
}

export function IconPot({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <path d="M12 2v6M8 6c0 2.2 1.8 4 4 4s4-1.8 4-4" />
    <path d="M5 12h14l-1.5 8H6.5L5 12z" />
    <line x1="3" y1="12" x2="21" y2="12" />
  </svg>
}

export function IconPlante({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <path d="M12 22V12" />
    <path d="M12 12C12 12 6 9 5 3c6 0 8 4 8 9" />
    <path d="M12 16c0 0 5-2 6-8-6 0-7 4-6 8" />
  </svg>
}

export function IconJardinage({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
    <path d="M13 13l6 6" />
  </svg>
}

export function IconMaison({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
}

export function IconEntreprise({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="12" strokeWidth="2" />
  </svg>
}

export function IconDon({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
}

export function IconEcran({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
  </svg>
}

export function IconMobile({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
  </svg>
}

export function IconConsole({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <line x1="6" y1="12" x2="10" y2="12" /><line x1="8" y1="10" x2="8" y2="14" />
    <circle cx="16" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="19" cy="10" r="1" fill="currentColor" stroke="none" />
  </svg>
}

export function IconCable({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <path d="M12 2v6M8 2v4M16 2v4" />
    <rect x="6" y="6" width="12" height="4" rx="1" />
    <path d="M12 10v12" />
    <path d="M9 19h6" />
  </svg>
}

export function IconImprimante({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
}

export function IconFamille({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
}

export function IconEcole({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
}

export function IconStructure({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <rect x="2" y="3" width="20" height="18" rx="2" />
    <line x1="2" y1="9" x2="22" y2="9" />
    <line x1="2" y1="15" x2="22" y2="15" />
    <line x1="9" y1="9" x2="9" y2="21" />
  </svg>
}

export function IconBriefcase({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="17" /><line x1="9.5" y1="14.5" x2="14.5" y2="14.5" />
  </svg>
}

export function IconSenior({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <circle cx="12" cy="7" r="4" />
    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M8 17l-2 4M16 17l2 4" />
  </svg>
}

export function IconMegaphone({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <path d="M3 11l19-9v18L3 11zM11 11v5" />
    <path d="M11 16l-3 5" />
  </svg>
}

export function IconTransport({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <rect x="1" y="3" width="15" height="13" rx="2" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
}

export function IconCalendar({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
}

export function IconGlobe({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
}

export function IconRelais({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l1-1a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
}

export function IconTracabilite({ className = 'w-5 h-5' }) {
  return <svg className={className} viewBox="0 0 24 24" {...defaults} aria-hidden>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
}
