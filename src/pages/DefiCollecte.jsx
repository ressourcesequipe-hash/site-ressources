import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import NewsletterForm from '../components/NewsletterForm'
import PointCollecteForm from '../components/PointCollecteForm'
import {
  ACCEPTE,
  ACCEPTE_TEXTE,
  CONSIGNES,
  DEFI,
  ETAPES,
  POINTS_OUVERTS,
} from '../data/defiCollecte'

const BREADCRUMBS = [{ label: 'Challenge collecte — bilan' }]

// Défilement doux vers une ancre de la page. On ne bloque volontairement pas
// le comportement natif du lien : si scrollIntoView échoue, le saut d'ancre du
// navigateur amène malgré tout au bon endroit.
function versAncre(id) {
  return () =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quel est le résultat du challenge collecte d\'une demi-tonne ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${DEFI.collecteKg} kg de matériel informatique et électronique ont été collectés du ${DEFI.debut} au ${DEFI.fin}, soit ${DEFI.multiple} fois l'objectif de ${DEFI.objectifKg} kg. Le résultat a été annoncé le 3 octobre 2026 à Vielle-Saint-Girons.`,
      },
    },
    {
      '@type': 'Question',
      name: 'Que devient le matériel collecté pendant le challenge ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Il est trié, ses données sont effacées de façon sécurisée, puis il est diagnostiqué et reconditionné par les bénévoles de l\'association. Il repart ensuite vers des habitants, des associations et des structures d\'accompagnement du territoire.',
      },
    },
    {
      '@type': 'Question',
      name: 'Peut-on encore donner du matériel informatique et électronique ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Oui, l'association continue de collecter, sur demande ou lors d'un enlèvement. Le matériel accepté : ${ACCEPTE_TEXTE}. Il n'a pas besoin d'être fonctionnel : l'association assure le tri et le diagnostic afin d'identifier ce qui peut être réemployé, reconditionné ou orienté vers la filière adaptée.`,
      },
    },
    {
      '@type': 'Question',
      name: 'Mes données personnelles sont-elles effacées ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui. Chaque support de stockage fait l\'objet d\'un effacement sécurisé avant tout reconditionnement, avec traçabilité. Vous pouvez aussi retirer vous-même le disque dur avant le dépôt.',
      },
    },
    {
      '@type': 'Question',
      name: 'Mon entreprise ou ma commune peut-elle accueillir un point de collecte ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui. L\'association fournit le contenant et assure la collecte du matériel. Il suffit de disposer d\'un espace accessible. Contactez l\'association au 06 62 66 04 84.',
      },
    },
  ],
}

