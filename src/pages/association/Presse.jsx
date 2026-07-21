import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'

const BREADCRUMBS = [
  { label: 'L\'Association', href: '/association/' },
  { label: 'Espace presse' },
]

const REPERES = [
  { cle: 'Nom', valeur: 'Ressources — recyclerie solidaire' },
  { cle: 'Statut', valeur: 'Association loi 1901, fondée en 2025' },
  { cle: 'Siège', valeur: '80 allée des Cigales, 40560 Vielle-Saint-Girons' },
  { cle: 'Territoire', valeur: 'Côte landaise, Marensin, Born, Marsan' },
  { cle: 'Filières', valeur: 'Réemploi informatique et recyclerie végétale' },
  { cle: 'Lancement public', valeur: 'Samedi 03 octobre 2026, Vielle-Saint-Girons' },
]

const OBJECTIFS = [
  { valeur: '120', label: 'équipements informatiques à collecter la première année' },
  { valeur: '80 %', label: 'des équipements réemployés ou valorisés' },
  { valeur: '1 000', label: 'plantes à redistribuer' },
  { valeur: '5', label: 'communes partenaires visées' },
  { valeur: '2', label: 'communautés de communes' },
  { valeur: '8', label: 'bénévoles réguliers' },
]

const ANGLES = [
  {
    titre: 'La double filière, informatique et végétale',
    desc: 'Peu de recycleries associent le réemploi d\'équipements numériques et la redistribution de plantes et de matériel de jardinage. Les deux filières répondent au même constat : ce qui est jeté ici manque à quelqu\'un juste à côté.',
  },
  {
    titre: 'L\'inclusion numérique en zone rurale',
    desc: 'Un ordinateur reconditionné pour une famille, un senior ou une association du territoire, avec effacement certifié des données. Le sujet croise fracture numérique et pouvoir d\'achat sur un territoire peu dense.',
  },
  {
    titre: 'Une mobilisation de commerçants locaux',
    desc: 'Plus de vingt commerçants, artisans et producteurs de Léon, Linxe, Soustons, Vielle-Saint-Girons et Dax se sont engagés à doter la tombola de lancement. Un instantané du tissu économique de la côte landaise.',
  },
]

export default function Presse() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Espace presse — Association Ressources, recyclerie solidaire dans les Landes"
        description="Informations pour les journalistes : présentation de l'association Ressources, repères, objectifs, angles de reportage et contact presse. Recyclerie informatique et végétale à Vielle-Saint-Girons (Landes), lancement le 03 octobre 2026."
        canonical="/association/presse/"
      />

      {/* Hero */}
      <section className="bg-beige-light py-12 md:py-16 border-b border-beige-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="section-label">L'association</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">Espace presse</h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Vous préparez un sujet sur le réemploi, l'inclusion numérique ou les
            initiatives citoyennes dans les Landes ? Vous trouverez ici l'essentiel
            sur l'association Ressources. Nous répondons volontiers à vos questions
            et vous accueillons sur place.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Contact presse */}
          <div className="bg-kaki text-white p-6 md:p-8 mb-12 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-ocre to-transparent" aria-hidden />
            <div className="relative">
              <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-ocre mb-3">
                Contact presse
              </p>
              <h2 className="font-serif text-2xl text-white mb-1">Boris Lalanne</h2>
              <p className="text-sm text-white/50 mb-5">Référent projet — filière informatique</p>
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                <a href="tel:+33662660484" className="text-sm text-white/80 hover:text-ocre transition-colors">
                  06 62 66 04 84
                </a>
                <a href="mailto:contact@ressourcesrecyclerie.fr" className="text-sm text-white/80 hover:text-ocre transition-colors">
                  contact@ressourcesrecyclerie.fr
                </a>
              </div>
              <p className="text-xs text-white/40 mt-5 leading-relaxed max-w-lg">
                Visuels en haute définition, interviews et reportage sur site :
                nous fournissons ces éléments sur simple demande.
              </p>
            </div>
          </div>

          {/* En bref */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl text-terre mb-6">L'association en bref</h2>
            <dl className="divide-y divide-beige-dark border-y border-beige-dark">
              {REPERES.map(({ cle, valeur }) => (
                <div key={cle} className="flex flex-col sm:flex-row gap-1 sm:gap-6 py-3">
                  <dt className="font-sans text-xs font-semibold tracking-wide uppercase text-terre/40 sm:w-44 shrink-0 pt-0.5">
                    {cle}
                  </dt>
                  <dd className="text-sm text-terre/70 leading-relaxed">{valeur}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Objectifs */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl text-terre mb-2">Nos objectifs — première année</h2>
            <p className="text-sm text-terre/60 leading-relaxed mb-6 max-w-2xl">
              Ces chiffres sont des objectifs de la phase pilote, et non des
              résultats acquis : l'association se lance publiquement le 03 octobre 2026.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {OBJECTIFS.map(({ valeur, label }) => (
                <div key={label} className="border-t-2 border-ocre/30 bg-beige-light px-5 py-4">
                  <p className="font-serif text-2xl text-ocre leading-none mb-1.5">{valeur}</p>
                  <p className="font-sans text-xs text-terre/60 leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Angles */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl text-terre mb-6">Trois angles possibles</h2>
            <div className="space-y-5">
              {ANGLES.map(({ titre, desc }) => (
                <div key={titre} className="border-l-2 border-ocre/30 pl-5">
                  <h3 className="font-serif text-lg text-terre mb-1.5">{titre}</h3>
                  <p className="text-sm text-terre/60 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Événement */}
          <div className="bg-beige-light border border-beige-dark p-6 md:p-8 mb-12">
            <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-ocre mb-3">
              Temps fort
            </p>
            <h2 className="font-serif text-xl text-terre mb-3">
              Journée de lancement — samedi 03 octobre 2026
            </h2>
            <p className="text-sm text-terre/65 leading-relaxed mb-5">
              Une journée ouverte à tous à Vielle-Saint-Girons : challenge de
              collecte d'une demi-tonne de matériel informatique, tombola solidaire
              dotée par les commerçants du territoire, tirage au sort public et
              festivités. Les journalistes sont les bienvenus, avec possibilité
              d'interviews sur place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/evenement-lancement-03-octobre-2026/" className="btn-ocre text-sm">
                Détail de l'événement
              </Link>
              <Link to="/association/gouvernance/" className="btn-outline-ocre text-sm">
                L'équipe fondatrice
              </Link>
            </div>
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
