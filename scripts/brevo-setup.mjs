// Prépare le compte Brevo pour les formulaires du site.
//
// Les listes de contacts sont gérées à la main dans Brevo : ce script ne les
// crée pas, il vérifie qu'elles existent et relève leur identifiant. Il crée en
// revanche les attributs de contact déclarés dans lib/brevo.js, et affiche à la
// fin la ligne BREVO_LISTS à coller dans les variables d'environnement Vercel.
//
// Idempotent : il ne crée que ce qui manque, ne renomme rien, ne supprime
// jamais. On peut le relancer autant de fois que nécessaire.
//
//   BREVO_API_KEY="xkeysib-…" node scripts/brevo-setup.mjs --dry-run
//   BREVO_API_KEY="xkeysib-…" node scripts/brevo-setup.mjs
//
// Voir docs/brevo.md.

import { LISTES, ATTRIBUTS } from '../lib/brevo.js'

const API_KEY = process.env.BREVO_API_KEY
const DRY_RUN = process.argv.includes('--dry-run')

if (!API_KEY) {
  console.error('\n  BREVO_API_KEY manquante.\n')
  console.error('  Créez une clé API dans Brevo : Paramètres → Clés API → Générer une nouvelle clé,')
  console.error('  puis relancez :\n')
  console.error('    BREVO_API_KEY="xkeysib-…" node scripts/brevo-setup.mjs\n')
  process.exit(1)
}

async function api(methode, chemin, payload) {
  const r = await fetch(`https://api.brevo.com/v3${chemin}`, {
    method: methode,
    headers: {
      'api-key': API_KEY,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: payload ? JSON.stringify(payload) : undefined,
  })
  const texte = await r.text()
  if (!r.ok) throw new Error(`${methode} ${chemin} → HTTP ${r.status} ${texte}`)
  return texte ? JSON.parse(texte) : {}
}

// Parcourt un endpoint paginé jusqu'au bout.
async function tout(chemin, cle) {
  const items = []
  let offset = 0
  for (;;) {
    const sep = chemin.includes('?') ? '&' : '?'
    const page = await api('GET', `${chemin}${sep}limit=50&offset=${offset}`)
    const lot = page[cle] || []
    items.push(...lot)
    if (lot.length < 50) return items
    offset += 50
  }
}

async function main() {
  const compte = await api('GET', '/account')
  console.log(`\nCompte Brevo : ${compte.companyName || '-'} (${compte.email})`)
  console.log(DRY_RUN ? 'Mode --dry-run : rien ne sera écrit.\n' : '')

  // 1. Les listes existent-elles ? Le script ne les crée pas : elles sont
  //    gérées à la main dans Brevo, avec leur propre convention de nommage.
  console.log('Listes (vérification seule, aucune création)')
  const listesBrevo = await tout('/contacts/lists', 'lists')
  const ids = {}
  const manquantes = []
  for (const [cle, def] of Object.entries(LISTES)) {
    const trouvee = listesBrevo.find((l) => l.name === def.nom)
    if (trouvee) {
      ids[cle] = trouvee.id
      console.log(`  ·  « ${def.nom} » - #${trouvee.id}, ${trouvee.totalSubscribers} contacts`)
    } else {
      manquantes.push(def.nom)
      console.log(`  !  « ${def.nom} » - INTROUVABLE`)
    }
  }

  if (manquantes.length) {
    console.error('\nListes introuvables dans ce compte :')
    manquantes.forEach((n) => console.error(`  · ${n}`))
    console.error('\nCréez-les dans Brevo avec ce nom exact (accents et espaces compris),')
    console.error('ou corrigez le nom attendu dans lib/brevo.js. Puis relancez.\n')
    process.exit(1)
  }

  // 2. Les attributs personnalisés, eux, sont créés s'ils manquent.
  console.log('\nAttributs')
  const { attributes = [] } = await api('GET', '/contacts/attributes')
  const nomsExistants = new Set(attributes.map((a) => a.name))
  let crees = 0
  for (const [nom, type] of Object.entries(ATTRIBUTS)) {
    if (nomsExistants.has(nom)) {
      console.log(`  ·  « ${nom} » - déjà présent`)
      continue
    }
    crees++
    console.log(`  ${DRY_RUN ? '~' : '+'}  « ${nom} » - ${DRY_RUN ? 'à créer' : 'créé'}`)
    if (!DRY_RUN) await api('POST', `/contacts/attributes/normal/${nom}`, { type })
  }

  // Un compte configuré en anglais possède FIRSTNAME/LASTNAME au lieu de
  // PRENOM/NOM. Le site écrit dans PRENOM/NOM : autant le signaler.
  if (nomsExistants.has('FIRSTNAME') || nomsExistants.has('LASTNAME')) {
    console.log('\n  ! Le compte possède aussi FIRSTNAME/LASTNAME. Le site remplit')
    console.log('    PRENOM/NOM : utilisez ces derniers dans vos campagnes.')
  }

  console.log(`\n${'─'.repeat(64)}`)
  console.log(`${Object.keys(LISTES).length} listes en place, ${crees} attribut(s) ${DRY_RUN ? 'à créer' : 'créé(s)'}.`)

  if (DRY_RUN) {
    console.log('\nRelancez sans --dry-run pour appliquer.\n')
    return
  }

  console.log('\nVariable d\'environnement à ajouter dans Vercel')
  console.log('(Settings → Environment Variables, pour Production et Preview) :\n')
  console.log('  BREVO_LISTS')
  console.log(`  ${JSON.stringify(ids)}\n`)
  console.log('Tant que cette variable est absente, les formulaires continuent de')
  console.log('notifier l\'équipe par email sans rien écrire dans Brevo.\n')
}

main().catch((e) => {
  console.error(`\nÉchec : ${e.message}\n`)
  process.exit(1)
})
