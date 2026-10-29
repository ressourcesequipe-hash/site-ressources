// Pages institutionnelles publiées depuis le back-office, figées dans
// `cms.json` au moment du build par `scripts/contenus.mjs`.

import cms from './cms.json' with { type: 'json' }

export const PAGES = cms.pages ?? []

export function getPage(slug) {
  return PAGES.find((p) => p.slug === slug) ?? null
}
