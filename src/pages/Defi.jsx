import { useCallback, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  SOUND_ENABLED, challenge, collectionPoints, communes, partners,
} from '../data/defiConfig'
import Confetti from '../defi/Confetti'
import Jauge from '../defi/Jauge'
import Operateur, { BarreOperateur, DialoguePin } from '../defi/Operateur'
import { nombreFr, total } from '../defi/store'
import { useDefiStore } from '../defi/useDefiStore'
import { applaudissements, atténuerMusique, basculerMusique, fanfare } from '../defi/son'
import '../defi/defi.css'

// Interface de projection du 3 octobre 2026 — https://www.ressourcesrecyclerie.fr/defi
//
// Page volontairement hors du site : ni menu, ni lien, ni sitemap, ni
// prérendu, noindex (balise ici + en-tête X-Robots-Tag dans vercel.json).
// Tout se passe dans le navigateur : une fois chargée, elle n'appelle plus
// le réseau. L'état vit dans le localStorage de l'ordinateur qui projette.

const CLE_SESSION = 'ressources.defi.operateur'
const easing = (p) => (p < 0.5 ? 4 * p * p * p : 1 - ((-2 * p + 2) ** 3) / 2)
const jourMois = (iso) => iso.slice(5).split('-').reverse().join('/')

const Feuille = ({ className }) => (
  <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
    <path d="M14 106C14 50 52 14 106 14c0 56-36 92-92 92Z" fill="currentColor" />
    <path d="M14 106 78 42" stroke="#F7F1E3" strokeWidth="4" strokeLinecap="round" opacity=".55" />
  </svg>
)

function Pastille({ children }) {
  return <li className="dfi-pill">{children}</li>
}

