// Médiathèque — §14 du cahier des charges, §4 de l'architecture (révisé).
//
// Regroupe tout le module derrière une seule fonction serverless : lister,
// importer, corriger les métadonnées, supprimer. Le forfait Vercel du projet
// en autorise douze au total, et un treizième fichier avait fait échouer le
// déploiement du 21/09/2026 — autant ne pas répéter l'erreur pour le confort
// d'avoir une route par verbe.
//
// Remplace `api/admin/medias/upload.js`, dont le circuit d'import est repris
// ici sans changement de fond : chemin recomposé côté serveur, validation
// réelle du contenu par sharp, réessai unique sur conflit GitHub.
//
// GITHUB_MEDIA_TOKEN est un jeton fine-grained scopé à ce seul dépôt avec la
// seule permission « Contents: Read and write ». Un jeton qui fuit ne permet
// donc rien d'autre que d'écrire dans public/medias/ de ce dépôt précis.
//
// §14.2 : le dépôt est PUBLIC. Aucune pièce jointe de demande, aucun document
// contenant des données personnelles ne passe par ici.

import crypto from 'node:crypto'
import sharp from 'sharp'
import { Octokit } from 'octokit'
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { auth } from '../../lib/auth.js'
import { fromNodeHeaders } from 'better-auth/node'
import { db } from '../../lib/db.js'
import { media, user } from '../../db/schema.js'
import { verifierDroit } from '../../lib/permissions.js'
import {
  CATEGORIES,
  TABLES_CHERCHEES,
  colonnesAFouiller,
  CLES_CATEGORIES,
  LARGEUR_MAX,
  QUALITE_WEBP,
  TAILLE_MAX_OCTETS,
  tailleLisible,
  validerMetadonnees,
  verifierSuppression,
} from '../../lib/medias.js'
import { messageSansDonnees } from '../../lib/demandes.js'

const GITHUB_OWNER = process.env.GITHUB_MEDIA_OWNER
const GITHUB_REPO = process.env.GITHUB_MEDIA_REPO || 'site-ressources'
const GITHUB_TOKEN = process.env.GITHUB_MEDIA_TOKEN
const GITHUB_COMMITTER_EMAIL = process.env.GITHUB_MEDIA_COMMITTER_EMAIL

// Identité de commit dédiée, indépendante du compte authentifié : elle rend
// un commit de médiathèque reconnaissable dans l'historique.
const AUTEUR_COMMIT = { name: 'Médiathèque Ressources', email: GITHUB_COMMITTER_EMAIL }

// Le paquet `octokit` embarque un plugin qui rejoue automatiquement les 409,
// 500 et 502, avec une attente pouvant atteindre quatre secondes. Désactivé
// ici, pour deux raisons constatées le 21/09/2026 :
//
//   — sur un 409, rejouer la MÊME requête ne peut pas aboutir : le conflit
//     vient du SHA, il faut le relire avant de réécrire. C'est ce que fait
//     `ecrireSurGithub` ci-dessous, et son réessai ne s'exécutait jamais
//     parce qu'Octokit avait déjà épuisé le sien ;
//   — sur une panne, ces attentes s'ajoutent au traitement sharp et
//     rapprochent la fonction de son délai maximal, au lieu de rendre la
//     main à l'utilisateur avec un message.
function clientGithub() {
  return new Octokit({ auth: GITHUB_TOKEN, retry: { enabled: false } })
}

