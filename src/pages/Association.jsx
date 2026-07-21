import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { IconEquipe, IconTerritoire, IconPartenaires, IconActualites, IconNousRejoindre } from '../components/Icons'

const EQUIPE = [
  {
    nom: 'Sandrine VESTRIS',
    role: 'Présidente',
    desc: 'Porteuse du projet depuis l\'origine, Sandrine anime le collectif et coordonne les partenariats institutionnels.',
  },
  {
    nom: 'Boris LALANNE',
    role: 'Référent projet',
    desc: 'Boris pilote la filière informatique : collecte, reconditionnement, partenariats techniques.',
  },
  {
    nom: 'Rose MAURY',
    role: 'Secrétaire & Trésorière',
    desc: 'Rose assure la vie associative, les inscriptions bénévoles et la communication.',
  },
]

const PAGES_FILLES = [
  { to: '/association/gouvernance/', Icon: IconEquipe, title: 'Gouvernance', desc: 'L\'équipe dirigeante et les bénévoles' },
  { to: '/association/territoire/', Icon: IconTerritoire, title: 'Notre territoire', desc: 'Ancrage local, CC CLN, CC MACS' },
  { to: '/association/partenaires/', Icon: IconPartenaires, title: 'Partenaires', desc: 'Partenaires institutionnels et locaux' },
  { to: '/association/actualites/', Icon: IconActualites, title: 'Actualités', desc: 'Le fil d\'actualités de l\'association' },
  { to: '/association/nous-rejoindre/', Icon: IconNousRejoindre, title: 'Nous rejoindre', desc: 'Bénévolat, mécénat, partenariat' },
  { to: '/association/presse/', Icon: IconActualites, title: 'Espace presse', desc: 'Repères, angles et contact pour les journalistes' },
]

export default function Association() {
  return (
    <Layout>
      <SEO
        title="Association Ressources — Recyclerie Solidaire Landes (40)"
        description="Ressources est une association loi 1901 qui porte une recyclerie informatique et végétale solidaire dans les Landes (40) à Vielle-Saint-Girons. Réemploi, économie circulaire, lien social."
        canonical="/association/"
      />

      {/* Hero */}
      <section className="bg-beige-light py-14 md:py-20 border-b border-beige-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="section-label">Qui sommes-nous</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-terre leading-tight mb-4">
            Association Ressources —<br />
            <span className="text-ocre">une initiative citoyenne landaise</span>
          </h1>
          <div className="decorative-line" />
          <p className="text-terre/65 max-w-xl leading-relaxed">
            Fondée en 2025 selon la loi 1901, l'association Ressources est née à
            Vielle-Saint-Girons dans les Landes. C'est en 2026 qu'elle s'est donné
            une nouvelle ambition : créer un modèle de réemploi solidaire pour
            l'informatique et le végétal, au service du territoire.
          </p>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                value: 'Réemploi',
                desc: 'Chaque équipement ou plante récupéré est une ressource. Nous prolongeons la vie des objets avant tout recyclage.',
              },
              {
                value: 'Solidarité',
                desc: 'Notre action bénéficie en priorité aux personnes et structures qui en ont le plus besoin sur notre territoire.',
              },
              {
                value: 'Proximité',
                desc: 'Ancré à Vielle-Saint-Girons, le projet agit sur les intercommunalités Côte Landes Nature et MACS.',
              },
            ].map(({ value, desc }) => (
              <div key={value} className="border-t-2 border-ocre pt-6">
                <h2 className="font-serif text-2xl text-terre mb-3">{value}</h2>
                <p className="text-sm text-terre/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* L'association en bref */}
      <section className="py-16 bg-beige">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="section-label">Le projet</p>
              <h2 className="font-serif text-3xl text-terre mb-4">
                Un projet, deux filières solidaires
              </h2>
              <div className="decorative-line" />
              <p className="text-terre/65 leading-relaxed mb-4">
                Ressources est structurée autour de deux filières complémentaires :
                la <strong className="text-terre font-semibold">recyclerie informatique</strong> pour
                l'inclusion numérique, et la <strong className="text-terre font-semibold">recyclerie
                végétale</strong> pour le réemploi des végétaux et du matériel de jardin.
              </p>
              <p className="text-terre/65 leading-relaxed mb-6">
                La phase pilote démarre en septembre 2026, avec un événement
                de lancement festif prévu le 03 octobre 2026 à Vielle-Saint-Girons.
              </p>
              <Link to="/association/gouvernance/" className="btn-outline-ocre text-sm">
                Découvrir l'équipe
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Statut', val: 'Association loi 1901' },
                { label: 'Fondée en', val: '2025' },
                { label: 'Siège social', val: '80 allée des Cigales, 40560 Vielle-Saint-Girons' },
                { label: 'Démarrage pilote', val: 'Septembre 2026' },
                { label: 'Territoire d\'action', val: 'CC Côte Landes Nature + CC MACS' },
                { label: 'Contact', val: 'contact@ressourcesrecyclerie.fr' },
              ].map(({ label, val }) => (
                <div key={label} className="flex gap-4 py-3 border-b border-beige-dark last:border-0">
                  <span className="text-xs text-terre/40 font-sans uppercase tracking-wider w-32 shrink-0 pt-0.5">
                    {label}
                  </span>
                  <span className="text-sm text-terre/75 font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <p className="section-label">L'équipe fondatrice</p>
            <h2 className="font-serif text-3xl text-terre">Celles et ceux qui portent le projet</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {EQUIPE.map(({ nom, role, tel, desc }) => (
              <div key={nom} className="border border-beige-dark p-6">
                <div className="w-10 h-10 rounded-full bg-ocre/10 flex items-center justify-center mb-4">
                  <span className="font-serif text-ocre text-lg font-bold">{nom[0]}</span>
                </div>
                <p className="font-serif text-lg text-terre mb-0.5">{nom}</p>
                <p className="text-xs text-ocre font-semibold tracking-wider uppercase mb-3">{role}</p>
                <p className="text-sm text-terre/55 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation pages filles */}
      <section className="py-16 bg-beige-light border-t border-beige-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl text-terre mb-8">En savoir plus sur l'association</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PAGES_FILLES.map(({ to, Icon, title, desc }) => (
              <Link
                key={to}
                to={to}
                className="group flex items-start gap-3 bg-white border border-beige p-5 hover:border-ocre/30 hover:shadow-sm transition-all"
              >
                <div className="w-9 h-9 shrink-0 border border-ocre/25 bg-ocre/5 flex items-center justify-center text-ocre" aria-hidden><Icon className="w-5 h-5" /></div>
                <div>
                  <p className="font-sans text-sm font-semibold text-terre mb-0.5 group-hover:text-ocre transition-colors">
                    {title}
                  </p>
                  <p className="text-xs text-terre/50">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

