import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import NewsletterForm from '../components/NewsletterForm'
import PointCollecteForm from '../components/PointCollecteForm'
import {
  ACCEPTE,
  DEFI,
  ETAPES,
  PARTENARIAT_SITCOM,
  POINTS_CONFIRMES,
  POINTS_OUVERTS,
} from '../data/defiCollecte'

const BREADCRUMBS = [{ label: 'Défi collecte — 1/2 tonne' }]

// Défilement doux vers le formulaire. On ne bloque volontairement pas le
// comportement natif du lien : si scrollIntoView échoue, le saut d'ancre du
// navigateur amène malgré tout au bon endroit.
function versFormulaire() {
  document
    .getElementById('devenir-point-collecte')
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quand a lieu le défi collecte d\'une demi-tonne ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Du ${DEFI.debut} au ${DEFI.fin}. Les dépôts sont possibles pendant toute cette période dans les points de collecte partenaires, et la pesée finale a lieu le 3 octobre 2026 à Vielle-Saint-Girons.`,
      },
    },
    {
      '@type': 'Question',
      name: 'Quel matériel informatique puis-je déposer ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ordinateurs portables et fixes, écrans, claviers, souris, tablettes, smartphones, câbles, chargeurs, périphériques, imprimantes et petits équipements réseau. Le matériel en panne est accepté : il est valorisé pour ses composants.',
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
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Défi collecte — une demi-tonne de matériel informatique dans les Landes"
        description="Du 1er septembre au 3 octobre 2026, l'association Ressources relève le défi de collecter 500 kg de matériel informatique dormant sur le territoire landais. Points de collecte en entreprise et en commune, pesée finale le 3 octobre à Vielle-Saint-Girons."
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
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Du {DEFI.debut} au {DEFI.fin}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-4 leading-tight">
            Le défi de la demi-tonne
          </h1>
          <p className="text-white/65 max-w-xl leading-relaxed mb-8">
            Réunir {DEFI.objectifKg} kilos de matériel informatique dormant sur le
            territoire landais, en cinq semaines. Chaque ordinateur oublié dans un
            placard compte.
          </p>

          {/* Compteur */}
          <div className="inline-flex items-baseline gap-3 border-t-2 border-ocre pt-4">
            <span className="font-serif text-4xl md:text-5xl text-ocre leading-none">
              {DEFI.collecteKg !== null ? `${DEFI.collecteKg} kg` : 'À venir'}
            </span>
            <span className="font-sans text-sm text-white/45">
              {DEFI.collecteKg !== null
                ? `collectés sur ${DEFI.objectifKg} kg`
                : `premières pesées à partir du ${DEFI.debut}`}
            </span>
          </div>

          <div className="mt-8">
            <a href="#devenir-point-collecte" onClick={versFormulaire} className="btn-ocre text-sm">
              Devenir point de collecte
            </a>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Pourquoi */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl text-terre mb-4">Pourquoi ce défi ?</h2>
            <div className="space-y-4 max-w-2xl">
              <p className="text-sm text-terre/65 leading-relaxed">
                Dans les Landes comme ailleurs, une quantité considérable
                d'équipements informatiques dort au fond des tiroirs, des placards
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
          </div>

          {/* Comment ça marche */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl text-terre mb-6">Comment ça marche</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {ETAPES.map(({ num, titre, desc }) => (
                <div key={num} className="border-t-2 border-ocre/30 pt-4">
                  <span className="font-serif text-2xl text-ocre/30 block mb-2 leading-none">{num}</span>
                  <h3 className="font-serif text-lg text-terre mb-1.5">{titre}</h3>
                  <p className="text-sm text-terre/60 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ce que nous acceptons */}
          <div className="bg-beige-light border border-beige-dark p-6 md:p-8 mb-12">
            <h2 className="font-serif text-xl text-terre mb-4">Ce que vous pouvez déposer</h2>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 mb-5">
              {ACCEPTE.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-terre/65">
                  <span className="text-ocre mt-0.5 shrink-0">→</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-terre/50 leading-relaxed">
              Le matériel en panne est accepté : il est valorisé pour ses composants.
              Vos données sont effacées de façon sécurisée avant tout
              reconditionnement — vous pouvez aussi retirer le disque dur vous-même.{' '}
              <Link to="/recyclerie-informatique/effacement-donnees/" className="text-ocre hover:underline">
                En savoir plus sur la sécurité des données
              </Link>
            </p>
          </div>

          {/* Points de collecte */}
          <div className="mb-12">
            <div className="flex items-baseline gap-3 mb-2">
              <h2 className="font-serif text-2xl text-terre">Où déposer</h2>
              {/* Tant qu'aucun point n'est ouvert au depot libre, annoncer « 0 point
                  de collecte » a cote d'une liste de trois serait incomprehensible :
                  on compte alors les points en cours de validation. */}
              <span className="font-sans text-xs text-terre/45">
                {POINTS_OUVERTS.length > 0
                  ? `${POINTS_OUVERTS.length} point${POINTS_OUVERTS.length > 1 ? 's' : ''} de collecte`
                  : `${POINTS_CONFIRMES.length} point${POINTS_CONFIRMES.length > 1 ? 's' : ''} en cours de validation`}
              </span>
            </div>
            <p className="text-sm text-terre/60 leading-relaxed mb-6 max-w-2xl">
              Plusieurs entreprises et communes du territoire se sont portées
              volontaires pour accueillir un point de collecte. La liste est mise à
              jour au fur et à mesure des confirmations. Les points encore en cours
              de validation n'accueillent pas de dépôt libre :{' '}
              <Link to="/contact/" className="text-ocre hover:underline">
                merci de nous contacter
              </Link>{' '}
              afin de convenir des modalités de remise du matériel.
            </p>

            <ul className="space-y-3 mb-6">
              {POINTS_CONFIRMES.map(({ nom, ville, adresse, type, mention }) => (
                <li
                  key={`${nom}-${ville}`}
                  className="border-l-2 border-ocre bg-beige-light p-5"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-ocre">
                      {type}
                    </p>
                    {mention && (
                      <span className="font-sans text-[10px] font-medium text-kaki-light bg-kaki-pale border border-kaki/20 px-2 py-0.5 rounded-full">
                        {mention}
                      </span>
                    )}
                  </div>
                  <p className="font-serif text-lg text-terre leading-snug">{nom}</p>
                  <p className="text-sm text-terre/55 mt-0.5">
                    {adresse ? `${adresse} · ` : ''}
                    {ville}
                  </p>
                </li>
              ))}
            </ul>

            {/* Partenariat SITCOM40 — collecte en déchèterie */}
            <div className="border-l-2 border-kaki bg-kaki-pale/60 p-5 mb-6">
              <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-kaki mb-1">
                Partenariat · Déchèteries
              </p>
              <p className="font-serif text-lg text-terre leading-snug mb-1.5">
                {PARTENARIAT_SITCOM.nombre} déchèteries du département
              </p>
              <p className="text-sm text-terre/60 leading-relaxed">
                Un partenariat a été convenu avec le {PARTENARIAT_SITCOM.nom} pour
                installer un point de collecte dans {PARTENARIAT_SITCOM.nombre} déchèteries
                du département.{' '}
                {PARTENARIAT_SITCOM.decheteries.length > 0
                  ? `Déchèteries concernées : ${PARTENARIAT_SITCOM.decheteries.join(' et ')}.`
                  : 'Les communes concernées seront précisées prochainement.'}
              </p>
            </div>

            <p className="text-sm text-terre/50 italic">
              D'autres points de collecte ouvriront d'ici au 1er septembre.{' '}
              <a href="#devenir-point-collecte" onClick={versFormulaire} className="text-ocre not-italic hover:underline">
                Vous souhaitez en accueillir un ?
              </a>
            </p>
          </div>

          {/* Accueillir un point de collecte */}
          <div id="devenir-point-collecte" className="border border-beige-dark bg-beige-light p-6 md:p-8 mb-12 scroll-mt-24">
            <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-ocre mb-3">
              Entreprises, commerces & communes
            </p>
            <h2 className="font-serif text-2xl text-terre mb-3">
              Devenez point de collecte
            </h2>
            <p className="text-sm text-terre/65 leading-relaxed mb-7 max-w-2xl">
              Vous disposez d'un espace accessible dans vos locaux ? Nous fournissons
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
            <h2 className="font-serif text-xl text-terre mb-2">Suivre la progression</h2>
            <p className="text-sm text-terre/60 leading-relaxed mb-5 max-w-xl">
              Recevez les pesées, l'ouverture de nouveaux points de collecte et les
              informations sur la journée du 3 octobre.
            </p>
            <div className="max-w-md">
              <NewsletterForm />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/evenement-lancement-03-octobre-2026/" className="btn-ocre">
              La journée du 03 octobre
            </Link>
            <Link to="/recyclerie-informatique/materiel-accepte/" className="btn-outline-ocre">
              Matériel accepté en détail
            </Link>
          </div>

        </div>
      </section>
    </Layout>
  )
}
