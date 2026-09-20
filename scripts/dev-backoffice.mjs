// Serveur de développement du back-office : Vite (interface, avec
// rechargement à chaud) et les vraies fonctions de `api/` sur le même port.
//
// Pourquoi ce script existe : `vercel dev` ne sert pas correctement les
// fichiers de développement de Vite sur ce projet (`/@vite/client` en 404,
// acheminement des requêtes `/api/` défaillant) — constaté et reproduit les
// 19 et 20/09/2026, limite d'outillage actée dans le journal d'avancement.
// Sans environnement local fonctionnel, chaque écran devait être vérifié
// après déploiement. Ce script comble ce manque en une cinquantaine de
// lignes, sans dépendance supplémentaire.
//
// Il imite volontairement les deux comportements de la plateforme Vercel qui
// nous ont posé problème en production, afin que ce qui marche ici marche
// là-bas :
//   - le corps JSON est parsé dans `req.body` (le flux est donc vide) ;
//   - `res.status()` / `res.json()` sont fournis aux handlers.
//
// Usage : npm run dev:backoffice
// Nécessite un fichier .env.local à la racine (jamais commité) contenant au
// minimum DATABASE_URL — voir docs/backoffice-variables-environnement.md.

import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const PORT = Number(process.env.PORT || 5174)
const RACINE = process.cwd()

// ── Environnement ────────────────────────────────────────────────────────
const fichierEnv = path.join(RACINE, '.env.local')
if (fs.existsSync(fichierEnv)) {
  for (const ligne of fs.readFileSync(fichierEnv, 'utf8').split(/\r?\n/)) {
    const m = ligne.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
  }
}
if (!process.env.DATABASE_URL) {
  console.error("\n.env.local absent ou sans DATABASE_URL — les routes /api/ échoueront.\n")
}
// L'origine doit correspondre exactement, sinon better-auth rejette les
// requêtes au titre de sa protection CSRF (constaté : MISSING_OR_NULL_ORIGIN).
process.env.BETTER_AUTH_URL = `http://localhost:${PORT}`
process.env.BETTER_AUTH_SECRET ||= 'secret-de-developpement-local-uniquement-0123456789'

// ── Résolution d'une requête /api/ vers son fichier ──────────────────────
// Reproduit la convention Vercel : fichier exact, sinon route « catch-all »
// `[...nom].js` du répertoire le plus proche en remontant.
function resoudre(cheminUrl) {
  const segments = cheminUrl.replace(/^\/api\/?/, '').split('/').filter(Boolean)

  const exact = path.join(RACINE, 'api', ...segments) + '.js'
  if (fs.existsSync(exact)) return exact

  for (let i = segments.length; i >= 0; i--) {
    const dossier = path.join(RACINE, 'api', ...segments.slice(0, i))
    if (!fs.existsSync(dossier)) continue
    const attrape = fs.readdirSync(dossier).find((f) => /^\[\.\.\..+\]\.js$/.test(f))
    if (attrape) return path.join(dossier, attrape)
  }
  return null
}

async function lireCorps(req) {
  let brut = ''
  for await (const morceau of req) brut += morceau
  return brut
}

// ── Serveur ──────────────────────────────────────────────────────────────
const { createServer } = await import('vite')
const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'spa',
})

const serveur = http.createServer(async (req, res) => {
  const chemin = new URL(req.url, `http://localhost:${PORT}`).pathname

  if (!chemin.startsWith('/api/')) return vite.middlewares(req, res)

  const fichier = resoudre(chemin)
  if (!fichier) {
    res.statusCode = 404
    res.setHeader('content-type', 'application/json')
    return res.end(JSON.stringify({ error: 'Aucune fonction pour ' + chemin }))
  }

  // Comme Vercel : le corps JSON est parsé et le flux consommé.
  const brut = await lireCorps(req)
  if (brut) {
    const type = req.headers['content-type'] || ''
    req.body = type.includes('application/json') ? JSON.parse(brut) : brut
  }

  // Aides fournies par le runtime Vercel, attendues par les handlers.
  res.status = (code) => {
    res.statusCode = code
    return res
  }
  res.json = (donnees) => {
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify(donnees))
    return res
  }

  try {
    const mod = await import(pathToFileURL(fichier).href)
    await mod.default(req, res)
  } catch (e) {
    console.error(`[api] ${req.method} ${chemin} :`, e)
    if (!res.headersSent) {
      res.statusCode = 500
      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify({ error: e.message }))
    }
  }
})

serveur.listen(PORT, () => {
  console.log(`\n  Back-office  →  http://localhost:${PORT}/admin/`)
  console.log(`  Site public  →  http://localhost:${PORT}/`)
  console.log(`  Routes /api/ servies depuis ./api  (base réelle)\n`)
})
