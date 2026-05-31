import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://www.association-ressources.fr' // ← à mettre à jour lors du changement de domaine
const DEFAULT_OG_IMAGE = `${BASE_URL}/logo.png`

export default function SEO({
  title,
  description,
  canonical,
  type = 'website',
  schema = null,
  ogImage = null,
}) {
  const fullTitle = title
    ? `${title} — Ressources, recyclerie solidaire Landes`
    : 'Ressources — Recyclerie solidaire dans les Landes (40)'

  const image = ogImage || DEFAULT_OG_IMAGE

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'NGO'],
    name: 'Association Ressources',
    alternateName: 'Ressources Recyclerie Solidaire',
    description: 'Recyclerie informatique et végétale solidaire à Vielle-Saint-Girons (Landes, 40560). Association loi 1901 fondée en 2025.',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
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
    nonprofitStatus: 'NonprofitType',
    taxID: 'Association reconnue d\'intérêt général',
    knowsAbout: ['réemploi informatique', 'recyclerie végétale', 'inclusion numérique', 'économie circulaire'],
    potentialAction: {
      '@type': 'DonateAction',
      target: `${BASE_URL}/soutenir/don/`,
      name: 'Faire un don à l\'association Ressources',
    },
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
      <meta property="og:site_name" content="Association Ressources — Recyclerie solidaire Landes" />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Association Ressources — Recyclerie solidaire dans les Landes" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Schema.org */}
      <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  )
}
