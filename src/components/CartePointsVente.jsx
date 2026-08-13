import { useEffect, useRef, useState } from 'react'
import { POINTS_VENTE, lienCarte } from '../data/lotsTombola'

// Carte des points de vente des billets de tombola.
//
// Leaflet n'est chargé qu'au moment où la carte entre dans le champ de vision,
// et uniquement par import dynamique : la librairie touche `window` dès son
// évaluation, ce qui casserait le prérendu SSR si elle était importée en haut
// de fichier. Les visiteurs qui ne descendent pas jusqu'ici ne paient donc ni
// les ~43 Ko de la librairie ni les tuiles.
//
// Les numéros des épingles correspondent à ceux de la liste affichée à côté.
// `pointActif` ({ index, jeton }) est levé par cette liste : les quatre points
// du sud tiennent dans 8 km et leurs épingles se superposent à l'échelle du
// département, cliquer la ligne correspondante est le moyen de les séparer.
export default function CartePointsVente({ pointActif = null }) {
  const conteneurRef = useRef(null)
  const carteRef = useRef(null)
  const marqueursRef = useRef([])
  const cadrerRef = useRef(null)
  const observateurTailleRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [etat, setEtat] = useState('attente') // attente | chargee | echec

  // Déclencheur : on n'arme le chargement que lorsque le bloc approche l'écran.
  // Contrôle par position plutôt que IntersectionObserver — même sémantique,
  // mais l'observateur ne rend jamais la main dans un contexte d'affichage qui
  // ne compose pas la page, et la carte restait alors bloquée sur « Chargement ».
  useEffect(() => {
    if (visible) return

    const verifier = () => {
      const cible = conteneurRef.current
      if (!cible) return
      const rect = cible.getBoundingClientRect()
      // 200 px de marge, pour que le chargement précède un peu l'arrivée à l'écran.
      if (rect.top < window.innerHeight + 200 && rect.bottom > -200) setVisible(true)
    }

    verifier()
    window.addEventListener('scroll', verifier, { passive: true })
    window.addEventListener('resize', verifier)

    return () => {
      window.removeEventListener('scroll', verifier)
      window.removeEventListener('resize', verifier)
    }
  }, [visible])

  useEffect(() => {
    if (!visible || carteRef.current) return

    let annule = false

    const monter = async () => {
      try {
        const [{ default: L }] = await Promise.all([
          import('leaflet'),
          import('leaflet/dist/leaflet.css'),
        ])
        if (annule || !conteneurRef.current) return

        const carte = L.map(conteneurRef.current, {
          // La molette resterait piégée par la carte pendant la lecture de la
          // page : on la réserve au double-clic et aux boutons de zoom.
          scrollWheelZoom: false,
          attributionControl: true,
          // Par défaut Leaflet arrondit à l'entier inférieur : les sept points
          // n'occupaient alors qu'un tiers du cadre. Le quart de niveau suffit
          // à les serrer sans donner un rendu de tuiles flou.
          zoomSnap: 0.25,
        })
        carteRef.current = carte

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(carte)

        POINTS_VENTE.forEach((point, i) => {
          const marqueur = L.marker(point.coords, {
            icon: L.divIcon({
              // Passer className remplace le `leaflet-div-icon` par défaut :
              // l'épingle n'hérite donc d'aucun style de la librairie.
              className: 'epingle-point-vente',
              html: `${i + 1}`,
              // 24 px plutôt que 28 : Tosse et Saubion ne sont séparés que de
              // 21 px à l'échelle du cadrage d'ensemble, les pastilles se
              // recouvraient franchement.
              iconSize: [24, 24],
              iconAnchor: [12, 12],
              popupAnchor: [0, -16],
            }),
            alt: `${point.nom} à ${point.ville}`,
            keyboard: true,
          }).addTo(carte)

          const html = document.createElement('div')
          html.className = 'popup-point-vente'
          html.innerHTML = `
            <p class="popup-nom">${point.nom}</p>
            <p class="popup-ville">${point.adresse ? `${point.adresse} · ` : ''}${point.ville}</p>
          `
          const lien = document.createElement('a')
          lien.href = lienCarte(point)
          lien.target = '_blank'
          lien.rel = 'noopener noreferrer'
          lien.className = 'popup-lien'
          lien.textContent = 'Y aller ↗'
          html.appendChild(lien)

          marqueur.bindPopup(html, { closeButton: true, className: 'carte-popup' })
          marqueursRef.current[i] = marqueur
        })

        const limites = L.latLngBounds(POINTS_VENTE.map((p) => p.coords))
        const cadrer = () => carte.fitBounds(limites, { padding: [34, 34] })
        cadrerRef.current = cadrer
        cadrer()

        // Le cadrage dépend de la taille du conteneur, qui n'est pas encore
        // stabilisée au montage (polices, images au-dessus, changement de
        // colonne au point de rupture). Sans cela une épingle sortait du cadre.
        // Recadrer plutôt que seulement recalculer : un survivant hors champ
        // est plus gênant qu'une vue qui se réinitialise en cas de redimension,
        // opération rare en cours de consultation.
        if (typeof ResizeObserver !== 'undefined') {
          observateurTailleRef.current = new ResizeObserver(() => {
            carte.invalidateSize({ animate: false })
            cadrer()
          })
          observateurTailleRef.current.observe(conteneurRef.current)
        }

        if (!annule) setEtat('chargee')
      } catch {
        if (!annule) setEtat('echec')
      }
    }

    monter()

    return () => {
      annule = true
      if (observateurTailleRef.current) {
        observateurTailleRef.current.disconnect()
        observateurTailleRef.current = null
      }
      if (carteRef.current) {
        carteRef.current.remove()
        carteRef.current = null
      }
      marqueursRef.current = []
      cadrerRef.current = null
    }
  }, [visible])

  // Réponse à un clic dans la liste : on approche le point et on ouvre sa bulle.
  // Le jeton porté par `pointActif` permet de rejouer le même point deux fois.
  useEffect(() => {
    const carte = carteRef.current
    const marqueur = pointActif && marqueursRef.current[pointActif.index]
    if (!carte || !marqueur) return

    carte.flyTo(marqueur.getLatLng(), Math.max(carte.getZoom(), 12), { duration: 0.6 })
    marqueur.openPopup()
  }, [pointActif])

  // La carte est un complément : la liste voisine porte la même information de
  // façon accessible, d'où le rôle purement illustratif si le chargement échoue.
  return (
    <div>
      <div className="relative">
        {/* z-0 : Leaflet passe le conteneur en position:relative, ce z-index crée
            donc un contexte d'empilement qui garde ses contrôles (z-index 1000 en
            interne) sous l'en-tête collant du site. */}
        <div
          ref={conteneurRef}
          role="region"
          aria-label={`Carte des ${POINTS_VENTE.length} points de vente des billets`}
          className="h-72 sm:h-80 lg:h-[30rem] w-full border border-beige-dark bg-kaki-pale z-0"
        />

        {etat !== 'chargee' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6">
            <p className="font-sans text-xs text-terre/45 text-center leading-relaxed">
              {etat === 'echec'
                ? 'La carte n’a pas pu se charger — la liste ci-contre reste à jour.'
                : /* Tant que le chargement n'est pas armé, annoncer un chargement
                     en cours serait faux : rien n'a encore été demandé. */
                  visible
                  ? 'Chargement de la carte…'
                  : `Carte des ${POINTS_VENTE.length} points de vente`}
            </p>
          </div>
        )}
      </div>

      {etat === 'chargee' && (
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mt-2">
          <p className="font-sans text-[11px] text-terre/40">
            Zoom au double-clic ou avec les boutons + et −
          </p>
          <button
            type="button"
            onClick={() => {
              carteRef.current?.closePopup()
              cadrerRef.current?.()
            }}
            className="font-sans text-[11px] text-ocre hover:underline"
          >
            Revoir les {POINTS_VENTE.length} points
          </button>
        </div>
      )}
    </div>
  )
}
