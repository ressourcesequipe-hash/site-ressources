import { useCallback, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  SOUND_ENABLED, challenge, collectionPoints, communes, partners,
} from '../data/defiConfig'
import Confetti from '../defi/Confetti'
import Fin from '../defi/Fin'
import Jauge from '../defi/Jauge'
import Operateur, { BarreOperateur } from '../defi/Operateur'
import { nombreFr, total } from '../defi/store'
import { useDefiStore } from '../defi/useDefiStore'
import { applaudissements, atténuerMusique, basculerSourdine, demarrerMusique, fanfare } from '../defi/son'
import '../defi/defi.css'

// Interface de projection du 3 octobre 2026 — https://www.ressourcesrecyclerie.fr/defi
//
// Page volontairement hors du site : ni menu, ni lien, ni sitemap, ni
// prérendu, noindex (balise ici + en-tête X-Robots-Tag dans vercel.json).
// Tout se passe dans le navigateur : une fois chargée, elle n'appelle plus
// le réseau. L'état vit dans le localStorage de l'ordinateur qui projette.

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
  const [panneau, setPanneau] = useState(false)
  const [plein, setPlein] = useState(false)
  const [barre, setBarre] = useState(true)
  const [fin, setFin] = useState(false)
  const [musique, setMusique] = useState('attente') // 'on' | 'attente' | 'erreur'
  const [sourdine, setSourdine] = useState(false)

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

  /* ---------- Musique de fond ---------- */

  // Elle démarre à l'ouverture de la page. Si le navigateur refuse le
  // démarrage automatique, elle démarre au premier clic ou à la première touche.
  const musiqueRef = useRef('attente')
  useEffect(() => {
    let actif = true
    const essayer = async () => {
      if (musiqueRef.current === 'on') return
      const r = await demarrerMusique()
      if (!actif) return
      musiqueRef.current = r
      setMusique(r)
    }
    essayer()
    window.addEventListener('pointerdown', essayer)
    window.addEventListener('keydown', essayer)
    return () => {
      actif = false
      window.removeEventListener('pointerdown', essayer)
      window.removeEventListener('keydown', essayer)
    }
  }, [])

  // Icône en haut à droite (et touche M) : sourdine / remise du son.
  const basculerSon = useCallback(async () => {
    if (musiqueRef.current !== 'on') {
      const r = await demarrerMusique()
      musiqueRef.current = r
      setMusique(r)
      return
    }
    setSourdine(basculerSourdine())
  }, [])

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

  const ouvrirOperateur = useCallback(() => setPanneau((pn) => !pn), [])

  useEffect(() => {
    const touche = (e) => {
      const saisie = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName)
      if (e.ctrlKey && e.altKey && (e.code === 'KeyO' || e.key?.toLowerCase() === 'o')) {
        e.preventDefault()
        ouvrirOperateur()
        return
      }
      if (saisie || e.ctrlKey || e.altKey || e.metaKey) return
      if (fin) return // écran de clôture ouvert : Échap le referme (géré dans Fin)
      // Touche O seule : même effet que Ctrl+Alt+O, pour les claviers où
      // Ctrl+Alt (= AltGr) est intercepté.
      if (e.key === 'o' || e.key === 'O') { ouvrirOperateur(); return }
      if (e.key === 'f' || e.key === 'F') { basculerPleinEcran(); return }
      if (e.key === 'm' || e.key === 'M') { basculerSon(); return }
      if (e.key === 'b' || e.key === 'B') { setBarre((b) => !b); return }
      if (e.key === 'ArrowRight') { e.preventDefault(); a.suivante() }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); a.precedente() }
    }
    window.addEventListener('keydown', touche)
    return () => window.removeEventListener('keydown', touche)
  }, [fin, ouvrirOperateur, basculerPleinEcran, basculerSon, a])


  const ouvrirFin = () => {
    setFin(true)
    confetti.current?.rain(2500)
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
    <div className={`dfi${plein ? ' dfi-plein' : ''}${barre && !panneau ? ' dfi-avec-barre' : ''}`}>
      <Helmet>
        <title>Défi territorial de collecte informatique — Ressources</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Helmet>

      <div className="dfi-filigrane" aria-hidden="true" />
      <Feuille className="dfi-deco dfi-deco-a" />
      <Feuille className="dfi-deco dfi-deco-b" />

      <header className="dfi-entete">
        <div className="dfi-logo">
          <img src="/logos/logo-ressources-288.webp" alt="Ressources" />
        </div>
        <div>
          <h1>Défi territorial de collecte informatique</h1>
          <p>Une mobilisation collective du 1er septembre au 3 octobre</p>
        </div>
        <button
          type="button" className="dfi-son" onClick={basculerSon}
          aria-label={sourdine || musique !== 'on' ? 'Remettre le son (M)' : 'Couper le son (M)'}
          title={musique === 'erreur' ? 'Musique introuvable' : 'Son (M)'}
        >
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <path d="M6 18h8l10-8v28l-10-8H6z" fill="currentColor" />
            {sourdine || musique !== 'on'
              ? <path d="M30 18l12 12M42 18L30 30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              : <path d="M31 17c3 4 3 10 0 14M37 12c6 7 6 17 0 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />}
          </svg>
        </button>
        {celeb && (
          <div className="dfi-celebration" role="status" key={celeb}>
            {celeb === 'atteint' ? 'OBJECTIF ATTEINT !' : 'ET ON CONTINUE !'}
          </div>
        )}
      </header>

      <main className="dfi-centre">
        <div aria-hidden="true" />

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
        <div className="dfi-discret">
          <button type="button" onClick={ouvrirOperateur} aria-label="Panneau opérateur (touche O)">⚙</button>
          <button type="button" onClick={basculerPleinEcran} aria-label="Plein écran (touche F)">⛶</button>
        </div>
      )}

      <Confetti ref={confetti} />
      {barre && !panneau && <BarreOperateur store={store} onPanneau={() => setPanneau(true)} onFin={ouvrirFin} />}
      {fin && <Fin totalKg={total(etat)} onFermer={() => setFin(false)} />}
      {panneau && (
        <Operateur
          store={store}
          onFermer={() => setPanneau(false)}
          onEssaiObjectif={essaiObjectif}
          onPleinEcran={basculerPleinEcran}
        />
      )}
    </div>
  )
}
