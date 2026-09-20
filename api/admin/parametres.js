// Paramètres généraux — §17 du cahier des charges, Étape 1 (socle).
//
// Singleton : une seule ligne (id=1), créée à la première lecture si elle
// n'existe pas encore. Une modification ici doit se propager partout où
// l'information apparaît sur le site public — ce endpoint ne fait que la
// lire/écrire ; la propagation réelle passe par la publication (§2), qui
// arrive avec le branchement du site public (Étape 4).

import { eq } from 'drizzle-orm'
import { auth } from '../../lib/auth.js'
import { fromNodeHeaders } from 'better-auth/node'
import { db } from '../../lib/db.js'
import { parametresSite } from '../../db/schema.js'
import { verifierDroit } from '../../lib/permissions.js'

const CHAMPS_MODIFIABLES = [
  'nomAssociation',
  'logo',
  'favicon',
  'adresse',
  'telephone',
  'emailGeneral',
  'emailPresse',
  'siret',
  'facebook',
  'instagram',
  'linkedin',
  'lienDon',
  'lienNewsletter',
]

async function lireOuCreerParametres() {
  const [ligne] = await db.select().from(parametresSite).where(eq(parametresSite.id, 1))
  if (ligne) return ligne
  const [creee] = await db.insert(parametresSite).values({ id: 1 }).returning()
  return creee
}

export default async function handler(req, res) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
  if (!session) return res.status(401).json({ error: 'Non authentifié' })

  if (req.method === 'GET') {
    const parametres = await lireOuCreerParametres()
    return res.status(200).json({ parametres })
  }

  if (req.method === 'PUT') {
    if (!verifierDroit(session.user.role, 'parametres.gerer')) {
      return res.status(403).json({ error: 'Droits insuffisants' })
    }

    const misesAJour = {}
    for (const champ of CHAMPS_MODIFIABLES) {
      if (champ in (req.body || {})) misesAJour[champ] = req.body[champ]
    }
    misesAJour.majLe = new Date()

    await lireOuCreerParametres() // garantit que la ligne 1 existe avant l'update
    const [parametres] = await db
      .update(parametresSite)
      .set(misesAJour)
      .where(eq(parametresSite.id, 1))
      .returning()

    return res.status(200).json({ ok: true, parametres })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
