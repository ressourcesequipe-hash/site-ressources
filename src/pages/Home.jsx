import { Link } from 'react-router-dom'
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import NewsletterForm from '../components/NewsletterForm'
import BandeauTempsForts from '../components/BandeauTempsForts'
import { useReveal } from '../hooks/useReveal'
import { COOPERATIONS_EN_COURS, PARTENAIRES_CONFIRMES } from '../data/partenaires'
import { NOMBRE_LOTS_ARRONDI } from '../data/lotsTombola'
import { afficher, objectifs, MENTION_PHASE_PILOTE } from '../data/objectifs'

/* ── Count-up hook ── */
// useLayoutEffect previent bruyamment quand il s'execute au rendu serveur, ou
// il n'a de toute facon aucun sens. On lui substitue useEffect la-bas.
const useEffetAvantPeinture = typeof window === 'undefined' ? useEffect : useLayoutEffect

function useCountUp(target, duration = 2000) {
  // Le compteur demarre a sa valeur finale, et non a zero : c'est cette valeur
  // qui part dans le HTML prerendu. En partant de zero, la page d'accueil
  // annoncait « 0 equipements a collecter » a Google et aux robots sociaux,
  // qui n'executent pas le JavaScript declenchant l'animation au defilement.
  const [count, setCount] = useState(target)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  // Remise a zero apres l'hydratation mais avant la peinture : le premier rendu
  // client reste identique au rendu serveur — donc pas d'erreur d'hydratation —
  // et l'oeil ne voit pas le chiffre afficher sa valeur finale avant de repartir.
  useEffetAvantPeinture(() => {
    // Mouvement reduit : on garde la valeur finale, sans animation du tout.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    setCount(0)
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const n = parseInt(String(target).replace(/\s/g, ''), 10)
    if (isNaN(n)) { setCount(target); return }
    let cur = 0
    const step = Math.ceil(n / (duration / 16))
    const t = setInterval(() => {
      cur += step
      if (cur >= n) { setCount(n); clearInterval(t) }
      else setCount(cur)
    }, 16)
    return () => clearInterval(t)
  }, [started, target, duration])

  return { ref, count }
}

/* ── Data ── */
const STEPS = [
  { num: '01', title: 'Collecter', desc: 'Points de collecte sur le territoire landais' },
  { num: '02', title: 'Trier', desc: 'Identification et qualification de chaque appareil' },
  { num: '03', title: 'Sécuriser', desc: 'Effacement sécurisé et traçabilité des données' },
  { num: '04', title: 'Diagnostiquer', desc: 'Contrôle technique approfondi' },
  { num: '05', title: 'Reconditionner', desc: 'Remise en état et tests de fonctionnement' },
  { num: '06', title: 'Redistribuer', desc: 'Attribution solidaire sur le territoire' },
]

// Les deux blocs d'objectifs de la page n'en montrent pas les memes : le hero
// annonce ce qui est collecte et ou, le bloc impact la part reemployee. Les
// valeurs viennent toutes de data/objectifs.js, qui fait autorite pour le site.
const IMPACT = objectifs('equipements', 'reemploi', 'plantes')
const OBJECTIFS_HERO = objectifs('equipements', 'plantes', 'communes')
// Les deux cartes filieres reprennent les memes valeurs avec leur libelle
// propre. Le chiffre vient de la meme source, seul le libelle leur appartient.
const [CARTE_INFO, CARTE_VEGETAL] = objectifs('equipements', 'plantes')

// Volontairement pas de liste locale : les statuts viennent de data/partenaires.js,
// pour qu'une structure en cours d'echange ne puisse pas apparaitre ici comme
// partenaire etabli.

