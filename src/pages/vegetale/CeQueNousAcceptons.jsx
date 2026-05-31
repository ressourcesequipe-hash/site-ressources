import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import { IconFeuille, IconFleur, IconPot, IconPlante, IconJardinage, IconMaison } from '../../components/Icons'

const BREADCRUMBS = [
  { label: 'Recyclerie Végétale', href: '/recyclerie-vegetale/' },
  { label: 'Ce que nous acceptons' },
]

export default function CeQueNousAcceptons() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Végétaux et matériels acceptés — recyclerie végétale Landes"
        description="Liste des végétaux et matériels acceptés par la recyclerie végétale de l'association Ressources dans les Landes : plantes, contenants, outils, mobilier de jardin."
        canonical="/recyclerie-vegetale/ce-que-nous-acceptons/"
      />

      <section className="bg-kaki-pale py-12 md:py-16 border-b border-kaki/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-kaki text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Recyclerie végétale
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">
            Ce que nous acceptons
          </h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Plantes, contenants, outils, mobilier de jardin… voici ce que nous
            collectons pour redistribuer sur le territoire landais.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { icon: <IconFeuille className="w-5 h-5" />, titre: 'Plantes vertes', items: ['Plantes d\'intérieur', 'Plantes d\'extérieur vivaces', 'Arbustes d\'ornement', 'Plantes aromatiques'] },
              { icon: <IconFleur className="w-5 h-5" />, titre: 'Fleurs & plantes saisonnières', items: ['Fleurs annuelles', 'Bulbes', 'Géraniums et pétunias', 'Plantes de balcon'] },
              { icon: <IconPot className="w-5 h-5" />, titre: 'Contenants', items: ['Pots de toutes tailles', 'Jardinières', 'Bacs à fleurs', 'Suspension et présentoirs'] },
              { icon: <IconPlante className="w-5 h-5" />, titre: 'Semences & boutures', items: ['Graines de potager', 'Boutures enracinées', 'Rejets et stolons', 'Plants à repiquer'] },
              { icon: <IconJardinage className="w-5 h-5" />, titre: 'Outils de jardin', items: ['Outils manuels (bèches, râteaux…)', 'Petits outillages', 'Arrosoirs', 'Tuteurs et attaches'] },
              { icon: <IconMaison className="w-5 h-5" />, titre: 'Mobilier & aménagement', items: ['Mobilier de jardin (bon état)', 'Bordures et clôtures légères', 'Bâches et voiles', 'Grilles et treillages'] },
            ].map(({ icon, titre, items }) => (
              <div key={titre} className="bg-beige-light border border-beige-dark p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 border border-kaki/20 bg-kaki/5 flex items-center justify-center text-kaki shrink-0" aria-hidden>{icon}</div>
                  <h2 className="font-serif text-base text-terre">{titre}</h2>
                </div>
                <ul className="space-y-1.5">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-terre/65">
                      <span className="text-kaki mt-1 shrink-0 text-xs">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-beige border border-beige-dark p-5 mb-8">
            <p className="font-sans text-sm font-semibold text-terre mb-2">En cas de doute ?</p>
            <p className="text-sm text-terre/60 leading-relaxed">
              Contactez-nous avant de vous déplacer. Nous vous confirmerons si
              ce que vous souhaitez donner entre dans le cadre de notre collecte.
            </p>
          </div>

          <Link to="/recyclerie-vegetale/comment-donner/" className="btn-kaki text-sm">
            Je veux donner mes végétaux
          </Link>
        </div>
      </section>
    </Layout>
  )
}
