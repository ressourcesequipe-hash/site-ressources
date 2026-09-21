import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import cms from '../data/cms.json' with { type: 'json' }
import { campagnesPour } from '../../lib/campagnes.js'

// Bandeaux et campagnes temporaires — §19 du cahier des charges.
//
// Monté une seule fois dans `src/routes.jsx`, au-dessus des routes : les
// trois emplacements prévus par le §19 sont gérés ici, et aucune page n'a
// donc à savoir qu'un bandeau peut apparaître au-dessus d'elle.
//
// POURQUOI L'AFFICHAGE SE DÉCIDE DANS LE NAVIGATEUR
//
// Le site est prérendu : son HTML est figé au moment du build. Si la fenêtre
// de dates était évaluée là, un bandeau qui se termine à 18 h resterait
// affiché jusqu'à la reconstruction suivante — le lendemain matin au plus
// tôt, la tâche planifiée ne passant qu'une fois par jour sur le palier
// Hobby (§3 de l'architecture). Le visiteur lirait une annonce périmée.
//
// La décision est donc prise après le montage, à l'heure réelle du visiteur.
// Conséquence assumée : le bandeau n'est pas dans le HTML initial et
// apparaît à l'affichage de la page. Pour une annonce temporaire, c'est le
// bon compromis — et cela évite au passage une divergence d'hydratation
// entre le HTML du build et ce que le navigateur calcule.
//
// `cms.json` ne contient que les campagnes ACTIVES : l'interrupteur est déjà
// appliqué à l'export, seules les dates restent à évaluer ici.

const TONS = {
  information: 'bg-kaki-pale text-kaki border-kaki/20',
  evenement: 'bg-ocre/12 text-ocre-dark border-ocre/25',
  alerte: 'bg-red-50 text-red-800 border-red-200',
  collecte: 'bg-ocre/12 text-ocre-dark border-ocre/25',
  appel_benevoles: 'bg-kaki-pale text-kaki border-kaki/20',
  soutien: 'bg-ocre/12 text-ocre-dark border-ocre/25',
}

const BOUTONS = {
  alerte: 'bg-red-700 hover:bg-red-800 text-white',
}
const BOUTON_DEFAUT = 'bg-ocre hover:bg-ocre-dark text-white'

export default function BandeauxCampagnes() {
  const { pathname } = useLocation()
  const [maintenant, setMaintenant] = useState(null)

  // `null` tant que le composant n'est pas monté : rien n'est rendu côté
  // serveur ni dans le HTML prérendu.
  useEffect(() => {
    setMaintenant(new Date())
    // Une page laissée ouverte longtemps — un onglet du matin relu l'après-midi
    // — ne doit pas continuer d'afficher un bandeau terminé. Une vérification
    // par minute suffit largement pour une date à la minute près.
    const minuteur = setInterval(() => setMaintenant(new Date()), 60_000)
    return () => clearInterval(minuteur)
  }, [])

  if (!maintenant) return null

  const toutes = cms.campagnes || []
  const aAfficher = [
    ...campagnesPour(toutes, 'bandeau_global', null, maintenant),
    ...(pathname === '/' ? campagnesPour(toutes, 'accueil', null, maintenant) : []),
    ...campagnesPour(toutes, 'page_specifique', pathname, maintenant),
  ]

  if (aAfficher.length === 0) return null

  return (
    <div className="w-full">
      {aAfficher.map((c) => (
        <aside
          key={c.id}
          // `alert` est annoncé d'emblée par les lecteurs d'écran, ce qui
          // convient à une fermeture ou un report ; les autres types sont
          // des informations, et interrompre la lecture pour elles serait
          // désagréable.
          role={c.type === 'alerte' ? 'alert' : 'region'}
          aria-label={c.type === 'alerte' ? undefined : 'Information de l’association'}
          className={`border-b ${TONS[c.type] || TONS.information}`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center">
            <p className="font-sans text-[13.5px] sm:text-sm leading-snug m-0">{c.message}</p>
            {c.lien && c.texteBouton && (
              <BoutonCampagne lien={c.lien} texte={c.texteBouton} type={c.type} />
            )}
          </div>
        </aside>
      ))}
    </div>
  )
}

// Un lien interne passe par le routeur, un lien externe par une balise <a> :
// confier une adresse externe à <Link> produirait une route introuvable au
// lieu d'ouvrir le site visé.
function BoutonCampagne({ lien, texte, type }) {
  const classe = `shrink-0 inline-block rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold no-underline transition-colors ${
    BOUTONS[type] || BOUTON_DEFAUT
  }`
  const externe = /^https?:\/\//i.test(lien)

  if (externe) {
    return (
      <a href={lien} className={classe} target="_blank" rel="noopener noreferrer">
        {texte}
      </a>
    )
  }
  return (
    <Link to={lien} className={classe}>
      {texte}
    </Link>
  )
}
