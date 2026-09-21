// Réglages du site — routeur des modules de configuration.
//
// Même principe que `api/admin/contenus.js` : une seule fonction serverless
// pour plusieurs modules, l'un d'eux étant désigné par `?module=`. Le forfait
// Vercel du projet en autorise douze, et un treizième fichier avait fait
// échouer le déploiement du 21/09/2026. Neuf sont déjà prises ; leur en
// donner une par module de réglage épuiserait la marge en trois écrans.
//
// Aujourd'hui : campagnes (§19). Rejoindront ce fichier : navigation (§18),
// SEO (§20), historique (§23).

import campagnes from '../../lib/modules/campagnes.js'

const MODULES = { campagnes }

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
