import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import { IconFamille, IconMaison, IconEcole, IconPartenaires, IconGlobe, IconProximite } from '../../components/Icons'

const BREADCRUMBS = [
  { label: 'Recyclerie Végétale', href: '/recyclerie-vegetale/' },
  { label: 'Vente solidaire' },
]

export default function RedistributionVeg() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Vente solidaire de végétaux dans les Landes — association Ressources"
        description="Achetez des plantes, contenants et matériels de jardin à prix solidaire dans les Landes (40). L'association Ressources propose les végétaux collectés à la vente, avec quelques mises à disposition pour les collectivités partenaires."
        canonical="/recyclerie-vegetale/redistribution/"
      />

      <section className="bg-kaki-pale py-12 md:py-16 border-b border-kaki/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-kaki text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Recyclerie végétale
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">
            Vente solidaire des végétaux
          </h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Les végétaux et matériels collectés sont proposés à la vente à prix solidaire
            (minoré par rapport au marché). Quelques équipements sont mis à disposition
            gratuitement des collectivités dans le cadre de partenariats locaux.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          <div className="mb-12">
            <h2 className="font-serif text-2xl text-terre mb-6">Comment fonctionne la vente solidaire ?</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { num: '1', titre: 'Collecte', desc: 'Plantes, contenants et matériels donnés par des particuliers, campings ou communes sont collectés et triés.' },
                { num: '2', titre: 'Remise en état', desc: 'Les végétaux sont soignés et les matériels nettoyés par nos bénévoles avant mise en vente.' },
                { num: '3', titre: 'Vente à prix solidaire', desc: 'Vous achetez à un prix inférieur au marché. Les recettes financent les frais de fonctionnement de l\'association.' },
              ].map(({ num, titre, desc }) => (
                <div key={num} className="border-t-2 border-kaki pt-5">
                  <span className="font-serif text-3xl text-kaki/25 block mb-3 leading-none">{num}</span>
                  <h3 className="font-serif text-lg text-terre mb-2">{titre}</h3>
                  <p className="text-sm text-terre/55 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <h2 className="font-serif text-2xl text-terre mb-6">Qui peut acheter ?</h2>
          <div className="grid sm:grid-cols-2 gap-5 mb-10">
            {[
              { icon: <IconFamille className="w-5 h-5" />, titre: 'Particuliers', desc: 'Tout habitant du territoire peut acheter des plantes et matériels à prix solidaire, sans condition de ressources.' },
              { icon: <IconMaison className="w-5 h-5" />, titre: 'Communes partenaires', desc: 'Les communes partenaires peuvent bénéficier de mises à disposition dans le cadre d\'un accord de partenariat.' },
              { icon: <IconEcole className="w-5 h-5" />, titre: 'Écoles & établissements', desc: 'Projets pédagogiques, jardins scolaires — nous étudions chaque demande au cas par cas.' },
              { icon: <IconPartenaires className="w-5 h-5" />, titre: 'Structures sociales', desc: 'EHPAD, centres d\'hébergement et structures d\'insertion : contactez-nous pour discuter d\'un tarif adapté.' },
              { icon: <IconGlobe className="w-5 h-5" />, titre: 'Jardins partagés', desc: 'Initiatives collectives de jardinage solidaire sur le territoire landais.' },
              { icon: <IconProximite className="w-5 h-5" />, titre: 'Sites partenaires', desc: 'Campings et sites engagés dans notre réseau végétal bénéficient d\'un accès prioritaire aux stocks.' },
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
            <h2 className="font-serif text-xl text-terre mb-3">Quand démarre la vente solidaire ?</h2>
            <p className="text-sm text-terre/65 leading-relaxed mb-4">
              La filière végétale ouvre en septembre 2026. Contactez-nous dès maintenant
              pour manifester votre intérêt ou être tenu informé.
            </p>
            <a href="mailto:contact@ressourcesrecyclerie.fr" className="btn-kaki text-sm">
              Manifester son intérêt
            </a>
          </div>

          <div className="border-t border-beige pt-10">
            <h2 className="font-serif text-2xl text-terre mb-6">Questions fréquentes</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Quel est le prix des végétaux ?',
                  a: 'Les prix sont fixés en fonction de l\'état des plantes et des tarifs du marché local, avec une réduction solidaire. Les détails seront communiqués à l\'ouverture de la filière en septembre 2026.',
                },
                {
                  q: 'Peut-on réserver des plantes à l\'avance ?',
                  a: 'Oui, il sera possible d\'exprimer votre intérêt pour certains types de végétaux. Contactez-nous pour être ajouté à notre liste de préférence.',
                },
                {
                  q: 'La vente se fait-elle sur place ou par livraison ?',
                  a: 'La vente se fait principalement sur le point de collecte de Vielle-Saint-Girons. Pour des volumes importants, un arrangement peut être envisagé.',
                },
                {
                  q: 'Que se passe-t-il si les plantes sont en mauvais état ?',
                  a: 'Nos bénévoles effectuent un tri et une remise en état. Les végétaux vendus sont en état satisfaisant. Ceux qui ne peuvent pas être récupérés sont compostés.',
                },
              ].map(({ q, a }) => (
                <details key={q} className="border border-beige group">
                  <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none font-sans text-sm font-semibold text-terre hover:text-kaki transition-colors">
                    {q}
                    <span className="shrink-0 text-kaki/50 group-open:rotate-180 transition-transform duration-200">▾</span>
                  </summary>
                  <p className="px-5 pb-5 text-sm text-terre/60 leading-relaxed border-t border-beige pt-4">{a}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="pt-8">
            <Link to="/recyclerie-vegetale/" className="text-sm text-kaki hover:text-ocre transition-colors">
              ← Retour à la recyclerie végétale
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
