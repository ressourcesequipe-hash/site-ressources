import { useCallback, useEffect, useState } from 'react'
import SelecteurMedia from '../components/SelecteurMedia'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { appelerApi } from '../lib/api'
import { authClient } from '../lib/authClient'
import EditeurBlocs from '../components/EditeurBlocs'
import { Champ, classeSaisie, Etiquette, Message, pourChampDate } from '../components/Formulaire'
import { BLOCS, etatCycleDeVie, LIBELLES_CYCLE } from '../../../lib/evenements.js'

// Création et modification d'un événement — §10, §22 et §24.4.
//
// La logique de cycle de vie est importée du même module que celui utilisé
// par l'API : l'écran ne peut donc pas afficher un état que le serveur
// calculerait autrement.

const VIDE = {
  titre: '', descriptionCourte: '', descriptionComplete: [], programme: [],
  image: '', imageAlt: '', imageCredit: '',
  debutLe: '', finLe: '', lieu: '', adresse: '', codePostal: '', commune: '',
  lienCarte: '', urlInscription: '', appelAction: '',
  annule: false, motifAnnulation: '',
  miseEnAvant: false, surAccueil: false, datePublication: '',
}

function pourFormulaire(e) {
  if (!e) return { ...VIDE }
  return {
    titre: e.titre || '', descriptionCourte: e.descriptionCourte || '',
    descriptionComplete: e.descriptionComplete || [], programme: e.programme || [],
    image: e.image || '', imageAlt: e.imageAlt || '', imageCredit: e.imageCredit || '',
    debutLe: pourChampDate(e.debutLe, true), finLe: pourChampDate(e.finLe, true),
    lieu: e.lieu || '', adresse: e.adresse || '', codePostal: e.codePostal || '',
    commune: e.commune || '', lienCarte: e.lienCarte || '',
    urlInscription: e.urlInscription || '', appelAction: e.appelAction || '',
    annule: Boolean(e.annule), motifAnnulation: e.motifAnnulation || '',
    miseEnAvant: Boolean(e.miseEnAvant), surAccueil: Boolean(e.surAccueil),
    datePublication: pourChampDate(e.datePublication, true),
  }
}

