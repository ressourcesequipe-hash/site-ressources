import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import { IconFamille, IconMaison, IconEcole, IconPartenaires, IconGlobe, IconProximite } from '../../components/Icons'

const BREADCRUMBS = [
  { label: 'Recyclerie Végétale', href: '/recyclerie-vegetale/' },
  { label: 'Redistribution' },
]

export default function RedistributionVeg() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Redistribution végétale solidaire dans les Landes"
        description="Qui peut bénéficier des plantes et matériels de jardin collectés par l'association Ressources dans les Landes (40) ? Habitants, communes, structures sociales."
        canonical="/recyclerie-vegetale/redistribution/"
      />

      <section className="bg-kaki-pale py-12 md:py-16 border-b border-kaki/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-kaki text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Recyclerie végétale
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">
            Redistribution solidaire des végétaux
          </h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Les végétaux et matériels collectés sont redistribués gratuitement
            aux habitants et structures du territoire landais selon nos critères de priorité.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl text-terre mb-8">Qui peut bénéficier ?</h2>
          <div className="grid sm:grid-cols-2 gap-5 mb-10">
            {[
              { icon: <IconFamille className="w-5 h-5" />, titre: 'Particuliers', desc: 'Habitants du territoire qui souhaitent végétaliser leur logement sans moyens pour acheter des plantes neuves.' },
              { icon: <IconMaison className="w-5 h-5" />, titre: 'Communes partenaires', desc: 'Espaces verts communaux, fleurissement des villages, jardins partagés municipaux.' },
              { icon: <IconEcole className="w-5 h-5" />, titre: 'Écoles & établissements', desc: 'Projets pédagogiques, jardins scolaires, espaces extérieurs des établissements.' },
              { icon: <IconPartenaires className="w-5 h-5" />, titre: 'Structures sociales', desc: 'EHPAD, centres d\'hébergement, structures d\'insertion proposant des activités horticoles.' },
              { icon: <IconGlobe className="w-5 h-5" />, titre: 'Jardins partagés', desc: 'Initiatives collectives de jardinage solidaire sur le territoire landais.' },
              { icon: <IconProximite className="w-5 h-5" />, titre: 'Sites touristiques partenaires', desc: 'Campings et sites partenaires engagés dans la démarche via notre réseau végétal.' },
            ].map(({ icon, titre, desc }) => (
              <div key={titre} className="flex gap-4 bg-beige-light border border-beige p-5">
                <div className="w-9 h-9 shrink-0 border border-kaki/20 bg-kaki/5 flex items-center justify-center text-kaki" aria-hidden>{icon}</div>
                <div>
                  <p className="font-sans text-sm font-semibold text-terre mb-1">{titre}</p>
                  <p className="text-xs text-terre/55 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-kaki-pale border border-kaki/15 p-6 mb-8">
            <h2 className="font-serif text-xl text-terre mb-3">Comment faire une demande ?</h2>
            <p className="text-sm text-terre/65 leading-relaxed mb-4">
              La redistribution végétale démarrera avec l'ouverture de la filière
              en septembre 2026. Contactez-nous dès maintenant pour manifester votre intérêt.
            </p>
            <a href="mailto:ressources.equipe@gmail.com" className="btn-kaki text-sm">
              Exprimer son intérêt
            </a>
          </div>

          <Link to="/recyclerie-vegetale/" className="text-sm text-kaki hover:text-ocre transition-colors">
            ← Retour à la recyclerie végétale
          </Link>
        </div>
      </section>
    </Layout>
  )
}
