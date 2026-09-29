import { useEffect, useRef, useState } from 'react'
import { PIN_HASH, challenge } from '../data/defiConfig'
import { dateFr, hashPin, lireDate, lirePoids, nombreFr, total } from './store'

/* ---------- Code PIN ---------- */

export function DialoguePin({ onOk, onFermer }) {
  const [pin, setPin] = useState('')
  const [erreur, setErreur] = useState('')
  const [essais, setEssais] = useState(0)
  const [bloqueJusque, setBloque] = useState(0)
  const champ = useRef(null)
  useEffect(() => { champ.current?.focus() }, [])

  const valider = async (e) => {
    e.preventDefault()
    if (Date.now() < bloqueJusque) { setErreur('Patientez quelques secondes.'); return }
    try {
      if ((await hashPin(pin.trim())) === PIN_HASH) { onOk(); return }
    } catch {
      setErreur('Le PIN exige une page en https ou en localhost.')
      return
    }
    const n = essais + 1
    setEssais(n)
    setPin('')
    if (n % 5 === 0) { setBloque(Date.now() + 30000); setErreur('Trop d’essais : attendez 30 secondes.') }
    else setErreur('Code incorrect.')
  }

  return (
    <div className="dfo-voile" onMouseDown={(e) => e.target === e.currentTarget && onFermer()}>
      <form className="dfo-pin" onSubmit={valider}>
        <h2>Accès opérateur</h2>
        <input
          ref={champ} type="password" inputMode="numeric" autoComplete="off"
          value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Code PIN" aria-label="Code PIN"
        />
        {erreur && <p className="dfo-erreur" role="alert">{erreur}</p>}
        <div className="dfo-ligne">
          <button type="submit" className="dfo-btn dfo-primaire">Ouvrir</button>
          <button type="button" className="dfo-btn" onClick={onFermer}>Annuler</button>
        </div>
      </form>
    </div>
  )
}

/* ---------- Confirmation en deux temps ---------- */

function BoutonConfirme({ libelle, onConfirme, danger }) {
  const [attend, setAttend] = useState(false)
  useEffect(() => {
    if (!attend) return undefined
    const t = setTimeout(() => setAttend(false), 6000)
    return () => clearTimeout(t)
  }, [attend])
  if (!attend) {
    return <button type="button" className={`dfo-btn${danger ? ' dfo-danger' : ''}`} onClick={() => setAttend(true)}>{libelle}</button>
  }
  return (
    <span className="dfo-confirme">
      <b>Confirmer la remise à zéro ?</b>
      <button type="button" className="dfo-btn dfo-danger" onClick={() => { setAttend(false); onConfirme() }}>Oui</button>
      <button type="button" className="dfo-btn" onClick={() => setAttend(false)}>Non</button>
    </span>
  )
}

/* ---------- Formulaire date + poids ---------- */

function Saisie({ onAjouter, onPreparer, desactive }) {
  const [date, setDate] = useState('')
  const [poids, setPoids] = useState('')
  const [err, setErr] = useState('')

  const lire = () => {
    const d = lireDate(date)
    const p = lirePoids(poids)
    if (!date.trim()) return setErr('Date vide.') || null
    if (!d) return setErr('Date invalide (JJ/MM/AAAA).') || null
    if (!poids.trim()) return setErr('Poids vide.') || null
    if (!p) return setErr('Poids invalide : un nombre supérieur à 0.') || null
    setErr('')
    return { date: d, poids: p }
  }
  const vider = () => { setDate(''); setPoids('') }

  return (
    <section className="dfo-bloc">
      <h3>Enregistrement de collecte</h3>
      <div className="dfo-champs">
        <label>Date
          <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="JJ/MM/AAAA" inputMode="numeric" />
        </label>
        <label>Poids (kg)
          <input value={poids} onChange={(e) => setPoids(e.target.value)} placeholder="XX" inputMode="decimal" />
        </label>
      </div>
      {err && <p className="dfo-erreur" role="alert">{err}</p>}
      <div className="dfo-ligne">
        <button type="button" className="dfo-btn dfo-primaire" disabled={desactive}
          onClick={() => { const v = lire(); if (v) { onAjouter(v); vider() } }}>
          + Ajouter la collecte
        </button>
        <button type="button" className="dfo-btn" onClick={() => { const v = lire(); if (v) { onPreparer(v); vider() } }}>
          Préparer sans afficher
        </button>
      </div>
    </section>
  )
}

/* ---------- Ligne éditable ---------- */

