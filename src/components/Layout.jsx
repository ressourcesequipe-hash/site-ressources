import EventBanner from './EventBanner'
import Header from './Header'
import Footer from './Footer'
import Breadcrumb from './Breadcrumb'

export default function Layout({ children, breadcrumbs = null }) {
  return (
    <div className="flex flex-col min-h-screen">
      <EventBanner />
      <Header />
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
