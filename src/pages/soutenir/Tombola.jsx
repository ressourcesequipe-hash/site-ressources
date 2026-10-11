import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import TousLesLotsModal from '../../components/TousLesLotsModal'
import PartenairesTombola from '../../components/PartenairesTombola'
import {
  LIBELLE_EN_COURS,
  LOTS_PODIUM,
  LOTS_SECONDAIRES,
  LOT_PRINCIPAL,
  NOMBRE_LOTS_ARRONDI,
  PRIX_BILLET,
  RESUME_CATEGORIES,
  VALEUR_ARRONDIE,
  formatEuros,
  formatValeurLot,
} from '../../data/lotsTombola'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'La tombola solidaire est-elle encore ouverte ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Non. La vente des billets est close et le tirage au sort a eu lieu en public le 03 octobre 2026 à Vielle-Saint-Girons. Les gagnants ont été contactés directement par l'association.",
      },
    },
    {
      '@type': 'Question',
      name: 'La tombola solidaire était-elle déclarée en préfecture ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui. Conformément à la réglementation française, cette tombola était organisée par une association loi 1901 à but non lucratif et respectait les obligations légales applicables.',
      },
    },
    {
      '@type': 'Question',
      name: 'À quoi serviront les fonds récoltés ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Ils financent les premiers équipements de la recyclerie, les collectes, les ateliers de sensibilisation et la redistribution solidaire de matériel reconditionné. L'intégralité des fonds soutient la recyclerie solidaire.",
      },
    },
  ],
}

// Le REEL de la tombola, déclaré pour les résultats enrichis vidéo. La vignette
// est l'affiche du lecteur, extraite de la première image du film.
const videoSchema = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'Tombola solidaire Ressources : le tirage du 03 octobre 2026',
  description: `Présentation en 40 secondes de la tombola solidaire de l'association Ressources : plus de ${VALEUR_ARRONDIE.toLocaleString('fr-FR')} € de lots offerts par les commerçants et producteurs landais, billet à ${PRIX_BILLET} €, tirage le 03 octobre 2026 à Vielle-Saint-Girons.`,
  thumbnailUrl: 'https://www.ressourcesrecyclerie.fr/photos/reel-tombola-poster.jpg',
  contentUrl: 'https://www.ressourcesrecyclerie.fr/photos/Reel-Tombola-Ressources.mp4',
  uploadDate: '2026-09-07',
  duration: 'PT42S',
}

const BREADCRUMBS = [
  { label: 'Soutenir', href: '/soutenir/' },
  { label: 'Tombola solidaire' },
]

