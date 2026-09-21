import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { appelerApi } from '../lib/api'
import { authClient } from '../lib/authClient'
import { Champ, classeSaisie, Message, pourChampDate } from '../components/Formulaire'

// Fiche partenaire — §12 et §24.4 du cahier des charges.
//
// Le §24.4 décrit précisément le parcours attendu : « saisir le nom,
// ajouter son logo, sélectionner le type, saisir une courte présentation,
// prévisualiser, publier », et précise que « les dates internes, paramètres
// d'ordre d'affichage et notes privées ne doivent pas être imposés pour
// cette opération simple ».
//
// L'écran suit cette consigne à la lettre : quatre champs visibles, tout le
// reste replié. Le suivi interne de la relation est dans un encadré à part,
// avec la mention explicite qu'il ne paraît jamais sur le site — sans quoi
// on hésite à y écrire ce qu'on pense vraiment.

const VIDE = {
  nom: '', type: '', descriptionCourte: '', logo: '', logoAlt: '',
  siteInternet: '', commune: '', emailPublic: '', telephonePublic: '',
  statutPartenariat: 'prospect', notesInternes: '', debutLe: '', finLe: '',
  categorieAffichage: '', ordre: 0, surAccueil: false,
}

function pourFormulaire(o) {
  if (!o) return { ...VIDE }
  return {
    nom: o.nom || '', type: o.type || '', descriptionCourte: o.descriptionCourte || '',
    logo: o.logo || '', logoAlt: o.logoAlt || '', siteInternet: o.siteInternet || '',
    commune: o.commune || '', emailPublic: o.emailPublic || '', telephonePublic: o.telephonePublic || '',
    statutPartenariat: o.statutPartenariat || 'prospect', notesInternes: o.notesInternes || '',
    debutLe: pourChampDate(o.debutLe), finLe: pourChampDate(o.finLe),
    categorieAffichage: o.categorieAffichage || '', ordre: o.ordre ?? 0,
    surAccueil: Boolean(o.surAccueil),
  }
}

