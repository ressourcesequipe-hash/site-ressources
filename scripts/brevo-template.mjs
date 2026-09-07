// Pousse emails/*.html dans Brevo sous forme de modèles transactionnels.
//
// Le HTML versionné dans ce dépôt est la source de vérité. Le script crée le
// modèle s'il n'existe pas, le met à jour sinon — en le retrouvant par son nom,
// jamais par un identifiant codé en dur.
//
//   BREVO_API_KEY="xkeysib-…" node scripts/brevo-template.mjs --dry-run
//   BREVO_API_KEY="xkeysib-…" node scripts/brevo-template.mjs
//
// Attention : modifier le modèle dans l'interface Brevo puis relancer ce script
// écrase les retouches. Reportez-les dans emails/ pour ne pas les perdre.
//
// Voir docs/brevo.md.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..')

const MODELES = [
  {
    fichier: 'emails/newsletter-bienvenue.html',
    nom: 'Bienvenue — lettre d\'information',
    sujet: 'Bienvenue chez Ressources — merci pour votre inscription',
    tag: 'newsletter',
    // Clé d'environnement où reporter l'identifiant renvoyé par Brevo.
    variable: 'BREVO_TEMPLATE_BIENVENUE',
  },
]

const EXPEDITEUR = { name: 'Association Ressources', email: 'contact@ressourcesrecyclerie.fr' }

const API_KEY = process.env.BREVO_API_KEY
const DRY_RUN = process.argv.includes('--dry-run')

if (!API_KEY) {
  console.error('\n  BREVO_API_KEY manquante.\n')
  console.error('    BREVO_API_KEY="xkeysib-…" node scripts/brevo-template.mjs\n')
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

// Les commentaires du fichier documentent les contraintes de l'email pour qui
// le modifie ; ils n'ont rien à faire dans le message envoyé.
function sansCommentaires(html) {
  return html.replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\n/gm, '').trim()
}

async function main() {
  const compte = await api('GET', '/account')
  console.log(`\nCompte Brevo : ${compte.companyName || '—'} (${compte.email})`)
  console.log(DRY_RUN ? 'Mode --dry-run : rien ne sera écrit.\n' : '')

  const { templates = [] } = await api('GET', '/smtp/templates?limit=100')
  const ids = {}

  for (const m of MODELES) {
    const html = sansCommentaires(readFileSync(join(RACINE, m.fichier), 'utf8'))
    const existant = templates.find((t) => t.name === m.nom)

    const corps = {
      templateName: m.nom,
      subject: m.sujet,
      sender: EXPEDITEUR,
      replyTo: EXPEDITEUR.email,
      htmlContent: html,
      isActive: true,
      tag: m.tag,
    }

    if (existant) {
      console.log(`  ${DRY_RUN ? '~' : '↻'}  « ${m.nom} » — #${existant.id}, ${DRY_RUN ? 'à mettre à jour' : 'mis à jour'} (${html.length} caractères)`)
      if (!DRY_RUN) await api('PUT', `/smtp/templates/${existant.id}`, corps)
      ids[m.variable] = existant.id
    } else {
      console.log(`  ${DRY_RUN ? '~' : '+'}  « ${m.nom} » — ${DRY_RUN ? 'à créer' : 'créé'} (${html.length} caractères)`)
      if (!DRY_RUN) {
        const nouveau = await api('POST', '/smtp/templates', corps)
        ids[m.variable] = nouveau.id
      }
    }
  }

  if (DRY_RUN) {
    console.log('\nRelancez sans --dry-run pour appliquer.\n')
    return
  }

  console.log('\nVariable(s) d\'environnement à ajouter dans Vercel :\n')
  for (const [cle, id] of Object.entries(ids)) console.log(`  ${cle} = ${id}`)
  console.log('\nSans elle, aucun email de bienvenue n\'est envoyé : les inscriptions')
  console.log('fonctionnent comme avant.\n')
}

main().catch((e) => {
  console.error(`\nÉchec : ${e.message}\n`)
  process.exit(1)
})
