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
// `drizzle-orm/neon-http/migrator` est le migrateur prévu pour ce pilote :
// il applique les instructions une à une, sans transaction, et tient à jour
// le même registre `drizzle.__drizzle_migrations`.
//
// La génération des migrations, elle, reste bien du ressort de drizzle-kit
// (`npm run db:generate`) : elle ne touche pas à la base.
//
// Usage : DATABASE_URL=... node scripts/migrer.mjs
// (la variable n'est jamais commitée — voir docs/backoffice-variables-environnement.md)

import { migrate } from 'drizzle-orm/neon-http/migrator'
import { db } from '../lib/db.js'

const DOSSIER = './db/migrations'

try {
  console.log('Application des migrations en attente depuis ' + DOSSIER + '…')
  await migrate(db, { migrationsFolder: DOSSIER })
  console.log('Terminé — la base est à jour.')
} catch (e) {
  console.error('\nÉchec de la migration : ' + e.message)
  if (String(e.message).includes('already exists')) {
    console.error(
      "\nUne table existe déjà alors que la migration correspondante n'est pas\n" +
        'consignée dans `drizzle.__drizzle_migrations`. Cela arrive quand une\n' +
        'migration a été appliquée autrement que par ce script. Il faut alors\n' +
        "consigner l'existant plutôt que de le rejouer — voir\n" +
        'docs/backoffice-etat-avancement.md (20/09/2026).'
    )
  }
  process.exitCode = 1
}
