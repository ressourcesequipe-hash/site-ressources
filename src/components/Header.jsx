import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const NAV = [
  {
    to: '/recyclerie-informatique/',
    label: 'Recyclerie Informatique',
    children: [
      { to: '/materiel-disponible/', label: 'Matériel disponible' },
      { to: '/recyclerie-informatique/comment-donner/', label: 'Comment donner ?' },
      { to: '/defi-collecte/', label: 'Challenge territorial' },
      // Entrée distincte vers la liste des points de collecte : « Challenge
      // territorial » ne dit pas où déposer, et c'est cette question-là qui
      // amène les visiteurs dans ce menu.
      { to: '/defi-collecte/#ou-deposer', label: 'Points de collecte' },
      { to: '/recyclerie-informatique/materiel-accepte/', label: 'Matériel accepté' },
      { to: '/recyclerie-informatique/reconditionnement/', label: 'Reconditionnement' },
      { to: '/recyclerie-informatique/effacement-donnees/', label: 'Effacement des données' },
      { to: '/recyclerie-informatique/beneficiaires/', label: 'Bénéficiaires' },
    ],
  },
  {
    to: '/recyclerie-vegetale/',
    label: 'Recyclerie Végétale',
    children: [
      { to: '/recyclerie-vegetale/comment-donner/', label: 'Comment donner ?' },
      { to: '/recyclerie-vegetale/ce-que-nous-acceptons/', label: 'Ce que nous acceptons' },
      { to: '/recyclerie-vegetale/redistribution/', label: 'Redistribution' },
      { to: '/recyclerie-vegetale/partenaires-vegetaux/', label: 'Partenaires végétaux' },
    ],
  },
  {
    to: '/ateliers/',
    label: 'Ateliers',
    children: [
      { to: '/ateliers/numerique/', label: 'Ateliers numériques' },
      { to: '/ateliers/vegetal/', label: 'Ateliers végétaux' },
      { to: '/ateliers/collectivites/', label: 'Pour les collectivités' },
      { to: '/ateliers/entreprises/', label: 'Pour les entreprises (RSE)' },
      { to: '/ateliers/ecoles/', label: 'Pour les écoles' },
    ],
  },
  {
    to: '/association/',
    label: "L'Association",
    children: [
      { to: '/association/gouvernance/', label: 'Gouvernance' },
      { to: '/association/territoire/', label: 'Territoire' },
      { to: '/association/partenaires/', label: 'Partenaires' },
      { to: '/association/actualites/', label: 'Actualités' },
      { to: '/association/nous-rejoindre/', label: 'Nous rejoindre' },
      { to: '/association/presse/', label: 'Espace presse' },
    ],
  },
  {
    to: '/soutenir/',
    label: 'Soutenir',
    children: [
      { to: '/soutenir/tombola/', label: 'Tombola' },
      { to: '/soutenir/benevole/', label: 'Devenir bénévole' },
      { to: '/soutenir/mecene/', label: 'Mécénat' },
      { to: '/soutenir/don/', label: 'Faire un don' },
    ],
  },
]

