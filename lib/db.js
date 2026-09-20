// Connexion à la base du back-office (Neon, HTTP driver — compatible
// fonctions serverless Vercel sans pool de connexions à gérer).
//
// DATABASE_URL est une variable d'environnement Vercel, jamais commitée
// (voir docs/backoffice-variables-environnement.md), sur le même modèle que
// BREVO_API_KEY aujourd'hui (lib/brevo.js).

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../db/schema.js'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL manquante — voir docs/backoffice-variables-environnement.md')
}

const sql = neon(process.env.DATABASE_URL)

export const db = drizzle(sql, { schema })