export default async function handler(req, res) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
  if (!session) return res.status(401).json({ error: 'Non authentifié' })
  const utilisateur = session.user

  const id = req.query?.id ? Number(req.query.id) : null

  try {
    // La consultation est ouverte à tout compte connecté : choisir une image
    // existante dans un formulaire en dépend, y compris pour un contributeur
    // qui n'a pas le droit d'en importer.
    if (req.method === 'GET') return await lister(req, res)

    if (!verifierDroit(utilisateur.role, 'mediatheque.televerser')) {
      return res.status(403).json({ error: 'Droits insuffisants pour modifier la médiathèque.' })
    }

    if (req.method === 'POST') return await importer(req, res, utilisateur)
    if (req.method === 'PATCH' && id) return await modifier(req, res, id)
    if (req.method === 'DELETE' && id) return await supprimer(req, res, utilisateur, id)
    return res.status(405).json({ error: 'Méthode non autorisée' })
  } catch (e) {
    console.error(`[medias] ${req.method} ${id || ''} :`, messageSansDonnees(e))
    return res.status(500).json({ error: "Une erreur est survenue. Rien n'a été modifié." })
  }
}

// ── Lecture ──────────────────────────────────────────────────────────────

async function lister(req, res) {
  const q = req.query || {}
  const conditions = []
  if (q.categorie) {
    if (!CLES_CATEGORIES.includes(q.categorie)) {
      return res.status(400).json({ error: 'Catégorie inconnue.' })
    }
    conditions.push(eq(media.categorie, q.categorie))
  }
  if (q.recherche) {
    const motif = `%${q.recherche}%`
    conditions.push(or(ilike(media.titre, motif), ilike(media.alt, motif), ilike(media.description, motif)))
  }

  const lignes = await db
    .select({
      id: media.id,
      chemin: media.chemin,
      titre: media.titre,
      alt: media.alt,
      credit: media.credit,
      description: media.description,
      pointFocal: media.pointFocal,
      categorie: media.categorie,
      protege: media.protege,
      creeLe: media.creeLe,
      auteurNom: user.name,
    })
    .from(media)
    .leftJoin(user, eq(media.utilisateurId, user.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(media.creeLe))

  return res.status(200).json({ medias: lignes, categories: CATEGORIES })
}

// ── Où un média est-il utilisé ? ─────────────────────────────────────────
//
// Recherche textuelle sur le chemin public : un média peut être référencé
// dans une colonne dédiée (`image`, `logo`) ou au fond d'un bloc JSON. La
// chaîne couvre les deux, là où une jointure ne verrait que la première.

// Colonnes réellement présentes, lues dans le schéma plutôt que recopiées :
// une liste figée se désaligne en silence, et le silence coûte ici une page
// cassée. Une seule requête, et seulement au moment d'une suppression.
async function schemaDesTables() {
  const noms = TABLES_CHERCHEES.map((t) => t.table)
  const resultat = await db.execute(
    sql`select table_name, column_name, data_type from information_schema.columns
        where table_schema = 'public' and table_name in (${sql.join(noms.map((n) => sql`${n}`), sql`, `)})`
  )
  const parTable = {}
  for (const ligne of resultat.rows ?? resultat) {
    ;(parTable[ligne.table_name] ||= []).push(ligne)
  }
  return parTable
}

async function usagesDuMedia(chemin) {
  const usages = []
  const motif = `%${chemin}%`
  const schema = await schemaDesTables()

  for (const source of TABLES_CHERCHEES) {
    const colonnes = schema[source.table]
    if (!colonnes) continue
    const { texte, json } = colonnesAFouiller(colonnes)

    // Noms de tables et de colonnes passés par `sql.identifier`, valeurs par
    // interpolation paramétrée : aucune chaîne n'est concaténée dans la
    // requête. Les noms viennent du schéma, pas du client, mais assembler du
    // SQL à la main est le genre de code qui finit par accueillir une valeur
    // venue d'ailleurs.
    const morceaux = [
      ...texte.map((c) => sql`${sql.identifier(c)} = ${chemin}`),
      ...json.map((c) => sql`${sql.identifier(c)}::text like ${motif}`),
    ]
    if (morceaux.length === 0) continue

    try {
      const resultat = await db.execute(
        sql`select id, ${sql.identifier(source.titre)} as titre from ${sql.identifier(source.table)} where ${sql.join(morceaux, sql` or `)}`
      )
      for (const ligne of resultat.rows ?? resultat) {
        usages.push({ table: source.table, libelle: source.libelle, id: ligne.id, titre: ligne.titre })
      }
    } catch (e) {
      // Une requête qui échoue ne doit pas empêcher de répondre — mais elle
      // rend la liste d'usages INCOMPLÈTE, donc la suppression dangereuse.
      // L'échec est propagé pour que l'appelant refuse plutôt que d'effacer
      // sur la foi d'une recherche partielle.
      console.error(`[medias] usages dans ${source.table} :`, messageSansDonnees(e))
      throw new Error(`Recherche des usages impossible sur ${source.table}.`)
    }
  }
  return usages
}

// ── Import ───────────────────────────────────────────────────────────────

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
    // l'API GitHub (§14.1). Un seul réessai après relecture du SHA à jour,
    // jamais de boucle.
    if (e.status === 409 && essaisRestants > 0) {
      const { data } = await octokit.rest.repos.getContent({ owner: GITHUB_OWNER, repo: GITHUB_REPO, path: chemin })
      return ecrireSurGithub(octokit, chemin, contenu, data.sha, essaisRestants - 1)
    }
    throw e
  }
}

