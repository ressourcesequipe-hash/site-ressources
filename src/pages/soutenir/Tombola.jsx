import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import TombolaModal from '../../components/TombolaModal'
import TousLesLotsModal from '../../components/TousLesLotsModal'
import PartenairesTombola from '../../components/PartenairesTombola'
import CompteARebours from '../../components/CompteARebours'
import CartePoints from '../../components/CartePoints'
import { lienCarte } from '../../data/carte'
import {
  LIBELLE_EN_COURS,
  LOTS_PODIUM,
  LOTS_SECONDAIRES,
  LOT_PRINCIPAL,
  NOMBRE_LOTS_ARRONDI,
  POINTS_VENTE,
  POINTS_VENTE_TEXTE,
  PRIX_BILLET,
  RESUME_CATEGORIES,
  VALEUR_ARRONDIE,
  formatEuros,
} from '../../data/lotsTombola'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Où peut-on acheter des billets de tombola ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `En ligne via HelloAsso, ou en espèces chez nos commerçants partenaires — ${POINTS_VENTE.length} points de vente : ${POINTS_VENTE_TEXTE}. Il n'est pas nécessaire d'être présent à l'événement : en cas de gain, nous vous contacterons directement pour organiser la remise de votre lot.`,
      },
    },
    {
      '@type': 'Question',
      name: 'Comment se déroule le tirage au sort de la tombola ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Le tirage a lieu en public le 03 octobre 2026 à Vielle-Saint-Girons, en présence des participants et des partenaires. Les résultats seront publiés sur nos actualités.',
      },
    },
    {
      '@type': 'Question',
      name: 'La tombola solidaire est-elle déclarée en préfecture ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui. Conformément à la réglementation française, cette tombola est organisée par une association loi 1901 à but non lucratif et respecte les obligations légales applicables.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quel est le prix d\'un billet de tombola ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Un billet coûte 5 €. Vous pouvez en acheter plusieurs pour augmenter vos chances. L\'intégralité des fonds soutient la recyclerie solidaire.',
      },
    },
  ],
}

const BREADCRUMBS = [
  { label: 'Soutenir', href: '/soutenir/' },
  { label: 'Tombola solidaire' },
]