export default function Defi() {
  const store = useDefiStore()
  const { etat, evt, busy, setBusy, a } = store
  const cible = challenge.target

  const [valeur, setValeur] = useState(() => total(etat))
  const valeurRef = useRef(valeur)
  const [pop, setPop] = useState(null)
  const [celeb, setCeleb] = useState(null) // null | 'atteint' | 'continue'
  const [pulse, setPulse] = useState(false)
  const [operateur, setOperateur] = useState(() => {
    try { return sessionStorage.getItem(CLE_SESSION) === '1' } catch { return false }
  })
  const [panneau, setPanneau] = useState(false)
  const [demandePin, setDemandePin] = useState(false)
  const [plein, setPlein] = useState(false)
  const [barre, setBarre] = useState(true)
  const [musique, setMusique] = useState('off') // 'on' | 'off' | 'erreur'
  const lancerMusique = useCallback(() => basculerMusique().then(setMusique), [])

  const confetti = useRef(null)
  const marqueur = useRef(null)
  const raf = useRef(0)
  const timers = useRef([])
  const animActive = useRef(false)
  const celebActive = useRef(false)

  const majBusy = useCallback(() => setBusy(animActive.current || celebActive.current), [setBusy])
  const apres = (ms, fn) => { timers.current.push(setTimeout(fn, ms)) }

  const celebrer = useCallback(() => {
    celebActive.current = true
    majBusy()
    setCeleb('atteint')
    setPulse(true)
    const r = marqueur.current?.getBoundingClientRect()
    confetti.current?.burst(r ? r.left + r.width / 2 : window.innerWidth * 0.75, r ? r.top + r.height / 2 : 300)
    confetti.current?.rain(3200)
    if (SOUND_ENABLED) { fanfare(); applaudissements(); atténuerMusique(true) }
    apres(2300, () => setCeleb('continue'))
    apres(2600, () => setPulse(false))
    apres(4600, () => { setCeleb(null); celebActive.current = false; majBusy() })
    apres(6500, () => atténuerMusique(false))
  }, [majBusy])

  // Chaque événement du store (ajout, retour, correction…) lance UNE animation
  // qui pilote à la fois le compteur et la jauge.
  useEffect(() => {
    if (!evt.n) return undefined
    cancelAnimationFrame(raf.current)
    const de = valeurRef.current
    const vers = evt.vers
    if (evt.kind === 'avance' && evt.delta > 0) {
      setPop({ n: evt.n, texte: `+ ${nombreFr(evt.delta, evt.delta % 1 ? 1 : 0)} kg` })
      apres(3800, () => setPop((p) => (p && p.n === evt.n ? null : p)))
    }
    if (de === vers) return undefined
    const ecart = Math.abs(vers - de)
    const duree = evt.kind === 'avance' ? Math.min(2500, Math.max(1500, 1400 + ecart * 12)) : 900
    const t0 = performance.now()
    let franchi = false
    animActive.current = true
    majBusy()
    const pas = (now) => {
      const p = Math.min(1, (now - t0) / duree)
      const v = p >= 1 ? vers : de + (vers - de) * easing(p)
      valeurRef.current = v
      setValeur(v)
      if (evt.cross && !franchi && v >= cible) { franchi = true; celebrer() }
      if (p < 1) raf.current = requestAnimationFrame(pas)
      else { animActive.current = false; majBusy() }
    }
    raf.current = requestAnimationFrame(pas)
    return () => cancelAnimationFrame(raf.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evt.n])

  useEffect(() => () => { timers.current.forEach(clearTimeout); cancelAnimationFrame(raf.current) }, [])

  /* ---------- Plein écran, clavier, accès opérateur ---------- */

  const basculerPleinEcran = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.()
    else document.documentElement.requestFullscreen?.().catch(() => {})
  }, [])

  useEffect(() => {
    const surChangement = () => setPlein(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', surChangement)
    return () => document.removeEventListener('fullscreenchange', surChangement)
  }, [])

  const ouvrirOperateur = useCallback(() => {
    if (operateur) setPanneau((p) => !p)
    else setDemandePin(true)
  }, [operateur])

  useEffect(() => {
    const touche = (e) => {
      const saisie = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName)
      if (e.ctrlKey && e.altKey && (e.code === 'KeyO' || e.key?.toLowerCase() === 'o')) {
        e.preventDefault()
        ouvrirOperateur()
        return
      }
      if (saisie || e.ctrlKey || e.altKey || e.metaKey) return
      if (e.key === 'f' || e.key === 'F') { basculerPleinEcran(); return }
      if (!operateur) return
      if (e.key === 'm' || e.key === 'M') { lancerMusique(); return }
      if (e.key === 'b' || e.key === 'B') { setBarre((b) => !b); return }
      if (e.key === 'ArrowRight') { e.preventDefault(); a.suivante() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); a.precedente() }
    }
    window.addEventListener('keydown', touche)
    return () => window.removeEventListener('keydown', touche)
  }, [operateur, ouvrirOperateur, basculerPleinEcran, lancerMusique, a])

  // Quintuple clic sur le logo : accès de secours si Ctrl+Alt+O est indisponible
  // (certains claviers AZERTY traitent Ctrl+Alt comme AltGr).
  const clics = useRef([])
  const surLogo = () => {
    const now = Date.now()
    clics.current = [...clics.current.filter((t) => now - t < 2500), now]
    if (clics.current.length >= 5) { clics.current = []; ouvrirOperateur() }
  }

  const deverrouiller = () => {
    try { sessionStorage.setItem(CLE_SESSION, '1') } catch { /* tant pis */ }
    setOperateur(true)
    setDemandePin(false)
    setBarre(true)
  }
  const verrouiller = () => {
    try { sessionStorage.removeItem(CLE_SESSION) } catch { /* idem */ }
    setOperateur(false)
    setPanneau(false)
  }

  const essaiObjectif = () => {
    if (celebActive.current) return
    celebrer()
  }

  /* ---------- Affichage ---------- */

  const decimales = etat.entries.slice(0, etat.revele).some((e) => e.poids % 1) ? 1 : 0
  const atteint = valeur >= cible
  const surplus = Math.max(valeur - cible, 0)
  const pourcent = Math.min(99, Math.floor((valeur / cible) * 100))
  const vide = etat.revele === 0 && valeur === 0

  return (
    <div className={`dfi${plein ? ' dfi-plein' : ''}${operateur && barre && !panneau ? ' dfi-avec-barre' : ''}`}>
      <Helmet>
        <title>Défi territorial de collecte informatique — Ressources</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Helmet>

      <Feuille className="dfi-deco dfi-deco-a" />
      <Feuille className="dfi-deco dfi-deco-b" />

      <header className="dfi-entete">
        <button type="button" className="dfi-logo" onClick={surLogo} tabIndex={-1} aria-label="Ressources">
          <img src="/logos/logo-ressources-288.webp" alt="" />
        </button>
        <div>
          <h1>Défi territorial de collecte informatique</h1>
          <p>Une mobilisation collective du 1er septembre au 3 octobre</p>
        </div>
        {celeb && (
          <div className="dfi-celebration" role="status" key={celeb}>
            {celeb === 'atteint' ? 'OBJECTIF ATTEINT !' : 'ET ON CONTINUE !'}
          </div>
        )}
      </header>

      <main className="dfi-centre">
        <aside className="dfi-infos" aria-label="Le défi en bref">
          <div><span>Objectif</span><b>{cible} kg</b></div>
          <div><span>Période</span><b>{jourMois(challenge.startDate)} → {jourMois(challenge.endDate)}</b></div>
          <div><span>Mobilisation</span><b>Collective</b></div>
        </aside>

        <section className="dfi-compteur" aria-live="polite">
          <div className="dfi-nombre">{nombreFr(valeur, decimales)}</div>
          <div className="dfi-unite">kg {valeur < 2 ? 'collecté' : 'collectés'}</div>
          <div className="dfi-statut">
            {vide && <span>Le défi commence ici.</span>}
            {!vide && !atteint && <span>{pourcent} % de l’objectif</span>}
            {atteint && (
              <>
                <strong>Objectif atteint</strong>
                {surplus > 0 && <span>+ {nombreFr(surplus, decimales)} kg au-delà de l’objectif</span>}
              </>
            )}
          </div>
        </section>

        <div className="dfi-pop-zone">
          {pop && <div className="dfi-pop" key={pop.n}>{pop.texte}</div>}
        </div>
      </main>

      <Jauge valeur={valeur} pulse={pulse} ref={marqueur} />

      <section className="dfi-territoire">
        <div className="dfi-territoire-tete">
          <h2>Mobilisation du territoire</h2>
          <p>
            {etat.merci
              ? 'Merci à toutes les communes, partenaires, points de collecte et habitants mobilisés.'
              : 'Un défi porté collectivement par les acteurs du territoire'}
          </p>
        </div>
        <div className="dfi-colonnes">
          <div className="dfi-carte dfi-carte-communes">
            <h3>Communes partenaires</h3>
            <ul>{communes.map((c) => <Pastille key={c}>{c}</Pastille>)}</ul>
          </div>
          <div className="dfi-carte">
            <h3>Entreprises, associations et organismes partenaires</h3>
            <ul>{[...collectionPoints, ...partners].map((c) => <Pastille key={c}>{c}</Pastille>)}</ul>
          </div>
        </div>
      </section>

      {!plein && (
        <button type="button" className="dfi-discret" onClick={basculerPleinEcran} aria-label="Plein écran (touche F)">⛶</button>
      )}

      <Confetti ref={confetti} />
      {operateur && barre && !panneau && <BarreOperateur store={store} onPanneau={() => setPanneau(true)} musique={musique} onMusique={lancerMusique} />}
      {demandePin && <DialoguePin onOk={deverrouiller} onFermer={() => setDemandePin(false)} />}
      {operateur && panneau && (
        <Operateur
          store={store}
          onFermer={() => setPanneau(false)}
          onVerrouiller={verrouiller}
          onEssaiObjectif={essaiObjectif}
          onPleinEcran={basculerPleinEcran}
        />
      )}
    </div>
  )
}
