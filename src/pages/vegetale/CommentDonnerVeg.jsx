import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'

const BREADCRUMBS = [
  { label: 'Recyclerie Végétale', href: '/recyclerie-vegetale/' },
  { label: 'Comment donner' },
]

export default function CommentDonnerVeg() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Donner des Plantes dans les Landes — Recyclerie Végétale | Ressources"
        description="Donnez vos plantes, contenants et outils de jardin dans les Landes (40). Ressources collecte et propose vos végétaux à la vente solidaire sur le territoire landais. Vielle-Saint-Girons (40560)."
        canonical="/recyclerie-vegetale/comment-donner/"
      />

      <section style={{ backgroundColor: "#EDECCE", borderColor: 'rgba(108,124,73,0.1)' }} className="py-12 md:py-16 border-b relative overflow-hidden">

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: '#6c7c49' }}>
            Recyclerie végétale
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">
            Comment donner ses plantes et végétaux
          </h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Vous avez des plantes, contenants ou outils de jardin dont vous n'avez
            plus l'usage ? Voici comment les confier à l'association Ressources.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              { titre: 'Points de collecte végétale', desc: 'Déposez vos plantes et matériels aux points de collecte partenaires. Lieux à confirmer pour l\'ouverture de septembre 2026.' },
              { titre: 'Événements de collecte', desc: 'Des journées de collecte végétale seront organisées ponctuellement sur le territoire. Suivez nos actualités pour les dates.' },
              { titre: 'Remise directe', desc: 'Contactez-nous pour convenir d\'une remise directe, notamment pour de grandes quantités ou du matériel encombrant.' },
              { titre: 'Partenaires végétaux', desc: 'Communes, campings, jardineries partenaires — certains acceptent le dépôt de végétaux via notre réseau.' },
            ].map(({ titre, desc }) => (
              <div key={titre} className="pl-5" style={{ borderLeft: '2px solid #6c7c49' }}>
                <h2 className="font-serif text-lg text-terre mb-2">{titre}</h2>
                <p className="text-sm text-terre/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="p-6 mb-8" style={{ backgroundColor: '#eef2e8', border: '1px solid rgba(108,124,73,0.15)' }}>
            <h2 className="font-serif text-xl text-terre mb-3">Nous contacter pour un don végétal</h2>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-3">
                <input type="text" className="input-field" placeholder="Prénom & nom *" required />
                <input type="tel" className="input-field" placeholder="Téléphone *" required />
              </div>
              <input type="email" className="input-field" placeholder="Email *" required />
              <input type="text" className="input-field" placeholder="Commune" />
              <textarea rows={2} className="input-field resize-none" placeholder="Décrivez ce que vous souhaitez donner (plantes, pots, outils…)" />
              <button type="submit" className="btn-veg">Envoyer</button>
            </form>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/recyclerie-vegetale/ce-que-nous-acceptons/" className="btn-outline-ocre text-sm">
              Ce que nous acceptons
            </Link>
            <Link to="/recyclerie-vegetale/" className="text-sm transition-colors pt-3.5" style={{ color: '#6c7c49' }}
              onMouseEnter={e => e.currentTarget.style.color = '#C8973A'}
              onMouseLeave={e => e.currentTarget.style.color = '#6c7c49'}>
              ← Retour à la recyclerie végétale
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}


