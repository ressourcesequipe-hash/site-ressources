import { Link } from 'react-router-dom'

const ETATS = {
  // « Comme neuf » est interdit sur un produit dit reconditionne : art. R. 122-5
  // du Code de la consommation, pris par le decret 2022-190. Ne pas y revenir.
  A: 'Très bon état',
  B: 'Bon état',
  C: 'État correct',
  P: 'Pour pièces',
}

export const prix = (n) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })
    .format(Number(n || 0))

/**
 * La carte d'un appareil, partagee par le catalogue et par l'apercu de la page
 * d'accueil. `Titre` regle le niveau du titre : h2 dans le catalogue, h3 sous
 * le titre de section de l'accueil.
 */
export default function CarteProduit({ p, vendu = false, Titre = 'h2' }) {
  return (
    <Link
      to={`/materiel-disponible/${p.code.toLowerCase()}/`}
      className={`group flex flex-col border transition-colors ${
        vendu
          ? 'border-beige bg-beige-light/50 hover:border-beige-dark'
          : 'border-beige-dark bg-white hover:border-ocre'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-beige-light">
        {vendu ? (
          <span className="absolute left-0 top-4 z-10 bg-kaki px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-white">
            {p.donne ? 'Donné' : 'Vendu'}
          </span>
        ) : null}
        <img
          src={p.photos[0].src}
          alt={`${p.titre} — ${p.categorie} reconditionné par la recyclerie Ressources`}
          loading="lazy"
          width="600"
          height="450"
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            vendu ? 'opacity-60 grayscale' : ''
          }`}
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-ocre">
          {p.categorie}
        </p>
        <Titre className="mt-1.5 font-serif text-lg leading-snug text-terre">{p.titre}</Titre>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-terre/60 line-clamp-3">
          {p.description}
        </p>
        <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-beige pt-3">
          {/* Un don n'a pas de prix a barrer : l'appareil n'a pas ete vendu, il a ete offert. */}
          {p.donne ? (
            <span className="font-serif text-xl text-terre/60">Offert</span>
          ) : (
            <span className={`font-serif text-xl ${vendu ? 'text-terre/40 line-through' : 'text-kaki'}`}>
              {prix(p.prix)}
            </span>
          )}
          {p.etat ? (
            <span className="font-sans text-xs text-terre/50">{ETATS[p.etat] || p.etat}</span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}
