/**
 * Initialise les permissions par rubrique du module Demandes — §5 de
 * l'architecture technique.
 *
 * Idempotent : n'insère que ce qui manque, ne modifie jamais une ligne déjà
 * présente (une modification faite depuis l'écran de permissions ne doit
 * jamais être écrasée par un redéploiement).
 *
 * Super administrateur et Coordination ne sont volontairement PAS insérés
 * ici : leur accès complet est garanti par le code (lib/permissions.js),
 * pas par cette table.
 *
 * Usage : DATABASE_URL="postgres://…" node scripts/seed-permissions.mjs
 */
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { and, eq } from 'drizzle-orm'
import * as schema from '../db/schema.js'

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL manquante.')
  process.exit(1)
}

const db = drizzle(neon(process.env.DATABASE_URL), { schema })

// Décision transmise le 19/09/2026 : Communication a initialement accès à
// « Événements et ateliers » et « Partenariats ». Les autres rubriques
// pourront lui être ouvertes plus tard depuis l'écran de permissions, sans
// modification du code ni de ce script.
const PERMISSIONS_INITIALES = [
  { role: 'communication', rubriqueCle: 'evenement_atelier', peutConsulter: true, peutRepondre: true },
  { role: 'communication', rubriqueCle: 'partenariat', peutConsulter: true, peutRepondre: true },
]

async function main() {
  let crees = 0
  for (const permission of PERMISSIONS_INITIALES) {
    const existantes = await db
      .select()
      .from(schema.rubriquePermission)
      .where(
        and(
          eq(schema.rubriquePermission.role, permission.role),
          eq(schema.rubriquePermission.rubriqueCle, permission.rubriqueCle)
        )
      )
    if (existantes.length > 0) continue
    await db.insert(schema.rubriquePermission).values(permission)
    crees++
  }
  console.log(`[seed-permissions] ${crees} permission(s) créée(s), ${PERMISSIONS_INITIALES.length - crees} déjà présente(s).`)
}

main().catch((e) => {
  console.error('[seed-permissions] Erreur :', e)
  process.exit(1)
})
