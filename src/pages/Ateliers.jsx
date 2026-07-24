import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { useReveal } from '../hooks/useReveal'

/* ── Petit wrapper d'apparition au scroll (idiome du site) ── */
function Reveal({ children, className = '' }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} className={`${className} ${visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
      {children}
    </div>
  )
}

/* ── Icônes inline ── */
const IconEcran = (p) => (
  <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="12" rx="1" strokeWidth="1.8" /><path strokeWidth="1.8" strokeLinecap="round" d="M2 20h20M9 8h6M9 11h4" /></svg>
)
const IconFeuille = (p) => (
  <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 21V11M12 11c0-4 3-7 8-7 0 4-3 7-8 7zM12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5z" /></svg>
)
const IconBouture = (p) => (
  <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M7 20c0-4 2-7 5-7M17 20c0-3-1.5-5.5-4-6M12 13V8M9 8h6" /><circle cx="12" cy="5" r="2.2" strokeWidth="1.8" /></svg>
)
const IconMairie = (p) => (
  <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-5h6v5" /></svg>
)
const IconArrow = (p) => (
  <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7M21 12H3" /></svg>
)
const IconCible = (p) => (
  <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M12 3l7 4v5c0 5-3 8-7 9-4-1-7-4-7-9V7z" /></svg>
)
const IconHorloge = (p) => (
  <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M22 12a10 10 0 11-20 0 10 10 0 0120 0z" /></svg>
)
const IconGraphe = (p) => (
  <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M4 19V5M4 19h16M8 16l3-4 3 2 5-7" /></svg>
)
const IconEquipe = (p) => (
  <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m0 0a4 4 0 100-7.75M15 8a4 4 0 11-6 3.4" /></svg>
)

/* ── Données ── */
const FORMATS = [
  {
    theme: 'num', Icon: IconEcran, tag: 'Numérique', title: 'Réparer, réutiliser ou recycler ?',
    desc: "Sensibilisation d'environ 1 h aux impacts du numérique et aux options face à une panne. Extensible d'une séance de mise en pratique : diagnostic et premiers gestes sur du matériel réel.",
    who: 'Grand public · Collectivités · RSE', price: 'Sur devis',
  },
  {
    theme: 'veg', Icon: IconFeuille, tag: 'Végétal · Cycle', title: 'Le cycle saisonnier du végétal',
    desc: 'Un parcours évolutif : rempotage, bouturage, entretien, sauvetage de plantes, compostage. Chaque séance prolonge la précédente pour une vraie montée en compétence au fil des saisons.',
    who: "Toute l'année · même groupe", price: 'Sur devis',
  },
  {
    theme: 'veg', Icon: IconBouture, tag: 'Végétal · Accès libre', title: 'Bar à boutures & rempotage',
    desc: 'Animation en accès libre lors d\'un événement ou en petit groupe. Chacun repart avec ses boutures et ses plantes. Idéal pour un forum, un marché ou une journée conviviale.',
    who: 'Grand public · Événement', price: 'Programmation à venir', soon: true,
  },
  {
    theme: 'veg', Icon: IconMairie, tag: 'Territoire', title: 'Programme territorial',
    desc: "Pour une commune : sensibilisation + collecte + reconditionnement + redistribution solidaire, avec un bilan d'impact chiffré et valorisable auprès de vos habitants.",
    who: 'Collectivités', price: 'Sur devis',
  },
]

const DUREES = [
  { k: 'Découvrir', kColor: 'text-ocre', title: 'Un atelier pour sensibiliser', time: '1 h à 2 h', desc: 'Un format court pour faire découvrir une pratique ou enrichir un événement : animation grand public, journée RSE, forum, médiathèque.' },
  { k: 'Pratiquer', kColor: 'text-ocre', title: 'Un atelier pour manipuler', time: '1 h 30 à une demi-journée', desc: 'La sensibilisation complétée d\'une mise en situation : manipuler du matériel, expérimenter des gestes simples, comprendre les solutions concrètes.' },
  { k: 'Progresser', kColor: 'text-kaki-light', title: 'Un cycle pour monter en compétence', time: 'Parcours évolutif', desc: 'Plusieurs séances qui s\'enchaînent pour installer l\'autonomie dans la durée. Particulièrement pertinent côté végétal, rythmé par les saisons.' },
]

const THEMES_NUM = ['Entretien courant', "Composants d'un ordinateur", 'Durée de vie du matériel', 'Sobriété numérique', 'Nettoyage & tri des données', 'Bonnes pratiques de sécurité', 'Reconditionnement & réemploi', 'Collecte responsable']
const THEMES_VEG = ['Rempotage', 'Réemploi des pots & contenants', 'Bouturage', 'Entretien des plantes', 'Sauvetage de plantes fragilisées', 'Compostage', 'Jardinage zéro déchet', 'Adoption de plantes récupérées']

const PROOF = [
  { Icon: IconCible, title: 'Objectifs définis', desc: '« À l\'issue, le participant sera capable de… » — chaque séance vise des compétences précises.' },
  { Icon: IconHorloge, title: 'Théorie & pratique', desc: 'Apports courts, quiz, études de cas, puis mise en situation sur du matériel réel.' },
  { Icon: IconGraphe, title: "Bilan d'impact", desc: 'Participants, équipements diagnostiqués, plantes réemployées, déchets évités, satisfaction.' },
  { Icon: IconEquipe, title: 'Co-construction', desc: 'Animateurs, techniciens et partenaires du territoire mobilisés selon le projet.' },
]

const STEPS = [
  { n: '1', title: 'Identifier le besoin', desc: 'On échange sur le public, les objectifs, le contexte, les contraintes et les résultats attendus.' },
  { n: '2', title: 'Définir le format', desc: 'On propose une durée, un contenu, une jauge et des modalités d\'animation adaptés.' },
  { n: '3', title: "Préparer l'intervention", desc: 'On réunit équipements, consommables, supports pédagogiques et partenaires à mobiliser.' },
  { n: '4', title: 'Animer & évaluer', desc: 'On anime, puis on remet un bilan précisant participation, réemploi et déchets évités.' },
]

const LIEUX = ['Commune & intercommunalité', 'Médiathèque', 'Établissement scolaire ou social', 'Locaux d\'entreprise', 'Structure associative', 'Salon · forum · événement', 'Groupe constitué']

/* ── Schema.org Service ── */
const SERVICE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Ateliers de sensibilisation et de réemploi — Association Ressources',
  serviceType: 'Ateliers de sensibilisation au réemploi numérique et végétal',
  provider: { '@type': 'NGO', name: 'Association Ressources', url: 'https://www.ressourcesrecyclerie.fr' },
  areaServed: { '@type': 'AdministrativeArea', name: 'Landes' },
  description: "Ateliers de sensibilisation et de mise en pratique autour du réemploi numérique, du végétal et de la réduction des déchets, pour collectivités, entreprises, écoles et grand public dans les Landes.",
  audience: [
    { '@type': 'Audience', audienceType: 'Collectivités et structures publiques' },
    { '@type': 'Audience', audienceType: 'Entreprises (RSE)' },
    { '@type': 'Audience', audienceType: 'Grand public et adhérents' },
  ],
}

export default function Ateliers() {
  return (
    <Layout>
      <SEO
        title="Ateliers de sensibilisation au réemploi numérique et végétal — Ressources, Landes"
        description="Ateliers construits sur mesure autour du réemploi numérique, du végétal et de la réduction des déchets. Pour collectivités, entreprises (RSE), écoles et grand public dans les Landes. Sur devis."
        canonical="/ateliers/"
        schema={SERVICE_SCHEMA}
      />

      {/* HERO — silo kaki */}
      <section className="bg-kaki text-white py-14 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-ocre" />
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-ocre/5 rounded-tl-full pointer-events-none" aria-hidden />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            Ateliers & interventions
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-white leading-tight mb-4">
            Des ateliers construits<br />autour de vos besoins
          </h1>
          <div className="w-12 h-0.5 bg-ocre mb-6" />
          <p className="text-white/65 max-w-xl leading-relaxed mb-8">
            Comprendre, expérimenter, agir. Ressources conçoit et anime des ateliers autour du
            réemploi numérique, du végétal et de la réduction des déchets — adaptés à votre
            public, votre lieu et vos objectifs.
          </p>
          <div className="flex flex-wrap gap-4 mb-7">
            <Link to="/contact/" className="btn-ocre">Demander un devis <IconArrow className="w-4 h-4" /></Link>
            <Link to="/contact/" className="btn-outline-white">Nous contacter</Link>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {['Grand public', 'Collectivités', 'Entreprises · RSE', 'Écoles & structures'].map((c) => (
              <span key={c} className="text-xs text-white/85 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* LA CARTE — formats phares */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="max-w-2xl mb-10">
            <p className="section-label">Nos formats</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-terre mb-3">Des points de départ concrets</h2>
            <p className="text-terre/60 leading-relaxed">
              Voici nos formats phares. Chacun est un point de départ : durée, contenu et
              modalités s'adaptent ensuite à votre projet.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FORMATS.map(({ theme, Icon, tag, title, desc, who, price, soon }) => {
              const isNum = theme === 'num'
              return (
                <article key={title} className="relative bg-white border border-beige p-6 flex flex-col hover:-translate-y-1 hover:shadow-lg hover:border-beige-dark transition-all duration-300">
                  <span className={`absolute top-0 left-0 right-0 h-0.5 ${isNum ? 'bg-ocre' : 'bg-kaki'}`} />
                  <div className={`w-11 h-11 border flex items-center justify-center mb-4 ${isNum ? 'border-ocre/25 bg-ocre/5 text-ocre' : 'border-kaki/25 bg-kaki/5 text-kaki'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className={`font-sans text-[10.5px] font-bold tracking-widest uppercase mb-3 ${isNum ? 'text-ocre' : 'text-kaki'}`}>{tag}</p>
                  <h3 className="font-serif text-xl text-terre mb-2 leading-snug">{title}</h3>
                  <p className="text-sm text-terre/60 leading-relaxed flex-grow mb-4">{desc}</p>
                  <div className="flex items-center justify-between border-t border-beige pt-3.5">
                    <span className="text-xs text-terre/45">{who}</span>
                    <span className={`font-serif text-[15px] font-semibold ${soon ? 'text-kaki-light !text-[12.5px]' : isNum ? 'text-ocre' : 'text-kaki'}`}>{price}</span>
                  </div>
                </article>
              )
            })}
          </div>
          <p className="text-xs text-terre/45 mt-5">
            Tarifs communiqués sur devis, selon le public, la durée et le lieu. Les ateliers destinés
            aux habitants peuvent être financés par la collectivité et proposés gratuitement.
          </p>
        </div>
      </section>

      {/* FORMATS / durées */}
      <section className="py-16 md:py-20 bg-beige-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="max-w-2xl mb-10">
            <p className="section-label">Formats</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-terre mb-3">Ponctuel, pratique ou dans la durée</h2>
            <p className="text-terre/60 leading-relaxed">
              Le même sujet peut être traité en une heure ou en plusieurs séances. On choisit
              ensemble selon vos objectifs.
            </p>
          </Reveal>
          <Reveal>
            <div className="grid md:grid-cols-3 border border-beige-dark bg-white">
              {DUREES.map(({ k, kColor, title, time, desc }, i) => (
                <div key={k} className={`p-8 ${i < DUREES.length - 1 ? 'border-b md:border-b-0 md:border-r border-beige' : ''}`}>
                  <p className={`font-sans text-xs font-bold tracking-widest uppercase mb-2 ${kColor}`}>{k}</p>
                  <h3 className="font-serif text-xl text-terre mb-2">{title}</h3>
                  <p className="font-serif text-[15px] text-kaki-light mb-3">{time}</p>
                  <p className="text-sm text-terre/60 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* DEUX UNIVERS */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="max-w-2xl mb-10">
            <p className="section-label">Nos thématiques</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-terre mb-3">Deux univers, une même logique de réemploi</h2>
            <p className="text-terre/60 leading-relaxed">
              Chaque intervention peut associer plusieurs de ces thématiques selon les besoins du groupe.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            <Reveal>
              <div className="bg-ocre-pale border border-ocre/20 p-8 h-full">
                <h3 className="font-serif text-2xl text-ocre-dark mb-1.5 flex items-center gap-2.5">
                  <IconEcran className="w-6 h-6" /> Numérique
                </h3>
                <p className="text-sm text-terre/60 mb-5">Mieux comprendre ses équipements pour les faire durer, plutôt que les remplacer.</p>
                <div className="flex flex-wrap gap-2">
                  {THEMES_NUM.map((t) => (
                    <span key={t} className="text-sm bg-white border border-ocre/30 text-ocre-dark px-3 py-1.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal>
              <div className="bg-kaki-pale border border-kaki/15 p-8 h-full">
                <h3 className="font-serif text-2xl text-kaki mb-1.5 flex items-center gap-2.5">
                  <IconFeuille className="w-6 h-6" /> Plantes
                </h3>
                <p className="text-sm text-terre/60 mb-5">Prendre soin, transmettre et réemployer : plantes, pots, contenants et matières organiques.</p>
                <div className="flex flex-wrap gap-2">
                  {THEMES_VEG.map((t) => (
                    <span key={t} className="text-sm bg-white border border-kaki/20 text-kaki px-3 py-1.5 rounded-full">{t}</span>
                  ))}
                </div>
                <p className="text-sm text-terre/60 mt-5 pt-4 border-t border-dashed border-kaki/25">
                  <b className="text-kaki">Un fil saisonnier :</b> rempotage au printemps → bouturage → entretien l'été → compostage à l'automne → préparer la saison suivante. Le cycle suit le rythme du vivant.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PUBLICS */}
      <section className="py-16 md:py-20 bg-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="max-w-2xl mb-10">
            <p className="section-label">À qui s'adressent nos ateliers</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-terre mb-3">Une offre adaptée à chaque public</h2>
            <p className="text-terre/60 leading-relaxed">Sur-mesure pour les structures, sur inscription pour les particuliers.</p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">

            <Reveal className="h-full">
              <div className="bg-white border border-beige border-t-2 border-t-beige-dark p-7 flex flex-col h-full">
                <p className="font-sans text-xs font-bold tracking-widest uppercase text-ocre mb-3">
                  Particuliers & adhérents
                  <span className="ml-2 inline-block text-[9.5px] font-bold tracking-widest uppercase text-kaki-light bg-kaki-pale border border-kaki/20 px-2 py-0.5 rounded-full align-middle">Bientôt</span>
                </p>
                <h3 className="font-serif text-2xl text-terre mb-3">Découvrir & gagner en autonomie</h3>
                <p className="text-sm text-terre/60 leading-relaxed mb-4">Des ateliers conviviaux pour apprendre des gestes concrets et échanger, ouverts à tous. La programmation grand public arrive prochainement.</p>
                <ul className="space-y-2 mb-6 flex-grow">
                  {['Inscription à une date, en petits groupes', 'Tarif accessible', 'On repart avec ses plantes ou ses réflexes'].map((li) => (
                    <li key={li} className="flex items-start gap-2.5 text-sm text-terre/70"><span className="w-1.5 h-1.5 rounded-full bg-ocre-light mt-1.5 shrink-0" />{li}</li>
                  ))}
                </ul>
                <span className="inline-flex items-center justify-center border border-dashed border-beige-dark text-terre/45 font-sans text-sm px-6 py-3 cursor-default select-none">Programmation à venir</span>
              </div>
            </Reveal>

            <Reveal className="h-full">
              <div className="bg-white border border-beige border-t-2 border-t-ocre p-7 flex flex-col h-full">
                <p className="font-sans text-xs font-bold tracking-widest uppercase text-ocre mb-3">Collectivités & structures publiques</p>
                <h3 className="font-serif text-2xl text-terre mb-3">Une intervention à la carte</h3>
                <p className="text-sm text-terre/60 leading-relaxed mb-4">Construite pour votre territoire et vos publics : habitants, jeunes, seniors, familles, publics éloignés du numérique, scolaires, structures sociales.</p>
                <ul className="space-y-2 mb-6 flex-grow">
                  {['Atelier ponctuel ou animation événementielle', "Programme avec indicateurs de participation et d'impact", 'Intervention associée à une collecte'].map((li) => (
                    <li key={li} className="flex items-start gap-2.5 text-sm text-terre/70"><span className="w-1.5 h-1.5 rounded-full bg-ocre-light mt-1.5 shrink-0" />{li}</li>
                  ))}
                </ul>
                <Link to="/contact/" className="btn-ocre text-sm w-full">Demander un devis</Link>
              </div>
            </Reveal>

            <Reveal className="h-full">
              <div className="bg-white border border-beige border-t-2 border-t-kaki p-7 flex flex-col h-full">
                <p className="font-sans text-xs font-bold tracking-widest uppercase text-kaki mb-3">Entreprises & RSE</p>
                <h3 className="font-serif text-2xl text-terre mb-3">Relier vos engagements à une action concrète</h3>
                <p className="text-sm text-terre/60 leading-relaxed mb-4">Intégré à une journée de mobilisation interne ou à une action de cohésion — une démarche locale et mesurable.</p>
                <ul className="space-y-2 mb-6 flex-grow">
                  {['Collecte de matériel informatique ou de plantes', 'Sensibilisation & atelier participatif', 'Réemploi, redistribution solidaire & bilan'].map((li) => (
                    <li key={li} className="flex items-start gap-2.5 text-sm text-terre/70"><span className="w-1.5 h-1.5 rounded-full bg-kaki/40 mt-1.5 shrink-0" />{li}</li>
                  ))}
                </ul>
                <Link to="/contact/" className="btn-kaki text-sm w-full">Construire une action RSE</Link>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* PREUVE — méthode */}
      <section className="py-16 md:py-20 bg-kaki text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-ocre" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <p className="font-sans text-ocre-light text-xs font-semibold tracking-[0.22em] uppercase mb-4">Notre méthode</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4">Une démarche pédagogique construite</h2>
          <p className="text-white/65 max-w-2xl leading-relaxed mb-10">
            Chaque atelier repose sur des objectifs clairs, une alternance entre apports et pratique,
            et une évaluation des acquis. Rien d'improvisé.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROOF.map(({ Icon, title, desc }) => (
              <Reveal key={title} className="h-full">
                <div className="bg-white/[0.06] border border-white/10 p-6 h-full">
                  <div className="text-ocre-light mb-4"><Icon className="w-6 h-6" /></div>
                  <h3 className="font-serif text-lg text-white mb-2">{title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS + LIEUX */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="max-w-2xl mb-10">
            <p className="section-label">Comment ça se passe</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-terre">Comment nous construisons votre intervention</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {STEPS.map(({ n, title, desc }) => (
              <Reveal key={n}>
                <div className="w-8 h-8 rounded-full bg-ocre text-white font-serif text-sm font-bold flex items-center justify-center mb-4">{n}</div>
                <h3 className="font-serif text-lg text-terre mb-2">{title}</h3>
                <p className="text-sm text-terre/60 leading-relaxed">{desc}</p>
              </Reveal>
            ))}
          </div>
          <div>
            <p className="section-label">Où ?</p>
            <div className="flex flex-wrap gap-2.5 mt-2">
              {LIEUX.map((l) => (
                <span key={l} className="text-sm text-kaki bg-beige-light border border-beige-dark px-4 py-2 rounded-full">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 md:py-24 bg-ocre-pale border-t border-ocre/20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <p className="section-label">On en parle ?</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-terre mb-4">Construisons votre atelier</h2>
          <p className="text-terre/65 leading-relaxed mb-8">
            Un atelier ponctuel, un cycle récurrent ou une action RSE ? Présentez-nous votre besoin —
            nous vous proposons un format adapté à vos objectifs, votre public et votre territoire.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact/" className="btn-ocre">Demander un devis <IconArrow className="w-4 h-4" /></Link>
            <Link to="/contact/" className="btn-outline-ocre">Nous contacter</Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
