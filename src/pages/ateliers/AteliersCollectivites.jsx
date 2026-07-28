import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import { AtelierHero, SectionHead, Faq, PagesSoeurs, CtaFinal, Reveal } from '../../components/ateliers/AtelierUI'
import { SOUS_PAGES, TERRITOIRE, serviceSchema, faqSchema, graph } from '../../data/ateliers'

const BREADCRUMBS = [{ label: 'Ateliers', href: '/ateliers/' }, { label: 'Pour les collectivités' }]

const ENJEUX = [
  { t: 'Réduction des déchets (DEEE)', d: "Les équipements électriques et électroniques collectés localement échappent à l'enfouissement et repartent en circulation sur votre territoire." },
  { t: 'Inclusion numérique', d: "Vos habitants les plus éloignés du numérique gagnent en autonomie, et accèdent à du matériel reconditionné à prix solidaire." },
  { t: 'Transition écologique', d: "Une action concrète, visible et mesurable, qui s'inscrit dans vos engagements de transition et d'économie circulaire." },
  { t: 'Lien social et proximité', d: "Un rendez-vous convivial dans une salle communale ou une médiathèque, qui touche familles, seniors et publics isolés." },
]

const DISPOSITIF = [
  { t: 'Un atelier ponctuel', d: 'Une intervention de sensibilisation lors d\'un temps fort communal, d\'un forum associatif ou d\'une animation en médiathèque.' },
  { t: 'Un point de collecte', d: 'La mise en place d\'un point de collecte dans un lieu communal, avec suivi des flux : collecte, reconditionnement, redistribution.' },
  { t: 'Un programme complet', d: 'Sensibilisation, collecte, reconditionnement et redistribution solidaire, avec un accompagnement dans la durée et un bilan d\'impact chiffré.' },
]

const BILAN = [
  'Nombre de participants accompagnés',
  'Équipements collectés et diagnostiqués',
  'Ordinateurs reconditionnés et redistribués',
  'Estimation des déchets électroniques évités',
  'Satisfaction des participants',
]

const FAQ = [
  { q: 'Combien coûte une intervention pour une commune ?', r: "Chaque dispositif est chiffré sur devis, en fonction du nombre d'ateliers, de la mise en place ou non d'un point de collecte, et de la durée de l'accompagnement. Contactez-nous pour recevoir une proposition adaptée à votre budget." },
  { q: 'Les ateliers sont-ils payants pour les habitants ?', r: "Non. Lorsque la commune finance le dispositif, les ateliers sont proposés gratuitement aux habitants. C'est la formule que nous recommandons pour toucher les publics les plus éloignés." },
  { q: 'Quelles communes couvrez-vous ?', r: `Nous intervenons dans les Landes, en priorité sur les communautés de communes ${TERRITOIRE.intercos.join(' et ')}, autour de ${TERRITOIRE.ville}. Nous étudions toute demande sur le département.` },
  { q: 'Que doit fournir la commune ?', r: "Un lieu adapté (salle communale, médiathèque, tiers-lieu), un relais de communication auprès des habitants pour mobiliser les participants, et le soutien financier du dispositif. Nous apportons l'animation, le matériel pédagogique et les équipements." },
  { q: 'Recevons-nous un bilan de l\'opération ?', r: "Oui. Selon le dispositif retenu, nous transmettons un bilan précisant le nombre de participants, les équipements collectés et reconditionnés, l'estimation des déchets évités et la satisfaction des participants — des éléments directement valorisables dans votre communication." },
  { q: 'Peut-on associer l\'atelier à une collecte ?', r: "Oui, c'est même la formule la plus efficace : l'atelier crée l'occasion et la pédagogie, la collecte transforme l'intention en gestes concrets. Les équipements collectés sont ensuite reconditionnés et redistribués localement." },
]

