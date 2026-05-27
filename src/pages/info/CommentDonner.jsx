import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'

const BREADCRUMBS = [
  { label: 'Recyclerie Informatique', href: '/recyclerie-informatique/' },
  { label: 'Comment donner' },
]

export default function CommentDonner() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Comment donner son matériel informatique dans les Landes"
        description="Donnez votre ordinateur, tablette ou smartphone dans les Landes (40). Points de collecte, enlèvement à domicile, démarche simplifiée — association Ressources, Vielle-Saint-Girons."
        canonical="/recyclerie-informatique/comment-donner/"
      />

      <section className="bg-kaki-pale py-12 md:py-16 border-b border-kaki/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Recyclerie informatique
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">
            Comment donner son matériel informatique
          </h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Donner est simple et rapide. Voici les différentes façons de nous
            confier vos équipements dans les Landes.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {[
              {
                num: '1',
                title: 'Points de collecte',
                desc: 'Déposez directement votre matériel dans l\'un de nos points de collecte partenaires sur le territoire. Lieux à venir.',
                note: 'Carte des points de collecte — à compléter',
              },
              {
                num: '2',
                title: 'Enlèvement à domicile',
                desc: 'Vous avez plusieurs équipements ou une mobilité réduite ? Nous organisons un enlèvement à votre adresse.',
                note: 'Formulaire ci-dessous',
              },
              {
                num: '3',
                title: 'Événement du 17 octobre',
                desc: 'Apportez votre matériel directement lors de notre journée de lancement à Vielle-Saint-Girons.',
                note: 'Challenge 1 tonne',
              },
            ].map(({ num, title, desc, note }) => (
              <div key={num} className="border-t-2 border-ocre pt-6">
                <span className="font-serif text-3xl text-ocre/30 block mb-3 leading-none">{num}</span>
                <h2 className="font-serif text-xl text-terre mb-2">{title}</h2>
                <p className="text-sm text-terre/55 leading-relaxed mb-3">{desc}</p>
                <p className="text-xs text-ocre font-medium italic">{note}</p>
              </div>
            ))}
          </div>

          {/* Points de collecte placeholder */}
          <div className="bg-beige-light border border-beige-dark p-6 md:p-8 mb-10">
            <h2 className="font-serif text-xl text-terre mb-4">📍 Points de collecte</h2>
            <p className="text-sm text-terre/55 leading-relaxed mb-4">
              Les points de collecte sont en cours de définition avec nos partenaires communes
              et intercommunalités. Ils seront mis à jour dès ouverture officielle (sept. 2026).
            </p>
            <div className="bg-white border border-beige rounded p-4 text-sm text-terre/40 italic text-center">
              Carte des points de collecte — disponible en septembre 2026
            </div>
          </div>

          {/* Formulaire enlèvement */}
          <div>
            <h2 className="font-serif text-2xl text-terre mb-6">Demander un enlèvement</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-terre/60 mb-1.5">Prénom & nom *</label>
                  <input type="text" required className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-terre/60 mb-1.5">Téléphone *</label>
                  <input type="tel" required className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-terre/60 mb-1.5">Email *</label>
                <input type="email" required className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-medium text-terre/60 mb-1.5">Adresse d'enlèvement *</label>
                <input type="text" required className="input-field" placeholder="Adresse + commune" />
              </div>
              <div>
                <label className="block text-xs font-medium text-terre/60 mb-1.5">Matériel à donner *</label>
                <textarea rows={3} required className="input-field resize-none" placeholder="Ex : 2 ordinateurs portables, 1 écran, des câbles…" />
              </div>
              <button type="submit" className="btn-ocre">Envoyer la demande</button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-8 bg-beige border-t border-beige-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-wrap gap-4 text-sm">
          <Link to="/recyclerie-informatique/" className="text-kaki hover:text-ocre transition-colors">
            ← Retour à la recyclerie informatique
          </Link>
          <span className="text-terre/20">|</span>
          <Link to="/recyclerie-informatique/materiel-accepte/" className="text-kaki hover:text-ocre transition-colors">
            Matériel accepté →
          </Link>
        </div>
      </section>
    </Layout>
  )
}
