// Tableau de bord — §7 du cahier des charges.
//
// Rassemble ce qui doit sauter aux yeux en arrivant. Aujourd'hui la
// fréquentation du site ; les compteurs de contenus à valider et de demandes
// en attente, également prévus au §7, le rejoindront ici — d'où une fonction
// dédiée plutôt qu'un module de `reglages.js`, qui porte des réglages et non
// une vue d'ensemble.
//
// Onzième fonction serverless sur les douze du forfait. Les modules restants
// (navigation §18, SEO §20, historique §23) sont prévus dans `reglages.js`,
// la marge tient.

import { auth } from '../../lib/auth.js'
import { fromNodeHeaders } from 'better-auth/node'
import {
  JOURS_DEFAUT,
  lireFrequentation,
  statistiquesConfigurees,
} from '../../lib/statistiques.js'
import { messageSansDonnees } from '../../lib/demandes.js'

export default async function handler(req, res) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
  if (!session) return res.status(401).json({ error: 'Non authentifié' })
  if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée' })

  // Ouvert à tout compte connecté, y compris en lecture seule : ce sont des
  // nombres agrégés sur le site public, rien qu'un visiteur ne puisse déduire
  // en regardant les pages. Les réserver au Super administrateur reviendrait
  // à priver l'équipe de ce qui la concerne le plus directement.
  const jours = Number(req.query?.jours) || JOURS_DEFAUT

  if (!statistiquesConfigurees()) {
    return res.status(200).json({
      frequentation: null,
      indisponible: {
        code: 'non_configure',
        message:
          "La mesure d'audience n'est pas configurée sur le serveur. Il manque VERCEL_API_TOKEN ou VERCEL_PROJECT_ID.",
      },
    })
  }

  try {
    return res.status(200).json({ frequentation: await lireFrequentation({ jours }) })
  } catch (e) {
    // Une statistique manquante ne doit jamais casser le tableau de bord : le
    // reste de l'écran — et bientôt les compteurs de contenus et de demandes —
    // garde sa valeur. On renvoie donc 200 avec la raison, plutôt qu'une
    // erreur qui viderait la page.
    console.error('[tableau-de-bord] fréquentation :', messageSansDonnees(e))
    return res.status(200).json({
      frequentation: null,
      indisponible: {
        code: e.code || 'erreur',
        message:
          e.code === 'non_active'
            ? "Web Analytics n'est pas encore activé sur le projet Vercel. Une fois activé, les chiffres s'accumuleront à partir de ce moment-là."
            : "Les statistiques n'ont pas pu être récupérées. Réessayez dans un instant.",
      },
    })
  }
}
