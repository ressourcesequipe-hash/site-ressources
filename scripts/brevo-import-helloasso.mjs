// Importe un export de billetterie HelloAsso dans la liste 005 - Tombola.
//
//   BREVO_API_KEY="xkeysib-…" node scripts/brevo-import-helloasso.mjs <fichier.csv> --dry-run
//   BREVO_API_KEY="xkeysib-…" node scripts/brevo-import-helloasso.mjs <fichier.csv>
//
// Relançable après chaque nouvel export : les contacts déjà présents sont mis à
// jour, pas dupliqués.
//
// ⚠️ Ces gens ont acheté un billet, ils n'ont pas demandé la lettre
// d'information - l'export HelloAsso ne comporte d'ailleurs aucune colonne de
// consentement. Ils vont donc dans 005 - Tombola et **jamais** dans
// 001-NEWSLETTERS. Leur écrire au sujet de la tombola est légitime, cela
// concerne leur propre participation ; les basculer dans la lettre générale ne
// le serait pas.
//
// Voir docs/brevo.md.

import { readFileSync } from 'node:fs'
import { LISTES } from '../lib/brevo.js'

const API_KEY = process.env.BREVO_API_KEY
const DRY_RUN = process.argv.includes('--dry-run')
const FICHIER = process.argv.slice(2).find((a) => !a.startsWith('--'))

if (!API_KEY || !FICHIER) {
  console.error('\n  Usage : BREVO_API_KEY="xkeysib-…" node scripts/brevo-import-helloasso.mjs <fichier.csv> [--dry-run]\n')
  process.exit(1)
}

async function api(methode, chemin, payload) {
  const r = await fetch(`https://api.brevo.com/v3${chemin}`, {
    method: methode,
    headers: { 'api-key': API_KEY, 'Content-Type': 'application/json', accept: 'application/json' },
    body: payload ? JSON.stringify(payload) : undefined,
  })
  const texte = await r.text()
  return { ok: r.ok, status: r.status, corps: texte ? JSON.parse(texte) : {} }
}

// HelloAsso exporte en UTF-8 avec BOM, separateur point-virgule.
function lireCsv(chemin) {
  let t = readFileSync(chemin, 'utf8')
  if (t.charCodeAt(0) === 0xfeff) t = t.slice(1)
  const lignes = t.split(/\r?\n/).filter((l) => l.trim())
  const entete = lignes[0].split(';').map((h) => h.trim())
  return lignes.slice(1).map((l) => {
    const c = l.split(';')
    return Object.fromEntries(entete.map((h, i) => [h, (c[i] || '').trim()]))
  })
}

const propre = (v) => (v || '').trim()
const normEmail = (v) => propre(v).toLowerCase()
const valide = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)

async function main() {
  const compte = await api('GET', '/account')
  console.log(`\nCompte Brevo : ${compte.corps.companyName} (${compte.corps.email})`)
  console.log(DRY_RUN ? 'Mode --dry-run : rien ne sera écrit.\n' : '')

  const listes = (await api('GET', '/contacts/lists?limit=50')).corps.lists || []
  const cible = listes.find((l) => l.name === LISTES.tombola.nom)
  if (!cible) {
    console.error(`\nListe « ${LISTES.tombola.nom} » introuvable.\n`)
    process.exit(1)
  }
  console.log(`Liste cible : « ${cible.name} » (#${cible.id})`)

  const rows = lireCsv(FICHIER)
  const valides = rows.filter((r) => propre(r['Statut de la commande']) === 'Validé')
  console.log(`\nFichier : ${rows.length} ligne(s), ${valides.length} commande(s) validée(s)`)

  // Une ligne par billet : on regroupe par adresse. L'email du payeur porte
  // l'identité du payeur, celui du participant l'identité du participant.
  const contacts = new Map()
  const ajoute = (email, prenom, nom, tel, commune) => {
    const e = normEmail(email)
    if (!e || !valide(e)) return
    const dejaVu = contacts.get(e) || { email: e, billets: 0 }
    contacts.set(e, {
      email: e,
      // Le premier nom rencontré fait foi ; les suivants ne l'écrasent pas.
      PRENOM: dejaVu.PRENOM || propre(prenom),
      NOM: dejaVu.NOM || propre(nom),
      TELEPHONE: dejaVu.TELEPHONE || propre(tel),
      COMMUNE: dejaVu.COMMUNE || propre(commune),
      billets: dejaVu.billets + 1,
    })
  }

  for (const r of valides) {
    ajoute(r['Email payeur'], r['Prénom payeur'], r['Nom payeur'], r['Téléphone'], r['Commune'])
    ajoute(r['Adresse email'], r['Prénom participant'], r['Nom participant'], r['Téléphone'], r['Commune'])
  }

  console.log(`Adresses distinctes : ${contacts.size}`)

  // Qui existe déjà ? La réponse change ce qu'on a le droit d'écrire.
  const existants = new Set()
  for (const e of contacts.keys()) {
    const r = await api('GET', `/contacts/${encodeURIComponent(e)}`)
    if (r.ok) existants.add(e)
  }
  console.log(`  déjà connus de Brevo : ${existants.size}`)
  console.log(`  nouveaux             : ${contacts.size - existants.size}`)

  const aujourdhui = new Date().toISOString().slice(0, 10)
  let crees = 0, majs = 0, echecs = 0

  for (const c of contacts.values()) {
    const deja = existants.has(c.email)

    const attributes = {}
    for (const k of ['PRENOM', 'NOM', 'TELEPHONE', 'COMMUNE']) if (c[k]) attributes[k] = c[k]
    attributes.DATE_DERNIER_CONTACT = aujourdhui

    // SOURCE et OPTIN_NEWSLETTER ne sont écrits que pour un contact inconnu.
    // Sur quelqu'un qui existe déjà, les réécrire effacerait sa provenance
    // réelle et, pire, remettrait son consentement à `false` alors qu'il a
    // peut-être demandé la lettre d'information par ailleurs.
    if (!deja) {
      attributes.SOURCE = 'Tombola HelloAsso'
      attributes.OPTIN_NEWSLETTER = false
    }

    if (DRY_RUN) {
      console.log(`  ~  ${deja ? 'màj  ' : 'créer'} ${c.email.padEnd(38)} ${c.billets} billet(s)`)
      deja ? majs++ : crees++
      continue
    }

    // `emailBlacklisted` n'est jamais envoyé : un désabonné le reste.
    const r = await api('POST', '/contacts', {
      email: c.email,
      attributes,
      listIds: [cible.id],
      updateEnabled: true,
    })
    if (!r.ok) {
      echecs++
      console.log(`  !  ÉCHEC ${c.email} - HTTP ${r.status} ${JSON.stringify(r.corps)}`)
    } else {
      deja ? majs++ : crees++
    }
  }

  console.log(`\n${'─'.repeat(56)}`)
  console.log(`${crees} création(s), ${majs} mise(s) à jour${echecs ? `, ${echecs} échec(s)` : ''}.`)
  console.log(DRY_RUN ? '\nRelancez sans --dry-run pour appliquer.\n' : '\nAucun contact n\'a été ajouté à 001-NEWSLETTERS.\n')
}

main().catch((e) => {
  console.error(`\nÉchec : ${e.message}\n`)
  process.exit(1)
})
