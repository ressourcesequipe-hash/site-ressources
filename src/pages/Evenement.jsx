import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import { useReveal } from '../hooks/useReveal'

const eventSchema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Événement de lancement — Association Ressources · Tombola solidaire & Challenge collecte',
  startDate: '2026-10-03T10:00:00+02:00',
  endDate: '2026-10-03T18:00:00+02:00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'Vielle-Saint-Girons — 80 allée des Cigales',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '80 allée des Cigales',
      addressLocality: 'Vielle-Saint-Girons',
      postalCode: '40560',
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.9516,
      longitude: -1.3019,
    },
  },
  description: "Journée de lancement de l'association Ressources — recyclerie informatique et végétale solidaire dans les Landes. Challenge collecte 1/2 tonne de matériel informatique, tombola solidaire avec plus de 30 lots offerts par les partenaires locaux, festivités à Vielle-Saint-Girons (40560).",
  image: 'https://www.association-ressources.fr/logo.png',
  organizer: {
    '@type': 'NGO',
    name: 'Association Ressources',
    url: 'https://www.association-ressources.fr',
    email: 'contact@ressourcesrecyclerie.fr',
  },
  offers: {
    '@type': 'Offer',
    name: 'Billets de tombola solidaire',
    url: 'https://www.helloasso.com/associations/ressources-association/evenements/evenement-ressources-tirage-public-de-la-tombola',
    availability: 'https://schema.org/InStock',
    validFrom: '2026-09-01',
  },
  keywords: 'tombola solidaire Landes, recyclerie informatique, réemploi numérique, Vielle-Saint-Girons',
}

