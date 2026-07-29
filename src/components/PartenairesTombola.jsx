import { PARTENAIRES_PUBLIES, initiales } from '../data/lotsTombola'

function CartePartenaire({ nom, logo, ville, site }) {
  const contenu = (
    <>
      <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-ocre-pale">
        {logo ? (
          <img
            src={logo}
            alt={`Logo ${nom}`}
            loading="lazy"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <span className="font-serif text-lg text-ocre leading-none">{initiales(nom)}</span>
        )}
      </div>
      <div className="min-w-0">
        <p className="font-sans text-sm text-terre leading-snug">{nom}</p>
        {ville && <p className="text-xs text-terre/45 mt-0.5">{ville}</p>}
      </div>
    </>
  )

  return (
    <li className="shrink-0 w-56 border border-beige-dark border-t-2 border-t-ocre/60 bg-white">
      {site ? (
        // tabIndex -1 : le bandeau est aria-hidden, on n'y piège pas le clavier.
        <a
          href={site}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          className="flex items-center gap-4 p-5 transition-colors duration-200 hover:bg-beige-light"
        >
          {contenu}
        </a>
      ) : (
        <div className="flex items-center gap-4 p-5">{contenu}</div>
      )}
    </li>
  )
}

export default function PartenairesTombola() {
  // La liste est dupliquée pour que le défilement reboucle sans saut visible.
  const defilement = [...PARTENAIRES_PUBLIES, ...PARTENAIRES_PUBLIES]

  return (
    <div className="mb-12">
      <div className="flex items-baseline gap-3 mb-2">
        <h2 className="font-serif text-2xl text-terre">Ils offrent les lots</h2>
        <span className="font-sans text-xs text-terre/45">
          {PARTENAIRES_PUBLIES.length} partenaires
        </span>
      </div>
      <p className="text-sm text-terre/60 leading-relaxed mb-7 max-w-2xl">
        Commerçants, artisans, restaurateurs et producteurs du territoire ont
        répondu présent pour doter cette tombola. Merci à eux.
      </p>

      {/* Bandeau défilant — masqué aux lecteurs d'écran, la liste complète suit */}
      <div
        className="relative overflow-hidden group"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        }}
        aria-hidden
      >
        <ul className="flex gap-4 w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:w-full">
          {defilement.map((partenaire, i) => (
            <CartePartenaire key={`${partenaire.nom}-${i}`} {...partenaire} />
          ))}
        </ul>
      </div>

      {/* Équivalent accessible et indexable du bandeau */}
      <ul className="sr-only">
        {PARTENAIRES_PUBLIES.map(({ nom, ville }) => (
          <li key={nom}>{ville ? `${nom} — ${ville}` : nom}</li>
        ))}
      </ul>
    </div>
  )
}
