import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'

const BREADCRUMBS = [
  { label: 'L\'Association', href: '/association/' },
  { label: 'Gouvernance' },
]

const EQUIPE = [
  { nom: 'Sandrine VESTRIS', role: 'Présidente', initiale: 'S', desc: 'Porteuse du projet depuis l\'origine, Sandrine anime le collectif et coordonne les partenariats institutionnels avec les communes et intercommunalités.' },
  { nom: 'Boris LALANNE', role: 'Référent projet — filière informatique', initiale: 'B', desc: 'Boris pilote la conception et le déploiement de la filière informatique : collecte, reconditionnement, partenariats techniques et inclusion numérique.' },
  { nom: 'Rose MAURY', role: 'Secrétaire & Trésorière', initiale: 'R', desc: 'Rose assure la vie associative : convocations, comptes-rendus, gestion des adhésions et des inscriptions bénévoles, communication avec les adhérents.' },
]

export default function Gouvernance() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Gouvernance de l'association Ressources"
        description="Découvrez l'équipe qui dirige l'association Ressources à Vielle-Saint-Girons (Landes) : Sandrine VESTRIS (présidente), Boris LALANNE (référent projet), Rose MAURY (secrétaire)."
        canonical="/association/gouvernance/"
      />

      <section className="bg-beige-light py-12 md:py-16 border-b border-beige-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="section-label">L'association</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">Gouvernance</h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            L'association Ressources est gouvernée par un bureau composé de trois membres fondateurs,
            appuyés par une équipe de bénévoles engagés.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl text-terre mb-8">Le bureau</h2>
          <div className="grid sm:grid-cols-3 gap-6 mb-14">
            {EQUIPE.map(({ nom, role, initiale, desc }) => (
              <div key={nom} className="bg-beige-light border border-beige-dark p-6">
                <div className="w-12 h-12 rounded-full bg-kaki flex items-center justify-center mb-4">
                  <span className="font-serif text-white text-xl font-bold">{initiale}</span>
                </div>
                <p className="font-serif text-xl text-terre mb-0.5">{nom}</p>
                <p className="text-xs text-ocre font-semibold tracking-wider uppercase mb-4">{role}</p>
                <p className="text-sm text-terre/55 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-beige-dark pt-10">
            <h2 className="font-serif text-2xl text-terre mb-4">L'équipe bénévole</h2>
            <p className="text-terre/60 text-sm leading-relaxed mb-6 max-w-2xl">
              L'association est portée par un réseau de bénévoles actifs sur le territoire landais.
              Ils interviennent sur la collecte, le reconditionnement, la communication,
              la logistique et les événements.
            </p>
            <div className="bg-beige-light border border-beige-dark p-6">
              <p className="font-sans text-sm text-terre/65 mb-4">
                <strong className="text-terre">Objectif an 1 : 8 bénévoles réguliers.</strong>{' '}
                Les recrutements sont en cours. Vous souhaitez nous rejoindre ?
              </p>
              <Link to="/association/nous-rejoindre/" className="btn-ocre text-sm">
                Rejoindre l'équipe bénévole
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 bg-beige border-t border-beige-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link to="/association/" className="text-sm text-kaki hover:text-ocre transition-colors">
            ← Retour à l'association
          </Link>
        </div>
      </section>
    </Layout>
  )
}