/* ── Page ── */
export default function Home() {
  const [heroVisible, setHeroVisible] = useState(false)
  const filieres  = useReveal()
  const impact    = useReveal()
  const steps     = useReveal()
  const event     = useReveal()
  const territoire = useReveal()

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <Layout>
      <SEO
        title="Recyclerie Solidaire Landes | Association Ressources"
        description="Ressources : recyclerie informatique et végétale solidaire dans les Landes (40). Donnez vos équipements et plantes, soutenez le réemploi à Vielle-Saint-Girons (40560)."
        canonical="/"
      />

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative mesh-hero noise-overlay overflow-hidden md:min-h-[76vh] flex items-center">

        {/* Top accent */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-ocre/50 to-transparent" aria-hidden />

        {/* Decorative geometry */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden>
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.022]"
            style={{ backgroundImage: 'radial-gradient(circle, #404C2F 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          {/* Right panel */}
          <div className="absolute right-0 top-0 w-[42%] h-full"
            style={{ background: 'linear-gradient(135deg, transparent 0%, rgba(61,74,45,0.03) 100%)', clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)' }} />

          {/* Rotating rings */}
          <div className="absolute right-10 top-10 w-[480px] h-[480px] rounded-full border border-ocre/10 animate-spin-slow" />
          <div className="absolute right-24 top-24 w-[340px] h-[340px] rounded-full border border-ocre/07"
            style={{ animation: 'spin 45s linear infinite reverse' }} />
          <div className="absolute right-36 top-36 w-[200px] h-[200px] rounded-full border border-kaki/06" />

          {/* Glow orbs */}
          <div className="absolute right-16 top-12 w-96 h-96 rounded-full animate-pulse-soft"
            style={{ background: 'radial-gradient(circle, rgba(200,151,58,0.10) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(61,74,45,0.07) 0%, transparent 70%)' }} />
          {/* Floating particles */}
          {[
            { top: '28%', left: '62%', size: 'w-2 h-2', color: 'bg-ocre/40', delay: '0s' },
            { top: '55%', left: '72%', size: 'w-1.5 h-1.5', color: 'bg-kaki/30', delay: '1.5s' },
            { top: '20%', left: '80%', size: 'w-1 h-1', color: 'bg-ocre/50', delay: '3s' },
            { top: '70%', left: '55%', size: 'w-1 h-1', color: 'bg-kaki/25', delay: '2s' },
            { top: '40%', left: '85%', size: 'w-2 h-2', color: 'bg-ocre/20', delay: '0.8s' },
          ].map((p, i) => (
            <div
              key={i}
              className={`absolute rounded-full ${p.size} ${p.color} animate-float`}
              style={{ top: p.top, left: p.left, animationDelay: p.delay }}
            />
          ))}

          {/* Rotating square */}
          <div className="absolute bottom-20 right-20 w-16 h-16 border border-ocre/15 rotate-45 hidden lg:block animate-float"
            style={{ animationDelay: '1s' }} />
          {/* Small diamond */}
          <div className="absolute top-1/3 right-[38%] w-6 h-6 border border-ocre/20 rotate-45 hidden lg:block" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 w-full">
          <div className="max-w-2xl lg:max-w-3xl">

            {/* Heading — clip-path reveal */}
            <div
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.8s ease 0.12s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.12s',
              }}
            >
              <h1 className="font-serif text-[clamp(2.4rem,6vw,4.5rem)] text-terre leading-[1.06] mb-5 tracking-tight">
                Recyclerie solidaire
                <br />
                {/* Taille propre, plus petite que le h1 parent (69px) : environ
                    75% de sa taille a chaque largeur d'ecran. */}
                <span className="italic text-[clamp(1.8rem,4.5vw,3.4rem)]" style={{ color: '#90955F' }}>
                  dans les Landes
                </span>
                <br />
                <span className="text-[clamp(1.1rem,2.5vw,1.75rem)] text-kaki font-sans font-light tracking-normal opacity-75 not-italic"
                  style={{ WebkitTextFillColor: 'inherit' }}>
                  Informatique & Végétal
                </span>
              </h1>
            </div>

            {/* Description */}
            <p
              className="text-base md:text-lg text-terre/55 leading-relaxed mb-6 max-w-lg"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease 0.22s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.22s',
              }}
            >
              Nous collectons, reconditionnons et remettons en circulation du
              matériel informatique et des végétaux dans les Landes.
            </p>

            {/* Value chips */}
            <div
              className="flex flex-wrap gap-2.5 mb-7"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 0.7s ease 0.32s, transform 0.7s ease 0.32s',
              }}
            >
              {[
                { label: 'Réemploi',   icon: <IconReemploi /> },
                { label: 'Solidarité', icon: <IconSolidarite /> },
                { label: 'Proximité',  icon: <IconProximite /> },
              ].map(({ label, icon }) => (
                <span key={label} className="chip">
                  <span aria-hidden>{icon}</span>
                  {label}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-4 mb-6"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 0.7s ease 0.42s, transform 0.7s ease 0.42s',
              }}
            >
              <Link to="/recyclerie-informatique/comment-donner/" className="btn-ocre shadow-ocre-glow">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Je donne du matériel informatique
              </Link>
              <Link to="/recyclerie-vegetale/comment-donner/" className="btn-kaki shadow-kaki-glow">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Participer au réemploi végétal
              </Link>
            </div>

            {/* Parcours secondaires — les visiteurs n'arrivent pas tous avec la
                meme intention. Entreprises/collectivites et donateurs financiers
                ont leur entree ici, sans alourdir la hauteur du hero. */}
            <div
              className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-8"
              style={{
                opacity: heroVisible ? 1 : 0,
                transition: 'opacity 0.7s ease 0.5s',
              }}
            >
              <Link
                to="/ateliers/collectivites/"
                className="group inline-flex items-center gap-1.5 font-sans text-sm text-kaki hover:text-ocre transition-colors"
              >
                Organiser une collecte
                <span className="text-xs text-terre/40 group-hover:text-ocre transition-colors">
                  entreprise ou collectivité
                </span>
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </Link>
              <Link
                to="/soutenir/don/"
                className="group inline-flex items-center gap-1.5 font-sans text-sm text-kaki hover:text-ocre transition-colors"
              >
                Faire un don
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
              </Link>
            </div>

            {/* Mini stats — objectifs de la première année, jamais des résultats acquis */}
            <div
              className="pt-6 border-t border-kaki/10"
              style={{
                opacity: heroVisible ? 1 : 0,
                transition: 'opacity 0.7s ease 0.55s',
              }}
            >
              <p className="font-sans text-[10px] font-semibold tracking-[0.18em] uppercase text-terre/35 mb-3">
                Nos objectifs — première année
              </p>
              <div className="flex flex-wrap gap-x-10 gap-y-4">
              {OBJECTIFS_HERO.map((objectif) => (
                <div key={objectif.cle} className="flex items-baseline gap-2 group">
                  <span className="font-serif text-2xl leading-none group-hover:text-ocre transition-colors duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #C8973A, #D4AA5A)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                    {afficher(objectif)}
                  </span>
                  <span className="font-sans text-xs text-terre/40">{objectif.label}</span>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 right-8 lg:right-12 flex-col items-center gap-2 hidden md:flex"
          style={{
            opacity: heroVisible ? 0.5 : 0,
            transition: 'opacity 1s ease 1.2s',
          }}
          aria-hidden
        >
          <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-terre/40">Découvrir</span>
          <div className="w-px h-8 bg-gradient-to-b from-ocre/60 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ══════════════ TEMPS FORTS — CONVERSION PRINCIPALE ══════════════ */}
      {/* Carrousel tombola + challenge territorial. Le detail vit dans le
          composant : deux diapositives, commandes et balayage tactile. */}
      <BandeauTempsForts />

      {/* ══════════════ DEUX FILIÈRES ══════════════ */}
      <section className="py-20 md:py-28 bg-white" ref={filieres.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className={`text-center mb-16 transition-all duration-700 ${filieres.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="section-label">Ce que nous faisons</p>
            <h2 className="font-serif text-3xl md:text-4xl text-terre">Nos deux filières solidaires</h2>
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-px w-12 bg-ocre/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-ocre/50" />
              <div className="h-px w-12 bg-ocre/30" />
            </div>
          </div>

          <div className={`grid md:grid-cols-2 gap-0 overflow-hidden rounded-2xl shadow-2xl shadow-terre/10 transition-all duration-700 delay-200 ${filieres.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

            {/* Informatique */}
            <div className="group relative bg-kaki text-white p-8 md:p-14 overflow-hidden transition-all duration-500 hover:shadow-2xl">
              {/* Top accent */}
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-ocre via-ocre-light to-ocre/20" />
              {/* Corner glow */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-bl-full transition-all duration-700 group-hover:w-64 group-hover:h-64"
                style={{ background: 'radial-gradient(circle at top right, rgba(200,151,58,0.12), transparent 70%)' }} />
              {/* Big bg number */}
              <div className="absolute bottom-4 right-6 font-serif text-[9rem] leading-none text-white/[0.035] select-none pointer-events-none" aria-hidden>01</div>
              {/* Diagonal hover overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(135deg, rgba(43,53,32,0.5) 0%, transparent 60%)' }} />

              <div className="relative">
                {/* Icon + stat */}
                <div className="flex items-start justify-between mb-10">
                  <div className="w-14 h-14 bg-ocre/15 border border-ocre/25 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-ocre/25 group-hover:shadow-lg group-hover:shadow-ocre/20">
                    <ComputerIcon />
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-4xl leading-none"
                      style={{ background: 'linear-gradient(135deg, #C8973A, #D4AA5A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      {afficher(CARTE_INFO)}
                    </p>
                    <p className="font-sans text-[10px] text-white/35 tracking-wide mt-1">équipements / an</p>
                  </div>
                </div>

                <p className="font-sans text-ocre text-[10px] font-bold tracking-[0.22em] uppercase mb-3">Filière informatique</p>
                <h3 className="font-serif text-2xl md:text-[1.75rem] text-white mb-4 leading-snug">
                  Donnez une seconde vie<br />à vos équipements
                </h3>
                <div className="w-8 h-px bg-ocre/40 mb-5 transition-all duration-400 group-hover:w-20" />
                <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-sm">
                  Ordinateurs, tablettes et smartphones triés, sécurisés et
                  reconditionnés pour les personnes et structures qui en ont besoin
                  sur le territoire des Landes.
                </p>

                <div className="flex flex-wrap gap-2 mb-9">
                  {['Collecte', 'Reconditionnement', 'Redistribution'].map(t => (
                    <span key={t} className="text-[10px] font-sans font-medium text-ocre/70 border border-ocre/20 px-2.5 py-1 tracking-wide hover:border-ocre/60 hover:text-ocre transition-all duration-150">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link to="/recyclerie-informatique/comment-donner/" className="btn-ocre text-sm">Je donne du matériel</Link>
                  <Link to="/materiel-disponible/" className="btn-outline-white text-sm">Matériel disponible</Link>
                  <Link to="/recyclerie-informatique/" className="btn-outline-white text-sm">En savoir plus</Link>
                </div>
              </div>
            </div>

            {/* Végétale */}
            <div className="group relative text-terre p-8 md:p-14 overflow-hidden transition-all duration-500 hover:shadow-2xl" style={{ backgroundColor: '#EDECCE' }}>
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-kaki via-kaki-light to-kaki/20" />
              <div className="absolute top-0 right-0 w-48 h-48 rounded-bl-full transition-all duration-700 group-hover:w-64 group-hover:h-64"
                style={{ background: 'radial-gradient(circle at top right, rgba(61,74,45,0.07), transparent 70%)' }} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(135deg, rgba(238,240,234,0.8) 0%, transparent 60%)' }} />
              <div className="absolute bottom-4 right-6 font-serif text-[9rem] leading-none text-kaki/[0.05] select-none pointer-events-none" aria-hidden>02</div>

              <div className="relative">
                <div className="flex items-start justify-between mb-10">
                  <div className="w-14 h-14 bg-kaki/10 border border-kaki/15 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-kaki/20 group-hover:shadow-lg group-hover:shadow-kaki/15">
                    <PlantIcon />
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-4xl leading-none" style={{ color: '#6c7c49' }}>{afficher(CARTE_VEGETAL)}</p>
                    <p className="font-sans text-[10px] text-terre/35 tracking-wide mt-1">plantes / an</p>
                  </div>
                </div>

                <p className="font-sans text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: '#6c7c49' }}>Filière végétale</p>
                <h3 className="font-serif text-2xl md:text-[1.75rem] text-terre mb-4 leading-snug">
                  Vos plantes méritent<br />un nouvel avenir
                </h3>
                <div className="w-8 h-px bg-kaki/30 mb-5 transition-all duration-400 group-hover:w-20" />
                <p className="text-terre/50 text-sm leading-relaxed mb-8 max-w-sm">
                  Plantes, contenants, outils et matériels de jardinage récupérés
                  et redistribués aux habitants, communes et associations
                  du territoire landais.
                </p>

                <div className="flex flex-wrap gap-2 mb-9">
                  {['Collecte', 'Soin', 'Redistribution'].map(t => (
                    <span key={t} className="text-[10px] font-sans font-medium px-2.5 py-1 tracking-wide transition-all duration-150"
                      style={{ color: '#6c7c49', border: '1px solid rgba(108,124,73,0.35)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(108,124,73,0.7)'; e.currentTarget.style.color = '#4e5e35'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(108,124,73,0.35)'; e.currentTarget.style.color = '#6c7c49'; }}>
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link to="/recyclerie-vegetale/comment-donner/" className="text-sm inline-flex items-center justify-center gap-2 font-sans font-medium px-7 py-3.5 tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg text-white" style={{ backgroundColor: '#6c7c49' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4e5e35'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6c7c49'}>Je donne des plantes</Link>
                  <Link to="/recyclerie-vegetale/" className="inline-flex items-center gap-2 border-2 border-kaki text-kaki font-sans font-medium px-6 py-2.5 text-sm tracking-wide transition-all duration-300 hover:bg-kaki hover:text-white hover:-translate-y-0.5">
                    En savoir plus
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ IMPACT ══════════════ */}
      <section className="py-20 md:py-28 relative overflow-hidden" ref={impact.ref}
        style={{ background: '#E5E4D5' }}>
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: 'radial-gradient(circle, #404C2F 1px, transparent 1px)', backgroundSize: '24px 24px' }} aria-hidden />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`text-center mb-16 transition-all duration-700 ${impact.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="section-label">Phase pilote — An 1</p>
            <h2 className="font-serif text-3xl md:text-4xl text-terre">Nos objectifs d'impact</h2>
            {/* Sans cette mention, trois grands chiffres animes se lisent comme
                un bilan. L'association ne se lance que le 03 octobre 2026. */}
            <p className="font-sans text-sm text-terre/70 leading-relaxed max-w-xl mx-auto mt-4">
              {MENTION_PHASE_PILOTE}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-beige-dark/50 overflow-hidden rounded-xl shadow-xl">
            {IMPACT.map(({ valeur, label, suffixe }, i) => (
              <ImpactCounter key={label} value={valeur} suffix={suffixe} label={label} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ 6 ÉTAPES ══════════════ */}
      <section className="py-20 md:py-28 bg-white overflow-hidden" ref={steps.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16 transition-all duration-700 ${steps.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div>
              <p className="section-label">Filière informatique</p>
              <h2 className="font-serif text-3xl md:text-4xl text-terre max-w-lg">
                De la collecte à la redistribution
              </h2>
            </div>
            <Link to="/recyclerie-informatique/reconditionnement/" className="btn-outline-ocre text-sm shrink-0 self-start md:self-auto">
              Voir le détail du processus →
            </Link>
          </div>

          <div className="relative">
            {/* Animated connector */}
            <div className="hidden lg:block absolute top-[22px] left-[22px] right-[22px] h-px overflow-hidden" aria-hidden>
              <div className={`h-full transition-all duration-1000 delay-300 ${steps.visible ? 'w-full' : 'w-0'}`}
                style={{ background: 'linear-gradient(to right, #C8973A, #D4AA5A, rgba(200,151,58,0.2))' }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-4">
              {STEPS.map(({ num, title, desc }, i) => (
                <div
                  key={num}
                  className="relative flex lg:flex-col items-start gap-4 lg:gap-0"
                  style={{
                    opacity: steps.visible ? 1 : 0,
                    transform: steps.visible ? 'translateY(0)' : 'translateY(24px)',
                    transition: `opacity 0.6s ease ${i * 80}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms`,
                  }}
                >
                  {i < STEPS.length - 1 && (
                    <div className="lg:hidden absolute left-[22px] top-12 bottom-0 w-px bg-ocre/20 -mb-8" aria-hidden />
                  )}

                  <div className="relative z-10 w-11 h-11 shrink-0 bg-white border-2 border-ocre flex items-center justify-center lg:mb-6 shadow-sm hover:shadow-xl hover:shadow-ocre/20 hover:scale-110 hover:bg-ocre group transition-all duration-300 cursor-default">
                    <span className="font-serif text-ocre text-xs font-bold group-hover:text-white transition-colors duration-300">{num}</span>
                  </div>

                  <div className="lg:pt-0 pt-1">
                    <h3 className="font-serif text-[15px] text-terre font-semibold mb-1.5 leading-snug">{title}</h3>
                    <p className="text-xs text-terre/40 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ ÉVÉNEMENT ══════════════ */}
      <section className="py-20 md:py-28 relative overflow-hidden" ref={event.ref}
        style={{ background: 'linear-gradient(135deg, #EEF0EA 0%, #F2F4EE 50%, #E8EBE3 100%)' }}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-kaki/20 to-transparent" aria-hidden />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            <div style={{
              opacity: event.visible ? 1 : 0,
              transform: event.visible ? 'translateX(0)' : 'translateX(-32px)',
              transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)',
            }}>
              <p className="section-label">À ne pas manquer</p>
              <h2 className="font-serif text-3xl md:text-4xl text-terre mb-4">
                Événement de lancement<br />
                <span style={{
                  background: 'linear-gradient(135deg, #C8973A, #D4AA5A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>03 octobre 2026</span>
              </h2>
              <div className="decorative-line" />
              <p className="text-terre/60 leading-relaxed mb-7">
                Une journée festive et solidaire pour marquer le lancement officiel
                de l'association Ressources à Vielle-Saint-Girons. Venez nombreux !
              </p>
              <div className="space-y-4 mb-9">
                <EventFeature icon={<IconChallenge />} title="Challenge collecte — 1/2 tonne" desc="500 kg à réunir du 1er septembre au 3 octobre, dans les points de collecte du territoire" />
                <EventFeature icon={<IconTombola />} title="Tombola solidaire" desc="Plus de 30 lots offerts par nos partenaires locaux" />
                <EventFeature icon={<IconLieu />} title="Vielle-Saint-Girons, Landes" desc="Dans les locaux et espaces partenaires de la commune" />
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/evenement-lancement-03-octobre-2026/" className="btn-ocre shadow-ocre-glow">
                  Je participe à l'événement
                </Link>
                <Link to="/defi-collecte/" className="btn-outline-ocre">
                  Le challenge collecte
                </Link>
              </div>
            </div>

            {/* Visual card */}
            <div style={{
              opacity: event.visible ? 1 : 0,
              transform: event.visible ? 'translateX(0)' : 'translateX(32px)',
              transition: 'opacity 0.8s ease 0.2s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s',
            }}>
              {/* Halo */}
              <div className="absolute -inset-8 rounded-3xl blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(200,151,58,0.12), transparent 70%)' }} aria-hidden />

              {/* Carte evenement, et non la vignette tombola : celle-ci est deja
                  affichee dans le bloc de conversion sous le hero. La montrer deux
                  fois sur la meme page affaiblirait les deux emplacements. */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-kaki/25"
                style={{ background: 'linear-gradient(135deg, #2B3520 0%, #404C2F 60%, #4a5935 100%)' }}>
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-ocre to-transparent" aria-hidden />
                <div className="absolute top-0 right-0 w-40 h-40 rounded-bl-full" aria-hidden
                  style={{ background: 'radial-gradient(circle at top right, rgba(200,151,58,0.12), transparent 60%)' }} />
                <div className="absolute bottom-0 left-0 w-28 h-28 rounded-tr-full" aria-hidden
                  style={{ background: 'radial-gradient(circle at bottom left, rgba(200,151,58,0.07), transparent 60%)' }} />

                <div className="relative p-10 md:p-12">
                  <p className="font-sans text-ocre text-[10px] tracking-[0.22em] uppercase font-semibold mb-5">
                    Samedi 03 octobre 2026
                  </p>

                  <div className="font-serif leading-none mb-6 select-none" aria-hidden
                    style={{ fontSize: 'clamp(5rem, 12vw, 7rem)', color: 'rgba(255,255,255,0.06)' }}>
                    03<br />OCT
                  </div>

                  <p className="font-serif text-xl text-white mb-2">Rejoignez-nous pour le lancement</p>
                  <p className="text-white/45 text-sm leading-relaxed mb-7">
                    Vielle-Saint-Girons (Landes, 40560)<br />
                    Programme complet à venir
                  </p>

                  <div className="border-t border-white/10 pt-6">
                    <p className="text-[10px] text-white/35 uppercase tracking-widest mb-1.5">Lots à gagner</p>
                    <p className="font-serif text-3xl"
                      style={{ background: 'linear-gradient(135deg, #C8973A, #D4AA5A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      + de {NOMBRE_LOTS_ARRONDI}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ TERRITOIRE ══════════════ */}
      <section className="py-20 md:py-28 bg-white" ref={territoire.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`text-center mb-14 transition-all duration-700 ${territoire.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="section-label">Ancrage local</p>
            <h2 className="font-serif text-3xl md:text-4xl text-terre mb-4">Un projet du territoire landais</h2>
            <p className="text-terre/50 max-w-lg mx-auto text-sm leading-relaxed">
              Ressources est construite avec et pour le territoire des Landes,
              en lien étroit avec les collectivités et partenaires locaux.
            </p>
          </div>

          {/* Zone */}
          <div className={`relative overflow-hidden rounded-2xl border border-beige p-8 md:p-12 mb-10 text-center transition-all duration-700 delay-100 ${territoire.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ background: 'linear-gradient(135deg, #EFEBDF 0%, #E5E4D5 100%)' }}>
            <div className="absolute inset-0 opacity-[0.02]"
              style={{ backgroundImage: 'radial-gradient(circle, #404C2F 1px, transparent 1px)', backgroundSize: '20px 20px' }} aria-hidden />
            <div className="relative">
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8">
                {['CC Côte Landes Nature', 'CC MACS'].map((cc) => (
                  <div key={cc} className="bg-white border border-kaki/15 px-5 py-3 text-sm text-kaki font-medium rounded-xl hover:border-kaki/30 hover:shadow-md transition-all duration-200">
                    {cc}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-terre/35 tracking-[0.22em] uppercase font-sans mb-2">Zone d'action principale</p>
              <p className="font-serif text-xl text-terre">Côte landaise · Marensin · Born · Marsan</p>
            </div>
          </div>

          {/* Partenaires — deux blocs distincts : formalisé d'un côté, échanges
              en cours de l'autre. Les mélanger laisserait croire à un partenariat
              institutionnel là où il n'y a encore qu'une prise de contact. */}
          <div className={`mb-10 transition-all duration-700 delay-200 ${territoire.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-[10px] text-terre/35 tracking-[0.22em] uppercase font-sans mb-3 text-center">
              Nos partenaires
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {PARTENAIRES_CONFIRMES.map(({ nom }, i) => (
                <div
                  key={nom}
                  className="border border-beige-dark bg-beige-light flex items-center justify-center p-5 text-center rounded-xl hover:shadow-lg hover:border-ocre/25 hover:-translate-y-1.5 transition-all duration-300 cursor-default"
                  style={{ minHeight: 80, transitionDelay: `${i * 50}ms` }}
                >
                  <p className="text-xs text-terre/45 font-sans font-medium leading-snug">{nom}</p>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-terre/35 tracking-[0.22em] uppercase font-sans mb-3 text-center">
              Échanges et coopérations en cours
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {COOPERATIONS_EN_COURS.map(({ nom }) => (
                <div
                  key={nom}
                  className="border border-dashed border-beige-dark bg-transparent flex items-center justify-center p-4 text-center rounded-xl cursor-default"
                  style={{ minHeight: 64 }}
                >
                  <p className="text-xs text-terre/35 font-sans leading-snug">{nom}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`text-center transition-all duration-700 delay-300 ${territoire.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-sm text-terre/45 mb-4">Votre commune souhaite s'engager à nos côtés ?</p>
            <Link to="/association/partenaires/" className="btn-outline-ocre text-sm">
              Nous contacter pour un partenariat
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ CTA DON ══════════════ */}
      <section className="relative overflow-hidden py-16 md:py-20"
        style={{ background: 'linear-gradient(135deg, #59633F 0%, #6B7550 50%, #7D8862 100%)' }}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ocre/50 to-transparent" aria-hidden />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, #C8973A 1px, transparent 1px)', backgroundSize: '28px 28px' }} aria-hidden />

        <div className="absolute right-0 top-0 w-96 h-96 rounded-bl-full pointer-events-none"
          style={{ background: 'radial-gradient(circle at top right, rgba(200,151,58,0.10), transparent 65%)' }} aria-hidden />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.22em] uppercase mb-4">
            Soutenir financièrement
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-white leading-tight mb-4">
            Votre don finance l'action<br />
            <span style={{
              background: 'linear-gradient(135deg, #C8973A, #D4AA5A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>sur le territoire landais</span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-md mx-auto mb-8">
            Chaque contribution soutient le tri, la collecte, le reconditionnement
            et la redistribution solidaire dans les Landes.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/soutenir/don/" className="btn-ocre shadow-ocre-glow">
              Faire un don
            </Link>
            <Link to="/soutenir/" className="border border-white/25 text-white/75 px-7 py-3.5 text-sm font-medium hover:border-white/50 hover:text-white transition-all duration-200">
              Autres façons de soutenir
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-14 md:py-16 bg-beige-light border-t border-beige-dark">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <p className="section-label">Restons en contact</p>
          <h2 className="font-serif text-2xl md:text-3xl text-terre mb-3">
            Suivez le lancement de la recyclerie
          </h2>
          <p className="text-sm text-terre/60 leading-relaxed mb-7 max-w-lg mx-auto">
            Ouverture de la billetterie de la tombola, dévoilement des lots,
            points de collecte, appels à bénévoles : recevez les actualités de
            l'association, sans plus.
          </p>
          <div className="max-w-md mx-auto text-left">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </Layout>
  )
}

/* ── Sub-components ── */
function ImpactCounter({ value, suffix = '', label, index = 0 }) {
  const { ref, count } = useCountUp(value)
  const display = typeof count === 'number'
    ? count >= 1000 ? `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)} k` : count.toLocaleString('fr-FR')
    : count

  return (
    <div ref={ref}
      className="impact-card flex flex-col items-center justify-center text-center px-4 py-10 md:py-14 group cursor-default">
      <div className="relative mb-4">
        <p className="font-serif text-5xl md:text-6xl leading-none tabular-nums group-hover:scale-105 transition-transform duration-300 inline-block"
          style={{
            background: 'linear-gradient(135deg, #C8973A 0%, #D4AA5A 50%, #A07828 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
          {display}<span className="text-3xl md:text-4xl">{suffix}</span>
        </p>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-ocre/50 to-transparent transition-all duration-300 group-hover:w-12 w-6" />
      </div>
      <p className="font-sans text-xs text-terre/50 leading-snug mt-3 max-w-[110px] text-center">{label}</p>
    </div>
  )
}

function EventFeature({ icon, title, desc }) {
  return (
    <div className="flex gap-4 group">
      <div className="w-9 h-9 shrink-0 border border-ocre/25 bg-ocre/5 flex items-center justify-center transition-all duration-200 group-hover:bg-ocre/12 group-hover:border-ocre/50" aria-hidden>
        {icon}
      </div>
      <div className="pt-1">
        <p className="font-sans text-sm font-semibold text-terre mb-0.5">{title}</p>
        <p className="text-xs text-terre/50 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

/* ── Icônes SVG minimalistes ── */
function IconReemploi() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8973A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  )
}
function IconSolidarite() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8973A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}
function IconProximite() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8973A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}
function IconChallenge() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8973A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  )
}
function IconTombola() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8973A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-4 0v2" />
      <path d="M8 7V5a2 2 0 0 0-4 0v2" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  )
}
function IconLieu() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8973A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

function ComputerIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect x="4" y="6" width="32" height="22" rx="2" stroke="#C8973A" strokeWidth="2"/>
      <line x1="12" y1="34" x2="28" y2="34" stroke="#C8973A" strokeWidth="2" strokeLinecap="round"/>
      <line x1="20" y1="28" x2="20" y2="34" stroke="#C8973A" strokeWidth="2"/>
    </svg>
  )
}

function PlantIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none" aria-hidden>
      <path d="M20 34V18" stroke="#6c7c49" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 22C20 22 12 18 10 10C18 10 22 16 22 22" fill="#6c7c49" fillOpacity="0.2" stroke="#6c7c49" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M20 26C20 26 28 22 30 14C22 14 18 20 20 26" fill="#6c7c49" fillOpacity="0.15" stroke="#6c7c49" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}

