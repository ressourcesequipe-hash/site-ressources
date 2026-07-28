import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import { AtelierHero, SectionHead, Chips, Faq, PagesSoeurs, CtaFinal, Reveal } from '../../components/ateliers/AtelierUI'
import { SOUS_PAGES, serviceSchema, faqSchema, graph } from '../../data/ateliers'

const BREADCRUMBS = [{ label: 'Ateliers', href: '/ateliers/' }, { label: 'Ateliers numériques' }]

const THEMES = [
  'Entretien courant d\'un ordinateur',
  'Comprendre les composants',
  'Allonger la durée de vie du matériel',
  'Sobriété numérique',
  'Nettoyage et tri des données',
  'Bonnes pratiques de sécurité',
  'Reconditionnement et réemploi',
  'Collecte responsable des équipements',
]

const DEROULE = [
  { t: 'Comprendre (45 min)', d: "Impacts environnementaux du numérique, cycle de vie d'un équipement, causes réelles des pannes. Un quiz collectif fait émerger les représentations avant les apports." },
  { t: 'Diagnostiquer', d: "Identifier une panne simple, distinguer un problème logiciel d'une défaillance matérielle, et savoir quand une réparation vaut le coup." },
  { t: 'Décider', d: 'Comparer les options — réparer, réutiliser, donner, acheter reconditionné, recycler — selon des critères simples : coût, état, usage.' },
  { t: 'Pratiquer (en option)', d: "Mise en situation sur du matériel réel : ouverture, nettoyage, remplacement d'un composant, premiers gestes d'entretien, accompagnés par un technicien." },
]

const FAQ = [
  { q: 'Faut-il des connaissances en informatique pour participer ?', r: "Non, aucun prérequis technique. Les ateliers s'adressent à des utilisateurs non spécialistes : savoir se servir basiquement d'un ordinateur ou d'un téléphone suffit. Le contenu est adapté au niveau réel des participants." },
  { q: 'Peut-on apporter son propre ordinateur en panne ?', r: "Oui, c'est même encouragé pour la séance pratique. Les participants peuvent apporter leur ordinateur, tablette ou périphérique. Ressources peut aussi fournir du matériel issu de ses collectes si vous préférez." },
  { q: 'Combien de temps dure un atelier numérique ?', r: "Le format de sensibilisation dure environ 1 heure. Complété d'une mise en pratique, comptez 1 h 30 à une demi-journée. La durée s'ajuste au public et au temps dont vous disposez." },
  { q: 'Quel est le tarif d\'un atelier ?', r: "Les ateliers sont proposés sur devis, selon le public, la durée et le lieu d'intervention. Pour les habitants, l'atelier peut être financé par la collectivité et proposé gratuitement aux participants." },
  { q: 'Où se déroulent les ateliers numériques ?', r: "Dans les Landes : en mairie, médiathèque, établissement scolaire ou social, locaux d'entreprise, ou lors d'un événement. Nous nous déplaçons sur le territoire, notamment sur les communautés de communes Côte Landes Nature et MACS." },
  { q: 'Mes données personnelles sont-elles protégées ?', r: "Oui. L'effacement des données est un pilier de notre travail de reconditionnement, et le sujet est abordé en atelier. Les appareils confiés à la recyclerie font l'objet d'un effacement sécurisé avant toute remise en circulation." },
]

