import { defineConfig } from 'drizzle-kit'

// DATABASE_URL pointe vers la base Neon du back-office — jamais celle de
// Ressources 360 (§30 du cahier des charges, §5.2 de l'audit).
export default defineConfig({
  schema: './db/schema.js',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})
