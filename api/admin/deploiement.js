// État du déploiement et bouton « Vérifier et publier maintenant » —
// §2 et §3 de l'architecture technique.
//
// GET  : état courant, pour que l'interface reflète la réalité et ne
//        présente jamais un contenu comme en ligne avant que le déploiement
//        ne soit `pret` (§5.5 du cahier des charges).
// POST : solution manuelle de secours. Sur le palier Hobby, la tâche
//        planifiée ne passe qu'une fois par jour ; ce bouton donne à
//        Coordination/Super administrateur le moyen de refermer le cycle et
//        de repartir immédiatement, sans attendre ce passage.
//
// Le contrôle de droits est fait ICI, côté serveur, jamais seulement en
// masquant le bouton dans l'interface (§24.3 du cahier des charges).

import { auth } from '../../lib/auth.js'
import { fromNodeHeaders } from 'better-auth/node'
import { verifierDroit } from '../../lib/permissions.js'
import { resoudreSiTermine, lireEtatDeploiement } from '../../lib/deploiement.js'

export default async function handler(req, res) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) })
  if (!session) return res.status(401).json({ error: 'Non authentifié' })

  if (req.method === 'GET') {
    const { etat, derniers } = await lireEtatDeploiement()
    // Le détail technique d'une erreur de build reste réservé aux profils
    // autorisés (§2) : les autres reçoivent l'état, pas le message brut.
    const technique = verifierDroit(session.user.role, 'deploiement.diagnostiquer')
    return res.status(200).json({
      etat,
      derniers: derniers.map((d) => (technique ? d : { ...d, erreur: d.erreur ? 'masqué' : null })),
    })
  }

  if (req.method === 'POST') {
    if (!verifierDroit(session.user.role, 'deploiement.verifier')) {
      return res.status(403).json({ error: 'Droits insuffisants' })
    }
    const resultat = await resoudreSiTermine()
    const { etat, derniers } = await lireEtatDeploiement()
    return res.status(200).json({ ok: true, resultat, etat, derniers })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
