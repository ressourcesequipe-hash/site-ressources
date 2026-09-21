// Catégories d'ateliers — §11 du cahier des charges.
//
// « Les catégories doivent être administrables et non codées en dur. »
// C'est la seule liste du projet dans ce cas, d'où cette route dédiée.
//
// Elle n'utilise pas la fabrique des modules de contenu : une catégorie
// n'est pas un contenu publié. Elle n'a ni statut de publication, ni
// brouillon, ni historique de versions — seulement un libellé, un ordre et
// un interrupteur.
//
// Retirer une catégorie ne la supprime pas : elle est désactivée. Une
// suppression pure laisserait des fiches d'atelier pointant vers une
// catégorie disparue, et surtout ferait perdre l'information sans moyen de
// revenir en arrière (§24.7).

import { asc, eq } from 'drizzle-orm'
import { auth } from '../../lib/auth.js'
import { fromNodeHeaders } from 'better-auth/node'
import { db } from '../../lib/db.js'
import { atelier, categorieAtelier } from '../../db/schema.js'
import { verifierDroit } from '../../lib/permissions.js'
import { slugifier } from '../../lib/contenus.js'
import { CATEGORIES_INITIALES, validerCategorie } from '../../lib/ateliers.js'

async function listerToutes() {
  return db.select().from(categorieAtelier).orderBy(asc(categorieAtelier.ordre), asc(categorieAtelier.libelle))
}

async function cleDisponible(base) {
  const racine = base || 'categorie'
  for (let suffixe = 0; suffixe < 50; suffixe++) {
    const candidat = suffixe === 0 ? racine : `${racine}-${suffixe + 1}`
    const [existante] = await db.select({ id: categorieAtelier.id }).from(categorieAtelier).where(eq(categorieAtelier.cle, candidat))
    if (!existante) return candidat
  }
  return `${racine}-${Date.now()}`
}

export default async function handler(req, res) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
  if (!session) return res.status(401).json({ error: 'Non authentifié' })
  const peutGerer = verifierDroit(session.user.role, 'ateliers.gerer')

  if (req.method === 'GET') {
    let categories = await listerToutes()

    // Amorçage à la première consultation : la base part avec les exemples
    // cités par le §11, que l'équipe peut ensuite renommer ou compléter.
    // Sans cela, le premier atelier ne pourrait être rangé nulle part.
    if (categories.length === 0) {
      await db.insert(categorieAtelier).values(CATEGORIES_INITIALES)
      categories = await listerToutes()
    }

    // Nombre d'ateliers par catégorie : sans lui, on désactiverait une
    // catégorie sans savoir ce qu'on déplace.
    const ateliers = await db.select({ categories: atelier.categories }).from(atelier)
    const usage = {}
    for (const a of ateliers) {
      for (const cle of Array.isArray(a.categories) ? a.categories : []) {
        usage[cle] = (usage[cle] || 0) + 1
      }
    }

    return res.status(200).json({ categories: categories.map((c) => ({ ...c, nbAteliers: usage[c.cle] || 0 })) })
  }

  if (!peutGerer) return res.status(403).json({ error: 'Droits insuffisants' })

  if (req.method === 'POST') {
    const erreurs = validerCategorie(req.body || {})
    if (erreurs.length) return res.status(400).json({ erreurs })

    const cle = await cleDisponible(slugifier(req.body.libelle))
    const [creee] = await db
      .insert(categorieAtelier)
      .values({
        cle,
        libelle: String(req.body.libelle).trim(),
        ordre: Number(req.body.ordre) || 0,
        actif: req.body.actif !== false,
      })
      .returning()
    return res.status(201).json({ categorie: creee })
  }

  if (req.method === 'PUT') {
    const id = Number(req.body?.id)
    if (!id) return res.status(400).json({ error: 'Identifiant manquant' })

    const erreurs = validerCategorie(req.body || {})
    if (erreurs.length) return res.status(400).json({ erreurs })

    // `cle` n'est jamais modifiée : c'est elle qui relie les fiches
    // d'ateliers à leur catégorie. Renommer un libellé est sans risque,
    // changer la clé casserait les rattachements existants.
    const [modifiee] = await db
      .update(categorieAtelier)
      .set({
        libelle: String(req.body.libelle).trim(),
        ordre: Number(req.body.ordre) || 0,
        actif: req.body.actif !== false,
      })
      .where(eq(categorieAtelier.id, id))
      .returning()

    if (!modifiee) return res.status(404).json({ error: 'Catégorie introuvable' })
    return res.status(200).json({ categorie: modifiee })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
