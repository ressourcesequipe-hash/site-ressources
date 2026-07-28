import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import { AtelierHero, SectionHead, Chips, Faq, PagesSoeurs, CtaFinal, Reveal } from '../../components/ateliers/AtelierUI'
import { SOUS_PAGES, serviceSchema, faqSchema, graph } from '../../data/ateliers'

const BREADCRUMBS = [{ label: 'Ateliers', href: '/ateliers/' }, { label: 'Ateliers végétaux' }]

const THEMES = [
  'Rempotage',
  'Bouturage',
  'Réemploi des pots et contenants',
  'Entretien courant des plantes',
  'Sauvetage de plantes fragilisées',
  'Compostage',
  'Valorisation des matières organiques',
  'Jardinage zéro déchet',
  'Adoption de plantes récupérées',
]

const SAISONS = [
  { s: 'Printemps', t: 'Rempoter et réemployer', d: "Choisir le bon contenant parmi les pots récupérés, rempoter sans abîmer les racines, préparer un substrat. On repart avec ses plantes rempotées." },
  { s: 'Fin de printemps', t: 'Multiplier par bouturage', d: 'Prélever, préparer et faire raciner une bouture. Chaque participant repart avec les siennes et suit leur reprise jusqu\'à la séance suivante.' },
  { s: 'Été', t: 'Entretenir et sauver', d: "Arrosage, lumière, maladies courantes : diagnostiquer une plante en souffrance et la remettre sur pied plutôt que la jeter." },
  { s: 'Automne', t: 'Composter et boucler le cycle', d: 'Valoriser les matières organiques, comprendre le compost, réduire les déchets de jardin et préparer la saison suivante.' },
]

const FAQ = [
  { q: 'Faut-il avoir la main verte pour participer ?', r: "Non. Les ateliers végétaux s'adressent à tous, y compris aux débutants complets. Les gestes enseignés — rempotage, bouturage, arrosage — sont simples et immédiatement reproductibles chez soi." },
  { q: 'Repart-on avec des plantes ?', r: "Oui, selon le format. Lors d'un atelier de bouturage ou de rempotage, chaque participant repart généralement avec ses boutures ou sa plante rempotée, issues des végétaux collectés par la recyclerie." },
  { q: 'Qu\'est-ce qu\'un cycle saisonnier ?', r: "C'est un parcours de plusieurs séances réparties dans l'année, avec le même groupe. Chaque séance prolonge la précédente — rempotage au printemps, bouturage, entretien l'été, compostage à l'automne — pour une vraie montée en compétence au rythme du vivant." },
  { q: 'Faut-il apporter du matériel ou des plantes ?', r: "Non, Ressources fournit les plantes, les pots réemployés et le petit outillage nécessaires. Vous pouvez toutefois apporter une plante en difficulté : elle servira de cas pratique." },
  { q: 'Quel est le tarif d\'un atelier végétal ?', r: "Les interventions sont proposées sur devis, selon le public, la durée et le lieu. Pour les habitants, l'atelier peut être financé par la commune et proposé gratuitement." },
  { q: 'Où interviennent les ateliers végétaux ?', r: "Dans les Landes : médiathèques, salles communales, écoles, établissements sociaux, entreprises, ou en accès libre lors d'un marché ou d'un événement local." },
]

export default function AteliersVegetal() {
  const soeurs = SOUS_PAGES.filter((p) => p.slug !== 'vegetal')

  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Atelier bouturage, rempotage et compostage dans les Landes — Ressources"
        description="Ateliers végétaux dans les Landes : rempotage, bouturage, sauvetage de plantes, compostage et jardinage zéro déchet. Ateliers ponctuels ou cycle saisonnier, pour tous niveaux. Sur devis."
        canonical="/ateliers/vegetal/"
        schema={graph(
          serviceSchema({
            name: 'Ateliers végétaux — rempotage, bouturage, compostage',
            description: 'Ateliers pour apprendre à multiplier ses plantes, réemployer pots et contenants, sauver des plantes fragilisées et réduire ses déchets de jardin.',
            url: '/ateliers/vegetal/',
          }),
          faqSchema(FAQ)
        )}
      />

      <AtelierHero
        eyebrow="Ateliers végétaux"
        h1="Ateliers de bouturage, rempotage et compostage"
        intro="Apprendre les gestes qui font durer le vivant : multiplier ses plantes, réemployer pots et contenants, sauver une plante fragilisée et valoriser ses matières organiques. Des ateliers accessibles à tous, y compris aux débutants."
        chips={['Tous niveaux', 'On repart avec ses plantes', 'Cycle saisonnier', 'Landes']}
      />

      {/* Cycle saisonnier — l'argument fort du végétal */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHead
            label="Notre format phare"
            h2="Le cycle saisonnier : monter en compétence toute l'année"
            intro="On n'apprend pas le végétal en une séance : la matière et les gestes changent avec la saison. Le cycle suit ce rythme, avec le même groupe, pour installer une vraie autonomie."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SAISONS.map(({ s, t, d }) => (
              <Reveal key={s}>
                <div className="relative bg-kaki-pale border border-kaki/15 p-6 h-full">
                  <span className="absolute top-0 left-0 right-0 h-0.5 bg-kaki" />
                  <p className="font-sans text-[11px] font-bold tracking-widest uppercase text-kaki mb-2">{s}</p>
                  <h3 className="font-serif text-lg text-terre mb-2">{t}</h3>
                  <p className="text-sm text-terre/65 leading-relaxed">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="text-sm text-terre/55 mt-6">
            Le cycle se décline aussi en atelier ponctuel ou en animation en accès libre — bar à boutures,
            espace de rempotage — lors d'un marché ou d'un événement.
          </p>
        </div>
      </section>

      {/* Thématiques */}
      <section className="py-16 md:py-20 bg-kaki-pale">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHead
            label="Thématiques"
            h2="Les sujets abordés en atelier végétal"
            intro="Les contenus évoluent selon les saisons, les végétaux disponibles et les attentes du groupe."
          />
          <Reveal><Chips items={THEMES} theme="veg" /></Reveal>
          <p className="text-sm text-terre/60 leading-relaxed mt-8 max-w-3xl">
            Ces ateliers s'appuient sur notre{' '}
            <Link to="/recyclerie-vegetale/" className="text-kaki underline hover:text-kaki-light">recyclerie végétale</Link>{' '}
            : plantes, pots et contenants sont{' '}
            <Link to="/recyclerie-vegetale/comment-donner/" className="text-kaki underline hover:text-kaki-light">collectés auprès des habitants et des professionnels</Link>,
            remis en état, puis{' '}
            <Link to="/recyclerie-vegetale/redistribution/" className="text-kaki underline hover:text-kaki-light">redistribués localement</Link>.
          </p>
        </div>
      </section>

      <Faq items={FAQ} title="Questions fréquentes sur les ateliers végétaux" />
      <PagesSoeurs pages={soeurs} />
      <CtaFinal h2="Organiser un atelier végétal" />
    </Layout>
  )
}
