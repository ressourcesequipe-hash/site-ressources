// Emails adressés à l'équipe du back-office — invitations et
// réinitialisations de mot de passe (§21, §26).
//
// Distinct de `lib/envoi-reponse.js`, qui écrit aux personnes ayant rempli un
// formulaire : ici le destinataire est un membre de l'association, le message
// n'est pas rédigé par quelqu'un, et il n'y a ni verrou ni suivi d'envoi à
// tenir. Mélanger les deux reviendrait à faire passer un email de service
// pour une réponse de l'équipe dans la boîte de demandes.
//
// Un échec d'envoi est remonté à l'appelant, contrairement aux notifications
// du site : si l'invitation ne part pas, la personne n'a aucun moyen d'entrer,
// et le Super administrateur doit le savoir tout de suite.

const EXPEDITEUR = { name: 'Ressources — back-office', email: 'contact@ressourcesrecyclerie.fr' }
const DELAI_MS = 12 * 1000

function esc(t) {
  return String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Un seul gabarit, deux textes. Le bouton est un lien stylé et non un
// <button> : les clients de messagerie ne rendent pas les formulaires, et un
// lien reste cliquable même quand le HTML est dégradé.
function gabarit({ titre, intro, lienTexte, url, pied }) {
  return `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#222">
  <h2 style="background:#5a6b3a;color:#fff;padding:16px 20px;margin:0;font-size:16px">${esc(titre)}</h2>
  <div style="border:1px solid #e5e0d5;border-top:none;padding:20px;font-size:14px;line-height:1.6">
    <p style="margin:0 0 16px">${esc(intro)}</p>
    <p style="margin:0 0 16px">
      <a href="${esc(url)}" style="display:inline-block;background:#b8762e;color:#fff;text-decoration:none;padding:11px 20px;border-radius:8px;font-weight:600">${esc(lienTexte)}</a>
    </p>
    <p style="margin:0 0 8px;color:#666;font-size:12.5px">
      Si le bouton ne fonctionne pas, copiez cette adresse dans votre navigateur :
    </p>
    <p style="margin:0 0 16px;word-break:break-all;font-size:12px;color:#888">${esc(url)}</p>
    <p style="margin:0;color:#666;font-size:12.5px">${esc(pied)}</p>
  </div>
  <p style="color:#aaa;font-size:11px;padding:12px 0">Message automatique — back-office de l'association Ressources</p>
</div>`
}

const TEXTES = {
  invitation: (nom) => ({
    sujet: 'Votre accès au back-office de Ressources',
    titre: 'Bienvenue dans le back-office',
    intro: `Bonjour ${nom}, un accès au back-office du site de l'association Ressources vient d'être créé pour vous. Il ne vous reste qu'à choisir votre mot de passe.`,
    lienTexte: 'Choisir mon mot de passe',
    pied: "Ce lien est valable 48 heures et ne fonctionne qu'une fois. Passé ce délai, demandez une nouvelle invitation à la personne qui vous a créé l'accès.",
  }),
  reinitialisation: (nom) => ({
    sujet: 'Réinitialiser votre mot de passe — back-office Ressources',
    titre: 'Réinitialisation du mot de passe',
    intro: `Bonjour ${nom}, une réinitialisation de mot de passe a été demandée pour votre accès au back-office.`,
    lienTexte: 'Choisir un nouveau mot de passe',
    pied: "Ce lien est valable 48 heures et ne fonctionne qu'une fois. Si vous n'êtes pas à l'origine de cette demande, ignorez ce message : votre mot de passe actuel reste valable.",
  }),
}

/**
 * @param {'invitation'|'reinitialisation'} type
 * @param {{email: string, name?: string}} destinataire
 * @param {string} url  lien de définition du mot de passe, jeton compris
 */
export async function envoyerEmailEquipe(type, destinataire, url) {
  const cle = process.env.BREVO_API_KEY
  if (!cle) {
    throw new Error("La clé d'API Brevo n'est pas configurée : aucun email ne peut partir.")
  }

  const t = TEXTES[type](destinataire.name || 'bonjour')
  const corps = gabarit({ ...t, url })

  let reponse
  try {
    reponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': cle, 'Content-Type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: EXPEDITEUR,
        to: [{ email: destinataire.email, name: destinataire.name || undefined }],
        subject: t.sujet,
        htmlContent: corps,
      }),
      signal: AbortSignal.timeout(DELAI_MS),
    })
  } catch (e) {
    throw new Error(`Brevo n'a pas répondu (${e.name === 'TimeoutError' ? 'délai dépassé' : e.message}).`)
  }

  if (!reponse.ok) {
    const detail = await reponse.text().catch(() => '')
    throw new Error(`Brevo a refusé l'envoi (HTTP ${reponse.status}). ${detail.slice(0, 300)}`.trim())
  }
}
