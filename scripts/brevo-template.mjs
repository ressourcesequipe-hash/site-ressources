// Pousse emails/*.html dans Brevo sous forme de modèles transactionnels.
//
// Le HTML versionné dans ce dépôt est la source de vérité. Le script crée le
// modèle s'il n'existe pas, le met à jour sinon - en le retrouvant par son nom,
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
import { LISTES } from '../lib/brevo.js'

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..')

const MODELES = [
  {
    fichier: 'emails/newsletter-bienvenue.html',
    nom: 'Bienvenue - lettre d\'information',
    sujet: 'Bienvenue chez Ressources - merci pour votre inscription',
    tag: 'newsletter',
  },
]

// Campagnes marketing, créées et laissées **en brouillon**. Le script ne les
// envoie ni ne les programme : c'est une décision humaine, prise dans Brevo
// après relecture. Une campagne déjà envoyée n'est jamais modifiée.
const CAMPAGNES = [
  {
    fichier: 'emails/tombola-defi-collecte.html',
    nom: 'Challenge de la demi-tonne & tombola solidaire',
    sujet: '500 kg à réunir, 38 lots à gagner - rendez-vous le 3 octobre',
    // Clé de LISTES (lib/brevo.js) dont les abonnés recevront la campagne.
    liste: 'newsletter',
  },
  {
    fichier: 'emails/tombola-merci-participants.html',
    nom: 'Tombola - merci aux participants',
    sujet: 'Merci pour votre billet - et un service à vous demander',
    // 005 - Tombola, et surtout pas la lettre d'information : acheter un
    // billet n'est pas consentir à recevoir la newsletter.
    liste: 'tombola',
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
  console.log(`\nCompte Brevo : ${compte.companyName || '-'} (${compte.email})`)
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
      console.log(`  ${DRY_RUN ? '~' : '↻'}  « ${m.nom} » - #${existant.id}, ${DRY_RUN ? 'à mettre à jour' : 'mis à jour'} (${html.length} caractères)`)
      if (!DRY_RUN) await api('PUT', `/smtp/templates/${existant.id}`, corps)
      ids[m.nom] = existant.id
    } else {
      console.log(`  ${DRY_RUN ? '~' : '+'}  « ${m.nom} » - ${DRY_RUN ? 'à créer' : 'créé'} (${html.length} caractères)`)
      if (!DRY_RUN) {
        const nouveau = await api('POST', '/smtp/templates', corps)
        ids[m.nom] = nouveau.id
      }
    }
  }

  // ── Campagnes ──────────────────────────────────────────────────────────
  if (CAMPAGNES.length) {
    console.log('\nCampagnes (laissées en brouillon)')

    const listes = []
    for (let offset = 0; ; offset += 50) {
      const page = await api('GET', `/contacts/lists?limit=50&offset=${offset}`)
      listes.push(...(page.lists || []))
      if ((page.lists || []).length < 50) break
    }

    const { campaigns = [] } = await api('GET', '/emailCampaigns?limit=100')

    for (const c of CAMPAGNES) {
      const html = sansCommentaires(readFileSync(join(RACINE, c.fichier), 'utf8'))
      const nomListe = LISTES[c.liste]?.nom
      const liste = listes.find((l) => l.name === nomListe)
      if (!liste) {
        console.log(`  !  « ${c.nom} » - liste « ${nomListe} » introuvable, ignorée`)
        continue
      }

      const existante = campaigns.find((x) => x.name === c.nom)

      // Une campagne partie ne se retouche pas : on ne réécrit jamais ce que
      // des gens ont déjà reçu.
      if (existante && existante.status !== 'draft') {
        console.log(`  ·  « ${c.nom} » - #${existante.id}, statut « ${existante.status} », laissée intacte`)
        continue
      }

      const corps = {
        name: c.nom,
        subject: c.sujet,
        sender: EXPEDITEUR,
        replyTo: EXPEDITEUR.email,
        htmlContent: html,
        recipients: { listIds: [liste.id] },
        inlineImageActivation: false,
        // Pas de `tag` : le plan gratuit le refuse sur les campagnes
        // (« You are not allowed to avail tag option for your campaign »).
        // Ni `scheduledAt` ni envoi : la campagne reste un brouillon.
      }

      // L'appel précède le message, sinon un échec laisserait à l'écran un
      // « créé » qui n'a pas eu lieu.
      if (existante) {
        if (!DRY_RUN) await api('PUT', `/emailCampaigns/${existante.id}`, corps)
        console.log(`  ${DRY_RUN ? '~' : '↻'}  « ${c.nom} » - #${existante.id}, brouillon ${DRY_RUN ? 'à mettre à jour' : 'mis à jour'} → ${nomListe} (${html.length} caractères)`)
      } else {
        const cree = DRY_RUN ? null : await api('POST', '/emailCampaigns', corps)
        console.log(`  ${DRY_RUN ? '~' : '+'}  « ${c.nom} »${cree ? ' - #' + cree.id : ''} - brouillon ${DRY_RUN ? 'à créer' : 'créé'} → ${nomListe} (${html.length} caractères)`)
      }
    }
  }

  if (DRY_RUN) {
    console.log('\nRelancez sans --dry-run pour appliquer.\n')
    return
  }

  console.log('\nLes campagnes sont des brouillons : rien n\'est envoyé tant que')
  console.log('vous ne cliquez pas « Envoyer » dans Brevo.')

  console.log('\nModèles disponibles dans Brevo :\n')
  for (const [nom, id] of Object.entries(ids)) console.log(`  #${id}  ${nom}`)
  console.log('\nAucune variable d\'environnement à reporter : ces modèles sont')
  console.log('choisis depuis Brevo, dans un scénario ou une campagne. Le site')
  console.log('ne les envoie pas lui-même. Voir docs/brevo.md.\n')
}

main().catch((e) => {
  console.error(`\nÉchec : ${e.message}\n`)
  process.exit(1)
})
