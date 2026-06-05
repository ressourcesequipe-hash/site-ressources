import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import SEO from '../../components/SEO'
import { IconCollecte, IconOutil, IconPlante, IconMegaphone, IconTransport } from '../../components/Icons'

const BREADCRUMBS = [
  { label: 'Soutenir', href: '/soutenir/' },
  { label: 'Devenir bénévole' },
]

export default function Benevole() {
  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Devenir bénévole — association Ressources Landes"
        description="Rejoignez l'équipe bénévole de l'association Ressources dans les Landes. Collecte, reconditionnement, végétal, événements — contribuez selon vos disponibilités."
        canonical="/soutenir/benevole/"
      />

      <section className="bg-kaki-pale py-12 md:py-16 border-b border-kaki/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="section-label">Bénévolat</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-terre mb-4">Devenir bénévole</h1>
          <p className="text-terre/60 max-w-xl leading-relaxed">
            Rejoignez les 8 bénévoles réguliers que nous recrutons pour le démarrage
            de la filière en septembre 2026. Aucune expérience requise, formation assurée.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 mb-12">
            <div>
              <h2 className="font-serif text-2xl text-terre mb-6">Les missions bénévoles</h2>
              <div className="space-y-4">
                {[
                  { icon: <IconCollecte className="w-5 h-5" />, titre: 'Collecte & manutention', desc: 'Participation aux collectes, réception et déchargement du matériel, organisation des stocks.' },
                  { icon: <IconOutil className="w-5 h-5" />, titre: 'Diagnostic & reconditionnement', desc: 'Tri, nettoyage, tests, reconditionnement des appareils informatiques. Formation technique fournie.' },
                  { icon: <IconPlante className="w-5 h-5" />, titre: 'Filière végétale', desc: 'Réception, soin et redistribution des plantes et matériels de jardinage collectés.' },
                  { icon: <IconMegaphone className="w-5 h-5" />, titre: 'Communication & événements', desc: 'Aide à la communication, animation des événements, représentation de l\'association.' },
                  { icon: <IconTransport className="w-5 h-5" />, titre: 'Logistique & transport', desc: 'Enlèvements chez les donateurs, livraisons aux bénéficiaires (véhicule souhaitable).' },
                ].map(({ icon, titre, desc }) => (
                  <div key={titre} className="flex gap-4">
                    <div className="w-9 h-9 shrink-0 border border-kaki/20 bg-kaki/5 flex items-center justify-center text-kaki" aria-hidden>{icon}</div>
                    <div>
                      <p className="font-sans text-sm font-semibold text-terre mb-0.5">{titre}</p>
                      <p className="text-xs text-terre/55 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-beige-light border border-beige-dark p-6 mb-5">
                <h3 className="font-serif text-lg text-terre mb-3">Ce que nous offrons</h3>
                <ul className="space-y-2">
                  {[
                    'Formation aux outils et processus de l\'association',
                    'Couverture en responsabilité civile',
                    'Remboursement des frais de déplacement',
                    'Intégration dans une équipe conviviale',
                    'Contribution concrète à l\'inclusion numérique locale',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-terre/65">
                      <span className="text-kaki mt-1 shrink-0 text-xs">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-ocre-pale border border-ocre/20 p-5">
                <p className="text-xs text-ocre font-semibold tracking-wider uppercase mb-2">Disponibilité</p>
                <p className="text-sm text-terre/65 leading-relaxed">
                  Nous nous adaptons à vos disponibilités : quelques heures par mois
                  ou un engagement plus régulier. Toutes les formes de bénévolat sont bienvenues.
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire inscription */}
          <div className="bg-kaki-pale border border-kaki/15 p-8">
            <h2 className="font-serif text-2xl text-terre mb-6">Inscription bénévole</h2>
            <BenevoleForm />
          </div>
        </div>
      </section>
    </Layout>
  )
}

function BenevoleForm() {
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', commune: '', mission: '', message: '' })
  const [status, setStatus] = useState(null)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'benevole', ...form }),
      })
      setStatus(r.ok ? 'ok' : 'error')
    } catch { setStatus('error') }
  }

  if (status === 'ok') return (
    <p className="text-sm text-kaki font-medium py-3">Candidature envoyée ! Nous vous contacterons prochainement.</p>
  )
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-4">
        <input type="text" required className="input-field" placeholder="Prénom & nom *" value={form.nom} onChange={set('nom')} disabled={status === 'loading'} />
        <input type="email" required className="input-field" placeholder="Email *" value={form.email} onChange={set('email')} disabled={status === 'loading'} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input type="tel" className="input-field" placeholder="Téléphone" value={form.telephone} onChange={set('telephone')} disabled={status === 'loading'} />
        <input type="text" className="input-field" placeholder="Commune" value={form.commune} onChange={set('commune')} disabled={status === 'loading'} />
      </div>
      <select className="input-field" value={form.mission} onChange={set('mission')} disabled={status === 'loading'}>
        <option value="">Mission souhaitée (principale)</option>
        <option>Collecte & manutention</option>
        <option>Diagnostic & reconditionnement</option>
        <option>Filière végétale</option>
        <option>Communication & événements</option>
        <option>Logistique & transport</option>
        <option>Polyvalent·e</option>
      </select>
      <textarea rows={3} className="input-field resize-none" placeholder="Compétences particulières, motivations, disponibilités…" value={form.message} onChange={set('message')} disabled={status === 'loading'} />
      {status === 'error' && <p className="text-xs text-red-500">Une erreur est survenue, veuillez réessayer.</p>}
      <button type="submit" className="btn-ocre" disabled={status === 'loading'}>{status === 'loading' ? 'Envoi…' : 'Envoyer ma candidature bénévole'}</button>
    </form>
  )
}
