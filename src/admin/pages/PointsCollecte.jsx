import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { appelerApi } from '../lib/api'
import { authClient } from '../lib/authClient'
import { BandeauNonBranche, Etiquette, EtiquetteStatut, LIBELLES_STATUT, Message } from '../components/Formulaire'
import { etatOuverture, LIBELLES_OUVERTURE } from '../../../lib/points-collecte.js'

// Liste des points de collecte publics — §13 du cahier des charges.
//
// Comme pour les événements, deux informations distinctes : l'état de
// publication de la fiche, et l'état d'ouverture du point (prévu, actif,
// fermé temporairement, terminé) qui se déduit des dates.

const TONS = {
  ferme_temporairement: 'alerte',
  prevu: 'accent',
  actif: 'calme',
  termine: 'neutre',
}

export default function PointsCollecte() {
  const { data: sessionData } = authClient.useSession()
  const role = sessionData?.user?.role

  const [etat, setEtat] = useState({ chargement: true })
  const [points, setPoints] = useState([])
  const [types, setTypes] = useState([])
  const [filtreType, setFiltreType] = useState('')
  const [filtreStatut, setFiltreStatut] = useState('')
  const [recherche, setRecherche] = useState('')

  useEffect(() => {
    let annule = false
    setEtat({ chargement: true })
    const params = new URLSearchParams()
    if (filtreType) params.set('type', filtreType)
    if (filtreStatut) params.set('statut', filtreStatut)
    if (recherche.trim()) params.set('recherche', recherche.trim())

    const minuteur = setTimeout(async () => {
      const r = await appelerApi('/points-collecte' + (params.toString() ? '?' + params : ''))
      if (annule) return
      if (!r.ok) return setEtat({ chargement: false, erreur: r.erreur })
      setPoints(r.donnees.pointsCollecte || [])
      setTypes(r.donnees.types || [])
      setEtat({ chargement: false })
    }, recherche ? 300 : 0)

    return () => { annule = true; clearTimeout(minuteur) }
  }, [filtreType, filtreStatut, recherche])

  const peutCreer = ['super_admin', 'coordination', 'contributeur'].includes(role)
  const libelleType = useMemo(() => {
    const t = Object.fromEntries(types.map((x) => [x.cle, x.libelle]))
    return (c) => t[c] || '—'
  }, [types])

  return (
    <div>
      <BandeauNonBranche quoi="les points de collecte" />

      <div className="flex items-start justify-between gap-4 mb-5">
        <p className="text-sm text-terre/70 max-w-xl leading-relaxed">
          Corriger un horaire ou une adresse ici suffit : l'information n'est saisie qu'à
          un seul endroit, et se répercute partout où le point apparaît sur le site.
        </p>
        {peutCreer && (
          <Link to="/admin/points-collecte/nouveau"
            className="shrink-0 px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark transition-colors">
            Ajouter un point
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5 mb-5">
        <input type="search" value={recherche} onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher un lieu…"
          className="px-3.5 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre w-64" />
        <select value={filtreType} onChange={(e) => setFiltreType(e.target.value)}
          className="px-3 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre">
          <option value="">Tous les types</option>
          {types.map((t) => <option key={t.cle} value={t.cle}>{t.libelle}</option>)}
        </select>
        <select value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}
          className="px-3 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre">
          <option value="">Tous les états de publication</option>
          {Object.entries(LIBELLES_STATUT).map(([cle, l]) => <option key={cle} value={cle}>{l}</option>)}
        </select>
      </div>

      {etat.chargement && <p className="text-sm text-terre/50">Chargement…</p>}
      {etat.erreur && <Message type="erreur">{etat.erreur}</Message>}

      {!etat.chargement && !etat.erreur && points.length === 0 && (
        <div className="bg-white border border-beige-dark rounded-2xl p-8 text-center">
          <p className="text-terre/70 text-sm mb-1">
            {recherche || filtreType || filtreStatut
              ? 'Aucun point ne correspond à cette recherche.'
              : "Aucun point de collecte pour l'instant."}
          </p>
          {peutCreer && !recherche && !filtreType && !filtreStatut && (
            <p className="text-terre/50 text-[13px]">Commencez par « Ajouter un point » en haut à droite.</p>
          )}
        </div>
      )}

      {!etat.chargement && points.length > 0 && (
        <div className="bg-white border border-beige-dark rounded-2xl overflow-hidden">
          {points.map((p, index) => {
            const ouverture = etatOuverture(p)
            return (
              <Link key={p.id} to={`/admin/points-collecte/${p.id}`}
                className={`flex items-center gap-4 px-5 py-3.5 hover:bg-beige-light/60 transition-colors ${
                  index > 0 ? 'border-t border-beige-dark' : ''}`}>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold text-terre truncate">{p.nom}</div>
                  <div className="text-[12px] text-terre/55 truncate">
                    {libelleType(p.type)}
                    {p.commune ? ` · ${p.commune}` : ''}
                    {p.adresse ? ` · ${p.adresse}` : ''}
                  </div>
                </div>
                {!p.visibleCarte && (
                  <span className="shrink-0 text-[11px] text-terre/45">Hors carte</span>
                )}
                <Etiquette ton={TONS[ouverture]}>{LIBELLES_OUVERTURE[ouverture]}</Etiquette>
                <div className="shrink-0"><EtiquetteStatut statut={p.statut} /></div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
