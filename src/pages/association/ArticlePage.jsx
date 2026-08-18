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

  // Schema.org : l'article, et la piste audio quand l'article en embarque une.
  const BASE = 'https://www.ressourcesrecyclerie.fr'
  const audio = article.content.find(b => b.type === 'audio')
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    inLanguage: 'fr-FR',
    mainEntityOfPage: `${BASE}/association/actualites/${article.slug}/`,
    author: { '@type': 'Organization', name: 'Association Ressources', url: BASE },
    publisher: { '@id': `${BASE}/#organization` },
    ...(article.image ? { image: `${BASE}${article.image}` } : {}),
    ...(audio ? {
      audio: {
        '@type': 'AudioObject',
        contentUrl: audio.src,
        name: audio.title,
        ...(audio.durationIso ? { duration: audio.durationIso } : {}),
        ...(audio.credit ? { creditText: audio.credit } : {}),
      },
    } : {}),
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <SEO
        title={`${article.title} — Ressources Recyclerie Landes`}
        description={article.excerpt}
        canonical={`/association/actualites/${article.slug}/`}
        type="article"
        schema={articleSchema}
        {...(article.image ? {
          ogImage: `https://www.ressourcesrecyclerie.fr${article.image}`,
          // Annoncer les dimensions reelles : de fausses valeurs font mal
          // cadrer l'apercu chez LinkedIn/Facebook.
          ...(article.imageWidth ? { ogImageWidth: article.imageWidth } : {}),
          ...(article.imageHeight ? { ogImageHeight: article.imageHeight } : {}),
          ...(article.imageAlt ? { ogImageAlt: article.imageAlt } : {}),
        } : {})}
      />

      {/* Hero article — signature charte : kaki fonce, filet ocre 4px, trait ocre 48px */}
      <section className="bg-kaki text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-ocre" aria-hidden />
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-ocre/5 rounded-tl-full pointer-events-none" aria-hidden />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">

          {/* Categorie + meta. Pastille en ocre plein + texte terre : l'ocre en
              texte sur le kaki ne depasse pas 3,6:1, insuffisant a cette taille. */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {cat && (
              <Link
                to={`/association/actualites/?cat=${article.category}`}
                className="text-[10px] font-sans font-semibold tracking-[0.18em] uppercase px-3 py-1 bg-ocre text-terre hover:bg-ocre-light transition-colors"
              >
                {cat.label}
              </Link>
            )}
            <span className="text-xs text-white/65 font-mono">{article.dateLabel}</span>
            <span className="text-white/30">·</span>
            <span className="text-xs text-white/65">⏱ {article.readingTime} de lecture</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.6rem] text-white leading-tight mb-5 text-balance">
            {article.title}
          </h1>

          <div className="w-12 h-0.5 bg-ocre mb-6" aria-hidden />

          <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
            {article.excerpt}
          </p>
        </div>
      </section>

      {/* Corps de l'article */}
      <section className="py-14 md:py-20 bg-white" ref={body.ref}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          {/* Visuel de couverture */}
          {article.image && (
            <figure className="mb-10">
              <div className="rounded-xl overflow-hidden">
                {/* imageFit 'natural' : pour les visuels composes (affiches,
                    vignettes) que le recadrage en bandeau mutilerait. */}
                <img
                  src={article.image}
                  alt={article.imageAlt || article.title}
                  {...(article.imageWidth ? { width: article.imageWidth } : {})}
                  {...(article.imageHeight ? { height: article.imageHeight } : {})}
                  loading="lazy"
                  className={article.imageFit === 'natural'
                    ? 'w-full h-auto block'
                    : 'w-full h-64 md:h-80 object-cover'}
                />
              </div>
              {article.imageCredit && (
                <figcaption className="text-xs text-terre/40 mt-2 italic">
                  {article.imageCredit}
                </figcaption>
              )}
            </figure>
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
              if (block.type === 'audio') {
                return (
                  <figure key={i} className="my-9 border border-beige-dark bg-beige-light">
                    <div className="border-l-2 border-ocre px-5 py-5 sm:px-6">
                      <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-ocre mb-2.5">
                        {block.label || 'Écouter'}
                      </p>
                      {block.title && (
                        <p className="font-serif text-lg text-terre leading-snug mb-1">
                          {block.title}
                        </p>
                      )}
                      {block.duration && (
                        <p className="text-xs text-terre/40 font-mono mb-4">⏱ {block.duration}</p>
                      )}
                      {/* preload="none" : on ne sollicite le serveur source qu'au clic */}
                      <audio
                        controls
                        preload="none"
                        src={block.src}
                        className="w-full"
                        title={block.title || 'Extrait audio'}
                      >
                        Votre navigateur ne permet pas la lecture audio.{' '}
                        <a href={block.src}>Ouvrir le fichier audio</a>.
                      </audio>
                      {(block.credit || block.sourceUrl) && (
                        <figcaption className="text-xs text-terre/45 mt-3.5 leading-relaxed">
                          {block.credit}
                          {block.sourceUrl && (
                            <>
                              {' '}
                              <a
                                href={block.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-kaki underline underline-offset-2 hover:text-ocre transition-colors"
                              >
                                {block.sourceLabel || 'Écouter à la source'}
                              </a>
                            </>
                          )}
                        </figcaption>
                      )}
                    </div>
                  </figure>
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
              <Link to="/soutenir/tombola/" className="text-sm text-kaki hover:text-ocre transition-colors font-medium">
                → Tombola solidaire — 03 octobre 2026
              </Link>
              <Link to="/evenement-lancement-03-octobre-2026/" className="text-sm text-kaki hover:text-ocre transition-colors font-medium">
                → Événement de lancement
              </Link>
              <Link to="/recyclerie-informatique/comment-donner/" className="text-sm text-kaki hover:text-ocre transition-colors font-medium">
                → Comment donner du matériel informatique
              </Link>
              <Link to="/recyclerie-vegetale/comment-donner/" className="text-sm text-kaki hover:text-ocre transition-colors font-medium">
                → Comment donner des plantes
              </Link>
              <Link to="/association/nous-rejoindre/" className="text-sm text-kaki hover:text-ocre transition-colors font-medium">
                → Devenir bénévole
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
