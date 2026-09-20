import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { appelerApi } from '../lib/api'
import { BandeauNonBranche } from '../components/Formulaire'
import { authClient } from '../lib/authClient'

// Liste des actualités — §9 et §24.3 du cahier des charges.
//
// Volontairement une liste dense mais lisible plutôt qu'un tableau chargé
// (§24.9 : « éviter les tableaux surchargés »). Chaque ligne montre ce qui
// permet de décider quoi faire : le titre, l'état réel, et la dernière
// modification. Le reste attend la fiche.

const COULEURS_STATUT = {
  brouillon: 'bg-beige-dark/60 text-terre/70',
  a_valider: 'bg-ocre/15 text-ocre-dark',
  programme: 'bg-kaki-pale text-kaki',
  publie: 'bg-olive/15 text-olive',
  archive: 'bg-terre/10 text-terre/50',
}

const LIBELLES_STATUT = {
  brouillon: 'Brouillon',
  a_valider: 'À valider',
  programme: 'Programmé',
  publie: 'Publié',
  archive: 'Archivé',
}

function Etiquette({ statut }) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded-md text-[11.5px] font-semibold ${COULEURS_STATUT[statut] || COULEURS_STATUT.brouillon}`}>
      {LIBELLES_STATUT[statut] || statut}
    </span>
  )
}

function dateCourte(valeur) {
  if (!valeur) return '—'
  return new Date(valeur).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Actualites() {
  const { data: sessionData } = authClient.useSession()
  const role = sessionData?.user?.role

  const [etat, setEtat] = useState({ chargement: true })
  const [actualites, setActualites] = useState([])
  const [categories, setCategories] = useState([])
  const [filtreStatut, setFiltreStatut] = useState('')
  const [filtreCategorie, setFiltreCategorie] = useState('')
  const [recherche, setRecherche] = useState('')

  useEffect(() => {
    let annule = false
    setEtat({ chargement: true })
    const params = new URLSearchParams()
    if (filtreStatut) params.set('statut', filtreStatut)
    if (filtreCategorie) params.set('categorie', filtreCategorie)
    if (recherche.trim()) params.set('recherche', recherche.trim())

    // Petit délai : évite une requête à chaque frappe dans la recherche.
    const minuteur = setTimeout(async () => {
      const r = await appelerApi('/actualites' + (params.toString() ? '?' + params : ''))
      if (annule) return
      if (!r.ok) return setEtat({ chargement: false, erreur: r.erreur })
      setActualites(r.donnees.actualites || [])
      setCategories(r.donnees.categories || [])
      setEtat({ chargement: false })
    }, recherche ? 300 : 0)

    return () => { annule = true; clearTimeout(minuteur) }
  }, [filtreStatut, filtreCategorie, recherche])

  const peutCreer = role && role !== 'lecture_seule'

  const libelleCategorie = useMemo(() => {
    const table = Object.fromEntries(categories.map((c) => [c.cle, c.libelle]))
    return (cle) => table[cle] || '—'
  }, [categories])

  return (
    <div>
      <BandeauNonBranche quoi="les articles" />

      <div className="flex items-start justify-between gap-4 mb-5">
        <p className="text-sm text-terre/70 max-w-xl leading-relaxed">
          Un brouillon reste modifiable autant que nécessaire ; publier fige l’article
          et l’enregistre comme prêt à paraître.
        </p>
        {peutCreer && (
          <Link
            to="/admin/actualites/nouvelle"
            className="shrink-0 px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark transition-colors"
          >
            Ajouter une actualité
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5 mb-5">
        <input
          type="search"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher un titre…"
          className="px-3.5 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre w-64"
        />
        <select
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
          className="px-3 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre"
        >
          <option value="">Tous les états</option>
          {Object.entries(LIBELLES_STATUT).map(([cle, libelle]) => (
            <option key={cle} value={cle}>{libelle}</option>
          ))}
        </select>
        <select
          value={filtreCategorie}
          onChange={(e) => setFiltreCategorie(e.target.value)}
          className="px-3 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.cle} value={c.cle}>{c.libelle}</option>
          ))}
        </select>
      </div>

      {etat.chargement && <p className="text-sm text-terre/50">Chargement…</p>}

      {etat.erreur && (
        <p className="text-[13px] text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
          {etat.erreur}
        </p>
      )}

      {!etat.chargement && !etat.erreur && actualites.length === 0 && (
        <div className="bg-white border border-beige-dark rounded-2xl p-8 text-center">
          <p className="text-terre/70 text-sm mb-1">
            {recherche || filtreStatut || filtreCategorie
              ? 'Aucune actualité ne correspond à cette recherche.'
              : "Aucune actualité pour l'instant."}
          </p>
          {peutCreer && !recherche && !filtreStatut && !filtreCategorie && (
            <p className="text-terre/50 text-[13px]">
              Commencez par « Ajouter une actualité » en haut à droite.
            </p>
          )}
        </div>
      )}

      {!etat.chargement && actualites.length > 0 && (
        <div className="bg-white border border-beige-dark rounded-2xl overflow-hidden">
          {actualites.map((a, index) => (
            <Link
              key={a.id}
              to={`/admin/actualites/${a.id}`}
              className={`flex items-center gap-4 px-5 py-3.5 hover:bg-beige-light/60 transition-colors ${
                index > 0 ? 'border-t border-beige-dark' : ''
              }`}
            >
              <div className="w-14 h-14 shrink-0 rounded-lg bg-beige-light border border-beige-dark overflow-hidden flex items-center justify-center">
                {a.image ? (
                  <img src={a.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-terre/25 text-[10px]">sans photo</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-terre truncate">{a.titre}</div>
                <div className="text-[12px] text-terre/55 truncate">
                  {libelleCategorie(a.categorie)}
                  {a.auteurNom ? ` · ${a.auteurNom}` : ''}
                  {` · modifié le ${dateCourte(a.majLe)}`}
                </div>
              </div>

              {a.miseEnAvant && (
                <span className="shrink-0 text-[11px] text-ocre-dark font-semibold">Mise en avant</span>
              )}
              <div className="shrink-0"><Etiquette statut={a.statut} /></div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
