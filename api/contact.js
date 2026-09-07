import { FORMULAIRES, SOURCES, listesDe } from '../lib/brevo.js'

const BREVO_API_KEY = process.env.BREVO_API_KEY
const DEST_EMAIL = 'contact@ressourcesrecyclerie.fr'
const SENDER = { name: 'Site Ressources', email: 'contact@ressourcesrecyclerie.fr' }

// Identifiants des listes Brevo, produits par `npm run brevo:setup` et collés
// dans la variable d'environnement BREVO_LISTS sous forme de JSON :
//   {"contacts":12,"newsletter":13,…}
// Tant que la variable est absente, le site fonctionne comme avant : les
// formulaires notifient l'équipe par email, sans écrire dans Brevo.
const LIST_IDS = (() => {
  if (!process.env.BREVO_LISTS) return null
  try {
    return JSON.parse(process.env.BREVO_LISTS)
  } catch (e) {
    console.error('BREVO_LISTS illisible (JSON invalide) :', e.message)
    return null
  }
})()

// Double opt-in : renseigner ces deux variables active la confirmation par
// email avant toute inscription à la newsletter. Voir docs/brevo.md.
const DOI_TEMPLATE_ID = Number(process.env.BREVO_DOI_TEMPLATE_ID) || null
const DOI_REDIRECT_URL = process.env.BREVO_DOI_REDIRECT_URL || null

// Email de bienvenue envoyé à qui rejoint la lettre d'information. Son modèle
// est produit par `npm run brevo:template` depuis emails/newsletter-bienvenue.html.
// Variable absente : aucun email de bienvenue, le reste fonctionne à l'identique.
const TEMPLATE_BIENVENUE = Number(process.env.BREVO_TEMPLATE_BIENVENUE) || null

const templates = {
  newsletter: (d) => ({
    subject: '📬 Nouvelle inscription newsletter — Ressources',
    html: row('Inscription newsletter', [['Email', d.email]]),
  }),
  rejoindre: (d) => ({
    subject: '✉️ Nouveau message — Prendre contact',
    html: row('Prendre contact', [
      ['Nom', d.nom], ['Email', d.email], ['Commune', d.commune || '—'],
      ['Engagement souhaité', d.engagement || '—'], ['Message', d.message || '—'],
    ]),
  }),
  benevole: (d) => ({
    subject: '🙋 Nouvelle candidature bénévole — Ressources',
    html: row('Inscription bénévole', [
      ['Nom', d.nom], ['Email', d.email], ['Téléphone', d.telephone || '—'],
      ['Commune', d.commune || '—'], ['Mission souhaitée', d.mission || '—'],
      ['Message', d.message || '—'],
    ]),
  }),
  donMateriel: (d) => ({
    subject: "📦 Demande d'enlèvement matériel — Ressources",
    html: row("Demande d'enlèvement", [
      ['Nom', d.nom], ['Téléphone', d.telephone], ['Email', d.email],
      ['Adresse', d.adresse], ['Matériel', d.materiel],
    ]),
  }),
  evenement: (d) => ({
    subject: '🎟️ Nouvelle inscription événement — Ressources',
    html: row('Inscription événement', [
      ['Prénom', d.prenom], ['Nom', d.nom], ['Email', d.email],
      ['Commune', d.commune || '—'], ['Message', d.message || '—'],
    ]),
  }),
  pointCollecte: (d) => ({
    subject: '📍 Candidature point de collecte — Ressources',
    html: row('Nouveau point de collecte proposé', [
      ['Structure', d.structure], ['Nom du contact', d.nom],
      ['Email', d.email], ['Téléphone', d.telephone || '—'],
      ['Commune', d.commune], ['Type de structure', d.typeStructure || '—'],
      ['Message', d.message || '—'],
    ]),
  }),
  partenaireVegetal: (d) => ({
    subject: '🌿 Nouveau partenaire végétal — Ressources',
    html: row('Proposition de partenariat végétal', [
      ['Structure', d.structure], ['Nom du contact', d.contact],
      ['Email', d.email], ['Commune', d.commune],
      ['Partenariat envisagé', d.partenariat || '—'],
    ]),
  }),
  contact: (d) => ({
    subject: `📩 Nouveau message — ${d.sujet || 'Contact général'}`,
    html: row('Message de contact', [
      ['Nom', d.nom], ['Email', d.email], ['Téléphone', d.telephone || '—'],
      ['Sujet', d.sujet || '—'], ['Message', d.message],
    ]),
  }),
}

