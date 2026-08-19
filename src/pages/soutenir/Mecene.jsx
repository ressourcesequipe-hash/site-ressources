import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'

const BREADCRUMBS = [
  { label: 'Soutenir', href: '/soutenir/' },
  { label: 'Mécénat & partenariat' },
]

export default function Mecene() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Mécénat & Partenariat Recyclerie Solidaire Landes | Association Ressources"
        description="Associez votre entreprise au projet de recyclerie solidaire des Landes. Mécénat, sponsoring, partenariat local — plusieurs formules disponibles avec l'association Ressources."
        canonical="/soutenir/mecene/"
      />

      <section className="bg-kaki text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-ocre" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Mécénat
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4">
            Mécénat & partenariat local
          </h1>
          <p className="text-white/65 max-w-xl leading-relaxed">
            Associez le nom de votre entreprise ou commerce à un projet solidaire,
            local et engagé dans les Landes. Plusieurs formules adaptées à toutes les tailles.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                tier: 'Partenaire',
                engagement: 'Don matériel ou prestation',
                avantages: ['Logo sur les supports de communication', 'Mention lors des événements', 'Lettre de remerciement officielle'],
                cta: 'Nous contacter',
                accent: false,
              },
              {
                tier: 'Sponsor',
                engagement: 'Soutien financier',
                avantages: ['Logo sur le site et les supports', 'Mention prioritaire lors des événements', 'Présence visuelle lors du 03 octobre', 'Attestation fiscale de don'],
                cta: 'Nous contacter',
                accent: true,
              },
              {
                tier: 'Mécène',
                engagement: 'Partenariat annuel',
                avantages: ['Tout le pack Sponsor', 'Co-branding sur les équipements redistribués', 'Stand lors de l\'événement de lancement', 'Suivi d\'impact personnalisé'],
                cta: 'Nous contacter',
                accent: false,
              },
            ].map(({ tier, engagement, avantages, cta, accent }) => (
              <div key={tier} className={`p-6 border-t-2 ${accent ? 'border-ocre bg-ocre-pale' : 'border-kaki bg-beige-light'}`}>
                <p className={`font-sans text-xs font-semibold tracking-widest uppercase mb-1 ${accent ? 'text-ocre' : 'text-kaki'}`}>
                  {engagement}
                </p>
                <h2 className="font-serif text-2xl text-terre mb-4">{tier}</h2>
                <ul className="space-y-2 mb-6">
                  {avantages.map((av) => (
                    <li key={av} className="flex items-start gap-2 text-sm text-terre/65">
                      <span className={`mt-1 shrink-0 text-xs ${accent ? 'text-ocre' : 'text-kaki'}`}>✓</span>
                      {av}
                    </li>
                  ))}
                </ul>
                <a href="mailto:contact@ressourcesrecyclerie.fr" className={accent ? 'btn-ocre text-sm' : 'btn-kaki text-sm'}>
                  {cta}
                </a>
              </div>
            ))}
          </div>

          <div className="bg-beige p-6 md:p-8">
            <h2 className="font-serif text-xl text-terre mb-3">Avantages fiscaux du mécénat</h2>
            <p className="text-sm text-terre/65 leading-relaxed mb-3">
              Les dons à une association d'intérêt général ouvrent droit à une réduction d'impôt
              de <strong className="text-terre">60 % du montant versé</strong> pour les entreprises, dans la limite
              de 20 000 € ou 5 ‰ du chiffre d'affaires HT — le montant le plus élevé étant retenu
              (CGI, art. 238 bis). Une attestation fiscale est délivrée.
            </p>
            <p className="text-xs text-terre/40 italic">
              L'association Ressources relève de l'intérêt général. Pour un don en nature, la
              valorisation retenue est la valeur nette comptable du bien : consultez votre conseiller fiscal.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}

