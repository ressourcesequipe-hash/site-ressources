// Enregistrement d'un envoi de formulaire dans la boîte de demandes — §15.
//
// Ce fichier est le seul point de contact entre le site public et le
// back-office. Il obéit donc à une règle stricte, héritée de la façon dont
// `upsertContact` est déjà traité dans api/contact.js : **rien de ce qui se
// passe ici ne doit pouvoir faire échouer un formulaire**. Le visiteur a fait
// sa part, l'équipe a reçu sa notification par email ; qu'une base de données
// soit injoignable ne le regarde pas.
//
// D'où le module séparé et l'import dynamique côté api/contact.js : tant que
// DATABASE_URL n'est pas configurée, ce code n'est jamais chargé et le
// formulaire se comporte exactement comme avant.

import { createHash } from 'node:crypto'
import { and, eq, gt, sql } from 'drizzle-orm'
import { db } from './db.js'
import { demande } from '../db/schema.js'
import {
  FENETRE_CADENCE_MS, colonnesExtraites, rubriqueDe, scorerSpam, statutInitial,
} from './demandes.js'

// Un envoi n'est jamais refusé, seulement classé : refuser bloquerait aussi
// une mairie ou une école dont tous les postes sortent par la même adresse.
// Les seuils et leur interprétation vivent dans lib/demandes.js, avec le
// reste du calcul ; ici on ne fait que compter.

// L'empreinte ne sert qu'à reconnaître un même expéditeur. Elle est salée
// avec un secret déjà présent sur le projet : sans lui, une empreinte
// d'adresse IP se retrouve par simple épuisement (il n'y en a que quatre
// milliards), et n'aurait donc rien protégé du tout.
function empreinte(adresse) {
  if (!adresse) return null
  const sel = process.env.BETTER_AUTH_SECRET || ''
  return createHash('sha256').update(sel + '|' + adresse).digest('hex').slice(0, 32)
}

function adresseDe(req) {
  const entete = req.headers['x-forwarded-for']
  if (typeof entete === 'string' && entete.trim()) return entete.split(',')[0].trim()
  return req.socket?.remoteAddress || null
}

/**
 * @param {string} type   type de formulaire (donMateriel, contact…)
 * @param {object} data   corps du formulaire, sans le champ `type`
 * @param {object} req    requête, pour l'adresse d'origine uniquement
 * @returns {Promise<{ignore?: true, id?: number, statut?: string}>}
 */
export async function enregistrerDemande(type, data, req) {
  const rubrique = rubriqueDe(type, data)
  // La newsletter ne crée pas de demande : il n'y a rien à traiter.
  if (!rubrique) return { ignore: true }

  const empreinteIp = empreinte(adresseDe(req))

  // Le comptage précède le calcul : le score est établi une seule fois, avec
  // tout ce qu'on sait. Le corriger après coup, c'est se condamner à oublier
  // un jour de recalculer ce qui en découle.
  let envoisRecents = 0
  if (empreinteIp) {
    const [compte] = await db
      .select({ recents: sql`count(*)::int` })
      .from(demande)
      .where(
        and(
          eq(demande.empreinteIp, empreinteIp),
          gt(demande.creeLe, new Date(Date.now() - FENETRE_CADENCE_MS))
        )
      )
    envoisRecents = Number(compte?.recents || 0)
  }

  const spam = scorerSpam(data, { piegeRempli: Boolean(data.piege), envoisRecents })

  const [ligne] = await db
    .insert(demande)
    .values({
      typeFormulaire: type,
      rubrique,
      donnees: data,
      statut: statutInitial(spam),
      scoreSpam: spam.score,
      empreinteIp,
      ...colonnesExtraites(type, data),
    })
    .returning({ id: demande.id, statut: demande.statut })

  return ligne
}
