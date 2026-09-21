import { useCallback, useEffect, useState } from 'react'
import SelecteurMedia from '../components/SelecteurMedia'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { appelerApi } from '../lib/api'
import { authClient } from '../lib/authClient'
import EditeurBlocs from '../components/EditeurBlocs'
import { Champ, classeSaisie, Etiquette, Message } from '../components/Formulaire'
import { BLOCS } from '../../../lib/ateliers.js'

// Fiche atelier — §11, §22 et §24.4 du cahier des charges.

const VIDE = {
  nom: '', theme: '', publicCible: '', image: '', imageAlt: '', imageCredit: '',
  description: [], objectifs: [], programme: [],
  duree: '', capacite: '', lieuPossible: '', materielNecessaire: '', modalites: '',
  surDevis: false, tarif: '', disponible: true, motifIndisponibilite: '',
  categories: [], urlDemande: '', libelleBoutonDemande: '', ordre: 0,
}

function pourFormulaire(a) {
  if (!a) return { ...VIDE }
  return {
    nom: a.nom || '', theme: a.theme || '', publicCible: a.publicCible || '',
    image: a.image || '', imageAlt: a.imageAlt || '', imageCredit: a.imageCredit || '',
    description: a.description || [], objectifs: a.objectifs || [], programme: a.programme || [],
    duree: a.duree || '', capacite: a.capacite ?? '', lieuPossible: a.lieuPossible || '',
    materielNecessaire: a.materielNecessaire || '', modalites: a.modalites || '',
    surDevis: Boolean(a.surDevis), tarif: a.tarif || '',
    disponible: a.disponible !== false, motifIndisponibilite: a.motifIndisponibilite || '',
    categories: a.categories || [], urlDemande: a.urlDemande || '',
    libelleBoutonDemande: a.libelleBoutonDemande || '', ordre: a.ordre ?? 0,
  }
}

