import { useState, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import { ARTICLES, CATEGORIES, getFeaturedArticle, getArticlesByCategory } from '../../data/articles'
import { useReveal } from '../../hooks/useReveal'

const BREADCRUMBS = [
  { label: 'L\'Association', href: '/association/' },
  { label: 'Actualités & articles' },
]

export default function Actualites() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('cat') || 'all'

  const featured = getFeaturedArticle()
  const filtered = useMemo(() =>
    getArticlesByCategory(activeCategory).filter(a => !a.featured || activeCategory !== 'all'),
    [activeCategory]
  )
  const grid = activeCategory === 'all'
    ? ARTICLES.filter(a => !a.featured)
    : filtered

  const hero = useReveal()
  const articles = useReveal()

  const setCategory = (id) => {
    if (id === 'all') { setSearchParams({}); return }
    setSearchParams({ cat: id })
  }

  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Actualités Ressources | Recyclerie solidaire dans les Landes"
        description="Suivez les actualités de Ressources, recyclerie informatique et végétale solidaire dans les Landes : réemploi, inclusion numérique, collecte, ateliers, partenariats et économie circulaire."
        canonical="/association/actualites/"
      />

      {/* ── Hero ── */}
      <section className="bg-beige-light py-12 md:py-16 border-b border-beige-dark relative overflow-hidden" ref={hero.ref}>
        <div className="absolute inset-0 opacity-[0.022]"
          style={{ backgroundImage: 'radial-gradient(circle, #3D4A2D 1px, transparent 1px)', backgroundSize: '26px 26px' }} aria-hidden />
        <div className="absolute right-0 top-0 w-64 h-64 pointer-events-none"
          style={{ background: 'radial-gradient(circle at top right, rgba(200,151,58,0.07), transparent 70%)' }} aria-hidden />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <div className={`transition-all duration-700 ${hero.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="section-label">Ressources — Éditorial</p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-terre mb-5 leading-tight">
              Actualités & articles
            </h1>
            <p className="text-terre/55 max-w-2xl leading-relaxed text-[1.05rem]">
              Retrouvez les actualités de l'association Ressources, les avancées du projet,
              les actions de collecte, les ateliers de sensibilisation et nos articles autour
              du réemploi informatique, de l'inclusion numérique, de la recyclerie végétale
              et de l'économie circulaire dans les Landes.
            </p>
          </div>
        </div>
      </section>

      {/* ── Article mis en avant ── */}
      {activeCategory === 'all' && featured && (
        <section className="py-12 md:py-16 bg-white border-b border-beige">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <p className="section-label mb-6">À la une</p>
            <FeaturedCard article={featured} />
          </div>
        </section>
      )}

      {/* ── Filtres catégories ── */}
      <section className="sticky top-[0px] z-30 bg-white/95 backdrop-blur-md border-b border-beige shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
            {CATEGORIES.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setCategory(id)}
                className={`shrink-0 font-sans text-xs font-semibold tracking-wide px-3.5 py-1.5 transition-all duration-200 whitespace-nowrap ${
                  activeCategory === id
                    ? 'bg-ocre text-white shadow-sm shadow-ocre/30'
                    : 'bg-beige-light text-terre/60 hover:text-terre hover:bg-beige border border-beige-dark'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grille articles ── */}
      <section className="py-12 md:py-16 bg-white" ref={articles.ref}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {grid.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-serif text-2xl text-terre/30 mb-3">Aucun article</p>
              <p className="text-sm text-terre/40">Aucun article dans cette catégorie pour le moment.</p>
              <button onClick={() => setCategory('all')} className="btn-outline-ocre text-sm mt-6">
                Voir tous les articles
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {grid.map((article, i) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  index={i}
                  visible={articles.visible}
                />
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="mt-10 pt-8 border-t border-beige flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-terre/35 font-sans">
              {grid.length} article{grid.length > 1 ? 's' : ''}
              {activeCategory !== 'all' ? ` dans "${CATEGORIES.find(c => c.id === activeCategory)?.label}"` : ' au total'}
            </p>
            {activeCategory !== 'all' && (
              <button onClick={() => setCategory('all')} className="text-xs text-ocre hover:underline font-sans font-medium">
                Voir tous les articles →
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA Newsletter ── */}
      <section className="py-12 md:py-16 bg-kaki-pale border-t border-kaki/10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <p className="section-label">Restez informé·e</p>
            <h2 className="font-serif text-2xl md:text-3xl text-terre mb-3">
              Recevez nos actualités
            </h2>
            <p className="text-sm text-terre/55 leading-relaxed">
              Nouveaux articles, actions de collecte, événements sur le territoire landais —
              directement dans votre boîte mail.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>

      {/* ── Maillage interne ── */}
      <section className="py-8 bg-white border-t border-beige-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link to="/association/" className="text-terre/50 hover:text-ocre transition-colors">
              ← L'association
            </Link>
            <span className="text-terre/15">|</span>
            <Link to="/recyclerie-informatique/" className="text-terre/50 hover:text-ocre transition-colors">
              Recyclerie informatique
            </Link>
            <span className="text-terre/15">|</span>
            <Link to="/recyclerie-vegetale/" className="text-terre/50 hover:text-ocre transition-colors">
              Recyclerie végétale
            </Link>
            <span className="text-terre/15">|</span>
            <Link to="/association/partenaires/" className="text-terre/50 hover:text-ocre transition-colors">
              Partenaires
            </Link>
            <span className="text-terre/15">|</span>
            <Link to="/association/nous-rejoindre/" className="text-terre/50 hover:text-ocre transition-colors">
              Nous rejoindre
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}

/* ── Featured card ── */
function FeaturedCard({ article }) {
  const cat = CATEGORIES.find(c => c.id === article.category)
  const reveal = useReveal()
  return (
    <div
      ref={reveal.ref}
      className={`group relative bg-gradient-to-br from-kaki to-kaki-dark text-white rounded-2xl overflow-hidden
        transition-all duration-700 hover:shadow-2xl hover:shadow-kaki/25 hover:-translate-y-1
        ${reveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-ocre to-transparent" />
      <div className="absolute top-0 right-0 w-48 h-48"
        style={{ background: 'radial-gradient(circle at top right, rgba(200,151,58,0.12), transparent 65%)' }} aria-hidden />
      <div className="absolute bottom-0 left-0 w-32 h-32"
        style={{ background: 'radial-gradient(circle at bottom left, rgba(200,151,58,0.06), transparent 65%)' }} aria-hidden />

      <div className="relative p-8 md:p-10">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="inline-flex items-center gap-1.5 bg-ocre/20 border border-ocre/30 px-3 py-1 text-[10px] font-sans font-semibold tracking-[0.15em] uppercase text-ocre">
            ★ À la une
          </span>
          {cat && (
            <span className="text-[10px] font-sans font-medium text-white/50 tracking-wider uppercase">
              {cat.label}
            </span>
          )}
          <span className="text-[10px] text-white/35 font-mono">{article.dateLabel}</span>
          <span className="text-white/20">·</span>
          <span className="text-[10px] text-white/35">⏱ {article.readingTime}</span>
        </div>

        <h2 className="font-serif text-2xl md:text-3xl text-white mb-4 leading-snug max-w-2xl">
          {article.title}
        </h2>
        <p className="text-white/55 leading-relaxed mb-7 max-w-xl text-sm">
          {article.excerpt}
        </p>

        <Link
          to={`/association/actualites/${article.slug}/`}
          className="btn-ocre text-sm inline-flex items-center gap-2"
        >
          Lire l'article
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

/* ── Article card ── */
function ArticleCard({ article, index, visible }) {
  const cat = CATEGORIES.find(c => c.id === article.category)
  const isExternal = !!article.externalLink
  const href = isExternal ? article.externalLink : `/association/actualites/${article.slug}/`

  return (
    <Link
      to={href}
      className="group block bg-beige-light border border-beige hover:border-ocre/30 rounded-xl p-6
        transition-all duration-300 hover:shadow-xl hover:shadow-terre/5 hover:-translate-y-1"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${index * 80}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 80}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
      }}
    >
      {/* Top accent */}
      <div className="h-0.5 w-8 bg-ocre/40 mb-5 transition-all duration-300 group-hover:w-16 group-hover:bg-ocre" />

      {/* Méta */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {cat && (
          <span className="text-[10px] font-sans font-semibold tracking-[0.15em] uppercase px-2.5 py-0.5 bg-ocre/10 text-ocre">
            {cat.label}
          </span>
        )}
        {isExternal && (
          <span className="text-[10px] font-sans font-semibold tracking-[0.15em] uppercase px-2.5 py-0.5 bg-kaki/10 text-kaki">
            Page dédiée
          </span>
        )}
        <span className="text-[10px] text-terre/35 font-mono">{article.dateLabel}</span>
      </div>

      <h2 className="font-serif text-[1.15rem] text-terre mb-2.5 leading-snug group-hover:text-ocre transition-colors duration-200">
        {article.title}
      </h2>

      <p className="text-sm text-terre/50 leading-relaxed mb-5 line-clamp-3">
        {article.excerpt}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-terre/35 font-sans">⏱ {article.readingTime}</span>
        <span className="text-xs text-ocre font-semibold font-sans flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
          Lire
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'newsletter', email }),
      })
      setStatus(r.ok ? 'ok' : 'error')
    } catch { setStatus('error') }
  }

  if (status === 'ok') return (
    <p className="text-sm text-kaki font-medium py-3">Merci ! Votre inscription a bien été transmise.</p>
  )
  return (
    <>
      <form className="flex flex-wrap gap-3" onSubmit={handleSubmit}>
        <input
          type="email" required value={email} onChange={e => setEmail(e.target.value)}
          className="input-field flex-1 min-w-56" placeholder="votre@email.fr"
          disabled={status === 'loading'}
        />
        <button type="submit" className="btn-kaki text-sm shrink-0" disabled={status === 'loading'}>
          {status === 'loading' ? 'Envoi…' : 'S\'abonner'}
        </button>
      </form>
      {status === 'error' && <p className="text-xs text-red-500 mt-2">Une erreur est survenue, veuillez réessayer.</p>}
      <p className="text-[11px] text-terre/35 mt-3 text-center">Pas de spam. Désabonnement possible à tout moment.</p>
    </>
  )
}
