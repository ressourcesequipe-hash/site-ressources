import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'

const BREADCRUMBS = [
  { label: 'L\'Association', href: '/association/' },
  { label: 'Partenaires' },
]

const PARTENAIRES = [
  {
    nom: 'Mairie de Vielle-Saint-Girons',
    label: 'PARTENAIRE LOCAL CONFIRMÉ',
    labelColor: 'ocre',
    logo: '/logos/logo-mairie-vsg.png',
    desc: 'La commune de Vielle-Saint-Girons s\'est positionnée comme partenaire du lancement de Ressources sur son territoire.',
    lien: null,
  },
  {
    nom: 'SITCOM40',
    label: 'PARTENARIAT EN COURS DE FORMALISATION',
    labelColor: 'kaki',
    logo: '/logos/logo-sitcom40.svg',
    desc: 'Des échanges sont engagés avec le SITCOM40 pour structurer une coopération autour de la collecte et du réemploi.',
    lien: null,
  },
  {
    nom: 'Réseau ReNAITRe',
    label: 'RÉSEAU PROFESSIONNEL REJOINT',
    labelColor: 'ocre',
    logo: '/logos/logo-renaitre.png',
    desc: 'Ressources rejoint le réseau ReNAITRe, réseau régional du réemploi solidaire en Nouvelle-Aquitaine.',
    lien: 'https://www.reseau-renaitre.com/page/1502390-accueil',
  },
  {
    nom: 'CC Côte Landes Nature',
    label: 'ÉCHANGE EN COURS',
    labelColor: 'kaki',
    logo: '/logos/logo-cln.png',
    desc: 'Ressources souhaite développer des coopérations territoriales autour du réemploi, de l\'inclusion numérique et de la recyclerie végétale.',
    lien: null,
  },
  {
    nom: 'Territoire MACS',
    label: 'PRÉSENTATION DU PROJET EN COURS',
    labelColor: 'kaki',
    logo: '/logos/logo-macs.png',
    desc: 'Ressources engage une démarche de présentation du projet sur le territoire MACS afin d\'identifier de futures pistes de coopération locale.',
    lien: null,
  },
]

export default function Partenaires() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Partenaires — Ressources, réseau territorial dans les Landes"
        description="Ressources structure progressivement un réseau de partenaires publics, associatifs et professionnels autour du réemploi informatique, de la recyclerie végétale et de l'inclusion numérique dans les Landes."
        canonical="/association/partenaires/"
      />

      {/* Hero */}
      <section className="bg-beige-light py-12 md:py-16 border-b border-beige-dark relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 pointer-events-none"
          style={{ background: 'radial-gradient(circle at top right, rgba(200,151,58,0.06), transparent 70%)' }} aria-hidden />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <p className="section-label">Réseau territorial</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">
            Un réseau territorial en construction
          </h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Ressources structure progressivement un réseau de partenaires publics,
            associatifs et professionnels autour du réemploi informatique, de la
            recyclerie végétale, de l'inclusion numérique et de la solidarité locale
            dans les Landes.
          </p>
        </div>
      </section>

      {/* Partenaires */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          <h2 className="font-serif text-2xl text-terre mb-8">
            Soutiens et partenariats en cours
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {PARTENAIRES.map(({ nom, label, labelColor, desc, lien, logo }) => (
              <div
                key={nom}
                className={`group border-t-2 ${labelColor === 'ocre' ? 'border-ocre' : 'border-kaki/40'} border border-beige-dark bg-beige-light p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                {/* Logo partenaire */}
                <div className="w-full h-20 bg-white border border-beige flex items-center justify-center mb-5 p-3 overflow-hidden">
                  <img
                    src={logo}
                    alt={`Logo ${nom}`}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <span className="text-xs text-terre/35 font-sans font-medium tracking-wide hidden w-full h-full items-center justify-center">
                    {nom}
                  </span>
                </div>

                {/* Label statut */}
                <p className={`text-[10px] font-sans font-bold tracking-[0.15em] uppercase mb-2 ${
                  labelColor === 'ocre' ? 'text-ocre' : 'text-kaki/70'
                }`}>
                  {label}
                </p>

                {/* Nom */}
                <h3 className="font-serif text-lg text-terre mb-2 leading-snug">
                  {nom}
                </h3>

                {/* Description */}
                <p className="text-sm text-terre/55 leading-relaxed">
                  {desc}
                </p>

                {/* Lien externe si disponible */}
                {lien && (
                  <a
                    href={lien}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-4 text-xs text-ocre hover:underline font-sans font-medium"
                  >
                    Voir le site
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Légende statuts */}
          <div className="bg-beige-light border border-beige-dark p-5 mb-10 rounded-sm">
            <p className="font-sans text-[10px] font-semibold tracking-[0.15em] uppercase text-terre/40 mb-3">
              Légende des statuts
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                { color: 'bg-ocre', label: 'Partenaire confirmé ou réseau rejoint' },
                { color: 'bg-kaki/40', label: 'Échange ou démarche en cours' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${color} shrink-0`} />
                  <span className="text-xs text-terre/55 font-sans">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-kaki text-white p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40"
              style={{ background: 'radial-gradient(circle at top right, rgba(200,151,58,0.1), transparent 65%)' }} aria-hidden />
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-ocre/50 to-transparent" aria-hidden />
            <div className="relative max-w-xl">
              <p className="font-sans text-ocre text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
                Rejoindre le réseau
              </p>
              <h2 className="font-serif text-2xl text-white mb-3">
                Votre structure souhaite échanger avec Ressources ?
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Collectivités, entreprises, associations, établissements scolaires ou
                acteurs sociaux : Ressources est ouverte aux échanges permettant de
                renforcer l'impact local du projet.
              </p>
              <a href="mailto:ressources.equipe@gmail.com" className="btn-ocre text-sm">
                Proposer un échange
              </a>
            </div>
          </div>

        </div>
      </section>

      <section className="py-6 bg-beige border-t border-beige-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link to="/association/" className="text-sm text-kaki hover:text-ocre transition-colors">
            ← Retour à l'association
          </Link>
        </div>
      </section>
    </Layout>
  )
}
