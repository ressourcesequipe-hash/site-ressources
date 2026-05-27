import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { useReveal } from '../hooks/useReveal'

function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const numericTarget = parseInt(String(target).replace(/\s/g, ''), 10)
    if (isNaN(numericTarget)) { setCount(target); return }
    let start = 0
    const step = Math.ceil(numericTarget / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= numericTarget) { setCount(numericTarget); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [started, target, duration])

  return { ref, count }
}

const STEPS = [
  { num: '01', title: 'Collecter', desc: 'Points de collecte sur le territoire landais' },
  { num: '02', title: 'Trier', desc: 'Identification et qualification de chaque appareil' },
  { num: '03', title: 'Sécuriser', desc: 'Effacement certifié et traçabilité des données' },
  { num: '04', title: 'Diagnostiquer', desc: 'Contrôle technique approfondi' },
  { num: '05', title: 'Reconditionner', desc: 'Remise en état et tests de fonctionnement' },
  { num: '06', title: 'Redistribuer', desc: 'Attribution solidaire sur le territoire' },
]

const IMPACT = [
  { value: 120,   suffix: '',  label: 'équipements à collecter' },
  { value: 100,   suffix: '%', label: 'réemployés ou valorisés' },
  { value: 1000,  suffix: '',  label: 'plantes redistribuées' },
  { value: 3,     suffix: '',  label: 'communes partenaires' },
  { value: 8,     suffix: '',  label: 'bénévoles réguliers' },
]

const PARTENAIRES = ['SITCOM40', 'Mairie Vielle-Saint-Girons', 'CC Côte Landes Nature', 'CC MACS']

