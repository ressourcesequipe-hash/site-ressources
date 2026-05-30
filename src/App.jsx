import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Evenement from './pages/Evenement'
import RecyclerieInfo from './pages/RecyclerieInfo'
import RecyclerieVegetale from './pages/RecyclerieVegetale'
import Association from './pages/Association'
import Soutenir from './pages/Soutenir'
import CommentDonner from './pages/info/CommentDonner'
import MaterielAccepte from './pages/info/MaterielAccepte'
import Reconditionnement from './pages/info/Reconditionnement'
import EffacementDonnees from './pages/info/EffacementDonnees'
import Beneficiaires from './pages/info/Beneficiaires'
import CommentDonnerVeg from './pages/vegetale/CommentDonnerVeg'
import CeQueNousAcceptons from './pages/vegetale/CeQueNousAcceptons'
import RedistributionVeg from './pages/vegetale/RedistributionVeg'
import PartenairesVegetaux from './pages/vegetale/PartenairesVegetaux'
import Gouvernance from './pages/association/Gouvernance'
import Territoire from './pages/association/Territoire'
import Partenaires from './pages/association/Partenaires'
import Actualites from './pages/association/Actualites'
import ArticlePage from './pages/association/ArticlePage'
import NousRejoindre from './pages/association/NousRejoindre'
import Tombola from './pages/soutenir/Tombola'
import Benevole from './pages/soutenir/Benevole'
import Mecene from './pages/soutenir/Mecene'
import Don from './pages/soutenir/Don'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/evenement-lancement-03-octobre-2026/" element={<Evenement />} />
        <Route path="/recyclerie-informatique/" element={<RecyclerieInfo />} />
        <Route path="/recyclerie-informatique/comment-donner/" element={<CommentDonner />} />
        <Route path="/recyclerie-informatique/materiel-accepte/" element={<MaterielAccepte />} />
        <Route path="/recyclerie-informatique/reconditionnement/" element={<Reconditionnement />} />
        <Route path="/recyclerie-informatique/effacement-donnees/" element={<EffacementDonnees />} />
        <Route path="/recyclerie-informatique/beneficiaires/" element={<Beneficiaires />} />
        <Route path="/recyclerie-vegetale/" element={<RecyclerieVegetale />} />
        <Route path="/recyclerie-vegetale/comment-donner/" element={<CommentDonnerVeg />} />
        <Route path="/recyclerie-vegetale/ce-que-nous-acceptons/" element={<CeQueNousAcceptons />} />
        <Route path="/recyclerie-vegetale/redistribution/" element={<RedistributionVeg />} />
        <Route path="/recyclerie-vegetale/partenaires-vegetaux/" element={<PartenairesVegetaux />} />
        <Route path="/association/" element={<Association />} />
        <Route path="/association/gouvernance/" element={<Gouvernance />} />
        <Route path="/association/territoire/" element={<Territoire />} />
        <Route path="/association/partenaires/" element={<Partenaires />} />
        <Route path="/association/actualites/" element={<Actualites />} />
        <Route path="/association/actualites/:slug/" element={<ArticlePage />} />
        <Route path="/association/nous-rejoindre/" element={<NousRejoindre />} />
        <Route path="/soutenir/" element={<Soutenir />} />
        <Route path="/soutenir/tombola/" element={<Tombola />} />
        <Route path="/soutenir/benevole/" element={<Benevole />} />
        <Route path="/soutenir/mecene/" element={<Mecene />} />
        <Route path="/soutenir/don/" element={<Don />} />
      </Routes>
    </BrowserRouter>
  )
}
