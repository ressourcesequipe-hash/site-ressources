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

    // 48 heures, et non l'heure par défaut : le même mécanisme sert aux
    // invitations, et quelqu'un à qui l'on crée un accès le vendredi soir ne
    // doit pas trouver un lien périmé le lundi matin. Le jeton reste à usage
    // unique, ce qui est la protection qui compte.
    resetPasswordTokenExpiresIn: 48 * 60 * 60,

    // Le même appel sert à inviter et à réinitialiser ; seul le texte change.
    // Distinguer les deux tient à `doitDefinirMotDePasse`, posé à la création
    // du compte : écrire « réinitialisez votre mot de passe » à quelqu'un qui
    // n'en a jamais eu n'aurait aucun sens.
    async sendResetPassword({ user: destinataire, url }) {
      const { envoyerEmailEquipe } = await import('./email-equipe.js')
      const type = destinataire.doitDefinirMotDePasse ? 'invitation' : 'reinitialisation'
      await envoyerEmailEquipe(type, destinataire, url)
    },

    // Le mot de passe vient d'être choisi : l'invitation est consommée.
    async onPasswordReset({ user: compte }) {
      const { db } = await import('./db.js')
      const { user: table } = await import('../db/schema.js')
      const { eq } = await import('drizzle-orm')
      await db.update(table).set({ doitDefinirMotDePasse: false }).where(eq(table.id, compte.id))
    },
  },

  // Un compte désactivé ne doit plus pouvoir ouvrir de session (§21, §26).
  //
  // C'est bien ici et non dans `user.validateUserInfo` : la documentation de
  // better-auth 1.7.5 précise que ce dernier n'est pas rappelé pour une
  // connexion email/mot de passe d'un compte existant. Vérifié en conditions
  // réelles le 21/09/2026, pas seulement lu.
  //
  // Désactiver supprime aussi les sessions en cours (voir
  // api/admin/utilisateurs.js) : sans cela, quelqu'un dont on retire l'accès
  // resterait connecté jusqu'à l'expiration de son cookie.
  databaseHooks: {
    session: {
      create: {
        async before(session) {
          const { db } = await import('./db.js')
          const { user: table } = await import('../db/schema.js')
          const { eq } = await import('drizzle-orm')
          const [compte] = await db
            .select({ actif: table.actif })
            .from(table)
            .where(eq(table.id, session.userId))
          if (compte && compte.actif === false) return false
          return { data: session }
        },
      },
    },
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
      // Exposés sur la session pour que l'interface puisse les lire sans
      // requête supplémentaire. `input: false` comme le rôle : ce sont des
      // décisions d'administration, jamais des champs de formulaire.
      actif: { type: 'boolean', required: false, defaultValue: true, input: false },
      doitDefinirMotDePasse: { type: 'boolean', required: false, defaultValue: false, input: false },
    },
  },
})
