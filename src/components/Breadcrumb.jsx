import { Link } from 'react-router-dom'

const BASE_URL = 'https://www.ressourcesrecyclerie.fr'

export default function Breadcrumb({ items }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${BASE_URL}/` },
      ...items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: item.label,
        ...(item.href ? { item: `${BASE_URL}${item.href}` } : {}),
      })),
    ],
  }

  return (
    <>
      {/* dangerouslySetInnerHTML : indispensable pour que le JSON ne soit pas
          HTML-échappé au prérendu SSG (sinon les guillemets deviennent &quot;
          et Google ne peut plus parser le bloc). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Fil d'Ariane" className="bg-beige border-b border-beige-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-terre/50 font-sans">
            <li>
              <Link to="/" className="hover:text-ocre transition-colors">Accueil</Link>
            </li>
            {items.map((item, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <span aria-hidden>/</span>
                {item.href && i < items.length - 1 ? (
                  <Link to={item.href} className="hover:text-ocre transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-terre/80 font-medium">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  )
}
