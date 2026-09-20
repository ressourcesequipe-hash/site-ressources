// Monte better-auth sur /api/auth/* — route Vercel « catch-all », sur le
// même modèle de fonction serverless simple que api/contact.js existant.
//
// `toNodeHandler` convertit le handler Web-standard de better-auth vers la
// signature (req, res) de Node qu'attend Vercel : vérifié le 19/09/2026
// contre node_modules/better-auth/dist/integrations/node.d.mts.
//
// Point à confirmer en conditions réelles (Étape 0) : selon la version du
// runtime Node de Vercel, `req.body` peut déjà avoir été consommé pour le
// JSON avant d'atteindre ce handler (comme le contourne manuellement
// api/contact.js avec sa propre lecture de flux). Si better-auth reçoit un
// corps vide en test réel, relire le flux depuis `req.body` déjà parsé
// plutôt que depuis `req` directement.
import { toNodeHandler } from 'better-auth/node'
import { auth } from '../../lib/auth.js'

export default toNodeHandler(auth)
