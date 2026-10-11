import { LOGOS_CHALLENGE } from '../data/logosChallenge'

// Tuiles de logos des communes et points de collecte du challenge : toutes de
// même taille, dans l'ordre de la donnée, sans classement. Le nom reste dans
// l'attribut alt, et s'écrit en texte quand il n'y a pas de logo.
export default function LogosChallenge() {
  return (
    <ul className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
      {LOGOS_CHALLENGE.map(({ nom, fichier, sombre, legende }) => (
        <li
          key={nom}
          className={`flex flex-col items-center justify-center gap-1 w-36 sm:w-44 h-24 sm:h-28 px-3 rounded-xl border ${
            sombre ? 'bg-kaki border-kaki' : 'bg-white border-beige-dark'
          }`}
        >
          {fichier ? (
            <img
              src={`/logos/inauguration/${fichier}.webp`}
              alt={nom}
              loading="lazy"
              decoding="async"
              className={`block max-w-full object-contain ${legende ? 'max-h-14' : 'max-h-16 sm:max-h-20'}`}
            />
          ) : (
            <span className="font-sans text-sm font-semibold text-terre/70 text-center leading-tight">{nom}</span>
          )}
          {legende && <span className="font-sans text-[11px] font-semibold text-terre/70 leading-none">{nom}</span>}
        </li>
      ))}
    </ul>
  )
}
