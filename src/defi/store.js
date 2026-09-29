// Logique pure de l'interface de projection : validation, calcul, stockage.
//
// L'état est une LISTE de collectes + un curseur `revele` (combien sont
// visibles à l'écran). Le cumul est toujours recalculé depuis cette liste :
// on peut donc corriger, supprimer, revenir en arrière, ou préparer toutes
// les collectes à l'avance et les révéler une à une.

import { challenge } from '../data/defiConfig'
import prepares from '../data/defiCollectes.json'

export const CLE = 'ressources.defi.v1'
export const CLE_HIST = 'ressources.defi.hist.v1'
const HIST_MAX = 30

export const arrondi = (n) => Math.round(n * 10) / 10

export const nouvelId = () =>
  (globalThis.crypto?.randomUUID?.() ?? `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`)

export function total(etat) {
  return arrondi(etat.entries.slice(0, etat.revele).reduce((s, e) => s + e.poids, 0))
}

/* ---------- Saisie ---------- */

// « 32 », « 32,5 », « 32.5 », « 32 kg » → nombre. null si invalide.
export function lirePoids(texte) {
  const m = String(texte ?? '').trim().match(/^(\d+(?:[.,]\d{1,2})?)\s*(?:kg)?$/i)
  if (!m) return null
  const n = arrondi(parseFloat(m[1].replace(',', '.')))
  return n > 0 && n <= 5000 ? n : null
}

// « JJ/MM/AAAA » (ou ISO) → « AAAA-MM-JJ ». null si la date n'existe pas.
export function lireDate(texte) {
  const t = String(texte ?? '').trim()
  let j, m, a
  let r = t.match(/^(\d{1,2})[/.\-\s](\d{1,2})[/.\-\s](\d{4})$/)
  if (r) [, j, m, a] = r
  else if ((r = t.match(/^(\d{4})-(\d{2})-(\d{2})$/))) [, a, m, j] = r
  else return null
  const d = new Date(Date.UTC(+a, +m - 1, +j))
  if (d.getUTCFullYear() !== +a || d.getUTCMonth() !== +m - 1 || d.getUTCDate() !== +j) return null
  return `${a}-${String(m).padStart(2, '0')}-${String(j).padStart(2, '0')}`
}

export const dateFr = (iso) => iso.split('-').reverse().join('/')

export const nombreFr = (n, decimales = 0) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: decimales, maximumFractionDigits: decimales }).format(n)

/* ---------- Semaines (lundi → dimanche) ---------- */

const JOUR = 86400000
const utc = (iso) => Date.parse(`${iso}T00:00:00Z`)
const iso = (ms) => new Date(ms).toISOString().slice(0, 10)

// Lundi de la semaine qui contient la date ISO.
export const debutSemaine = (date) => {
  const ms = utc(date)
  return iso(ms - ((new Date(ms).getUTCDay() + 6) % 7) * JOUR)
}
export const finSemaine = (date) => iso(utc(debutSemaine(date)) + 6 * JOUR)

// Fin (exclue) du groupe de la semaine qui commence à l'index `depuis`.
export function finGroupe(entries, depuis) {
  const semaine = debutSemaine(entries[depuis].date)
  let n = depuis
  while (n < entries.length && debutSemaine(entries[n].date) === semaine) n++
  return n
}

// Début du groupe de la semaine qui contient l'index `dernier`.
export function debutGroupe(entries, dernier) {
  const semaine = debutSemaine(entries[dernier].date)
  let n = dernier
  while (n > 0 && debutSemaine(entries[n - 1].date) === semaine) n--
  return n
}

// La prochaine semaine à révéler : { du, au, n, poids } ou null.
export function semaineSuivante(etat) {
  if (etat.revele >= etat.entries.length) return null
  const fin = finGroupe(etat.entries, etat.revele)
  const groupe = etat.entries.slice(etat.revele, fin)
  return {
    du: debutSemaine(groupe[0].date),
    au: finSemaine(groupe[0].date),
    n: groupe.length,
    poids: arrondi(groupe.reduce((s, e) => s + e.poids, 0)),
  }
}

/* ---------- Échelle de la jauge ---------- */

// Position (0..1) sur la flèche. Jusqu'à l'objectif : 75 % de la longueur.
// Au-delà : les 25 % restants, dont l'échelle s'élargit toute seule
// (800 kg au minimum, puis 125 % du total) sans jamais toucher au marqueur.
export const PART_OBJECTIF = 0.75
export function position(v, cible = challenge.target) {
  if (v <= 0) return 0
  if (v <= cible) return PART_OBJECTIF * (v / cible)
  const fin = Math.max(cible * 1.6, v * 1.25)
  return PART_OBJECTIF + (1 - PART_OBJECTIF) * Math.min(1, (v - cible) / (fin - cible))
}

/* ---------- Stockage ---------- */

function normaliser(e) {
  const date = lireDate(e?.date)
  const poids = typeof e?.poids === 'number' ? arrondi(e.poids) : lirePoids(e?.poids)
  if (!date || !poids || poids <= 0) return null
  return { id: typeof e.id === 'string' && e.id ? e.id : nouvelId(), date, poids }
}

export function normaliserListe(liste) {
  return (Array.isArray(liste) ? liste : []).map(normaliser).filter(Boolean)
}

export const etatInitial = () => ({
  entries: normaliserListe(prepares),
  revele: 0,
  celebre: false,
  merci: false,
})

function validerEtat(s) {
  if (!s || typeof s !== 'object') return null
  const entries = normaliserListe(s.entries)
  const revele = Math.min(Math.max(parseInt(s.revele, 10) || 0, 0), entries.length)
  return { entries, revele, celebre: Boolean(s.celebre), merci: Boolean(s.merci) }
}

export function charger() {
  try {
    const brut = localStorage.getItem(CLE)
    if (brut) return validerEtat(JSON.parse(brut)) ?? etatInitial()
  } catch { /* stockage indisponible : on repart du fichier */ }
  return etatInitial()
}

export function sauver(etat) {
  try { localStorage.setItem(CLE, JSON.stringify(etat)) } catch { /* plein ou bloqué */ }
}

export function lireHist() {
  try { return JSON.parse(localStorage.getItem(CLE_HIST) || '[]').map(validerEtat).filter(Boolean) } catch { return [] }
}

export function sauverHist(h) {
  try { localStorage.setItem(CLE_HIST, JSON.stringify(h.slice(-HIST_MAX))) } catch { /* idem */ }
}

