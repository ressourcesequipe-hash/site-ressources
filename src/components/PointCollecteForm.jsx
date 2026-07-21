import { useState } from 'react'

const TYPES = [
  'Commerce',
  'Entreprise',
  'Commune ou collectivité',
  'Association',
  'Établissement scolaire',
  'Autre',
]

const CHAMPS_VIDES = {
  structure: '',
  nom: '',
  email: '',
  telephone: '',
  commune: '',
  type: '',
  message: '',
}

// Formulaire de candidature pour accueillir un point de collecte du défi.
// Envoie vers /api/contact avec le type 'pointCollecte'.
export default function PointCollecteForm() {
  const [champs, setChamps] = useState(CHAMPS_VIDES)
  const [status, setStatus] = useState(null)

  const maj = (cle) => (e) => setChamps((c) => ({ ...c, [cle]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'pointCollecte', ...champs }),
      })
      setStatus(r.ok ? 'ok' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'ok') {
    return (
      <div className="border-l-2 border-ocre bg-ocre-pale p-6">
        <p className="font-serif text-lg text-terre mb-1.5">Merci, votre proposition est bien reçue.</p>
        <p className="text-sm text-terre/60 leading-relaxed">
          Nous revenons vers vous rapidement pour convenir des modalités pratiques :
          contenant, fréquence de collecte et signalétique.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="pc-structure" className="block text-xs font-sans text-terre/55 mb-1.5">
            Nom de la structure <span className="text-ocre">*</span>
          </label>
          <input
            id="pc-structure" type="text" required value={champs.structure}
            onChange={maj('structure')} className="input-field w-full"
            disabled={status === 'loading'}
          />
        </div>
        <div>
          <label htmlFor="pc-commune" className="block text-xs font-sans text-terre/55 mb-1.5">
            Commune <span className="text-ocre">*</span>
          </label>
          <input
            id="pc-commune" type="text" required value={champs.commune}
            onChange={maj('commune')} className="input-field w-full"
            disabled={status === 'loading'}
          />
        </div>
        <div>
          <label htmlFor="pc-nom" className="block text-xs font-sans text-terre/55 mb-1.5">
            Votre nom <span className="text-ocre">*</span>
          </label>
          <input
            id="pc-nom" type="text" required value={champs.nom}
            onChange={maj('nom')} className="input-field w-full"
            disabled={status === 'loading'}
          />
        </div>
        <div>
          <label htmlFor="pc-type" className="block text-xs font-sans text-terre/55 mb-1.5">
            Type de structure
          </label>
          <select
            id="pc-type" value={champs.type} onChange={maj('type')}
            className="input-field w-full" disabled={status === 'loading'}
          >
            <option value="">Sélectionnez…</option>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="pc-email" className="block text-xs font-sans text-terre/55 mb-1.5">
            E-mail <span className="text-ocre">*</span>
          </label>
          <input
            id="pc-email" type="email" required value={champs.email}
            onChange={maj('email')} className="input-field w-full"
            disabled={status === 'loading'}
          />
        </div>
        <div>
          <label htmlFor="pc-telephone" className="block text-xs font-sans text-terre/55 mb-1.5">
            Téléphone
          </label>
          <input
            id="pc-telephone" type="tel" value={champs.telephone}
            onChange={maj('telephone')} className="input-field w-full"
            disabled={status === 'loading'}
          />
        </div>
      </div>

      <div>
        <label htmlFor="pc-message" className="block text-xs font-sans text-terre/55 mb-1.5">
          Précisions (emplacement disponible, horaires d'ouverture…)
        </label>
        <textarea
          id="pc-message" rows="3" value={champs.message} onChange={maj('message')}
          className="input-field w-full resize-none" disabled={status === 'loading'}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-ocre" disabled={status === 'loading'}>
          {status === 'loading' ? 'Envoi…' : 'Proposer mon point de collecte'}
        </button>
        <p className="text-xs text-terre/40">Réponse sous quelques jours.</p>
      </div>

      {status === 'error' && (
        <p className="text-xs text-red-500">
          Une erreur est survenue. Vous pouvez aussi nous appeler au 06 62 66 04 84.
        </p>
      )}
    </form>
  )
}
