// Sons de la projection, entièrement synthétisés (aucun fichier, fonctionne
// hors connexion) + lecteur de musique de fond optionnel.
//
// Les navigateurs interdisent tout son avant un geste de l'utilisateur : la
// saisie du PIN opérateur en est un, donc le contexte audio est débloqué.

import { MUSIC_FILE, MUSIC_VOLUME } from '../data/defiConfig'

let ctx = null
let bruit = null
let sortie = null

function contexte() {
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return null
    ctx = new Ctx()
    sortie = ctx.createGain()
    sortie.gain.value = 0.9
    sortie.connect(ctx.destination)
    // 2 s de bruit blanc réutilisé pour chaque « claquement de mains ».
    bruit = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const d = bruit.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

function claquement(t, force) {
  const s = ctx.createBufferSource()
  s.buffer = bruit
  const f = ctx.createBiquadFilter()
  f.type = 'bandpass'
  f.frequency.value = 900 + Math.random() * 3200
  f.Q.value = 0.7 + Math.random() * 1.2
  const g = ctx.createGain()
  const pic = force * (0.25 + Math.random() * 0.75)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(pic, t + 0.004)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03 + Math.random() * 0.05)
  s.connect(f).connect(g).connect(sortie)
  s.start(t, Math.random() * 1.8, 0.12)
}

// Une salle qui applaudit : la densité monte vite, tient, puis retombe.
export function applaudissements(duree = 5.5) {
  const c = contexte()
  if (!c) return
  const t0 = c.currentTime + 0.05
  const total = Math.round(duree * 90)
  for (let i = 0; i < total; i++) {
    const x = Math.random()
    // densité en cloche : plus de claquements au milieu qu'aux bords
    const p = 0.5 + (x - 0.5) * (0.35 + 0.65 * Math.random())
    const t = t0 + Math.pow(p, 1.1) * duree
    const enveloppe = Math.sin(Math.PI * Math.min(1, Math.max(0, (t - t0) / duree))) ** 0.6
    claquement(t, 0.5 * (0.35 + 0.65 * enveloppe))
  }
}

// Petite fanfare montante (do–mi–sol–do) qui ouvre la célébration.
export function fanfare() {
  const c = contexte()
  if (!c) return
  const t0 = c.currentTime + 0.02
  ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
    const t = t0 + i * 0.14
    ;[1, 2].forEach((h) => {
      const o = c.createOscillator()
      const g = c.createGain()
      o.type = h === 1 ? 'triangle' : 'sine'
      o.frequency.value = f * h
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(h === 1 ? 0.22 : 0.07, t + 0.03)
      g.gain.exponentialRampToValueAtTime(0.0001, t + (i === 3 ? 1.4 : 0.5))
      o.connect(g).connect(sortie)
      o.start(t)
      o.stop(t + 1.5)
    })
  })
}

/* ---------- Musique de fond ---------- */

let audio = null
export const musiqueActive = () => Boolean(audio && !audio.paused)

// Renvoie true si la musique joue après l'appel, false si elle est coupée ou
// si le fichier est introuvable.
export async function basculerMusique() {
  if (musiqueActive()) { audio.pause(); return false }
  if (!audio) {
    audio = new Audio(MUSIC_FILE)
    audio.loop = true
    audio.volume = MUSIC_VOLUME
  }
  try {
    await audio.play()
    return true
  } catch {
    audio = null
    return false
  }
}

// Baisse la musique pendant la célébration pour laisser passer les applaudissements.
export function atténuerMusique(baisse) {
  if (!audio) return
  audio.volume = baisse ? MUSIC_VOLUME * 0.25 : MUSIC_VOLUME
}
