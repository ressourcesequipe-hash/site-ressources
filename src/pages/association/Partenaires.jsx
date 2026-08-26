import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import {
  COOPERATIONS_EN_COURS,
  MENTION_COOPERATIONS,
  PARTENAIRES_CONFIRMES,
} from '../../data/partenaires'


const BREADCRUMBS = [
  { label: 'L\'Association', href: '/association/' },
  { label: 'Partenaires' },
]

// Deux blocs et non plus un regroupement par type : le statut prime sur la
// nature de la structure, pour qu'aucune collectivite en cours d'echange ne
// puisse etre lue comme un partenaire etabli.
const BLOCS = [
  {
    titre: 'Nos partenaires',
    intro: 'Structures avec lesquelles un partenariat est formalisé ou un réseau rejoint.',
    accent: 'ocre',
    partenaires: PARTENAIRES_CONFIRMES,
  },
  {
    titre: 'Échanges et coopérations territoriales en cours',
    intro: MENTION_COOPERATIONS,
    accent: 'kaki',
    partenaires: COOPERATIONS_EN_COURS,
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

          <div className="space-y-14 mb-14">
            {BLOCS.map(({ titre, intro, accent, partenaires }) => (
              <div key={titre}>
                {/* Titre de bloc */}
                <h2 className="font-serif text-2xl text-terre mb-2">{titre}</h2>
                <p className="text-sm text-terre/55 leading-relaxed mb-6 max-w-2xl">
                  {intro}
                </p>

                {/* Cartes */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {partenaires.map(({ nom, label, categorie, desc, lien, logo }) => (
                    <div
                      key={nom}
                      className={`group border-t-2 ${accent === 'ocre' ? 'border-ocre' : 'border-kaki/40'} border border-beige-dark bg-beige-light p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                    >
                      {/* Logo */}
                      <div className="h-16 flex items-center mb-5">
                        {/* Pas de width/height : chaque logo a son propre ratio
                            et le conteneur h-16 fixe deja la hauteur, donc rien
                            ne bouge au chargement. */}
                        <img
                          src={logo}
                          alt={`Logo ${nom}`}
                          loading="lazy"
                          decoding="async"
                          className="max-h-full max-w-[160px] object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'block'
                          }}
                        />
                        <span className="text-xs text-terre/40 font-sans font-medium tracking-wide hidden">{nom}</span>
                      </div>

                      {/* Label statut + categorie de structure */}
                      <p className={`text-[10px] font-sans font-bold tracking-[0.15em] uppercase mb-2 ${
                        accent === 'ocre' ? 'text-ocre' : 'text-kaki/70'
                      }`}>
                        {label}
                      </p>
                      <p className="text-[10px] font-sans tracking-wide uppercase text-terre/35 mb-2">
                        {categorie}
                      </p>

                      {/* Nom */}
                      <h4 className="font-serif text-lg text-terre mb-2 leading-snug">{nom}</h4>

                      {/* Description */}
                      <p className="text-sm text-terre/55 leading-relaxed">{desc}</p>

                      {/* Lien externe */}
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
                { color: 'bg-ocre', label: 'Partenariat formalisé ou réseau rejoint' },
                { color: 'bg-kaki/40', label: 'Échange ou démarche en cours, sans partenariat formalisé' },
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
              <a href="mailto:contact@ressourcesrecyclerie.fr" className="btn-ocre text-sm">
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