export default function Tombola() {
  const [lotsOpen, setLotsOpen] = useState(false)
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <TousLesLotsModal isOpen={lotsOpen} onClose={() => setLotsOpen(false)} />
      <SEO
        title={`Tombola solidaire Landes 2026 — tirage effectué, merci · Association Ressources`}
        description={`La tombola solidaire de l'association Ressources s'est tenue le 03 octobre 2026 à Vielle-Saint-Girons : plus de ${VALEUR_ARRONDIE.toLocaleString('fr-FR')} € de lots offerts par les commerçants, artisans et producteurs du territoire landais. Merci aux participants et aux partenaires.`}
        canonical="/soutenir/tombola/"
        schema={[faqSchema, videoSchema]}
        ogImage="https://www.ressourcesrecyclerie.fr/og-tombola.jpg"
        ogImageWidth={1280}
        ogImageHeight={720}
        ogImageAlt={`Tombola solidaire de l'association Ressources — plus de ${VALEUR_ARRONDIE.toLocaleString('fr-FR')} € de lots, tirage le 03 octobre 2026`}
      />

      {/* Hero */}
      <section className="bg-kaki text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-ocre" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Soutenir
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4">
            Tombola solidaire — le tirage a eu lieu
          </h1>
          <p className="text-white/65 max-w-xl leading-relaxed mb-7">
            La tombola s'est tenue le 03 octobre 2026 à Vielle-Saint-Girons, lors
            de la journée de lancement de la recyclerie informatique et végétale
            Ressources. Merci aux participants, qui ont soutenu ce lancement, et
            aux commerçants, artisans et producteurs qui ont offert les lots.
          </p>

          <p className="font-sans text-sm text-white/70 mb-7">
            <span className="text-white font-semibold">Plus de {VALEUR_ARRONDIE.toLocaleString('fr-FR')} €</span> de lots,
            répartis sur <span className="text-white font-semibold">plus de {NOMBRE_LOTS_ARRONDI} lots</span>
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <button onClick={() => setLotsOpen(true)} className="btn-ocre w-full sm:w-auto">
              Revoir tous les lots
            </button>
            <Link to="/evenement-lancement-03-octobre-2026/" className="btn-outline-white w-full sm:w-auto text-center">
              Retour sur la journée du 03 octobre
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Mise en avant lots */}
          {/* scroll-mt : l'en-tête collant fait 96 px sur mobile et 112 px
              au-dessus, il faut le dégager pour que le titre ne soit pas
              masqué à l'arrivée sur l'ancre. */}
          <div id="lots" className="text-center bg-ocre-pale border border-ocre/20 p-10 mb-12 scroll-mt-28 md:scroll-mt-32">
            {/* Deux colonnes : le REEL à gauche, tout le discours de l'encart à
                droite, du montant jusqu'au bouton d'achat. Les deux colonnes
                font sensiblement la même hauteur, donc rien ne dépasse et le
                bouton reste à côté de la vidéo. En dessous de md, la colonne de
                droite se replie sous la vidéo.

                Vidéo verticale 9:16 auto-hébergée : pas de lecteur tiers, donc
                aucun cookie ni traceur à déclarer. Avec preload="none" et une
                affiche de 43 Ko, la page ne télécharge rien du fichier de 9,3 Mo
                tant que personne ne clique. Le master non compressé est gardé
                hors dépôt, dans design/videos-sources/. */}
            <div className="md:flex md:items-center md:justify-center md:gap-8 lg:gap-12">
              {/* La vidéo se resserre entre md et lg : à 768 px la colonne de
                  droite n'a plus que 355 px et « Plus de 4 500 € » y passait
                  sur deux lignes. */}
              <div className="w-full max-w-[230px] md:max-w-[190px] lg:max-w-[230px] mx-auto md:mx-0 shrink-0 mb-8 md:mb-0">
                <video
                  controls
                  playsInline
                  preload="none"
                  poster="/photos/reel-tombola-poster.jpg"
                  aria-label="Vidéo de présentation de la tombola solidaire Ressources"
                  className="w-full aspect-[9/16] bg-black object-cover shadow-lg shadow-terre/20"
                >
                  <source src="/photos/Reel-Tombola-Ressources.mp4" type="video/mp4" />
                  <a href="/photos/Reel-Tombola-Ressources.mp4" className="underline">
                    Télécharger la vidéo de présentation
                  </a>
                </video>
                <p className="font-sans text-xs text-terre/50 mt-3">
                  La tombola en 40 secondes
                </p>
              </div>

              <div className="md:flex-1 md:max-w-lg">
                <p className="font-sans text-xs text-ocre font-semibold tracking-widest uppercase mb-3">
                  Les lots
                </p>
                {/* Plus de text-7xl ici : la colonne fait au mieux 490 px, le
                    montant y tiendrait mal en 72 px. */}
                <p className="font-serif text-5xl lg:text-6xl text-ocre leading-none mb-3">
                  Plus de {VALEUR_ARRONDIE.toLocaleString('fr-FR')} €
                </p>
                <p className="font-sans text-lg md:text-xl text-terre/60 mb-2">
                  de lots, répartis sur plus de {NOMBRE_LOTS_ARRONDI} lots
                  offerts par nos partenaires locaux
                </p>
                <p className="text-sm text-terre/50 max-w-md mx-auto">
                  Tous les lots ont été mis en jeu le 03 octobre. Merci à leurs donateurs.
                </p>
              </div>
            </div>
          </div>

          {/* Lot n°1 — le gros lot */}
          <div className="relative bg-kaki text-white p-8 md:p-10 mb-12 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-ocre to-transparent" aria-hidden />
            <div
              className="absolute right-0 top-0 w-64 h-64 pointer-events-none"
              style={{ background: 'radial-gradient(circle at top right, rgba(200,151,58,0.14), transparent 68%)' }}
              aria-hidden
            />
            <div className="relative">
              <div className="flex items-baseline gap-3 mb-5">
                <span className="font-sans text-[10px] font-bold tracking-[0.22em] uppercase text-ocre">
                  Lot n° {LOT_PRINCIPAL.numero}
                </span>
                <span className="flex-1 h-px bg-white/15" />
                <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-white/40">
                  {LOT_PRINCIPAL.titre}
                </span>
              </div>

              <div
                className={`border-t-2 border-ocre/50 pt-5 ${
                  LOT_PRINCIPAL.photo && LOT_PRINCIPAL.statut !== 'en-cours'
                    ? 'max-w-4xl'
                    : 'max-w-2xl'
                }`}
              >
                {LOT_PRINCIPAL.statut === 'en-cours' ? (
                  <>
                    <h3 className="font-serif text-2xl md:text-3xl text-white/90 leading-snug mb-2">
                      {LIBELLE_EN_COURS}
                    </h3>
                    <p className="text-sm text-white/50 font-sans leading-relaxed">
                      Notre plus beau lot sera dévoilé ici d'ici au 03 octobre.
                    </p>
                  </>
                ) : (
                  <div
                    className={
                      LOT_PRINCIPAL.photo
                        ? 'grid md:grid-cols-[1fr_auto] gap-6 md:gap-8 items-center'
                        : ''
                    }
                  >
                    <div>
                      <h3 className="font-serif text-2xl md:text-3xl text-white leading-snug mb-2">
                        {LOT_PRINCIPAL.lot}
                      </h3>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        {LOT_PRINCIPAL.valeur && (
                          <span className="font-serif text-2xl text-ocre leading-none">
                            {formatEuros(LOT_PRINCIPAL.valeur)}
                          </span>
                        )}
                        <p className="text-xs text-white/45 font-sans tracking-wide">
                          {LOT_PRINCIPAL.detail}
                        </p>
                      </div>
                    </div>

                    {LOT_PRINCIPAL.photo && (
                      <img
                        src={LOT_PRINCIPAL.photo}
                        alt={LOT_PRINCIPAL.photoAlt}
                        loading="lazy"
                        className="w-full md:w-72 lg:w-80 h-48 md:h-44 lg:h-48 object-cover border border-white/15 shadow-lg shadow-black/20"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Podium — lots à 200 € et plus */}
          <div className="grid sm:grid-cols-2 gap-5 mb-12">
            {LOTS_PODIUM.map(({ lot, partenaire, valeur, valeurMax, detail, statut }, i) => {
              const enCours = statut === 'en-cours'
              return (
                <div
                  key={`${lot}-${partenaire}-${i}`}
                  className={`group border p-6 transition-all duration-300 ${
                    enCours
                      ? 'border-dashed border-kaki/25 bg-kaki-pale/50'
                      : 'border-beige-dark border-t-2 border-t-ocre bg-beige-light hover:shadow-lg hover:-translate-y-1'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <span
                      className={`font-sans text-[10px] font-bold tracking-[0.2em] uppercase ${
                        enCours ? 'text-terre/35' : 'text-ocre'
                      }`}
                    >
                      Lot n° {i + 2}
                    </span>
                    {!enCours && (
                      // Une fourchette tient deux fois plus de large qu'un
                      // montant sec : d'un cran plus petite, elle reste sur une
                      // ligne à côté du numéro de lot au lieu de se replier.
                      <span
                        className={`font-serif text-ocre leading-none whitespace-nowrap ${
                          valeurMax ? 'text-lg' : 'text-2xl'
                        }`}
                      >
                        {formatValeurLot({ valeur, valeurMax })}
                      </span>
                    )}
                  </div>

                  {enCours ? (
                    <>
                      <h3 className="font-serif text-xl text-terre/55 leading-snug mb-1.5">
                        {LIBELLE_EN_COURS}
                      </h3>
                      <p className="text-xs text-terre/40">Dévoilement prochain</p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-serif text-xl text-terre leading-snug mb-1.5">{lot}</h3>
                      <p className="text-xs text-terre/50">
                        {partenaire ? partenaire : 'Partenaire à confirmer'}
                        {detail ? ` · ${detail}` : ''}
                      </p>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* Accès à la liste complète — le détail
              de tous les lots est désormais public. */}
          <div className="text-center mb-12">
            <button onClick={() => setLotsOpen(true)} className="btn-outline-ocre">
              Voir la liste complète des lots
            </button>
          </div>

          {/* Résumé des autres lots */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl text-terre mb-2">
              Et {LOTS_SECONDAIRES.length} autres lots
            </h2>
            <p className="text-sm text-terre/60 leading-relaxed mb-7 max-w-2xl">
              Offerts par les commerçants, artisans, restaurateurs et producteurs
              du territoire.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {RESUME_CATEGORIES.map(({ id, label, nombre }) => (
                <div key={id} className="border-t-2 border-ocre/30 bg-beige-light px-5 py-4">
                  <p className="font-serif text-2xl text-ocre leading-none mb-1.5">{nombre}</p>
                  <p className="font-sans text-sm text-terre/70 leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Partenaires */}
          <PartenairesTombola />

          {/* Dotation close : la liste ci-dessus est definitive. */}
          <div className="text-center border-y border-beige-dark py-8 mb-12">
            <p className="font-serif text-2xl md:text-3xl text-ocre mb-2">
              Une dotation complète, grâce au territoire
            </p>
            <p className="text-sm text-terre/55 max-w-md mx-auto leading-relaxed">
              Tous ces lots ont été offerts par les commerçants, artisans et
              producteurs landais mobilisés autour de la recyclerie.
            </p>
          </div>

          {/* Pourquoi une tombola */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl text-terre mb-6">Pourquoi une tombola solidaire ?</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  ),
                  title: 'Un don qui rapporte',
                  desc: 'Chaque billet est un soutien direct à la recyclerie, avec la chance de repartir avec un lot offert par nos partenaires locaux.',
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                    </svg>
                  ),
                  title: 'Un impact local concret',
                  desc: 'Les fonds récoltés financent l\'équipement de l\'atelier, les collectes et la redistribution solidaire sur le territoire landais.',
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                    </svg>
                  ),
                  title: 'Un moment festif',
                  desc: 'Le tirage au sort a lieu en public le 03 octobre à Vielle-Saint-Girons, lors de la journée de lancement de l\'association.',
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="border-t-2 border-ocre/30 pt-5">
                  <div className="text-ocre mb-3">{icon}</div>
                  <h3 className="font-serif text-lg text-terre mb-2">{title}</h3>
                  <p className="text-sm text-terre/55 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* À quoi servent les fonds */}
          <div className="bg-beige-light border border-beige-dark p-6 md:p-8 mb-12">
            <h2 className="font-serif text-xl text-terre mb-2">À quoi servent les fonds récoltés ?</h2>
            <p className="text-sm text-terre/60 leading-relaxed mb-6 max-w-2xl">
              La priorité de cette collecte est de créer le premier emploi de la
              recyclerie : c'est ce qui permettra une présence régulière et durable
              sur le territoire, pour la collecte, le reconditionnement et la
              redistribution.
            </p>
            <div className="space-y-3">
              {[
                { pct: '50%', label: 'Emploi — première embauche et pérennisation de l\'activité', lead: true },
                { pct: '20%', label: 'Équipement de diagnostic, sécurisation des données et reconditionnement' },
                { pct: '15%', label: 'Collecte, stockage, manutention et logistique' },
                { pct: '10%', label: 'Redistribution solidaire et ateliers de sensibilisation' },
                { pct: '5%', label: 'Communication et organisation de l\'événement' },
              ].map(({ pct, label, lead }) => (
                <div key={label} className="flex items-center gap-4">
                  <span className={`font-serif text-lg w-12 shrink-0 ${lead ? 'text-ocre-dark' : 'text-ocre'}`}>{pct}</span>
                  <div className="flex-1">
                    <div className="h-1 bg-beige-dark rounded-full mb-1">
                      <div className={`h-full rounded-full ${lead ? 'bg-ocre' : 'bg-ocre/60'}`} style={{ width: pct }} />
                    </div>
                    <p className={`text-xs ${lead ? 'text-terre font-medium' : 'text-terre/60'}`}>{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl text-terre mb-6">Questions fréquentes</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'La tombola est-elle encore ouverte ?',
                  r: "Non. La vente des billets est close et le tirage a eu lieu en public le 03 octobre 2026 à Vielle-Saint-Girons. Les gagnants ont été contactés directement par l'association.",
                },
                {
                  q: 'La tombola était-elle déclarée en préfecture ?',
                  r: 'Oui. Conformément à la réglementation française, cette tombola était organisée par une association loi 1901 à but non lucratif et respectait les obligations légales applicables.',
                },
                {
                  q: 'À quoi serviront les fonds récoltés ?',
                  r: "À financer les premiers équipements de la recyclerie, les collectes, les ateliers de sensibilisation et la redistribution solidaire de matériel reconditionné. L'intégralité des fonds soutient la recyclerie solidaire.",
                },
              ].map(({ q, r }) => (
                <div key={q} className="border-l-2 border-ocre/25 pl-5 py-1">
                  <p className="font-sans text-sm font-semibold text-terre mb-1.5">{q}</p>
                  <p className="text-sm text-terre/60 leading-relaxed">{r}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/evenement-lancement-03-octobre-2026/" className="btn-kaki">
              Retour sur la journée du 03 octobre
            </Link>
            <Link to="/soutenir/don/" className="btn-outline-ocre">
              Soutenir la recyclerie par un don
            </Link>
          </div>
        </div>
      </section>

      <section className="py-6 bg-beige border-t border-beige-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link to="/soutenir/" className="text-sm text-kaki hover:text-ocre transition-colors">
            ← Retour à soutenir
          </Link>
        </div>
      </section>
    </Layout>
  )
}
