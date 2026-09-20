// Client d'authentification côté navigateur — utilisé uniquement par les
// écrans sous /admin. Jamais importé par le site public : ce fichier vit
// sous src/admin/ précisément pour que rien ici ne se retrouve, même par
// erreur, dans le bundle des pages publiques.
//
// `basePath` doit correspondre exactement à celui déclaré côté serveur
// (lib/auth.js) — vérifié le 19/09/2026 contre better-auth 1.7.5.
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  basePath: '/api/auth',
})
