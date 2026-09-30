import { useCallback, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { challenge, collectionPoints, communes, partners } from '../data/defiConfig'
import '../inauguration/inauguration.css'

// Présentation de la prise de parole du 3 octobre 2026 —
// https://www.ressourcesrecyclerie.fr/inauguration
//
// Hors du site, comme /defi : ni menu, ni bandeau, ni prérendu, noindex.
// Aucun appel réseau. Le présentateur parle, l'écran illustre.
//
// La jauge n'est PAS refaite ici : « Lancer le décompte » ouvre /defi par une
// navigation interne (sans rechargement), donc le plein écran, le
// localStorage et la musique restent en place. Le retour se fait par le bouton
// « Continuer » de l'écran FIN de /defi, ou en tapant /inauguration?slide=final.

// `steps` : nombre d'apparitions successives dans la slide. Chaque appui sur
// → révèle l'étape suivante avant de passer à la slide d'après.
const SLIDES = [
  { id: 'accueil', steps: 1 },
  { id: 'ressources', steps: 1 },
  { id: 'dynamiques', steps: 4 },
  { id: 'territoire', steps: 1 },
  { id: 'defi', steps: 4 },
  { id: 'lancer', steps: 1 },
  { id: 'final', steps: 4 },
]

const CLE = 'inauguration-slide'
const indexDe = (id) => SLIDES.findIndex((s) => s.id === id)

function slideInitiale(param) {
  if (/^\d+$/.test(param || '')) {
    const n = Number(param) - 1
    if (n >= 0 && n < SLIDES.length) return n
  }
  const direct = indexDe(param)
  if (direct >= 0) return direct
  try {
    const memo = indexDe(sessionStorage.getItem(CLE))
    if (memo >= 0) return memo
  } catch { /* stockage indisponible : on démarre au début */ }
  return 0
}

// Élément qui apparaît à l'étape `n` (la place est réservée : rien ne saute).
function R({ n = 1, step, delai = 0, className = '', children }) {
  return (
    <div
      className={`ino-r ${step >= n ? 'ino-on' : ''} ${className}`}
      style={delai ? { transitionDelay: `${delai}ms` } : undefined}
    >
      {children}
    </div>
  )
}

function Fleche() {
  return <span className="ino-fleche" aria-hidden="true">→</span>
}

function Filiere({ titre, etapes }) {
  return (
    <div className="ino-filiere">
      <h3>{titre}</h3>
      <ol>
        {etapes.map((e, i) => (
          <li key={e}>
            {i > 0 && <Fleche />}
            <span><b>{i + 1}</b>{e}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Accueil() {
  return (
    <div className="ino-centre ino-accueil">
      <img className="ino-logo-grand" src="/logos/logo-ressources-512.png" alt="Ressources" />
      {/* Les lettres montent une à une ; le trait ocre se dessine dessous ; le reste
          suit. Une seule fois, en ~2,6 s, puis l'écran reste immobile. */}
      <h1 className="ino-titre-xxl" aria-label="RESSOURCES">
        {[...'RESSOURCES'].map((l, i) => (
          <span key={i} className="ino-lettre" style={{ '--i': i }} aria-hidden="true">{l}</span>
        ))}
      </h1>
      <div className="ino-trait" aria-hidden="true" />
      <p className="ino-sous-titre ino-a1">Recyclerie solidaire</p>
      <p className="ino-mots ino-a2">Informatique · Végétal</p>
      <p className="ino-lieu ino-a3">Inauguration — 3 octobre 2026<br />Vielle-Saint-Girons</p>
    </div>
  )
}

function Ressources() {
  return (
    <div className="ino-centre">
      <h2 className="ino-titre">Ressources, c’est quoi ?</h2>
      <p className="ino-phrase">Faire de ce qui devait devenir un déchet<br />une nouvelle <em>ressource</em>.</p>
      <div className="ino-filieres">
        <Filiere titre="INFORMATIQUE" etapes={['Collecter', 'Diagnostiquer', 'Reconditionner', 'Redistribuer']} />
        <Filiere titre="VÉGÉTAL" etapes={['Récupérer', 'Préserver', 'Valoriser', 'Remettre en circulation']} />
      </div>
    </div>
  )
}

function Dynamiques({ step }) {
  const blocs = [
    ['RÉEMPLOI', 'Donner une seconde vie aux ressources du territoire.'],
    ['SOLIDARITÉ', 'Rendre matériels, ressources et savoir-faire plus accessibles.'],
    ['TERRITOIRE', 'Créer des coopérations locales et développer une activité pérenne.'],
  ]
  return (
    <div className="ino-centre">
      <h2 className="ino-titre">Une recyclerie locale,<br />solidaire et utile</h2>
      <div className="ino-piliers">
        {blocs.map(([t, d], i) => (
          <R key={t} n={i + 2} step={step} className="ino-pilier">
            <h3>{t}</h3>
            <p>{d}</p>
          </R>
        ))}
      </div>
    </div>
  )
}

// Logos officiels, tels que fournis (aucune recoloration). `sombre` : logo
// blanc, posé sur une tuile kaki. `legende` : logo sans nom écrit. Un nom de
// defiConfig.js sans entrée ici s'affiche en texte. Fichiers générés par
// scripts/logos-inauguration.mjs.
const logosPartenaires = {
  'Vielle-Saint-Girons': { fichier: 'vielle-saint-girons', legende: true },
  Linxe: { fichier: 'linxe' },
  'Saint-Michel-Escalus': { fichier: 'saint-michel-escalus' },
  'Lit-et-Mixe': { fichier: 'lit-et-mixe' },
  'Saint-Geours-de-Maremne': { fichier: 'saint-geours-de-maremne', sombre: true },
  Seignosse: { fichier: 'seignosse', sombre: true },
  'Vieux-Boucau': { fichier: 'vieux-boucau', sombre: true },
  'Saint-Vincent-de-Tyrosse': { fichier: 'saint-vincent-de-tyrosse', sombre: true },
  Labenne: { fichier: 'labenne', sombre: true },
  'E.Leclerc Soustons': { fichier: 'leclerc-soustons' },
  'Imagine Linxe': { fichier: 'imagine-linxe' },
  'Landes Attractivité': { fichier: 'landes-attractivite' },
  'Landes Partage': { fichier: 'landes-partage' },
  Domolandes: { fichier: 'domolandes' },
  Agrolandes: { fichier: 'agrolandes' },
  'Comptoir Électroménager Solidaire': { fichier: 'comptoir-electromenager-solidaire' },
}

// Les communes sont groupées par communauté de communes : celles qui précèdent
// cette commune dans defiConfig.js (Côte Landes Nature), puis celle-ci et les
// suivantes (Maremne Adour Côte-Sud).
const PREMIERE_COMMUNE_MACS = 'Saint-Geours-de-Maremne'

function Tuile({ nom }) {
  const l = logosPartenaires[nom]
  return (
    <li className={`ino-tuile${l.sombre ? ' ino-tuile-sombre' : ''}`}>
      <img src={`/logos/inauguration/${l.fichier}.webp`} alt={nom} />
      {l.legende && <span>{nom}</span>}
    </li>
  )
}

// Ordre propre à cette slide : Saint-Vincent-de-Tyrosse et Vieux-Boucau sont
// permutés par rapport à defiConfig.js (l'écran /defi garde son ordre).
function communesAffichees() {
  const liste = [...communes]
  const a = liste.indexOf('Vieux-Boucau')
  const b = liste.indexOf('Saint-Vincent-de-Tyrosse')
  if (a >= 0 && b >= 0) [liste[a], liste[b]] = [liste[b], liste[a]]
  return liste
}

function Territoire() {
  // Imagine Linxe en dernier (tout à droite), contrairement à defiConfig.js.
  const tous = [...collectionPoints, ...partners]
  const autres = [...tous.filter((n) => n !== 'Imagine Linxe'), ...tous.filter((n) => n === 'Imagine Linxe')]
  const sansLogo = autres.filter((n) => !logosPartenaires[n])
  return (
    <div className="ino-centre ino-territoire">
      <h2 className="ino-titre">Un territoire qui se mobilise</h2>
      <p className="ino-mots ino-mots-vert">Collectivités · Associations · Entreprises · Habitants</p>
      <h3 className="ino-etiquette">Communes partenaires du Challenge</h3>
      <ul className="ino-tuiles ino-tuiles-communes">
        {communesAffichees().flatMap((n) => [
          // Saut de ligne : ligne 1 = Côte Landes Nature, ligne 2 = MACS.
          n === PREMIERE_COMMUNE_MACS && <li key="saut" className="ino-saut" aria-hidden="true" />,
          logosPartenaires[n] ? <Tuile key={n} nom={n} /> : <li key={n} className="ino-tuile ino-tuile-texte">{n}</li>,
        ])}
      </ul>
      <h3 className="ino-etiquette">Points de collecte et partenaires</h3>
      <ul className="ino-tuiles ino-tuiles-autres">
        {autres.filter((n) => logosPartenaires[n]).map((n) => <Tuile key={n} nom={n} />)}
      </ul>
      {sansLogo.length > 0 && <p className="ino-et-aussi">{sansLogo.join(' · ')}</p>}
    </div>
  )
}

function Defi({ step }) {
  return (
    <div className="ino-centre ino-sombre">
      <R n={1} step={step} className="ino-etape"><p className="ino-phrase-claire">Et pour le vérifier…</p></R>
      <R n={2} step={step}><p className="ino-titre-clair">Nous nous sommes lancé un défi.</p></R>
      <R n={3} step={step} className="ino-500"><p>500 KG</p></R>
      <R n={4} step={step}>
        <p className="ino-sous-clair">de matériel informatique collectés en un mois ?</p>
        <p className="ino-dates">1er septembre → 3 octobre 2026</p>
      </R>
    </div>
  )
}

function Lancer({ onLancer, lance }) {
  return (
    <div className="ino-centre ino-sombre">
      <p className="ino-objectif">OBJECTIF : {challenge.target} KG</p>
      <button type="button" className="ino-lancer" onClick={onLancer} disabled={lance} tabIndex={-1}
        onMouseDown={(e) => e.preventDefault()}>
        Lancer le décompte
      </button>
      <p className="ino-aide">Entrée ou Espace</p>
    </div>
  )
}

function Final({ step }) {
  const mots = ['COLLECTER', 'RÉEMPLOYER', 'TRANSMETTRE']
  return (
    <div className="ino-centre ino-final">
      <R n={1} step={step}><h2 className="ino-titre-xl">Ce n’est que le début.</h2></R>
      <ul className="ino-quatre">
        {mots.map((m, i) => (
          <li key={m}><R n={2} step={step} delai={i * 280}>{m}</R></li>
        ))}
      </ul>
      <R n={3} step={step} className="ino-construire">
        <p className="ino-construire-mot">CONSTRUIRE ENSEMBLE</p>
        <p className="ino-construire-suite">autour d’une dynamique locale</p>
      </R>
      <R n={4} step={step} className="ino-merci">
        <p>Merci à toutes celles et ceux<br />qui font vivre Ressources.</p>
        <div className="ino-pied">
          <img src="/logos/logo-ressources-288.webp" alt="Ressources" />
          <span>www.ressourcesrecyclerie.fr</span>
        </div>
      </R>
    </div>
  )
}

export default function Inauguration() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [pos, setPos] = useState(() => {
    const i = slideInitiale(params.get('slide'))
    // Ouverture sur une slide précise (F5, lien direct) : tout est déjà révélé.
    let memo = null
    try { memo = sessionStorage.getItem(CLE) } catch { /* stockage indisponible */ }
    return { i, step: params.get('slide') || memo ? SLIDES[i].steps : 1 }
  })
  const [plein, setPlein] = useState(false)
  const [lance, setLance] = useState(false)
  const [fondu, setFondu] = useState(false)
  const posRef = useRef(pos)
  posRef.current = pos

  // L'étape courante vit dans l'URL (?slide=…) et le sessionStorage : F5 ne
  // renvoie pas au début, et l'adresse permet de revenir à une slide précise.
  useEffect(() => {
    const id = SLIDES[pos.i].id
    try { sessionStorage.setItem(CLE, id) } catch { /* sans incidence */ }
    if (params.get('slide') !== id) setParams({ slide: id }, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos.i])

  // Le chunk de /defi est chargé d'avance : la bascule ne coûte aucun réseau.
  useEffect(() => { import('./Defi') }, [])

  const lancer = useCallback(() => {
    if (lance) return
    setLance(true)
    setFondu(true)
    setTimeout(() => navigate('/defi'), 450)
  }, [lance, navigate])

  const suivant = useCallback(() => {
    const { i, step } = posRef.current
    if (SLIDES[i].id === 'lancer') { lancer(); return }
    if (step < SLIDES[i].steps) setPos({ i, step: step + 1 })
    else if (i < SLIDES.length - 1) setPos({ i: i + 1, step: 1 })
  }, [lancer])

  const precedent = useCallback(() => {
    const { i, step } = posRef.current
    if (step > 1) setPos({ i, step: step - 1 })
    else if (i > 0) setPos({ i: i - 1, step: SLIDES[i - 1].steps })
  }, [])

  const basculerPleinEcran = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.()
    else document.documentElement.requestFullscreen?.().catch(() => {})
  }, [])

  useEffect(() => {
    const surChangement = () => setPlein(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', surChangement)
    return () => document.removeEventListener('fullscreenchange', surChangement)
  }, [])

  useEffect(() => {
    const touche = (e) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown' || e.key === 'Enter') {
        e.preventDefault()
        if (!e.repeat) suivant()
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        if (!e.repeat) precedent()
      } else if (e.key === 'f' || e.key === 'F') {
        basculerPleinEcran()
      }
    }
    window.addEventListener('keydown', touche)
    return () => window.removeEventListener('keydown', touche)
  }, [suivant, precedent, basculerPleinEcran])

  const { i, step } = pos
  const slide = SLIDES[i]
  const pasDeFocus = { tabIndex: -1, onMouseDown: (e) => e.preventDefault() }

  return (
    <div className={`ino ino-s-${slide.id}${plein ? ' ino-plein' : ''}`}>
      <Helmet>
        <title>Inauguration — Ressources</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Helmet>

      <div className="ino-slide" key={slide.id}>
        {slide.id === 'accueil' && <Accueil />}
        {slide.id === 'ressources' && <Ressources />}
        {slide.id === 'dynamiques' && <Dynamiques step={step} />}
        {slide.id === 'territoire' && <Territoire />}
        {slide.id === 'defi' && <Defi step={step} />}
        {slide.id === 'lancer' && <Lancer onLancer={lancer} lance={lance} />}
        {slide.id === 'final' && <Final step={step} />}
      </div>

      <button type="button" className="ino-nav ino-prec" onClick={precedent} aria-label="Précédent" {...pasDeFocus}>‹</button>
      <button type="button" className="ino-nav ino-suiv" onClick={suivant} aria-label="Suivant" {...pasDeFocus}>›</button>
      <div className="ino-compte" aria-hidden="true">{i + 1} / {SLIDES.length}</div>
      {!plein && (
        <button type="button" className="ino-plein-btn" onClick={basculerPleinEcran} aria-label="Plein écran (touche F)" {...pasDeFocus}>⛶</button>
      )}
      <div className={`ino-fondu${fondu ? ' ino-on' : ''}`} aria-hidden="true" />
    </div>
  )
}
