import { Link } from 'react-router-dom'

const SILOS = [
  {
    title: 'Recyclerie Informatique',
    links: [
      { to: '/recyclerie-informatique/', label: 'Présentation' },
      { to: '/recyclerie-informatique/comment-donner/', label: 'Comment donner' },
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
    <footer className="bg-kaki font-sans">

      {/* Pre-footer CTA */}
      <div className="border-t border-b border-white/10 bg-kaki-dark">
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
                <img src="/logo.png" alt="Logo Ressources Recyclerie" className="w-full h-full object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <span className="block font-serif text-white text-base font-semibold">Ressources</span>
                <span className="block text-[10px] text-white/35 tracking-[0.15em] uppercase">Recyclerie solidaire</span>
              </div>
            </Link>

            <p className="text-sm text-white/50 leading-relaxed mb-8 max-w-xs">
              Association loi 1901 fondée en 2025 à Vielle-Saint-Girons (Landes).
              Réemploi, inclusion numérique et proximité territoriale.
            </p>

            <div className="space-y-3">
              <p className="text-white/30 text-[10px] tracking-[0.18em] uppercase font-semibold">Contact</p>
              <a href="mailto:ressources.equipe@gmail.com" className="flex items-center gap-2 text-sm text-white/55 hover:text-ocre transition-colors group">
                <MailIcon />
                ressources.equipe@gmail.com
              </a>
              <a href="tel:+33660200388" className="flex items-center gap-2 text-sm text-white/55 hover:text-ocre transition-colors">
                <PhoneIcon />
                06.60.20.03.88
              </a>
              <p className="flex items-start gap-2 text-xs text-white/35 leading-relaxed pt-1">
                <PinIcon />
                80 allée des Cigales<br />40560 Vielle-Saint-Girons
              </p>
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
            {[
              { href: '#', label: 'Mentions légales' },
              { href: '#', label: 'Confidentialité' },
              { href: '/sitemap.xml', label: 'Plan du site' },
            ].map(({ href, label }) => (
              <a
                key={label}
                href={href}
                className="text-[11px] text-white/30 hover:text-white/60 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
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
