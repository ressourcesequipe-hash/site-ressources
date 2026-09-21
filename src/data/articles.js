/**
 * Articles & actualités — lus depuis le back-office.
 *
 * Ce fichier ne contient plus d'articles : il adapte le contenu exporté de la
 * base par `scripts/contenus.mjs` à la forme que le site a toujours connue.
 * Les pages et `prerender.js` continuent donc d'importer `ARTICLES` et
 * `CATEGORIES` sans rien savoir de la base — c'est ce qui a permis de brancher
 * le CMS sans toucher à une seule page.
 *
 * `cms.json` est committé : il sert de repli si la base est injoignable au
 * moment du build, et permet de reconstruire le site sans accès à la base.
 * Ne le modifiez pas à la main — le build le réécrit.
 *
 * Pour ajouter ou corriger un article : /admin/actualites.
 */

import cms from './cms.json' with { type: 'json' }
import { CATEGORIES as CATEGORIES_CMS } from '../../lib/actualites.js'

// « Tous les articles » n'est pas une catégorie de contenu : c'est le filtre
// par défaut de la page, ajouté ici plutôt que stocké en base, où il n'aurait
// rien à faire — on ne peut pas classer un article dans « tous ».
export const CATEGORIES = [
  { id: 'all', label: 'Tous les articles' },
  ...CATEGORIES_CMS.map(({ cle, libelle }) => ({ id: cle, label: libelle })),
]

// Triés du plus récent au plus ancien par l'export. L'ordre venait autrefois
// de la position dans ce fichier, ce qui laissait un article de mai passer
// devant un de septembre.
export const ARTICLES = cms.actualites

export function getArticleBySlug(slug) {
  return ARTICLES.find(a => a.slug === slug) || null
}

export function getFeaturedArticle() {
  return ARTICLES.find(a => a.featured) || ARTICLES[0]
}

export function getArticlesByCategory(categoryId) {
  if (categoryId === 'all') return ARTICLES
  return ARTICLES.filter(a => a.category === categoryId)
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}