export default function PartenaireEdition() {
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
  const [statutsPartenariat, setStatutsPartenariat] = useState([])
  const [historique, setHistorique] = useState([])
  const [avance, setAvance] = useState(false)
  const [etat, setEtat] = useState({ type: 'repos' })
  const [erreursChamps, setErreursChamps] = useState({})

  const modifie = JSON.stringify(form) !== JSON.stringify(reference)

  useEffect(() => {
    let annule = false
    async function charger() {
      const r = await appelerApi('/organisations' + (creation ? '' : '?id=' + id))
      if (annule) return
      if (!r.ok) { setChargement(false); return setEtat({ type: 'erreur', message: r.erreur }) }
      setTypes(r.donnees.types || [])
      setStatutsPartenariat(r.donnees.statutsPartenariat || [])
      if (!creation) {
        const o = r.donnees.organisation
        const valeurs = pourFormulaire(o)
        setForm(valeurs); setReference(valeurs)
        setMeta({ statut: o.statut, version: o.version, id: o.id })
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

  async function enregistrer(statutVise) {
    setEtat({ type: 'envoi' })
    setErreursChamps({})
    const corps = {
      ...form,
      statut: statutVise,
      debutLe: form.debutLe || null,
      finLe: form.finLe || null,
      ...(creation ? {} : { id: meta.id, version: meta.version }),
    }
    const r = await appelerApi('/organisations', { methode: creation ? 'POST' : 'PUT', corps })

    if (r.erreurs) {
      setErreursChamps(Object.fromEntries(r.erreurs.map((e) => [e.champ, e.message])))
      return setEtat({ type: 'erreur', message: 'Quelques informations manquent avant la mise en ligne.' })
    }
    if (r.conflit) return setEtat({ type: 'conflit', message: r.erreur })
    if (!r.ok) return setEtat({ type: 'erreur', message: r.erreur })

    const o = r.donnees.organisation
    const valeurs = pourFormulaire(o)
    setForm(valeurs); setReference(valeurs)
    setMeta({ statut: o.statut, version: o.version, id: o.id })
    setEtat({
      type: 'succes',
      message: 'Modifications enregistrées.',
      avertissement: r.donnees.deploiementDeclenche === false
        ? "La fiche est enregistrée, mais la mise en ligne du site n'a pas pu être lancée. Signalez-le à l'équipe technique."
        : null,
    })
    if (creation) navigate('/admin/partenaires/' + o.id, { replace: true })
  }

  async function supprimer() {
    if (!window.confirm('Supprimer définitivement cette fiche ? Cette action est irréversible.')) return
    const r = await appelerApi('/organisations?id=' + meta.id, { methode: 'DELETE' })
    if (!r.ok) return setEtat({ type: 'erreur', message: r.erreur })
    navigate('/admin/partenaires')
  }

  if (chargement) return <p className="text-sm text-terre/50">Chargement…</p>

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-5">
        <Link to="/admin/partenaires" className="text-[13px] text-olive font-semibold hover:underline">
          ← Tous les partenaires
        </Link>
        <span className={`text-[12.5px] ${modifie ? 'text-ocre-dark font-semibold' : 'text-terre/45'}`}>
          {modifie ? 'Modifications non enregistrées' : creation ? 'Nouvelle fiche' : 'Modifications enregistrées'}
        </span>
      </div>

      <div className="bg-white border border-beige-dark rounded-2xl p-6 space-y-5">
        <Champ label="Nom de l'organisation" obligatoire erreur={erreursChamps.nom}>
          <input type="text" value={form.nom} disabled={lectureSeule}
            onChange={(e) => majChamp('nom', e.target.value)} className={classeSaisie(erreursChamps.nom)} />
        </Champ>

        <Champ label="Logo" aide="Chemin de l'image, par exemple /logos/mairie-castets.webp">
          <input type="text" value={form.logo} disabled={lectureSeule}
            onChange={(e) => majChamp('logo', e.target.value)} className={classeSaisie(false)} />
        </Champ>

        {form.logo && (
          <Champ label="Description du logo pour l'accessibilité"
            aide="Exemple : « Logo de la commune de Castets. »" erreur={erreursChamps.logoAlt}>
            <input type="text" value={form.logoAlt} disabled={lectureSeule}
              onChange={(e) => majChamp('logoAlt', e.target.value)} className={classeSaisie(erreursChamps.logoAlt)} />
          </Champ>
        )}

        <Champ label="Type d'organisation" erreur={erreursChamps.type}>
          <select value={form.type} disabled={lectureSeule}
            onChange={(e) => majChamp('type', e.target.value)} className={classeSaisie(erreursChamps.type)}>
            <option value="">Choisir…</option>
            {types.map((t) => <option key={t.cle} value={t.cle}>{t.libelle}</option>)}
          </select>
        </Champ>

        <Champ label="Présentation courte"
          aide="Deux ou trois phrases sur le rôle de ce partenaire. C'est ce qui paraîtra sur le site.">
          <textarea rows={3} value={form.descriptionCourte} disabled={lectureSeule}
            onChange={(e) => majChamp('descriptionCourte', e.target.value)}
            className={classeSaisie(false) + ' resize-y leading-relaxed'} />
        </Champ>

        {/* Suivi interne : encadré à part, avec la mention explicite qu'il
            ne paraît jamais sur le site (§12). Sans cette mention, on hésite
            à y écrire ce qu'on pense réellement de la relation. */}
        <div className="border border-beige-dark rounded-xl p-4 bg-beige-light/40 space-y-4">
          <p className="text-[12px] font-semibold text-terre/60 uppercase tracking-wider">
            Suivi interne — ne paraît jamais sur le site
          </p>

          <Champ label="Où en est la relation ?" erreur={erreursChamps.statutPartenariat}>
            <select value={form.statutPartenariat} disabled={lectureSeule}
              onChange={(e) => majChamp('statutPartenariat', e.target.value)}
              className={classeSaisie(erreursChamps.statutPartenariat)}>
              {statutsPartenariat.map((s) => <option key={s.cle} value={s.cle}>{s.libelle}</option>)}
            </select>
          </Champ>

          <Champ label="Notes" aide="Pour l'équipe uniquement : historique des échanges, contacts, points de vigilance.">
            <textarea rows={3} value={form.notesInternes} disabled={lectureSeule}
              onChange={(e) => majChamp('notesInternes', e.target.value)}
              className={classeSaisie(false) + ' resize-y leading-relaxed'} />
          </Champ>
        </div>

        <div className="border-t border-beige-dark pt-4">
          <button type="button" onClick={() => setAvance((v) => !v)}
            className="text-[13px] font-semibold text-terre/70 hover:text-ocre-dark">
            {avance ? '▾' : '▸'} Options avancées
          </button>

          {avance && (
            <div className="mt-4 space-y-4">
              <Champ label="Site internet"><input type="text" value={form.siteInternet} disabled={lectureSeule}
                onChange={(e) => majChamp('siteInternet', e.target.value)} className={classeSaisie(false)} /></Champ>
              <Champ label="Commune"><input type="text" value={form.commune} disabled={lectureSeule}
                onChange={(e) => majChamp('commune', e.target.value)} className={classeSaisie(false)} /></Champ>
              <Champ label="Adresse email publique" aide="Seulement si le partenaire accepte qu'elle paraisse.">
                <input type="text" value={form.emailPublic} disabled={lectureSeule}
                  onChange={(e) => majChamp('emailPublic', e.target.value)} className={classeSaisie(false)} /></Champ>
              <Champ label="Téléphone public"><input type="text" value={form.telephonePublic} disabled={lectureSeule}
                onChange={(e) => majChamp('telephonePublic', e.target.value)} className={classeSaisie(false)} /></Champ>

              <div className="grid grid-cols-2 gap-4">
                <Champ label="Début du partenariat"><input type="date" value={form.debutLe} disabled={lectureSeule}
                  onChange={(e) => majChamp('debutLe', e.target.value)} className={classeSaisie(false)} /></Champ>
                <Champ label="Fin éventuelle" erreur={erreursChamps.finLe}>
                  <input type="date" value={form.finLe} disabled={lectureSeule}
                    onChange={(e) => majChamp('finLe', e.target.value)} className={classeSaisie(erreursChamps.finLe)} /></Champ>
              </div>

              <Champ label="Catégorie d'affichage" aide="Pour regrouper les partenaires sur la page, si besoin.">
                <input type="text" value={form.categorieAffichage} disabled={lectureSeule}
                  onChange={(e) => majChamp('categorieAffichage', e.target.value)} className={classeSaisie(false)} /></Champ>
              <Champ label="Ordre d'affichage" aide="Plus le nombre est petit, plus la fiche apparaît tôt.">
                <input type="number" value={form.ordre} disabled={lectureSeule}
                  onChange={(e) => majChamp('ordre', e.target.value)} className={classeSaisie(false) + ' w-32'} /></Champ>

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
