import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { appelerApi } from '../lib/api'
import { authClient } from '../lib/authClient'
import { BandeauNonBranche, Etiquette, EtiquetteStatut, LIBELLES_STATUT, Message } from '../components/Formulaire'

// Liste des ateliers — §11 du cahier des charges.
//
// Comme ailleurs, deux informations distinctes : l'état de publication de la
// fiche, et le fait que l'atelier soit proposé ou non en ce moment. Les
// confondre obligerait à dépublier une fiche pour signaler qu'un atelier
// n'est pas proposé — donc à la faire disparaître au lieu de l'expliquer.

function tarifLisible(a) {
  if (a.surDevis) return 'Sur devis'
  return a.tarif ? a.tarif : 'Tarif à préciser'
}

export default function Ateliers() {
  const { data: sessionData } = authClient.useSession()
  const role = sessionData?.user?.role

  const [etat, setEtat] = useState({ chargement: true })
  const [ateliers, setAteliers] = useState([])
  const [categories, setCategories] = useState([])
  const [filtreStatut, setFiltreStatut] = useState('')
  const [filtreDisponible, setFiltreDisponible] = useState('')
  const [recherche, setRecherche] = useState('')

  useEffect(() => {
    let annule = false
    setEtat({ chargement: true })
    const params = new URLSearchParams()
    if (filtreStatut) params.set('statut', filtreStatut)
    if (filtreDisponible) params.set('disponible', filtreDisponible)
    if (recherche.trim()) params.set('recherche', recherche.trim())

    const minuteur = setTimeout(async () => {
      const r = await appelerApi('/ateliers' + (params.toString() ? '?' + params : ''))
      if (annule) return
      if (!r.ok) return setEtat({ chargement: false, erreur: r.erreur })
      setAteliers(r.donnees.ateliers || [])
      setCategories(r.donnees.categories || [])
      setEtat({ chargement: false })
    }, recherche ? 300 : 0)

    return () => { annule = true; clearTimeout(minuteur) }
  }, [filtreStatut, filtreDisponible, recherche])

  const peutCreer = ['super_admin', 'coordination', 'contributeur'].includes(role)
  const peutGerer = ['super_admin', 'coordination'].includes(role)

  const libelleCategorie = useMemo(() => {
    const t = Object.fromEntries(categories.map((c) => [c.cle, c.libelle]))
    return (cle) => t[cle] || cle
  }, [categories])

  return (
    <div>
      <BandeauNonBranche quoi="les ateliers" />

      <div className="flex items-start justify-between gap-4 mb-5">
        <p className="text-sm text-terre/70 max-w-xl leading-relaxed">
          Un atelier momentanément non proposé reste consultable sur le site, avec
          l'explication : il n'y a pas besoin de le dépublier pour le signaler.
        </p>
        <div className="flex shrink-0 gap-2.5">
          {peutGerer && (
            <Link to="/admin/ateliers/categories"
              className="px-4 py-2.5 rounded-lg border border-beige-dark text-[13.5px] font-semibold text-terre hover:border-ocre transition-colors">
              Gérer les catégories
            </Link>
          )}
          {peutCreer && (
            <Link to="/admin/ateliers/nouveau"
              className="px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark transition-colors">
              Ajouter un atelier
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 mb-5">
        <input type="search" value={recherche} onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher un atelier…"
          className="px-3.5 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre w-64" />
        <select value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}
          className="px-3 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre">
          <option value="">Tous les états de publication</option>
          {Object.entries(LIBELLES_STATUT).map(([cle, l]) => <option key={cle} value={cle}>{l}</option>)}
        </select>
        <select value={filtreDisponible} onChange={(e) => setFiltreDisponible(e.target.value)}
          className="px-3 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre">
          <option value="">Proposés ou non</option>
          <option value="oui">Proposés actuellement</option>
          <option value="non">Non proposés</option>
        </select>
      </div>

      {etat.chargement && <p className="text-sm text-terre/50">Chargement…</p>}
      {etat.erreur && <Message type="erreur">{etat.erreur}</Message>}

      {!etat.chargement && !etat.erreur && ateliers.length === 0 && (
        <div className="bg-white border border-beige-dark rounded-2xl p-8 text-center">
          <p className="text-terre/70 text-sm mb-1">
            {recherche || filtreStatut || filtreDisponible
              ? 'Aucun atelier ne correspond à cette recherche.'
              : "Aucun atelier pour l'instant."}
          </p>
          {peutCreer && !recherche && !filtreStatut && !filtreDisponible && (
            <p className="text-terre/50 text-[13px]">Commencez par « Ajouter un atelier » en haut à droite.</p>
          )}
        </div>
      )}

      {!etat.chargement && ateliers.length > 0 && (
        <div className="bg-white border border-beige-dark rounded-2xl overflow-hidden">
          {ateliers.map((a, index) => (
            <Link key={a.id} to={`/admin/ateliers/${a.id}`}
              className={`flex items-center gap-4 px-5 py-3.5 hover:bg-beige-light/60 transition-colors ${
                index > 0 ? 'border-t border-beige-dark' : ''}`}>
              <div className="w-14 h-14 shrink-0 rounded-lg bg-beige-light border border-beige-dark overflow-hidden flex items-center justify-center">
                {a.image
                  ? <img src={a.image} alt="" className="w-full h-full object-cover" />
                  : <span className="text-terre/25 text-[10px]">sans photo</span>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-terre truncate">{a.nom}</div>
                <div className="text-[12px] text-terre/55 truncate">
                  {(a.categories || []).map(libelleCategorie).join(', ') || 'Sans catégorie'}
                  {a.publicCible ? ` · ${a.publicCible}` : ''}
                  {a.duree ? ` · ${a.duree}` : ''}
                  {` · ${tarifLisible(a)}`}
                </div>
              </div>
              {!a.disponible && <Etiquette ton="alerte">Non proposé</Etiquette>}
              <div className="shrink-0"><EtiquetteStatut statut={a.statut} /></div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