export default function AteliersCollectivites() {
  const soeurs = SOUS_PAGES.filter((p) => p.slug !== 'collectivites')

  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Atelier de sensibilisation au réemploi pour les collectivités — Landes"
        description="Ressources accompagne les communes des Landes : ateliers de sensibilisation au réemploi numérique et végétal, point de collecte, reconditionnement et bilan d'impact chiffré. Devis sur mesure."
        canonical="/ateliers/collectivites/"
        schema={graph(
          serviceSchema({
            name: 'Dispositif territorial de sensibilisation et de réemploi pour les collectivités',
            description: "Ateliers de sensibilisation, point de collecte, reconditionnement et redistribution solidaire, avec bilan d'impact, pour les communes et intercommunalités des Landes.",
            url: '/ateliers/collectivites/',
            audienceType: 'Collectivités et structures publiques',
          }),
          faqSchema(FAQ)
        )}
      />

      <AtelierHero
        eyebrow="Pour les collectivités"
        h1="Ateliers de sensibilisation au réemploi pour les collectivités"
        intro="Ressources conçoit avec les communes et intercommunalités des Landes des dispositifs qui réduisent les déchets électroniques, sensibilisent les habitants et remettent du matériel en circulation localement — avec un bilan d'impact chiffré à la clé."
        chips={['Communes & intercos', 'Landes', 'Gratuit pour les habitants', 'Bilan d\'impact']}
      />

      {/* Enjeux pour la commune */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHead
            label="Vos enjeux"
            h2="Ce que le dispositif apporte à votre territoire"
            intro="Une action qui croise plusieurs de vos politiques publiques : déchets, inclusion, transition écologique et lien social."
          />
          <div className="grid sm:grid-cols-2 gap-5">
            {ENJEUX.map(({ t, d }) => (
              <Reveal key={t}>
                <div className="relative bg-beige-light border border-beige p-6 h-full">
                  <span className="absolute top-0 left-0 right-0 h-0.5 bg-ocre" />
                  <h3 className="font-serif text-xl text-terre mb-2">{t}</h3>
                  <p className="text-sm text-terre/65 leading-relaxed">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Formules */}
      <section className="py-16 md:py-20 bg-ocre-pale border-y border-ocre/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHead
            label="Le dispositif"
            h2="Trois niveaux d'engagement, construits avec vous"
            intro="De l'intervention ponctuelle au programme structurant, le dispositif s'adapte à vos objectifs et à votre budget."
          />
          <div className="grid md:grid-cols-3 gap-5">
            {DISPOSITIF.map(({ t, d }, i) => (
              <Reveal key={t}>
                <div className="bg-white border border-beige p-7 h-full flex flex-col">
                  <div className="w-8 h-8 rounded-full bg-ocre text-white font-serif text-sm font-bold flex items-center justify-center mb-4">{i + 1}</div>
                  <h3 className="font-serif text-xl text-terre mb-2">{t}</h3>
                  <p className="text-sm text-terre/65 leading-relaxed flex-grow">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="text-sm text-terre/60 mt-6">
            Tarifs communiqués sur devis, selon le nombre d'ateliers, la durée et les modalités retenues.
          </p>
        </div>
      </section>

      {/* Bilan d'impact */}
      <section className="py-16 md:py-20 bg-kaki text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-ocre" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          <p className="font-sans text-ocre-light text-xs font-semibold tracking-[0.22em] uppercase mb-4">Redevabilité</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4">Un bilan d'impact valorisable</h2>
          <p className="text-white/65 leading-relaxed mb-8 max-w-2xl">
            À l'issue du dispositif, nous vous transmettons des données concrètes, utilisables
            dans votre bulletin municipal, vos rapports ou vos demandes de subvention.
          </p>
          <ul className="grid sm:grid-cols-2 gap-3">
            {BILAN.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-white/80">
                <span className="text-ocre-light shrink-0 mt-0.5" aria-hidden>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Territoire */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <SectionHead
            label="Territoire"
            h2="Où nous intervenons dans les Landes"
            intro={`Basée à ${TERRITOIRE.ville} (${TERRITOIRE.codePostal}), l'association intervient prioritairement sur les communautés de communes ${TERRITOIRE.intercos.join(' et ')}, et étudie toute demande sur le département.`}
          />
          <Reveal>
            <div className="flex flex-wrap gap-2.5">
              {TERRITOIRE.communes.map((c) => (
                <span key={c} className="text-sm text-kaki bg-beige-light border border-beige-dark px-4 py-2 rounded-full">{c}</span>
              ))}
              <span className="text-sm text-terre/50 px-2 py-2">et les communes voisines…</span>
            </div>
          </Reveal>
          <p className="text-sm text-terre/60 leading-relaxed mt-8">
            En savoir plus sur{' '}
            <Link to="/association/territoire/" className="text-ocre-dark underline hover:text-ocre">notre territoire d'intervention</Link>{' '}
            et sur{' '}
            <Link to="/association/partenaires/" className="text-ocre-dark underline hover:text-ocre">nos partenaires locaux</Link>.
          </p>
        </div>
      </section>

      <Faq items={FAQ} title="Questions fréquentes des collectivités" />
      <PagesSoeurs pages={soeurs} />
      <CtaFinal
        h2="Construire un dispositif pour votre commune"
        texte="Présentez-nous votre territoire, vos publics et vos objectifs : nous vous proposons un dispositif adapté et un devis détaillé."
      />
    </Layout>
  )
}
