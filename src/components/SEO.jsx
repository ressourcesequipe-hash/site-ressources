import { Helmet } from 'react-helmet-async'
import { useEffect } from 'react'

const BASE_URL = 'https://www.ressourcesrecyclerie.fr'
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`

export default function SEO({
  title,
  description,
  canonical,
  type = 'website',
  schema = null,
  ogImage = null,
}) {
  const fullTitle = title || 'Ressources | Recyclerie solidaire dans les Landes (40)'

  // Fallback direct — garantit la mise à jour de l'onglet même si Helmet est lent
  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  const image = ogImage || DEFAULT_OG_IMAGE

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'NGO'],
    '@id': `${BASE_URL}/#organization`,
    name: 'Association Ressources',
    alternateName: 'Ressources Recyclerie Solidaire',
    description: 'Recyclerie informatique et végétale solidaire à Vielle-Saint-Girons (Landes, 40560). Association loi 1901 fondée en 2026.',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/logos/20260605_210203_5980.png`,
    },
    image: `${BASE_URL}/og-image.png`,
    email: 'contact@ressourcesrecyclerie.fr',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '80 allée des Cigales',
      addressLocality: 'Vielle-Saint-Girons',
      postalCode: '40560',
      addressRegion: 'Nouvelle-Aquitaine',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.9497,
      longitude: -1.3158,
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Landes' },
      { '@type': 'AdministrativeArea', name: 'Communauté de Communes Côte Landes Nature' },
      { '@type': 'AdministrativeArea', name: 'Communauté de Communes MACS' },
    ],
    priceRange: '€',
    foundingDate: '2026',
    nonprofitStatus: 'NonprofitType',
    knowsAbout: ['réemploi informatique', 'recyclerie végétale', 'inclusion numérique', 'économie circulaire', 'reconditionnement'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services de la recyclerie Ressources',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Collecte de matériel informatique',
            url: `${BASE_URL}/recyclerie-informatique/comment-donner/`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Collecte de végétaux et matériel de jardin',
            url: `${BASE_URL}/recyclerie-vegetale/comment-donner/`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Vente solidaire d\'équipements reconditionnés',
            url: `${BASE_URL}/recyclerie-informatique/beneficiaires/`,
          },
        },
      ],
    },
    potentialAction: {
      '@type': 'DonateAction',
      target: `${BASE_URL}/soutenir/don/`,
      name: 'Faire un don à l\'association Ressources',
    },
    sameAs: [
      'https://www.instagram.com/recyclerie.ressources',
      'https://www.linkedin.com/company/ressources-recyclerie',
    ],
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="google-site-verification" content="DN1eDha7pey432a-MItukzXMscgSSwmEqSDJj4fX6jM" />
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
