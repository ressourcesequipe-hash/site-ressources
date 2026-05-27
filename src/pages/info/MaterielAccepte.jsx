import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'

const BREADCRUMBS = [
  { label: 'Recyclerie Informatique', href: '/recyclerie-informatique/' },
  { label: 'Matériel accepté' },
]

const CATEGORIES = [
  {
    icon: '💻',
    titre: 'Ordinateurs',
    items: ['Ordinateurs portables (laptop)', 'Ordinateurs fixes (desktop)', 'Unités centrales', 'Mac & PC'],
  },
  {
    icon: '🖥️',
    titre: 'Écrans & périphériques',
    items: ['Moniteurs LCD/LED', 'Claviers', 'Souris', 'Webcams', 'Haut-parleurs'],
  },
  {
    icon: '📱',
    titre: 'Mobiles & tablettes',
    items: ['Smartphones (tous modèles)', 'Tablettes (iPad, Android)', 'Liseuses', 'MP3 players'],
  },
  {
    icon: '🎮',
    titre: 'Jeux & multimédia',
    items: ['Consoles de jeux (PS, Xbox, Nintendo…)', 'Manettes', 'Appareils photo numériques', 'GPS'],
  },
  {
    icon: '🔌',
    titre: 'Câbles & accessoires',
    items: ['Câbles USB, HDMI, VGA, etc.', 'Chargeurs et alimentations', 'Disques durs externes', 'Clés USB'],
  },
  {
    icon: '🖨️',
    titre: 'Bureautique',
    items: ['Imprimantes (fonctionnelles)', 'Scanners', 'Routeurs & box (déverrouillés)', 'Téléphones fixes'],
  },
]

export default function MaterielAccepte() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Matériel informatique accepté — don dans les Landes"
        description="Liste complète du matériel informatique que nous collectons dans les Landes : ordinateurs, écrans, smartphones, tablettes, câbles, consoles. Association Ressources (40560)."
        canonical="/recyclerie-informatique/materiel-accepte/"
      />

      <section className="bg-kaki-pale py-12 md:py-16 border-b border-kaki/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Recyclerie informatique
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">
            Matériel informatique accepté
          </h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Nous collectons une large gamme d'équipements informatiques et multimédia,
            fonctionnels ou en panne. En cas de doute, contactez-nous !
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-ocre-pale border border-ocre/20 p-5 mb-10 flex gap-3">
            <span className="text-ocre text-lg shrink-0">ℹ️</span>
            <p className="text-sm text-terre/70 leading-relaxed">
              Nous acceptons le matériel <strong>fonctionnel ou en panne</strong>.
              Même un appareil cassé peut servir pour ses composants. En cas de doute,
              appelez-nous au <a href="tel:+33660200388" className="text-ocre hover:underline">06.60.20.03.88</a>.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {CATEGORIES.map(({ icon, titre, items }) => (
              <div key={titre} className="bg-beige-light border border-beige-dark p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl" aria-hidden>{icon}</span>
                  <h2 className="font-serif text-lg text-terre">{titre}</h2>
                </div>
                <ul className="space-y-1.5">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-terre/65">
                      <span className="text-ocre mt-1 shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Non accepté */}
          <div className="bg-beige border border-beige-dark p-6 mb-10">
            <h2 className="font-serif text-xl text-terre mb-4">Ce que nous n'acceptons pas</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                'Téléviseurs (TV) — orientez vers la déchetterie SITCOM40',
                'Gros électroménager',
                'Matériel professionnel très volumineux (serveurs rack)',
                'Batteries et accumulateurs isolés',
                'Ampoules et tubes fluorescents',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-terre/55">
                  <span className="text-terre/30 mt-1 shrink-0">✕</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/recyclerie-informatique/comment-donner/" className="btn-ocre">
              Je donne mon matériel
            </Link>
            <Link to="/recyclerie-informatique/effacement-donnees/" className="btn-outline-ocre">
              Sécurité de mes données
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 bg-beige border-t border-beige-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-wrap gap-4 text-sm">
          <Link to="/recyclerie-informatique/" className="text-kaki hover:text-ocre transition-colors">
            ← Retour à la recyclerie informatique
          </Link>
        </div>
      </section>
    </Layout>
  )
}
