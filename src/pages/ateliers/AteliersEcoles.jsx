import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import { AtelierHero, SectionHead, Faq, PagesSoeurs, CtaFinal, Reveal } from '../../components/ateliers/AtelierUI'
import { SOUS_PAGES, serviceSchema, faqSchema, graph } from '../../data/ateliers'

const BREADCRUMBS = [{ label: 'Ateliers', href: '/ateliers/' }, { label: 'Pour les écoles' }]

const NIVEAUX = [
  { t: 'Primaire', d: "Découvrir d'où viennent les objets du quotidien et ce qu'ils deviennent. Beaucoup de manipulation : ouvrir un ordinateur, reconnaître les matériaux, bouturer une plante et la voir repartir." },
  { t: 'Collège', d: "Comprendre le cycle de vie d'un équipement, les ressources qu'il mobilise, et le geste du réemploi. On démonte, on diagnostique, on discute des choix concrets." },
  { t: 'Lycée & péri-scolaire', d: "Aller vers les enjeux : sobriété numérique, économie circulaire, filières de recyclage. Un format qui nourrit aussi les projets d'établissement et les parcours citoyens." },
]

const APPORTS = [
  'Un support pédagogique adapté à l\'âge des élèves',
  'De la manipulation réelle : matériel démonté, plantes, outils',
  'Un lien direct avec une structure locale de l\'économie circulaire',
  'Une action concrète : les élèves voient le devenir des objets',
]

const FAQ = [
  { q: 'À partir de quel âge les ateliers sont-ils adaptés ?', r: "Nous intervenons du primaire au lycée, ainsi qu'en accueil péri-scolaire et centre de loisirs. Le contenu, le vocabulaire et la part de manipulation sont ajustés à l'âge des élèves." },
  { q: 'Combien de temps dure une intervention scolaire ?', r: "Le format courant va d'une heure à une demi-journée, adaptable au rythme de la classe et aux contraintes de l'établissement. Un cycle de plusieurs séances est possible, notamment côté végétal où les plantes évoluent d'une séance à l'autre." },
  { q: 'Qui finance l\'intervention ?', r: "L'intervention est généralement financée par l'établissement, la commune, ou dans le cadre d'un projet pédagogique ou d'un dispositif territorial. Nous établissons un devis adapté et pouvons échanger avec votre commune si besoin." },
  { q: 'L\'atelier se déroule-t-il dans l\'école ?', r: "Oui, nous nous déplaçons dans les établissements des Landes avec le matériel nécessaire. Une salle de classe ordinaire suffit dans la plupart des cas." },
  { q: 'Peut-on associer l\'atelier à une collecte dans l\'école ?', r: "Oui, et c'est une formule qui fonctionne très bien : les élèves mobilisent les familles pour rapporter du matériel informatique ou des pots, et voient ensuite concrètement ce qu'il en advient. L'action prend alors du sens au-delà de la classe." },
  { q: 'L\'atelier s\'inscrit-il dans les programmes ?', r: "Les contenus rejoignent l'éducation au développement durable, les sciences et technologie, et l'éducation aux médias et au numérique. Nous adaptons volontiers l'angle à votre projet pédagogique ou à votre label E3D." },
]

export default function AteliersEcoles() {
  const soeurs = SOUS_PAGES.filter((p) => p.slug !== 'ecoles')

  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Atelier pédagogique réemploi et environnement en milieu scolaire — Landes"
        description="Interventions scolaires et péri-scolaires dans les Landes : ateliers sur le réemploi informatique, le numérique responsable et le végétal. Du primaire au lycée, avec manipulation réelle. Sur devis."
        canonical="/ateliers/ecoles/"
        schema={graph(
          serviceSchema({
            name: 'Ateliers pédagogiques en milieu scolaire — réemploi et environnement',
            description: 'Interventions scolaires et péri-scolaires autour du réemploi informatique, du numérique responsable, du cycle de vie des objets et du végétal.',
            url: '/ateliers/ecoles/',
            audienceType: 'Établissements scolaires et péri-scolaires',
          }),
          faqSchema(FAQ)
        )}
      />

      <AtelierHero
        eyebrow="Pour les écoles"
        h1="Ateliers pédagogiques sur le réemploi et l'environnement"
        intro="Faire comprendre le réemploi aux élèves en le leur mettant entre les mains : ouvrir un ordinateur, reconnaître ce qu'il contient, bouturer une plante et la voir repartir. Des interventions concrètes, du primaire au lycée, partout dans les Landes."
        chips={['Primaire à lycée', 'Péri-scolaire', 'Manipulation réelle', 'Landes']}
      />

      {/* Par niveau */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHead
            label="Par niveau"
            h2="Des contenus adaptés à chaque âge"
            intro="Le sujet reste le même — d'où viennent les objets, et que deviennent-ils — mais l'angle et la part de manipulation changent."
          />
          <div className="grid md:grid-cols-3 gap-5">
            {NIVEAUX.map(({ t, d }) => (
              <Reveal key={t}>
                <div className="relative bg-beige-light border border-beige p-7 h-full">
                  <span className="absolute top-0 left-0 right-0 h-0.5 bg-kaki" />
                  <h3 className="font-serif text-xl text-terre mb-2">{t}</h3>
                  <p className="text-sm text-terre/65 leading-relaxed">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ce que l'atelier apporte */}
      <section className="py-16 md:py-20 bg-kaki-pale">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <SectionHead
            label="Ce que l'atelier apporte"
            h2="Une action concrète, pas une leçon de plus"
            intro="Les élèves ne se contentent pas d'entendre parler de recyclage : ils manipulent, démontent, plantent, et rencontrent une structure locale qui fait ce travail au quotidien."
          />
          <Reveal>
            <ul className="grid sm:grid-cols-2 gap-3">
              {APPORTS.map((a) => (
                <li key={a} className="flex items-start gap-3 text-sm text-terre/70 bg-white border border-beige p-4">
                  <span className="text-kaki shrink-0 mt-0.5" aria-hidden>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
          <p className="text-sm text-terre/60 leading-relaxed mt-8">
            Les ateliers scolaires reprennent les contenus de nos{' '}
            <Link to="/ateliers/numerique/" className="text-kaki underline hover:text-kaki-light">ateliers numériques</Link>{' '}
            et de nos{' '}
            <Link to="/ateliers/vegetal/" className="text-kaki underline hover:text-kaki-light">ateliers végétaux</Link>,
            simplifiés et rythmés pour un groupe classe.
          </p>
        </div>
      </section>

      <Faq items={FAQ} title="Questions fréquentes des établissements" />
      <PagesSoeurs pages={soeurs} />
      <CtaFinal
        h2="Organiser un atelier dans votre établissement"
        texte="Parlez-nous de votre classe, de votre projet pédagogique et de vos contraintes : nous construisons une intervention adaptée."
      />
    </Layout>
  )
}
