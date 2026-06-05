const BREVO_API_KEY = process.env.BREVO_API_KEY
const DEST_EMAIL = 'ressources.equipe@gmail.com'
const SENDER = { name: 'Site Ressources', email: 'no-reply@ressources-landes.fr' }

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
    subject: '📦 Demande d\'enlèvement matériel — Ressources',
    html: row('Demande d\'enlèvement', [
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
}

function row(title, fields) {
  const rows = fields
    .map(([label, val]) => `<tr><td style="padding:6px 12px;color:#666;width:160px">${label}</td><td style="padding:6px 12px;color:#222">${val}</td></tr>`)
    .join('')
  return `<div style="font-family:sans-serif;max-width:560px;margin:0 auto">
    <h2 style="background:#5a6b3a;color:#fff;padding:16px 20px;margin:0;font-size:16px">${title} — Ressources Landes</h2>
    <table style="width:100%;border-collapse:collapse;border:1px solid #e5e0d5">${rows}</table>
    <p style="color:#aaa;font-size:11px;padding:12px">Message automatique — site ressources-landes.fr</p>
  </div>`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { type, ...data } = req.body
  const tpl = templates[type]
  if (!tpl) return res.status(400).json({ error: 'Type inconnu' })

  const { subject, html } = tpl(data)

  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: DEST_EMAIL, name: 'Équipe Ressources' }],
        subject,
        htmlContent: html,
      }),
    })

    if (!r.ok) {
      const err = await r.text()
      console.error('Brevo error:', err)
      return res.status(500).json({ error: 'Erreur envoi email' })
    }

    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}
