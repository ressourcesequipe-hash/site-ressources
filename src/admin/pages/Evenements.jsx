import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { appelerApi } from '../lib/api'
import { authClient } from '../lib/authClient'
import { EtiquetteStatut, Etiquette, LIBELLES_STATUT, Message } from '../components/Formulaire'
import { etatCycleDeVie, LIBELLES_CYCLE } from '../../../lib/evenements.js'

// Liste des événements — §10 du cahier des charges.
//
// Deux informations distinctes cohabitent sur chaque ligne, et c'est
// volontaire : l'état de PUBLICATION (le contenu est-il en ligne ?) et
// l'état de l'ÉVÉNEMENT (est-il à venir, passé, annulé ?). Les confondre
// empêcherait de voir qu'un événement passé est resté publié, ou qu'un
// événement imminent dort encore en brouillon.

const TONS_CYCLE = {
  annule: 'alerte',
  a_venir: 'accent',
  en_cours: 'calme',
  termine: 'neutre',
  sans_date: 'neutre',
}

function periode(e) {
  if (!e.debutLe) return 'Date à définir'
  const debut = new Date(e.debutLe)
  const fin = e.finLe ? new Date(e.finLe) : null
  const jour = (d) => d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  const heure = (d) => d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  if (!fin) return `${jour(debut)} à ${heure(debut)}`
  const memeJour = debut.toDateString() === fin.toDateString()
  return memeJour
    ? `${jour(debut)}, ${heure(debut)} – ${heure(fin)}`
    : `du ${jour(debut)} au ${jour(fin)}`
}

export default function Evenements() {
  const { data: sessionData } = authClient.useSession()
  const role = sessionData?.user?.role

  const [etat, setEtat] = useState({ chargement: true })
  const [evenements, setEvenements] = useState([])
  const [filtreStatut, setFiltreStatut] = useState('')
  const [recherche, setRecherche] = useState('')

  useEffect(() => {
    let annule = false
    setEtat({ chargement: true })
    const params = new URLSearchParams()
    if (filtreStatut) params.set('statut', filtreStatut)
    if (recherche.trim()) params.set('recherche', recherche.trim())

    const minuteur = setTimeout(async () => {
      const r = await appelerApi('/evenements' + (params.toString() ? '?' + params : ''))
      if (annule) return
      if (!r.ok) return setEtat({ chargement: false, erreur: r.erreur })
      setEvenements(r.donnees.evenements || [])
      setEtat({ chargement: false })
    }, recherche ? 300 : 0)

    return () => { annule = true; clearTimeout(minuteur) }
  }, [filtreStatut, recherche])

  const peutCreer = role && role !== 'lecture_seule'

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-5">
        <p className="text-sm text-terre/70 max-w-xl leading-relaxed">
          Les événements passés sortent d'eux-mêmes des « à venir » : leur état se
          déduit des dates, vous n'avez rien à changer une fois la date passée.
        </p>
        {peutCreer && (
          <Link
            to="/admin/evenements/nouveau"
            className="shrink-0 px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark transition-colors"
          >
            Ajouter un événement
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
          <option value="">Tous les états de publication</option>
          {Object.entries(LIBELLES_STATUT).map(([cle, libelle]) => (
            <option key={cle} value={cle}>{libelle}</option>
          ))}
        </select>
      </div>

      {etat.chargement && <p className="text-sm text-terre/50">Chargement…</p>}
      {etat.erreur && <Message type="erreur">{etat.erreur}</Message>}

      {!etat.chargement && !etat.erreur && evenements.length === 0 && (
        <div className="bg-white border border-beige-dark rounded-2xl p-8 text-center">
          <p className="text-terre/70 text-sm mb-1">
            {recherche || filtreStatut
              ? 'Aucun événement ne correspond à cette recherche.'
              : "Aucun événement pour l'instant."}
          </p>
          {peutCreer && !recherche && !filtreStatut && (
            <p className="text-terre/50 text-[13px]">
              Commencez par « Ajouter un événement » en haut à droite.
            </p>
          )}
        </div>
      )}

      {!etat.chargement && evenements.length > 0 && (
        <div className="bg-white border border-beige-dark rounded-2xl overflow-hidden">
          {evenements.map((e, index) => {
            const cycle = etatCycleDeVie(e)
            return (
              <Link
                key={e.id}
                to={`/admin/evenements/${e.id}`}
                className={`flex items-center gap-4 px-5 py-3.5 hover:bg-beige-light/60 transition-colors ${
                  index > 0 ? 'border-t border-beige-dark' : ''
                }`}
              >
                <div className="w-14 h-14 shrink-0 rounded-lg bg-beige-light border border-beige-dark overflow-hidden flex items-center justify-center">
                  {e.image ? (
                    <img src={e.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-terre/25 text-[10px]">sans visuel</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold text-terre truncate">{e.titre}</div>
                  <div className="text-[12px] text-terre/55 truncate">
                    {periode(e)}
                    {(e.lieu || e.commune) ? ` · ${[e.lieu, e.commune].filter(Boolean).join(', ')}` : ''}
                  </div>
                </div>

                <Etiquette ton={TONS_CYCLE[cycle]}>{LIBELLES_CYCLE[cycle]}</Etiquette>
                <div className="shrink-0"><EtiquetteStatut statut={e.statut} /></div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
