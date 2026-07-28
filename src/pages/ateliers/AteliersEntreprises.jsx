import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import { AtelierHero, SectionHead, Faq, PagesSoeurs, CtaFinal, Reveal } from '../../components/ateliers/AtelierUI'
import { SOUS_PAGES, serviceSchema, faqSchema, graph } from '../../data/ateliers'

const BREADCRUMBS = [{ label: 'Ateliers', href: '/ateliers/' }, { label: 'Pour les entreprises' }]

const VOLETS = [
  { t: 'Collecter votre parc en fin de vie', d: "Ordinateurs, écrans, périphériques et téléphones qui dorment dans vos placards sont collectés, diagnostiqués et remis en circulation localement plutôt que détruits." },
  { t: 'Sécuriser vos données', d: "Chaque appareil fait l'objet d'un effacement sécurisé des données avant tout réemploi. Un point essentiel pour vos obligations et votre tranquillité." },
  { t: 'Sensibiliser vos équipes', d: "Un atelier participatif sur l'impact du numérique, la sobriété et le réemploi — un temps concret qui change les gestes du quotidien, au bureau comme à la maison." },
  { t: 'Mesurer et valoriser', d: "Un bilan de l'opération : équipements collectés, réemployés, déchets évités. De quoi nourrir votre rapport RSE avec des chiffres réels et locaux." },
]

const FORMATS = [
  { t: 'Journée de mobilisation interne', d: "Un atelier intégré à votre semaine du développement durable, votre journée QVT ou un temps fort d'entreprise." },
  { t: 'Atelier de cohésion d\'équipe', d: 'Un moment collectif utile : bar à boutures, rempotage ou diagnostic de matériel, qui fédère autrement qu\'un séminaire classique.' },
  { t: 'Opération collecte + sensibilisation', d: "Une campagne interne de collecte du matériel dormant, ponctuée d'un atelier et suivie d'un bilan d'impact." },
]

const FAQ = [
  { q: 'Quel est l\'intérêt RSE d\'un atelier avec Ressources ?', r: "Il relie un engagement déclaré à une action locale et mesurable : du matériel réellement réemployé sur le territoire, des salariés sensibilisés, et un bilan chiffré (équipements collectés, déchets évités) utilisable dans votre reporting extra-financier." },
  { q: 'Que devient le matériel informatique que nous donnons ?', r: "Il est collecté, diagnostiqué et trié. Les données sont effacées de façon sécurisée, les appareils viables sont reconditionnés par des bénévoles formés, puis redistribués à prix solidaire à des habitants, associations et structures du territoire landais. Ce qui n'est pas réemployable part vers les filières de recyclage adaptées." },
  { q: 'Nos données professionnelles sont-elles protégées ?', r: "Oui. L'effacement sécurisé des données est une étape systématique de notre processus de reconditionnement, avant toute remise en circulation. C'est un préalable non négociable de notre travail." },
  { q: 'Un don de matériel est-il déductible ?', r: "L'association Ressources est reconnue d'intérêt général. Selon la nature et la valorisation du don, un reçu peut être établi. Contactez-nous pour examiner votre situation, ou consultez notre page mécénat." },
  { q: 'Combien coûte un atelier en entreprise ?', r: "Les interventions en entreprise sont proposées sur devis, selon le format retenu, la durée, le nombre de participants et le lieu. Une opération associant collecte et atelier est chiffrée globalement." },
  { q: 'Intervenez-vous dans nos locaux ?', r: "Oui, nous nous déplaçons dans vos locaux dans les Landes. Les conditions techniques et les modalités de déplacement sont définies ensemble en amont." },
]

