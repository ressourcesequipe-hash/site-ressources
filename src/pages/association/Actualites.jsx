import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'

const BREADCRUMBS = [
  { label: 'L\'Association', href: '/association/' },
  { label: 'Actualités' },
]

const ARTICLES = [
  {
    date: 'Mai 2026',
    categorie: 'Événement',
    titre: 'Événement de lancement confirmé pour le 17 octobre 2026',
    extrait: 'L\'association Ressources organise sa grande journée de lancement à Vielle-Saint-Girons. Challenge collecte, tombola solidaire, festivités — programme complet à venir.',
    lien: '/evenement-lancement-17-octobre-2026/',
    accentColor: 'ocre',
  },
  {
    date: 'Avril 2026',
    categorie: 'Partenariat',
    titre: 'SITCOM40 rejoint le réseau partenaire',
    extrait: 'Le syndicat intercommunal SITCOM40 s\'associe à l\'association Ressources pour le maillage territorial de la collecte informatique dans les Landes.',
    lien: '/association/partenaires/',
    accentColor: 'kaki',
  },
  {
    date: 'Mars 2026',
    categorie: 'Association',
    titre: 'Appel aux bénévoles — filière informatique',
    extrait: 'Ressources recrute ses premiers bénévoles pour la filière informatique. Démarrage en septembre 2026, formation assurée. Inscriptions ouvertes.',
    lien: '/association/nous-rejoindre/',
    accentColor: 'kaki',
  },
  {
    date: 'Janvier 2026',
    categorie: 'Projet',
    titre: 'Démarrage de la phase de préparation',
    extrait: 'L\'équipe fondatrice finalise les partenariats institutionnels et prépare les outils opérationnels pour le démarrage pilote de septembre 2026.',
    lien: null,
    accentColor: 'kaki',
  },
]

export default function Actualites() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Actualités de l'association Ressources — Landes"
        description="Suivez les actualités de l'association Ressources, recyclerie solidaire dans les Landes : événements, partenariats, appels aux bénévoles, avancement du projet."
        canonical="/association/actualites/"
      />

      <section className="bg-beige-light py-12 md:py-16 border-b border-beige-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="section-label">Fil d'actualités</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">Actualités</h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Suivez la vie de l'association Ressources et l'avancement du projet
            de recyclerie solidaire dans les Landes.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-6">
            {ARTICLES.map(({ date, categorie, titre, extrait, lien, accentColor }) => (
              <article key={titre} className={`border-l-4 ${accentColor === 'ocre' ? 'border-ocre' : 'border-kaki'} bg-beige-light p-6`}>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-xs text-terre/40 font-mono">{date}</span>
                  <span className={`text-xs font-semibold tracking-wider uppercase px-2 py-0.5 ${accentColor === 'ocre' ? 'bg-ocre/10 text-ocre' : 'bg-kaki/10 text-kaki'}`}>
                    {categorie}
                  </span>
                </div>
                <h2 className="font-serif text-xl text-terre mb-2">
                  {lien ? (
                    <Link to={lien} className="hover:text-ocre transition-colors">{titre}</Link>
                  ) : titre}
                </h2>
                <p className="text-sm text-terre/60 leading-relaxed mb-3">{extrait}</p>
                {lien && (
                  <Link to={lien} className="text-xs text-ocre font-semibold hover:underline">
                    Lire la suite →
                  </Link>
                )}
              </article>
            ))}
          </div>

          {/* Newsletter */}
          <div className="mt-12 bg-kaki-pale border border-kaki/15 p-6">
            <h2 className="font-serif text-xl text-terre mb-3">Restez informé·e</h2>
            <p className="text-sm text-terre/60 mb-4">Recevez les actualités de l'association directement dans votre boîte mail.</p>
            <form className="flex flex-wrap gap-3" onSubmit={(e) => e.preventDefault()}>
              <input type="email" required className="input-field flex-1 min-w-48" placeholder="votre@email.fr" />
              <button type="submit" className="btn-kaki text-sm shrink-0">S'abonner</button>
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
