import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { appelerApi } from '../lib/api'
import { Etiquette, Message, dateCourte } from '../components/Formulaire'
import {
  LIBELLES_RUBRIQUE, LIBELLES_STATUT_DEMANDE, RUBRIQUES, STATUTS,
} from '../../../lib/demandes.js'

// Boîte de demandes — §15 du cahier des charges.
//
// Une boîte, pas un tableau de bord : ce que l'équipe vient y chercher, c'est
// ce qui l'attend. Le filtre par défaut ne montre donc que les demandes
// encore ouvertes, et les compteurs des rubriques comptent la même chose —
// un compteur qui inclurait l'archive dirait chaque jour un nombre plus
// grand et ne voudrait bientôt plus rien dire.

const TONS_STATUT = {
  nouveau: 'accent',
  a_traiter: 'accent',
  en_cours: 'calme',
  en_attente: 'neutre',
  traite: 'calme',
  cloture: 'neutre',
  spam: 'alerte',
}

export default function Demandes() {
  const [etat, setEtat] = useState({ chargement: true })
  const [demandes, setDemandes] = useState([])
  const [compteurs, setCompteurs] = useState({})
  const [acces, setAcces] = useState({ consulter: [], repondre: [] })
  const [equipe, setEquipe] = useState([])

  const [rubrique, setRubrique] = useState('')
  const [statut, setStatut] = useState('')
  const [assigne, setAssigne] = useState('')
  const [toutes, setToutes] = useState(false)
  const [recherche, setRecherche] = useState('')

  const params = useMemo(() => {
    const p = new URLSearchParams()
    if (rubrique) p.set('rubrique', rubrique)
    if (statut) p.set('statut', statut)
    if (assigne) p.set('assigne', assigne)
    if (toutes) p.set('ouvertes', 'toutes')
    if (recherche.trim()) p.set('recherche', recherche.trim())
    return p
  }, [rubrique, statut, assigne, toutes, recherche])

  useEffect(() => {
    let annule = false
    setEtat({ chargement: true })
    const minuteur = setTimeout(async () => {
      const r = await appelerApi('/demandes' + (params.toString() ? '?' + params : ''))
      if (annule) return
      if (!r.ok) return setEtat({ chargement: false, erreur: r.erreur })
      setDemandes(r.donnees.demandes || [])
      setCompteurs(r.donnees.compteurs || {})
      setAcces(r.donnees.acces || { consulter: [], repondre: [] })
      setEquipe(r.donnees.equipe || [])
      setEtat({ chargement: false })
    }, recherche ? 300 : 0)
    return () => { annule = true; clearTimeout(minuteur) }
  }, [params, recherche])

  const rubriquesVisibles = RUBRIQUES.filter((r) => acces.consulter.includes(r.cle))
  const totalOuvert = Object.values(compteurs).reduce((a, b) => a + b, 0)

  // L'export passe par un lien direct et non par `appelerApi` : le navigateur
  // doit recevoir un fichier, pas du JSON. Les filtres en cours sont repris
  // tels quels — on exporte ce qu'on voit à l'écran, pas autre chose.
  const lienExport = (() => {
    const p = new URLSearchParams(params)
    p.set('format', 'csv')
    return `/api/admin/demandes?${p}`
  })()

  return (
    <div>
      <p className="text-sm text-terre/70 max-w-2xl leading-relaxed mb-5">
        Chaque formulaire du site arrive ici, en plus de l'email envoyé à l'association :
        les deux continuent de fonctionner. Une demande classée en indésirable n'est
        jamais supprimée — elle sort de la boîte, on peut toujours la rouvrir.
      </p>

      {etat.erreur && <Message type="erreur">{etat.erreur}</Message>}

      {!etat.erreur && (
        <>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Onglet actif={!rubrique} onClick={() => setRubrique('')}
              libelle="Toutes" compteur={totalOuvert} />
            {rubriquesVisibles.map((r) => (
              <Onglet key={r.cle} actif={rubrique === r.cle} onClick={() => setRubrique(r.cle)}
                libelle={r.libelle} compteur={compteurs[r.cle] || 0} />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <input type="search" value={recherche} onChange={(e) => setRecherche(e.target.value)}
              placeholder="Nom, email, commune, message…"
              className="px-3.5 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre w-64" />

            <select value={statut} onChange={(e) => setStatut(e.target.value)}
              className="px-3 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre">
              <option value="">{toutes ? 'Tous les statuts' : 'À traiter (tous statuts ouverts)'}</option>
              {STATUTS.map((s) => <option key={s.cle} value={s.cle}>{s.libelle}</option>)}
            </select>

            <select value={assigne} onChange={(e) => setAssigne(e.target.value)}
              className="px-3 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre">
              <option value="">Assignées ou non</option>
              <option value="personne">Non assignées</option>
              {equipe.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>

            <label className="flex items-center gap-2 text-[13px] text-terre/70 select-none">
              <input type="checkbox" checked={toutes} disabled={Boolean(statut)}
                onChange={(e) => setToutes(e.target.checked)}
                className="accent-ocre" />
              Inclure les demandes refermées
            </label>

            <a href={lienExport} className="ml-auto px-4 py-2 rounded-lg border border-beige-dark text-[13.5px] font-semibold text-terre hover:border-ocre transition-colors">
              Exporter en CSV
            </a>
          </div>

          {etat.chargement && <p className="text-sm text-terre/50">Chargement…</p>}

          {!etat.chargement && demandes.length === 0 && (
            <div className="bg-white border border-beige-dark rounded-2xl p-8 text-center">
              <p className="text-terre/70 text-sm">
                {recherche || statut || assigne || rubrique
                  ? 'Aucune demande ne correspond à cette recherche.'
                  : toutes
                    ? "Aucune demande enregistrée pour l'instant."
                    : 'Aucune demande en attente de traitement.'}
              </p>
            </div>
          )}

          {!etat.chargement && demandes.length > 0 && (
            <div className="bg-white border border-beige-dark rounded-2xl overflow-hidden">
              {demandes.map((d, index) => (
                <Link key={d.id} to={`/admin/demandes/${d.id}`}
                  className={`flex items-start gap-4 px-5 py-3.5 hover:bg-beige-light/60 transition-colors ${
                    index > 0 ? 'border-t border-beige-dark' : ''}`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[14px] text-terre truncate ${
                        d.statut === 'nouveau' ? 'font-bold' : 'font-semibold'}`}>
                        {d.nom || d.email || 'Sans nom'}
                      </span>
                      <span className="text-[11.5px] text-terre/45 shrink-0">
                        {LIBELLES_RUBRIQUE[d.rubrique] || d.rubrique}
                      </span>
                    </div>
                    <div className="text-[12px] text-terre/55 truncate mt-0.5">
                      {[d.commune, d.email].filter(Boolean).join(' · ')}
                      {d.message ? ` — ${d.message}` : ''}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[11.5px] text-terre/45 mb-1">{dateCourte(d.creeLe)}</div>
                    {d.assigneANom && (
                      <div className="text-[11px] text-terre/55">→ {d.assigneANom}</div>
                    )}
                  </div>
                  <div className="shrink-0">
                    <Etiquette ton={TONS_STATUT[d.statut]}>
                      {LIBELLES_STATUT_DEMANDE[d.statut] || d.statut}
                    </Etiquette>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function Onglet({ actif, onClick, libelle, compteur }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-colors border ${
        actif
          ? 'bg-kaki-pale border-kaki/30 text-kaki'
          : 'bg-white border-beige-dark text-terre/70 hover:border-ocre'}`}>
      {libelle}
      {compteur > 0 && (
        <span className={`ml-2 px-1.5 py-0.5 rounded text-[11px] ${
          actif ? 'bg-kaki/15' : 'bg-ocre/15 text-ocre-dark'}`}>{compteur}</span>
      )}
    </button>
  )
}
