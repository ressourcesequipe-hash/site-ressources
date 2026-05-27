import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const NAV = [
  {
    to: '/recyclerie-informatique/',
    label: 'Recyclerie Informatique',
    children: [
      { to: '/recyclerie-informatique/comment-donner/', label: 'Comment donner ?' },
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
    to: '/association/',
    label: "L'Association",
    children: [
      { to: '/association/gouvernance/', label: 'Gouvernance' },
      { to: '/association/territoire/', label: 'Territoire' },
      { to: '/association/partenaires/', label: 'Partenaires' },
      { to: '/association/actualites/', label: 'Actualités' },
      { to: '/association/nous-rejoindre/', label: 'Nous rejoindre' },
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

function DropdownItem({ item, onClose }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const timeoutRef = useRef(null)

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current)
    setOpen(true)
  }
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120)
  }

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          `flex items-center gap-1 font-sans text-sm transition-colors duration-150 whitespace-nowrap py-1 ${
            isActive ? 'text-ocre font-medium' : 'text-terre/70 hover:text-ocre'
          }`
        }
      >
        {item.label}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </NavLink>

      {/* Dropdown panel */}
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200 ${
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
        }`}
        style={{ minWidth: '220px' }}
      >
        {/* Invisible bridge so mouse doesn't lose hover */}
        <div className="absolute -top-3 left-0 right-0 h-3" />
        <div className="bg-white rounded-xl shadow-xl border border-beige overflow-hidden">
          {/* Top accent */}
          <div className="h-0.5 bg-gradient-to-r from-ocre to-ocre-light" />
          <div className="py-2">
            {item.children.map((child) => (
              <NavLink
                key={child.to}
                to={child.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-4 py-2.5 text-sm font-sans transition-colors duration-100 ${
                    isActive
                      ? 'text-ocre bg-ocre/5 font-medium'
                      : 'text-terre/75 hover:text-ocre hover:bg-ocre/5'
                  }`
                }
              >
                <span className="w-1 h-1 rounded-full bg-ocre/40 shrink-0" />
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
  const { pathname } = useLocation()

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const toggleSection = (label) =>
    setOpenSection((prev) => (prev === label ? null : label))

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-beige-light/96 backdrop-blur-md shadow-[0_1px_12px_rgba(61,74,45,0.08)]'
          : 'bg-beige-light'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-md overflow-hidden bg-kaki flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <img
                src="/logo_ressources1.jpg"
                alt="Logo Ressources"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <span className="font-serif text-ocre text-xl font-bold hidden items-center justify-center w-full h-full">R</span>
            </div>
            <div className="leading-tight">
              <span className="block font-serif text-base md:text-lg text-terre font-semibold tracking-tight">
                Ressources
              </span>
              <span className="block text-[10px] text-terre/45 tracking-[0.18em] uppercase font-sans">
                Recyclerie solidaire
              </span>
            </div>
          </Link>

          {/* Desktop nav avec dropdowns */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7" aria-label="Navigation principale">
            {NAV.map((item) => (
              <DropdownItem key={item.to} item={item} />
            ))}
          </nav>

          {/* CTA desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/recyclerie-informatique/comment-donner/"
              className="btn-ocre text-xs px-4 py-2"
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

      {/* Mobile menu — slide down */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-beige-light border-t border-beige/80 overflow-y-auto max-h-[calc(85vh-64px)]">
          <nav className="max-w-7xl mx-auto px-4 py-3" aria-label="Navigation mobile">
            {NAV.map((item) => (
              <div key={item.to} className="border-b border-beige/70 last:border-0">
                {/* Section parent */}
                <div className="flex items-center justify-between">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex-1 py-3.5 font-sans text-sm font-medium ${
                        isActive ? 'text-ocre' : 'text-terre'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                  <button
                    onClick={() => toggleSection(item.label)}
                    aria-label={`${openSection === item.label ? 'Fermer' : 'Ouvrir'} ${item.label}`}
                    className="p-2 -mr-2 text-terre/50"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openSection === item.label ? 'rotate-180' : ''
                      }`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Sous-pages */}
                <div
                  className={`overflow-hidden transition-all duration-250 ease-in-out ${
                    openSection === item.label ? 'max-h-96 pb-2' : 'max-h-0'
                  }`}
                >
                  {item.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 pl-4 py-2.5 font-sans text-sm ${
                          isActive ? 'text-ocre font-medium' : 'text-terre/65 hover:text-ocre'
                        }`
                      }
                    >
                      <span className="w-1 h-1 rounded-full bg-ocre/50 shrink-0" />
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}

            {/* CTA mobile */}
            <div className="pt-4 pb-3">
              <Link
                to="/recyclerie-informatique/comment-donner/"
                className="btn-ocre text-sm w-full text-center block"
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
