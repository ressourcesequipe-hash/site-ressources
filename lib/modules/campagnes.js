// Campagnes et bandeaux temporaires — §19 du cahier des charges.
//
// N'utilise pas la fabrique des modules de contenu : une campagne n'a ni
// slug, ni brouillon, ni parcours de validation, ni historique de versions.
// Elle a un interrupteur et une fenêtre de dates. Lui plaquer le cycle de
// publication des contenus ajouterait cinq statuts là où deux booléens
// suffisent, et obligerait à expliquer la différence entre « publié » et
// « actif ».
//
// Une modification déclenche un déploiement, comme un contenu : le site est
// prérendu, une campagne enregistrée sans reconstruction ne paraîtrait nulle
// part. C'est le même mécanisme que partout ailleurs (lib/deploiement.js),
// jamais une logique de déploiement dupliquée.

import { and, asc, desc, eq } from 'drizzle-orm'
import { auth } from '../auth.js'
import { fromNodeHeaders } from 'better-auth/node'
import { db } from '../db.js'
import { campagne, user } from '../../db/schema.js'
import { verifierDroit } from '../permissions.js'
import { demanderDeploiement } from '../deploiement.js'
import { messageSansDonnees } from '../demandes.js'
import { EMPLACEMENTS, TYPES, etatCampagne, valider } from '../campagnes.js'

const CHAMPS = [
  'titreInterne', 'message', 'lien', 'texteBouton', 'type',
  'emplacement', 'pageCible', 'debutLe', 'finLe', 'actif', 'ordre',
]
const CHAMPS_DATE = ['debutLe', 'finLe']

// La campagne est déjà enregistrée quand on arrive ici : un échec de
// déclenchement ne doit pas faire croire que l'enregistrement a raté, sans
// quoi l'utilisateur recommence (§5.5).
async function declencherSansEchouer() {
  try {
    await demanderDeploiement()
    return { deploiementDeclenche: true }
  } catch (e) {
    console.error('[campagnes] déploiement non déclenché :', messageSansDonnees(e))
    return { deploiementDeclenche: false, avertissementDeploiement: e.message }
  }
}

function extraire(corps) {
  const donnees = {}
  for (const champ of CHAMPS) {
    if (!(champ in (corps || {}))) continue
    if (CHAMPS_DATE.includes(champ)) {
      const valeur = corps[champ]
      donnees[champ] = valeur ? new Date(valeur) : null
    } else if (champ === 'actif') {
      donnees[champ] = Boolean(corps[champ])
    } else if (champ === 'ordre') {
      donnees[champ] = Number.isFinite(Number(corps[champ])) ? Number(corps[champ]) : 0
    } else {
      donnees[champ] = corps[champ] === '' ? null : corps[champ]
    }
  }
  // Une page cible n'a de sens que pour l'emplacement qui l'utilise : la
  // conserver ailleurs laisserait une valeur morte que le prochain lecteur
  // croirait active.
  if (donnees.emplacement && donnees.emplacement !== 'page_specifique') donnees.pageCible = null
  return donnees
}

export default async function handler(req, res) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
  if (!session) return res.status(401).json({ error: 'Non authentifié' })
  const utilisateur = session.user
  const peutGerer = verifierDroit(utilisateur.role, 'campagnes.gerer')
  const id = req.query?.id ? Number(req.query.id) : null

  try {
    if (req.method === 'GET') {
      const lignes = await db
        .select({
          id: campagne.id, titreInterne: campagne.titreInterne, message: campagne.message,
          lien: campagne.lien, texteBouton: campagne.texteBouton, type: campagne.type,
          emplacement: campagne.emplacement, pageCible: campagne.pageCible,
          debutLe: campagne.debutLe, finLe: campagne.finLe, actif: campagne.actif,
          ordre: campagne.ordre, version: campagne.version, majLe: campagne.majLe,
          auteurNom: user.name,
        })
        .from(campagne)
        .leftJoin(user, eq(campagne.auteurId, user.id))
        .orderBy(asc(campagne.ordre), desc(campagne.majLe))

      return res.status(200).json({ campagnes: lignes, types: TYPES, emplacements: EMPLACEMENTS, peutGerer })
    }

    if (!peutGerer) {
      return res.status(403).json({
        error: 'Seules la Coordination et la Communication peuvent gérer les campagnes.',
      })
    }

    if (req.method === 'POST') {
      const donnees = extraire(req.body)
      const validation = valider(donnees)
      if (!validation.ok) return res.status(400).json({ erreurs: validation.erreurs })

      const [ligne] = await db
        .insert(campagne)
        .values({ ...donnees, auteurId: utilisateur.id, modifieParId: utilisateur.id })
        .returning()
      return res.status(201).json({ campagne: ligne, ...(await declencherSansEchouer()) })
    }

    if (req.method === 'PUT' && id) {
      const [avant] = await db.select().from(campagne).where(eq(campagne.id, id))
      if (!avant) return res.status(404).json({ error: 'Campagne introuvable.' })

      // Verrou optimiste, comme pour les contenus : deux personnes qui
      // modifient la même campagne ne doivent pas s'écraser en silence.
      const version = Number(req.body?.version)
      if (Number.isFinite(version) && version !== avant.version) {
        const [modifieur] = avant.modifieParId
          ? await db.select({ name: user.name }).from(user).where(eq(user.id, avant.modifieParId))
          : []
        return res.status(409).json({
          error: `${modifieur?.name || 'Quelqu’un'} a modifié cette campagne entre-temps. Rechargez la page pour repartir de sa version.`,
        })
      }

      const donnees = { ...avant, ...extraire(req.body) }
      const validation = valider(donnees)
      if (!validation.ok) return res.status(400).json({ erreurs: validation.erreurs })

      const [apres] = await db
        .update(campagne)
        .set({
          ...extraire(req.body),
          modifieParId: utilisateur.id,
          version: avant.version + 1,
          majLe: new Date(),
        })
        .where(eq(campagne.id, id))
        .returning()
      return res.status(200).json({ campagne: apres, ...(await declencherSansEchouer()) })
    }

    if (req.method === 'DELETE' && id) {
      const [ligne] = await db.select().from(campagne).where(eq(campagne.id, id))
      if (!ligne) return res.status(404).json({ error: 'Campagne introuvable.' })

      // Une campagne en ligne ne se supprime pas d'un clic : la désactiver
      // d'abord rend le geste réversible, et fait disparaître le bandeau
      // aussi vite.
      if (etatCampagne(ligne) === 'en_cours') {
        return res.status(409).json({
          error: "Cette campagne est actuellement en ligne. Désactivez-la d'abord : le bandeau disparaîtra, et vous pourrez la supprimer ensuite ou la réutiliser plus tard.",
        })
      }

      await db.delete(campagne).where(eq(campagne.id, id))
      return res.status(200).json({ supprime: true, ...(await declencherSansEchouer()) })
    }

    return res.status(405).json({ error: 'Méthode non autorisée' })
  } catch (e) {
    console.error(`[campagnes] ${req.method} ${id || ''} :`, messageSansDonnees(e))
    return res.status(500).json({ error: "Une erreur est survenue. Rien n'a été modifié." })
  }
}