async function effacerSurGithub(octokit, chemin, sha) {
  await octokit.rest.repos.deleteFile({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path: chemin,
    message: `media supprimé: ${chemin}`,
    sha,
    author: AUTEUR_COMMIT,
    committer: AUTEUR_COMMIT,
  })
}

function configurationComplete() {
  return Boolean(GITHUB_OWNER && GITHUB_TOKEN && GITHUB_COMMITTER_EMAIL)
}

async function importer(req, res, utilisateur) {
  if (!configurationComplete()) {
    console.error('[medias] GITHUB_MEDIA_OWNER, GITHUB_MEDIA_TOKEN ou GITHUB_MEDIA_COMMITTER_EMAIL manquant')
    return res.status(500).json({
      error: "L'envoi d'images n'est pas configuré sur le serveur. Signalez-le à l'équipe technique.",
    })
  }

  const { categorie, fichierBase64 } = req.body || {}
  if (!CLES_CATEGORIES.includes(categorie)) return res.status(400).json({ error: 'Catégorie inconnue.' })
  if (typeof fichierBase64 !== 'string' || !fichierBase64) {
    return res.status(400).json({ error: 'Aucun fichier reçu.' })
  }

  const validation = validerMetadonnees(req.body)
  if (!validation.ok) return res.status(400).json({ erreurs: validation.erreurs })

  const original = Buffer.from(fichierBase64, 'base64')
  if (original.byteLength > TAILLE_MAX_OCTETS) {
    return res.status(413).json({
      error: `Ce fichier fait ${tailleLisible(original.byteLength)}, la limite est de ${tailleLisible(TAILLE_MAX_OCTETS)}. Réduisez-le avant de le renvoyer.`,
    })
  }

  // Validation réelle du contenu, et non de l'extension déclarée : sharp
  // échoue sur tout ce qui n'est pas une image (§4).
  let variante
  let metadonnees
  try {
    const image = sharp(original).rotate() // corrige l'orientation EXIF d'abord
    metadonnees = await image.metadata()
    variante = await image.resize({ width: LARGEUR_MAX, withoutEnlargement: true }).webp({ quality: QUALITE_WEBP }).toBuffer()
  } catch {
    return res.status(400).json({ error: "Ce fichier n'est pas une image reconnue (JPG, PNG ou WebP)." })
  }

  // Nom entièrement généré : aucune partie du nom envoyé par le navigateur
  // n'atteint le chemin final, et le préfixe est fixe.
  const nomFichier = `${crypto.randomUUID()}.webp`
  const cheminGithub = `public/medias/${categorie}/${nomFichier}`
  const cheminPublic = `/medias/${categorie}/${nomFichier}`

  const octokit = clientGithub()
  let sha
  try {
    sha = await ecrireSurGithub(octokit, cheminGithub, variante, null)
  } catch (e) {
    console.error('[medias] écriture GitHub échouée :', messageSansDonnees(e))
    return res.status(502).json({ error: "L'enregistrement du fichier a échoué. Réessayez dans un instant." })
  }

  const [ligne] = await db
    .insert(media)
    .values({
      chemin: cheminPublic,
      ...validation.valeurs,
      categorie,
      utilisateurId: utilisateur.id,
      shaGithub: sha,
    })
    .returning()

  // Volontairement aucun déclenchement de déploiement : un média importé mais
  // pas encore rattaché à un contenu publié n'a rien à mettre en ligne (§5.5).
  // C'est la publication du contenu qui le référence qui s'en charge.
  return res.status(201).json({
    media: ligne,
    dimensions: { largeur: metadonnees?.width ?? null, hauteur: metadonnees?.height ?? null },
  })
}

