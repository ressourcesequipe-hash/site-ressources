import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'

const BREADCRUMBS = [
  { label: 'Soutenir', href: '/soutenir/' },
  { label: 'Faire un don' },
]

export default function Don() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Faire un don à l'association Ressources — Landes"
        description="Faites un don à l'association Ressources pour financer la recyclerie informatique et végétale solidaire dans les Landes (40560). Chaque euro contribue à l'inclusion numérique locale."
        canonical="/soutenir/don/"
      />

      <section className="bg-kaki-pale py-12 md:py-16 border-b border-kaki/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="section-label">Soutien direct</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">Faire un don</h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Votre don finance les actions de l'association Ressources : équipement,
            déplacements, formation des bénévoles. Chaque contribution compte.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 mb-12">
            <div>
              <h2 className="font-serif text-2xl text-terre mb-6">À quoi sert votre don ?</h2>
              <div className="space-y-4">
                {[
                  { montant: '10 €', usage: 'couvre les frais d\'effacement certifié d\'un appareil' },
                  { montant: '25 €', usage: 'finance la collecte et le tri de plusieurs équipements' },
                  { montant: '50 €', usage: 'participe à l\'achat d\'un outil de diagnostic' },
                  { montant: '100 €', usage: 'contribue au reconditionnement complet d\'un ordinateur' },
                  { montant: '500 €', usage: 'finance l\'équipement pour une session de collecte' },
                ].map(({ montant, usage }) => (
                  <div key={montant} className="flex items-center gap-4 py-3 border-b border-beige last:border-0">
                    <span className="font-serif text-xl text-ocre w-16 shrink-0">{montant}</span>
                    <span className="text-sm text-terre/65">{usage}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-ocre-pale border border-ocre/20 p-6 mb-5">
                <h3 className="font-serif text-lg text-terre mb-3">Modalités de don</h3>
                <p className="text-sm text-terre/65 leading-relaxed mb-3">
                  Les modalités de paiement en ligne seront disponibles lors du lancement
                  officiel de l'association. En attendant, contactez-nous directement.
                </p>
                <div className="space-y-2 text-sm">
                  <a href="mailto:ressources.equipe@gmail.com" className="block text-ocre hover:underline">
                    ressources.equipe@gmail.com
                  </a>
                  <a href="tel:+33660200388" className="block text-terre/60 hover:text-ocre transition-colors">
                    06.60.20.03.88
                  </a>
                </div>
              </div>

              <div className="bg-beige border border-beige-dark p-5">
                <p className="text-xs text-terre/40 uppercase font-semibold tracking-wider mb-2">
                  Don en nature
                </p>
                <p className="text-sm text-terre/65 leading-relaxed">
                  Vous souhaitez faire un don en matériel (informatique, outillage, matériel de bureau) ?
                  Consultez notre page dédiée.
                </p>
                <Link to="/recyclerie-informatique/comment-donner/" className="inline-block mt-3 text-sm text-ocre hover:underline font-medium">
                  Don de matériel →
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/soutenir/tombola/" className="btn-ocre">
              Tombola solidaire — 17 octobre
            </Link>
            <Link to="/soutenir/" className="text-sm text-kaki hover:text-ocre transition-colors pt-3.5">
              ← Retour à soutenir
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
