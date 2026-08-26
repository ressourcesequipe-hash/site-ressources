import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PRIX_BILLET, VALEUR_ARRONDIE } from '../data/lotsTombola'
import { DEFI } from '../data/defiCollecte'

/**
 * Bandeau des temps forts, sous le hero de la page d'accueil.
 *
 * C'etait un bandeau fixe consacre a la seule tombola, dont la vignette etait
 * en `hidden lg:block` : sur mobile, la moitie visuelle du bloc n'existait pas.
 * Il devient un carrousel a deux diapositives — tombola et challenge
 * territorial — et la vignette s'affiche a toutes les tailles.
 *
 * Une seule diapositive est montee a la fois, plutot qu'un rail translate :
 * les liens des diapositives masquees ne sont alors ni tabulables ni lus par
 * un lecteur d'ecran, sans avoir a manier `inert` ni `aria-hidden`.
 */

const DUREE_AUTO = 8000

const SLIDES = [
  {
    cle: 'tombola',
    surtitre: 'Grande tombola solidaire',
    titre: `Plus de ${VALEUR_ARRONDIE.toLocaleString('fr-FR')} € de lots à gagner`,
    texte:
      'Villa sur la côte landaise · ordinateur gaming · vélo · vol en montgolfière · ' +
      'séjours · restaurants · activités, et de nombreux autres lots offerts par nos partenaires.',
    repere: (
      <>
        <span className="text-ocre font-bold text-base">{PRIX_BILLET} €</span> le billet
        <span className="text-white/25 mx-2">·</span>
        Tirage au sort le 3 octobre 2026 à Vielle-Saint-Girons
      </>
    ),
    actions: [
      { to: '/soutenir/tombola/', label: `Je tente ma chance — ${PRIX_BILLET} €`, style: 'principal' },
      { to: '/soutenir/tombola/#lots', label: 'Découvrir tous les lots', style: 'secondaire' },
      { to: '/evenement-lancement-03-octobre-2026/', label: "L'événement du 3 octobre", style: 'discret' },
    ],
    vignette: {
      src: '/photos/tombola-vignette.webp',
      lien: '/soutenir/tombola/',
      alt:
        `Tombola solidaire du 3 octobre 2026 : plus de ${VALEUR_ARRONDIE.toLocaleString('fr-FR')} € ` +
        `de lots à gagner, ticket à ${PRIX_BILLET} € — voir tous les lots`,
    },
  },
  {
    cle: 'challenge',
    surtitre: 'Challenge territorial',
    titre: 'Une demi-tonne de matériel à collecter',
    texte:
      `Réunir ${DEFI.objectifKg} kilos de matériel informatique dormant sur le territoire ` +
      'landais, en cinq semaines. Chaque ordinateur oublié dans un placard compte.',
    repere: (
      <>
        <span className="text-ocre font-bold text-base">Du {DEFI.debut}</span> au {DEFI.fin}
        <span className="text-white/25 mx-2">·</span>
        {DEFI.collecteKg !== null
          ? `${DEFI.collecteKg} kg collectés sur ${DEFI.objectifKg} kg`
          : `Premières pesées à partir du ${DEFI.debut}`}
      </>
    ),
    actions: [
      { to: '/defi-collecte/', label: 'Participer au challenge', style: 'principal' },
      { to: '/defi-collecte/#devenir-point-collecte', label: 'Devenir point de collecte', style: 'secondaire' },
    ],
    // L'alt reprend le texte de l'affiche : c'est une image de texte, et elle
    // est l'unique contenu de son lien. Si le fichier venait a manquer,
    // `echecs` plus bas repasse la diapositive en pleine largeur.
    vignette: {
      src: '/photos/challenge-vignette.webp',
      lien: '/defi-collecte/',
      alt:
        'Challenge territorial : objectif une demi-tonne de matériel électronique ' +
        `et informatique, du ${DEFI.debut} au ${DEFI.fin} — voir comment participer`,
    },
  },
]

const CLASSES_ACTION = {
  principal: 'btn-ocre shadow-ocre-glow',
  secondaire: 'btn-outline-white',
  discret:
    'font-sans text-xs text-white/60 hover:text-white transition-colors underline underline-offset-4',
}

