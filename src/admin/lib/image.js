// Réduction d'une image dans le navigateur, avant envoi au serveur — §14.1.
//
// Ce n'est pas une optimisation de confort, c'est une nécessité : une
// fonction serverless Vercel n'accepte qu'un corps de requête de 4,5 Mo, et
// l'encodage base64 gonfle le fichier d'un tiers. Une photo de téléphone de
// 6 Mo serait donc refusée par la plateforme avant même d'atteindre le code,
// avec une erreur que personne ne saurait interpréter.
//
// Le traitement `sharp` côté serveur reste la source de vérité pour les
// tailles finales : ici on ne fait que rendre l'envoi possible.

// Au-delà, on réduit. 2400 px laisse de la marge au serveur, qui ramènera à
// 1600 px — recadrer plus tôt priverait d'un éventuel usage en grand format.
const LARGEUR_ENVOI = 2400

// Marge de sécurité sous la limite de Vercel : 4,5 Mo de corps, moins le
// tiers ajouté par le base64, moins les autres champs du formulaire.
export const OCTETS_MAX_ENVOI = 3 * 1024 * 1024

export function tailleLisible(octets) {
  const n = Number(octets) || 0
  if (n < 1024) return `${n} octets`
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} Ko`
  return `${(n / (1024 * 1024)).toFixed(1).replace('.', ',')} Mo`
}

function chargerImage(fichier) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(fichier)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image illisible')) }
    img.src = url
  })
}

/**
 * Renvoie le fichier en base64, réduit si nécessaire.
 *
 * @returns {Promise<{base64: string, octets: number, octetsOrigine: number,
 *   largeur: number, hauteur: number, reduite: boolean}>}
 */
export async function preparerImage(fichier) {
  const octetsOrigine = fichier.size

  // Les navigateurs récents décodent le HEIC des iPhone ; les autres non.
  // Mieux vaut le dire tout de suite que laisser échouer l'envoi.
  let image
  try {
    image = await chargerImage(fichier)
  } catch {
    throw new Error(
      "Ce fichier n'a pas pu être lu comme une image. Si elle vient d'un iPhone au format HEIC, exportez-la en JPEG avant de la déposer."
    )
  }

  const facteur = Math.min(1, LARGEUR_ENVOI / image.naturalWidth)
  const largeur = Math.round(image.naturalWidth * facteur)
  const hauteur = Math.round(image.naturalHeight * facteur)

  const toile = document.createElement('canvas')
  toile.width = largeur
  toile.height = hauteur
  toile.getContext('2d').drawImage(image, 0, 0, largeur, hauteur)

  // On baisse la qualité par paliers jusqu'à passer sous la limite. Trois
  // essais suffisent en pratique ; au-delà, l'image est si particulière
  // qu'un message vaut mieux qu'une dégradation silencieuse.
  for (const qualite of [0.85, 0.7, 0.55]) {
    const blob = await new Promise((r) => toile.toBlob(r, 'image/webp', qualite))
    if (blob && blob.size <= OCTETS_MAX_ENVOI) {
      const base64 = await blobEnBase64(blob)
      return {
        base64,
        octets: blob.size,
        octetsOrigine,
        largeur,
        hauteur,
        reduite: blob.size < octetsOrigine,
      }
    }
  }

  throw new Error(
    `Cette image reste trop lourde même après réduction (plus de ${tailleLisible(OCTETS_MAX_ENVOI)}). Réduisez ses dimensions avant de la déposer.`
  )
}

function blobEnBase64(blob) {
  return new Promise((resolve, reject) => {
    const lecteur = new FileReader()
    lecteur.onload = () => resolve(String(lecteur.result).split(',')[1])
    lecteur.onerror = () => reject(new Error('lecture impossible'))
    lecteur.readAsDataURL(blob)
  })
}
