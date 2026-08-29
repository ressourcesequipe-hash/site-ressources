import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import NewsletterForm from '../components/NewsletterForm'
import PointCollecteForm from '../components/PointCollecteForm'
import EncartTombola from '../components/EncartTombola'
import CartePoints from '../components/CartePoints'
import { EPINGLE_TRACE, lienCarte } from '../data/carte'
import {
  ACCEPTE,
  ACCEPTE_TEXTE,
  CONSIGNES,
  DEFI,
  ETAPES,
  KIT_COMMUNICATION,
  POINTS_CONFIRMES,
  POINTS_EN_COURS,
  POINTS_OUVERTS,
  horairesTexte,
} from '../data/defiCollecte'

const BREADCRUMBS = [{ label: 'Challenge collecte — 1/2 tonne' }]

// Épingle nue, sans libellé, à la fois dans la liste et sur la carte : les
// points de collecte se valent, et un numéro laisserait entendre un classement
// entre eux. Le tracé est celui des marqueurs de la carte, pour que la liste
// et la carte montrent exactement le même objet.
function Epingle({ className = '' }) {
  return (
    <svg viewBox="0 0 24 32" className={className} fill="currentColor" aria-hidden focusable="false">
      <path d={EPINGLE_TRACE} />
      {/* beige-light : la couleur du fond de la carte qui porte l'épingle,
          pour que l'œil soit un trou et non une pastille claire posée dessus. */}
      <circle cx="12" cy="11" r="3.8" fill="#F7F3ED" />
    </svg>
  )
}

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
      name: 'Quand a lieu le challenge collecte d\'une demi-tonne ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Du ${DEFI.debut} au ${DEFI.fin}. Les dépôts sont possibles pendant toute cette période dans les points de collecte partenaires, et la pesée finale a lieu le 3 octobre 2026 à Vielle-Saint-Girons.`,
      },
    },
    {
      '@type': 'Question',
      name: 'Où déposer mon matériel informatique et électronique pendant le challenge ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Dans l'un des points de collecte du territoire — mairies et structures partenaires — à leurs heures d'ouverture : ${POINTS_OUVERTS.map(
          ({ nom, adresse, ville, horaires }) =>
            `${nom} (${adresse}, ${ville}) — ${horairesTexte(horaires)}`,
        ).join(' ; ')}.`,
      },
    },
    {
      '@type': 'Question',
      name: 'Quel matériel informatique et électronique puis-je déposer ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${ACCEPTE_TEXTE}. Le matériel n'a pas besoin d'être fonctionnel : l'association assure le tri et le diagnostic afin d'identifier ce qui peut être réemployé, reconditionné ou orienté vers la filière adaptée.`,
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
  // Point de collecte à mettre en avant sur la carte, choisi depuis la liste.
  // Le jeton rend l'objet distinct à chaque clic, y compris sur la même ligne.
  const [pointActif, setPointActif] = useState(null)

  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Challenge collecte — 500 kg de matériel informatique et électronique · Landes"
        description="Du 1er septembre au 3 octobre 2026, l'association Ressources relève le challenge de collecter 500 kg de matériel informatique et électronique dormant sur le territoire landais. Points de collecte en mairie et chez les structures partenaires, pesée finale le 3 octobre à Vielle-Saint-Girons."
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
              Du {DEFI.debut} au {DEFI.fin}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-0 lg:mb-4 leading-tight">
              Le challenge de la demi-tonne
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
            Réunir {DEFI.objectifKg} kilos de matériel informatique et électronique
            dormant sur le territoire landais, en cinq semaines. Chaque ordinateur
            oublié dans un placard compte.
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-10">

          <div className="lg:col-start-1 lg:row-start-1">

          {/* Pourquoi */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl text-terre mb-4">Pourquoi ce challenge ?</h2>
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

          </div>

          {/* Colonne latérale — promotion de la tombola */}
          {/* top-32 : l'en-tête collant fait 112 px, en dessous l'encart passait
              dessous. row-span-2 : sans lui l'encart cesserait de suivre au bas
              de la première rangée. */}
          <div className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-32 lg:self-start mb-12 lg:mb-0">
            <EncartTombola />
          </div>

          <div className="lg:col-start-1 lg:row-start-2">

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
              Les communes et les structures partenaires du territoire se sont
              portées volontaires pour accueillir un point de collecte. Vous pouvez
              y déposer votre matériel librement, aux horaires indiqués ci-dessous.
              La liste est mise à jour au fur et à mesure des confirmations.
            </p>

            {/* Même agencement que les points de vente de la tombola : un bloc
                encadré, la liste à gauche et la carte à droite. Les épingles ne
                portant volontairement aucun numéro, c'est le clic sur une ligne
                — et la bulle qu'il ouvre — qui relie la liste à la carte. */}
            <div className="border border-beige-dark bg-white p-6 mb-6">
              <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-ocre mb-3">
                Dépôt libre · {POINTS_OUVERTS.length} points de collecte
              </p>
              <h3 className="font-serif text-xl text-terre mb-5">
                En mairie et chez nos partenaires
              </h3>

              <div className="grid lg:grid-cols-[1fr_1.05fr] gap-6 lg:gap-8">
                <ul className="space-y-4">
                  {POINTS_OUVERTS.map((point, i) => {
                    const { nom, ville, adresse, type, horaires, note } = point
                    return (
                      <li key={`${nom}-${ville}`} className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => setPointActif({ index: i, jeton: Date.now() })}
                          aria-label={`Situer ${nom} sur la carte`}
                          className="group flex items-start gap-3 flex-1 min-w-0 text-left"
                        >
                          <Epingle className="shrink-0 w-4 h-auto mt-0.5 text-ocre transition-colors group-hover:text-ocre-dark" />
                          <span className="min-w-0 flex-1">
                            <span className="block font-sans text-[10px] font-bold tracking-widest uppercase text-ocre/70">
                              {type}
                            </span>
                            <span className="block font-sans text-sm text-terre leading-snug transition-colors group-hover:text-ocre-dark">
                              {nom}
                            </span>
                            <span className="block text-xs text-terre/50 mt-0.5">
                              {adresse ? `${adresse} · ` : ''}
                              {ville}
                            </span>
                            {/* Horaires empilés sous l'adresse plutôt qu'en deux
                                colonnes : à moitié de largeur, une grille
                                jours/créneaux repliait tous les créneaux. */}
                            <span className="block mt-1.5 pt-1.5 border-t border-beige-dark">
                              {horaires.map(({ jours, creneaux }) => (
                                <span
                                  key={jours}
                                  className="block font-sans text-xs text-terre/50 leading-relaxed"
                                >
                                  <span className="font-medium text-terre/70">{jours}</span>{' '}
                                  {creneaux.join(' et ')}
                                </span>
                              ))}
                              {note && (
                                <span className="block text-xs text-terre/40 leading-relaxed mt-1">
                                  {note}
                                </span>
                              )}
                            </span>
                          </span>
                        </button>
                        <a
                          href={lienCarte(point)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-xs text-ocre hover:underline font-sans whitespace-nowrap mt-0.5"
                        >
                          Y aller ↗
                        </a>
                      </li>
                    )
                  })}
                </ul>

                {/* Collante, contrairement à la tombola : neuf points portant
                    leurs horaires font une liste bien plus haute que la carte,
                    qui sortirait du champ dès le troisième point. */}
                <div className="lg:sticky lg:top-32 lg:self-start">
                  <CartePoints
                    points={POINTS_OUVERTS}
                    pointActif={pointActif}
                    libelle="points de collecte"
                    aspect="goutte"
                  />
                </div>
              </div>
            </div>

            {/* Points annoncés mais pas encore formalisés : ni adresse, ni
                horaires, ni épingle — le dépôt s'y convient au cas par cas. */}
            {POINTS_EN_COURS.length > 0 && (
              <div className="border border-beige-dark bg-white p-5 mb-6">
                <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-terre/45 mb-3">
                  Points en cours de formalisation
                </p>
                <ul className="space-y-2 mb-4">
                  {POINTS_EN_COURS.map(({ nom, ville, mention }) => (
                    <li
                      key={`${nom}-${ville}`}
                      className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm"
                    >
                      <span className="font-sans text-terre">{nom}</span>
                      <span className="text-terre/50">· {ville}</span>
                      <span className="font-sans text-[10px] font-medium text-kaki-light bg-kaki-pale border border-kaki/20 px-2 py-0.5 rounded-full">
                        {mention}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-terre/50 leading-relaxed">
                  Ces points n'accueillent pas encore de dépôt libre :{' '}
                  <Link to="/contact/" className="text-ocre hover:underline">
                    merci de nous contacter
                  </Link>{' '}
                  afin de convenir des modalités de remise du matériel.
                </p>
              </div>
            )}

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

            {/* Kit de communication : à l'usage des communes, des entreprises et
                des partenaires qui relaient le challenge — ils n'ont ainsi rien à
                réécrire, et les textes diffusés restent alignés sur la page. */}
            <p className="text-xs text-terre/45 mt-3">
              Vous relayez le challenge ?{' '}
              <a
                href={KIT_COMMUNICATION}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ocre hover:underline"
              >
                Télécharger le kit de communication ↗
              </a>
              {' '}— affiches, visuels pour les réseaux sociaux et textes prêts à publier.
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

        </div>
      </section>
    </Layout>
  )
}
