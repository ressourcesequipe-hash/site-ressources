import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://www.association-ressources.fr'

export default function SEO({
  title,
  description,
  canonical,
  type = 'website',
  schema = null,
}) {
  const fullTitle = title
    ? `${title} — Ressources, recyclerie solidaire Landes`
    : 'Ressources — Recyclerie solidaire dans les Landes (40)'

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name: 'Association Ressources',
    description:
      'Recyclerie informatique et végétale solidaire à Vielle-Saint-Girons (Landes, 40560).',
    url: BASE_URL,
    telephone: '+33660200388',
    email: 'ressources.equipe@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '80 allée des Cigales',
      addressLocality: 'Vielle-Saint-Girons',
      postalCode: '40560',
      addressCountry: 'FR',
    },
    areaServed: { '@type': 'AdministrativeArea', name: 'Landes (40)' },
    foundingDate: '2025',
    sameAs: [],
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={`${BASE_URL}${canonical}`} />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {canonical && <meta property="og:url" content={`${BASE_URL}${canonical}`} />}
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:site_name" content="Association Ressources" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {/* Schema.org */}
      <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  )
}
