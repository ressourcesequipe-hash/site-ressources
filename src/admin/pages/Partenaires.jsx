import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { appelerApi } from '../lib/api'
import { authClient } from '../lib/authClient'
import { BandeauNonBranche, EtiquetteStatut, LIBELLES_STATUT, Message } from '../components/Formulaire'

// Liste des partenaires et mécènes — §12 du cahier des charges.
//
// Le suivi interne de la relation (prospect, convention signée…) est affiché
// discrètement, en texte : c'est une information de travail, pas un état à
// mettre en évidence. Il ne quitte jamais le back-office.

export default function Partenaires() {
  const { data: sessionData } = authClient.useSession()
  const role = sessionData?.user?.role

  const [etat, setEtat] = useState({ chargement: true })
  const [organisations, setOrganisations] = useState([])
  const [types, setTypes] = useState([])
  const [statutsPartenariat, setStatutsPartenariat] = useState([])
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
      const r = await appelerApi('/organisations' + (params.toString() ? '?' + params : ''))
      if (annule) return
      if (!r.ok) return setEtat({ chargement: false, erreur: r.erreur })
      setOrganisations(r.donnees.organisations || [])
      setTypes(r.donnees.types || [])
      setStatutsPartenariat(r.donnees.statutsPartenariat || [])
      setEtat({ chargement: false })
    }, recherche ? 300 : 0)

    return () => { annule = true; clearTimeout(minuteur) }
  }, [filtreType, filtreStatut, recherche])

  const peutCreer = ['super_admin', 'coordination', 'contributeur'].includes(role)

  const libelle = useMemo(() => {
    const t = Object.fromEntries(types.map((x) => [x.cle, x.libelle]))
    const s = Object.fromEntries(statutsPartenariat.map((x) => [x.cle, x.libelle]))
    return { type: (c) => t[c] || '—', partenariat: (c) => s[c] || '' }
  }, [types, statutsPartenariat])

  return (
    <div>
      <BandeauNonBranche quoi="les partenaires enregistrés ici" />

      <div className="flex items-start justify-between gap-4 mb-5">
        <p className="text-sm text-terre/70 max-w-xl leading-relaxed">
          Une seule fiche par organisation, quel que soit son rôle : une commune peut
          être partenaire et accueillir un point de collecte sans être saisie deux fois.
        </p>
        {peutCreer && (
          <Link to="/admin/partenaires/nouveau"
            className="shrink-0 px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark transition-colors">
            Ajouter un partenaire
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5 mb-5">
        <input type="search" value={recherche} onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher un nom…"
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

      {!etat.chargement && !etat.erreur && organisations.length === 0 && (
        <div className="bg-white border border-beige-dark rounded-2xl p-8 text-center">
          <p className="text-terre/70 text-sm mb-1">
            {recherche || filtreType || filtreStatut
              ? 'Aucun partenaire ne correspond à cette recherche.'
              : "Aucun partenaire pour l'instant."}
          </p>
          {peutCreer && !recherche && !filtreType && !filtreStatut && (
            <p className="text-terre/50 text-[13px]">Commencez par « Ajouter un partenaire » en haut à droite.</p>
          )}
        </div>
      )}

      {!etat.chargement && organisations.length > 0 && (
        <div className="bg-white border border-beige-dark rounded-2xl overflow-hidden">
          {organisations.map((o, index) => (
            <Link key={o.id} to={`/admin/partenaires/${o.id}`}
              className={`flex items-center gap-4 px-5 py-3.5 hover:bg-beige-light/60 transition-colors ${
                index > 0 ? 'border-t border-beige-dark' : ''}`}>
              <div className="w-14 h-14 shrink-0 rounded-lg bg-white border border-beige-dark overflow-hidden flex items-center justify-center p-1.5">
                {o.logo
                  ? <img src={o.logo} alt="" className="max-w-full max-h-full object-contain" />
                  : <span className="text-terre/25 text-[10px]">sans logo</span>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-terre truncate">{o.nom}</div>
                <div className="text-[12px] text-terre/55 truncate">
                  {libelle.type(o.type)}
                  {o.commune ? ` · ${o.commune}` : ''}
                  {o.libellePublic ? ` · « ${o.libellePublic} »` : ''}
                  {libelle.partenariat(o.statutPartenariat) ? ` · ${libelle.partenariat(o.statutPartenariat)}` : ''}
                </div>
              </div>
              {o.surAccueil && <span className="shrink-0 text-[11px] text-ocre-dark font-semibold">Sur l’accueil</span>}
              <div className="shrink-0"><EtiquetteStatut statut={o.statut} /></div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
