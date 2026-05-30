import { useParams, Link, Navigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import { getArticleBySlug, CATEGORIES } from '../../data/articles'
import { useReveal } from '../../hooks/useReveal'

export default function ArticlePage() {
  const { slug } = useParams()
  const article = getArticleBySlug(slug)

  // Redirect si article externe (ex: page événement)
  if (article?.externalLink) {
    return <Navigate to={article.externalLink} replace />
  }

  // 404 si slug inconnu
  if (!article) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
          <p className="font-serif text-6xl text-ocre/30 mb-4">404</p>
          <h1 className="font-serif text-2xl text-terre mb-3">Article introuvable</h1>
          <p className="text-terre/50 mb-6 text-sm">Cet article n'existe pas ou a été déplacé.</p>
          <Link to="/association/actualites/" className="btn-ocre text-sm">
            ← Retour aux actualités
          </Link>
        </div>
      </Layout>
    )
  }

  const cat = CATEGORIES.find(c => c.id === article.category)
  const breadcrumbs = [
    { label: 'L\'Association', href: '/association/' },
    { label: 'Actualités', href: '/association/actualites/' },
    { label: article.title },
  ]

  const body = useReveal()

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <SEO
        title={`${article.title} — Ressources Recyclerie Landes`}
        description={article.excerpt}
        canonical={`/association/actualites/${article.slug}/`}
      />

      {/* Hero article */}
      <section className="bg-beige-light py-12 md:py-16 border-b border-beige-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: 'radial-gradient(circle, #3D4A2D 1px, transparent 1px)', backgroundSize: '24px 24px' }} aria-hidden />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">

          {/* Catégorie + méta */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {cat && (
              <Link
                to={`/association/actualites/?cat=${article.category}`}
                className="text-[10px] font-sans font-semibold tracking-[0.18em] uppercase px-3 py-1 bg-ocre/10 text-ocre border border-ocre/20 hover:bg-ocre/20 transition-colors"
              >
                {cat.label}
              </Link>
            )}
            <span className="text-xs text-terre/40 font-mono">{article.dateLabel}</span>
            <span className="text-terre/20">·</span>
            <span className="text-xs text-terre/40">⏱ {article.readingTime} de lecture</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.6rem] text-terre leading-tight mb-5 text-balance">
            {article.title}
          </h1>

          <p className="text-terre/60 text-lg leading-relaxed max-w-2xl">
            {article.excerpt}
          </p>
        </div>
      </section>

      {/* Corps de l'article */}
      <section className="py-14 md:py-20 bg-white" ref={body.ref}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          {/* Image placeholder */}
          {article.image && (
            <div className="mb-10 rounded-xl overflow-hidden">
              <img src={article.image} alt={article.title} className="w-full h-64 object-cover" />
            </div>
          )}

          {/* Contenu */}
          <div className={`prose-article transition-all duration-700 ${body.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {article.content.map((block, i) => {
              if (block.type === 'heading') {
                return (
                  <h2 key={i} className="font-serif text-2xl text-terre mt-10 mb-4 leading-snug">
                    {block.text}
                  </h2>
                )
              }
              if (block.type === 'paragraph') {
                return (
                  <p key={i} className="text-terre/65 leading-relaxed text-[1.05rem] mb-5">
                    {block.text}
                  </p>
                )
              }
              return null
            })}
          </div>

          {/* Séparateur */}
          <div className="flex items-center gap-4 my-12">
            <div className="flex-1 h-px bg-beige-dark" />
            <div className="w-1.5 h-1.5 rounded-full bg-ocre/50" />
            <div className="flex-1 h-px bg-beige-dark" />
          </div>

          {/* Maillage interne */}
          <div className="bg-kaki-pale border border-kaki/10 rounded-xl p-6 mb-10">
            <p className="font-sans text-xs font-semibold tracking-[0.18em] uppercase text-kaki mb-4">
              En lien avec cet article
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/recyclerie-informatique/comment-donner/" className="text-sm text-kaki hover:text-ocre transition-colors font-medium">
                → Comment donner du matériel informatique
              </Link>
              <Link to="/recyclerie-vegetale/comment-donner/" className="text-sm text-kaki hover:text-ocre transition-colors font-medium">
                → Comment donner des plantes
              </Link>
              <Link to="/association/nous-rejoindre/" className="text-sm text-kaki hover:text-ocre transition-colors font-medium">
                → Devenir bénévole
              </Link>
              <Link to="/association/partenaires/" className="text-sm text-kaki hover:text-ocre transition-colors font-medium">
                → Nos partenaires
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-4">
            <Link to="/association/actualites/" className="btn-outline-ocre text-sm">
              ← Retour aux actualités
            </Link>
            <Link to="/recyclerie-informatique/comment-donner/" className="btn-ocre text-sm">
              Je donne du matériel
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
