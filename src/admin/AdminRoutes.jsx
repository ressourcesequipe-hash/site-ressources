import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import ErreurAuth from './components/ErreurAuth'
import Connexion from './pages/Connexion'
import TableauDeBord from './pages/TableauDeBord'
import MotDePasse from './pages/MotDePasse'

// Chargé paresseusement depuis src/routes.jsx (React.lazy) : un visiteur du
// site public ne télécharge jamais ce code.
//
// Chaque écran protégé est déclaré sous son propre `ProtectedRoute`, qui
// porte le titre affiché dans l'en-tête. C'est volontairement explicite et
// un peu répétitif : le titre se lit à côté de la route, sans indirection,
// et rien n'est à synchroniser ailleurs quand un module s'ajoute.
export default function AdminRoutes() {
  return (
    <ErreurAuth>
      <Routes>
        <Route path="connexion" element={<Connexion />} />

        <Route element={<ProtectedRoute titre="Tableau de bord" />}>
          <Route index element={<TableauDeBord />} />
        </Route>

        <Route element={<ProtectedRoute titre="Mon mot de passe" />}>
          <Route path="mot-de-passe" element={<MotDePasse />} />
        </Route>
      </Routes>
    </ErreurAuth>
  )
}
