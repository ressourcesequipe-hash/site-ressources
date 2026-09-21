import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { appelerApi } from '../lib/api'
import { authClient } from '../lib/authClient'
import { BandeauNonBranche, Etiquette, EtiquetteStatut, LIBELLES_STATUT, Message } from '../components/Formulaire'
import { estProtegee } from '../../../lib/pages.js'

// Liste des pages institutionnelles — §8 du cahier des charges.
//
// Les pages protégées (§8.4) sont signalées dans la liste, et pas seulement
// dans leur fiche : quelqu'un qui cherche pourquoi il ne peut pas modifier
// une page doit le comprendre avant de l'ouvrir.

export default function Pages() {
  const { data: sessionData } = authClient.useSession()
  const role = sessionData?.user?.role

  const [etat, setEtat] = useState({ chargement: true })
  const [pages, setPages] = useState([])
  const [filtreStatut, setFiltreStatut] = useState('')
  const [recherche, setRecherche] = useState('')

  useEffect(() => {
    let annule = false
    setEtat({ chargement: true })
    const params = new URLSearchParams()
    if (filtreStatut) params.set('statut', filtreStatut)
    if (recherche.trim()) params.set('recherche', recherche.trim())

    const minuteur = setTimeout(async () => {
      const r = await appelerApi('/pages' + (params.toString() ? '?' + params : ''))
      if (annule) return
      if (!r.ok) return setEtat({ chargement: false, erreur: r.erreur })
      setPages(r.donnees.pages || [])
      setEtat({ chargement: false })
    }, recherche ? 300 : 0)

    return () => { annule = true; clearTimeout(minuteur) }
  }, [filtreStatut, recherche])

  const peutCreer = ['super_admin', 'coordination', 'contributeur'].includes(role)

  return (
    <div>
      <BandeauNonBranche quoi="les pages enregistrées ici" />

      <div className="flex items-start justify-between gap-4 mb-5">
        <p className="text-sm text-terre/70 max-w-xl leading-relaxed">
          Les pages signalées « juridique » engagent l'association : seules la
          Coordination et le Super administrateur peuvent les modifier, et toute
          modification passe par une validation avant mise en ligne.
        </p>
        {peutCreer && (
          <Link to="/admin/pages/nouvelle"
            className="shrink-0 px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark transition-colors">
            Ajouter une page
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5 mb-5">
        <input type="search" value={recherche} onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher une page…"
          className="px-3.5 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre w-64" />
        <select value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}
          className="px-3 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre">
          <option value="">Tous les états</option>
          {Object.entries(LIBELLES_STATUT).map(([cle, l]) => <option key={cle} value={cle}>{l}</option>)}
        </select>
      </div>

      {etat.chargement && <p className="text-sm text-terre/50">Chargement…</p>}
      {etat.erreur && <Message type="erreur">{etat.erreur}</Message>}

      {!etat.chargement && !etat.erreur && pages.length === 0 && (
        <div className="bg-white border border-beige-dark rounded-2xl p-8 text-center">
          <p className="text-terre/70 text-sm mb-1">
            {recherche || filtreStatut
              ? 'Aucune page ne correspond à cette recherche.'
              : "Aucune page pour l'instant."}
          </p>
          {peutCreer && !recherche && !filtreStatut && (
            <p className="text-terre/50 text-[13px]">Commencez par « Ajouter une page » en haut à droite.</p>
          )}
        </div>
      )}

      {!etat.chargement && pages.length > 0 && (
        <div className="bg-white border border-beige-dark rounded-2xl overflow-hidden">
          {pages.map((p, index) => (
            <Link key={p.id} to={`/admin/pages/${p.id}`}
              className={`flex items-center gap-4 px-5 py-3.5 hover:bg-beige-light/60 transition-colors ${
                index > 0 ? 'border-t border-beige-dark' : ''}`}>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-terre truncate">{p.titreInterne}</div>
                <div className="text-[12px] text-terre/55 truncate">
                  /{p.slug}
                  {p.titrePublic && p.titrePublic !== p.titreInterne ? ` · « ${p.titrePublic} »` : ''}
                </div>
              </div>
              {estProtegee(p) && <Etiquette ton="accent">Juridique</Etiquette>}
              <div className="shrink-0"><EtiquetteStatut statut={p.statut} /></div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