export default function AtelierEdition() {
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
  const [categories, setCategories] = useState([])
  const [historique, setHistorique] = useState([])
  const [avance, setAvance] = useState(false)
  const [etat, setEtat] = useState({ type: 'repos' })
  const [erreursChamps, setErreursChamps] = useState({})

  const modifie = JSON.stringify(form) !== JSON.stringify(reference)

  useEffect(() => {
    let annule = false
    async function charger() {
      const r = await appelerApi('/ateliers' + (creation ? '' : '?id=' + id))
      if (annule) return
      if (!r.ok) { setChargement(false); return setEtat({ type: 'erreur', message: r.erreur }) }
      setCategories(r.donnees.categories || [])
      if (!creation) {
        const a = r.donnees.atelier
        const valeurs = pourFormulaire(a)
        setForm(valeurs); setReference(valeurs)
        setMeta({ statut: a.statut, version: a.version, id: a.id })
        setHistorique(r.donnees.historique || [])
      }
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

  const basculerCategorie = (cle) =>
    majChamp('categories', form.categories.includes(cle)
      ? form.categories.filter((c) => c !== cle)
      : [...form.categories, cle])

  async function enregistrer(statutVise) {
    setEtat({ type: 'envoi' })
    setErreursChamps({})
    const corps = { ...form, statut: statutVise, ...(creation ? {} : { id: meta.id, version: meta.version }) }
    const r = await appelerApi('/ateliers', { methode: creation ? 'POST' : 'PUT', corps })

    if (r.erreurs) {
      setErreursChamps(Object.fromEntries(r.erreurs.map((e) => [e.champ, e.message])))
      return setEtat({ type: 'erreur', message: 'Quelques informations manquent avant la mise en ligne.' })
    }
    if (r.conflit) return setEtat({ type: 'conflit', message: r.erreur })
    if (!r.ok) return setEtat({ type: 'erreur', message: r.erreur })

    const a = r.donnees.atelier
    const valeurs = pourFormulaire(a)
    setForm(valeurs); setReference(valeurs)
    setMeta({ statut: a.statut, version: a.version, id: a.id })
    setEtat({
      type: 'succes',
      message: 'Modifications enregistrées.',
      avertissement: r.donnees.deploiementDeclenche === false
        ? "L'atelier est enregistré, mais la mise en ligne du site n'a pas pu être lancée. Signalez-le à l'équipe technique."
        : null,
    })
    if (creation) navigate('/admin/ateliers/' + a.id, { replace: true })
  }

  async function supprimer() {
    if (!window.confirm('Supprimer définitivement cet atelier ? Cette action est irréversible.')) return
    const r = await appelerApi('/ateliers?id=' + meta.id, { methode: 'DELETE' })
    if (!r.ok) return setEtat({ type: 'erreur', message: r.erreur })
    navigate('/admin/ateliers')
  }

  if (chargement) return <p className="text-sm text-terre/50">Chargement…</p>

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-5">
        <Link to="/admin/ateliers" className="text-[13px] text-olive font-semibold hover:underline">
          ← Tous les ateliers
        </Link>
        <div className="flex items-center gap-3">
          {!form.disponible && <Etiquette ton="alerte">Non proposé</Etiquette>}
          <span className={`text-[12.5px] ${modifie ? 'text-ocre-dark font-semibold' : 'text-terre/45'}`}>
            {modifie ? 'Modifications non enregistrées' : creation ? 'Nouvel atelier' : 'Modifications enregistrées'}
          </span>
        </div>
      </div>

      <div className="bg-white border border-beige-dark rounded-2xl p-6 space-y-5">
        <Champ label="Nom de l'atelier" obligatoire erreur={erreursChamps.nom}>
          <input type="text" value={form.nom} disabled={lectureSeule}
            onChange={(e) => majChamp('nom', e.target.value)} className={classeSaisie(erreursChamps.nom)} />
        </Champ>

        <Champ label="À qui s'adresse-t-il ?" aide="Exemple : enfants de 8 à 12 ans, agents de collectivité, tout public."
          erreur={erreursChamps.publicCible}>
          <input type="text" value={form.publicCible} disabled={lectureSeule}
            onChange={(e) => majChamp('publicCible', e.target.value)} className={classeSaisie(erreursChamps.publicCible)} />
        </Champ>

        <div>
          <label className="block text-[13px] font-semibold text-terre mb-1.5">Catégories</label>
          <div className="flex flex-wrap gap-2">
            {categories.length === 0 && (
              <p className="text-[12.5px] text-terre/50">
                Aucune catégorie n'est encore définie.{' '}
                <Link to="/admin/ateliers/categories" className="text-olive font-semibold hover:underline">
                  En créer une
                </Link>
                .
              </p>
            )}
            {categories.map((c) => {
              const choisie = form.categories.includes(c.cle)
              return (
                <button key={c.cle} type="button" disabled={lectureSeule}
                  onClick={() => basculerCategorie(c.cle)}
                  aria-pressed={choisie}
                  className={`px-3 py-1.5 rounded-lg border text-[12.5px] font-medium transition-colors ${
                    choisie
                      ? 'bg-ocre text-white border-ocre'
                      : 'bg-white text-terre/75 border-beige-dark hover:border-ocre'
                  } disabled:opacity-50`}>
                  {c.libelle}
                </button>
              )
            })}
          </div>
          {erreursChamps.categories && <p className="text-[12px] text-red-700 mt-1.5">{erreursChamps.categories}</p>}
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-terre mb-1.5">Description</label>
          <EditeurBlocs blocs={form.description} onChange={(b) => majChamp('description', b)}
            desactive={lectureSeule} typesAutorises={Object.keys(BLOCS)} />
        </div>

        {/* §11 : « tarif ou mention sur devis ». Les deux champs sont
            exclusifs, et l'interface le montre en masquant le tarif dès que
            « sur devis » est coché — plutôt que de laisser saisir deux
            informations contradictoires. */}
        <div className="border border-beige-dark rounded-xl p-4 space-y-3">
          <label className="flex items-center gap-2.5 text-[13.5px] text-terre">
            <input type="checkbox" checked={form.surDevis} disabled={lectureSeule}
              onChange={(e) => majChamp('surDevis', e.target.checked)} className="accent-ocre" />
            Le tarif dépend de la demande (sur devis)
          </label>
          {!form.surDevis && (
            <Champ label="Tarif" aide="Exemple : 120 € la séance, ou Gratuit." erreur={erreursChamps.tarif}>
              <input type="text" value={form.tarif} disabled={lectureSeule}
                onChange={(e) => majChamp('tarif', e.target.value)} className={classeSaisie(erreursChamps.tarif)} />
            </Champ>
          )}
        </div>

        {/* La disponibilité est séparée du statut de publication : une fiche
            peut rester en ligne en indiquant que l'atelier n'est pas
            proposé en ce moment. */}
        <div className="border border-beige-dark rounded-xl p-4 bg-beige-light/40">
          <label className="flex items-center gap-2.5 text-[13.5px] font-semibold text-terre">
            <input type="checkbox" checked={!form.disponible} disabled={lectureSeule}
              onChange={(e) => majChamp('disponible', !e.target.checked)} className="accent-ocre" />
            Cet atelier n'est pas proposé en ce moment
          </label>
          {!form.disponible && (
            <div className="mt-3">
              <Champ label="Pourquoi ?" aide="La fiche reste visible : autant que la raison le soit aussi."
                erreur={erreursChamps.motifIndisponibilite}>
                <textarea rows={2} value={form.motifIndisponibilite} disabled={lectureSeule}
                  onChange={(e) => majChamp('motifIndisponibilite', e.target.value)}
                  className={classeSaisie(erreursChamps.motifIndisponibilite) + ' resize-y'} />
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
              <Champ label="Thème"><input type="text" value={form.theme} disabled={lectureSeule}
                onChange={(e) => majChamp('theme', e.target.value)} className={classeSaisie(false)} /></Champ>

              <div className="grid grid-cols-2 gap-4">
                <Champ label="Durée" aide="Exemple : 2 heures"><input type="text" value={form.duree} disabled={lectureSeule}
                  onChange={(e) => majChamp('duree', e.target.value)} className={classeSaisie(false)} /></Champ>
                <Champ label="Nombre de participants" aide="Jauge maximale." erreur={erreursChamps.capacite}>
                  <input type="number" value={form.capacite} disabled={lectureSeule}
                    onChange={(e) => majChamp('capacite', e.target.value)} className={classeSaisie(erreursChamps.capacite)} /></Champ>
              </div>

              <Champ label="Lieu possible" aide="Dans nos locaux, sur place chez vous, les deux…">
                <input type="text" value={form.lieuPossible} disabled={lectureSeule}
                  onChange={(e) => majChamp('lieuPossible', e.target.value)} className={classeSaisie(false)} /></Champ>
              <Champ label="Matériel nécessaire">
                <textarea rows={2} value={form.materielNecessaire} disabled={lectureSeule}
                  onChange={(e) => majChamp('materielNecessaire', e.target.value)}
                  className={classeSaisie(false) + ' resize-y'} /></Champ>
              <Champ label="Modalités" aide="Conditions pratiques, déroulé, ce qui est fourni.">
                <textarea rows={2} value={form.modalites} disabled={lectureSeule}
                  onChange={(e) => majChamp('modalites', e.target.value)}
                  className={classeSaisie(false) + ' resize-y'} /></Champ>

              <div>
                <label className="block text-[13px] font-semibold text-terre mb-1.5">Objectifs pédagogiques</label>
                <EditeurBlocs blocs={form.objectifs} onChange={(b) => majChamp('objectifs', b)}
                  desactive={lectureSeule} typesAutorises={Object.keys(BLOCS)} />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-terre mb-1.5">Programme</label>
                <EditeurBlocs blocs={form.programme} onChange={(b) => majChamp('programme', b)}
                  desactive={lectureSeule} typesAutorises={Object.keys(BLOCS)} />
              </div>

              <SelecteurMedia label="Photo" categorie="ateliers" valeur={form.image}
                peutImporter={!lectureSeule} onChange={(chemin) => majChamp('image', chemin)} />
              {form.image && (
                <Champ label="Description de la photo pour l'accessibilité"
                  aide="Exemple : « Des enfants démontent un ordinateur portable. »" erreur={erreursChamps.imageAlt}>
                  <input type="text" value={form.imageAlt} disabled={lectureSeule}
                    onChange={(e) => majChamp('imageAlt', e.target.value)} className={classeSaisie(erreursChamps.imageAlt)} /></Champ>
              )}

              <Champ label="Lien de demande" aide="Formulaire ou page vers laquelle envoyer les demandes.">
                <input type="text" value={form.urlDemande} disabled={lectureSeule}
                  onChange={(e) => majChamp('urlDemande', e.target.value)} className={classeSaisie(false)} /></Champ>
              <Champ label="Texte du bouton" aide="Exemple : Demander cet atelier">
                <input type="text" value={form.libelleBoutonDemande} disabled={lectureSeule}
                  onChange={(e) => majChamp('libelleBoutonDemande', e.target.value)} className={classeSaisie(false)} /></Champ>
              <Champ label="Ordre d'affichage" aide="Plus le nombre est petit, plus l'atelier apparaît tôt.">
                <input type="number" value={form.ordre} disabled={lectureSeule}
                  onChange={(e) => majChamp('ordre', e.target.value)} className={classeSaisie(false) + ' w-32'} /></Champ>
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