function DropdownItem({ item }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const timeoutRef = useRef(null)

  const handleMouseEnter = () => { clearTimeout(timeoutRef.current); setOpen(true) }
  const handleMouseLeave = () => { timeoutRef.current = setTimeout(() => setOpen(false), 120) }

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const hasChildren = Array.isArray(item.children) && item.children.length > 0

  if (!hasChildren) {
    return (
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          `relative flex items-center font-sans text-sm transition-colors duration-200 whitespace-nowrap py-1 ${
            isActive ? 'text-ocre font-medium' : 'text-terre/65 hover:text-terre'
          }`
        }
      >
        {item.label}
      </NavLink>
    )
  }

  return (
    <div ref={ref} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          `relative flex items-center gap-1 font-sans text-sm transition-colors duration-200 whitespace-nowrap py-1 group ${
            isActive ? 'text-ocre font-medium' : 'text-terre/65 hover:text-terre'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {item.label}
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180 text-ocre' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {/* Animated underline */}
            <span
              className={`absolute bottom-0 left-0 h-px bg-ocre transition-all duration-300 ${
                isActive || open ? 'w-full' : 'w-0 group-hover:w-full'
              }`}
            />
          </>
        )}
      </NavLink>

      {/* Dropdown panel */}
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200 ${
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        style={{ minWidth: '224px' }}
      >
        <div className="absolute -top-3 left-0 right-0 h-3" />
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-terre/10 border border-beige/80 overflow-hidden">
          <div className="h-0.5 bg-gradient-to-r from-ocre via-ocre-light to-ocre/30" />
          <div className="py-2">
            {item.children.map((child, i) => (
              <NavLink
                key={child.to}
                to={child.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 text-sm font-sans transition-all duration-150 group/item ${
                    isActive ? 'text-ocre bg-ocre/5 font-medium' : 'text-terre/70 hover:text-ocre hover:bg-ocre/4'
                  }`
                }
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-ocre/30 group-hover/item:bg-ocre transition-colors duration-150 shrink-0" />
                {child.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openSection, setOpenSection] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const { pathname } = useLocation()

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      const docH = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docH > 0 ? (y / docH) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const toggleSection = (label) => setOpenSection((prev) => (prev === label ? null : label))

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-beige-light/90 backdrop-blur-xl shadow-[0_2px_20px_rgba(61,74,45,0.08)] border-b border-kaki/5'
          : 'bg-beige-light'
      }`}
    >
      {/* Scroll progress bar */}
      <div
        className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-ocre to-ocre-light transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-24 md:h-28">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center transition-all duration-300 group-hover:scale-105 mx-2 my-1">
              {/* Candidat LCP sur mobile : charge en priorite, jamais differe.
                  Les variantes sont produites par scripts/optimiser-logos.mjs ;
                  sizes reprend les 80 / 96 px du conteneur ci-dessus. */}
              <img
                src="/logos/logo-ressources-192.webp"
                srcSet="/logos/logo-ressources-96.webp 96w,
                        /logos/logo-ressources-192.webp 192w,
                        /logos/logo-ressources-288.webp 288w"
                sizes="(min-width: 768px) 96px, 80px"
                width="96"
                height="96"
                fetchpriority="high"
                decoding="async"
                alt="Logo Ressources Recyclerie"
                className="w-full h-full object-contain drop-shadow-sm"
              />
            </div>
            <div className="leading-tight">
              <span className="block font-sans text-base md:text-lg text-terre font-semibold tracking-tight transition-colors group-hover:text-ocre duration-200">
                Ressources
              </span>
              <span className="block text-[10px] text-terre/45 tracking-[0.18em] uppercase font-sans">
                Recyclerie solidaire
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7" aria-label="Navigation principale">
            {NAV.map((item) => (
              <DropdownItem key={item.to} item={item} />
            ))}
          </nav>

          {/* CTA desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/recyclerie-informatique/comment-donner/"
              className="btn-ocre text-xs px-4 py-2 rounded-lg"
            >
              Je donne mon matériel
            </Link>
          </div>

          {/* Hamburger mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="lg:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-[5px] -mr-1"
          >
            <span
              className={`block w-5 h-0.5 bg-terre rounded-full transition-all duration-300 origin-center ${
                menuOpen ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-terre rounded-full transition-all duration-200 ${
                menuOpen ? 'opacity-0 scale-x-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-terre rounded-full transition-all duration-300 origin-center ${
                menuOpen ? '-translate-y-[7px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-400 ease-in-out ${
          menuOpen ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-beige-light/95 backdrop-blur-xl border-t border-beige/80 overflow-y-auto max-h-[calc(85vh-64px)]">
          <nav className="max-w-7xl mx-auto px-4 py-3" aria-label="Navigation mobile">
            {NAV.map((item) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0
              return (
              <div key={item.to} className="border-b border-beige/70 last:border-0">
                <div className="flex items-center justify-between">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex-1 py-3.5 font-sans text-sm font-medium transition-colors ${
                        isActive ? 'text-ocre' : 'text-terre'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                  {hasChildren && (
                  <button
                    onClick={() => toggleSection(item.label)}
                    aria-label={`${openSection === item.label ? 'Fermer' : 'Ouvrir'} ${item.label}`}
                    className="p-2 -mr-2 text-terre/50"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openSection === item.label ? 'rotate-180 text-ocre' : ''
                      }`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  )}
                </div>

                {hasChildren && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openSection === item.label ? 'max-h-96 pb-2' : 'max-h-0'
                  }`}
                >
                  {item.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 pl-4 py-2.5 font-sans text-sm transition-colors ${
                          isActive ? 'text-ocre font-medium' : 'text-terre/65 hover:text-ocre'
                        }`
                      }
                    >
                      <span className="w-1 h-1 rounded-full bg-ocre/50 shrink-0" />
                      {child.label}
                    </NavLink>
                  ))}
                </div>
                )}
              </div>
              )
            })}

            <div className="pt-4 pb-3">
              <Link
                to="/recyclerie-informatique/comment-donner/"
                className="btn-ocre text-sm w-full text-center block rounded-lg"
              >
                Je donne mon matériel
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
