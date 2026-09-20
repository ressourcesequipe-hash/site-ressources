import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { authClient } from '../lib/authClient'
import AdminLayout from './AdminLayout'

// Garde-fou côté client : confort d'affichage (redirection immédiate vers
// l'écran de connexion), jamais la vraie protection. Chaque route d'API
// revérifie les droits côté serveur dans tous les cas (§1 de l'architecture,
// §24.3 du cahier : masquer un écran ne suffit jamais à sécuriser une action).
//
// `titre` est fixe pour l'instant : une seule page existe (Tableau de bord).
// À revoir (contexte de route, ou `titre` par route) dès qu'une deuxième page
// rejoint l'espace protégé en Étape 2.
export default function ProtectedRoute({ titre }) {
  const { data: session, isPending } = authClient.useSession()
  const location = useLocation()

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-light">
        <p className="text-terre/50 text-sm">Chargement…</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/connexion" state={{ from: location }} replace />
  }

  return (
    <AdminLayout titre={titre}>
      <Outlet />
    </AdminLayout>
  )
}
