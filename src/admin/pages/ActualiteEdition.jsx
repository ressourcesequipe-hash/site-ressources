import { useCallback, useEffect, useRef, useState } from 'react'
import SelecteurMedia from '../components/SelecteurMedia'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { appelerApi } from '../lib/api'
import { authClient } from '../lib/authClient'
import EditeurBlocs from '../components/EditeurBlocs'
import { BLOCS } from '../../../lib/actualites.js'
import { Champ, classeSaisie, Message } from '../components/Formulaire'

// Création et modification d'une actualité — §9, §22 et §24.4.
//
// Les champs essentiels viennent d'abord, les réglages techniques sont
// repliés sous « Options avancées ». Un contributeur qui écrit un article ne
// doit pas avoir à comprendre ce qu'est un slug ou une balise de partage
// pour publier (§24.1).
//
// L'état d'enregistrement est affiché en permanence, et quitter la page avec
// des modifications non enregistrées déclenche un avertissement (§24.7).

const VIDE = {
  titre: '', resume: '', contenu: [], image: '', imageAlt: '', imageCredit: '',
  categorie: '', slug: '', lienExterne: '', miseEnAvant: false, surAccueil: false,
  datePublication: '', seo: {},
}

function pourFormulaire(a) {
  if (!a) return { ...VIDE }
  return {
    titre: a.titre || '', resume: a.resume || '', contenu: a.contenu || [],
    image: a.image || '', imageAlt: a.imageAlt || '', imageCredit: a.imageCredit || '',
    categorie: a.categorie || '', slug: a.slug || '', lienExterne: a.lienExterne || '',
    miseEnAvant: Boolean(a.miseEnAvant), surAccueil: Boolean(a.surAccueil),
    datePublication: a.datePublication ? new Date(a.datePublication).toISOString().slice(0, 16) : '',
    seo: a.seo || {},
  }
}

