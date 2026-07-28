import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import AppRoutes from './routes'

/**
 * Rendu au moment du build (prérendu statique / SSG).
 * Renvoie le HTML du body + les balises <head> collectées par Helmet,
 * afin que Google et les robots sociaux (LinkedIn, Facebook, WhatsApp)
 * reçoivent une page complète sans exécuter de JavaScript.
 */
export function render(url) {
  const helmetContext = {}

  const html = renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </HelmetProvider>
    </React.StrictMode>
  )

  const { helmet } = helmetContext
  const head = helmet
    ? [
        helmet.title?.toString() || '',
        helmet.meta?.toString() || '',
        helmet.link?.toString() || '',
        helmet.script?.toString() || '',
      ].filter(Boolean).join('\n    ')
    : ''

  return { html, head }
}
