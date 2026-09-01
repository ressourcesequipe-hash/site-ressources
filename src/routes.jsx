import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Evenement from './pages/Evenement'
import DefiCollecte from './pages/DefiCollecte'
import RecyclerieInfo from './pages/RecyclerieInfo'
import RecyclerieVegetale from './pages/RecyclerieVegetale'
import Ateliers from './pages/Ateliers'
import AteliersNumerique from './pages/ateliers/AteliersNumerique'
import AteliersVegetal from './pages/ateliers/AteliersVegetal'
import AteliersCollectivites from './pages/ateliers/AteliersCollectivites'
import AteliersEntreprises from './pages/ateliers/AteliersEntreprises'
import AteliersEcoles from './pages/ateliers/AteliersEcoles'
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
import Presse from './pages/association/Presse'
import Tombola from './pages/soutenir/Tombola'
import Benevole from './pages/soutenir/Benevole'
import Mecene from './pages/soutenir/Mecene'
import Don from './pages/soutenir/Don'
import Boutique from './pages/Boutique'
import BoutiqueProduit from './pages/BoutiqueProduit'
import Contact from './pages/Contact'
import MentionsLegales from './pages/MentionsLegales'
import Confidentialite from './pages/Confidentialite'

// Remonte en haut à chaque changement de page — sauf si l'URL porte une ancre,
// auquel cas on vise l'élément correspondant. Sans ce cas particulier, un lien
// vers « /page/#ancre » était ramené en haut par le scrollTo et l'ancre restait
// lettre morte, y compris à l'ouverture directe de l'URL.
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const id = decodeURIComponent(hash.slice(1))
    let actif = true
    let restant = 10

    // scrollIntoView respecte le `scroll-margin-top` de la cible, ce qui
    // dégage l'en-tête collant.
    //
    // `behavior: 'instant'` est indispensable : la feuille de style pose
    // `html { scroll-behavior: smooth }`, si bien qu'un scrollIntoView par
    // défaut lance un défilement progressif que le chargement de la page
    // interrompt — on restait alors en haut. Sur un changement de page, le
    // saut immédiat est de toute façon le comportement attendu.
    const viser = () => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }

    // La page grandit encore pendant que les images se chargent : un saut fait
    // trop tôt bute sur un document trop court et reste en chemin — c'était le
    // cas sur grand écran, où l'on n'arrivait qu'à 115 px de haut de page. On
    // rejoue donc le saut pendant une demi-seconde, et on s'arrête net dès que
    // le visiteur reprend la main.
    const rejouer = () => {
      if (!actif || restant-- <= 0) return
      viser()
      setTimeout(rejouer, 60)
    }

    const abandonner = () => { actif = false }
    const gestes = ['wheel', 'touchstart', 'keydown']
    gestes.forEach((geste) => window.addEventListener(geste, abandonner, { passive: true }))

    rejouer()

    return () => {
      actif = false
      gestes.forEach((geste) => window.removeEventListener(geste, abandonner))
    }
  }, [pathname, hash])
  return null
}

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/evenement-lancement-03-octobre-2026/" element={<Evenement />} />
        <Route path="/defi-collecte/" element={<DefiCollecte />} />
        <Route path="/materiel-disponible/" element={<Boutique />} />
        <Route path="/materiel-disponible/:code/" element={<BoutiqueProduit />} />
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
        <Route path="/ateliers/" element={<Ateliers />} />
        <Route path="/ateliers/numerique/" element={<AteliersNumerique />} />
        <Route path="/ateliers/vegetal/" element={<AteliersVegetal />} />
        <Route path="/ateliers/collectivites/" element={<AteliersCollectivites />} />
        <Route path="/ateliers/entreprises/" element={<AteliersEntreprises />} />
        <Route path="/ateliers/ecoles/" element={<AteliersEcoles />} />
        <Route path="/association/" element={<Association />} />
        <Route path="/association/gouvernance/" element={<Gouvernance />} />
        <Route path="/association/territoire/" element={<Territoire />} />
        <Route path="/association/partenaires/" element={<Partenaires />} />
        <Route path="/association/actualites/" element={<Actualites />} />
        <Route path="/association/actualites/:slug/" element={<ArticlePage />} />
        <Route path="/association/nous-rejoindre/" element={<NousRejoindre />} />
        <Route path="/association/presse/" element={<Presse />} />
        <Route path="/soutenir/" element={<Soutenir />} />
        <Route path="/soutenir/tombola/" element={<Tombola />} />
        <Route path="/soutenir/benevole/" element={<Benevole />} />
        <Route path="/soutenir/mecene/" element={<Mecene />} />
        <Route path="/soutenir/don/" element={<Don />} />
        <Route path="/contact/" element={<Contact />} />
        <Route path="/mentions-legales/" element={<MentionsLegales />} />
        <Route path="/confidentialite/" element={<Confidentialite />} />
      </Routes>
    </>
  )
}
