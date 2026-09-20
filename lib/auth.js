// Instance better-auth du back-office — §1 de l'architecture technique.
//
// Vérifié le 19/09/2026 contre le code source de better-auth@1.7.5
// (node_modules/@better-auth/core/src/db/schema/*.ts et
// node_modules/@better-auth/drizzle-adapter) : formes de `drizzleAdapter`,
// `user.additionalFields` et `rateLimit` confirmées par lecture directe,
// pas seulement par la documentation. Reste à vérifier en conditions
// réelles (Étape 0) : gestion du corps de requête par les fonctions
// Vercel face à `toNodeHandler` (voir api/auth/[...all].js), et les valeurs
// par défaut exactes des cookies de session (httpOnly/secure/sameSite) —
// à confirmer dans la documentation better-auth avant la mise en production.

import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db.js'
import * as schema from '../db/schema.js'

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error('BETTER_AUTH_SECRET manquante — voir docs/backoffice-variables-environnement.md')
}

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5173',
  basePath: '/api/auth',

  // Équipe interne d'une dizaine de comptes : email + mot de passe suffit,
  // pas d'OAuth/SSO en V1 (§1 de l'architecture).
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,

    // Aucune inscription libre : les comptes sont créés par le Super
    // administrateur (§21 du cahier des charges, qui ne prévoit à aucun
    // moment d'auto-inscription).
    //
    // Sans ce réglage, better-auth expose `/api/auth/sign-up/email` en accès
    // public. Vérifié en production le 20/09/2026, peu après la mise en
    // ligne : la requête était acceptée et n'échouait que sur la longueur du
    // mot de passe — n'importe qui pouvait donc se créer un compte et entrer
    // dans le back-office avec le rôle `lecture_seule`. Corrigé le jour même.
    disableSignUp: true,
  },

  // Limitation des tentatives de connexion — §26 du cahier des charges :
  // brique éprouvée plutôt que réinventée.
  rateLimit: {
    enabled: true,
    window: 60,
    max: 5,
  },

  user: {
    additionalFields: {
      // §21 du cahier : super_admin | coordination | communication |
      // contributeur | lecture_seule. Le contrôle réel se fait dans
      // lib/permissions.js, jamais seulement par la présence de ce champ.
      role: {
        type: 'string',
        required: true,
        defaultValue: 'lecture_seule',
        // Jamais modifiable par la personne elle-même à l'inscription :
        // seul un Super administrateur change un rôle (écran Utilisateurs).
        input: false,
      },
    },
  },
})
