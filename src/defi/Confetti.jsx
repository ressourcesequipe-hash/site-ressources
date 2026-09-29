import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

const COULEURS = ['#1F4D2E', '#4E8B3A', '#A9BFA0', '#F3E9D2', '#C8973A', '#E8B84A']

// Confettis et petites feuilles aux couleurs de Ressources. Le canvas ne
// tourne que tant qu'il reste des particules.
const Confetti = forwardRef(function Confetti(_, ref) {
  const canvas = useRef(null)
  const parts = useRef([])
  const raf = useRef(0)
  const pluie = useRef(0)

  const boucle = useRef(() => {})
  boucle.current = () => {
    const c = canvas.current
    if (!c) return
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, c.width, c.height)
    parts.current = parts.current.filter((p) => p.y < c.height + 40 && p.vie > 0)
    for (const p of parts.current) {
      p.vx *= 0.992
      p.vy += 0.28
      p.x += p.vx
      p.y += p.vy
      p.rot += p.vr
      p.vie -= 1
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.globalAlpha = Math.min(1, p.vie / 40)
      ctx.fillStyle = p.couleur
      if (p.feuille) {
        ctx.beginPath()
        ctx.ellipse(0, 0, p.t * 1.1, p.t * 0.5, 0, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.fillRect(-p.t / 2, -p.t / 4, p.t, p.t / 2)
      }
      ctx.restore()
    }
    raf.current = parts.current.length || pluie.current ? requestAnimationFrame(boucle.current) : 0
  }

  const lancer = () => { if (!raf.current) raf.current = requestAnimationFrame(boucle.current) }

  useEffect(() => {
    const ajuster = () => {
      const c = canvas.current
      if (c) { c.width = window.innerWidth; c.height = window.innerHeight }
    }
    ajuster()
    window.addEventListener('resize', ajuster)
    return () => { window.removeEventListener('resize', ajuster); cancelAnimationFrame(raf.current) }
  }, [])

  useImperativeHandle(ref, () => ({
    // Explosion depuis un point de l'écran.
    burst(x, y, n = 110) {
      const echelle = window.innerHeight / 1080
      for (let i = 0; i < n; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3
        const v = (7 + Math.random() * 12) * echelle
        parts.current.push({
          x, y, vx: Math.cos(angle) * v, vy: Math.sin(angle) * v,
          rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
          t: (10 + Math.random() * 12) * echelle, vie: 120 + Math.random() * 90,
          couleur: COULEURS[i % COULEURS.length], feuille: i % 3 === 0,
        })
      }
      lancer()
    },
    // Légère pluie d'en haut, pendant `ms` millisecondes.
    rain(ms = 2500) {
      const fin = performance.now() + ms
      const donner = () => {
        if (performance.now() > fin) { pluie.current = 0; return }
        const echelle = window.innerHeight / 1080
        for (let i = 0; i < 3; i++) {
          parts.current.push({
            x: Math.random() * window.innerWidth, y: -20,
            vx: (Math.random() - 0.5) * 2, vy: 1 + Math.random() * 3,
            rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.25,
            t: (9 + Math.random() * 10) * echelle, vie: 400,
            couleur: COULEURS[(Math.random() * COULEURS.length) | 0], feuille: Math.random() < 0.4,
          })
        }
        pluie.current = setTimeout(donner, 50)
      }
      pluie.current = 1
      donner()
      lancer()
    },
  }))

  return <canvas ref={canvas} className="dfi-confetti" aria-hidden="true" />
})

export default Confetti
