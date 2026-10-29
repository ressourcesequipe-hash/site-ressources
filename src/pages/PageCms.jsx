import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import BlocsPage from '../components/BlocsPage'
import { getPage } from '../data/pages'

// Page institutionnelle rédigée dans le back-office (§8). Même gabarit que
// les mentions légales écrites à la main : en-tête beige, texte sur fond blanc.
export function PageCmsVue({ page }) {
  const titre = page.titre
  return (
    <Layout>
      <SEO
        title={page.seo?.titre || `${titre} | Association Ressources`}
        description={page.seo?.description || page.extrait || ''}
        canonical={`/${page.slug}/`}
        {...(page.image ? { ogImage: `https://www.ressourcesrecyclerie.fr${page.image}` } : {})}
      />

      <section className="bg-beige py-12 md:py-16 border-b border-beige-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-serif text-3xl sm:text-4xl text-terre">{titre}</h1>
          {page.extrait && <p className="text-terre/60 mt-4 leading-relaxed">{page.extrait}</p>}
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-[15px]">
          {page.image && (
            <figure className="mb-10">
              <img src={page.image} alt={page.imageAlt || ''} className="w-full h-auto rounded-xl" />
              {page.imageCredit && <figcaption className="text-xs text-terre/40 mt-2 italic">{page.imageCredit}</figcaption>}
            </figure>
          )}
          <BlocsPage blocs={page.contenu} />
        </div>
      </section>
    </Layout>
  )
}

export default function PageCms() {
  const { slug } = useParams()
  const page = getPage(slug)

  if (!page) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
          <p className="font-serif text-6xl text-ocre/30 mb-4">404</p>
          <h1 className="font-serif text-2xl text-terre mb-3">Page introuvable</h1>
          <p className="text-terre/50 mb-6 text-sm">Cette page n'existe pas ou a été déplacée.</p>
          <Link to="/" className="btn-ocre text-sm">← Retour à l'accueil</Link>
        </div>
      </Layout>
    )
  }

  return <PageCmsVue page={page} />
}
