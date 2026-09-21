import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { appelerApi } from '../lib/api'
import { authClient } from '../lib/authClient'
import EditeurBlocs from '../components/EditeurBlocs'
import { Champ, classeSaisie, Etiquette, Message } from '../components/Formulaire'
import { BLOCS, estProtegee } from '../../../lib/pages.js'

// Fiche d'une page institutionnelle — §8 et §22 du cahier des charges.
//
// Le cas particulier de ce module est la page protégée (§8.4). Quand elle
// l'est, l'interface le dit avant toute saisie, et le bouton « Publier »
// disparaît au profit de « Demander la validation » — y compris pour un
// profil qui pourrait publier ailleurs. Le serveur applique la même règle
// de son côté ; ce qui est affiché ici n'en est que le reflet.

const VIDE = {
  titreInterne: '', titrePublic: '', extrait: '', contenu: [],
  image: '', imageAlt: '', imageCredit: '', protegee: false, ordre: 0,
}

function pourFormulaire(p) {
  if (!p) return { ...VIDE }
  return {
    titreInterne: p.titreInterne || '', titrePublic: p.titrePublic || '',
    extrait: p.extrait || '', contenu: p.contenu || [],
    image: p.image || '', imageAlt: p.imageAlt || '', imageCredit: p.imageCredit || '',
    protegee: Boolean(p.protegee), ordre: p.ordre ?? 0,
  }
}

