import { Link } from 'react-router-dom'
import { useState } from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import vitrine from '../data/vitrine.json'

const BREADCRUMBS = [
  { label: 'Recyclerie Informatique', href: '/recyclerie-informatique/' },
  { label: 'Matériel disponible' },
]

const ETATS = {
  A: 'Comme neuf',
  B: 'Bon état',
  C: 'État correct',
  P: 'Pour pièces',
}

export const prix = (n) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })
    .format(Number(n || 0))

/** « le 25 août 2026 » plutôt qu'un horodatage. */
export function leJour(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function Carte({ p, vendu = false }) {
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
            Vendu
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
        <h2 className="mt-1.5 font-serif text-lg leading-snug text-terre">{p.titre}</h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-terre/60 line-clamp-3">
          {p.description}
        </p>
        <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-beige pt-3">
          <span className={`font-serif text-xl ${vendu ? 'text-terre/40 line-through' : 'text-kaki'}`}>
            {prix(p.prix)}
          </span>
          {p.etat ? (
            <span className="font-sans text-xs text-terre/50">{ETATS[p.etat] || p.etat}</span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

export default function Boutique() {
  const produits = vitrine.produits || []
  const vendus = vitrine.vendus || []
  const [choisie, setChoisie] = useState('toutes')

  /* On filtre par catégorie — « Ordinateur portable », « Disque externe » —
     et non par famille. Tout le matériel est informatique : la famille ne
     distingue rien, alors que la catégorie est ce qu'un acheteur cherche.
     Les catégories sont triées par nombre décroissant, puis par ordre
     alphabétique : les rayons fournis d'abord, et un ordre stable ensuite. */
  const categories = [...new Set([...produits, ...vendus].map((p) => p.categorie))]
    .map((c) => ({
      libelle: c,
      disponibles: produits.filter((p) => p.categorie === c).length,
    }))
    .sort((a, b) => b.disponibles - a.disponibles || a.libelle.localeCompare(b.libelle, 'fr'))

  const garder = (liste) =>
    choisie === 'toutes' ? liste : liste.filter((p) => p.categorie === choisie)

  const visibles = garder(produits)
  const vendusVisibles = garder(vendus)

  /* Le catalogue déclaré à Google : une liste de produits, chacun avec son
     prix et sa disponibilité. C'est ce qui permet aux fiches d'apparaître dans
     les résultats enrichis. */
  const schema = produits.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Matériel informatique reconditionné disponible — Recyclerie Ressources',
        numberOfItems: produits.length,
        itemListElement: produits.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://www.ressourcesrecyclerie.fr/materiel-disponible/${p.code.toLowerCase()}/`,
          name: p.titre,
        })),
      }
    : null

  return (
    <Layout breadcrumbs={BREADCRUMBS}>
      <SEO
        title="Matériel informatique reconditionné à vendre — Recyclerie Ressources (Landes 40)"
        description="Ordinateurs, écrans et périphériques reconditionnés par la recyclerie solidaire Ressources à Vielle-Saint-Girons (Landes). Matériel testé, données effacées, à voir sur place. Le stock évolue au fil des collectes."
        canonical="/materiel-disponible/"
        schema={schema}
        ogImage={produits[0] ? `https://www.ressourcesrecyclerie.fr${produits[0].photos[0].src}` : null}
        ogImageWidth={produits[0] ? 600 : 1200}
        ogImageHeight={produits[0] ? 450 : 630}
      />

      <section className="relative overflow-hidden bg-kaki py-12 text-white md:py-16">
        <div className="absolute left-0 top-0 h-1 w-full bg-ocre" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-ocre">
            Recyclerie informatique
          </p>
          <h1 className="mb-4 font-serif text-3xl text-white sm:text-4xl">
            Le matériel disponible
          </h1>
          <p className="max-w-xl leading-relaxed text-white/65">
            Chaque appareil a été collecté près de chez vous, contrôlé, testé, nettoyé, et ses
            données effacées avant d'être remis en vente. Le stock change au fil des collectes :
            ce que vous voyez ici est ce qui est en rayon aujourd'hui.
          </p>
          {vitrine.maj ? (
            <p className="mt-4 font-mono text-xs text-white/40">
              Mis à jour le {leJour(vitrine.maj)}
            </p>
          ) : null}
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {produits.length === 0 ? (
            <div className="border border-beige-dark bg-beige-light p-8 text-center md:p-12">
              <h2 className="font-serif text-2xl text-terre">
                Rien en rayon pour le moment
              </h2>
              <p className="mx-auto mt-3 max-w-lg leading-relaxed text-terre/60">
                Le matériel collecté est en cours de contrôle et de reconditionnement. Revenez dans
                quelques jours, ou écrivez-nous pour nous dire ce que vous cherchez : nous vous
                préviendrons dès qu'un appareil correspondant sera prêt.
              </p>
              <Link
                to="/contact/"
                className="mt-6 inline-block bg-kaki px-6 py-3 font-sans text-sm font-medium text-white transition-colors hover:bg-ocre"
              >
                Nous dire ce que vous cherchez
              </Link>
            </div>
          ) : (
            <>
              {categories.length > 1 ? (
                <div
                  className="mb-8 flex flex-wrap gap-2"
                  role="group"
                  aria-label="Filtrer par type de matériel"
                >
                  <button
                    type="button"
                    aria-pressed={choisie === 'toutes'}
                    onClick={() => setChoisie('toutes')}
                    className={`px-4 py-2 font-sans text-xs font-medium transition-colors ${
                      choisie === 'toutes'
                        ? 'bg-kaki text-white'
                        : 'border border-beige-dark text-terre/60 hover:border-ocre'
                    }`}
                  >
                    Tout ({produits.length})
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.libelle}
                      type="button"
                      aria-pressed={choisie === c.libelle}
                      onClick={() => setChoisie(c.libelle)}
                      className={`px-4 py-2 font-sans text-xs font-medium transition-colors ${
                        choisie === c.libelle
                          ? 'bg-kaki text-white'
                          : 'border border-beige-dark text-terre/60 hover:border-ocre'
                      }`}
                    >
                      {c.libelle} ({c.disponibles})
                    </button>
                  ))}
                </div>
              ) : null}

              {visibles.length ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {visibles.map((p) => (
                    <Carte key={p.code} p={p} />
                  ))}
                </div>
              ) : (
                <p className="border border-dashed border-beige-dark px-4 py-10 text-center text-sm text-terre/60">
                  Rien de disponible dans cette catégorie pour le moment.
                  {vendusVisibles.length ? ' Voyez ce qui vient de partir, plus bas.' : ''}
                </p>
              )}
            </>
          )}

          {/* Ce qui vient de partir. Une recyclerie se juge autant à ce qui
              sort qu'à ce qui reste : voir des appareils trouver preneur dit
              que la boutique vit. */}
          {vendusVisibles.length ? (
            <div className="mt-16 border-t border-beige-dark pt-12">
              <h2 className="font-serif text-2xl text-terre">Déjà vendus</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-terre/60">
                Ces appareils ont trouvé preneur. Le stock change vite : si l'un d'eux vous
                intéressait, dites-le-nous — il en repasse régulièrement de semblables.
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {vendusVisibles.map((p) => (
                  <Carte key={p.code} p={p} vendu />
                ))}
              </div>
            </div>
          ) : null}

          {/* Ce qu'il faut savoir avant de venir. Une vitrine n'est pas une
              boutique en ligne : rien ne se commande ici. */}
          <div className="mt-14 border border-beige-dark border-l-2 border-l-ocre bg-beige-light p-6 md:p-8">
            <h2 className="mb-3 font-serif text-xl text-terre">Comment ça se passe</h2>
            <ul className="space-y-2.5 text-sm leading-relaxed text-terre/70">
              <li>
                <strong className="text-terre">Le matériel se voit sur place.</strong> Rien ne se
                commande ni ne se réserve depuis cette page : écrivez-nous ou passez nous voir, et
                nous vous montrons l'appareil allumé.
              </li>
              <li>
                <strong className="text-terre">Les données sont effacées.</strong> Aucun appareil ne
                part en vente sans que son support de stockage ait été effacé et l'opération
                vérifiée par une seconde personne.
              </li>
              <li>
                <strong className="text-terre">Le prix est solidaire.</strong> Il couvre le temps
                passé à remettre l'appareil en état, pas davantage — c'est le sens de la recyclerie.
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/contact/"
                className="bg-kaki px-5 py-2.5 font-sans text-sm font-medium text-white transition-colors hover:bg-ocre"
              >
                Nous contacter
              </Link>
              <Link
                to="/recyclerie-informatique/reconditionnement/"
                className="border border-kaki px-5 py-2.5 font-sans text-sm font-medium text-kaki transition-colors hover:border-ocre hover:text-ocre"
              >
                Comment nous reconditionnons
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
