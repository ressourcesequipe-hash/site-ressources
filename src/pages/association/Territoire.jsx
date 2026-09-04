import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import {
  COOPERATIONS_EN_COURS,
  MENTION_COOPERATIONS,
  PARTENAIRES_CONFIRMES,
} from '../../data/partenaires'

const BREADCRUMBS = [
  { label: 'L\'Association', href: '/association/' },
  { label: 'Notre territoire' },
]

export default function Territoire() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Territoire d'action — Landes, CC CLN & CC MACS"
        description="L'association Ressources agit sur le territoire des Landes, principalement les Communautés de Communes Côte Landes Nature et MACS, depuis Vielle-Saint-Girons."
        canonical="/association/territoire/"
      />

      <section className="bg-beige-light py-12 md:py-16 border-b border-beige-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="section-label">Ancrage local</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">Notre territoire dans les Landes</h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Fondée à Vielle-Saint-Girons, l'association Ressources construit son action
            au plus près des habitants et des communes du territoire landais.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 mb-14">
            <div>
              <h2 className="font-serif text-2xl text-terre mb-4">Zone d'action principale</h2>
              <div className="decorative-line" />
              <p className="text-terre/65 leading-relaxed mb-6">
                L'association est implantée à Vielle-Saint-Girons (40560) et
                étend son action sur deux intercommunalités voisines du littoral landais.
              </p>
              <div className="space-y-4">
                {/* Quelques communes de chaque intercommunalité, pas la liste
                    complète : Côte Landes Nature en compte dix, MACS
                    vingt-trois. Ce sont des exemples, dans un ordre qui ne
                    classe rien.

                    Deux erreurs corrigées le 04/09/2026, après vérification
                    des listes de communes des deux EPCI : Moliets-et-Maâ
                    figurait du côté de Côte Landes Nature alors qu'elle est
                    membre de MACS, et Hossegor était comptée en plus de
                    Soorts-Hossegor, qui est la même commune sous son nom
                    officiel. */}
                {[
                  { nom: 'CC Côte Landes Nature', desc: 'Communauté de Communes du littoral landais', communes: ['Vielle-Saint-Girons', 'Lit-et-Mixe', 'Saint-Julien-en-Born', 'Léon', 'Linxe'] },
                  { nom: 'CC MACS', desc: 'Maremne Adour Côte-Sud', communes: ['Capbreton', 'Seignosse', 'Soorts-Hossegor', 'Soustons'] },
                ].map(({ nom, desc, communes }) => (
                  <div key={nom} className="border-l-2 border-kaki pl-4">
                    <p className="font-sans text-sm font-semibold text-terre mb-0.5">{nom}</p>
                    <p className="text-xs text-terre/50 mb-2">{desc}</p>
                    <p className="text-xs text-terre/40 italic">{communes.join(' · ')}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-kaki text-white p-8">
                <p className="font-sans text-ocre text-xs font-semibold tracking-widest uppercase mb-4">
                  Vielle-Saint-Girons
                </p>
                <p className="font-serif text-2xl text-white mb-3">Siège de l'association</p>
                <p className="text-white/65 text-sm leading-relaxed mb-4">
                  80 allée des Cigales<br />40560 Vielle-Saint-Girons<br />Landes (40)
                </p>
                <div className="border-t border-white/10 pt-4">
                  <a href="mailto:contact@ressourcesrecyclerie.fr" className="block text-sm text-white/60 hover:text-ocre transition-colors">contact@ressourcesrecyclerie.fr</a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-beige-light border border-beige-dark p-6 mb-8">
            <h2 className="font-serif text-xl text-terre mb-3">Nos partenaires</h2>
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {PARTENAIRES_CONFIRMES.map(({ nom, label }) => (
                <div key={nom} className="flex items-start gap-2 text-sm text-terre/65">
                  <span className="w-1.5 h-1.5 rounded-full bg-ocre shrink-0 mt-1.5" />
                  <span>
                    {nom}
                    <span className="block text-xs text-terre/40">{label}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-beige-dark pt-5">
              <h3 className="font-sans text-xs font-bold tracking-[0.15em] uppercase text-terre/45 mb-2">
                Échanges et coopérations en cours
              </h3>
              <p className="text-xs text-terre/50 leading-relaxed mb-3">
                {MENTION_COOPERATIONS}
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {COOPERATIONS_EN_COURS.map(({ nom, label }) => (
                  <div key={nom} className="flex items-start gap-2 text-sm text-terre/55">
                    <span className="w-1.5 h-1.5 rounded-full bg-kaki/30 shrink-0 mt-1.5" />
                    <span>
                      {nom}
                      <span className="block text-xs text-terre/35">{label}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/association/partenaires/" className="btn-outline-ocre text-sm">
              Voir tous les partenaires
            </Link>
            <Link to="/association/" className="text-sm text-kaki hover:text-ocre transition-colors pt-3.5">
              ← Retour à l'association
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
