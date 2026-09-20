import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import ErreurAuth from './components/ErreurAuth'
import Connexion from './pages/Connexion'
import TableauDeBord from './pages/TableauDeBord'

// Chargé paresseusement depuis src/routes.jsx (React.lazy) : un visiteur du
// site public ne télécharge jamais ce code.
export default function AdminRoutes() {
  return (
    <ErreurAuth>
      <Routes>
        <Route path="connexion" element={<Connexion />} />
        <Route element={<ProtectedRoute titre="Tableau de bord" />}>
          <Route index element={<TableauDeBord />} />
        </Route>
      </Routes>
    </ErreurAuth>
  )
}
