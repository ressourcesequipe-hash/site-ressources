import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import AppRoutes from './routes'
import BandeauConsentement from './components/BandeauConsentement'

// Mesure d'audience — Vercel Web Analytics.
//
// Monté ici et non dans `routes.jsx` : le prérendu passe par
// `entry-server.jsx`, qui rend `AppRoutes` sans ce composant. La mesure ne
// s'exécute donc que chez le visiteur, et les 58 pages prérendues restent
// identiques au caractère près.
//
// POURQUOI CET OUTIL, ET PAS SEULEMENT GOOGLE ANALYTICS
//
// Vercel Web Analytics n'utilise aucun cookie tiers : le visiteur est
// identifié par une empreinte calculée depuis sa requête, jetée au bout de
// 24 heures, et les données sont agrégées. Aucun bandeau de consentement
// n'est donc requis, et il voit 100 % du trafic — là où un outil soumis au
// consentement n'en voit qu'une partie.
//
// Sa limite, sur le forfait Hobby (vérifié le 23/09/2026 dans la
// documentation Vercel) : 50 000 événements par mois, et surtout **un seul
// mois d'historique**, sans paramètres UTM ni événements personnalisés.
// C'est un thermomètre fiable, pas une mémoire — d'où l'ajout prévu de
// Google Analytics à côté, pour l'historique long et le suivi de campagnes.

// Le back-office n'est pas le site : y mesurer l'audience gonflerait les
// chiffres avec le travail de l'équipe, et reviendrait à observer des
// personnes identifiables dans leur outil de travail. `beforeSend` écarte
// ces vues avant tout envoi, plutôt que de monter le composant sous
// condition — ce qui laisserait passer les navigations depuis le site vers
// /admin au sein de la même session.
function ecarterBackOffice(evenement) {
  try {
    const chemin = new URL(evenement.url).pathname
    if (chemin === '/admin' || chemin.startsWith('/admin/')) return null
  } catch {
    // URL illisible : on laisse passer plutôt que de perdre la mesure.
  }
  return evenement
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Analytics beforeSend={ecarterBackOffice} />
      {/* Google Analytics ne se charge qu'après un accord explicite : tout
          passe par ce composant, qui porte aussi la demande. Vercel Web
          Analytics, lui, tourne sans condition — il n'en a pas besoin. */}
      <BandeauConsentement />
    </BrowserRouter>
  )
}
