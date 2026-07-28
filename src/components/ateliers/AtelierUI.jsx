import { Link } from 'react-router-dom'
import { useReveal } from '../../hooks/useReveal'

/* Apparition au scroll — idiome du site */
export function Reveal({ children, className = '' }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} className={`${className} ${visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
      {children}
    </div>
  )
}

export const IconArrow = (p) => (
  <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7M21 12H3" /></svg>
)

/* Hero silo — fond kaki, filet ocre (signature des pages piliers) */
export function AtelierHero({ eyebrow, h1, intro, chips = [], cta = true }) {
  return (
    <section className="bg-kaki text-white py-14 md:py-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-ocre" />
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-ocre/5 rounded-tl-full pointer-events-none" aria-hidden />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-4">{eyebrow}</p>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-4">{h1}</h1>
        <div className="w-12 h-0.5 bg-ocre mb-6" />
        <p className="text-white/65 max-w-2xl leading-relaxed mb-8">{intro}</p>
        {cta && (
          <div className="flex flex-wrap gap-4 mb-7">
            <Link to="/contact/" className="btn-ocre">Demander un devis <IconArrow className="w-4 h-4" /></Link>
            <Link to="/ateliers/" className="btn-outline-white">Voir tous nos ateliers</Link>
          </div>
        )}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2.5">
            {chips.map((c) => (
              <span key={c} className="text-xs text-white/85 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full">{c}</span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export function SectionHead({ label, h2, intro, className = '' }) {
  return (
    <Reveal className={`max-w-2xl mb-10 ${className}`}>
      <p className="section-label">{label}</p>
      <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-terre mb-3">{h2}</h2>
      {intro && <p className="text-terre/60 leading-relaxed">{intro}</p>}
    </Reveal>
  )
}

/* Liste de thématiques en pastilles */
export function Chips({ items, theme = 'num' }) {
  const isNum = theme === 'num'
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span
          key={t}
          className={`text-sm bg-white px-3 py-1.5 rounded-full border ${isNum ? 'border-ocre/30 text-ocre-dark' : 'border-kaki/20 text-kaki'}`}
        >
          {t}
        </span>
      ))}
    </div>
  )
}

/* Bloc FAQ — le schema FAQPage est passé séparément au composant SEO */
export function Faq({ items, title = 'Questions fréquentes' }) {
  return (
    <section className="py-16 md:py-20 bg-beige-light">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHead label="FAQ" h2={title} />
        <div className="divide-y divide-beige-dark border-y border-beige-dark">
          {items.map(({ q, r }) => (
            <details key={q} className="group py-5">
              <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                <h3 className="font-serif text-lg text-terre group-open:text-ocre-dark transition-colors">{q}</h3>
                <span className="text-ocre shrink-0 mt-1 transition-transform duration-200 group-open:rotate-45" aria-hidden>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="2" d="M12 5v14M5 12h14" /></svg>
                </span>
              </summary>
              <p className="text-sm text-terre/65 leading-relaxed mt-3 pr-8">{r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* Maillage interne — cartes vers les pages sœurs du silo */
export function PagesSoeurs({ pages, title = 'Nos autres ateliers' }) {
  if (!pages.length) return null
  return (
    <section className="py-16 md:py-20 bg-white border-t border-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHead label="Poursuivre" h2={title} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pages.map((p) => {
            const isNum = p.theme === 'num'
            return (
              <Link
                key={p.to}
                to={p.to}
                className="group relative bg-white border border-beige p-6 hover:-translate-y-1 hover:shadow-lg hover:border-beige-dark transition-all duration-300"
              >
                <span className={`absolute top-0 left-0 right-0 h-0.5 ${isNum ? 'bg-ocre' : 'bg-kaki'}`} />
                <h3 className="font-serif text-xl text-terre mb-2 group-hover:text-ocre-dark transition-colors">{p.titre}</h3>
                <p className="text-sm text-terre/60 leading-relaxed mb-4">{p.resume}</p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-ocre">
                  En savoir plus <IconArrow className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* Bandeau de conversion en fin de page */
export function CtaFinal({
  h2 = 'Construisons votre atelier',
  texte = "Présentez-nous votre besoin : nous vous proposons un format adapté à vos objectifs, votre public et votre territoire.",
}) {
  return (
    <section className="py-16 md:py-24 bg-ocre-pale border-t border-ocre/20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <p className="section-label">On en parle ?</p>
        <h2 className="font-serif text-3xl sm:text-4xl text-terre mb-4">{h2}</h2>
        <p className="text-terre/65 leading-relaxed mb-8">{texte}</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/contact/" className="btn-ocre">Demander un devis <IconArrow className="w-4 h-4" /></Link>
          <Link to="/contact/" className="btn-outline-ocre">Nous contacter</Link>
        </div>
      </div>
    </section>
  )
}