// Les valeurs viennent d'un formulaire public : elles sont échappées avant
// d'entrer dans le HTML de l'email, sinon un chevron suffit à casser le rendu
// dans la boîte de l'équipe.
function esc(val) {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function row(title, fields) {
  const rows = fields
    .map(([label, val]) => `<tr><td style="padding:6px 12px;color:#666;width:160px">${esc(label)}</td><td style="padding:6px 12px;color:#222">${esc(val).replace(/\n/g, '<br>')}</td></tr>`)
    .join('')
  return `<div style="font-family:sans-serif;max-width:560px;margin:0 auto">
    <h2 style="background:#5a6b3a;color:#fff;padding:16px 20px;margin:0;font-size:16px">${esc(title)} — Ressources Landes</h2>
    <table style="width:100%;border-collapse:collapse;border:1px solid #e5e0d5">${rows}</table>
    <p style="color:#aaa;font-size:11px;padding:12px">Message automatique — site ressourcesrecyclerie.fr</p>
  </div>`
}

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => {
      try { resolve(JSON.parse(data)) } catch (e) { reject(e) }
    })
    req.on('error', reject)
  })
}

function brevo(chemin, payload) {
  return fetch(`https://api.brevo.com/v3${chemin}`, {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

function brevoGet(chemin) {
  return fetch(`https://api.brevo.com/v3${chemin}`, {
    headers: { 'api-key': BREVO_API_KEY, accept: 'application/json' },
  })
}

// La personne figure-t-elle déjà dans la liste de diffusion ? Interrogé avant
// l'upsert, sans quoi la réponse serait toujours « oui » : c'est ce qui évite
// de renvoyer l'email de bienvenue à quelqu'un qui remplit un second
// formulaire. Un doute quelconque — contact inconnu, appel en échec — répond
// « non » : mieux vaut un message de trop qu'un abonné jamais accueilli.
async function dejaDansLaListe(email, idListe) {
  if (!Number.isInteger(idListe)) return false
  try {
    const r = await brevoGet(`/contacts/${encodeURIComponent(email)}`)
    if (!r.ok) return false
    const c = await r.json()
    return Array.isArray(c.listIds) && c.listIds.includes(idListe)
  } catch {
    return false
  }
}

// Retire les champs vides et rogne les valeurs trop longues : Brevo refuse le
// contact entier si un attribut texte dépasse sa limite, et une adresse ou une
// mission saisies librement peuvent être bavardes.
function nettoyerAttributs(attrs) {
  const out = {}
  for (const [cle, val] of Object.entries(attrs)) {
    if (val === undefined || val === null) continue
    if (typeof val === 'string') {
      const v = val.trim()
      if (!v) continue
      out[cle] = v.length > 250 ? v.slice(0, 247) + '…' : v
    } else {
      out[cle] = val
    }
  }
  return out
}

// Crée ou met à jour le contact dans Brevo et l'inscrit aux bonnes listes.
//
// Deux règles tiennent le RGPD :
//   — `emailBlacklisted` n'est jamais renvoyé, pour ne pas réabonner de force
//     quelqu'un qui s'est désinscrit ;
//   — la liste Newsletter n'est alimentée que si le consentement est explicite
//     (formulaire newsletter, ou case cochée ailleurs).
async function upsertContact(type, data) {
  const conf = FORMULAIRES[type]
  if (!conf || !LIST_IDS) return

  const email = String(data.email || '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    console.warn('Contact Brevo ignoré : email invalide')
    return
  }

  const optin = conf.optinImplicite === true || data.optinNewsletter === true

  // Les listes du formulaire — fixes, ou déduites du menu choisi par le
  // visiteur — plus la newsletter si le consentement est donné : c'est la case
  // cochée qui fait entrer dans la liste de diffusion, quel que soit le
  // formulaire d'origine.
  const cles = listesDe(type, data)
  if (optin && !cles.includes('newsletter')) cles.push('newsletter')

  const listes = cles
    .map((cle) => LIST_IDS[cle])
    .filter((id) => Number.isInteger(id))

  const attributes = nettoyerAttributs({
    ...conf.attributs(data),
    SOURCE: SOURCES[type] || type,
    OPTIN_NEWSLETTER: optin,
    DATE_DERNIER_CONTACT: new Date().toISOString().slice(0, 10),
  })

  // Avec le double opt-in, l'inscription à la newsletter passe par l'email de
  // confirmation : elle est retirée de l'upsert direct pour n'aboutir qu'après
  // le clic du visiteur.
  const doi = optin && DOI_TEMPLATE_ID && DOI_REDIRECT_URL
  const idNewsletter = LIST_IDS.newsletter
  const listesDirectes = listes.filter((id) => !(doi && id === idNewsletter))

  // Email de bienvenue : seulement pour une inscription réellement nouvelle.
  // En double opt-in il n'a pas lieu d'être, l'email de confirmation joue ce
  // rôle et l'inscription n'est pas encore acquise.
  const bienvenue = optin && TEMPLATE_BIENVENUE && !doi
    && !(await dejaDansLaListe(email, idNewsletter))

  const r = await brevo('/contacts', {
    email,
    attributes,
    listIds: listesDirectes,
    updateEnabled: true,
  })
  if (!r.ok) {
    console.error('Brevo contacts HTTP', r.status, await r.text())
    return
  }
  console.log('Contact Brevo enregistré:', type, 'listes', listesDirectes.join(','))

  if (bienvenue) {
    const b = await brevo('/smtp/email', {
      to: [{ email }],
      templateId: TEMPLATE_BIENVENUE,
    })
    if (!b.ok) console.error('Brevo bienvenue HTTP', b.status, await b.text())
    else console.log('Email de bienvenue envoyé:', email)
  }

  if (doi && Number.isInteger(idNewsletter)) {
    const d = await brevo('/contacts/doubleOptinConfirmation', {
      email,
      attributes,
      includeListIds: [idNewsletter],
      templateId: DOI_TEMPLATE_ID,
      redirectionUrl: DOI_REDIRECT_URL,
    })
    if (!d.ok) console.error('Brevo double opt-in HTTP', d.status, await d.text())
    else console.log('Double opt-in envoyé:', email)
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  if (!BREVO_API_KEY) {
    console.error('BREVO_API_KEY manquante')
    return res.status(500).json({ error: 'Configuration manquante' })
  }

  let body
  try {
    body = await parseBody(req)
  } catch (e) {
    console.error('Body parse error:', e)
    return res.status(400).json({ error: 'Body invalide' })
  }

  const { type, ...data } = body
  console.log('Formulaire reçu:', type, Object.keys(data))

  const tpl = templates[type]
  if (!tpl) return res.status(400).json({ error: 'Type inconnu: ' + type })

  const { subject, html } = tpl(data)

  try {
    const r = await brevo('/smtp/email', {
      sender: SENDER,
      to: [{ email: DEST_EMAIL, name: 'Équipe Ressources' }],
      replyTo: data.email ? { email: data.email, name: data.nom || data.contact || undefined } : undefined,
      subject,
      htmlContent: html,
    })

    if (!r.ok) {
      const err = await r.text()
      console.error('Brevo HTTP', r.status, err)
      return res.status(500).json({ error: 'Erreur envoi email', detail: err })
    }

    console.log('Email envoyé OK:', subject)
  } catch (e) {
    console.error('Fetch error:', e.message)
    return res.status(500).json({ error: 'Erreur serveur', detail: e.message })
  }

  // L'enregistrement du contact ne doit jamais faire échouer le formulaire :
  // la notification à l'équipe est partie, le visiteur a fait sa part. Un échec
  // ici est tracé dans les logs Vercel, pas renvoyé au navigateur.
  try {
    await upsertContact(type, data)
  } catch (e) {
    console.error('Contact Brevo non enregistré:', e.message)
  }

  return res.status(200).json({ ok: true })
}
