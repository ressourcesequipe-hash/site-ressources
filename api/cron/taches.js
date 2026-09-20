// Tâche planifiée unique du back-office — §3 de l'architecture technique.
//
// Déclarée dans vercel.json (`crons`). Sur le palier Hobby confirmé en
// Étape 0, Vercel n'exécute une tâche qu'une fois par jour, et à l'heure
// indiquée « à une heure près ». Toute la conception en tient compte : cette
// tâche est un FILET DE SÉCURITÉ, jamais le chemin principal.
//
// Ce qu'elle fait aujourd'hui (Étape 1) :
//   - refermer un cycle de déploiement resté ouvert (§2), si aucun des deux
//     chemins plus réactifs ne l'a déjà fait : la vérification opportuniste
//     à chaque publication, et le bouton manuel de Coordination.
//
// Ce qui la rejoindra, sans nouvelle tâche planifiée (le palier Hobby en
// limite le nombre, et l'architecture prévoit explicitement une tâche unique) :
//   - Étape 2 : basculer les contenus `programmé` dont la date est atteinte,
//     et les campagnes/bandeaux `actif` dont la date de fin est dépassée,
//     puis appeler `demanderDeploiement()` — le même mécanisme que la
//     publication manuelle, aucune logique de déploiement dupliquée.
//   - Étape 3 : basculer en `incertain` les lignes `demande_emails` restées
//     `en_cours` au-delà de quelques minutes, et libérer le verrou associé.

import { resoudreSiTermine, lireEtatDeploiement } from '../../lib/deploiement.js'

export default async function handler(req, res) {
  // Vercel ajoute automatiquement cet en-tête aux requêtes de cron dès que
  // la variable CRON_SECRET existe sur le projet. Sans ce contrôle, l'URL
  // serait publiquement déclenchable.
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return res.status(500).json({ error: 'CRON_SECRET manquante — voir docs/backoffice-variables-environnement.md' })
  }
  if (req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Non autorisé' })
  }

  const resultats = {}

  try {
    resultats.deploiement = await resoudreSiTermine()
  } catch (e) {
    // Une tâche planifiée ne doit jamais échouer en bloc : chaque traitement
    // est isolé pour que l'échec de l'un n'empêche pas les autres (utile dès
    // que les étapes 2 et 3 s'ajouteront ici).
    console.error('[cron] résolution du déploiement :', e)
    resultats.deploiement = { erreur: e.message }
  }

  const { etat } = await lireEtatDeploiement()
  return res.status(200).json({ ok: true, resultats, etat })
}