export default function DefiCollecte() {
  return (
    <Layout breadcrumbs={BREADCRUMBS} newsletter={false}>
      <SEO
        title="Bilan du challenge collecte — plus de 2 tonnes de matériel informatique collectées · Landes"
        description={`Du 1er septembre au 3 octobre 2026, le territoire landais a collecté ${DEFI.collecteKg} kg de matériel informatique et électronique, soit ${DEFI.multiple} fois l'objectif d'une demi-tonne du challenge de l'association Ressources. Merci aux communes, structures partenaires et habitants.`}
        canonical="/defi-collecte/"
        schema={faqSchema}
      />

      {/* Hero */}
      <section className="bg-kaki text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-ocre" />
        <div
          className="absolute right-0 top-0 w-80 h-80 pointer-events-none"
          style={{ background: 'radial-gradient(circle at top right, rgba(200,151,58,0.12), transparent 68%)' }}
          aria-hidden
        />
        {/* Conteneur elargi par rapport a l'origine pour loger l'affiche a
            cote du texte.

            Le hero est coupe en trois : l'entete (surtitre + titre), l'affiche,
            puis le corps (texte, compteur, bouton). C'est ce decoupage qui
            permet a l'affiche de s'intercaler sous le titre sur mobile — ordre
            du DOM — tout en occupant la colonne de droite sur grand ecran, ou
            elle est placee explicitement a cheval sur les deux rangees.

            Les gouttieres sont dissociees : verticales sur mobile pour aerer
            les trois blocs, nulles sur grand ecran ou les marges des titres
            font deja le travail. */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid gap-y-8 lg:grid-cols-[1.15fr_1fr] lg:gap-x-14 lg:gap-y-0 lg:items-center">

          {/* Entete */}
          <div className="lg:col-start-1 lg:row-start-1">
            <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              Challenge terminé · du {DEFI.debut} au {DEFI.fin}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-0 lg:mb-4 leading-tight">
              Le challenge de la demi-tonne : objectif dépassé
            </h1>
          </div>

          {/* Affiche — deuxieme sur mobile, colonne de droite sur grand ecran.
              Pas de lazy-loading ni de priorite basse : elle est en haut de
              page et candidate au LCP. */}
          <img
            src="/photos/challenge-vignette.webp"
            width={1280}
            height={720}
            fetchpriority="high"
            decoding="async"
            alt="Affiche du challenge territorial organisé par l'association Ressources : objectif une demi-tonne de matériel électronique et informatique."
            className="w-full h-auto block rounded-xl border-4 border-beige-light shadow-2xl shadow-black/30 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center"
          />

          {/* Corps */}
          <div className="lg:col-start-1 lg:row-start-2">
          <p className="text-white/65 max-w-xl leading-relaxed mb-8">
            Il fallait réunir {DEFI.objectifKg} kilos de matériel informatique et
            électronique dormant sur le territoire landais. Habitants, entreprises
            et collectivités en ont apporté {DEFI.multiple} fois plus. Merci à toutes
            et à tous.
          </p>

          {/* Résultat */}
          <div className="inline-flex items-baseline gap-3 border-t-2 border-ocre pt-4">
            <span className="font-serif text-4xl md:text-5xl text-ocre leading-none">
              {DEFI.collecteKg} kg
            </span>
            <span className="font-sans text-sm text-white/55">
              collectés pour un objectif de {DEFI.objectifKg} kg
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#merci" onClick={versAncre('merci')} className="btn-ocre text-sm">
              Ils ont rendu ce résultat possible
            </a>
            <a
              href="#devenir-point-collecte"
              onClick={versAncre('devenir-point-collecte')}
              className="btn-outline-white text-sm"
            >
              Devenir point de collecte
            </a>
          </div>
          </div>

          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        {/* Conteneur élargi par rapport aux autres pages du site, pour loger la
            colonne latérale sans trop resserrer le texte. Placement explicite
            des trois blocs : sans lui, l'encart ne pourrait pas s'étendre sur
            les deux rangées, et son défilement collant s'arrêterait au bas de
            la première. En dessous de lg, tout retombe dans l'ordre du DOM et
            l'encart s'intercale au milieu du fil. */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          <div>

          {/* Points de collecte — en tête de section : « où déposer ? » est la
              première question de qui arrive ici, et elle arrivait après quatre
              écrans de défilement sur mobile. L'ancre permet d'y renvoyer
              directement depuis le hero, le menu et la page d'accueil. */}
          <div id="merci" className="mb-12 scroll-mt-28 md:scroll-mt-32">
            <h2 className="font-serif text-2xl text-terre mb-2">Merci aux points de collecte</h2>
            <p className="text-sm text-terre/60 leading-relaxed mb-6 max-w-2xl">
              Les communes et les structures partenaires du territoire se sont
              portées volontaires pour accueillir un point de collecte. C'est grâce
              à elles, et à tous ceux qui y ont déposé leur matériel, que nous
              avons collecté {DEFI.collecteKg} kg.
            </p>

            {/* Liste de noms, sans horaires ni carte : les dépôts du challenge
                sont clos. Ordre de la donnée, sans numérotation. */}
            <div className="border border-beige-dark bg-white p-6">
              <h3 className="font-sans text-base font-bold tracking-[0.15em] uppercase text-ocre mb-5">
                {POINTS_OUVERTS.length} points de collecte
              </h3>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {POINTS_OUVERTS.map(({ nom, ville }) => (
                  <li key={`${nom}-${ville}`}>
                    <span className="block font-sans text-sm text-terre leading-snug">{nom}</span>
                    <span className="block text-xs text-terre/50 mt-0.5">{ville}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pourquoi */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl text-terre mb-4">Pourquoi ce challenge ?</h2>
            <div className="grid sm:grid-cols-[1fr_auto] gap-8 items-start">
              <div className="space-y-4 max-w-2xl">
                <p className="text-sm text-terre/65 leading-relaxed">
                  Dans les Landes comme ailleurs, une quantité considérable
                  d'équipements informatiques et électroniques dort au fond des tiroirs, des placards
                  et des réserves d'entreprises. Pendant ce temps, des familles, des
                  personnes âgées et des associations du territoire manquent de
                  matériel numérique en état de marche.
                </p>
                <p className="text-sm text-terre/65 leading-relaxed">
                  L'impact environnemental du numérique est bien réel, et la
                  raréfaction des composants se fait sentir de plus en plus nettement.
                  Prolonger la vie d'un équipement plutôt que d'en produire un neuf
                  est un levier concret, à la portée de chacun.
                </p>
              </div>
              {/* Preuve que la collecte a deja lieu sur le terrain. Volontairement
                  sans nom de commune : les points de collecte se valent tous,
                  et cette photo n'en illustre qu'un parmi d'autres. */}
              <img
                src="/photos/collecte-en-mairie.jpg"
                loading="lazy"
                decoding="async"
                alt="Matériel informatique et électronique déposé sur l'un des points de collecte du territoire"
                className="hidden sm:block w-40 h-auto rounded-lg border-4 border-beige-light shadow-md shrink-0"
              />
            </div>
          </div>

          {/* Comment ça marche */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl text-terre mb-6">Comment ça s'est passé</h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {ETAPES.map(({ num, titre, desc }) => (
                <div key={num} className="border-t-2 border-ocre/30 pt-4">
                  <span className="font-serif text-2xl text-ocre/30 block mb-2 leading-none">{num}</span>
                  <h3 className="font-serif text-lg text-terre mb-1.5">{titre}</h3>
                  <p className="text-sm text-terre/60 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <img
              src="/photos/ressource-remise-de-don.jpg"
              loading="lazy"
              decoding="async"
              alt="Remise d'un écran d'ordinateur lors d'un dépôt de matériel"
              className="w-full h-48 sm:h-56 object-cover rounded-xl"
            />
          </div>

          </div>

          <div>

          {/* Ce que nous acceptons */}
          <div className="bg-beige-light border border-beige-dark p-6 md:p-8 mb-12">
            <div className="sm:flex sm:gap-6 sm:items-start mb-5">
              <img
                src="/photos/ressource-remise-de-don-tablette.jpg"
                loading="lazy"
                decoding="async"
                alt="Ordinateur portable, tablette et disque dur externe prêts à être déposés"
                className="w-full sm:w-36 h-auto rounded-lg border-4 border-white shadow-md mb-5 sm:mb-0 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-xl text-terre mb-2">Le matériel que nous collectons</h2>
                <p className="text-sm text-terre/60 leading-relaxed mb-4">
                  Le challenge est terminé, mais l'association continue de collecter.{' '}
                  <Link to="/recyclerie-informatique/comment-donner/" className="text-ocre hover:underline">
                    Comment donner
                  </Link>
                </p>
                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                  {ACCEPTE.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-terre/65">
                      <span className="text-ocre mt-0.5 shrink-0">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Consignes de l'affiche du kit de communication : c'est cette page
                que son QR code ouvre, les deux doivent dire la même chose. */}
            <div className="border-t border-beige-dark pt-5">
              <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-ocre mb-3">
                Consignes importantes
              </p>
              <dl className="space-y-3">
                {CONSIGNES.map(({ titre, texte }) => (
                  <div key={titre}>
                    <dt className="font-sans text-xs font-semibold text-terre/75">{titre}</dt>
                    <dd className="text-xs text-terre/55 leading-relaxed mt-0.5">{texte}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-xs text-terre/50 leading-relaxed mt-4">
                Vous pouvez aussi retirer le disque dur vous-même avant le dépôt.{' '}
                <Link to="/recyclerie-informatique/effacement-donnees/" className="text-ocre hover:underline">
                  En savoir plus sur la sécurité des données
                </Link>
              </p>
            </div>
          </div>

          {/* Accueillir un point de collecte */}
          <div id="devenir-point-collecte" className="border border-beige-dark bg-beige-light p-6 md:p-8 mb-12 scroll-mt-28 md:scroll-mt-32">
            <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-ocre mb-3">
              Pour la suite
            </p>
            <h2 className="font-serif text-2xl text-terre mb-3">
              Devenez point de collecte
            </h2>
            <p className="text-sm text-terre/65 leading-relaxed mb-7 max-w-2xl">
              Le challenge a montré ce que le territoire peut faire. Vous disposez d'un espace accessible dans vos locaux ? Nous fournissons
              le contenant et la signalétique, et nous assurons la collecte du
              matériel. C'est un geste concret pour le territoire, et l'occasion
              d'associer vos équipes et vos clients à une démarche solidaire.
            </p>

            <PointCollecteForm />

            <p className="text-xs text-terre/45 mt-6 pt-5 border-t border-beige-dark">
              Vous préférez en parler de vive voix ?{' '}
              <a href="tel:+33662660484" className="text-ocre hover:underline">06 62 66 04 84</a>
              {' '}·{' '}
              <a href="mailto:contact@ressourcesrecyclerie.fr" className="text-ocre hover:underline">
                contact@ressourcesrecyclerie.fr
              </a>
            </p>

          </div>

          {/* Newsletter */}
          <div className="border-y border-beige-dark py-8 mb-12">
            <h2 className="font-serif text-xl text-terre mb-2">Suivre l'association</h2>
            <p className="text-sm text-terre/60 leading-relaxed mb-5 max-w-xl">
              Recevez les nouvelles de la recyclerie, les prochaines collectes et nos
              rendez-vous.
            </p>
            <div className="max-w-md">
              <NewsletterForm />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/evenement-lancement-03-octobre-2026/" className="btn-ocre">
              Retour sur la journée du 03 octobre
            </Link>
            <Link to="/recyclerie-informatique/materiel-accepte/" className="btn-outline-ocre">
              Matériel accepté en détail
            </Link>
          </div>

          </div>

        </div>
      </section>
    </Layout>
  )
}
