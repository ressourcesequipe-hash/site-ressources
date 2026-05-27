import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'

const BREADCRUMBS = [
  { label: 'Recyclerie Végétale', href: '/recyclerie-vegetale/' },
  { label: 'Partenaires végétaux' },
]

export default function PartenairesVegetaux() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Partenaires végétaux — recyclerie végétale Landes"
        description="Rejoignez le réseau de partenaires végétaux de l'association Ressources dans les Landes. Communes, campings, pépinières, fleuristes — devenez point de collecte ou de redistribution."
        canonical="/recyclerie-vegetale/partenaires-vegetaux/"
      />

      <section className="bg-kaki-pale py-12 md:py-16 border-b border-kaki/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-kaki text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Recyclerie végétale
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">
            Partenaires végétaux
          </h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Communes, campings, pépinières, fleuristes, jardineries — rejoignez
            le réseau de la recyclerie végétale solidaire dans les Landes.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl text-terre mb-8">Comment devenir partenaire végétal ?</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              { titre: '📍 Point de collecte', desc: 'Votre site accueille les dépôts de plantes et matériels. Idéal pour les communes, mairies, déchetteries végétales, jardineries.' },
              { titre: '🌱 Point de redistribution', desc: 'Votre structure sert de lieu de distribution à vos usagers ou clients. Idéal pour les centres sociaux, EHPAD, campings.' },
              { titre: '🌿 Partenaire de soin', desc: 'Vous disposez d\'un espace pour accueillir temporairement des plantes en attente de redistribution. Idéal pour pépiniéristes.' },
              { titre: '📣 Partenaire relais', desc: 'Vous relayez nos actions sur vos réseaux et auprès de votre clientèle. Idéal pour tout commerce local.' },
            ].map(({ titre, desc }) => (
              <div key={titre} className="border-l-2 border-kaki pl-5 py-2">
                <h3 className="font-serif text-lg text-terre mb-2">{titre}</h3>
                <p className="text-sm text-terre/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-kaki text-white p-8 mb-8">
            <h2 className="font-serif text-2xl text-white mb-4">Votre structure souhaite s'engager ?</h2>
            <p className="text-white/65 text-sm leading-relaxed mb-6">
              Contactez-nous pour discuter d'un partenariat végétal adapté à votre situation.
              Nous construisons le réseau progressivement pour l'ouverture de septembre 2026.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-3">
                <input type="text" className="input-field" placeholder="Nom de la structure *" required />
                <input type="text" className="input-field" placeholder="Commune *" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input type="text" className="input-field" placeholder="Contact *" required />
                <input type="email" className="input-field" placeholder="Email *" required />
              </div>
              <textarea rows={2} className="input-field resize-none" placeholder="Type de partenariat envisagé…" />
              <button type="submit" className="btn-ocre text-sm">Nous contacter</button>
            </form>
          </div>

          <Link to="/recyclerie-vegetale/" className="text-sm text-kaki hover:text-ocre transition-colors">
            ← Retour à la recyclerie végétale
          </Link>
        </div>
      </section>
    </Layout>
  )
}