export default function PageEdition() {
  const { id } = useParams()
  const creation = !id || id === 'nouvelle'
  const navigate = useNavigate()
  const { data: sessionData } = authClient.useSession()
  const role = sessionData?.user?.role

  const habilitePagesJuridiques = ['super_admin', 'coordination'].includes(role)
  const peutPublier = habilitePagesJuridiques
  const peutSupprimer = habilitePagesJuridiques
  const lectureSeule = role === 'lecture_seule'

  const [chargement, setChargement] = useState(true)
  const [form, setForm] = useState({ ...VIDE })
  const [reference, setReference] = useState({ ...VIDE })
  const [meta, setMeta] = useState({ statut: 'brouillon', version: 1, id: null, slug: '' })
  const [historique, setHistorique] = useState([])
  const [avance, setAvance] = useState(false)
  const [etat, setEtat] = useState({ type: 'repos' })
  const [erreursChamps, setErreursChamps] = useState({})

  const modifie = JSON.stringify(form) !== JSON.stringify(reference)
  const protegee = estProtegee({ slug: meta.slug, protegee: form.protegee })
  // Une page protégée reste hors de portée des autres profils, quel que soit
  // ce qu'ils peuvent publier par ailleurs (§8.4).
  const verrouille = lectureSeule || (protegee && !habilitePagesJuridiques)

  useEffect(() => {
    let annule = false
    async function charger() {
      if (creation) return setChargement(false)
      const r = await appelerApi('/pages?id=' + id)
      if (annule) return
      if (!r.ok) { setChargement(false); return setEtat({ type: 'erreur', message: r.erreur }) }
      const p = r.donnees.page
      const valeurs = pourFormulaire(p)
      setForm(valeurs); setReference(valeurs)
      setMeta({ statut: p.statut, version: p.version, id: p.id, slug: p.slug })
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
    const corps = { ...form, statut: statutVise, ...(creation ? {} : { id: meta.id, version: meta.version }) }
    const r = await appelerApi('/pages', { methode: creation ? 'POST' : 'PUT', corps })

    if (r.erreurs) {
      setErreursChamps(Object.fromEntries(r.erreurs.map((e) => [e.champ, e.message])))
      return setEtat({ type: 'erreur', message: 'Quelques informations manquent avant la mise en ligne.' })
    }
    if (r.conflit) return setEtat({ type: 'conflit', message: r.erreur })
    if (!r.ok) return setEtat({ type: 'erreur', message: r.erreur })

    const p = r.donnees.page
    const valeurs = pourFormulaire(p)
    setForm(valeurs); setReference(valeurs)
    setMeta({ statut: p.statut, version: p.version, id: p.id, slug: p.slug })
    setEtat({
      type: 'succes',
      message: 'Modifications enregistrées.',
      avertissement: r.donnees.deploiementDeclenche === false
        ? "La page est enregistrée, mais la mise en ligne du site n'a pas pu être lancée. Signalez-le à l'équipe technique."
        : null,
    })
    if (creation) navigate('/admin/pages/' + p.id, { replace: true })
  }

  async function supprimer() {
    if (!window.confirm('Supprimer définitivement cette page ? Cette action est irréversible.')) return
    const r = await appelerApi('/pages?id=' + meta.id, { methode: 'DELETE' })
    if (!r.ok) return setEtat({ type: 'erreur', message: r.erreur })
    navigate('/admin/pages')
  }

  if (chargement) return <p className="text-sm text-terre/50">Chargement…</p>

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-5">
        <Link to="/admin/pages" className="text-[13px] text-olive font-semibold hover:underline">
          ← Toutes les pages
        </Link>
        <div className="flex items-center gap-3">
          {protegee && <Etiquette ton="accent">Page juridique</Etiquette>}
          <span className={`text-[12.5px] ${modifie ? 'text-ocre-dark font-semibold' : 'text-terre/45'}`}>
            {modifie ? 'Modifications non enregistrées' : creation ? 'Nouvelle page' : 'Modifications enregistrées'}
          </span>
        </div>
      </div>

      {/* La règle est annoncée AVANT la saisie, pas découverte au moment
          d'enregistrer : quelqu'un qui ne peut pas publier doit le savoir
          avant d'écrire (§24.7). */}
      {protegee && (
        <div className="mb-5">
          <Message type="avertissement">
            <span className="font-semibold">Cette page engage l'association sur le plan juridique.</span>{' '}
            {habilitePagesJuridiques
              ? "Toute modification passe par une validation avant mise en ligne, sans exception — y compris pour vous."
              : "Seules la Coordination et le Super administrateur peuvent la modifier. Vous pouvez la consulter."}
          </Message>
        </div>
      )}

      <div className="bg-white border border-beige-dark rounded-2xl p-6 space-y-5">
        <Champ label="Nom de la page" obligatoire
          aide="Pour vous repérer dans la liste. N'apparaît pas sur le site."
          erreur={erreursChamps.titreInterne}>
          <input type="text" value={form.titreInterne} disabled={verrouille}
            onChange={(e) => majChamp('titreInterne', e.target.value)}
            className={classeSaisie(erreursChamps.titreInterne)} />
        </Champ>

        <Champ label="Titre affiché sur la page" aide="Ce que lisent les visiteurs."
          erreur={erreursChamps.titrePublic}>
          <input type="text" value={form.titrePublic} disabled={verrouille}
            onChange={(e) => majChamp('titrePublic', e.target.value)}
            className={classeSaisie(erreursChamps.titrePublic)} />
        </Champ>

        <Champ label="Accroche" aide="Une ou deux phrases sous le titre. Facultatif.">
          <textarea rows={2} value={form.extrait} disabled={verrouille}
            onChange={(e) => majChamp('extrait', e.target.value)}
            className={classeSaisie(false) + ' resize-y leading-relaxed'} />
        </Champ>

        <div>
          <label className="block text-[13px] font-semibold text-terre mb-1.5">Contenu de la page</label>
          <EditeurBlocs blocs={form.contenu} onChange={(b) => majChamp('contenu', b)}
            desactive={verrouille} typesAutorises={Object.keys(BLOCS)} />
          {erreursChamps.contenu && <p className="text-[12px] text-red-700 mt-1.5">{erreursChamps.contenu}</p>}
        </div>

        <div className="border-t border-beige-dark pt-4">
          <button type="button" onClick={() => setAvance((v) => !v)}
            className="text-[13px] font-semibold text-terre/70 hover:text-ocre-dark">
            {avance ? '▾' : '▸'} Options avancées
          </button>

          {avance && (
            <div className="mt-4 space-y-4">
              <Champ label="Image principale" aide="Affichée en haut de la page. Facultatif.">
                <input type="text" value={form.image} disabled={verrouille}
                  onChange={(e) => majChamp('image', e.target.value)} className={classeSaisie(false)} />
              </Champ>
              {form.image && (
                <Champ label="Description de l'image pour l'accessibilité"
                  aide="Exemple : « Vue de l'atelier de reconditionnement. »" erreur={erreursChamps.imageAlt}>
                  <input type="text" value={form.imageAlt} disabled={verrouille}
                    onChange={(e) => majChamp('imageAlt', e.target.value)}
                    className={classeSaisie(erreursChamps.imageAlt)} />
                </Champ>
              )}
              <Champ label="Crédit de l'image">
                <input type="text" value={form.imageCredit} disabled={verrouille}
                  onChange={(e) => majChamp('imageCredit', e.target.value)} className={classeSaisie(false)} />
              </Champ>
              <Champ label="Ordre d'affichage" aide="Plus le nombre est petit, plus la page apparaît tôt dans les listes.">
                <input type="number" value={form.ordre} disabled={verrouille}
                  onChange={(e) => majChamp('ordre', e.target.value)} className={classeSaisie(false) + ' w-32'} />
              </Champ>

              {habilitePagesJuridiques && (
                <label className="flex items-start gap-2.5 text-[13px] text-terre/85">
                  <input type="checkbox" checked={form.protegee} disabled={verrouille}
                    onChange={(e) => majChamp('protegee', e.target.checked)} className="mt-0.5 accent-ocre" />
                  <span>
                    Traiter cette page comme une page juridique
                    <span className="block text-terre/50 text-[12px]">
                      Elle ne sera plus modifiable que par la Coordination et le Super administrateur,
                      et toute modification passera par une validation. Les pages juridiques
                      identifiées avec vous le sont déjà, sans cette case.
                    </span>
                  </span>
                </label>
              )}
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

        {!verrouille && (
          <div className="flex flex-wrap items-center gap-2.5 border-t border-beige-dark pt-4">
            {/* Sur une page juridique déjà en ligne, enregistrer la repasse
                en « à valider » : la garder publiée reviendrait à mettre en
                ligne une modification sans validation, ce que le §8.4
                interdit sans exception. Le bouton le dit, plutôt que de le
                faire en silence. */}
            <button type="button"
              onClick={() => enregistrer(
                protegee ? (meta.statut === 'publie' ? 'a_valider' : meta.statut === 'a_valider' ? 'a_valider' : 'brouillon')
                  : meta.statut === 'publie' ? 'publie' : 'brouillon'
              )}
              disabled={etat.type === 'envoi'}
              className="px-4 py-2.5 rounded-lg border border-beige-dark text-[13.5px] font-semibold text-terre hover:border-ocre disabled:opacity-40">
              {etat.type === 'envoi' ? 'Enregistrement…'
                : protegee && meta.statut === 'publie' ? 'Enregistrer et soumettre à validation'
                : meta.statut === 'publie' ? 'Enregistrer les modifications'
                : 'Enregistrer le brouillon'}
            </button>

            {/* Sur une page juridique, « Publier » n'existe pas — même pour
                un profil habilité. La validation est sans exception (§8.4). */}
            {(!peutPublier || protegee) && (
              <button type="button" onClick={() => enregistrer('a_valider')} disabled={etat.type === 'envoi'}
                className="px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark disabled:opacity-40">
                Demander la validation
              </button>
            )}
            {peutPublier && !protegee && (
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
