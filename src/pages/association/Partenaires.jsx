import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'

const BREADCRUMBS = [
  { label: 'L\'Association', href: '/association/' },
  { label: 'Partenaires' },
]

const PARTENAIRES = [
  { nom: 'SITCOM40', type: 'Partenaire institutionnel', desc: 'Syndicat Intercommunal de Traitement des COrdures Ménagères des Landes. Partenaire clé pour la collecte et le recyclage.' },
  { nom: 'Mairie de Vielle-Saint-Girons', type: 'Partenaire fondateur', desc: 'La commune hôte accompagne l\'association depuis sa création et soutient le déploiement de la filière sur son territoire.' },
  { nom: 'CC Côte Landes Nature', type: 'Partenaire institutionnel', desc: 'L\'intercommunalité soutient le projet dans le cadre de sa politique de développement durable et d\'inclusion.' },
  { nom: 'CC MACS', type: 'Partenaire institutionnel', desc: 'Maremne Adour Côte-Sud — partenaire pour l\'extension du maillage territorial de collecte.' },
]

export default function Partenaires() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Partenaires de l'association Ressources — Landes"
        description="Les partenaires institutionnels et locaux de l'association Ressources dans les Landes : SITCOM40, Mairie de Vielle-Saint-Girons, CC Côte Landes Nature, CC MACS."
        canonical="/association/partenaires/"
      />

      <section className="bg-beige-light py-12 md:py-16 border-b border-beige-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="section-label">Réseau territorial</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">
            Nos partenaires dans les Landes
          </h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            L'association Ressources s'appuie sur un réseau de partenaires institutionnels
            et locaux pour construire un réemploi solidaire à l'échelle du territoire.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl text-terre mb-8">Partenaires actuels</h2>
          <div className="grid sm:grid-cols-2 gap-6 mb-14">
            {PARTENAIRES.map(({ nom, type, desc }) => (
              <div key={nom} className="border border-beige-dark p-6">
                <div className="w-full h-16 bg-beige-light flex items-center justify-center mb-4 border border-beige">
                  <p className="text-sm text-terre/40 font-medium">{nom}</p>
                </div>
                <p className="text-xs text-ocre font-semibold tracking-wider uppercase mb-2">{type}</p>
                <p className="font-serif text-lg text-terre mb-2">{nom}</p>
                <p className="text-sm text-terre/55 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* CTA nouvelles communes */}
          <div className="bg-kaki text-white p-8 md:p-10">
            <div className="max-w-xl">
              <p className="font-sans text-ocre text-xs font-semibold tracking-widest uppercase mb-3">
                Rejoignez le réseau
              </p>
              <h2 className="font-serif text-2xl text-white mb-3">
                Votre commune souhaite s'engager ?
              </h2>
              <p className="text-white/65 text-sm leading-relaxed mb-6">
                Collectivités, entreprises locales, associations — nous sommes
                ouverts à tout partenariat qui renforce l'impact du projet
                sur le territoire landais.
              </p>
              <a href="mailto:ressources.equipe@gmail.com" className="btn-ocre text-sm">
                Nous contacter pour un partenariat
              </a>
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
