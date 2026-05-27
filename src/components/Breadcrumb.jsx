import { Link } from 'react-router-dom'

export default function Breadcrumb({ items }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.association-ressources.fr/' },
      ...items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: item.label,
        item: item.href ? `https://www.association-ressources.fr${item.href}` : undefined,
      })),
    ],
  }

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
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
