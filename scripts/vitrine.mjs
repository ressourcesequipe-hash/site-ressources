/**
 * Récupère la vitrine depuis Ressources 360, avant le build.
 *
 * Le site est prérendu : chaque page existe en HTML avant qu'un visiteur
 * n'arrive, c'est ce qui la rend lisible par Google. Les produits doivent donc
 * être connus au moment du build, pas chargés dans le navigateur — sans quoi
 * Google verrait une page vide et n'indexerait rien.
 *
 * Deux choses en sortent :
 *   • `src/data/vitrine.json`, que les pages importent ;
 *   • `public/vitrine/*`, les photos, **recopiées** chez nous.
 *
 * La recopie n'est pas un confort. Ressources 360 pose `X-Robots-Tag: noindex,
 * noimageindex` sur tout ce qu'il sert — c'est un back-office, et c'est voulu.
 * Une photo servie depuis là ne serait jamais indexée, et Google Images est
 * précisément par où passent les acheteurs de matériel d'occasion.
 *
 * Si Ressources 360 ne répond pas, le build **continue** avec le catalogue
 * précédent. Une vitrine d'hier vaut mieux qu'un site qui ne se déploie pas.
 */
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const racine = path.join(__dirname, '..')

const SOURCE = process.env.VITRINE_URL || 'https://ressources-360.vercel.app'
const CIBLE_JSON = path.join(racine, 'src', 'data', 'vitrine.json')
const CIBLE_PHOTOS = path.join(racine, 'public', 'vitrine')

const EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

/** Une adresse de photo lisible et stable, plutôt qu'un numéro de base. */
function nomFichier(code, rang, mime) {
  return `${String(code).toLowerCase()}-${rang + 1}.${EXTENSIONS[mime] || 'jpg'}`
}

/**
 * Le back-office dort entre deux visites : le premier appel réveille la
 * fonction et peut prendre plusieurs secondes. On réessaie plutôt que
 * d'abandonner sur un démarrage à froid.
 */
async function chercher(chemin, essais = 3) {
  let derniere
  for (let i = 0; i < essais; i++) {
    try {
      const reponse = await fetch(SOURCE + chemin, { signal: AbortSignal.timeout(20000) })
      if (!reponse.ok) throw new Error(`${reponse.status} ${reponse.statusText}`)
      return reponse
    } catch (e) {
      derniere = e
      if (i < essais - 1) await new Promise((r) => setTimeout(r, 2000 * (i + 1)))
    }
  }
  throw derniere
}

async function main() {
  let flux
  try {
    const reponse = await chercher('/api/vitrine')
    flux = await reponse.json()
  } catch (e) {
    console.warn(`[vitrine] Ressources 360 injoignable (${e.message}).`)
    console.warn('[vitrine] Le build continue avec le catalogue précédent.')
    if (!fs.existsSync(CIBLE_JSON)) {
      fs.mkdirSync(path.dirname(CIBLE_JSON), { recursive: true })
      fs.writeFileSync(
        CIBLE_JSON,
        JSON.stringify({ maj: null, produits: [], vendus: [] }, null, 2) + '\n'
      )
    }
    return
  }

  const produits = Array.isArray(flux.produits) ? flux.produits : []
  // Les appareils vendus récemment. Ils restent affichés quelques jours,
  // barrés d'un « vendu » : voir que des choses trouvent preneur en dit plus
  // long sur une recyclerie que n'importe quelle phrase.
  const vendus = Array.isArray(flux.vendus) ? flux.vendus : []

  /* Les photos : on repart d'un dossier propre pour ne pas garder celles
     d'appareils vendus depuis. */
  fs.rmSync(CIBLE_PHOTOS, { recursive: true, force: true })
  fs.mkdirSync(CIBLE_PHOTOS, { recursive: true })

  let images = 0
  for (const produit of [...produits, ...vendus]) {
    const gardees = []
    for (const [rang, photo] of (produit.photos || []).entries()) {
      try {
        const reponse = await chercher(`/api/vitrine/photo/${photo.id}`, 2)
        const mime = reponse.headers.get('content-type') || 'image/jpeg'
        const octets = Buffer.from(await reponse.arrayBuffer())
        const nom = nomFichier(produit.code, rang, mime)
        fs.writeFileSync(path.join(CIBLE_PHOTOS, nom), octets)
        gardees.push({ src: `/vitrine/${nom}`, legende: photo.legende || null })
        images++
      } catch (e) {
        console.warn(`[vitrine] Photo ${photo.id} de ${produit.code} ignorée : ${e.message}`)
      }
    }
    produit.photos = gardees
  }

  /* Un produit sans photo récupérable ne va pas en vitrine : la page serait
     un cadre vide, et la règle de publication de Ressources 360 dit la même
     chose. */
  const publiables = produits.filter((p) => p.photos.length > 0)
  const vendables = vendus.filter((p) => p.photos.length > 0)
  const ecartes = produits.length + vendus.length - publiables.length - vendables.length
  if (ecartes) console.warn(`[vitrine] ${ecartes} produit(s) écarté(s), photos indisponibles.`)

  fs.mkdirSync(path.dirname(CIBLE_JSON), { recursive: true })
  fs.writeFileSync(
    CIBLE_JSON,
    JSON.stringify(
      { maj: flux.maj || null, produits: publiables, vendus: vendables },
      null,
      2
    ) + '\n'
  )

  console.log(
    `[vitrine] ${publiables.length} produit(s), ${vendables.length} vendu(s) récent(s), ${images} photo(s).`
  )
}

main().catch((e) => {
  console.error('[vitrine] Erreur inattendue :', e)
  process.exit(1)
})
