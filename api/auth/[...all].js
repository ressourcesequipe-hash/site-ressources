// Monte better-auth sur /api/auth/* — fonction serverless Vercel.
//
// Ce handler ne peut pas se contenter de `toNodeHandler(auth)` : deux
// comportements de la plateforme, tous deux constatés en production le
// 20/09/2026, l'empêchent de fonctionner tel quel.
//
// ── 1. La route « catch-all » ne couvre qu'un seul segment ───────────────
// `/api/auth/get-session` atteint bien cette fonction, mais
// `/api/auth/sign-in/email` renvoie le NOT_FOUND de Vercel. Or better-auth
// a besoin de chemins à plusieurs segments (`sign-in/email`,
// `sign-up/email`, `callback/...`) : la connexion était donc structurellement
// injoignable. Une réécriture explicite dans `vercel.json` rattache
// désormais tout `/api/auth/*` à cette fonction, en transmettant le chemin
// d'origine dans le paramètre `__auth`. On le rétablit ci-dessous, afin que
// better-auth voie toujours l'URL réelle — que la plateforme ait conservé le
// chemin d'origine ou l'ait remplacé par celui de la fonction.
//
// ── 2. Le corps de la requête est déjà consommé ──────────────────────────
// Le runtime Node de Vercel parse le JSON entrant et l'expose dans
// `req.body`, ce qui vide le flux. `toNodeHandler` lisant ce flux,
// better-auth recevrait un corps vide sur toute requête POST — donc sur
// toute connexion. `api/contact.js` contourne déjà ce comportement à sa
// manière ; ici, on reconstruit la requête web standard à partir de
// `req.body` quand il est déjà là, et du flux brut sinon.
//
// On appelle donc `auth.handler` (l'interface Request/Response native de
// better-auth) plutôt que `toNodeHandler`, ce qui laisse ces deux points
// entièrement sous contrôle.

import { auth } from '../../lib/auth.js'

const BASE = '/api/auth'

function urlReelle(req) {
  const hote = req.headers['x-forwarded-host'] || req.headers.host || 'localhost'
  const protocole = req.headers['x-forwarded-proto'] || 'https'
  const url = new URL(req.url, `${protocole}://${hote}`)

  // Chemin d'origine transmis par la réécriture de vercel.json.
  const transmis = url.searchParams.get('__auth')
  if (transmis) {
    url.searchParams.delete('__auth')
    url.pathname = `${BASE}/${transmis}`.replace(/\/+/g, '/')
  }
  return url
}

function corps(req) {
  // Requêtes sans corps : rien à transmettre.
  if (req.method === 'GET' || req.method === 'HEAD') return undefined

  // Corps déjà parsé par la plateforme : le flux est vide, on le recompose.
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') return req.body
    if (Buffer.isBuffer(req.body)) return req.body
    return JSON.stringify(req.body)
  }

  // Flux intact (exécution locale, ou runtime qui ne parse pas) : better-auth
  // le lira lui-même via le corps de la Request.
  return req
}

export default async function handler(req, res) {
  const url = urlReelle(req)

  const entetes = new Headers()
  for (const [nom, valeur] of Object.entries(req.headers)) {
    if (valeur === undefined) continue
    if (Array.isArray(valeur)) for (const v of valeur) entetes.append(nom, v)
    else entetes.set(nom, valeur)
  }
  // La longueur d'origine ne vaut plus rien si le corps a été recomposé.
  entetes.delete('content-length')

  const charge = corps(req)
  const requete = new Request(url, {
    method: req.method,
    headers: entetes,
    body: charge,
    // Requis par la spécification dès qu'un corps est un flux.
    ...(charge === req ? { duplex: 'half' } : {}),
  })

  const reponse = await auth.handler(requete)

  res.statusCode = reponse.status
  // `Set-Cookie` doit rester plusieurs en-têtes distincts, jamais concaténé :
  // c'est ce qui porte le cookie de session.
  const cookies = typeof reponse.headers.getSetCookie === 'function' ? reponse.headers.getSetCookie() : []
  if (cookies.length) res.setHeader('set-cookie', cookies)
  for (const [nom, valeur] of reponse.headers.entries()) {
    if (nom.toLowerCase() === 'set-cookie') continue
    res.setHeader(nom, valeur)
  }

  const contenu = reponse.body ? Buffer.from(await reponse.arrayBuffer()) : null
  res.end(contenu)
}
