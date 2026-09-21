// Point d'entrée unique des modules de contenu du back-office.
//
// POURQUOI UNE SEULE FONCTION POUR SEPT MODULES
//
// Le palier Vercel du projet limite le nombre de fonctions serverless par
// déploiement. Avec une fonction par module, le projet est passé à treize
// et le déploiement du 21/09/2026 a été refusé — le build réussissait, le
// déploiement échouait à l'étape « Deploying outputs ». C'est une limite de
// plateforme, pas un défaut de code, et elle serait revenue à chaque
// nouveau module.
//
// Les sept modules partagent déjà toute leur mécanique (lib/module-contenu.js)
// et ne diffèrent que par leur configuration : les réunir derrière un
// aiguillage ne mélange donc rien qui soit réellement distinct.
//
// Le module visé est nommé explicitement par le paramètre `module`. Aucune
// réécriture d'URL n'intervient : on a déjà été surpris deux fois par le
// routage de la plateforme, autant garder ici un chemin sans magie. Côté
// interface, `src/admin/lib/api.js` fabrique l'URL, si bien que les écrans
// continuent d'appeler `/actualites`, `/pages`, etc.

import actualites from '../../lib/modules/actualites.js'
import ateliers from '../../lib/modules/ateliers.js'
import categoriesAteliers from '../../lib/modules/categories-ateliers.js'
import evenements from '../../lib/modules/evenements.js'
import organisations from '../../lib/modules/organisations.js'
import pages from '../../lib/modules/pages.js'
import pointsCollecte from '../../lib/modules/points-collecte.js'

const MODULES = {
  actualites,
  ateliers,
  'categories-ateliers': categoriesAteliers,
  evenements,
  organisations,
  pages,
  'points-collecte': pointsCollecte,
}

export default async function handler(req, res) {
  const nom = req.query?.module
  const gestionnaire = MODULES[nom]

  if (!gestionnaire) {
    return res.status(404).json({
      error: `Module inconnu : ${nom || '(aucun)'}`,
      modulesDisponibles: Object.keys(MODULES),
    })
  }

  return gestionnaire(req, res)
}