export default function Tombola() {
  const [modalOpen, setModalOpen] = useState(false)
  const [lotsOpen, setLotsOpen] = useState(false)
  // Point de vente à mettre en avant sur la carte, choisi depuis la liste.
  // Le jeton rend l'objet distinct à chaque clic, y compris sur la même ligne.
  const [pointActif, setPointActif] = useState(null)

  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <TombolaModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <TousLesLotsModal isOpen={lotsOpen} onClose={() => setLotsOpen(false)} />
      <SEO
        title={`Tombola solidaire Landes 2026 — plus de ${VALEUR_ARRONDIE.toLocaleString('fr-FR')} € de lots · Association Ressources`}
        description={`Participez à la tombola solidaire de l'association Ressources le 03 octobre 2026 à Vielle-Saint-Girons. Billet à ${PRIX_BILLET} €, en ligne ou chez nos commerçants partenaires : plus de ${VALEUR_ARRONDIE.toLocaleString('fr-FR')} € de lots à gagner, répartis sur plus de ${NOMBRE_LOTS_ARRONDI} lots offerts par les commerçants, artisans et producteurs du territoire landais.`}
        canonical="/soutenir/tombola/"
        schema={faqSchema}
        ogImage="https://www.ressourcesrecyclerie.fr/og-tombola.jpg"
        ogImageWidth={1280}
        ogImageHeight={720}
        ogImageAlt={`Tombola solidaire de l'association Ressources — plus de ${VALEUR_ARRONDIE.toLocaleString('fr-FR')} € de lots à gagner, billet à ${PRIX_BILLET} €, tirage le 03 octobre 2026`}
      />

      {/* Hero */}
      <section className="bg-kaki text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-ocre" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Soutenir
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4">
            Tombola solidaire — 03 octobre 2026
          </h1>
          <p className="text-white/65 max-w-xl leading-relaxed mb-7">
            Participez à une grande tombola solidaire et soutenez le lancement
            de la recyclerie informatique et végétale Ressources dans les Landes.
          </p>

          {/* Bandeau de preuve : urgence, volume de lots, prix */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-7">
            <CompteARebours variant="clair" />
            <span className="hidden sm:block w-px h-8 bg-white/15" aria-hidden />
            <p className="font-sans text-sm text-white/70">
              <span className="text-white font-semibold">Plus de {VALEUR_ARRONDIE.toLocaleString('fr-FR')} €</span> de lots
              à gagner, répartis sur <span className="text-white font-semibold">plus de {NOMBRE_LOTS_ARRONDI} lots</span>
              <span className="text-white/30 mx-2">·</span>
              <span className="text-white font-semibold">{PRIX_BILLET} €</span> le billet
            </p>
          </div>

          {/* CTA principal */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
            <button
              onClick={() => setModalOpen(true)}
              className="btn-ocre w-full sm:w-auto text-base px-9 py-4 shadow-lg shadow-black/20"
            >
              Je prends mes billets — {PRIX_BILLET} €
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button onClick={() => setLotsOpen(true)} className="btn-outline-white w-full sm:w-auto">
              Voir tous les lots
            </button>
          </div>

          <p className="font-sans text-xs text-white/45 leading-relaxed">
            Paiement sécurisé HelloAsso · Pas besoin d'être présent au tirage ·
            100 % des fonds pour la recyclerie
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Mise en avant lots */}
          {/* scroll-mt : l'en-tête collant fait 96 px sur mobile et 112 px
              au-dessus, il faut le dégager pour que le titre ne soit pas
              masqué à l'arrivée sur l'ancre. */}
          <div id="lots" className="text-center bg-ocre-pale border border-ocre/20 p-10 mb-12 scroll-mt-28 md:scroll-mt-32">
            <p className="font-sans text-xs text-ocre font-semibold tracking-widest uppercase mb-3">
              Lots à gagner
            </p>
            <p className="font-serif text-5xl md:text-7xl text-ocre leading-none mb-2">
              Plus de {VALEUR_ARRONDIE.toLocaleString('fr-FR')} €
            </p>
            <p className="font-sans text-xl text-terre/60 mb-2">
              de lots à gagner, répartis sur plus de {NOMBRE_LOTS_ARRONDI} lots
              offerts par nos partenaires locaux
            </p>
            <p className="text-sm text-terre/50 max-w-md mx-auto mb-7">
              La dotation est complète : tous les lots mis en jeu le 03 octobre
              sont dès maintenant visibles ci-dessous.
            </p>

            {/* Prix du billet */}
            <div className="inline-flex items-baseline gap-2 border-y border-ocre/25 px-6 py-3 mb-7">
              <span className="font-serif text-3xl text-ocre leading-none">{PRIX_BILLET} €</span>
              <span className="font-sans text-sm text-terre/55">le billet</span>
            </div>

            <div>
              <button onClick={() => setModalOpen(true)} className="btn-ocre">
                Acheter mes billets maintenant
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 mb-12">
            <div>
              <h2 className="font-serif text-2xl text-terre mb-4">Pourquoi participer ?</h2>
              <p className="text-sm text-terre/65 leading-relaxed mb-4">
                Chaque ticket contribue au financement des premiers équipements,
                des collectes, des ateliers de sensibilisation et de la redistribution
                solidaire de matériel reconditionné.
              </p>
              <div className="space-y-3">
                {[
                  'Outils et matériels de diagnostic et reconditionnement',
                  'Matériel de stockage et de manutention',
                  'Communication et sensibilisation sur le territoire',
                  'Frais de déplacement pour les bénévoles',
                  'Consommables et petit équipement',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-terre/65">
                    <span className="text-ocre mt-1 shrink-0">→</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-serif text-2xl text-terre mb-4">Comment participer ?</h2>
              <div className="space-y-4">
                {[
                  { num: '1', text: 'Achetez vos billets en ligne via HelloAsso, ou chez un commerçant partenaire' },
                  { num: '2', text: 'Venez à l\'événement le 03 octobre 2026 à Vielle-Saint-Girons' },
                  { num: '3', text: 'Participez au tirage au sort et tentez de remporter l\'un des lots' },
                  { num: '4', text: 'Votre achat soutient directement la recyclerie solidaire des Landes' },
                ].map(({ num, text }) => (
                  <div key={num} className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-ocre text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {num}
                    </span>
                    <p className="text-sm text-terre/65 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Où acheter ses billets */}
          <div className="bg-beige-light border border-beige-dark p-6 md:p-8 mb-12">
            <h2 className="font-serif text-2xl text-terre mb-2">Où acheter vos billets ?</h2>
            <p className="text-sm text-terre/60 leading-relaxed mb-7 max-w-2xl">
              Le billet est à {PRIX_BILLET} €. En ligne à tout moment, ou en espèces
              chez l'un de nos commerçants partenaires du territoire.
            </p>

            {/* Empilement plutôt que deux colonnes : la liste des points de vente
                s'allonge au fil des partenariats et déséquilibrait le bloc en ligne. */}
            <div className="space-y-5">
              {/* En ligne */}
              <div className="bg-kaki text-white p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
                <div className="mb-5 sm:mb-0">
                  <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-ocre mb-3">
                    En ligne · 24h/24
                  </p>
                  <h3 className="font-serif text-xl text-white mb-2">Billetterie HelloAsso</h3>
                  <p className="text-sm text-white/55 leading-relaxed max-w-md">
                    Paiement sécurisé, billet reçu par e-mail. En cas de gain, nous
                    vous contactons directement.
                  </p>
                </div>
                <button onClick={() => setModalOpen(true)} className="btn-ocre text-sm shrink-0">
                  Acheter en ligne
                </button>
              </div>

              {/* Points de vente physiques */}
              <div className="border border-beige-dark bg-white p-6">
                <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-ocre mb-3">
                  Sur place · {POINTS_VENTE.length} points de vente
                </p>
                <h3 className="font-serif text-xl text-terre mb-5">Chez nos commerçants</h3>

                {/* Liste et carte côte à côte : les numéros de la liste sont
                    ceux des épingles, ce qui relie les deux sans légende. */}
                <div className="grid lg:grid-cols-[1fr_1.05fr] gap-6 lg:gap-8">
                  <ol className="space-y-3">
                    {POINTS_VENTE.map((point, i) => (
                      <li
                        key={`${point.nom}-${point.ville}`}
                        className="flex items-start gap-3"
                      >
                        <button
                          type="button"
                          onClick={() => setPointActif({ index: i, jeton: Date.now() })}
                          aria-label={`Localiser ${point.nom} à ${point.ville} sur la carte`}
                          className="group flex items-start gap-3 flex-1 min-w-0 text-left"
                        >
                          <span
                            className="shrink-0 w-5 h-5 mt-0.5 rounded-full bg-ocre text-white font-sans text-[10px] font-bold flex items-center justify-center transition-colors group-hover:bg-ocre-dark"
                            aria-hidden
                          >
                            {i + 1}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-sans text-sm text-terre leading-snug transition-colors group-hover:text-ocre-dark">
                              {point.nom}
                            </span>
                            <span className="block text-xs text-terre/50 mt-0.5">
                              {point.adresse ? `${point.adresse} · ` : ''}
                              {point.ville}
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
                    ))}
                  </ol>

                  <CartePoints
                    points={POINTS_VENTE}
                    pointActif={pointActif}
                    libelle="points de vente des billets"
                  />
                </div>

                <p className="text-xs text-terre/45 mt-5 italic">
                  D'autres points de vente s'ajouteront d'ici au 03 octobre.
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
            {LOTS_PODIUM.map(({ lot, partenaire, valeur, detail, statut }, i) => {
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
                      <span className="font-serif text-2xl text-ocre leading-none">
                        {formatEuros(valeur)}
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

          {/* Accès à la liste complète — la billetterie étant ouverte, le détail
              de tous les lots est désormais public. */}
          <div className="text-center mb-12">
            <button onClick={() => setLotsOpen(true)} className="btn-outline-ocre">
              Voir la liste complète des lots
            </button>
          </div>

          {/* Résumé des autres lots */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl text-terre mb-2">
              Et {LOTS_SECONDAIRES.length} autres lots à gagner
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
                  q: 'Où peut-on acheter des billets ?',
                  r: `En ligne via HelloAsso, ou en espèces chez nos commerçants partenaires — ${POINTS_VENTE.length} points de vente : ${POINTS_VENTE_TEXTE}. Il n'est pas nécessaire d'être présent à l'événement : en cas de gain, nous vous contacterons directement.`,
                },
                {
                  q: 'Comment se déroule le tirage au sort ?',
                  r: 'Le tirage a lieu en public le 03 octobre 2026 à Vielle-Saint-Girons, en présence des participants et des partenaires. Les résultats seront publiés sur nos actualités.',
                },
                {
                  q: 'La tombola est-elle déclarée en préfecture ?',
                  r: 'Oui. Conformément à la réglementation française, cette tombola est organisée par une association loi 1901 à but non lucratif et respecte les obligations légales applicables.',
                },
                {
                  q: 'Quel est le prix d\'un billet ?',
                  r: 'Un billet coûte 5 €. Vous pouvez en acheter plusieurs pour augmenter vos chances. L\'intégralité des fonds soutient la recyclerie solidaire.',
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
            <button onClick={() => setModalOpen(true)} className="btn-ocre">
              Acheter des billets
            </button>
            <Link to="/evenement-lancement-03-octobre-2026/" className="btn-kaki">
              Voir l'événement du 03 octobre
            </Link>
            <Link to="/soutenir/don/" className="btn-outline-ocre">
              Faire un don directement
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
