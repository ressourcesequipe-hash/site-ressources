import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'

const BREADCRUMBS = [
  { label: 'Recyclerie Informatique', href: '/recyclerie-informatique/' },
  { label: 'Qui peut bénéficier' },
]

export default function Beneficiaires() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Qui peut recevoir du matériel informatique reconditionné — Landes"
        description="L'association Ressources redistribue les équipements reconditionnés aux personnes et structures prioritaires dans les Landes (40) : familles en précarité numérique, associations, écoles."
        canonical="/recyclerie-informatique/beneficiaires/"
      />

      <section className="bg-kaki-pale py-12 md:py-16 border-b border-kaki/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Inclusion numérique
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">
            Qui peut bénéficier du matériel reconditionné ?
          </h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Les équipements reconditionnés par Ressources sont redistribués selon des
            critères de priorité sociale et territoriale dans les Landes.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <h2 className="font-serif text-2xl text-terre mb-6">Bénéficiaires prioritaires</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { icon: '👨‍👩‍👧', title: 'Familles en précarité numérique', desc: 'Personnes sans équipement informatique, orientées par les travailleurs sociaux ou les structures d\'accompagnement.' },
                { icon: '🏫', title: 'Établissements scolaires', desc: 'Écoles, collèges et lycées du territoire manquant d\'équipements pour les élèves.' },
                { icon: '🤝', title: 'Associations locales', desc: 'Associations de proximité dont les ressources ne permettent pas l\'achat de matériel neuf.' },
                { icon: '💼', title: 'Structures d\'insertion', desc: 'ESAT, CHRS, centres sociaux et structures d\'accompagnement vers l\'emploi.' },
                { icon: '🏘️', title: 'Communes et collectivités', desc: 'Mairies et intercommunalités partenaires pour des usages citoyens et solidaires.' },
                { icon: '👴', title: 'Seniors isolés', desc: 'Personnes âgées souhaitant accéder au numérique sans moyens pour équipement neuf.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex gap-4 p-5 bg-beige-light border border-beige">
                  <span className="text-2xl shrink-0" aria-hidden>{icon}</span>
                  <div>
                    <p className="font-sans text-sm font-semibold text-terre mb-1">{title}</p>
                    <p className="text-xs text-terre/55 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-ocre-pale border border-ocre/20 p-6 mb-8">
            <h2 className="font-serif text-xl text-terre mb-3">Comment faire une demande ?</h2>
            <p className="text-sm text-terre/65 leading-relaxed mb-4">
              Les demandes de matériel se font via les structures partenaires (services sociaux,
              mairies, associations référentes) ou directement auprès de l'association.
              Le processus de demande sera formalisé lors de l'ouverture officielle en septembre 2026.
            </p>
            <a href="mailto:ressources.equipe@gmail.com" className="btn-ocre text-sm">
              Nous contacter pour une demande
            </a>
          </div>

          <Link to="/recyclerie-informatique/" className="text-sm text-kaki hover:text-ocre transition-colors">
            ← Retour à la recyclerie informatique
          </Link>
        </div>
      </section>
    </Layout>
  )
}
