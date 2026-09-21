import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { appelerApi } from '../lib/api'
import { authClient } from '../lib/authClient'
import { Champ, classeSaisie, Etiquette, Message, pourChampDate } from '../components/Formulaire'
import EditeurHoraires from '../components/EditeurHoraires'
import { etatOuverture, LIBELLES_OUVERTURE } from '../../../lib/points-collecte.js'

// Fiche d'un point de collecte public — §13 du cahier des charges.
//
// Rappel du §13 : ce module décrit les lieux de dépôt ouverts au public. Il
// ne remplace pas la traçabilité des collectes, qui reste dans
// Ressources 360.

const VIDE = {
  nom: '', type: '', organisationId: '', adresse: '', complementAdresse: '',
  codePostal: '', commune: '', latitude: '', longitude: '',
  horaires: [], consignes: '', informationsTemporaires: '',
  campagne: '', debutLe: '', finLe: '',
  fermeTemporairement: false, motifFermeture: '',
  visibleCarte: true, visibleListe: true, ordre: 0,
}

function pourFormulaire(p) {
  if (!p) return { ...VIDE }
  return {
    nom: p.nom || '', type: p.type || '', organisationId: p.organisationId ?? '',
    adresse: p.adresse || '', complementAdresse: p.complementAdresse || '',
    codePostal: p.codePostal || '', commune: p.commune || '',
    latitude: p.latitude || '', longitude: p.longitude || '',
    horaires: p.horaires || [], consignes: p.consignes || '',
    informationsTemporaires: p.informationsTemporaires || '',
    campagne: p.campagne || '', debutLe: pourChampDate(p.debutLe), finLe: pourChampDate(p.finLe),
    fermeTemporairement: Boolean(p.fermeTemporairement), motifFermeture: p.motifFermeture || '',
    visibleCarte: p.visibleCarte !== false, visibleListe: p.visibleListe !== false,
    ordre: p.ordre ?? 0,
  }
}

