// Médiathèque — import d'un média public — §4 de l'architecture technique
// (révisé), §14 du cahier des charges.
//
// Étape 1 (socle) : implémente le circuit complet pour UN fichier, avec les
// garanties de sécurité déjà actées (chemin verrouillé côté serveur, jeton
// GitHub scoping unique, retry sur conflit 409). Les déclinaisons multiples
// par usage (miniature/carte/article/hero/partage) et l'import multi-fichier
// restent à compléter en Étape 2, une fois le circuit de base validé.
//
// GITHUB_MEDIA_TOKEN est un jeton fine-grained, généré depuis le compte
// propriétaire du dépôt (donc déjà reconnu comme collaborateur — c'est ce
// que demande le §14.1, pas nécessairement un second compte), mais scopé
// à ce seul dépôt avec la seule permission « Contents: Read and write ».
// Un jeton qui fuit ne permet donc rien d'autre que d'écrire des fichiers
// dans public/medias/ de ce dépôt précis.
//
// L'auteur du commit est fixé explicitement par l'API (voir `author` /
// `committer` ci-dessous), indépendamment du compte authentifié — c'est ce
// qui permet à `scripts/ignored-build-step.sh` de reconnaître ces commits
// sans avoir besoin d'un second compte GitHub dédié.

import crypto from 'node:crypto'
import sharp from 'sharp'
import { Octokit } from 'octokit'
import { auth } from '../../../lib/auth.js'
import { fromNodeHeaders } from 'better-auth/node'
import { db } from '../../../lib/db.js'
import { media } from '../../../db/schema.js'
import { verifierDroit } from '../../../lib/permissions.js'

// Liste fermée, définie ici — jamais une valeur texte libre envoyée par le
// client (§4 : « empêcher l'upload en dehors des répertoires autorisés »).
const CATEGORIES_AUTORISEES = new Set([
  'actualites',
  'evenements',
  'partenaires',
  'ateliers',
  'points-collecte',
  'pages',
])

const TAILLE_MAX_OCTETS = 12 * 1024 * 1024 // 12 Mo — avant compression sharp

const GITHUB_OWNER = process.env.GITHUB_MEDIA_OWNER
const GITHUB_REPO = process.env.GITHUB_MEDIA_REPO || 'site-ressources'
const GITHUB_TOKEN = process.env.GITHUB_MEDIA_TOKEN
const GITHUB_COMMITTER_EMAIL = process.env.GITHUB_MEDIA_COMMITTER_EMAIL

// Identité de commit dédiée, indépendante du compte authentifié — lue par
// scripts/ignored-build-step.sh pour distinguer un commit de médiathèque
// d'un vrai commit de développement.
const AUTEUR_COMMIT = { name: 'Médiathèque Ressources', email: GITHUB_COMMITTER_EMAIL }

// Nom de fichier entièrement généré côté serveur : aucune partie du nom
// envoyé par le navigateur n'atteint jamais le chemin final.
function genererNomFichier() {
  return `${crypto.randomUUID()}.webp`
}

async function ecrireSurGithub(octokit, chemin, contenu, shaExistant, essaisRestants = 1) {
  try {
    const reponse = await octokit.rest.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: chemin,
      message: `media: ${chemin}`,
      content: contenu.toString('base64'),
      sha: shaExistant || undefined,
      author: AUTEUR_COMMIT,
      committer: AUTEUR_COMMIT,
    })
    return reponse.data.content.sha
  } catch (e) {
    // Conflit d'écriture : deux publications proches se chevauchent sur
    // l'API GitHub (§4, §14.1). Un seul réessai automatique après relecture
    // du SHA à jour, pas de boucle indéfinie.
    if (e.status === 409 && essaisRestants > 0) {
      const { data } = await octokit.rest.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: chemin,
      })
      return ecrireSurGithub(octokit, chemin, contenu, data.sha, essaisRestants - 1)
    }
    throw e
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
  if (!session) return res.status(401).json({ error: 'Non authentifié' })
  if (!verifierDroit(session.user.role, 'mediatheque.televerser')) {
    return res.status(403).json({ error: 'Droits insuffisants pour ajouter un média' })
  }

  if (!GITHUB_OWNER || !GITHUB_TOKEN || !GITHUB_COMMITTER_EMAIL) {
    console.error('GITHUB_MEDIA_OWNER, GITHUB_MEDIA_TOKEN ou GITHUB_MEDIA_COMMITTER_EMAIL manquant')
    return res.status(500).json({ error: 'Configuration manquante' })
  }

  const { categorie, fichierBase64, titre, alt, credit } = req.body || {}

  if (!CATEGORIES_AUTORISEES.has(categorie)) {
    return res.status(400).json({ error: 'Catégorie inconnue' })
  }
  if (typeof fichierBase64 !== 'string' || !fichierBase64) {
    return res.status(400).json({ error: 'Fichier manquant' })
  }

  const original = Buffer.from(fichierBase64, 'base64')
  if (original.byteLength > TAILLE_MAX_OCTETS) {
    return res.status(413).json({ error: 'Fichier trop volumineux (12 Mo maximum)' })
  }

  // Validation réelle du contenu, pas seulement de l'extension déclarée :
  // sharp lève une erreur sur tout ce qui n'est pas une image valide (§4).
  let variante
  try {
    variante = await sharp(original)
      .rotate() // corrige l'orientation EXIF avant toute redimension
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()
  } catch {
    return res.status(400).json({ error: 'Format de fichier non reconnu' })
  }

  const nomFichier = genererNomFichier()
  // Chemin systématiquement recomposé sous ce préfixe fixe : `categorie`
  // vient de l'ensemble fermé vérifié plus haut, `nomFichier` est généré —
  // aucune valeur reçue du client ne peut faire sortir le chemin de
  // public/medias/ (§4).
  const cheminGithub = `public/medias/${categorie}/${nomFichier}`
  const cheminPublic = `/medias/${categorie}/${nomFichier}`

  const octokit = new Octokit({ auth: GITHUB_TOKEN })
  let sha
  try {
    sha = await ecrireSurGithub(octokit, cheminGithub, variante, null)
  } catch (e) {
    console.error('Écriture GitHub échouée:', e.message)
    return res.status(502).json({ error: "L'enregistrement du fichier a échoué, réessayez." })
  }

  const [ligne] = await db
    .insert(media)
    .values({
      chemin: cheminPublic,
      titre: titre || null,
      alt: alt || null,
      credit: credit || null,
      categorie,
      utilisateurId: session.user.id,
      shaGithub: sha,
    })
    .returning()

  // Volontairement AUCUN appel à demanderDeploiement() ici : un média ajouté
  // seul, non encore rattaché à un contenu publié, ne déclenche pas de
  // déploiement à lui seul (§5.5 du cahier, §4 de l'architecture). C'est la
  // publication du contenu qui le référence qui s'en charge.
  return res.status(200).json({ ok: true, media: ligne })
}