export default function EvenementEdition() {
  const { id } = useParams()
  const creation = !id || id === 'nouveau'
  const navigate = useNavigate()
  const { data: sessionData } = authClient.useSession()
  const role = sessionData?.user?.role

  const peutPublier = ['super_admin', 'coordination', 'communication'].includes(role)
  const peutSupprimer = ['super_admin', 'coordination'].includes(role)
  const lectureSeule = role === 'lecture_seule'

  const [chargement, setChargement] = useState(!creation)
  const [form, setForm] = useState({ ...VIDE })
  const [reference, setReference] = useState({ ...VIDE })
  const [meta, setMeta] = useState({ statut: 'brouillon', version: 1, id: null })
  const [historique, setHistorique] = useState([])
  const [avance, setAvance] = useState(false)
  const [etat, setEtat] = useState({ type: 'repos' })
  const [erreursChamps, setErreursChamps] = useState({})

  const modifie = JSON.stringify(form) !== JSON.stringify(reference)
  const cycle = etatCycleDeVie({ annule: form.annule, debutLe: form.debutLe || null, finLe: form.finLe || null })

  useEffect(() => {
    let annule = false
    async function charger() {
      if (creation) return setChargement(false)
      const r = await appelerApi('/evenements?id=' + id)
      if (annule) return
      if (!r.ok) { setChargement(false); return setEtat({ type: 'erreur', message: r.erreur }) }
      const e = r.donnees.evenement
      const valeurs = pourFormulaire(e)
      setForm(valeurs); setReference(valeurs)
      setMeta({ statut: e.statut, version: e.version, id: e.id })
      setHistorique(r.donnees.historique || [])
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
      debutLe: form.debutLe || null,
      finLe: form.finLe || null,
      datePublication: form.datePublication || null,
      ...(creation ? {} : { id: meta.id, version: meta.version }),
    }
    const r = await appelerApi('/evenements', { methode: creation ? 'POST' : 'PUT', corps })

    if (r.erreurs) {
      setErreursChamps(Object.fromEntries(r.erreurs.map((e) => [e.champ, e.message])))
      return setEtat({ type: 'erreur', message: 'Quelques informations manquent avant la mise en ligne.' })
    }
    if (r.conflit) return setEtat({ type: 'conflit', message: r.erreur })
    if (!r.ok) return setEtat({ type: 'erreur', message: r.erreur })

    const e = r.donnees.evenement
    const valeurs = pourFormulaire(e)
    setForm(valeurs); setReference(valeurs)
    setMeta({ statut: e.statut, version: e.version, id: e.id })
    setEtat({
      type: 'succes',
      message: 'Modifications enregistrées.',
      avertissement: r.donnees.deploiementDeclenche === false
        ? "L'événement est enregistré, mais la mise en ligne du site n'a pas pu être lancée. Signalez-le à l'équipe technique."
        : null,
    })
    if (creation) navigate('/admin/evenements/' + e.id, { replace: true })
  }

  async function supprimer() {
    if (!window.confirm('Supprimer définitivement cet événement ? Cette action est irréversible.')) return
    const r = await appelerApi('/evenements?id=' + meta.id, { methode: 'DELETE' })
    if (!r.ok) return setEtat({ type: 'erreur', message: r.erreur })
    navigate('/admin/evenements')
  }

  if (chargement) return <p className="text-sm text-terre/50">Chargement…</p>

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-5">
        <Link to="/admin/evenements" className="text-[13px] text-olive font-semibold hover:underline">
          ← Tous les événements
        </Link>
        <div className="flex items-center gap-3">
          <Etiquette ton={cycle === 'annule' ? 'alerte' : cycle === 'a_venir' ? 'accent' : 'neutre'}>
            {LIBELLES_CYCLE[cycle]}
          </Etiquette>
          <span className={`text-[12.5px] ${modifie ? 'text-ocre-dark font-semibold' : 'text-terre/45'}`}>
            {modifie ? 'Modifications non enregistrées' : creation ? 'Nouvel événement' : 'Modifications enregistrées'}
          </span>
        </div>
      </div>

      <div className="bg-white border border-beige-dark rounded-2xl p-6 space-y-5">
        <Champ label="Titre" obligatoire erreur={erreursChamps.titre}>
          <input type="text" value={form.titre} disabled={lectureSeule}
            onChange={(e) => majChamp('titre', e.target.value)} className={classeSaisie(erreursChamps.titre)} />
        </Champ>

        <Champ label="Description courte"
          aide="Deux ou trois phrases. C'est ce qui s'affiche dans les listes et lors d'un partage."
          erreur={erreursChamps.descriptionCourte}>
          <textarea rows={3} value={form.descriptionCourte} disabled={lectureSeule}
            onChange={(e) => majChamp('descriptionCourte', e.target.value)}
            className={classeSaisie(erreursChamps.descriptionCourte) + ' resize-y leading-relaxed'} />
        </Champ>

        <div className="grid grid-cols-2 gap-4">
          <Champ label="Début" erreur={erreursChamps.debutLe}>
            <input type="datetime-local" value={form.debutLe} disabled={lectureSeule}
              onChange={(e) => majChamp('debutLe', e.target.value)} className={classeSaisie(erreursChamps.debutLe)} />
          </Champ>
          <Champ label="Fin" aide="Facultatif." erreur={erreursChamps.finLe}>
            <input type="datetime-local" value={form.finLe} disabled={lectureSeule}
              onChange={(e) => majChamp('finLe', e.target.value)} className={classeSaisie(erreursChamps.finLe)} />
          </Champ>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Champ label="Lieu" aide="Exemple : Salle des fêtes" erreur={erreursChamps.lieu}>
            <input type="text" value={form.lieu} disabled={lectureSeule}
              onChange={(e) => majChamp('lieu', e.target.value)} className={classeSaisie(erreursChamps.lieu)} />
          </Champ>
          <Champ label="Commune">
            <input type="text" value={form.commune} disabled={lectureSeule}
              onChange={(e) => majChamp('commune', e.target.value)} className={classeSaisie(false)} />
          </Champ>
        </div>

        <SelecteurMedia
          label="Visuel de l'événement"
          aide="Choisissez une image de la médiathèque, ou déposez-en une nouvelle."
          categorie="evenements"
          valeur={form.image}
          peutImporter={!lectureSeule}
          onChange={(chemin) => majChamp('image', chemin)}
        />

        {form.image && (
          <Champ label="Description du visuel pour l'accessibilité"
            aide="Exemple : « Affiche de la journée portes ouvertes du 3 octobre. »"
            erreur={erreursChamps.imageAlt}>
            <input type="text" value={form.imageAlt} disabled={lectureSeule}
              onChange={(e) => majChamp('imageAlt', e.target.value)} className={classeSaisie(erreursChamps.imageAlt)} />
          </Champ>
        )}

        <div>
          <label className="block text-[13px] font-semibold text-terre mb-1.5">Présentation</label>
          <EditeurBlocs blocs={form.descriptionComplete}
            onChange={(b) => majChamp('descriptionComplete', b)} desactive={lectureSeule} typesAutorises={Object.keys(BLOCS)} />
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-terre mb-1.5">Programme</label>
          <EditeurBlocs blocs={form.programme}
            onChange={(b) => majChamp('programme', b)} desactive={lectureSeule} typesAutorises={Object.keys(BLOCS)} />
        </div>

        {/* L'annulation est séparée du reste : c'est une décision qui se
            communique, pas une case perdue parmi les options. */}
        <div className="border border-beige-dark rounded-xl p-4 bg-beige-light/40">
          <label className="flex items-center gap-2.5 text-[13.5px] font-semibold text-terre">
            <input type="checkbox" checked={form.annule} disabled={lectureSeule}
              onChange={(e) => majChamp('annule', e.target.checked)} className="accent-ocre" />
            Cet événement est annulé
          </label>
          {form.annule && (
            <div className="mt-3">
              <Champ label="Motif de l'annulation"
                aide="Ce message sera lu par les personnes qui comptaient venir."
                erreur={erreursChamps.motifAnnulation}>
                <textarea rows={2} value={form.motifAnnulation} disabled={lectureSeule}
                  onChange={(e) => majChamp('motifAnnulation', e.target.value)}
                  className={classeSaisie(erreursChamps.motifAnnulation) + ' resize-y'} />
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
              <Champ label="Adresse"><input type="text" value={form.adresse} disabled={lectureSeule}
                onChange={(e) => majChamp('adresse', e.target.value)} className={classeSaisie(false)} /></Champ>
              <Champ label="Code postal"><input type="text" value={form.codePostal} disabled={lectureSeule}
                onChange={(e) => majChamp('codePostal', e.target.value)} className={classeSaisie(false)} /></Champ>
              <Champ label="Lien vers une carte"><input type="text" value={form.lienCarte} disabled={lectureSeule}
                onChange={(e) => majChamp('lienCarte', e.target.value)} className={classeSaisie(false)} /></Champ>
              <Champ label="Lien d'inscription" aide="Billetterie ou formulaire, si nécessaire.">
                <input type="text" value={form.urlInscription} disabled={lectureSeule}
                  onChange={(e) => majChamp('urlInscription', e.target.value)} className={classeSaisie(false)} /></Champ>
              <Champ label="Texte du bouton" aide="Exemple : Réserver ma place">
                <input type="text" value={form.appelAction} disabled={lectureSeule}
                  onChange={(e) => majChamp('appelAction', e.target.value)} className={classeSaisie(false)} /></Champ>
              <Champ label="Crédit du visuel"><input type="text" value={form.imageCredit} disabled={lectureSeule}
                onChange={(e) => majChamp('imageCredit', e.target.value)} className={classeSaisie(false)} /></Champ>
              <Champ label="Date de mise en ligne"
                aide="À renseigner seulement pour programmer une publication future."
                erreur={erreursChamps.datePublication}>
                <input type="datetime-local" value={form.datePublication} disabled={lectureSeule}
                  onChange={(e) => majChamp('datePublication', e.target.value)}
                  className={classeSaisie(erreursChamps.datePublication)} /></Champ>

              <label className="flex items-center gap-2.5 text-[13px] text-terre/85">
                <input type="checkbox" checked={form.miseEnAvant} disabled={lectureSeule}
                  onChange={(e) => majChamp('miseEnAvant', e.target.checked)} className="accent-ocre" />
                Mettre cet événement en avant
              </label>
              <label className="flex items-center gap-2.5 text-[13px] text-terre/85">
                <input type="checkbox" checked={form.surAccueil} disabled={lectureSeule}
                  onChange={(e) => majChamp('surAccueil', e.target.checked)} className="accent-ocre" />
                Afficher sur la page d'accueil
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
              {etat.type === 'envoi'
                ? 'Enregistrement…'
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