// ── Métadonnées ──────────────────────────────────────────────────────────

async function modifier(req, res, id) {
  const [avant] = await db.select().from(media).where(eq(media.id, id))
  if (!avant) return res.status(404).json({ error: 'Média introuvable.' })

  const validation = validerMetadonnees({ ...avant, ...req.body })
  if (!validation.ok) return res.status(400).json({ erreurs: validation.erreurs })

  const [apres] = await db.update(media).set(validation.valeurs).where(eq(media.id, id)).returning()
  return res.status(200).json({ media: apres })
}

// ── Suppression ──────────────────────────────────────────────────────────

async function supprimer(req, res, utilisateur, id) {
  if (!verifierDroit(utilisateur.role, 'medias.gerer')) {
    return res.status(403).json({ error: 'Seules la Coordination et la Communication peuvent supprimer un média.' })
  }

  const [ligne] = await db.select().from(media).where(eq(media.id, id))
  if (!ligne) return res.status(404).json({ error: 'Média introuvable.' })

  // Un média repris du dépôt peut être référencé dans du code — pages
  // Ateliers, données de la tombola — que la recherche d'usages ne voit pas,
  // puisqu'elle n'interroge que la base. Refuser vaut mieux que conclure à
  // tort qu'il est libre.
  if (ligne.protege) {
    return res.status(409).json({
      error:
        "Cette image faisait partie du site avant la médiathèque. Elle peut être utilisée par des pages qui ne sont pas encore gérées ici, et sa suppression demande une vérification technique.",
    })
  }

  // Si la recherche d'usages échoue, on refuse : effacer sur la foi d'une
  // liste incomplète reviendrait à casser une page sans le savoir.
  let usages
  try {
    usages = await usagesDuMedia(ligne.chemin)
  } catch (e) {
    console.error('[medias] recherche des usages :', messageSansDonnees(e))
    return res.status(500).json({
      error: "Impossible de vérifier où cette image est utilisée. Elle n'a pas été supprimée — réessayez, et signalez-le si cela persiste.",
    })
  }

  const controle = verifierSuppression(usages)
  if (!controle.ok) return res.status(409).json({ error: controle.raison, usages })

  // Le fichier part d'abord, la ligne ensuite. Dans l'autre sens, un échec
  // GitHub laisserait un fichier orphelin dans le dépôt sans plus aucune
  // trace en base pour le retrouver.
  if (configurationComplete() && ligne.shaGithub) {
    try {
      const octokit = clientGithub()
      await effacerSurGithub(octokit, `public${ligne.chemin}`, ligne.shaGithub)
    } catch (e) {
      // 404 : le fichier n'est déjà plus là. La ligne en base n'a alors plus
      // de raison d'exister non plus, on poursuit.
      if (e.status !== 404) {
        console.error('[medias] suppression GitHub échouée :', messageSansDonnees(e))
        return res.status(502).json({ error: "Le fichier n'a pas pu être supprimé du dépôt. Réessayez dans un instant." })
      }
    }
  }

  await db.delete(media).where(eq(media.id, id))
  return res.status(200).json({ supprime: true })
}