export default function AteliersNumerique() {
  const soeurs = SOUS_PAGES.filter((p) => p.slug !== 'numerique')

  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Atelier réemploi et réparation informatique dans les Landes — Ressources"
        description="Ateliers de sensibilisation au réemploi informatique dans les Landes : comprendre les impacts du numérique, diagnostiquer une panne et choisir entre réparer, réutiliser ou recycler. Sans prérequis, sur devis."
        canonical="/ateliers/numerique/"
        schema={graph(
          serviceSchema({
            name: 'Ateliers de sensibilisation au réemploi informatique',
            description: "Ateliers pour comprendre l'impact environnemental du numérique, diagnostiquer une panne simple et choisir entre réparation, réemploi et recyclage.",
            url: '/ateliers/numerique/',
          }),
          faqSchema(FAQ)
        )}
      />

      <AtelierHero
        eyebrow="Ateliers numériques"
        h1="Ateliers de réemploi et de réparation informatique"
        intro="Face à un ordinateur ou un téléphone en panne, le remplacement n'est pas la seule option. Nos ateliers aident chacun à comprendre l'impact environnemental du numérique, à identifier une panne simple et à choisir la meilleure solution — réparer, réutiliser ou recycler."
        chips={['Sans prérequis', '1 h à une demi-journée', 'Landes', 'Sur devis']}
      />

      {/* Ce qu'on y apprend */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHead
            label="Le déroulé"
            h2="Comprendre, diagnostiquer, décider"
            intro="Un atelier construit en étapes, de la prise de conscience jusqu'à la décision concrète pour son propre matériel."
          />
          <div className="grid sm:grid-cols-2 gap-5">
            {DEROULE.map(({ t, d }, i) => (
              <Reveal key={t}>
                <div className="relative bg-beige-light border border-beige p-6 h-full">
                  <span className="absolute top-0 left-0 right-0 h-0.5 bg-ocre" />
                  <div className="w-8 h-8 rounded-full bg-ocre text-white font-serif text-sm font-bold flex items-center justify-center mb-4">{i + 1}</div>
                  <h3 className="font-serif text-xl text-terre mb-2">{t}</h3>
                  <p className="text-sm text-terre/65 leading-relaxed">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Thématiques */}
      <section className="py-16 md:py-20 bg-ocre-pale border-y border-ocre/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHead
            label="Thématiques"
            h2="Les sujets abordés en atelier informatique"
            intro="Chaque intervention combine plusieurs thématiques selon le niveau du groupe et vos objectifs."
          />
          <Reveal><Chips items={THEMES} theme="num" /></Reveal>
          <p className="text-sm text-terre/60 leading-relaxed mt-8 max-w-3xl">
            Ces ateliers prolongent le travail de notre{' '}
            <Link to="/recyclerie-informatique/" className="text-ocre-dark underline hover:text-ocre">recyclerie informatique</Link>{' '}
            : les équipements collectés sont{' '}
            <Link to="/recyclerie-informatique/reconditionnement/" className="text-ocre-dark underline hover:text-ocre">reconditionnés</Link>,
            leurs{' '}
            <Link to="/recyclerie-informatique/effacement-donnees/" className="text-ocre-dark underline hover:text-ocre">données effacées de façon sécurisée</Link>,
            puis redistribués à prix solidaire sur le territoire landais.
          </p>
        </div>
      </section>

      {/* Pour qui */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHead label="Pour qui" h2="À qui s'adressent ces ateliers ?" />
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { t: 'Habitants et publics éloignés du numérique', d: "Personnes en précarité numérique, seniors, familles, habitants de communes rurales.", to: '/ateliers/collectivites/', cta: 'Via votre commune' },
              { t: 'Salariés en démarche RSE', d: 'Sensibilisation des équipes, couplée à une collecte du parc informatique en fin de vie.', to: '/ateliers/entreprises/', cta: 'Offre entreprises' },
              { t: 'Élèves et jeunes publics', d: 'Interventions scolaires et péri-scolaires sur le numérique responsable.', to: '/ateliers/ecoles/', cta: 'Offre écoles' },
            ].map(({ t, d, to, cta }) => (
              <Reveal key={t}>
                <div className="border border-beige bg-white p-6 h-full flex flex-col">
                  <h3 className="font-serif text-lg text-terre mb-2">{t}</h3>
                  <p className="text-sm text-terre/60 leading-relaxed mb-4 flex-grow">{d}</p>
                  <Link to={to} className="text-sm font-medium text-ocre hover:underline">{cta} →</Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Faq items={FAQ} title="Questions fréquentes sur les ateliers numériques" />
      <PagesSoeurs pages={soeurs} />
      <CtaFinal h2="Organiser un atelier numérique" />
    </Layout>
  )
}