export default function BandeauTempsForts() {
  const [index, setIndex] = useState(0)
  // Tant que personne n'a touche au carrousel, il defile seul et les changements
  // ne sont pas annonces : une region live qui parle toutes les huit secondes
  // rend un lecteur d'ecran inutilisable. Des la premiere action, l'inverse.
  const [manuel, setManuel] = useState(false)
  // Vignettes dont le fichier manque : plutot qu'une image cassee, la
  // diapositive concernee repasse en pleine largeur. C'est ce qui permet de
  // referencer un visuel avant qu'il ait ete depose.
  const [echecs, setEchecs] = useState(() => new Set())
  const [enPause, setEnPause] = useState(false)
  const toucheX = useRef(null)

  const slide = SLIDES[index]

  const allerA = useCallback((i) => {
    setManuel(true)
    setIndex((i + SLIDES.length) % SLIDES.length)
  }, [])

  useEffect(() => {
    if (manuel || enPause) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), DUREE_AUTO)
    return () => clearInterval(t)
  }, [manuel, enPause])

  const auClavier = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); allerA(index + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); allerA(index - 1) }
  }

  // Glissement horizontal sur mobile : 45 px suffisent a distinguer un balayage
  // d'un simple appui, sans declencher pendant un defilement vertical.
  const auDebutToucher = (e) => { toucheX.current = e.changedTouches[0].clientX }
  const aLaFinToucher = (e) => {
    if (toucheX.current === null) return
    const delta = e.changedTouches[0].clientX - toucheX.current
    toucheX.current = null
    if (Math.abs(delta) > 45) allerA(index + (delta < 0 ? 1 : -1))
  }

  return (
    <section
      className="relative text-white overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #2B3520 0%, #3D4A2D 55%, #59633F 100%)' }}
      aria-roledescription="carrousel"
      aria-label="Temps forts de l'association"
      onMouseEnter={() => setEnPause(true)}
      onMouseLeave={() => setEnPause(false)}
      onFocusCapture={() => setEnPause(true)}
      onBlurCapture={() => setEnPause(false)}
      onKeyDown={auClavier}
      onTouchStart={auDebutToucher}
      onTouchEnd={aLaFinToucher}
    >
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-ocre to-transparent" aria-hidden />
      <div className="absolute right-0 top-0 w-[38%] h-full pointer-events-none" aria-hidden
        style={{ background: 'radial-gradient(circle at top right, rgba(200,151,58,0.14), transparent 65%)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        {/* Les diapositives sont empilees dans une meme cellule de grille : le
            bandeau prend donc toujours la hauteur de la plus haute, et le
            contenu sous lui ne sursaute pas au changement — ce qui compterait
            double ici, puisque le carrousel avance aussi de lui-meme.
            La diapositive inactive est en `invisible`, pas en `hidden` : elle
            continue de tenir la hauteur, tout en sortant de l'ordre de
            tabulation et de l'arbre d'accessibilite. */}
        <div className="grid">
          {SLIDES.map((slide, i) => {
          const vignette = slide.vignette && !echecs.has(slide.cle) ? slide.vignette : null
          return (
          <div
            key={slide.cle}
            role="group"
            aria-roledescription="diapositive"
            aria-label={`${i + 1} sur ${SLIDES.length} — ${slide.surtitre}`}
            className={`col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none ${
              i === index ? 'opacity-100' : 'opacity-0 invisible'
            }`}
          >
            <div className={
              vignette
                ? 'grid lg:grid-cols-[1.35fr_1fr] gap-8 lg:gap-12 items-center'
                : 'max-w-3xl'
            }>
              <div>
                <p className="inline-flex items-center gap-2 font-sans text-ocre text-[11px] tracking-[0.22em] uppercase font-bold mb-3">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-ocre opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-ocre" />
                  </span>
                  {slide.surtitre}
                </p>

                <h2 className="font-serif text-3xl md:text-4xl text-white mb-3 leading-tight">
                  {slide.titre}
                </h2>

                <p className="text-white/60 text-sm leading-relaxed mb-4 max-w-xl">
                  {slide.texte}
                </p>

                <p className="font-sans text-sm text-white/75 mb-6">{slide.repere}</p>

                <div className="flex flex-wrap items-center gap-4">
                  {slide.actions.map(({ to, label, style }) => (
                    <Link key={to} to={to} className={CLASSES_ACTION[style]}>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {vignette && (
                <Link
                  to={vignette.lien}
                  className="group block rounded-xl overflow-hidden border-4 border-beige-light shadow-2xl shadow-black/30"
                >
                  <img
                    src={vignette.src}
                    width={1280}
                    height={720}
                    loading="lazy"
                    decoding="async"
                    alt={vignette.alt}
                    onError={() => setEchecs((s) => new Set(s).add(slide.cle))}
                    className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                </Link>
              )}
            </div>
          </div>
          )})}
        </div>

        {/* Annonce le changement au lecteur d'ecran, mais seulement apres une
            action de l'utilisateur : une region live qui parle toutes les huit
            secondes rend la page inutilisable a l'oreille. */}
        <p className="sr-only" aria-live="polite">
          {manuel ? `Diapositive ${index + 1} sur ${SLIDES.length} : ${slide.surtitre}` : ''}
        </p>

        {/* Commandes : pastilles a gauche, fleches a droite. Toujours visibles,
            jamais posees par-dessus le contenu — sur mobile, une commande
            flottante finit sous le pouce ou sur le texte. */}
        <div className="flex items-center justify-between gap-4 mt-8 pt-5 border-t border-white/10">
          <div className="flex items-center gap-2.5">
            {SLIDES.map((s, i) => (
              <button
                key={s.cle}
                type="button"
                onClick={() => allerA(i)}
                aria-label={`Afficher : ${s.surtitre}`}
                aria-current={i === index ? 'true' : undefined}
                className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-2 focus-visible:ring-offset-kaki ${
                  i === index ? 'w-8 bg-ocre' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
            <span className="font-sans text-[11px] text-white/50 ml-2 tabular-nums">
              {index + 1} / {SLIDES.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {[
              { sens: -1, label: 'Temps fort précédent', d: 'M15 19l-7-7 7-7' },
              { sens: 1, label: 'Temps fort suivant', d: 'M9 5l7 7-7 7' },
            ].map(({ sens, label, d }) => (
              <button
                key={label}
                type="button"
                onClick={() => allerA(index + sens)}
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center border border-white/20 text-white/70 transition-colors duration-200 hover:border-ocre hover:text-ocre focus:outline-none focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-2 focus-visible:ring-offset-kaki"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden />
    </section>
  )
}