function Ligne({ e, i, revelee, a }) {
  const [edit, setEdit] = useState(false)
  const [date, setDate] = useState(dateFr(e.date))
  const [poids, setPoids] = useState(String(e.poids).replace('.', ','))
  const [err, setErr] = useState('')

  if (!edit) {
    return (
      <tr className={revelee ? 'dfo-revelee' : ''}>
        <td>{i + 1}</td><td>{dateFr(e.date)}</td><td>{nombreFr(e.poids, e.poids % 1 ? 1 : 0)} kg</td>
        <td>{revelee ? 'affichée' : 'à venir'}</td>
        <td className="dfo-actions">
          <button type="button" onClick={() => setEdit(true)}>Corriger</button>
          <BoutonSupprimer onOk={() => a.supprimer(e.id)} />
        </td>
      </tr>
    )
  }
  const ok = () => {
    const d = lireDate(date)
    const p = lirePoids(poids)
    if (!d || !p) { setErr('Date ou poids invalide.'); return }
    a.modifier(e.id, { date: d, poids: p })
    setEdit(false)
  }
  return (
    <tr>
      <td>{i + 1}</td>
      <td><input value={date} onChange={(x) => setDate(x.target.value)} size={10} /></td>
      <td><input value={poids} onChange={(x) => setPoids(x.target.value)} size={5} /></td>
      <td colSpan={2} className="dfo-actions">
        <button type="button" onClick={ok}>Valider</button>
        <button type="button" onClick={() => setEdit(false)}>Annuler</button>
        {err && <span className="dfo-erreur">{err}</span>}
      </td>
    </tr>
  )
}

function BoutonSupprimer({ onOk }) {
  const [sur, setSur] = useState(false)
  useEffect(() => {
    if (!sur) return undefined
    const t = setTimeout(() => setSur(false), 4000)
    return () => clearTimeout(t)
  }, [sur])
  return sur
    ? <button type="button" className="dfo-rouge" onClick={onOk}>Sûr ?</button>
    : <button type="button" onClick={() => setSur(true)}>Supprimer</button>
}

/* ---------- Barre opérateur (sous la projection) ---------- */

