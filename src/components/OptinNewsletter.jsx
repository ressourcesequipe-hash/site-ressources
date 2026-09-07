import { Link } from 'react-router-dom'

// Case à cocher de consentement à la newsletter, à placer sur tout formulaire
// qui n'est pas le formulaire newsletter lui-même.
//
// Elle est décochée par défaut, et doit le rester : quelqu'un qui demande un
// enlèvement de matériel n'a pas demandé à recevoir la newsletter. Sans cette
// case, le contact est bien enregistré dans Brevo mais reste hors de la liste
// Newsletter — la seule utilisable pour une campagne.
//
// variant 'clair' pour les formulaires posés sur un fond sombre, comme dans
// NewsletterForm.
export default function OptinNewsletter({ checked, onChange, disabled, variant = 'sombre' }) {
  const clair = variant === 'clair'

  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={`mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-sm focus:outline-none
          ${clair ? 'accent-white focus:ring-4 focus:ring-white/20' : 'accent-ocre focus:ring-4 focus:ring-ocre/10'}`}
      />
      {/* Sur le vert sombre de la filière végétale, le blanc plein est la seule
          teinte qui atteigne le contraste AA (4,55:1) : une case de consentement
          doit rester lisible. Sur fond clair, on suit les libellés voisins. */}
      <span
        className={`text-xs leading-relaxed transition-colors
          ${clair ? 'text-white' : 'text-terre/60 group-hover:text-terre/75'}`}
      >
        Je souhaite recevoir la newsletter de l'association (quelques envois par an,
        désabonnement en un clic).{' '}
        <Link
          to="/confidentialite/"
          className={clair ? 'text-white underline hover:no-underline' : 'text-ocre hover:underline'}
        >
          Vos données
        </Link>
      </span>
    </label>
  )
}
