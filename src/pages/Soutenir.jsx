import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import SEO from '../components/SEO'

const OPTIONS = [
  {
    to: '/soutenir/tombola/',
    icon: '🎟',
    title: 'Tombola solidaire',
    subtitle: 'Objectif 15 000 €',
    desc: 'Participez à notre grande tombola du 17 octobre 2026. Des lots attractifs, un financement direct pour l\'association.',
    cta: 'Participer à la tombola',
    accent: 'ocre',
  },
  {
    to: '/soutenir/benevole/',
    icon: '✋',
    title: 'Devenir bénévole',
    subtitle: 'Rejoignez l\'équipe',
    desc: 'Vous avez du temps, des compétences, de la bonne volonté ? L\'association Ressources a besoin de vous pour ses filières.',
    cta: 'Je veux être bénévole',
    accent: 'kaki',
  },
  {
    to: '/soutenir/mecene/',
    icon: '🏢',
    title: 'Mécénat & partenariat',
    subtitle: 'Pour les entreprises et commerces locaux',
    desc: 'Associez votre nom à un projet solidaire et ancré dans le territoire landais. Plusieurs formules de partenariat disponibles.',
    cta: 'Devenir mécène ou sponsor',
    accent: 'kaki',
  },
  {
    to: '/soutenir/don/',
    icon: '💛',
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
        title="Soutenir l'association Ressources — recyclerie solidaire Landes"
        description="Soutenez l'association Ressources dans les Landes : tombola solidaire, bénévolat, mécénat ou don. Votre soutien finance la recyclerie informatique et végétale du territoire landais."
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
            {OPTIONS.map(({ to, icon, title, subtitle, desc, cta, accent }) => (
              <div key={to} className={`border-t-2 ${accent === 'ocre' ? 'border-ocre' : 'border-kaki'} bg-beige-light p-8`}>
                <span className="text-3xl block mb-4" aria-hidden>{icon}</span>
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
              Tombola solidaire — 17 octobre 2026
            </h2>
            <p className="text-terre/60 text-sm leading-relaxed mb-4">
              Notre principal levier de financement pour démarrer. Objectif : 15 000 €
              pour équiper l'association et pérenniser la filière informatique.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/soutenir/tombola/" className="btn-ocre text-sm">
                Tout savoir sur la tombola
              </Link>
              <Link to="/evenement-lancement-17-octobre-2026/" className="btn-outline-ocre text-sm">
                L'événement du 17 octobre
              </Link>
            </div>
          </div>
          <div className="text-center">
            <p className="font-serif text-6xl md:text-7xl text-ocre leading-none">15 000</p>
            <p className="font-sans text-xs text-terre/50 tracking-wider uppercase mt-1">euros — objectif</p>
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
          <a
            href="mailto:ressources.equipe@gmail.com"
            className="btn-outline-ocre"
          >
            Nous contacter
          </a>
        </div>
      </section>
    </Layout>
  )
}
