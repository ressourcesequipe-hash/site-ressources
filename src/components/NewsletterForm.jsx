import { useState } from 'react'

// Formulaire d'inscription à la newsletter, partagé entre la page d'accueil,
// les actualités et le pied de page. variant 'clair' pour un fond sombre.
export default function NewsletterForm({ variant = 'sombre' }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'newsletter', email }),
      })
      setStatus(r.ok ? 'ok' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const clair = variant === 'clair'

  if (status === 'ok') {
    return (
      <p className={`text-sm font-medium py-3 ${clair ? 'text-ocre' : 'text-kaki'}`}>
        Merci ! Votre inscription a bien été transmise.
      </p>
    )
  }

  return (
    <>
      <form className="flex flex-wrap gap-3" onSubmit={handleSubmit}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`flex-1 min-w-56 ${clair
            ? 'bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-2.5 text-sm focus:outline-none focus:border-ocre transition-colors'
            : 'input-field'}`}
          placeholder="votre@email.fr"
          aria-label="Votre adresse e-mail"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          className={`text-sm shrink-0 ${clair ? 'btn-ocre' : 'btn-kaki'}`}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Envoi…' : 'S\'abonner'}
        </button>
      </form>
      {status === 'error' && (
        <p className={`text-xs mt-2 ${clair ? 'text-ocre-light' : 'text-red-500'}`}>
          Une erreur est survenue, veuillez réessayer.
        </p>
      )}
      <p className={`text-[11px] mt-3 ${clair ? 'text-white/35' : 'text-terre/35'}`}>
        Pas de spam. Désabonnement possible à tout moment.
      </p>
    </>
  )
}
