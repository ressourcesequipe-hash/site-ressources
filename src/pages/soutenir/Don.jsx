import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import DonModal from '../../components/DonModal'

const BREADCRUMBS = [
  { label: 'Soutenir', href: '/soutenir/' },
  { label: 'Faire un don' },
]

export default function Don() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <DonModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <SEO
        title="Faire un don déductible des impôts — Association Ressources, Landes"
        description="Faites un don à l'association Ressources, reconnue d'intérêt général. Don déductible à 66 % de l'impôt sur le revenu. Financez la recyclerie informatique et végétale solidaire dans les Landes (40560)."
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
                  { montant: '10 €', usage: 'participe aux petits frais nécessaires au tri, à l\'étiquetage, au nettoyage, au rempotage ou à la préparation des ressources collectées' },
                  { montant: '25 €', usage: 'aide à organiser les premières collectes locales : matériel informatique, plantes, pots, contenants ou petits équipements réemployables' },
                  { montant: '50 €', usage: 'contribue aux consommables, aux déplacements et aux frais logistiques nécessaires aux actions de terrain' },
                  { montant: '100 €', usage: 'soutient la remise en circulation de ressources utiles : ordinateur, périphériques, plantes, contenants, lots solidaires ou matériel reconditionné' },
                  { montant: '250 €', usage: 'participe au financement d\'une opération complète de collecte, tri, valorisation et redistribution sur le territoire' },
                  { montant: '500 €', usage: 'aide aux investissements de lancement : équipement de l\'atelier, stockage, outillage, diagnostic, sécurité et aménagement des espaces de travail' },
                ].map(({ montant, usage }) => (
                  <div key={montant} className="flex items-center gap-4 py-3 border-b border-beige last:border-0">
                    <span className="font-serif text-xl text-ocre w-16 shrink-0">{montant}</span>
                    <span className="text-sm text-terre/65">{usage}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {/* Reçu fiscal */}
              <div className="bg-kaki text-white p-5 mb-5 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-0.5 bg-ocre" />
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-ocre shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-sans text-xs font-bold tracking-widest uppercase text-ocre mb-1">
                      Don déductible des impôts
                    </p>
                    <p className="text-sm text-white/80 leading-relaxed">
                      L'association Ressources est reconnue d'intérêt général. Votre don ouvre droit à une <strong className="text-white">réduction d'impôt de 66 %</strong> du montant versé (dans la limite de 20 % du revenu imposable). Un reçu fiscal vous est délivré automatiquement.
                    </p>
                    <p className="text-xs text-white/45 mt-2">Ex. : un don de 100 € ne vous coûte réellement que 34 €.</p>
                  </div>
                </div>
              </div>

              <div className="bg-ocre-pale border border-ocre/20 p-6 mb-5">
                <h3 className="font-serif text-lg text-terre mb-3">Modalités de don</h3>
                <p className="text-sm text-terre/65 leading-relaxed mb-4">
                  Paiement sécurisé en ligne via HelloAsso — par carte bancaire. L'association
                  reçoit l'intégralité de votre don. Vous pouvez aussi nous contacter directement.
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  className="btn-ocre text-sm w-full justify-center mb-4"
                >
                  Faire un don en ligne
                </button>
                <div className="space-y-2 text-sm border-t border-ocre/15 pt-4">
                  <a href="mailto:contact@ressourcesrecyclerie.fr" className="block text-ocre hover:underline">
                    contact@ressourcesrecyclerie.fr
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

          <div className="flex flex-wrap gap-4 items-center">
            <button onClick={() => setModalOpen(true)} className="btn-ocre">
              Faire un don maintenant
            </button>
            <Link to="/soutenir/tombola/" className="btn-kaki">
              Tombola solidaire — 03 octobre
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
