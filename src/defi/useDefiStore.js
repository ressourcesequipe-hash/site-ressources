import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { demoCollectes, paliers } from '../data/defiConfig'
import {
  CLE, charger, debutGroupe, etatInitial, finGroupe, lireHist, nouvelId, normaliserListe, palierAtteint, sauver, sauverHist, total,
} from './store'

// Toute modification passe par `commit`, qui : recalcule le drapeau « 500 kg
// déjà célébrés », sauvegarde, garde un instantané pour « Annuler », et
// émet un événement `evt` que l'écran consomme pour animer.
//
// kind : 'avance' (ajout / collecte suivante : peut célébrer),
//        'autre'  (retour, correction, suppression… : anime sans célébrer),
//        'meta'   (ne touche pas au cumul : aucune animation).

export function useDefiStore() {
  const [etat, setEtat] = useState(charger)
  const etatRef = useRef(etat)
  const histRef = useRef(lireHist())
  const [histLen, setHistLen] = useState(histRef.current.length)
  const [evt, setEvt] = useState({ n: 0 })
  const evtN = useRef(0)
  const busyRef = useRef(false)
  const [busy, setBusyState] = useState(false)

  const setBusy = useCallback((b) => { busyRef.current = b; setBusyState(b) }, [])

  const commit = useCallback((suivant, kind, { historique = true } = {}) => {
    const prec = etatRef.current
    const de = total(prec)
    const vers = total(suivant)
    let palier = suivant.palier
    let cross = null
    if (kind !== 'meta') {
      if (kind === 'avance') {
        // Paliers franchis par cette étape : on ne célèbre que le plus haut.
        const franchis = paliers.filter((p) => p.kg > prec.palier && de < p.kg && vers >= p.kg)
        cross = franchis.length ? franchis[franchis.length - 1] : null
        palier = Math.max(prec.palier, cross ? cross.kg : 0)
      } else {
        palier = palierAtteint(vers)
      }
    }
    const final = { ...suivant, palier }
    if (historique) {
      histRef.current = [...histRef.current, prec].slice(-30)
      sauverHist(histRef.current)
      setHistLen(histRef.current.length)
    }
    etatRef.current = final
    sauver(final)
    setEtat(final)
    if (kind !== 'meta') {
      evtN.current += 1
      setEvt({ n: evtN.current, kind, de, vers, delta: Math.round((vers - de) * 10) / 10, cross })
    }
  }, [])

  // Une autre fenêtre de ce navigateur a modifié l'état : on la suit.
  useEffect(() => {
    const suivre = (e) => {
      if (e.key !== CLE) return
      const s = charger()
      commit(s, 'autre', { historique: false })
    }
    window.addEventListener('storage', suivre)
    return () => window.removeEventListener('storage', suivre)
  }, [commit])

  const a = useMemo(() => ({
    // Mode A : saisie manuelle, affichée tout de suite.
    ajouter({ date, poids }) {
      if (busyRef.current) return
      const s = etatRef.current
      const entries = [...s.entries]
      entries.splice(s.revele, 0, { id: nouvelId(), date, poids })
      commit({ ...s, entries, revele: s.revele + 1 }, 'avance')
    },
    // Mode B : préparée, non affichée, rangée par date dans la suite à venir.
    preparer({ date, poids }) {
      const s = etatRef.current
      const tete = s.entries.slice(0, s.revele)
      const queue = [...s.entries.slice(s.revele), { id: nouvelId(), date, poids }]
        .sort((x, y) => x.date.localeCompare(y.date))
      commit({ ...s, entries: [...tete, ...queue] }, 'meta')
    },
    // Une semaine (lundi → dimanche) d'un coup : c'est le pas du déroulé.
    suivante() {
      const s = etatRef.current
      if (busyRef.current || s.revele >= s.entries.length) return
      commit({ ...s, revele: finGroupe(s.entries, s.revele) }, 'avance')
    },
    precedente() {
      const s = etatRef.current
      if (busyRef.current || s.revele <= 0) return
      commit({ ...s, revele: debutGroupe(s.entries, s.revele - 1) }, 'autre')
    },
    // Pas fin, collecte par collecte (panneau).
    suivanteUne() {
      const s = etatRef.current
      if (busyRef.current || s.revele >= s.entries.length) return
      commit({ ...s, revele: s.revele + 1 }, 'avance')
    },
    precedenteUne() {
      const s = etatRef.current
      if (busyRef.current || s.revele <= 0) return
      commit({ ...s, revele: s.revele - 1 }, 'autre')
    },
    modifier(id, { date, poids }) {
      const s = etatRef.current
      const entries = s.entries.map((e) => (e.id === id ? { ...e, date, poids } : e))
      commit({ ...s, entries }, 'autre')
    },
    supprimer(id) {
      const s = etatRef.current
      const i = s.entries.findIndex((e) => e.id === id)
      if (i < 0) return
      const entries = s.entries.filter((e) => e.id !== id)
      commit({ ...s, entries, revele: i < s.revele ? s.revele - 1 : s.revele }, 'autre')
    },
    annuler() {
      if (busyRef.current || !histRef.current.length) return
      const snap = histRef.current[histRef.current.length - 1]
      histRef.current = histRef.current.slice(0, -1)
      sauverHist(histRef.current)
      setHistLen(histRef.current.length)
      commit(snap, 'autre', { historique: false })
    },
    // Revient à 0 kg en gardant les collectes préparées.
    recommencer() {
      const s = etatRef.current
      commit({ ...s, revele: 0, palier: 0 }, 'autre')
    },
    // Repart du fichier src/data/defiCollectes.json.
    restaurerFichier() { commit(etatInitial(), 'autre') },
    chargerDemo() {
      const entries = normaliserListe(demoCollectes)
      commit({ entries, revele: 0, palier: 0, merci: false }, 'autre')
    },
    // Renvoie un message d'erreur, ou null si tout va bien.
    importer(texte) {
      let brut
      try { brut = JSON.parse(texte) } catch { return 'JSON illisible.' }
      const liste = Array.isArray(brut) ? brut : brut?.entries
      const entries = normaliserListe(liste)
      if (!Array.isArray(liste) || entries.length !== liste.length) {
        return 'Chaque ligne doit avoir une date valide et un poids supérieur à 0.'
      }
      const s = etatRef.current
      commit({ ...s, entries, revele: Math.min(s.revele, entries.length) }, 'autre')
      return null
    },
    basculerMerci() {
      const s = etatRef.current
      commit({ ...s, merci: !s.merci }, 'meta')
    },
  }), [commit])

  return { etat, evt, busy, setBusy, histLen, a }
}
