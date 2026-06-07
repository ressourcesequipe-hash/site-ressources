import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'

const BREADCRUMBS = [
  { label: 'Recyclerie Végétale', href: '/recyclerie-vegetale/' },
  { label: 'Partenaires végétaux' },
]

export default function PartenairesVegetaux() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Partenaires végétaux — recyclerie végétale Landes"
        description="Rejoignez le réseau de partenaires végétaux de l'association Ressources dans les Landes. Communes, campings, pépinières, fleuristes — devenez point de collecte ou point de vente solidaire."
        canonical="/recyclerie-vegetale/partenaires-vegetaux/"
      />

      <section style={{ backgroundColor: "#EDECCE", borderColor: 'rgba(108,124,73,0.1)' }} className="py-12 md:py-16 border-b relative overflow-hidden">

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-sans text-[10px] font-bold tracking-[0.22em] uppercase mb-3" style={{ color: '#6c7c49' }}>
            Recyclerie végétale
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">
            Partenaires végétaux
          </h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Communes, campings, pépinières, fleuristes, jardineries — rejoignez
            le réseau de la recyclerie végétale solidaire dans les Landes.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl text-terre mb-8">Comment devenir partenaire végétal ?</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              {
                titre: 'Point de collecte',
                desc: 'Votre site accueille les dépôts de plantes et matériels. Idéal pour les communes, mairies, déchetteries végétales, jardineries.',
              },
              {
                titre: 'Point de vente solidaire',
                desc: 'Votre structure héberge un espace de vente solidaire à destination de vos clients ou usagers. Idéal pour les marchés locaux, commerces de proximité et associations.',
              },
              {
                titre: 'Partenaire de soin',
                desc: 'Vous disposez d\'un espace pour accueillir temporairement des plantes en attente de vente. Idéal pour pépiniéristes et jardineries.',
              },
              {
                titre: 'Partenaire relais',
                desc: 'Vous relayez nos actions sur vos réseaux et auprès de votre clientèle. Idéal pour tout commerce local.',
              },
            ].map(({ titre, desc }) => (
              <div key={titre} className="pl-5 py-2" style={{ borderLeft: '2px solid #6c7c49' }}>
                <h3 className="font-serif text-lg text-terre mb-2">{titre}</h3>
                <p className="text-sm text-terre/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-white p-8 mb-10" style={{ backgroundColor: '#6c7c49' }}>
            <h2 className="font-serif text-2xl text-white mb-4">Votre structure souhaite s'engager ?</h2>
            <p className="text-white/65 text-sm leading-relaxed mb-6">
              Contactez-nous pour discuter d'un partenariat végétal adapté à votre situation.
              Nous construisons le réseau progressivement pour l'ouverture de septembre 2026.
            </p>
            <PartenaireForm />
          </div>

          {/* FAQ */}
          <div className="border-t border-beige pt-10">
            <h2 className="font-serif text-2xl text-terre mb-6">Questions fréquentes</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Y a-t-il une exclusivité territoriale pour les partenaires ?',
                  a: 'Non, plusieurs partenaires peuvent coexister sur un même secteur. Nous cherchons à maillier le territoire le plus largement possible.',
                },
                {
                  q: 'Quels sont les engagements d\'un point de collecte ?',
                  a: 'Disposer d\'un espace accessible pour les dépôts, assurer un tri basique, et nous prévenir quand le stock devient important pour organisation de l\'enlèvement.',
                },
                {
                  q: 'Un partenaire est-il rémunéré ?',
                  a: 'Non, le partenariat est basé sur le bénévolat ou la mise à disposition d\'espace. En contrepartie, votre structure est valorisée sur nos supports de communication.',
                },
                {
                  q: 'Peut-on devenir partenaire avant septembre 2026 ?',
                  a: 'Oui, et c\'est même conseillé ! Nous constituons le réseau dès maintenant pour être opérationnels dès l\'ouverture de la filière.',
                },
              ].map(({ q, a }) => (
                <details key={q} className="border border-beige group">
                  <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none font-sans text-sm font-semibold text-terre transition-colors"
                    onMouseEnter={e => e.currentTarget.style.color = '#6c7c49'}
                    onMouseLeave={e => e.currentTarget.style.color = ''}>
                    {q}
                    <span className="shrink-0 group-open:rotate-180 transition-transform duration-200" style={{ color: 'rgba(108,124,73,0.5)' }}>▾</span>
                  </summary>
                  <p className="px-5 pb-5 text-sm text-terre/60 leading-relaxed border-t border-beige pt-4">{a}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="pt-8">
            <Link to="/recyclerie-vegetale/" className="text-sm transition-colors" style={{ color: '#6c7c49' }}
              onMouseEnter={e => e.currentTarget.style.color = '#C8973A'}
              onMouseLeave={e => e.currentTarget.style.color = '#6c7c49'}>
              ← Retour à la recyclerie végétale
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}

function PartenaireForm() {
  const [form, setForm] = useState({ structure: '', commune: '', contact: '', email: '', partenariat: '' })
  const [status, setStatus] = useState(null)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact', sujet: 'Partenariat végétal', message: `Structure : ${form.structure}\nCommune : ${form.commune}\nContact : ${form.contact}\nPartenariat envisagé : ${form.partenariat || '—'}`, nom: form.contact, email: form.email }),
      })
      setStatus(r.ok ? 'ok' : 'error')
    } catch { setStatus('error') }
  }

  if (status === 'ok') return (
    <p className="text-sm text-white font-medium py-3">Merci ! Nous vous contacterons pour discuter du partenariat.</p>
  )

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-3">
        <input type="text" className="input-field" placeholder="Nom de la structure *" required value={form.structure} onChange={set('structure')} disabled={status === 'loading'} />
        <input type="text" className="input-field" placeholder="Commune *" required value={form.commune} onChange={set('commune')} disabled={status === 'loading'} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input type="text" className="input-field" placeholder="Contact *" required value={form.contact} onChange={set('contact')} disabled={status === 'loading'} />
        <input type="email" className="input-field" placeholder="Email *" required value={form.email} onChange={set('email')} disabled={status === 'loading'} />
      </div>
      <textarea rows={2} className="input-field resize-none" placeholder="Type de partenariat envisagé…" value={form.partenariat} onChange={set('partenariat')} disabled={status === 'loading'} />
      {status === 'error' && <p className="text-xs text-red-300">Une erreur est survenue, veuillez réessayer.</p>}
      <button type="submit" className="btn-veg text-sm" disabled={status === 'loading'}>
        {status === 'loading' ? 'Envoi…' : 'Nous contacter'}
      </button>
    </form>
  )
}

