import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'

const BREADCRUMBS = [
  { label: 'Recyclerie Informatique', href: '/recyclerie-informatique/' },
  { label: 'Comment donner' },
]

export default function CommentDonner() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Comment donner son matériel informatique dans les Landes"
        description="Donnez votre ordinateur, tablette ou smartphone dans les Landes (40). Points de collecte, enlèvement à domicile, démarche simplifiée — association Ressources, Vielle-Saint-Girons."
        canonical="/recyclerie-informatique/comment-donner/"
      />

      <section className="bg-beige py-12 md:py-16 border-b border-kaki/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-ocre text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Recyclerie informatique
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">
            Comment donner son matériel informatique
          </h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Donner est simple et rapide. Voici les différentes façons de nous
            confier vos équipements dans les Landes.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {[
              {
                num: '1',
                title: 'Points de collecte',
                desc: 'Déposez directement votre matériel à Vielle-Saint-Girons (80 allée des Cigales). D\'autres points partenaires à venir sur le territoire.',
                note: 'Voir la carte ci-dessous',
              },
              {
                num: '2',
                title: 'Enlèvement à domicile',
                desc: 'Vous avez plusieurs équipements ou une mobilité réduite ? Nous organisons un enlèvement à votre adresse.',
                note: 'Formulaire ci-dessous',
              },
              {
                num: '3',
                title: 'Événement du 03 octobre',
                desc: 'Apportez votre matériel directement lors de notre journée de lancement à Vielle-Saint-Girons.',
                note: 'Challenge 1 tonne',
              },
            ].map(({ num, title, desc, note }) => (
              <div key={num} className="border-t-2 border-ocre pt-6">
                <span className="font-serif text-3xl text-ocre/30 block mb-3 leading-none">{num}</span>
                <h2 className="font-serif text-xl text-terre mb-2">{title}</h2>
                <p className="text-sm text-terre/55 leading-relaxed mb-3">{desc}</p>
                <p className="text-xs text-ocre font-medium italic">{note}</p>
              </div>
            ))}
          </div>

          {/* Points de collecte */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-2xl text-terre">Points de collecte</h2>
              <span className="font-sans text-xs font-semibold tracking-widest uppercase text-ocre bg-ocre/8 border border-ocre/20 px-3 py-1">
                1 point actif
              </span>
            </div>

            {/* Carte OpenStreetMap */}
            <div className="relative overflow-hidden border border-beige-dark mb-5" style={{ height: '360px' }}>
              {/* Barre décorative */}
              <div className="absolute top-0 inset-x-0 h-0.5 bg-ocre z-10" />
              <iframe
                title="Point de collecte — Vielle-Saint-Girons"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-1.3219%2C43.9416%2C-1.2819%2C43.9616&layer=mapnik&marker=43.9516%2C-1.3019"
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                allowFullScreen
                loading="lazy"
              />
              {/* Overlay lien OpenStreetMap */}
              <div className="absolute bottom-2 right-2 z-10">
                <a
                  href="https://www.openstreetmap.org/?mlat=43.9516&mlon=-1.3019#map=17/43.9516/-1.3019"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-terre/50 bg-white/90 border border-beige px-2 py-1 hover:text-ocre transition-colors"
                >
                  Agrandir la carte ↗
                </a>
              </div>
            </div>

            {/* Fiche du point de collecte */}
            <div className="border-l-2 border-ocre bg-beige-light p-5 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1">
                <p className="font-sans text-xs font-bold tracking-widest uppercase text-ocre mb-1">
                  Point de collecte principal
                </p>
                <p className="font-serif text-lg text-terre mb-1">
                  Association Ressources — Vielle-Saint-Girons
                </p>
                <p className="text-sm text-terre/60 leading-relaxed">
                  80 allée des Cigales<br />40560 Vielle-Saint-Girons (Landes)
                </p>
              </div>
              <div className="shrink-0 flex flex-col gap-2">
                <a
                  href="mailto:contact@ressourcesrecyclerie.fr"
                  className="inline-flex items-center gap-2 text-sm text-ocre hover:underline font-medium"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Nous contacter
                </a>
                <a
                  href="https://www.openstreetmap.org/?mlat=43.9516&mlon=-1.3019#map=17/43.9516/-1.3019"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-terre/50 hover:text-ocre transition-colors"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Itinéraire OpenStreetMap
                </a>
              </div>
            </div>
          </div>

          {/* Formulaire enlèvement */}
          <div>
            <h2 className="font-serif text-2xl text-terre mb-6">Demander un enlèvement</h2>
            <DonMaterielForm />
          </div>
        </div>
      </section>

      <section className="py-8 bg-beige border-t border-beige-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-wrap gap-4 text-sm">
          <Link to="/recyclerie-informatique/" className="text-kaki hover:text-ocre transition-colors">
            ← Retour à la recyclerie informatique
          </Link>
          <span className="text-terre/20">|</span>
          <Link to="/recyclerie-informatique/materiel-accepte/" className="text-kaki hover:text-ocre transition-colors">
            Matériel accepté →
          </Link>
        </div>
      </section>
    </Layout>
  )
}

function DonMaterielForm() {
  const [form, setForm] = useState({ nom: '', telephone: '', email: '', adresse: '', materiel: '' })
  const [status, setStatus] = useState(null)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'donMateriel', ...form }),
      })
      setStatus(r.ok ? 'ok' : 'error')
    } catch { setStatus('error') }
  }

  if (status === 'ok') return (
    <p className="text-sm text-kaki font-medium py-3">Demande envoyée ! Nous vous contacterons pour organiser l'enlèvement.</p>
  )
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-terre/60 mb-1.5">Prénom & nom *</label>
          <input type="text" required className="input-field" value={form.nom} onChange={set('nom')} disabled={status === 'loading'} />
        </div>
        <div>
          <label className="block text-xs font-medium text-terre/60 mb-1.5">Téléphone *</label>
          <input type="tel" required className="input-field" value={form.telephone} onChange={set('telephone')} disabled={status === 'loading'} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-terre/60 mb-1.5">Email *</label>
        <input type="email" required className="input-field" value={form.email} onChange={set('email')} disabled={status === 'loading'} />
      </div>
      <div>
        <label className="block text-xs font-medium text-terre/60 mb-1.5">Adresse d'enlèvement *</label>
        <input type="text" required className="input-field" placeholder="Adresse + commune" value={form.adresse} onChange={set('adresse')} disabled={status === 'loading'} />
      </div>
      <div>
        <label className="block text-xs font-medium text-terre/60 mb-1.5">Matériel à donner *</label>
        <textarea rows={3} required className="input-field resize-none" placeholder="Ex : 2 ordinateurs portables, 1 écran, des câbles…" value={form.materiel} onChange={set('materiel')} disabled={status === 'loading'} />
      </div>
      {status === 'error' && <p className="text-xs text-red-500">Une erreur est survenue, veuillez réessayer.</p>}
      <button type="submit" className="btn-ocre" disabled={status === 'loading'}>{status === 'loading' ? 'Envoi…' : 'Envoyer la demande'}</button>
    </form>
  )
}
