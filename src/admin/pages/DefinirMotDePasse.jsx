import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authClient } from '../lib/authClient'

// Définition du mot de passe depuis un lien reçu par email — §21, §26.
//
// Seule page de /admin accessible sans session, avec la connexion. Elle ne
// donne accès à rien : elle ne fait que transmettre à better-auth un jeton
// qu'il a lui-même émis, à usage unique et valable 48 heures. C'est lui qui
// décide si le jeton vaut quelque chose, jamais cet écran.
//
// Le jeton arrive en paramètre d'URL parce que better-auth y redirige depuis
// /api/auth/reset-password/<jeton> : le lien de l'email porte le jeton dans
// son chemin, la redirection le repasse en paramètre. Vérifié en conditions
// réelles le 21/09/2026.

const LONGUEUR_MINIMALE = 12

export default function DefinirMotDePasse() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const jeton = params.get('token')
  // better-auth redirige avec ?error=INVALID_TOKEN quand le lien a expiré ou
  // a déjà servi, plutôt que de laisser la page le découvrir à l'envoi.
  const erreurLien = params.get('error')

  const [motDePasse, setMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [erreur, setErreur] = useState(null)
  const [envoi, setEnvoi] = useState(false)

  const invalide = !jeton || erreurLien

  async function soumettre(e) {
    e.preventDefault()
    setErreur(null)

    if (motDePasse.length < LONGUEUR_MINIMALE) {
      return setErreur(`Choisissez un mot de passe d'au moins ${LONGUEUR_MINIMALE} caractères.`)
    }
    if (motDePasse !== confirmation) {
      return setErreur('Les deux mots de passe ne sont pas identiques.')
    }

    setEnvoi(true)
    const { error } = await authClient.resetPassword({ token: jeton, newPassword: motDePasse })
    setEnvoi(false)

    if (error) {
      return setErreur(
        "Ce lien n'est plus valable : il a peut-être déjà servi, ou dépassé les 48 heures. Demandez une nouvelle invitation à la personne qui vous a créé l'accès."
      )
    }
    navigate('/admin/connexion', {
      replace: true,
      state: { message: 'Votre mot de passe est enregistré. Vous pouvez vous connecter.' },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-light px-4">
      <Helmet>
        <title>Choisir un mot de passe — Back-office Ressources</title>
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

        <h1 className="font-serif text-xl text-terre mb-2">Choisissez votre mot de passe</h1>

        {invalide ? (
          <>
            <p className="text-[13.5px] text-terre/70 leading-relaxed mb-5">
              Ce lien n'est pas valable. Il a peut-être déjà servi, ou dépassé les
              48 heures. Demandez une nouvelle invitation à la personne qui vous a
              créé l'accès.
            </p>
            <Link to="/admin/connexion" className="btn-ocre w-full inline-block text-center">
              Aller à la connexion
            </Link>
          </>
        ) : (
          <>
            <p className="text-[13px] text-terre/60 leading-relaxed mb-6">
              Au moins {LONGUEUR_MINIMALE} caractères. Personne d'autre que vous ne le
              connaîtra, pas même la Coordination.
            </p>

            <form onSubmit={soumettre} className="space-y-4">
              <div>
                <label htmlFor="mdp" className="block text-xs font-medium text-terre/60 mb-1.5">
                  Mot de passe
                </label>
                <input
                  id="mdp" type="password" required autoComplete="new-password"
                  value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)}
                  disabled={envoi} className="input-field w-full"
                />
              </div>
              <div>
                <label htmlFor="mdp2" className="block text-xs font-medium text-terre/60 mb-1.5">
                  Confirmez le mot de passe
                </label>
                <input
                  id="mdp2" type="password" required autoComplete="new-password"
                  value={confirmation} onChange={(e) => setConfirmation(e.target.value)}
                  disabled={envoi} className="input-field w-full"
                />
              </div>

              {erreur && <p className="text-xs text-red-500 leading-relaxed">{erreur}</p>}

              <button type="submit" className="btn-ocre w-full" disabled={envoi}>
                {envoi ? 'Enregistrement…' : 'Enregistrer et continuer'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
