import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { IconTombola, IconNousRejoindre, IconEntreprise, IconDon } from '../components/Icons'

const OPTIONS = [
  {
    to: '/soutenir/tombola/',
    Icon: IconTombola,
    title: 'Tombola solidaire',
    subtitle: 'Plus de 7 000 € de lots à gagner',
    desc: 'Participez à notre grande tombola du 03 octobre 2026. Plus de 7 000 € de lots à gagner, soutenez directement la recyclerie.',
    cta: 'Participer à la tombola',
    accent: 'ocre',
  },
  {
    to: '/soutenir/benevole/',
    Icon: IconNousRejoindre,
    title: 'Devenir bénévole',
    subtitle: 'Rejoignez l\'équipe',
    desc: 'Vous avez du temps, des compétences, de la bonne volonté ? L\'association Ressources a besoin de vous pour ses filières.',
    cta: 'Je veux être bénévole',
    accent: 'kaki',
  },
  {
    to: '/soutenir/mecene/',
    Icon: IconEntreprise,
    title: 'Mécénat & partenariat',
    subtitle: 'Pour les entreprises et commerces locaux',
    desc: 'Associez votre nom à un projet solidaire et ancré dans le territoire landais. Plusieurs formules de partenariat disponibles.',
    cta: 'Devenir mécène ou sponsor',
    accent: 'kaki',
  },
  {
    to: '/soutenir/don/',
    Icon: IconDon,
    title: 'Faire un don',
    subtitle: 'Soutien direct',
    desc: 'Votre don finance l\'équipement, les déplacements et les actions de l\'association. Chaque euro compte pour le territoire.',
    cta: 'Faire un don',
    accent: 'ocre',
  },
]

export default function Soutenir() {
  return (
    <Layout>
      <SEO
        title="Soutenir la Recyclerie Solidaire Landes | Association Ressources"
        description="Aidez la recyclerie Ressources dans les Landes : tombola, bénévolat, mécénat ou don. Chaque soutien finance la recyclerie informatique et végétale solidaire du territoire landais (40)."
        canonical="/soutenir/"
      />

      {/* Hero */}
      <section className="bg-kaki text-white py-14 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-ocre" />
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/[0.02] rounded-tl-full pointer-events-none" aria-hidden />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            Nous soutenir
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-white leading-tight mb-4">
            Soutenir l'association Ressources
          </h1>
          <div className="w-12 h-0.5 bg-ocre mb-6" />
          <p className="text-white/65 max-w-xl leading-relaxed">
            Vous croyez au réemploi solidaire, à l'inclusion numérique et au lien
            local ? Voici comment contribuer concrètement au projet Ressources
            dans les Landes.
          </p>
        </div>
      </section>

      {/* 4 options */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {OPTIONS.map(({ to, Icon, title, subtitle, desc, cta, accent }) => (
              <div key={to} className={`border-t-2 ${accent === 'ocre' ? 'border-ocre' : 'border-kaki'} bg-beige-light p-8`}>
                <div className={`w-12 h-12 border flex items-center justify-center mb-4 ${accent === 'ocre' ? 'border-ocre/25 bg-ocre/5 text-ocre' : 'border-kaki/25 bg-kaki/5 text-kaki'}`} aria-hidden><Icon className="w-6 h-6" /></div>
                <p className={`font-sans text-xs font-semibold tracking-widest uppercase mb-1 ${accent === 'ocre' ? 'text-ocre' : 'text-kaki'}`}>
                  {subtitle}
                </p>
                <h2 className="font-serif text-2xl text-terre mb-3">{title}</h2>
                <p className="text-sm text-terre/60 leading-relaxed mb-6">{desc}</p>
                <Link
                  to={to}
                  className={accent === 'ocre' ? 'btn-ocre text-sm' : 'btn-kaki text-sm'}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tombola highlight + lien événement */}
      <section className="py-14 bg-ocre-pale border-y border-ocre/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1">
            <p className="section-label">Priorité</p>
            <h2 className="font-serif text-2xl md:text-3xl text-terre mb-3">
              Tombola solidaire — 03 octobre 2026
            </h2>
            <p className="text-terre/60 text-sm leading-relaxed mb-4">
              Participez à une grande tombola solidaire et soutenez le lancement de la
              recyclerie informatique et végétale Ressources. Des lots d'une valeur totale
              estimée à plus de 7 000 € offerts par nos partenaires locaux.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/soutenir/tombola/" className="btn-ocre text-sm">
                Tout savoir sur la tombola
              </Link>
              <Link to="/evenement-lancement-03-octobre-2026/" className="btn-outline-ocre text-sm">
                L'événement du 03 octobre
              </Link>
            </div>
          </div>
          <div className="text-center">
            <p className="font-serif text-5xl md:text-6xl text-ocre leading-none">+7 000 €</p>
            <p className="font-sans text-xs text-terre/50 tracking-wider uppercase mt-1">de lots à gagner</p>
          </div>
        </div>
      </section>

      {/* FAQ soutien */}
      <section className="py-16 bg-white border-t border-beige">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <p className="section-label">Questions fréquentes</p>
            <h2 className="font-serif text-3xl text-terre">Soutenir l'association</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: 'Les dons sont-ils déductibles des impôts ?',
                a: 'Les dons à une association d\'intérêt général ouvrent droit à une réduction d\'impôt de 66 % du montant versé pour les particuliers (dans la limite de 20 % du revenu imposable). Une attestation fiscale vous est délivrée. Ce statut est en cours d\'obtention pour l\'association Ressources.',
              },
              {
                q: 'Comment devenir bénévole ?',
                a: 'Remplissez le formulaire sur la page "Devenir bénévole". Nous cherchons des profils variés : informatique, jardinage, logistique, communication, comptabilité. Aucune compétence particulière n\'est exigée pour beaucoup de missions.',
              },
              {
                q: 'Mon entreprise peut-elle devenir mécène ?',
                a: 'Oui. Les entreprises mécènes bénéficient d\'une réduction d\'impôt de 60 % du don dans la limite de 0,5 % du CA HT (CGI art. 238 bis). Plusieurs formules sont disponibles : don matériel, sponsoring, partenariat annuel.',
              },
              {
                q: 'Puis-je participer à la tombola sans venir à l\'événement ?',
                a: 'Oui, des billets de tombola peuvent être achetés en ligne ou auprès de nos partenaires locaux. Le tirage se fait lors de l\'événement du 03 octobre 2026 à Vielle-Saint-Girons.',
              },
            ].map(({ q, a }) => (
              <details key={q} className="border border-beige group">
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none font-sans text-sm font-semibold text-terre hover:text-ocre transition-colors">
                  {q}
                  <span className="shrink-0 text-ocre/50 group-open:rotate-180 transition-transform duration-200">▾</span>
                </summary>
                <p className="px-5 pb-5 text-sm text-terre/60 leading-relaxed border-t border-beige pt-4">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-14 bg-beige-light">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-2xl text-terre mb-3">Une autre idée pour nous soutenir ?</h2>
          <p className="text-terre/55 text-sm leading-relaxed mb-6">
            Nous sommes ouverts à toute forme de soutien : mise à disposition de locaux,
            compétences bénévoles spécifiques, dons matériels, relais communication…
          </p>
          <Link
            to="/contact/"
            className="btn-outline-ocre"
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </Layout>
  )
}

