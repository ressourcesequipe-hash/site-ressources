// Envoi d'une réponse par email à l'auteur d'une demande — §15.
//
// Le point délicat de tout ce module tient en une phrase : un email parti ne
// revient pas. Le §15 demande d'empêcher les doubles envois, et la façon la
// plus courante de les provoquer est précisément de vouloir bien faire —
// renvoyer « au cas où » après une erreur réseau, alors que le message était
// déjà parti.
//
// D'où trois règles ici :
//   1. la ligne de suivi est écrite AVANT l'appel à Brevo, jamais après ;
//   2. une panne de réseau ne se confond pas avec un refus de Brevo :
//      « échec » signifie que Brevo a répondu non, « incertain » que nous
//      n'avons pas de réponse du tout ;
//   3. un envoi « incertain » n'est jamais relancé automatiquement. C'est
//      l'équipe qui tranche, en connaissance de cause.

import { demandeEmail } from '../db/schema.js'
import { and, eq, lt } from 'drizzle-orm'
import { messageSansDonnees } from './demandes.js'

const EXPEDITEUR = { name: 'Ressources', email: 'contact@ressourcesrecyclerie.fr' }

// Au-delà, on considère ne pas avoir de réponse plutôt que d'attendre
// l'interruption de la fonction serverless, qui ne laisserait aucune trace.
const DELAI_MS = 12 * 1000

function texteVersHtml(corps) {
  const esc = (t) => String(t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return `<div style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#222;max-width:560px">
    ${esc(corps).replace(/\r?\n/g, '<br>')}
  </div>`
}

/**
 * Enregistre puis tente l'envoi. Renvoie toujours la ligne de suivi à jour :
 * l'appelant n'a pas à interpréter une exception pour savoir quoi afficher.
 *
 * @param {object} db            instance Drizzle
 * @param {object} params
 * @param {number} params.demandeId
 * @param {string} params.auteurId       auteur de la réponse, côté association
 * @param {string} params.destinataire
 * @param {string} params.sujet
 * @param {string} params.corps          texte brut saisi dans l'interface
 */
export async function envoyerReponse(db, { demandeId, auteurId, destinataire, sujet, corps }) {
  const [ligne] = await db
    .insert(demandeEmail)
    .values({ demandeId, auteurId, destinataire, sujet, corps, statutEnvoi: 'en_cours' })
    .returning()

  const cle = process.env.BREVO_API_KEY
  if (!cle) {
    return majSuivi(db, ligne.id, {
      statutEnvoi: 'echec',
      erreur: "La clé d'API Brevo n'est pas configurée sur le serveur : aucun message n'est parti.",
    })
  }

  let reponse
  try {
    reponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': cle, 'Content-Type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: EXPEDITEUR,
        replyTo: EXPEDITEUR,
        to: [{ email: destinataire }],
        subject: sujet,
        htmlContent: texteVersHtml(corps),
        textContent: corps,
      }),
      signal: AbortSignal.timeout(DELAI_MS),
    })
  } catch (e) {
    // Aucune réponse reçue. Le message est peut-être parti : on ne le sait
    // pas, et prétendre le contraire dans un sens ou dans l'autre serait un
    // mensonge qui coûterait soit un double envoi, soit un silence.
    return majSuivi(db, ligne.id, {
      statutEnvoi: 'incertain',
      erreur: `Pas de réponse de Brevo (${e.name === 'TimeoutError' ? 'délai dépassé' : messageSansDonnees(e)}).`,
    })
  }

  if (!reponse.ok) {
    const detail = await reponse.text().catch(() => '')
    return majSuivi(db, ligne.id, {
      statutEnvoi: 'echec',
      erreur: `Brevo a refusé l'envoi (HTTP ${reponse.status}). ${detail.slice(0, 500)}`.trim(),
    })
  }

  const corpsReponse = await reponse.json().catch(() => ({}))
  return majSuivi(db, ligne.id, {
    statutEnvoi: 'envoye',
    brevoMessageId: corpsReponse.messageId || null,
    confirmeLe: new Date(),
  })
}

async function majSuivi(db, id, champs) {
  const [ligne] = await db.update(demandeEmail).set(champs).where(eq(demandeEmail.id, id)).returning()
  return ligne
}

// Un envoi resté « en cours » n'est plus en cours : la fonction serverless
// qui l'avait lancé s'est arrêtée depuis longtemps, et n'a donc jamais pu
// écrire son résultat. Ces lignes doivent cesser de faire croire à un envoi
// en route — sans pour autant être déclarées parties ou non parties, ce que
// personne ne sait.
export const DELAI_ENVOI_ORPHELIN_MS = 10 * 60 * 1000

/**
 * Bascule en « incertain » les envois restés « en cours » trop longtemps.
 *
 * Appelé à deux endroits, comme le cycle de déploiement : à l'ouverture
 * d'une fiche (chemin réactif, `demandeId` fourni) et par le cron quotidien
 * (balayage complet). La tâche planifiée ne peut pas être le chemin
 * principal : sur le palier Hobby elle ne passe qu'une fois par jour, ce qui
 * laisserait une demande bloquée pendant vingt-quatre heures.
 */
export async function rafraichirEnvoisOrphelins(db, demandeId = null) {
  const limite = new Date(Date.now() - DELAI_ENVOI_ORPHELIN_MS)
  const conditions = [
    eq(demandeEmail.statutEnvoi, 'en_cours'),
    lt(demandeEmail.tentativeLe, limite),
  ]
  if (demandeId) conditions.push(eq(demandeEmail.demandeId, demandeId))

  const lignes = await db
    .update(demandeEmail)
    .set({
      statutEnvoi: 'incertain',
      erreur:
        "L'envoi n'a jamais été confirmé : le serveur s'est arrêté avant d'avoir la réponse de Brevo. Vérifiez la boîte d'envoi de l'association.",
    })
    .where(and(...conditions))
    .returning({ id: demandeEmail.id, demandeId: demandeEmail.demandeId })

  return { basculés: lignes.length, lignes }
}
