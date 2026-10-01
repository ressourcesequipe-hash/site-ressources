// Logique pure de l'interface de projection : validation, calcul, stockage.
//
// L'état est une LISTE de collectes + un curseur `revele` (combien sont
// visibles à l'écran). Le cumul est toujours recalculé depuis cette liste :
// on peut donc corriger, supprimer, revenir en arrière, ou préparer toutes
// les collectes à l'avance et les révéler une à une.

import { ECHELLE_PLEINE, challenge, paliers } from '../data/defiConfig'
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

// Plus haut palier atteint par un cumul (0 si aucun).
export const palierAtteint = (v) => paliers.reduce((m, p) => (v >= p.kg ? Math.max(m, p.kg) : m), 0)

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

// Géométrie de la flèche pour un cumul v : { f, pos } (fractions de 0 à 1).
//   f   = position du repère « objectif » ;
//   pos = bord avant du remplissage.
//
// Jusqu'à l'objectif, le repère reste aux 3/4 et le remplissage avance vers lui.
// Au-delà, la flèche se recompose : le repère glisse vers la gauche (de 3/4 à
// 1/3) pendant que le remplissage gagne le bout de la flèche, qui est entière-
// ment pleine à ECHELLE_PLEINE kg et le reste ensuite. Le carré de u adoucit le
// départ du glissement : le remplissage ne recule ainsi jamais.
export const PART_OBJECTIF = 0.75
export const PART_FINALE = 1 / 3
export function geometrie(v, cible = challenge.target) {
  if (v <= 0) return { f: PART_OBJECTIF, pos: 0 }
  if (v <= cible) return { f: PART_OBJECTIF, pos: PART_OBJECTIF * (v / cible) }
  const u = Math.min(1, (v - cible) / (ECHELLE_PLEINE - cible))
  const f = PART_OBJECTIF - (PART_OBJECTIF - PART_FINALE) * u * u
  return { f, pos: f + (1 - f) * u }
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
  palier: 0, // plus haut palier déjà célébré (kg)
  merci: false,
})

function validerEtat(s) {
  if (!s || typeof s !== 'object') return null
  const entries = normaliserListe(s.entries)
  const revele = Math.min(Math.max(parseInt(s.revele, 10) || 0, 0), entries.length)
  return { entries, revele, palier: Number(s.palier) || (s.celebre ? challenge.target : 0), merci: Boolean(s.merci) }
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

