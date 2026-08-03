import { useState } from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'

export default function Contact() {
  return (
    <Layout>
      <SEO
        title="Nous contacter — Association Ressources Recyclerie Landes"
        description="Contactez l'association Ressources pour un don de matériel, une question sur la recyclerie végétale, un partenariat ou toute autre demande. Vielle-Saint-Girons, Landes (40)."
        canonical="/contact/"
      />

      {/* Hero */}
      <section className="bg-kaki text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-ocre" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Contact
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-white mb-4">
            Écrivez-nous
          </h1>
          <p className="text-white/65 max-w-xl leading-relaxed">
            Une question sur nos filières, un don à organiser, un partenariat à explorer ?
            Notre équipe de bénévoles vous répond dans les meilleurs délais.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-10">

            {/* Infos contact */}
            <div className="md:col-span-1 space-y-6">
              <div>
                <p className="font-sans text-xs font-bold tracking-widest uppercase text-ocre mb-4">
                  Coordonnées
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 shrink-0 border border-ocre/25 bg-ocre/5 flex items-center justify-center text-ocre mt-0.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-terre/40 uppercase tracking-wider mb-0.5">Email</p>
                      <a href="mailto:contact@ressourcesrecyclerie.fr" className="text-sm text-terre/75 hover:text-ocre transition-colors font-medium">
                        contact@ressourcesrecyclerie.fr
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 shrink-0 border border-ocre/25 bg-ocre/5 flex items-center justify-center text-ocre mt-0.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-terre/40 uppercase tracking-wider mb-0.5">Siège social</p>
                      <p className="text-sm text-terre/75 leading-relaxed">
                        80 allée des Cigales<br />
                        40560 Vielle-Saint-Girons
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 shrink-0 border border-ocre/25 bg-ocre/5 flex items-center justify-center text-ocre mt-0.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-terre/40 uppercase tracking-wider mb-0.5">Délai de réponse</p>
                      <p className="text-sm text-terre/75">Sous 48–72h (bénévoles)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sujets fréquents */}
              <div className="border-t border-beige pt-6">
                <p className="font-sans text-xs font-bold tracking-widest uppercase text-ocre mb-3">
                  Sujets fréquents
                </p>
                <ul className="space-y-2 text-sm text-terre/65 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-ocre mt-0.5 shrink-0">→</span>
                    Don de matériel informatique
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocre mt-0.5 shrink-0">→</span>
                    Don de plantes ou matériel végétal
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocre mt-0.5 shrink-0">→</span>
                    Bénévolat ou adhésion
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocre mt-0.5 shrink-0">→</span>
                    Partenariat ou mécénat
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ocre mt-0.5 shrink-0">→</span>
                    Achat solidaire d'un équipement reconditionné
                  </li>
                </ul>
              </div>

              {/* Carte */}
              <div className="border-t border-beige pt-6">
                <p className="font-sans text-xs font-bold tracking-widest uppercase text-ocre mb-3">
                  Localisation
                </p>
                <div className="relative overflow-hidden border border-beige-dark" style={{ height: '200px' }}>
                  <iframe
                    title="Localisation — Association Ressources Vielle-Saint-Girons"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-1.3219%2C43.9416%2C-1.2819%2C43.9616&layer=mapnik&marker=43.9516%2C-1.3019"
                    style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                    loading="lazy"
                  />
                </div>
                <a
                  href="https://www.openstreetmap.org/?mlat=43.9516&mlon=-1.3019#map=17/43.9516/-1.3019"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-terre/50 hover:text-ocre transition-colors mt-2 inline-block"
                >
                  Agrandir la carte ↗
                </a>
              </div>
            </div>

            {/* Formulaire */}
            <div className="md:col-span-2">
              <p className="font-sans text-xs font-bold tracking-widest uppercase text-ocre mb-6">
                Formulaire de contact
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

function ContactForm() {
  const [form, setForm] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: '',
  })
  const [status, setStatus] = useState(null)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact', ...form }),
      })
      setStatus(r.ok ? 'ok' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'ok') return (
    <div className="bg-kaki-pale border border-kaki/15 p-8">
      <p className="font-serif text-xl text-terre mb-2">Message envoyé !</p>
      <p className="text-sm text-terre/65 leading-relaxed">
        Merci pour votre message. Notre équipe vous répondra dans les 48–72h.
      </p>
    </div>
  )

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-terre/60 mb-1.5">Prénom & nom *</label>
          <input
            type="text"
            required
            className="input-field"
            value={form.nom}
            onChange={set('nom')}
            disabled={status === 'loading'}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-terre/60 mb-1.5">Email *</label>
          <input
            type="email"
            required
            className="input-field"
            value={form.email}
            onChange={set('email')}
            disabled={status === 'loading'}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-terre/60 mb-1.5">Téléphone</label>
          <input
            type="tel"
            className="input-field"
            value={form.telephone}
            onChange={set('telephone')}
            disabled={status === 'loading'}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-terre/60 mb-1.5">Sujet *</label>
          <select
            required
            className="input-field"
            value={form.sujet}
            onChange={set('sujet')}
            disabled={status === 'loading'}
          >
            <option value="">Choisir un sujet…</option>
            <option value="Don de matériel informatique">Don de matériel informatique</option>
            <option value="Don de plantes ou végétaux">Don de plantes ou végétaux</option>
            <option value="Achat solidaire (équipement reconditionné)">Achat solidaire (équipement reconditionné)</option>
            <option value="Bénévolat ou adhésion">Bénévolat ou adhésion</option>
            <option value="Partenariat ou mécénat">Partenariat ou mécénat</option>
            <option value="Autre question">Autre question</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-terre/60 mb-1.5">Message *</label>
        <textarea
          rows={6}
          required
          className="input-field resize-none"
          placeholder="Décrivez votre demande…"
          value={form.message}
          onChange={set('message')}
          disabled={status === 'loading'}
        />
      </div>

      {status === 'error' && (
        <p className="text-xs text-red-500">Une erreur est survenue, veuillez réessayer ou écrire directement à contact@ressourcesrecyclerie.fr</p>
      )}

      <button
        type="submit"
        className="btn-ocre"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Envoi en cours…' : 'Envoyer le message'}
      </button>

      <p className="text-xs text-terre/35 leading-relaxed">
        Vos données sont utilisées uniquement pour traiter votre demande et ne sont pas transmises à des tiers.
      </p>
    </form>
  )
}