export default function Home() {
  const [heroVisible, setHeroVisible] = useState(false)
  const filieres = useReveal()
  const impact = useReveal()
  const steps = useReveal()
  const event = useReveal()
  const territoire = useReveal()

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <Layout>
      <SEO
        title={null}
        description="Association Ressources — recyclerie informatique et végétale solidaire dans les Landes. Donnez une seconde vie à vos équipements et vos plantes à Vielle-Saint-Girons (40560)."
        canonical="/"
      />

      {/* ── HERO ── */}
      <section className="relative bg-beige-light overflow-hidden min-h-[92vh] flex items-center">
        {/* Accent line top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-ocre/60 via-ocre/20 to-transparent" aria-hidden />

        {/* Rich background */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'radial-gradient(circle, #3D4A2D 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="absolute right-0 top-0 w-[45%] h-full bg-kaki/[0.025]"
            style={{ clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)' }} />
          {/* Animated floating orbs */}
          <div className="absolute right-16 top-12 w-96 h-96 md:w-[520px] md:h-[520px] rounded-full border border-ocre/10 animate-spin-slow" />
          <div className="absolute right-28 top-24 w-64 h-64 md:w-[360px] md:h-[360px] rounded-full border border-ocre/07 animate-[spin_40s_linear_infinite_reverse]" />
          <div className="absolute right-40 top-36 w-40 h-40 md:w-[200px] md:h-[200px] rounded-full border border-ocre/05" />
          {/* Glowing blob */}
          <div className="absolute right-20 top-20 w-72 h-72 rounded-full bg-gradient-to-br from-ocre/8 to-transparent blur-3xl animate-pulse-soft" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-kaki/[0.06] blur-2xl" />
          <div className="absolute bottom-16 right-16 w-20 h-20 border border-ocre/15 rotate-45 hidden lg:block animate-float" />
          <div className="absolute top-32 left-[60%] w-2 h-2 rounded-full bg-ocre/40 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-64 left-[70%] w-1.5 h-1.5 rounded-full bg-kaki/40 animate-float" style={{ animationDelay: '2.5s' }} />
          <div className="absolute bottom-40 right-[35%] w-1 h-1 rounded-full bg-ocre/50 animate-float" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32 lg:py-36">
          <div className="max-w-2xl lg:max-w-3xl">

            {/* Badge */}
            <div className={`inline-flex items-center gap-2.5 mb-8 px-4 py-2 border border-ocre/30 bg-ocre/[0.06] transition-all duration-700 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ocre opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ocre" />
              </span>
              <span className="font-sans text-xs font-semibold tracking-[0.15em] uppercase text-ocre">
                Initiative citoyenne · Vielle-Saint-Girons, Landes
              </span>
            </div>

            {/* Heading */}
            <h1 className={`font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] text-terre leading-[1.08] mb-7 tracking-tight transition-all duration-700 delay-100 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              Recyclerie solidaire
              <br />
              <span className="text-ocre italic">dans les Landes</span>
              <br />
              <span className="text-xl sm:text-2xl lg:text-3xl text-kaki font-sans font-normal tracking-normal not-italic opacity-80">
                Informatique & Végétal
              </span>
            </h1>

            <p className={`text-base md:text-lg text-terre/58 leading-relaxed mb-10 max-w-lg transition-all duration-700 delay-200 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              Une initiative citoyenne née à Vielle-Saint-Girons, pour le réemploi
              et l'inclusion sur le territoire des Landes. Loi 1901, fondée en 2025.
            </p>

            {/* Value chips */}
            <div className={`flex flex-wrap gap-3 mb-12 transition-all duration-700 delay-300 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              {[
                { label: 'Réemploi', icon: '♻' },
                { label: 'Solidarité', icon: '🤝' },
                { label: 'Proximité', icon: '📍' },
              ].map(({ label, icon }) => (
                <span key={label}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-kaki/20 bg-white/70 backdrop-blur-sm font-sans text-xs font-medium text-terre/75 tracking-wide hover:border-ocre/40 hover:bg-ocre/5 transition-all duration-200 cursor-default"
                >
                  <span className="text-sm" aria-hidden>{icon}</span>
                  {label}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className={`flex flex-wrap gap-4 transition-all duration-700 delay-400 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              <Link to="/recyclerie-informatique/comment-donner/" className="btn-ocre rounded-lg">
                Je donne du matériel informatique
              </Link>
              <Link to="/recyclerie-vegetale/comment-donner/" className="btn-kaki rounded-lg">
                Je donne des plantes
              </Link>
            </div>

            {/* Mini stats */}
            <div className={`flex flex-wrap gap-x-8 gap-y-3 mt-14 pt-8 border-t border-kaki/10 transition-all duration-700 delay-500 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {[
                { val: '120', label: 'équipements / an' },
                { val: '1 000', label: 'plantes redistribuées' },
                { val: '3', label: 'communes partenaires' },
              ].map(({ val, label }) => (
                <div key={label} className="flex items-baseline gap-2 group">
                  <span className="font-serif text-2xl text-ocre leading-none group-hover:scale-110 transition-transform duration-200 inline-block">{val}</span>
                  <span className="font-sans text-xs text-terre/45">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BANDEAU ÉVÉNEMENT ── */}
      <section className="relative bg-kaki text-white py-8 md:py-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-kaki-dark via-kaki to-kaki" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ocre/50 to-transparent" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="font-sans text-ocre text-xs tracking-[0.2em] uppercase font-semibold mb-2">
                Événement de lancement
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-white mb-1">
                03 octobre 2026 — Vielle-Saint-Girons
              </h2>
              <p className="text-white/60 text-sm">
                Challenge collecte · 1 tonne de matériel informatique · Tombola solidaire · objectif 15 000 €
              </p>
            </div>
            <Link
              to="/evenement-lancement-03-octobre-2026/"
              className="btn-outline-white shrink-0 rounded-lg"
            >
              Découvrir l'événement
            </Link>
          </div>
        </div>
      </section>

      {/* ── NOS DEUX FILIÈRES ── */}
      <section className="py-16 md:py-24 bg-white" ref={filieres.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`text-center mb-14 transition-all duration-700 ${filieres.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="section-label">Ce que nous faisons</p>
            <h2 className="font-serif text-3xl md:text-4xl text-terre">Nos deux filières solidaires</h2>
            <div className="w-12 h-px bg-ocre/40 mx-auto mt-5" />
          </div>

          <div className={`grid md:grid-cols-2 gap-0 shadow-2xl transition-all duration-700 delay-200 ${filieres.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Informatique */}
            <div className="group relative bg-kaki text-white p-8 md:p-12 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-kaki/30 cursor-pointer">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-ocre via-ocre-light to-ocre/30" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-ocre/[0.07] rounded-bl-full transition-all duration-500 group-hover:w-48 group-hover:h-48" />
              <div className="absolute inset-0 bg-gradient-to-br from-kaki to-kaki-dark opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-6 right-8 font-serif text-[8rem] leading-none text-white/[0.04] select-none pointer-events-none" aria-hidden>01</div>

              <div className="relative">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 bg-ocre/15 border border-ocre/30 flex items-center justify-center transition-all duration-300 group-hover:bg-ocre/25 group-hover:scale-110">
                    <ComputerIcon />
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-3xl text-ocre leading-none">120</p>
                    <p className="font-sans text-[10px] text-white/40 tracking-wide mt-0.5">équipements / an</p>
                  </div>
                </div>

                <p className="font-sans text-ocre text-[10px] font-bold tracking-[0.2em] uppercase mb-3">Filière informatique</p>
                <h3 className="font-serif text-2xl md:text-3xl text-white mb-4 leading-snug">
                  Donnez une seconde vie<br />à vos équipements
                </h3>
                <div className="w-8 h-px bg-ocre/40 mb-5 transition-all duration-300 group-hover:w-16" />
                <p className="text-white/55 text-sm leading-relaxed mb-8 max-w-sm">
                  Ordinateurs, tablettes et smartphones triés, sécurisés et
                  reconditionnés pour les personnes et structures qui en ont besoin
                  sur le territoire des Landes.
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {['Collecte', 'Reconditionnement', 'Redistribution'].map(t => (
                    <span key={t} className="text-[10px] font-sans font-medium text-ocre/80 border border-ocre/20 px-2.5 py-1 tracking-wide hover:border-ocre/50 hover:text-ocre transition-all duration-150">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link to="/recyclerie-informatique/comment-donner/" className="btn-ocre text-sm rounded-lg">
                    Je donne du matériel
                  </Link>
                  <Link to="/recyclerie-informatique/" className="btn-outline-white text-sm rounded-lg">
                    En savoir plus
                  </Link>
                </div>
              </div>
            </div>

            {/* Végétale */}
            <div className="group relative bg-kaki-pale text-terre p-8 md:p-12 overflow-hidden border-l-0 md:border-l border-kaki/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-kaki/20 cursor-pointer">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-kaki via-kaki-light to-kaki/30" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-kaki/[0.05] rounded-bl-full transition-all duration-500 group-hover:w-48 group-hover:h-48" />
              <div className="absolute inset-0 bg-gradient-to-br from-kaki-pale to-beige opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="absolute bottom-6 right-8 font-serif text-[8rem] leading-none text-kaki/[0.06] select-none pointer-events-none" aria-hidden>02</div>

              <div className="relative">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 bg-kaki/10 border border-kaki/20 flex items-center justify-center transition-all duration-300 group-hover:bg-kaki/20 group-hover:scale-110">
                    <PlantIcon />
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-3xl text-kaki leading-none">1 000</p>
                    <p className="font-sans text-[10px] text-terre/40 tracking-wide mt-0.5">plantes / an</p>
                  </div>
                </div>

                <p className="font-sans text-kaki text-[10px] font-bold tracking-[0.2em] uppercase mb-3">Filière végétale</p>
                <h3 className="font-serif text-2xl md:text-3xl text-terre mb-4 leading-snug">
                  Vos plantes méritent<br />un nouvel avenir
                </h3>
                <div className="w-8 h-px bg-kaki/30 mb-5 transition-all duration-300 group-hover:w-16" />
                <p className="text-terre/55 text-sm leading-relaxed mb-8 max-w-sm">
                  Plantes, contenants, outils et matériels de jardinage récupérés
                  et redistribués aux habitants, communes et associations
                  du territoire landais.
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {['Collecte', 'Soin', 'Redistribution'].map(t => (
                    <span key={t} className="text-[10px] font-sans font-medium text-kaki/70 border border-kaki/20 px-2.5 py-1 tracking-wide hover:border-kaki/50 hover:text-kaki transition-all duration-150">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link to="/recyclerie-vegetale/comment-donner/" className="btn-kaki text-sm rounded-lg">
                    Je donne des plantes
                  </Link>
                  <Link to="/recyclerie-vegetale/" className="inline-block border border-kaki text-kaki font-sans font-medium px-6 py-2.5 text-sm tracking-wide transition-all duration-300 hover:bg-kaki hover:text-white rounded-lg hover:-translate-y-px">
                    En savoir plus
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHIFFRES & IMPACT ── */}
      <section className="py-16 md:py-24 bg-beige relative overflow-hidden" ref={impact.ref}>
        <div className="absolute inset-0 bg-gradient-to-br from-beige via-beige to-beige-dark/40" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`text-center mb-14 transition-all duration-700 ${impact.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="section-label">Phase pilote — An 1</p>
            <h2 className="font-serif text-3xl md:text-4xl text-terre">Nos objectifs d'impact</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-beige-dark">
            {IMPACT.map(({ value, label, suffix }, i) => (
              <ImpactCounter key={label} value={value} suffix={suffix} label={label} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 ÉTAPES ── */}
      <section className="py-16 md:py-24 bg-white overflow-hidden" ref={steps.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14 transition-all duration-700 ${steps.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div>
              <p className="section-label">Filière informatique</p>
              <h2 className="font-serif text-3xl md:text-4xl text-terre max-w-lg">
                De la collecte à la redistribution
              </h2>
            </div>
            <Link to="/recyclerie-informatique/reconditionnement/" className="btn-outline-ocre text-sm shrink-0 self-start md:self-auto rounded-lg">
              Voir le détail du processus →
            </Link>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-[22px] left-[22px] right-[22px] h-px bg-gradient-to-r from-ocre/50 via-ocre/20 to-ocre/5" aria-hidden />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-4">
              {STEPS.map(({ num, title, desc }, i) => (
                <div
                  key={num}
                  className={`relative flex lg:flex-col items-start gap-4 lg:gap-0 transition-all duration-700 ${
                    steps.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: steps.visible ? `${i * 80}ms` : '0ms' }}
                >
                  {i < STEPS.length - 1 && (
                    <div className="lg:hidden absolute left-[22px] top-12 bottom-0 w-px bg-ocre/20 -mb-8" aria-hidden />
                  )}

                  <div className="relative z-10 w-11 h-11 shrink-0 bg-white border-2 border-ocre flex items-center justify-center lg:mb-5 shadow-sm hover:shadow-lg hover:shadow-ocre/20 hover:scale-110 transition-all duration-300 group cursor-default">
                    <span className="font-serif text-ocre text-xs font-bold group-hover:text-ocre-dark">{num}</span>
                  </div>

                  <div className="lg:pt-0 pt-1">
                    <h3 className="font-serif text-[15px] text-terre font-semibold mb-1.5 leading-snug">{title}</h3>
                    <p className="text-xs text-terre/45 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION ÉVÉNEMENT ── */}
      <section className="py-16 md:py-24 bg-kaki-pale relative overflow-hidden" ref={event.ref}>
        <div className="absolute inset-0 bg-gradient-to-br from-kaki-pale via-kaki-pale to-beige" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className={`transition-all duration-700 ${event.visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <p className="section-label">À ne pas manquer</p>
              <h2 className="font-serif text-3xl md:text-4xl text-terre mb-4">
                Événement de lancement<br />
                <span className="text-ocre">03 octobre 2026</span>
              </h2>
              <div className="decorative-line" />
              <p className="text-terre/65 leading-relaxed mb-6">
                Une journée festive et solidaire pour marquer le lancement officiel
                de l'association Ressources à Vielle-Saint-Girons. Venez nombreux !
              </p>
              <div className="space-y-4 mb-8">
                <EventFeature icon="🏆" title="Challenge collecte — 1 tonne" desc="Objectif collecte de matériel informatique pour la journée" />
                <EventFeature icon="🎟" title="Tombola solidaire" desc="Objectif 15 000 € pour financer l'équipement de l'association" />
                <EventFeature icon="📍" title="Vielle-Saint-Girons, Landes" desc="Dans les locaux et espaces partenaires de la commune" />
              </div>
              <Link to="/evenement-lancement-03-octobre-2026/" className="btn-ocre rounded-lg">
                Je participe à l'événement
              </Link>
            </div>

            {/* Visual block */}
            <div className={`relative transition-all duration-700 delay-200 ${event.visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="absolute -inset-4 bg-gradient-to-br from-ocre/10 to-kaki/10 rounded-3xl blur-2xl" aria-hidden />
              <div className="relative bg-kaki text-white p-10 md:p-12 overflow-hidden rounded-2xl shadow-2xl shadow-kaki/20">
                <div className="absolute top-0 right-0 w-40 h-40 bg-ocre/10 rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-ocre/5 rounded-tr-full" />
                <div className="absolute inset-0 bg-gradient-to-br from-kaki to-kaki-dark opacity-60" />
                <div className="relative">
                  <p className="font-sans text-ocre text-xs tracking-[0.2em] uppercase font-semibold mb-4">
                    Samedi 03 octobre 2026
                  </p>
                  <p className="font-serif text-6xl md:text-7xl text-white/10 leading-none mb-6 select-none" aria-hidden>
                    03<br />OCT
                  </p>
                  <p className="font-serif text-xl text-white mb-2">
                    Rejoignez-nous pour le lancement
                  </p>
                  <p className="text-white/55 text-sm leading-relaxed mb-6">
                    Vielle-Saint-Girons (Landes, 40560)<br />
                    Programme complet à venir
                  </p>
                  <div className="border-t border-white/10 pt-6">
                    <p className="text-xs text-white/40 mb-1">Objectif tombola</p>
                    <p className="font-serif text-3xl text-ocre">15 000 €</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TERRITOIRE & PARTENAIRES ── */}
      <section className="py-16 md:py-24 bg-white" ref={territoire.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`text-center mb-12 transition-all duration-700 ${territoire.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="section-label">Ancrage local</p>
            <h2 className="font-serif text-3xl md:text-4xl text-terre mb-4">
              Un projet du territoire landais
            </h2>
            <p className="text-terre/55 max-w-lg mx-auto text-sm leading-relaxed">
              Ressources est construite avec et pour le territoire des Landes,
              en lien étroit avec les collectivités et partenaires locaux.
            </p>
          </div>

          <div className={`bg-gradient-to-br from-beige-light to-beige border border-beige p-8 md:p-12 mb-10 text-center rounded-2xl transition-all duration-700 delay-100 ${territoire.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8">
              {['CC Côte Landes Nature', 'CC MACS'].map((cc) => (
                <div key={cc} className="bg-kaki/5 border border-kaki/15 px-5 py-3 text-sm text-kaki font-medium rounded-lg hover:bg-kaki/10 hover:border-kaki/30 transition-all duration-200">
                  {cc}
                </div>
              ))}
            </div>
            <p className="text-xs text-terre/40 tracking-wide uppercase font-sans mb-2">Zone d'action principale</p>
            <p className="font-serif text-xl text-terre">Côte landaise · Marensin · Born · Marsan</p>
          </div>

          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 transition-all duration-700 delay-200 ${territoire.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {PARTENAIRES.map((p, i) => (
              <div
                key={p}
                className="border border-beige-dark bg-beige-light flex items-center justify-center p-5 text-center rounded-xl hover:shadow-lg hover:border-ocre/30 hover:-translate-y-1 transition-all duration-300"
                style={{ minHeight: 80, transitionDelay: `${i * 60}ms` }}
              >
                <p className="text-xs text-terre/50 font-sans font-medium leading-snug">{p}</p>
              </div>
            ))}
          </div>

          <div className={`text-center transition-all duration-700 delay-300 ${territoire.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-sm text-terre/50 mb-4">Votre commune souhaite s'engager à nos côtés ?</p>
            <Link to="/association/partenaires/" className="btn-outline-ocre text-sm rounded-lg">
              Nous contacter pour un partenariat
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}

function ImpactCounter({ value, suffix = '', label, index = 0 }) {
  const { ref, count } = useCountUp(value)
  const display = typeof count === 'number'
    ? count >= 1000
      ? `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)} k`
      : count.toLocaleString('fr-FR')
    : count

  return (
    <div
      ref={ref}
      className="bg-beige flex flex-col items-center justify-center text-center px-4 py-10 md:py-12 group hover:bg-white transition-colors duration-300 cursor-default"
    >
      <div className="relative mb-3">
        <p className="font-serif text-5xl md:text-6xl text-ocre leading-none tabular-nums group-hover:scale-105 transition-transform duration-300 inline-block">
          {display}<span className="text-3xl md:text-4xl">{suffix}</span>
        </p>
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-px bg-ocre/40 group-hover:w-12 transition-all duration-300" />
      </div>
      <p className="font-sans text-xs text-terre/55 leading-snug mt-3 max-w-[100px]">{label}</p>
    </div>
  )
}

function EventFeature({ icon, title, desc }) {
  return (
    <div className="flex gap-4 group">
      <span className="text-2xl shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200 inline-block" aria-hidden>{icon}</span>
      <div>
        <p className="font-sans text-sm font-semibold text-terre mb-0.5">{title}</p>
        <p className="text-xs text-terre/55 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function ComputerIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect x="4" y="6" width="32" height="22" rx="2" stroke="#C8973A" strokeWidth="2"/>
      <line x1="12" y1="34" x2="28" y2="34" stroke="#C8973A" strokeWidth="2" strokeLinecap="round"/>
      <line x1="20" y1="28" x2="20" y2="34" stroke="#C8973A" strokeWidth="2"/>
    </svg>
  )
}

function PlantIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <path d="M20 34V18" stroke="#3D4A2D" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 22C20 22 12 18 10 10C18 10 22 16 22 22" fill="#3D4A2D" fillOpacity="0.2" stroke="#3D4A2D" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M20 26C20 26 28 22 30 14C22 14 18 20 20 26" fill="#3D4A2D" fillOpacity="0.15" stroke="#3D4A2D" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}
