import { PARTENAIRES_PUBLIES, initiales } from '../data/lotsTombola'

function CartePartenaire({ nom, logo, ville, site }) {
  const contenu = (
    <>
      <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-ocre-pale">
        {logo ? (
          <img
            src={logo}
            alt={`Logo ${nom}`}
            // Pas de lazy-loading : le bandeau défile en continu et les logos
            // apparaîtraient un par un. Ils sont redimensionnés à 160 px, le
            // chargement immédiat de l'ensemble reste léger.
            width="48"
            height="48"
            className="max-w-full max-h-full object-contain transition-transform duration-300 ease-out
                       group-hover/carte:scale-110 motion-reduce:transition-none"
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

  // Partenaire sans site : carte inerte, aucun effet au survol pour ne pas
  // laisser croire qu'elle est cliquable.
  if (!site) {
    return (
      <li className="shrink-0 w-56 border border-beige-dark border-t-2 border-t-ocre/60 bg-white">
        <div className="flex items-center gap-4 p-5">{contenu}</div>
      </li>
    )
  }

  return (
    <li
      className="group/carte shrink-0 w-56 border border-beige-dark border-t-2 border-t-ocre/60 bg-white
                 transition-all duration-300 ease-out
                 hover:-translate-y-1 hover:border-ocre/40 hover:border-t-ocre
                 hover:shadow-xl hover:shadow-terre/15
                 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* tabIndex -1 : le bandeau est aria-hidden, on n'y piège pas le clavier. */}
      <a
        href={site}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        className="relative flex items-center gap-4 p-5"
      >
        {contenu}

        {/* Indice de lien externe, révélé au survol */}
        <span
          className="absolute top-2 right-2 text-ocre opacity-0 translate-x-1 translate-y-1
                     transition-all duration-300 ease-out
                     group-hover/carte:opacity-100 group-hover/carte:translate-x-0 group-hover/carte:translate-y-0"
          aria-hidden
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5h5v5M19 5l-7 7M18 14v5H5V6h5"
            />
          </svg>
        </span>
      </a>
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
        {/* py-3 : laisse la place au soulèvement et à l'ombre des cartes au
            survol, que le overflow-hidden du parent rognerait sinon. */}
        <ul className="flex gap-4 w-max py-3 animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:w-full">
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