export default function PointCollecteEdition() {
  const { id } = useParams()
  const creation = !id || id === 'nouveau'
  const navigate = useNavigate()
  const { data: sessionData } = authClient.useSession()
  const role = sessionData?.user?.role

  const peutPublier = ['super_admin', 'coordination'].includes(role)
  const peutSupprimer = ['super_admin', 'coordination'].includes(role)
  const lectureSeule = role === 'lecture_seule'

  const [chargement, setChargement] = useState(true)
  const [form, setForm] = useState({ ...VIDE })
  const [reference, setReference] = useState({ ...VIDE })
  const [meta, setMeta] = useState({ statut: 'brouillon', version: 1, id: null })
  const [types, setTypes] = useState([])
  const [jours, setJours] = useState([])
  const [organisations, setOrganisations] = useState([])
  const [historique, setHistorique] = useState([])
  const [avance, setAvance] = useState(false)
  const [etat, setEtat] = useState({ type: 'repos' })
  const [erreursChamps, setErreursChamps] = useState({})

  const modifie = JSON.stringify(form) !== JSON.stringify(reference)
  const ouverture = etatOuverture({
    fermeTemporairement: form.fermeTemporairement,
    debutLe: form.debutLe || null,
    finLe: form.finLe || null,
  })

  useEffect(() => {
    let annule = false
    async function charger() {
      const r = await appelerApi('/points-collecte' + (creation ? '' : '?id=' + id))
      if (annule) return
      if (!r.ok) { setChargement(false); return setEtat({ type: 'erreur', message: r.erreur }) }
      setTypes(r.donnees.types || [])
      setJours(r.donnees.jours || [])
      if (!creation) {
        const p = r.donnees.pointCollecte
        const valeurs = pourFormulaire(p)
        setForm(valeurs); setReference(valeurs)
        setMeta({ statut: p.statut, version: p.version, id: p.id })
        setHistorique(r.donnees.historique || [])
      }
      // Les organisations alimentent le rattachement (§13 : « organisation
      // liée », dont le point peut hériter logo et commune).
      const ro = await appelerApi('/organisations')
      if (!annule && ro.ok) setOrganisations(ro.donnees.organisations || [])
      setChargement(false)
    }
    charger()
    return () => { annule = true }
  }, [id, creation])

  useEffect(() => {
    if (!modifie) return
    const avertir = (e) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', avertir)
    return () => window.removeEventListener('beforeunload', avertir)
  }, [modifie])

  const majChamp = useCallback((cle, valeur) => {
    setForm((f) => ({ ...f, [cle]: valeur }))
    setErreursChamps((e) => (e[cle] ? { ...e, [cle]: undefined } : e))
  }, [])

  async function enregistrer(statutVise) {
    setEtat({ type: 'envoi' })
    setErreursChamps({})
    const corps = {
      ...form,
      statut: statutVise,
      organisationId: form.organisationId || null,
      debutLe: form.debutLe || null,
      finLe: form.finLe || null,
      ...(creation ? {} : { id: meta.id, version: meta.version }),
    }
    const r = await appelerApi('/points-collecte', { methode: creation ? 'POST' : 'PUT', corps })

    if (r.erreurs) {
      setErreursChamps(Object.fromEntries(r.erreurs.map((e) => [e.champ, e.message])))
      return setEtat({ type: 'erreur', message: 'Quelques informations manquent avant la mise en ligne.' })
    }
    if (r.conflit) return setEtat({ type: 'conflit', message: r.erreur })
    if (!r.ok) return setEtat({ type: 'erreur', message: r.erreur })

    const p = r.donnees.pointCollecte
    const valeurs = pourFormulaire(p)
    setForm(valeurs); setReference(valeurs)
    setMeta({ statut: p.statut, version: p.version, id: p.id })
    setEtat({
      type: 'succes',
      message: 'Modifications enregistrées.',
      avertissement: r.donnees.deploiementDeclenche === false
        ? "Le point est enregistré, mais la mise en ligne du site n'a pas pu être lancée. Signalez-le à l'équipe technique."
        : null,
    })
    if (creation) navigate('/admin/points-collecte/' + p.id, { replace: true })
  }

  async function supprimer() {
    if (!window.confirm('Supprimer définitivement ce point de collecte ? Cette action est irréversible.')) return
    const r = await appelerApi('/points-collecte?id=' + meta.id, { methode: 'DELETE' })
    if (!r.ok) return setEtat({ type: 'erreur', message: r.erreur })
    navigate('/admin/points-collecte')
  }

  if (chargement) return <p className="text-sm text-terre/50">Chargement…</p>

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-5">
        <Link to="/admin/points-collecte" className="text-[13px] text-olive font-semibold hover:underline">
          ← Tous les points de collecte
        </Link>
        <div className="flex items-center gap-3">
          <Etiquette ton={ouverture === 'ferme_temporairement' ? 'alerte' : ouverture === 'prevu' ? 'accent' : 'neutre'}>
            {LIBELLES_OUVERTURE[ouverture]}
          </Etiquette>
          <span className={`text-[12.5px] ${modifie ? 'text-ocre-dark font-semibold' : 'text-terre/45'}`}>
            {modifie ? 'Modifications non enregistrées' : creation ? 'Nouveau point' : 'Modifications enregistrées'}
          </span>
        </div>
      </div>

      <div className="bg-white border border-beige-dark rounded-2xl p-6 space-y-5">
        <Champ label="Nom du lieu" obligatoire aide="Exemple : Mairie de Castets" erreur={erreursChamps.nom}>
          <input type="text" value={form.nom} disabled={lectureSeule}
            onChange={(e) => majChamp('nom', e.target.value)} className={classeSaisie(erreursChamps.nom)} />
        </Champ>

        <Champ label="Type de point" erreur={erreursChamps.type}>
          <select value={form.type} disabled={lectureSeule}
            onChange={(e) => majChamp('type', e.target.value)} className={classeSaisie(erreursChamps.type)}>
            <option value="">Choisir…</option>
            {types.map((t) => <option key={t.cle} value={t.cle}>{t.libelle}</option>)}
          </select>
        </Champ>

        <Champ label="Adresse" erreur={erreursChamps.adresse}>
          <input type="text" value={form.adresse} disabled={lectureSeule}
            onChange={(e) => majChamp('adresse', e.target.value)} className={classeSaisie(erreursChamps.adresse)} />
        </Champ>

        <div className="grid grid-cols-3 gap-4">
          <Champ label="Code postal">
            <input type="text" value={form.codePostal} disabled={lectureSeule}
              onChange={(e) => majChamp('codePostal', e.target.value)} className={classeSaisie(false)} />
          </Champ>
          <div className="col-span-2">
            <Champ label="Commune" erreur={erreursChamps.commune}>
              <input type="text" value={form.commune} disabled={lectureSeule}
                onChange={(e) => majChamp('commune', e.target.value)} className={classeSaisie(erreursChamps.commune)} />
            </Champ>
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-terre mb-1.5">Horaires d'ouverture</label>
          <EditeurHoraires horaires={form.horaires} jours={jours}
            onChange={(h) => majChamp('horaires', h)} desactive={lectureSeule} />
        </div>

        <Champ label="Consignes de dépôt"
          aide="Ce qui est accepté, ce qui ne l'est pas, où se présenter.">
          <textarea rows={3} value={form.consignes} disabled={lectureSeule}
            onChange={(e) => majChamp('consignes', e.target.value)}
            className={classeSaisie(false) + ' resize-y leading-relaxed'} />
        </Champ>

        {/* La fermeture temporaire est mise en évidence : c'est
            l'information qu'une personne en route vers le point doit voir. */}
        <div className="border border-beige-dark rounded-xl p-4 bg-beige-light/40">
          <label className="flex items-center gap-2.5 text-[13.5px] font-semibold text-terre">
            <input type="checkbox" checked={form.fermeTemporairement} disabled={lectureSeule}
              onChange={(e) => majChamp('fermeTemporairement', e.target.checked)} className="accent-ocre" />
            Ce point est fermé temporairement
          </label>
          {form.fermeTemporairement && (
            <div className="mt-3">
              <Champ label="Motif de la fermeture"
                aide="Ce message sera lu par les personnes qui comptaient y déposer du matériel."
                erreur={erreursChamps.motifFermeture}>
                <textarea rows={2} value={form.motifFermeture} disabled={lectureSeule}
                  onChange={(e) => majChamp('motifFermeture', e.target.value)}
                  className={classeSaisie(erreursChamps.motifFermeture) + ' resize-y'} />
              </Champ>
            </div>
          )}
        </div>

        <div className="border-t border-beige-dark pt-4">
          <button type="button" onClick={() => setAvance((v) => !v)}
            className="text-[13px] font-semibold text-terre/70 hover:text-ocre-dark">
            {avance ? '▾' : '▸'} Options avancées
          </button>

          {avance && (
            <div className="mt-4 space-y-4">
              <Champ label="Organisation liée"
                aide="Si le lieu appartient à un partenaire déjà enregistré, le rattacher évite de ressaisir ses informations.">
                <select value={form.organisationId} disabled={lectureSeule}
                  onChange={(e) => majChamp('organisationId', e.target.value)} className={classeSaisie(false)}>
                  <option value="">Aucune</option>
                  {organisations.map((o) => <option key={o.id} value={o.id}>{o.nom}</option>)}
                </select>
              </Champ>

              <Champ label="Complément d'adresse" aide="Bâtiment, étage, accès.">
                <input type="text" value={form.complementAdresse} disabled={lectureSeule}
                  onChange={(e) => majChamp('complementAdresse', e.target.value)} className={classeSaisie(false)} />
              </Champ>

              <div className="grid grid-cols-2 gap-4">
                <Champ label="Latitude" aide="Exemple : 43.8812" erreur={erreursChamps.latitude}>
                  <input type="text" value={form.latitude} disabled={lectureSeule}
                    onChange={(e) => majChamp('latitude', e.target.value)} className={classeSaisie(erreursChamps.latitude)} />
                </Champ>
                <Champ label="Longitude" aide="Exemple : -1.1523" erreur={erreursChamps.longitude}>
                  <input type="text" value={form.longitude} disabled={lectureSeule}
                    onChange={(e) => majChamp('longitude', e.target.value)} className={classeSaisie(erreursChamps.longitude)} />
                </Champ>
              </div>

              <Champ label="Informations temporaires"
                aide="Un message ponctuel : travaux, changement d'accès, opération spéciale.">
                <textarea rows={2} value={form.informationsTemporaires} disabled={lectureSeule}
                  onChange={(e) => majChamp('informationsTemporaires', e.target.value)}
                  className={classeSaisie(false) + ' resize-y'} />
              </Champ>

              <Champ label="Campagne associée" aide="Si ce point n'existe que pour une opération ponctuelle.">
                <input type="text" value={form.campagne} disabled={lectureSeule}
                  onChange={(e) => majChamp('campagne', e.target.value)} className={classeSaisie(false)} />
              </Champ>

              <div className="grid grid-cols-2 gap-4">
                <Champ label="Ouvert à partir du"><input type="date" value={form.debutLe} disabled={lectureSeule}
                  onChange={(e) => majChamp('debutLe', e.target.value)} className={classeSaisie(false)} /></Champ>
                <Champ label="Jusqu'au" erreur={erreursChamps.finLe}>
                  <input type="date" value={form.finLe} disabled={lectureSeule}
                    onChange={(e) => majChamp('finLe', e.target.value)} className={classeSaisie(erreursChamps.finLe)} /></Champ>
              </div>

              <Champ label="Ordre d'affichage" aide="Plus le nombre est petit, plus le point apparaît tôt.">
                <input type="number" value={form.ordre} disabled={lectureSeule}
                  onChange={(e) => majChamp('ordre', e.target.value)} className={classeSaisie(false) + ' w-32'} />
              </Champ>

              <label className="flex items-center gap-2.5 text-[13px] text-terre/85">
                <input type="checkbox" checked={form.visibleCarte} disabled={lectureSeule}
                  onChange={(e) => majChamp('visibleCarte', e.target.checked)} className="accent-ocre" />
                Afficher sur la carte
              </label>
              <label className="flex items-center gap-2.5 text-[13px] text-terre/85">
                <input type="checkbox" checked={form.visibleListe} disabled={lectureSeule}
                  onChange={(e) => majChamp('visibleListe', e.target.checked)} className="accent-ocre" />
                Afficher dans la liste
              </label>
            </div>
          )}
        </div>

        {etat.type === 'conflit' && <Message type="avertissement">{etat.message}</Message>}
        {etat.type === 'erreur' && <Message type="erreur">{etat.message}</Message>}
        {etat.type === 'succes' && (
          <Message type="succes">
            {etat.message}
            {etat.avertissement && <p className="text-ocre-dark mt-1.5">{etat.avertissement}</p>}
          </Message>
        )}

        {!lectureSeule && (
          <div className="flex flex-wrap items-center gap-2.5 border-t border-beige-dark pt-4">
            <button type="button" onClick={() => enregistrer(meta.statut === 'publie' ? 'publie' : 'brouillon')}
              disabled={etat.type === 'envoi'}
              className="px-4 py-2.5 rounded-lg border border-beige-dark text-[13.5px] font-semibold text-terre hover:border-ocre disabled:opacity-40">
              {etat.type === 'envoi' ? 'Enregistrement…'
                : meta.statut === 'publie' ? 'Enregistrer les modifications' : 'Enregistrer le brouillon'}
            </button>
            {!peutPublier && (
              <button type="button" onClick={() => enregistrer('a_valider')} disabled={etat.type === 'envoi'}
                className="px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark disabled:opacity-40">
                Demander la validation
              </button>
            )}
            {peutPublier && (
              <button type="button" onClick={() => enregistrer('publie')} disabled={etat.type === 'envoi'}
                className="px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark disabled:opacity-40">
                Publier
              </button>
            )}
            {!creation && meta.statut !== 'archive' && (
              <button type="button" onClick={() => enregistrer('archive')} disabled={etat.type === 'envoi'}
                className="px-4 py-2.5 rounded-lg border border-beige-dark text-[13.5px] font-semibold text-terre/70 hover:border-ocre">
                Archiver
              </button>
            )}
            {!creation && peutSupprimer && (
              <button type="button" onClick={supprimer}
                className="ml-auto text-[13px] text-red-700/80 hover:text-red-700 hover:underline">
                Supprimer définitivement
              </button>
            )}
          </div>
        )}
      </div>

      {!creation && historique.length > 0 && (
        <div className="mt-6 bg-white border border-beige-dark rounded-2xl p-6">
          <h2 className="font-serif text-base text-terre mb-3">Historique des modifications</h2>
          <ul className="space-y-1.5">
            {historique.slice(0, 10).map((h) => (
              <li key={h.id} className="text-[12.5px] text-terre/65">
                {new Date(h.creeLe).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
                {' — '}
                {{ creation: 'création', modification: 'modification', changement_statut: 'changement d’état', suppression: 'suppression' }[h.typeModification] || h.typeModification}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
