import { Link, useParams, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO'
import vitrine from '../data/vitrine.json'
import { prix, leJour, schemaProduit, BASE } from './Boutique'

const ETATS = {
  A: { libelle: 'Comme neuf', detail: 'Aucune trace d\'usage visible.' },
  B: { libelle: 'Bon état', detail: 'Quelques traces d\'usage, rien qui gêne.' },
  C: { libelle: 'État correct', detail: 'Marques d\'usage visibles, entièrement fonctionnel.' },
  P: { libelle: 'Pour pièces', detail: 'Vendu en l\'état, pour récupération.' },
}

export default function BoutiqueProduit() {
  const { code } = useParams()
  const produits = vitrine.produits || []
  const vendus = vitrine.vendus || []
  const cherche = (liste) =>
    liste.find((x) => x.code.toLowerCase() === String(code || '').toLowerCase())
  const p = cherche(produits) || cherche(vendus)
  const vendu = Boolean(p && p.vendu)
  const [active, setActive] = useState(0)

  // Un appareil vendu depuis la dernière publication : sa page n'existe plus.
  // On renvoie vers la vitrine plutôt que d'afficher un cadre vide.
  if (!p) return <Navigate to="/materiel-disponible/" replace />

  const etat = p.etat ? ETATS[p.etat] : null

  /* La fiche declaree a Google. Le bloc vient de Boutique.jsx, qui le sert
     aussi au catalogue : c'est ce qui garantit que le prix et la
     disponibilite annonces dans la liste sont exactement ceux de la fiche. */
  const schema = { '@context': 'https://schema.org', ...schemaProduit(p, { vendu }) }

  return (
    <Layout
      breadcrumbs={[
        { label: 'Recyclerie Informatique', href: '/recyclerie-informatique/' },
        { label: 'Matériel disponible', href: '/materiel-disponible/' },
        { label: p.titre },
      ]}
    >
      <SEO
        title={
          vendu
            ? `${p.titre} reconditionné — vendu — Recyclerie Ressources (Landes)`
            : `${p.titre} reconditionné — ${prix(p.prix)} — Recyclerie Ressources (Landes)`
        }
        description={`${p.titre} : ${p.description.slice(0, 150)}${p.description.length > 150 ? '…' : ''} Reconditionné et vérifié par la recyclerie solidaire Ressources à Vielle-Saint-Girons (40).`}
        canonical={`/materiel-disponible/${p.code.toLowerCase()}/`}
        type="product"
        schema={schema}
        ogImage={`${BASE}${p.photos[0].src}`}
        ogImageWidth={600}
        ogImageHeight={450}
        ogImageAlt={`${p.titre} reconditionné`}
      />

      <section className="bg-white py-10 md:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            {/* Les photos */}
            <div>
              <div className="relative aspect-[4/3] overflow-hidden border border-beige-dark bg-beige-light">
                {vendu ? (
                  <span className="absolute left-0 top-5 z-10 bg-kaki px-4 py-1.5 font-sans text-xs font-bold uppercase tracking-[0.15em] text-white">
                    Vendu
                  </span>
                ) : null}
                <img
                  src={p.photos[active].src}
                  alt={p.photos[active].legende || `${p.titre} — ${p.categorie} reconditionné`}
                  width="800"
                  height="600"
                  className={`h-full w-full object-cover ${vendu ? 'opacity-60 grayscale' : ''}`}
                />
              </div>
              {p.photos.length > 1 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.photos.map((ph, i) => (
                    <button
                      key={ph.src}
                      type="button"
                      onClick={() => setActive(i)}
                      className={`h-16 w-20 overflow-hidden border transition-colors ${
                        i === active ? 'border-ocre' : 'border-beige-dark hover:border-ocre/50'
                      }`}
                      aria-label={`Photo ${i + 1} de ${p.titre}`}
                    >
                      <img
                        src={ph.src}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* La fiche */}
            <div>
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-ocre">
                {p.categorie}
              </p>
              <h1 className="mt-2 font-serif text-3xl leading-tight text-terre">{p.titre}</h1>

              <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                <span
                  className={`font-serif text-3xl ${vendu ? 'text-terre/40 line-through' : 'text-kaki'}`}
                >
                  {prix(p.prix)}
                </span>
                {etat ? (
                  <span className="font-sans text-sm text-terre/60">
                    {etat.libelle} — {etat.detail}
                  </span>
                ) : null}
              </div>

              <p className="mt-5 leading-relaxed text-terre/70">{p.description}</p>

              {p.caracteristiques.length ? (
                <dl className="mt-7 border-t border-beige">
                  {p.caracteristiques.map((c) => (
                    <div
                      key={c.libelle}
                      className="flex justify-between gap-4 border-b border-beige py-2.5"
                    >
                      <dt className="text-sm text-terre/50">{c.libelle}</dt>
                      <dd className="text-right text-sm font-medium text-terre">
                        {c.valeur}
                        {c.unite ? ` ${c.unite}` : ''}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {vendu ? (
                <div className="mt-7 border border-beige-dark bg-beige-light p-6">
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-ocre">
                    Cet appareil est parti
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-terre/70">
                    Il a trouvé preneur{p.vendu_le ? ' le ' + leJour(p.vendu_le) : ''}. Du matériel
                    semblable repasse régulièrement : dites-nous ce que vous cherchez, et nous vous
                    préviendrons.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      to="/materiel-disponible/"
                      className="bg-kaki px-5 py-2.5 font-sans text-sm font-medium text-white transition-colors hover:bg-ocre"
                    >
                      Voir ce qui est disponible
                    </Link>
                    <Link
                      to="/contact/"
                      className="border border-kaki px-5 py-2.5 font-sans text-sm font-medium text-kaki transition-colors hover:border-ocre hover:text-ocre"
                    >
                      Nous dire ce que vous cherchez
                    </Link>
                  </div>
                </div>
              ) : (
              <div className="mt-7 bg-kaki p-6 text-white">
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-ocre">
                  Pour le voir
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  Cet appareil se voit sur place, allumé. Écrivez-nous en mentionnant sa référence{' '}
                  <span className="font-mono text-white">{p.code}</span>, et nous convenons d'un
                  moment.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={`mailto:contact@ressourcesrecyclerie.fr?subject=${encodeURIComponent(
                      `Matériel ${p.code} — ${p.titre}`
                    )}`}
                    className="bg-ocre px-5 py-2.5 font-sans text-sm font-medium text-white transition-colors hover:bg-ocre-dark"
                  >
                    Écrire à propos de cet appareil
                  </a>
                  <a
                    href="tel:+33662660484"
                    className="border border-white/30 px-5 py-2.5 font-sans text-sm font-medium text-white transition-colors hover:border-ocre hover:text-ocre"
                  >
                    06 62 66 04 84
                  </a>
                </div>
              </div>
              )}

              <p className="mt-5 text-xs leading-relaxed text-terre/50">
                Le support de stockage a été{' '}
                <Link
                  to="/recyclerie-informatique/effacement-donnees/"
                  className="text-kaki underline decoration-ocre/40 underline-offset-2 hover:text-ocre"
                >
                  effacé
                </Link>{' '}
                et l'opération vérifiée par une seconde personne avant la mise en vente. L'appareil
                a suivi{' '}
                <Link
                  to="/recyclerie-informatique/reconditionnement/"
                  className="text-kaki underline decoration-ocre/40 underline-offset-2 hover:text-ocre"
                >
                  notre parcours de reconditionnement
                </Link>
                , et les{' '}
                <Link
                  to="/recyclerie-informatique/beneficiaires/"
                  className="text-kaki underline decoration-ocre/40 underline-offset-2 hover:text-ocre"
                >
                  conditions de vente
                </Link>{' '}
                s'appliquent.
                {vitrine.maj ? ` Disponibilité constatée le ${leJour(vitrine.maj)}.` : ''}
              </p>

              <Link
                to="/materiel-disponible/"
                className="mt-6 inline-block font-sans text-sm font-medium text-kaki transition-colors hover:text-ocre"
              >
                ← Tout le matériel disponible
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
