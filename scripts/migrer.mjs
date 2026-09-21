// Applique les migrations en attente sur la base du back-office.
//
// Pourquoi ce script plutôt que `drizzle-kit migrate` : le projet utilise le
// pilote HTTP de Neon (`@neondatabase/serverless` + `drizzle-orm/neon-http`),
// choisi parce qu'il fonctionne dans une fonction serverless Vercel sans pool
// de connexions à gérer (voir lib/db.js). Or `drizzle-kit migrate` enveloppe
// les migrations dans une transaction, ce que ce pilote ne sait pas faire —
// il échoue avec « can only connect to remote instances through a websocket ».
// Constaté en conditions réelles le 20/09/2026.
//
// La génération des migrations reste du ressort de drizzle-kit
// (`npm run db:generate`) : elle ne touche pas à la base.
//
// ── DEUX BASES, DEUX COMMANDES ──────────────────────────────────────────
//
//   npm run db:migrate         → branche `dev`, celle de DATABASE_URL
//   npm run db:migrate:prod    → production, celle de DATABASE_URL_PROD
//
// Cette séparation remplace une manipulation qui consistait à échanger les
// deux chaînes dans `.env.local` avant et après chaque migration. Elle avait
// un défaut sérieux : pendant toute la fenêtre où la production était
// active, TOUT script lancé écrivait dans les vraies données — y compris les
// suites de test, qui créent et suppriment des comptes. Un oubli de
// rebascule suffisait.
//
// Désormais `.env.local` pointe en permanence sur `dev`, et atteindre la
// production demande un drapeau explicite sur cette seule commande.
//
// Usage : node --env-file=.env.local scripts/migrer.mjs [--production]

import { readFileSync } from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'
import { sql } from 'drizzle-orm'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const DOSSIER = './db/migrations'

const versProduction = process.argv.includes('--production')
const variable = versProduction ? 'DATABASE_URL_PROD' : 'DATABASE_URL'
const chaine = process.env[variable]

if (!chaine) {
  console.error(
    `\n${variable} absente.\n` +
      (versProduction
        ? "Ajoutez la chaîne de production dans .env.local sous ce nom, sans remplacer DATABASE_URL.\n"
        : 'Voir docs/backoffice-variables-environnement.md.\n')
  )
  process.exit(1)
}

const base = drizzle(neon(chaine))

// Confirmer sur quelle branche Neon on écrit AVANT d'écrire. Les deux
// chaînes se ressemblent trop pour être distinguées à l'œil, et au moment
// où une branche vient d'être créée les données sont identiques — comparer
// leur contenu ne prouverait rien.
let branche = '(inconnue)'
try {
  const r = await base.execute(sql`select current_setting('neon.branch_id', true) as b`)
  branche = (r.rows ?? r)[0]?.b ?? '(non exposée)'
} catch {
  // Une base qui n'est pas Neon n'expose pas ce réglage : ce n'est pas une
  // raison d'échouer, seulement de ne pas pouvoir l'afficher.
}

// Les migrations en attente, nommées avant d'être appliquées : voir passer
// « 3 migrations appliquées » sans savoir lesquelles n'apprend rien.
let enAttente = []
try {
  const journal = JSON.parse(readFileSync(path.join(__dirname, '..', 'db', 'migrations', 'meta', '_journal.json'), 'utf-8'))
  const dejaLa = await base
    .execute(sql`select count(*)::int as n from drizzle.__drizzle_migrations`)
    .then((r) => Number((r.rows ?? r)[0]?.n ?? 0))
    .catch(() => 0)
  enAttente = journal.entries.slice(dejaLa).map((e) => e.tag)
} catch {
  // Registre absent (première migration) : on applique tout.
}

console.log(`\nCible    : ${versProduction ? 'PRODUCTION' : 'développement'} (${variable})`)
console.log(`Branche  : ${branche}`)
console.log(`En attente : ${enAttente.length ? enAttente.join(', ') : 'aucune migration nouvelle'}\n`)

try {
  await migrate(base, { migrationsFolder: DOSSIER })
  console.log('Terminé — la base est à jour.')
} catch (e) {
  console.error('\nMigration interrompue :', e.message)
  console.error('La base est restée dans l’état où la dernière instruction l’a laissée.')
  process.exit(1)
}
