import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigate } from 'react-router-dom'
import { authClient } from '../lib/authClient'

export default function Connexion() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState(null)
  const [envoi, setEnvoi] = useState(false)

  const destination = location.state?.from?.pathname || '/admin/'

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur(null)
    setEnvoi(true)
    const { error } = await authClient.signIn.email({ email, password: motDePasse })
    setEnvoi(false)
    if (error) {
      // Message générique : jamais préciser si c'est l'email ou le mot de
      // passe qui est en cause (évite de confirmer l'existence d'un compte).
      setErreur('Identifiants incorrects. Vérifiez votre email et votre mot de passe.')
      return
    }
    navigate(destination, { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-light px-4">
      <Helmet>
        <title>Connexion — Back-office Ressources</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="w-full max-w-sm bg-white border border-beige-dark rounded-2xl p-8">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-lg bg-ocre flex items-center justify-center text-white font-serif font-bold">
            R
          </div>
          <div>
            <div className="font-semibold text-terre text-sm leading-tight">Ressources</div>
            <div className="text-[10.5px] text-terre/50 tracking-[0.08em] uppercase">Back-office</div>
          </div>
        </div>

        <h1 className="font-serif text-xl text-terre mb-6">Connexion</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-terre/60 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={envoi}
              className="input-field w-full"
            />
          </div>
          <div>
            <label htmlFor="mot-de-passe" className="block text-xs font-medium text-terre/60 mb-1.5">
              Mot de passe
            </label>
            <input
              id="mot-de-passe"
              type="password"
              required
              autoComplete="current-password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              disabled={envoi}
              className="input-field w-full"
            />
          </div>

          {erreur && <p className="text-xs text-red-500">{erreur}</p>}

          <button type="submit" className="btn-ocre w-full" disabled={envoi}>
            {envoi ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
