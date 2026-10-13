import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CarteProduit from './CarteProduit'
import { useReveal } from '../hooks/useReveal'
import vitrine from '../data/vitrine.json'

/**
 * Apercu de la boutique sur la page d'accueil : les appareils en rayon, sur un
 * rail qui defile a la main.
 *
 * Pas de defilement automatique : le bandeau des temps forts, plus haut, en a
 * deja un, et deux blocs qui bougent seuls se disputent le regard.
 *
 * En dessous de MINIMUM appareils, la section ne s'affiche pas du tout. Un rail
 * d'une ou deux cartes fait paraitre la boutique vide, ce qui la dessert plus
 * que de ne rien montrer. Les appareils vendus n'y figurent pas : ils restent
 * sur la page boutique.
 *
 * Aucun balisage Product ici : il vit sur le catalogue et sur les fiches, et
 * n'a pas a etre declare une troisieme fois.
 */

const MINIMUM = 3
const MAXIMUM = 8

function Fleche({ sens, onClick, inactive }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={inactive}
      aria-label={sens === 'avant' ? 'Appareils suivants' : 'Appareils précédents'}
      className="flex h-11 w-11 items-center justify-center border border-beige-dark bg-white text-kaki transition-colors hover:border-ocre hover:text-ocre disabled:cursor-default disabled:opacity-35 disabled:hover:border-beige-dark disabled:hover:text-kaki"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d={sens === 'avant' ? 'M6 3l5 5-5 5' : 'M10 3L5 8l5 5'}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export default function EnRayon() {
  const tous = vitrine.produits || []
  const produits = tous.slice(0, MAXIMUM)
  const { ref, visible } = useReveal()
  const rail = useRef(null)
  // Ou en est le rail : les fleches s'eteignent en bout de course, et
  // disparaissent quand tout tient a l'ecran.
  const [bords, setBords] = useState({ debut: true, fin: true })

  const mesurer = useCallback(() => {
    const el = rail.current
    if (!el) return
    setBords({
      debut: el.scrollLeft <= 1,
      fin: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
    })
  }, [])

  useEffect(() => {
    mesurer()
    window.addEventListener('resize', mesurer)
    return () => window.removeEventListener('resize', mesurer)
  }, [mesurer])

  if (tous.length < MINIMUM) return null

  const avancer = (sens) => {
    const el = rail.current
    if (!el) return
    const doux = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: sens * el.clientWidth * 0.9, behavior: doux ? 'smooth' : 'auto' })
  }

  const defilable = !(bords.debut && bords.fin)

  return (
    <section className="overflow-hidden border-t border-beige-dark bg-beige-light py-20 md:py-28" ref={ref}>
      <div
        className={`mx-auto max-w-7xl px-4 transition-all duration-700 sm:px-6 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="section-label">Boutique solidaire</p>
            <h2 className="font-serif text-3xl text-terre md:text-4xl">En rayon en ce moment</h2>
            <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-terre/70">
              Du matériel informatique collecté près de chez vous, remis en état dans notre atelier
              et vendu à prix solidaire. Rien ne se commande en ligne : vous venez le voir allumé à
              Vielle-Saint-Girons.
            </p>
          </div>
          {defilable ? (
            <div className="hidden shrink-0 gap-2 md:flex">
              <Fleche sens="arriere" onClick={() => avancer(-1)} inactive={bords.debut} />
              <Fleche sens="avant" onClick={() => avancer(1)} inactive={bords.fin} />
            </div>
          ) : null}
        </div>

        {/* Les marges negatives laissent les cartes filer jusqu'au bord de
            l'ecran sur mobile : la carte coupee dit qu'il y a une suite. */}
        <ul
          ref={rail}
          onScroll={mesurer}
          className="rail-sans-barre -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-6 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:scroll-px-6 sm:px-6"
        >
          {produits.map((p) => (
            <li
              key={p.code}
              className="grid w-[80%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]"
            >
              <CarteProduit p={p} Titre="h3" />
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link to="/materiel-disponible/" className="btn-kaki">
            Voir tout le matériel ({tous.length})
          </Link>
          <Link
            to="/recyclerie-informatique/reconditionnement/"
            className="font-sans text-sm text-kaki underline decoration-ocre/40 underline-offset-2 hover:text-ocre"
          >
            Comment nous le remettons en état
          </Link>
        </div>
      </div>
    </section>
  )
}
