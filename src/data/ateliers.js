/**
 * Rubrique « Ateliers » — données partagées du silo.
 *
 * Architecture SEO (une page = une intention de recherche, anti-cannibalisation) :
 *   /ateliers/               hub          → « ateliers recyclerie Landes »
 *   /ateliers/numerique/     thème        → « atelier réemploi / réparation informatique »
 *   /ateliers/vegetal/       thème        → « atelier bouturage / rempotage »
 *   /ateliers/collectivites/ audience     → « atelier sensibilisation numérique collectivité »
 *   /ateliers/entreprises/   audience     → « atelier RSE réemploi »
 *   /ateliers/ecoles/        audience     → « atelier réemploi école »
 *
 * NOTE : les mots-clés ci-dessous sont des hypothèses d'intention.
 * À valider dans Google Keyword Planner avant d'appuyer davantage sur l'un d'eux.
 */

export const BASE_URL = 'https://www.ressourcesrecyclerie.fr'

/* Ancrage géographique — repris dans les textes et les schemas */
export const TERRITOIRE = {
  ville: 'Vielle-Saint-Girons',
  departement: 'Landes',
  codePostal: '40560',
  intercos: ['Côte Landes Nature', 'MACS'],
  communes: ['Léon', 'Linxe', 'Castets', 'Saint-Julien-en-Born', 'Lit-et-Mixe', 'Soustons'],
}

export const SOUS_PAGES = [
  {
    slug: 'numerique',
    to: '/ateliers/numerique/',
    type: 'theme',
    theme: 'num',
    nav: 'Ateliers numériques',
    titre: 'Ateliers numériques',
    accroche: 'Réparer, entretenir et prolonger la vie de ses équipements informatiques.',
    resume:
      "Comprendre l'impact du numérique, diagnostiquer une panne simple et choisir entre réparer, réutiliser ou recycler.",
  },
  {
    slug: 'vegetal',
    to: '/ateliers/vegetal/',
    type: 'theme',
    theme: 'veg',
    nav: 'Ateliers végétaux',
    titre: 'Ateliers végétaux',
    accroche: 'Rempotage, bouturage, compostage : les gestes qui font durer le vivant.',
    resume:
      'Apprendre à multiplier ses plantes, réemployer pots et contenants, et réduire ses déchets de jardin.',
  },
  {
    slug: 'collectivites',
    to: '/ateliers/collectivites/',
    type: 'audience',
    theme: 'num',
    nav: 'Pour les collectivités',
    titre: 'Ateliers pour les collectivités',
    accroche: 'Un dispositif de sensibilisation et de réemploi pour votre commune.',
    resume:
      "Sensibilisation des habitants, collecte, reconditionnement et bilan d'impact chiffré pour votre territoire.",
  },
  {
    slug: 'entreprises',
    to: '/ateliers/entreprises/',
    type: 'audience',
    theme: 'veg',
    nav: 'Pour les entreprises (RSE)',
    titre: 'Ateliers RSE pour les entreprises',
    accroche: 'Relier vos engagements RSE à une action locale et mesurable.',
    resume:
      'Collecte du parc informatique en fin de vie, sensibilisation des équipes et redistribution solidaire.',
  },
  {
    slug: 'ecoles',
    to: '/ateliers/ecoles/',
    type: 'audience',
    theme: 'veg',
    nav: 'Pour les écoles',
    titre: 'Ateliers pour les écoles',
    accroche: 'Faire comprendre le réemploi aux élèves, par la pratique.',
    resume:
      'Interventions scolaires et péri-scolaires autour du numérique responsable et du vivant.',
  },
]

/* ── Schemas réutilisables ────────────────────────────────── */

export function serviceSchema({ name, description, url, audienceType }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${BASE_URL}${url}`,
    serviceType: 'Atelier de sensibilisation au réemploi',
    provider: {
      '@type': 'NGO',
      name: 'Association Ressources',
      url: BASE_URL,
      address: {
        '@type': 'PostalAddress',
        addressLocality: TERRITOIRE.ville,
        postalCode: TERRITOIRE.codePostal,
        addressRegion: 'Nouvelle-Aquitaine',
        addressCountry: 'FR',
      },
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Landes' },
      ...TERRITOIRE.intercos.map((n) => ({ '@type': 'AdministrativeArea', name: n })),
    ],
    ...(audienceType && { audience: { '@type': 'Audience', audienceType } }),
  }
}

export function faqSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, r }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: r },
    })),
  }
}

/* Combine plusieurs schemas dans un seul bloc JSON-LD */
export function graph(...schemas) {
  return { '@context': 'https://schema.org', '@graph': schemas.map(({ '@context': _, ...s }) => s) }
}