const aujourdhui = () => {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

// Tout le déroulé du jour J sans ouvrir le panneau : compteur de collectes,
// précédente / suivante, et saisie de la collecte du jour (date du jour
// pré-remplie).
export function BarreOperateur({ store, onPanneau, musique, onMusique }) {
  const { etat, busy, a } = store
  const [date, setDate] = useState(aujourdhui)
  const [poids, setPoids] = useState('')
  const [err, setErr] = useState('')
  const prochaine = etat.entries[etat.revele]

  const ajouter = (e) => {
    e.preventDefault()
    const d = lireDate(date)
    const p = lirePoids(poids)
    if (!d) return setErr('Date invalide')
    if (!p) return setErr('Poids invalide')
    if (busy) return undefined
    setErr('')
    a.ajouter({ date: d, poids: p })
    setPoids('')
    return undefined
  }

  return (
    <div className="dfo-barre">
      <span className="dfo-compte">
        <b>{etat.revele}</b> / {etat.entries.length} collectes affichées
        {prochaine && <em> · suivante : {dateFr(prochaine.date)}, {nombreFr(prochaine.poids, prochaine.poids % 1 ? 1 : 0)} kg</em>}
      </span>
      <button type="button" className="dfo-btn" disabled={busy || etat.revele <= 0} onClick={a.precedente}>←</button>
      <button type="button" className="dfo-btn dfo-primaire" disabled={busy || !prochaine} onClick={a.suivante}>Suivante →</button>
      <form onSubmit={ajouter} className="dfo-barre-saisie">
        <input value={date} onChange={(e) => setDate(e.target.value)} aria-label="Date" size={10} placeholder="JJ/MM/AAAA" />
        <input value={poids} onChange={(e) => setPoids(e.target.value)} aria-label="Poids en kg" size={5} placeholder="kg" inputMode="decimal" />
        <button type="submit" className="dfo-btn dfo-primaire" disabled={busy}>+ Ajouter</button>
        {err && <span className="dfo-erreur">{err}</span>}
      </form>
      <button type="button" className="dfo-btn" onClick={onMusique} title="Touche M — fichier public/audio/fond.mp3">♪ {musique === 'on' ? 'Couper' : 'Musique'}</button>
      {musique === 'erreur' && <span className="dfo-erreur">Musique introuvable ou bloquée</span>}
      <button type="button" className="dfo-btn" onClick={onPanneau}>Panneau</button>
    </div>
  )
}

/* ---------- Panneau ---------- */

export default function Operateur({ store, onFermer, onVerrouiller, onEssaiObjectif, onPleinEcran }) {
  const { etat, busy, histLen, a } = store
  const [json, setJson] = useState('')
  const [msgJson, setMsgJson] = useState('')
  const prochaine = etat.entries[etat.revele]

  const jsonCourant = () =>
    JSON.stringify(etat.entries.map(({ id, date, poids }) => ({ id, date, poids })), null, 2)

  return (
    <aside className="dfo-panneau" aria-label="Panneau opérateur">
      <header>
        <h2>Opérateur</h2>
        <button type="button" className="dfo-btn" onClick={onFermer}>Fermer</button>
      </header>

      <section className="dfo-bloc">
        <h3>Déroulé</h3>
        <p className="dfo-info">
          {etat.revele} / {etat.entries.length} affichées · {nombreFr(total(etat), 1)} kg
          {prochaine && <> · suivante : {dateFr(prochaine.date)}, {nombreFr(prochaine.poids, prochaine.poids % 1 ? 1 : 0)} kg</>}
        </p>
        <div className="dfo-ligne">
          <button type="button" className="dfo-btn" disabled={busy || etat.revele <= 0} onClick={a.precedente}>← Précédente</button>
          <button type="button" className="dfo-btn dfo-primaire" disabled={busy || !prochaine} onClick={a.suivante}>Collecte suivante →</button>
        </div>
        <div className="dfo-ligne">
          <button type="button" className="dfo-btn" disabled={busy || !histLen} onClick={a.annuler}>
            Annuler la dernière action
          </button>
        </div>
      </section>

      <Saisie onAjouter={a.ajouter} onPreparer={a.preparer} desactive={busy} />

      <section className="dfo-bloc">
        <h3>Collectes ({etat.entries.length})</h3>
        {etat.entries.length === 0
          ? <p className="dfo-info">Aucune collecte. Saisissez-en ci-dessus, ou importez un JSON plus bas.</p>
          : (
            <div className="dfo-table">
              <table>
                <tbody>
                  {etat.entries.map((e, i) => <Ligne key={e.id + e.date + e.poids} e={e} i={i} revelee={i < etat.revele} a={a} />)}
                </tbody>
              </table>
            </div>
          )}
      </section>

      <section className="dfo-bloc">
        <h3>Écran</h3>
        <label className="dfo-case">
          <input type="checkbox" checked={etat.merci} onChange={a.basculerMerci} />
          Afficher le message de remerciement (écran final)
        </label>
        <div className="dfo-ligne">
          <button type="button" className="dfo-btn" onClick={onPleinEcran}>Plein écran (F)</button>
          <button type="button" className="dfo-btn" disabled={busy} onClick={onEssaiObjectif}>
            Tester l’animation {challenge.target} kg
          </button>
        </div>
      </section>

      <section className="dfo-bloc">
        <h3>Données (JSON)</h3>
        <div className="dfo-ligne">
          <button type="button" className="dfo-btn" onClick={() => { setJson(jsonCourant()); setMsgJson('') }}>Afficher</button>
          <button type="button" className="dfo-btn" onClick={() => navigator.clipboard?.writeText(jsonCourant())}>Copier</button>
        </div>
        <textarea value={json} onChange={(e) => setJson(e.target.value)} rows={6} spellCheck={false}
          placeholder='[{"date":"2026-09-03","poids":32}]' />
        <div className="dfo-ligne">
          <button type="button" className="dfo-btn" onClick={() => setMsgJson(a.importer(json) ?? 'Données appliquées.')}>Appliquer</button>
          {msgJson && <span className="dfo-info">{msgJson}</span>}
        </div>
      </section>

      <section className="dfo-bloc">
        <h3>Remise à zéro</h3>
        <div className="dfo-pile">
          <BoutonConfirme libelle="Revenir à 0 kg (garde les collectes)" onConfirme={a.recommencer} danger />
          <BoutonConfirme libelle="Restaurer les données du fichier" onConfirme={a.restaurerFichier} danger />
          <BoutonConfirme libelle="Charger la démonstration" onConfirme={a.chargerDemo} danger />
        </div>
      </section>

      <footer>
        <button type="button" className="dfo-btn" onClick={onVerrouiller}>Verrouiller</button>
        <p className="dfo-info">← → collecte précédente / suivante · F plein écran · Ctrl+Alt+O panneau</p>
      </footer>
    </aside>
  )
}