export default function Evenement() {
  const [heroVisible, setHeroVisible] = useState(false)
  const tombola = useReveal()
  const challenge = useReveal()
  const inscription = useReveal()

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <Layout>
      <SEO
        title="Lancement Recyclerie Solidaire Landes — 03 octobre 2026 | Ressources"
        description="Rejoignez le lancement de l'association Ressources le 03 octobre 2026 à Vielle-Saint-Girons (Landes). Challenge collecte 1/2 tonne de matériel, tombola solidaire avec plus de 30 lots, festivités."
        canonical="/evenement-lancement-03-octobre-2026/"
        type="event"
        schema={eventSchema}
      />

      {/* Hero événement */}
      <section className="bg-kaki text-white py-16 md:py-28 relative overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-kaki-dark via-kaki to-kaki-light/20" aria-hidden />
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-ocre/5 rounded-tl-full blur-3xl" />
          <div className="absolute left-0 top-0 w-64 h-64 bg-white/[0.02] rounded-br-full" />
          <div className="absolute right-20 top-20 w-80 h-80 border border-ocre/10 rounded-full animate-spin-slow" />
          <div className="absolute right-32 top-32 w-48 h-48 border border-white/5 rounded-full animate-[spin_50s_linear_infinite_reverse]" />
          <div className="absolute top-16 left-[40%] w-2 h-2 rounded-full bg-ocre/50 animate-float" />
          <div className="absolute bottom-20 left-[30%] w-1.5 h-1.5 rounded-full bg-white/30 animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className={`transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-ocre/15 border border-ocre/30 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ocre opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ocre" />
              </span>
              <span className="font-sans text-ocre text-xs font-semibold tracking-[0.15em] uppercase">
                Événement de lancement
              </span>
            </div>
          </div>

          <h1 className={`font-serif text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-4 transition-all duration-700 delay-100 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            03 octobre 2026
          </h1>
          <p className={`font-serif text-xl md:text-2xl text-white/70 mb-6 transition-all duration-700 delay-200 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Vielle-Saint-Girons, Landes (40560)
          </p>

          <div className={`w-12 h-0.5 bg-ocre mx-auto mb-8 transition-all duration-700 delay-300 ${heroVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />

          <p className={`text-white/60 max-w-xl mx-auto leading-relaxed transition-all duration-700 delay-400 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Une journée festive et solidaire pour célébrer le lancement officiel
            de l'association Ressources — recyclerie informatique et végétale du territoire landais.
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-12 md:py-16 bg-beige-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { num: '01', label: 'Challenge collecte', title: '1/2 tonne de matériel', desc: "Lancé le 1er septembre dans les points de collecte du territoire, le défi s'achève par la pesée finale du 3 octobre. Objectif : 500 kg au total.", accent: 'ocre', delay: 0 },
              { num: '02', label: 'Tombola solidaire', title: 'Plus de 30 lots', desc: 'Plus de 30 lots offerts par les commerçants, artisans et producteurs du territoire. Chaque billet soutient directement la recyclerie.', accent: 'ocre', delay: 100 },
              { num: '03', label: 'Festivités', title: 'Une journée en commun', desc: "Rencontrez l'équipe, découvrez le projet, échangez avec les partenaires. Un moment de convivialité ancré dans le territoire.", accent: 'kaki', delay: 200 },
            ].map((card) => (
              <HighlightCard key={card.num} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* Tombola */}
      <section className="py-16 md:py-20 bg-white" ref={tombola.ref}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className={`transition-all duration-700 ${tombola.visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <p className="section-label">Tombola solidaire</p>
              <h2 className="font-serif text-3xl md:text-4xl text-terre mb-4">
                Soutenez le projet,<br />tentez votre chance
              </h2>
              <div className="decorative-line" />
              <p className="text-terre/60 leading-relaxed mb-6">
                La tombola est notre principal levier de financement pour cette
                première année. Elle nous permettra d'acquérir les équipements
                nécessaires au reconditionnement et de pérenniser la filière.
              </p>
              <div className="bg-gradient-to-br from-ocre-pale to-beige border border-ocre/20 p-6 mb-6 rounded-xl">
                <p className="font-sans text-xs text-ocre font-semibold tracking-wider uppercase mb-2">Objectif</p>
                <p className="font-serif text-4xl text-ocre mb-1">+ de 30 lots</p>
                <p className="text-sm text-terre/50">à gagner lors du tirage au sort</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/soutenir/tombola/" className="btn-ocre rounded-lg">En savoir plus sur la tombola</Link>
                <Link to="/soutenir/don/" className="btn-outline-ocre rounded-lg">Faire un don</Link>
              </div>
            </div>
            <div className={`space-y-4 transition-all duration-700 delay-200 ${tombola.visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <h3 className="font-serif text-xl text-terre">Comment participer ?</h3>
              {[
                { step: '1', text: 'Achetez vos billets de tombola (prix à définir)' },
                { step: '2', text: 'Venez à l\'événement le 03 octobre 2026' },
                { step: '3', text: 'Tentez de gagner l\'un des lots offerts par nos partenaires' },
                { step: '4', text: 'Votre participation finance directement l\'association' },
              ].map(({ step, text }) => (
                <div key={step} className="flex gap-4 group">
                  <span className="w-7 h-7 rounded-full bg-ocre text-white text-xs font-bold flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                    {step}
                  </span>
                  <p className="text-sm text-terre/65 leading-relaxed pt-0.5">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Challenge collecte */}
      <section className="py-16 md:py-20 bg-kaki text-white relative overflow-hidden" ref={challenge.ref}>
        <div className="absolute inset-0 bg-gradient-to-br from-kaki-dark via-kaki to-kaki" aria-hidden />
        <div className="absolute right-0 top-0 w-80 h-80 bg-ocre/5 rounded-bl-full blur-3xl" aria-hidden />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className={`transition-all duration-700 ${challenge.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="section-label text-ocre">Challenge collecte</p>
            <h2 className="font-serif text-3xl md:text-5xl text-white mb-6">
              1/2 tonne de matériel informatique
            </h2>
            <div className="w-12 h-0.5 bg-ocre mx-auto mb-8" />
            <p className="text-white/65 max-w-xl mx-auto leading-relaxed mb-10">
              Dès le 1<sup>er</sup> septembre, déposez vos équipements informatiques hors
              d'usage ou dont vous n'avez plus besoin dans l'un des points de collecte du
              territoire. Tout est pesé au fil des semaines, jusqu'à la pesée finale du
              03 octobre. Ordinateurs, écrans, câbles, smartphones, tablettes… tout est bon.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mb-10 text-left max-w-2xl mx-auto">
              {[
                'Ordinateurs portables & fixes',
                'Écrans et moniteurs',
                'Tablettes & smartphones',
                'Câbles & chargeurs',
                'Claviers, souris, accessoires',
                'Consoles de jeux',
              ].map((item, i) => (
                <div key={item} className={`flex items-center gap-2 transition-all duration-500 ${challenge.visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                  style={{ transitionDelay: `${200 + i * 60}ms` }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-ocre shrink-0" />
                  <span className="text-sm text-white/70">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/defi-collecte/" className="btn-ocre rounded-lg">
                Tout savoir sur le défi collecte
              </Link>
              <Link
                to="/recyclerie-informatique/comment-donner/"
                className="border border-white/25 text-white/75 px-6 py-3 text-sm font-medium rounded-lg hover:border-white/50 hover:text-white transition-all duration-200"
              >
                Je prépare ma donation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Inscription / Contact */}
      <section className="py-16 md:py-20 bg-beige-light" ref={inscription.ref}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className={`text-center mb-10 transition-all duration-700 ${inscription.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="section-label">Inscription</p>
            <h2 className="font-serif text-3xl text-terre mb-3">Restez informé·e</h2>
            <p className="text-terre/55 text-sm leading-relaxed">
              Laissez-nous vos coordonnées pour recevoir le programme complet
              et les informations pratiques de l'événement.
            </p>
          </div>
          <div className={`transition-all duration-700 delay-200 ${inscription.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <ContactForm />
          </div>
          <div className="mt-10 text-center text-sm text-terre/40">
            <p>
              Questions ?{' '}
              <a href="mailto:contact@ressourcesrecyclerie.fr" className="text-ocre hover:underline">
                contact@ressourcesrecyclerie.fr
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Liens silos */}
      <section className="py-10 bg-beige border-t border-beige-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap gap-4 justify-center text-sm">
          <Link to="/recyclerie-informatique/" className="text-kaki hover:text-ocre transition-colors">
            ← Recyclerie informatique
          </Link>
          <span className="text-terre/20">|</span>
          <Link to="/soutenir/tombola/" className="text-kaki hover:text-ocre transition-colors">
            Tombola solidaire →
          </Link>
        </div>
      </section>
    </Layout>
  )
}

function HighlightCard({ num, label, title, desc, accent, delay = 0 }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      className={`group bg-white border-t-2 ${accent === 'ocre' ? 'border-ocre' : 'border-kaki'} p-6 rounded-b-xl
        hover:shadow-xl hover:-translate-y-1 transition-all duration-400 cursor-default
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      <p className={`font-serif text-4xl ${accent === 'ocre' ? 'text-ocre/20 group-hover:text-ocre/30' : 'text-kaki/20 group-hover:text-kaki/30'} mb-3 leading-none transition-colors duration-300`}>
        {num}
      </p>
      <p className={`font-sans text-xs font-semibold tracking-widest uppercase mb-2 ${accent === 'ocre' ? 'text-ocre' : 'text-kaki'}`}>
        {label}
      </p>
      <h3 className="font-serif text-xl text-terre mb-3">{title}</h3>
      <p className="text-sm text-terre/55 leading-relaxed">{desc}</p>
    </div>
  )
}

function ContactForm() {
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', commune: '', message: '' })
  const [status, setStatus] = useState(null)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'evenement', ...form }),
      })
      setStatus(r.ok ? 'ok' : 'error')
    } catch { setStatus('error') }
  }

  if (status === 'ok') return (
    <p className="text-sm text-kaki font-medium py-3">Inscription enregistrée ! Nous vous tiendrons informé·e de l'événement.</p>
  )
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-sans font-medium text-terre/60 mb-1.5">Prénom *</label>
          <input type="text" required className="input-field rounded-lg" placeholder="Votre prénom" value={form.prenom} onChange={set('prenom')} disabled={status === 'loading'} />
        </div>
        <div>
          <label className="block text-xs font-sans font-medium text-terre/60 mb-1.5">Nom *</label>
          <input type="text" required className="input-field rounded-lg" placeholder="Votre nom" value={form.nom} onChange={set('nom')} disabled={status === 'loading'} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-sans font-medium text-terre/60 mb-1.5">Email *</label>
        <input type="email" required className="input-field rounded-lg" placeholder="votre@email.fr" value={form.email} onChange={set('email')} disabled={status === 'loading'} />
      </div>
      <div>
        <label className="block text-xs font-sans font-medium text-terre/60 mb-1.5">Commune</label>
        <input type="text" className="input-field rounded-lg" placeholder="Votre commune" value={form.commune} onChange={set('commune')} disabled={status === 'loading'} />
      </div>
      <div>
        <label className="block text-xs font-sans font-medium text-terre/60 mb-1.5">Message (facultatif)</label>
        <textarea rows={3} className="input-field resize-none rounded-lg" placeholder="Une question, une idée…" value={form.message} onChange={set('message')} disabled={status === 'loading'} />
      </div>
      <p className="text-xs text-terre/40 leading-relaxed">
        Vos données sont utilisées uniquement pour vous informer sur l'événement.
        Conformément au RGPD, vous pouvez demander leur suppression à tout moment.
      </p>
      {status === 'error' && <p className="text-xs text-red-500">Une erreur est survenue, veuillez réessayer.</p>}
      <button type="submit" className="btn-ocre w-full text-center rounded-lg" disabled={status === 'loading'}>
        {status === 'loading' ? 'Envoi…' : 'Je m\'inscris à la newsletter événement'}
      </button>
    </form>
  )
}

