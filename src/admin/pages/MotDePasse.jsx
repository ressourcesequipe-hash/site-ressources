import { useState } from 'react'
import { authClient } from '../lib/authClient'

// Changement de mot de passe — §21 et §24.7 du cahier des charges.
//
// Aucune route d'API propre au projet n'est nécessaire : better-auth expose
// déjà `/api/auth/change-password`, qui vérifie l'ancien mot de passe,
// applique la longueur minimale configurée dans lib/auth.js et effectue le
// hachage. Écrire notre propre route reviendrait à réimplémenter — moins
// bien — ce que la bibliothèque fait déjà (§26 : une brique éprouvée, pas
// du sur-mesure).
//
// Les codes d'erreur renvoyés sont traduits en français ci-dessous : un
// message technique brut n'a aucun sens pour les utilisateurs visés (§24.1).

const LONGUEUR_MINIMALE = 12

const MESSAGES = {
  INVALID_PASSWORD: "Le mot de passe actuel n'est pas le bon.",
  PASSWORD_TOO_SHORT: `Le nouveau mot de passe est trop court : il faut au moins ${LONGUEUR_MINIMALE} caractères.`,
  PASSWORD_TOO_LONG: 'Le nouveau mot de passe est trop long.',
  CREDENTIAL_ACCOUNT_NOT_FOUND: "Ce compte n'utilise pas de mot de passe.",
}

function traduire(erreur) {
  if (erreur?.code && MESSAGES[erreur.code]) return MESSAGES[erreur.code]
  // Repli explicite plutôt qu'un message technique ou un silence.
  return "La modification n'a pas pu aboutir. Réessayez dans un instant."
}

export default function MotDePasse() {
  const [actuel, setActuel] = useState('')
  const [nouveau, setNouveau] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [deconnecterAilleurs, setDeconnecterAilleurs] = useState(true)
  const [etat, setEtat] = useState({ type: 'repos' })

  const tropCourt = nouveau.length > 0 && nouveau.length < LONGUEUR_MINIMALE
  const discordance = confirmation.length > 0 && nouveau !== confirmation
  const identique = nouveau.length > 0 && nouveau === actuel

  const envoyable =
    actuel.length > 0 &&
    nouveau.length >= LONGUEUR_MINIMALE &&
    nouveau === confirmation &&
    !identique &&
    etat.type !== 'envoi'

  async function envoyer(e) {
    e.preventDefault()
    if (!envoyable) return
    setEtat({ type: 'envoi' })

    const { error } = await authClient.changePassword({
      currentPassword: actuel,
      newPassword: nouveau,
      revokeOtherSessions: deconnecterAilleurs,
    })

    if (error) {
      setEtat({ type: 'erreur', message: traduire(error) })
      return
    }

    setActuel('')
    setNouveau('')
    setConfirmation('')
    setEtat({ type: 'succes' })
  }

  return (
    <div className="max-w-xl">
      <p className="text-sm text-terre/70 mb-6 leading-relaxed">
        Choisissez un mot de passe d'au moins {LONGUEUR_MINIMALE} caractères, que vous
        n'utilisez sur aucun autre site. Une phrase simple dont vous vous souvenez fait
        très bien l'affaire.
      </p>

      <form onSubmit={envoyer} className="bg-white border border-beige-dark rounded-2xl p-6 space-y-5">
        <Champ
          id="actuel"
          label="Mot de passe actuel"
          valeur={actuel}
          onChange={setActuel}
          autoComplete="current-password"
        />

        <Champ
          id="nouveau"
          label="Nouveau mot de passe"
          valeur={nouveau}
          onChange={setNouveau}
          autoComplete="new-password"
          aide={`${LONGUEUR_MINIMALE} caractères minimum`}
          erreur={
            tropCourt
              ? `Encore ${LONGUEUR_MINIMALE - nouveau.length} caractère${LONGUEUR_MINIMALE - nouveau.length > 1 ? 's' : ''}.`
              : identique
                ? "Le nouveau mot de passe doit être différent de l'actuel."
                : null
          }
        />

        <Champ
          id="confirmation"
          label="Confirmer le nouveau mot de passe"
          valeur={confirmation}
          onChange={setConfirmation}
          autoComplete="new-password"
          erreur={discordance ? 'Les deux saisies ne correspondent pas.' : null}
        />

        <label className="flex items-start gap-2.5 text-[13px] text-terre/80 cursor-pointer">
          <input
            type="checkbox"
            checked={deconnecterAilleurs}
            onChange={(e) => setDeconnecterAilleurs(e.target.checked)}
            className="mt-0.5 accent-ocre"
          />
          <span>
            Me déconnecter des autres appareils
            <span className="block text-terre/50 text-[12px]">
              Recommandé si vous pensez que quelqu'un d'autre connaît votre ancien mot de passe.
            </span>
          </span>
        </label>

        {etat.type === 'erreur' && (
          <p className="text-[13px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
            {etat.message}
          </p>
        )}

        {etat.type === 'succes' && (
          <p className="text-[13px] text-olive bg-kaki-pale/40 border border-olive/30 rounded-lg px-3.5 py-2.5">
            Mot de passe modifié. Utilisez le nouveau à votre prochaine connexion.
          </p>
        )}

        <div className="pt-1">
          <button
            type="submit"
            disabled={!envoyable}
            className="px-5 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {etat.type === 'envoi' ? 'Modification…' : 'Modifier le mot de passe'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Champ({ id, label, valeur, onChange, autoComplete, aide, erreur }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-semibold text-terre mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type="password"
        value={valeur}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3.5 py-2.5 rounded-lg border text-[14px] text-terre bg-white outline-none transition-colors focus:border-ocre ${
          erreur ? 'border-red-300' : 'border-beige-dark'
        }`}
      />
      {/* L'erreur est affichée près du champ concerné, jamais en bloc
          isolé en haut de page (§24.4). */}
      {erreur ? (
        <p className="text-[12px] text-red-700 mt-1.5">{erreur}</p>
      ) : aide ? (
        <p className="text-[12px] text-terre/50 mt-1.5">{aide}</p>
      ) : null}
    </div>
  )
}
