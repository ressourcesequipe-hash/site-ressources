import { Link, NavLink } from 'react-router-dom'

const SILOS = [
  {
    title: 'Recyclerie Informatique',
    links: [
      { to: '/recyclerie-informatique/', label: 'Présentation' },
      { to: '/recyclerie-informatique/comment-donner/', label: 'Comment donner' },
      { to: '/defi-collecte/', label: 'Challenge territorial' },
      { to: '/recyclerie-informatique/materiel-accepte/', label: 'Matériel accepté' },
      { to: '/recyclerie-informatique/reconditionnement/', label: 'Notre processus' },
      { to: '/recyclerie-informatique/effacement-donnees/', label: 'Sécurité des données' },
      { to: '/recyclerie-informatique/beneficiaires/', label: 'Bénéficiaires' },
    ],
  },
  {
    title: 'Recyclerie Végétale',
    links: [
      { to: '/recyclerie-vegetale/', label: 'Présentation' },
      { to: '/recyclerie-vegetale/comment-donner/', label: 'Comment donner' },
      { to: '/recyclerie-vegetale/ce-que-nous-acceptons/', label: 'Ce que nous acceptons' },
      { to: '/recyclerie-vegetale/redistribution/', label: 'Redistribution' },
      { to: '/recyclerie-vegetale/partenaires-vegetaux/', label: 'Partenaires végétaux' },
    ],
  },
  {
    title: "L'Association",
    links: [
      { to: '/association/', label: 'Qui sommes-nous' },
      { to: '/association/gouvernance/', label: 'Gouvernance' },
      { to: '/association/territoire/', label: 'Notre territoire' },
      { to: '/association/partenaires/', label: 'Partenaires' },
      { to: '/association/actualites/', label: 'Actualités' },
      { to: '/association/nous-rejoindre/', label: 'Nous rejoindre' },
      { to: '/association/presse/', label: 'Espace presse' },
    ],
  },
  {
    title: 'Soutenir',
    links: [
      { to: '/soutenir/', label: 'Comment soutenir' },
      { to: '/soutenir/tombola/', label: 'Tombola solidaire' },
      { to: '/soutenir/benevole/', label: 'Devenir bénévole' },
      { to: '/soutenir/mecene/', label: 'Mécénat & partenariat' },
      { to: '/soutenir/don/', label: 'Faire un don' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-kaki-dark font-sans">

      {/* Pre-footer CTA */}
      <div className="border-t border-b border-white/10 bg-kaki">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-sans text-ocre text-xs tracking-[0.18em] uppercase font-semibold mb-2">
                Rejoignez l'initiative
              </p>
              <h2 className="font-serif text-xl md:text-2xl text-white leading-snug">
                Donnez vos équipements et vos plantes<br className="hidden md:block" />
                <span className="text-white/60"> une seconde vie dans les Landes.</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                to="/recyclerie-informatique/comment-donner/"
                className="border border-ocre text-ocre px-6 py-2.5 text-sm font-medium hover:bg-ocre hover:text-white transition-all duration-200 whitespace-nowrap"
              >
                Je donne du matériel
              </Link>
              <Link
                to="/recyclerie-vegetale/comment-donner/"
                className="border border-white/20 text-white/70 px-6 py-2.5 text-sm font-medium hover:border-white/50 hover:text-white transition-all duration-200 whitespace-nowrap"
              >
                Je donne des plantes
              </Link>
              <Link
                to="/soutenir/don/"
                className="bg-ocre text-white px-6 py-2.5 text-sm font-medium hover:bg-ocre-dark transition-all duration-200 whitespace-nowrap"
              >
                Faire un don
              </Link>
              <Link
                to="/contact/"
                className="border border-white/40 text-white px-6 py-2.5 text-sm font-medium hover:border-white hover:bg-white/10 transition-all duration-200 whitespace-nowrap"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-10 md:pt-16 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                {/* Rendu en 40 px et toujours sous la ligne de flottaison : la
                    plus petite variante suffit, et elle peut attendre. */}
                <img src="/logos/logo-ressources-96.webp" alt="Logo Ressources Recyclerie" width="40" height="40" loading="lazy" decoding="async" className="w-full h-full object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <span className="block font-sans text-white text-base font-semibold">Ressources</span>
                <span className="block text-[10px] text-white/35 tracking-[0.15em] uppercase">Recyclerie solidaire</span>
              </div>
            </Link>

            <p className="text-sm text-white/50 leading-relaxed mb-8 max-w-xs">
              Association loi 1901 fondée en 2025 à Vielle-Saint-Girons (Landes).
              Réemploi, inclusion numérique et proximité territoriale.
            </p>

            <div className="space-y-3">
              <p className="text-white/30 text-[10px] tracking-[0.18em] uppercase font-semibold">Contact</p>
              <a href="mailto:contact@ressourcesrecyclerie.fr" className="flex items-center gap-2 text-sm text-white/55 hover:text-ocre transition-colors group">
                <MailIcon />
                contact@ressourcesrecyclerie.fr
              </a>
              <a href="tel:+33662660484" className="flex items-center gap-2 text-sm text-white/55 hover:text-ocre transition-colors">
                <PhoneIcon />
                06 62 66 04 84
              </a>
              <p className="flex items-start gap-2 text-xs text-white/35 leading-relaxed pt-1">
                <PinIcon />
                80 allée des Cigales<br />40560 Vielle-Saint-Girons
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/ressourcesrecyclerie"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Ressources Recyclerie"
                className="w-8 h-8 flex items-center justify-center border border-white/15 text-white/40 hover:border-ocre hover:text-ocre transition-all duration-200"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://www.instagram.com/ressources.recyclerie"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Ressources Recyclerie"
                className="w-8 h-8 flex items-center justify-center border border-white/15 text-white/40 hover:border-ocre hover:text-ocre transition-all duration-200"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://www.linkedin.com/company/ressources-recyclerie"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Ressources Recyclerie"
                className="w-8 h-8 flex items-center justify-center border border-white/15 text-white/40 hover:border-ocre hover:text-ocre transition-all duration-200"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>

          {/* Silo columns */}
          {SILOS.map(({ title, links }) => (
            <div key={title}>
              <h3 className="font-sans text-white/90 text-[10px] font-bold tracking-[0.18em] uppercase mb-5 pb-2 border-b border-white/10">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-[13px] text-white/45 hover:text-ocre transition-colors duration-150 leading-snug"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-white/30">
            © 2025–2026 Association Ressources · Loi 1901 · SIRET en cours d'attribution
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/mentions-legales/" className="text-[11px] text-white/30 hover:text-white/60 transition-colors">Mentions légales</Link>
            <Link to="/confidentialite/" className="text-[11px] text-white/30 hover:text-white/60 transition-colors">Confidentialité</Link>
            <a href="/sitemap.xml" className="text-[11px] text-white/30 hover:text-white/60 transition-colors">Plan du site</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FacebookIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function MailIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-ocre/60 shrink-0 mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-ocre/60 shrink-0 mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-ocre/60 shrink-0 mt-px" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