export default function ActualiteEdition() {
  const { id } = useParams()
  const creation = !id || id === 'nouvelle'
  const navigate = useNavigate()
  const { data: sessionData } = authClient.useSession()
  const role = sessionData?.user?.role

  const peutPublier = role === 'super_admin' || role === 'coordination' || role === 'communication'
  const peutSupprimer = role === 'super_admin' || role === 'coordination'
  const lectureSeule = role === 'lecture_seule'

  const [chargement, setChargement] = useState(!creation)
  const [form, setForm] = useState({ ...VIDE })
  const [reference, setReference] = useState({ ...VIDE })
  const [meta, setMeta] = useState({ statut: 'brouillon', version: 1, id: null })
  const [categories, setCategories] = useState([])
  const [historique, setHistorique] = useState([])
  const [avance, setAvance] = useState(false)
  const [etat, setEtat] = useState({ type: 'repos' })
  const [erreursChamps, setErreursChamps] = useState({})
  const premierChamp = useRef(null)

  const modifie = JSON.stringify(form) !== JSON.stringify(reference)

  useEffect(() => {
    let annule = false
    async function charger() {
      const r = await appelerApi('/actualites' + (creation ? '' : '?id=' + id))
      if (annule) return
      if (!r.ok) { setChargement(false); return setEtat({ type: 'erreur', message: r.erreur }) }
      setCategories(r.donnees.categories || [])
      if (!creation) {
        const a = r.donnees.actualite
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

  // §24.7 : prévenir avant de perdre des modifications non enregistrées.
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
      datePublication: form.datePublication || null,
      ...(creation ? {} : { id: meta.id, version: meta.version }),
    }

    const r = await appelerApi('/actualites', { methode: creation ? 'POST' : 'PUT', corps })

    if (r.erreurs) {
      setErreursChamps(Object.fromEntries(r.erreurs.map((e) => [e.champ, e.message])))
      return setEtat({ type: 'erreur', message: 'Quelques informations manquent avant la mise en ligne.' })
    }
    if (r.conflit) return setEtat({ type: 'conflit', message: r.erreur })
    if (!r.ok) return setEtat({ type: 'erreur', message: r.erreur })

    const a = r.donnees.actualite
    const valeurs = pourFormulaire(a)
    setForm(valeurs); setReference(valeurs)
    setMeta({ statut: a.statut, version: a.version, id: a.id })
    setEtat({
      type: 'succes',
      message: 'Modifications enregistrées.',
      // §5.5 : ne jamais présenter un contenu comme en ligne si la
      // reconstruction du site n'a pas pu être déclenchée.
      avertissement: r.donnees.deploiementDeclenche === false
        ? "L'article est enregistré, mais la mise en ligne du site n'a pas pu être lancée. Signalez-le à l'équipe technique."
        : null,
    })
    if (creation) navigate('/admin/actualites/' + a.id, { replace: true })
  }

  async function supprimer() {
    if (!window.confirm('Supprimer définitivement cette actualité ? Cette action est irréversible.')) return
    const r = await appelerApi('/actualites?id=' + meta.id, { methode: 'DELETE' })
    if (!r.ok) return setEtat({ type: 'erreur', message: r.erreur })
    navigate('/admin/actualites')
  }

  if (chargement) return <p className="text-sm text-terre/50">Chargement…</p>

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-5">
        <Link to="/admin/actualites" className="text-[13px] text-olive font-semibold hover:underline">
          ← Toutes les actualités
        </Link>
        <span className={`text-[12.5px] ${modifie ? 'text-ocre-dark font-semibold' : 'text-terre/45'}`}>
          {modifie ? 'Modifications non enregistrées' : creation ? 'Nouvel article' : 'Modifications enregistrées'}
        </span>
      </div>

      <div className="bg-white border border-beige-dark rounded-2xl p-6 space-y-5">
        <Champ label="Titre" erreur={erreursChamps.titre}>
          <input
            ref={premierChamp}
            type="text"
            value={form.titre}
            disabled={lectureSeule}
            onChange={(e) => majChamp('titre', e.target.value)}
            className={classeSaisie(erreursChamps.titre)}
          />
        </Champ>

        <Champ
          label="Résumé"
          aide="Deux ou trois phrases. C'est ce qui s'affiche dans les listes et lors d'un partage."
          erreur={erreursChamps.resume}
        >
          <textarea
            rows={3}
            value={form.resume}
            disabled={lectureSeule}
            onChange={(e) => majChamp('resume', e.target.value)}
            className={classeSaisie(erreursChamps.resume) + ' resize-y leading-relaxed'}
          />
        </Champ>

        <Champ label="Catégorie" erreur={erreursChamps.categorie}>
          <select
            value={form.categorie}
            disabled={lectureSeule}
            onChange={(e) => majChamp('categorie', e.target.value)}
            className={classeSaisie(erreursChamps.categorie)}
          >
            <option value="">Choisir…</option>
            {categories.map((c) => <option key={c.cle} value={c.cle}>{c.libelle}</option>)}
          </select>
        </Champ>

        <SelecteurMedia
          label="Photo principale"
          aide="Choisissez une image de la médiathèque, ou déposez-en une nouvelle."
          categorie="actualites"
          valeur={form.image}
          peutImporter={!lectureSeule}
          onChange={(chemin) => majChamp('image', chemin)}
        />

        {form.image && (
          <Champ
            label="Description de la photo pour l'accessibilité"
            aide="Exemple : « Deux bénévoles trient des ordinateurs à l'atelier. »"
            erreur={erreursChamps.imageAlt}
          >
            <input
              type="text"
              value={form.imageAlt}
              disabled={lectureSeule}
              onChange={(e) => majChamp('imageAlt', e.target.value)}
              className={classeSaisie(erreursChamps.imageAlt)}
            />
          </Champ>
        )}

        <div>
          <label className="block text-[13px] font-semibold text-terre mb-1.5">Contenu de l'article</label>
          <EditeurBlocs blocs={form.contenu} onChange={(b) => majChamp('contenu', b)} desactive={lectureSeule} typesAutorises={Object.keys(BLOCS)} />
        </div>

        <div className="border-t border-beige-dark pt-4">
          <button
            type="button"
            onClick={() => setAvance((v) => !v)}
            className="text-[13px] font-semibold text-terre/70 hover:text-ocre-dark"
          >
            {avance ? '▾' : '▸'} Options avancées
          </button>

          {avance && (
            <div className="mt-4 space-y-4">
              <Champ label="Adresse de la page" aide="Se déduit du titre. Ne la changez que si vous savez pourquoi : modifier une adresse déjà en ligne casse les liens existants.">
                <input
                  type="text"
                  value={form.slug}
                  disabled={lectureSeule}
                  onChange={(e) => majChamp('slug', e.target.value)}
                  className={classeSaisie(false)}
                />
              </Champ>

              <Champ label="Crédit de la photo">
                <input type="text" value={form.imageCredit} disabled={lectureSeule}
                  onChange={(e) => majChamp('imageCredit', e.target.value)} className={classeSaisie(false)} />
              </Champ>

              <Champ label="Lien externe éventuel" aide="Si l'article renvoie vers un site extérieur.">
                <input type="text" value={form.lienExterne} disabled={lectureSeule}
                  onChange={(e) => majChamp('lienExterne', e.target.value)} className={classeSaisie(false)} />
              </Champ>

              <Champ label="Date de mise en ligne" aide="À renseigner seulement pour programmer une publication future." erreur={erreursChamps.datePublication}>
                <input type="datetime-local" value={form.datePublication} disabled={lectureSeule}
                  onChange={(e) => majChamp('datePublication', e.target.value)} className={classeSaisie(erreursChamps.datePublication)} />
              </Champ>

              <label className="flex items-center gap-2.5 text-[13px] text-terre/85">
                <input type="checkbox" checked={form.miseEnAvant} disabled={lectureSeule}
                  onChange={(e) => majChamp('miseEnAvant', e.target.checked)} className="accent-ocre" />
                Mettre cet article en avant
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
          <div className="flex flex-wrap items-center gap-2.5 pt-1 border-t border-beige-dark mt-1 pt-4">
            <button
              type="button"
              onClick={() => enregistrer(meta.statut === 'publie' ? 'publie' : 'brouillon')}
              disabled={etat.type === 'envoi'}
              className="px-4 py-2.5 rounded-lg border border-beige-dark text-[13.5px] font-semibold text-terre hover:border-ocre disabled:opacity-40"
            >
              {/* Le libellé doit dire ce que le bouton fait vraiment (§24.3) :
                  sur un article déjà en ligne, enregistrer ne le repasse pas
                  en brouillon — il reste publié. */}
              {etat.type === 'envoi'
                ? 'Enregistrement…'
                : meta.statut === 'publie'
                  ? 'Enregistrer les modifications'
                  : 'Enregistrer le brouillon'}
            </button>

            {!peutPublier && (
              <button
                type="button"
                onClick={() => enregistrer('a_valider')}
                disabled={etat.type === 'envoi'}
                className="px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark disabled:opacity-40"
              >
                Demander la validation
              </button>
            )}

            {peutPublier && (
              <button
                type="button"
                onClick={() => enregistrer('publie')}
                disabled={etat.type === 'envoi'}
                className="px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark disabled:opacity-40"
              >
                Publier
              </button>
            )}

            {!creation && meta.statut !== 'archive' && (
              <button
                type="button"
                onClick={() => enregistrer('archive')}
                disabled={etat.type === 'envoi'}
                className="px-4 py-2.5 rounded-lg border border-beige-dark text-[13.5px] font-semibold text-terre/70 hover:border-ocre"
              >
                Archiver
              </button>
            )}

            {!creation && peutSupprimer && (
              <button
                type="button"
                onClick={supprimer}
                className="ml-auto text-[13px] text-red-700/80 hover:text-red-700 hover:underline"
              >
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
