import EventBanner from './EventBanner'
import Header from './Header'
import Footer from './Footer'
import Breadcrumb from './Breadcrumb'

// newsletter={false} retire le formulaire du pied de page, sur les pages qui
// ont déjà le leur : sans ça, le même champ s'afficherait deux fois de suite.
export default function Layout({ children, breadcrumbs = null, newsletter = true }) {
  return (
    <div className="flex flex-col min-h-screen">
      <EventBanner />
      <Header />
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      <main className="flex-1">{children}</main>
      <Footer newsletter={newsletter} />
    </div>
  )
}
