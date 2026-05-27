import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'

const BREADCRUMBS = [
  { label: 'L\'Association', href: '/association/' },
  { label: 'Nous rejoindre' },
]

export default function NousRejoindre() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Rejoindre l'association Ressources — bénévoles & mécènes Landes"
        description="Rejoignez l'équipe de l'association Ressources dans les Landes : bénévolat, mécénat, partenariat. Contribuez au projet de recyclerie solidaire à Vielle-Saint-Girons."
        canonical="/association/nous-rejoindre/"
      />

      <section className="bg-beige-light py-12 md:py-16 border-b border-beige-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="section-label">Engagement</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">Nous rejoindre</h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Vous partagez nos valeurs de réemploi et de solidarité territoriale ?
            Il y a plusieurs façons de rejoindre et soutenir l'aventure Ressources.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-14">
            <div className="border-t-2 border-ocre pt-6">
              <h2 className="font-serif text-xl text-terre mb-3">Bénévole</h2>
              <p className="text-sm text-terre/60 leading-relaxed mb-4">
                Rejoignez l'équipe opérationnelle pour la collecte, le tri,
                le reconditionnement ou les événements. Aucune compétence technique
                requise, formation assurée.
              </p>
              <Link to="/soutenir/benevole/" className="btn-ocre text-sm">
                Inscription bénévole
              </Link>
            </div>
            <div className="border-t-2 border-kaki pt-6">
              <h2 className="font-serif text-xl text-terre mb-3">Mécène / Sponsor</h2>
              <p className="text-sm text-terre/60 leading-relaxed mb-4">
                Associez votre entreprise ou commerce à un projet solidaire et local.
                Visibilité lors des événements, mentions dans nos communications.
              </p>
              <Link to="/soutenir/mecene/" className="btn-kaki text-sm">
                Devenir mécène
              </Link>
            </div>
            <div className="border-t-2 border-beige-dark pt-6">
              <h2 className="font-serif text-xl text-terre mb-3">Partenaire institutionnel</h2>
              <p className="text-sm text-terre/60 leading-relaxed mb-4">
                Commune, intercommunalité, établissement public — rejoignez
                le réseau territorial de Ressources pour amplifier l'impact local.
              </p>
              <Link to="/association/partenaires/" className="btn-outline-ocre text-sm">
                En savoir plus
              </Link>
            </div>
          </div>

          {/* Formulaire contact général */}
          <div className="bg-kaki-pale border border-kaki/15 p-8">
            <h2 className="font-serif text-2xl text-terre mb-2">Prendre contact</h2>
            <p className="text-sm text-terre/60 mb-6">
              Un question, une proposition, une envie de vous impliquer — écrivez-nous.
            </p>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="text" required className="input-field" placeholder="Prénom & nom *" />
                <input type="email" required className="input-field" placeholder="Email *" />
              </div>
              <input type="text" className="input-field" placeholder="Commune" />
              <select className="input-field">
                <option value="">Type d'engagement souhaité</option>
                <option>Bénévolat — filière informatique</option>
                <option>Bénévolat — filière végétale</option>
                <option>Bénévolat — événements</option>
                <option>Mécénat / Sponsoring</option>
                <option>Partenariat institutionnel</option>
                <option>Autre</option>
              </select>
              <textarea rows={3} className="input-field resize-none" placeholder="Votre message…" />
              <button type="submit" className="btn-ocre">Envoyer</button>
            </form>
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
