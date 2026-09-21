import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import ErreurAuth from './components/ErreurAuth'
import Connexion from './pages/Connexion'
import TableauDeBord from './pages/TableauDeBord'
import MotDePasse from './pages/MotDePasse'
import Actualites from './pages/Actualites'
import ActualiteEdition from './pages/ActualiteEdition'
import Evenements from './pages/Evenements'
import EvenementEdition from './pages/EvenementEdition'
import Partenaires from './pages/Partenaires'
import PartenaireEdition from './pages/PartenaireEdition'
import PointsCollecte from './pages/PointsCollecte'
import PointCollecteEdition from './pages/PointCollecteEdition'
import Ateliers from './pages/Ateliers'
import AtelierEdition from './pages/AtelierEdition'
import CategoriesAteliers from './pages/CategoriesAteliers'

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

        <Route element={<ProtectedRoute titre="Actualités" />}>
          <Route path="actualites" element={<Actualites />} />
        </Route>

        <Route element={<ProtectedRoute titre="Rédiger une actualité" />}>
          <Route path="actualites/nouvelle" element={<ActualiteEdition />} />
          <Route path="actualites/:id" element={<ActualiteEdition />} />
        </Route>

        <Route element={<ProtectedRoute titre="Événements" />}>
          <Route path="evenements" element={<Evenements />} />
        </Route>

        <Route element={<ProtectedRoute titre="Fiche événement" />}>
          <Route path="evenements/nouveau" element={<EvenementEdition />} />
          <Route path="evenements/:id" element={<EvenementEdition />} />
        </Route>

        <Route element={<ProtectedRoute titre="Partenaires" />}>
          <Route path="partenaires" element={<Partenaires />} />
        </Route>

        <Route element={<ProtectedRoute titre="Fiche partenaire" />}>
          <Route path="partenaires/nouveau" element={<PartenaireEdition />} />
          <Route path="partenaires/:id" element={<PartenaireEdition />} />
        </Route>

        <Route element={<ProtectedRoute titre="Points de collecte" />}>
          <Route path="points-collecte" element={<PointsCollecte />} />
        </Route>

        <Route element={<ProtectedRoute titre="Fiche point de collecte" />}>
          <Route path="points-collecte/nouveau" element={<PointCollecteEdition />} />
          <Route path="points-collecte/:id" element={<PointCollecteEdition />} />
        </Route>

        <Route element={<ProtectedRoute titre="Ateliers" />}>
          <Route path="ateliers" element={<Ateliers />} />
        </Route>

        <Route element={<ProtectedRoute titre="Catégories d’ateliers" />}>
          <Route path="ateliers/categories" element={<CategoriesAteliers />} />
        </Route>

        <Route element={<ProtectedRoute titre="Fiche atelier" />}>
          <Route path="ateliers/nouveau" element={<AtelierEdition />} />
          <Route path="ateliers/:id" element={<AtelierEdition />} />
        </Route>

        <Route element={<ProtectedRoute titre="Mon mot de passe" />}>
          <Route path="mot-de-passe" element={<MotDePasse />} />
        </Route>
      </Routes>
    </ErreurAuth>
  )
}
