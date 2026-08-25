/**
 * Prérendu statique (SSG) — génère un vrai fichier HTML par route.
 *
 * Pourquoi : le site est une SPA React. Sans prérendu, Google reçoit une page
 * vide (<div id="root"></div>) et les robots sociaux (LinkedIn, Facebook,
 * WhatsApp, Bing), qui n'exécutent pas de JavaScript, ne voient ni le titre
 * ni la description de la page partagée.
 *
 * Lancé automatiquement par `npm run build`, après le build client et le
 * build SSR. Le résultat écrase dist/index.html et crée dist/<route>/index.html.
 */
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, 'dist')
const ssrEntry = path.join(__dirname, 'dist-ssr', 'entry-server.js')

/* Routes statiques à prérendre (les routes dynamiques :slug sont ajoutées ensuite) */
const STATIC_ROUTES = [
  '/',
  '/evenement-lancement-03-octobre-2026/',
  '/defi-collecte/',
  '/materiel-disponible/',
  '/recyclerie-informatique/',
  '/recyclerie-informatique/comment-donner/',
  '/recyclerie-informatique/materiel-accepte/',
  '/recyclerie-informatique/reconditionnement/',
  '/recyclerie-informatique/effacement-donnees/',
  '/recyclerie-informatique/beneficiaires/',
  '/recyclerie-vegetale/',
  '/recyclerie-vegetale/comment-donner/',
  '/recyclerie-vegetale/ce-que-nous-acceptons/',
  '/recyclerie-vegetale/redistribution/',
  '/recyclerie-vegetale/partenaires-vegetaux/',
  '/ateliers/',
  '/ateliers/numerique/',
  '/ateliers/vegetal/',
  '/ateliers/collectivites/',
  '/ateliers/entreprises/',
  '/ateliers/ecoles/',
  '/association/',
  '/association/gouvernance/',
  '/association/territoire/',
  '/association/partenaires/',
  '/association/actualites/',
  '/association/nous-rejoindre/',
  '/association/presse/',
  '/soutenir/',
  '/soutenir/tombola/',
  '/soutenir/benevole/',
  '/soutenir/mecene/',
  '/soutenir/don/',
  '/contact/',
  '/mentions-legales/',
  '/confidentialite/',
]

async function main() {
  if (!fs.existsSync(ssrEntry)) {
    console.error(`[prerender] Introuvable : ${ssrEntry} — le build SSR a-t-il échoué ?`)
    process.exit(1)
  }

  const { render } = await import(url.pathToFileURL(ssrEntry).href)

  /* Articles de blog (routes dynamiques /association/actualites/:slug/) */
  let routes = [...STATIC_ROUTES]
  try {
    const mod = await import(url.pathToFileURL(path.join(__dirname, 'src', 'data', 'articles.js')).href)
    const articles = mod.ARTICLES || mod.articles || mod.default || []
    for (const a of articles) {
      // Les articles porteurs d'un externalLink ne sont qu'une redirection
      // cote client : les prerendre produirait une page vide que Google
      // classerait en contenu insuffisant. Une 301 les couvre (vercel.json).
      if (a && a.slug && !a.externalLink) routes.push(`/association/actualites/${a.slug}/`)
    }
  } catch (e) {
    console.warn('[prerender] Articles non chargés, routes statiques uniquement :', e.message)
  }

  /* Vitrine : une page par appareil en rayon.
     Sans elles, Google ne verrait qu'une liste chargée en JavaScript — c'est-a-dire
     rien. Elles disparaissent d'elles-mêmes au build suivant quand l'appareil
     est vendu, et vercel.json renvoie alors vers la liste. */
  let produits = []
  let vendus = []
  try {
    const vitrine = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'src', 'data', 'vitrine.json'), 'utf-8')
    )
    produits = vitrine.produits || []
    vendus = vitrine.vendus || []
    for (const p of [...produits, ...vendus]) {
      routes.push(`/materiel-disponible/${p.code.toLowerCase()}/`)
    }
  } catch (e) {
    console.warn('[prerender] Vitrine non chargée :', e.message)
  }

  const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')

  let ok = 0
  const failed = []

  for (const route of routes) {
    try {
      const { html, head } = render(route)

      /* On retire le <title> et la <meta description> par défaut du template :
         Helmet fournit ceux, spécifiques, de chaque page. */
      let page = template
        .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
        .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/i, '')
        .replace('</head>', `  ${head}\n  </head>`)
        .replace('<div id="root"></div>', `<div id="root">${html}</div>`)

      const outDir = route === '/' ? distDir : path.join(distDir, route)
      fs.mkdirSync(outDir, { recursive: true })
      fs.writeFileSync(path.join(outDir, 'index.html'), page)
      ok++
    } catch (e) {
      failed.push(`${route} → ${e.message}`)
    }
  }

  /* Le plan du site de la vitrine, à part : il change à chaque publication,
     là où sitemap.xml est écrit à la main et bouge deux fois par an. */
  const aujourdhui = new Date().toISOString().slice(0, 10)
  const urls = [
    `  <url><loc>https://www.ressourcesrecyclerie.fr/materiel-disponible/</loc><lastmod>${aujourdhui}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`,
    ...produits.map(
      (p) =>
        `  <url><loc>https://www.ressourcesrecyclerie.fr/materiel-disponible/${p.code.toLowerCase()}/</loc><lastmod>${aujourdhui}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`
    ),
  ]
  fs.writeFileSync(
    path.join(distDir, 'sitemap-materiel.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
  )

  console.log(
    `[prerender] ${ok}/${routes.length} pages prérendues, ${produits.length} en vitrine, ${vendus.length} vendu(s).`
  )
  if (failed.length) {
    console.error('[prerender] Échecs :')
    failed.forEach((f) => console.error('  - ' + f))
    process.exit(1)
  }
}

main().catch((e) => {
  console.error('[prerender] Erreur fatale :', e)
  process.exit(1)
})