export default function AteliersEntreprises() {
  const soeurs = SOUS_PAGES.filter((p) => p.slug !== 'entreprises')

  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Atelier RSE et collecte de matériel informatique en entreprise — Landes"
        description="Ateliers RSE dans les Landes : collecte de votre parc informatique en fin de vie, effacement sécurisé des données, sensibilisation des collaborateurs au réemploi et bilan d'impact. Sur devis."
        canonical="/ateliers/entreprises/"
        schema={graph(
          serviceSchema({
            name: 'Ateliers RSE et collecte de matériel informatique en entreprise',
            description: "Collecte du parc informatique en fin de vie, effacement sécurisé des données, ateliers de sensibilisation des collaborateurs au réemploi et redistribution solidaire, avec bilan d'impact.",
            url: '/ateliers/entreprises/',
            audienceType: 'Entreprises et démarches RSE',
          }),
          faqSchema(FAQ)
        )}
      />

      <AtelierHero
        eyebrow="Pour les entreprises"
        h1="Ateliers RSE et collecte de matériel informatique"
        intro="Transformez vos engagements RSE en action concrète et locale : le matériel informatique qui dort dans vos placards est collecté, sécurisé et remis en circulation dans les Landes, pendant que vos équipes sont sensibilisées au réemploi."
        chips={['Landes', 'Effacement sécurisé', 'Bilan d\'impact', 'Sur devis']}
      />

      {/* Les 4 volets */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHead
            label="Notre proposition"
            h2="Une opération RSE complète, du placard au réemploi"
            intro="Quatre volets qui s'articulent : on peut n'en activer qu'un, ou construire l'opération complète."
          />
          <div className="grid sm:grid-cols-2 gap-5">
            {VOLETS.map(({ t, d }, i) => (
              <Reveal key={t}>
                <div className="relative bg-beige-light border border-beige p-6 h-full">
                  <span className="absolute top-0 left-0 right-0 h-0.5 bg-kaki" />
                  <div className="w-8 h-8 rounded-full bg-kaki text-white font-serif text-sm font-bold flex items-center justify-center mb-4">{i + 1}</div>
                  <h3 className="font-serif text-xl text-terre mb-2">{t}</h3>
                  <p className="text-sm text-terre/65 leading-relaxed">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="text-sm text-terre/60 leading-relaxed mt-8 max-w-3xl">
            En savoir plus sur notre{' '}
            <Link to="/recyclerie-informatique/reconditionnement/" className="text-kaki underline hover:text-kaki-light">processus de reconditionnement</Link>{' '}
            et sur{' '}
            <Link to="/recyclerie-informatique/effacement-donnees/" className="text-kaki underline hover:text-kaki-light">l'effacement sécurisé des données</Link>.
          </p>
        </div>
      </section>

      {/* Formats */}
      <section className="py-16 md:py-20 bg-kaki-pale">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHead
            label="Formats"
            h2="Quand organiser un atelier en entreprise ?"
            intro="L'intervention s'intègre à un temps fort existant, ou constitue elle-même l'événement."
          />
          <div className="grid md:grid-cols-3 gap-5">
            {FORMATS.map(({ t, d }) => (
              <Reveal key={t}>
                <div className="bg-white border border-beige p-7 h-full">
                  <h3 className="font-serif text-xl text-terre mb-2">{t}</h3>
                  <p className="text-sm text-terre/65 leading-relaxed">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mécénat */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="section-label">Aller plus loin</p>
          <h2 className="font-serif text-2xl sm:text-3xl text-terre mb-4">Soutenir durablement la recyclerie</h2>
          <p className="text-terre/65 leading-relaxed mb-6">
            Au-delà d'une opération ponctuelle, votre entreprise peut soutenir le projet dans la durée —
            mécénat financier, mécénat de compétences ou don de matériel.
          </p>
          <Link to="/soutenir/mecene/" className="btn-outline-ocre">Découvrir le mécénat</Link>
        </div>
      </section>

      <Faq items={FAQ} title="Questions fréquentes des entreprises" />
      <PagesSoeurs pages={soeurs} />
      <CtaFinal
        h2="Construire votre action RSE"
        texte="Parlez-nous de vos objectifs, de vos équipes et de votre parc informatique : nous vous proposons une opération sur mesure et un devis détaillé."
      />
    </Layout>
  )
}
