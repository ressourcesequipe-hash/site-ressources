import { useCallback, useEffect, useState } from 'react'
import { appelerApi } from '../lib/api'
import { Champ, Etiquette, Message, classeSaisie, pourChampDate } from '../components/Formulaire'
import { ETATS, etatCampagne, normaliserChemin } from '../../../lib/campagnes.js'

// Campagnes et bandeaux temporaires — §19 du cahier des charges.
//
// « Publier une information temporaire sans intervention dans le code. »
//
// Deux axes, et l'écran les tient séparés parce qu'ils répondent à deux
// besoins différents : `actif` est l'interrupteur — on coupe tout de suite,
// sans toucher aux dates — et la fenêtre de dates fait le travail à votre
// place le jour venu. Une campagne s'affiche quand les deux disent oui, et
// l'écran annonce l'état qui en résulte plutôt que de laisser le déduire.

const TONS_ETAT = { en_cours: 'calme', a_venir: 'accent', terminee: 'neutre', inactive: 'neutre' }

const VIDE = {
  titreInterne: '', message: '', lien: '', texteBouton: '',
  type: 'information', emplacement: 'bandeau_global', pageCible: '',
  debutLe: '', finLe: '', actif: false, ordre: 0,
}

function pourFormulaire(c) {
  if (!c) return { ...VIDE }
  return {
    titreInterne: c.titreInterne || '', message: c.message || '',
    lien: c.lien || '', texteBouton: c.texteBouton || '',
    type: c.type || 'information', emplacement: c.emplacement || 'bandeau_global',
    pageCible: c.pageCible || '',
    debutLe: pourChampDate(c.debutLe, true), finLe: pourChampDate(c.finLe, true),
    actif: Boolean(c.actif), ordre: c.ordre ?? 0,
  }
}

export default function Campagnes() {
  const [etat, setEtat] = useState({ chargement: true })
  const [donnees, setDonnees] = useState(null)
  const [edition, setEdition] = useState(null)
  const [message, setMessage] = useState(null)

  const charger = useCallback(async () => {
    const r = await appelerApi('/campagnes')
    if (!r.ok) return setEtat({ chargement: false, erreur: r.erreur })
    setDonnees(r.donnees)
    setEtat({ chargement: false })
  }, [])

  useEffect(() => { charger() }, [charger])

  if (etat.chargement) return <p className="text-sm text-terre/50">Chargement…</p>
  if (etat.erreur) return <Message type="erreur">{etat.erreur}</Message>
  if (!donnees) return null

  const { campagnes, types, emplacements, peutGerer } = donnees
  const enLigne = campagnes.filter((c) => etatCampagne(c) === 'en_cours')

  return (
    <div className="max-w-4xl">
      {message && <div className="mb-5"><Message type={message.type}>{message.texte}</Message></div>}

      <div className="flex items-start justify-between gap-4 mb-5">
        <p className="text-sm text-terre/70 max-w-xl leading-relaxed">
          Un bandeau apparaît et disparaît tout seul aux dates que vous indiquez.
          L'interrupteur, lui, agit immédiatement : c'est ce qu'il faut pour couper
          une annonce devenue fausse.
        </p>
        {peutGerer && (
          <button type="button" onClick={() => setEdition({ ...VIDE })}
            className="shrink-0 px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark transition-colors">
            Nouvelle campagne
          </button>
        )}
      </div>

      {enLigne.length === 0 && campagnes.length > 0 && (
        <div className="mb-5">
          <Message type="avertissement">
            Aucune campagne n'est visible sur le site en ce moment. Celles qui
            suivent sont désactivées, programmées ou terminées.
          </Message>
        </div>
      )}

      {campagnes.length === 0 && (
        <div className="bg-white border border-beige-dark rounded-2xl p-8 text-center">
          <p className="text-terre/70 text-sm mb-1">Aucune campagne pour l'instant.</p>
          {peutGerer && (
            <p className="text-terre/50 text-[13px]">
              Commencez par « Nouvelle campagne » en haut à droite.
            </p>
          )}
        </div>
      )}

      {campagnes.length > 0 && (
        <div className="bg-white border border-beige-dark rounded-2xl overflow-hidden">
          {campagnes.map((c, index) => {
            const e = etatCampagne(c)
            return (
              <button key={c.id} type="button" disabled={!peutGerer}
                onClick={() => setEdition({ ...pourFormulaire(c), id: c.id, version: c.version })}
                className={`w-full text-left flex items-start gap-4 px-5 py-4 transition-colors ${
                  index > 0 ? 'border-t border-beige-dark' : ''} ${
                  peutGerer ? 'hover:bg-beige-light/60' : 'cursor-default'} ${
                  e === 'en_cours' ? '' : 'bg-beige-light/30'}`}>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold text-terre truncate">{c.titreInterne}</div>
                  <div className="text-[12.5px] text-terre/60 truncate mt-0.5">{c.message}</div>
                  <div className="text-[11.5px] text-terre/45 mt-1">
                    {emplacements.find((x) => x.cle === c.emplacement)?.libelle || c.emplacement}
                    {c.emplacement === 'page_specifique' && c.pageCible ? ` — ${c.pageCible}` : ''}
                    {c.finLe ? ` · jusqu'au ${new Date(c.finLe).toLocaleDateString('fr-FR')}` : ''}
                  </div>
                </div>
                <Etiquette ton={TONS_ETAT[e]}>{ETATS[e]}</Etiquette>
              </button>
            )
          })}
        </div>
      )}

      {edition && (
        <Edition
          valeurs={edition} types={types} emplacements={emplacements}
          onFermer={() => setEdition(null)}
          onFait={(texte, type = 'succes') => { setMessage({ type, texte }); setEdition(null); charger() }}
        />
      )}
    </div>
  )
}

// ── Création et modification ─────────────────────────────────────────────

function Edition({ valeurs, types, emplacements, onFermer, onFait }) {
  const [form, setForm] = useState(valeurs)
  const [erreurs, setErreurs] = useState({})
  const [envoi, setEnvoi] = useState(false)
  const creation = !valeurs.id

  const maj = (cle, v) => {
    setForm((f) => ({ ...f, [cle]: v }))
    setErreurs((e) => (e[cle] ? { ...e, [cle]: undefined } : e))
  }

  useEffect(() => {
    const surTouche = (e) => { if (e.key === 'Escape') onFermer() }
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [onFermer])

  // L'état qu'aura la campagne une fois enregistrée, calculé avec la même
  // fonction que le serveur et que le site. Le dire avant d'enregistrer
  // évite d'activer une campagne qui ne s'affichera pas, et de chercher
  // pourquoi.
  const apercu = etatCampagne({
    actif: form.actif,
    debutLe: form.debutLe || null,
    finLe: form.finLe || null,
  })

  async function enregistrer() {
    setEnvoi(true)
    setErreurs({})
    const corps = {
      ...form,
      pageCible: form.emplacement === 'page_specifique' ? normaliserChemin(form.pageCible) : null,
      debutLe: form.debutLe || null,
      finLe: form.finLe || null,
      ...(creation ? {} : { version: valeurs.version }),
    }
    const chemin = creation ? '/campagnes' : `/campagnes?id=${valeurs.id}`
    const r = await appelerApi(chemin, { methode: creation ? 'POST' : 'PUT', corps })
    setEnvoi(false)

    if (r.erreurs) return setErreurs(Object.fromEntries(r.erreurs.map((e) => [e.champ, e.message])))
    if (!r.ok) return onFait(r.erreur, 'erreur')

    const avertissement = r.donnees?.deploiementDeclenche === false
      ? " La campagne est enregistrée, mais la mise en ligne du site n'a pas pu être lancée : signalez-le à l'équipe technique."
      : ''
    onFait((creation ? 'Campagne créée.' : 'Campagne mise à jour.') + avertissement,
      avertissement ? 'avertissement' : 'succes')
  }

  async function supprimer() {
    if (!window.confirm('Supprimer définitivement cette campagne ?')) return
    setEnvoi(true)
    const r = await appelerApi(`/campagnes?id=${valeurs.id}`, { methode: 'DELETE' })
    setEnvoi(false)
    if (!r.ok) return onFait(r.erreur, 'erreur')
    onFait('Campagne supprimée.')
  }

  const typeChoisi = types.find((t) => t.cle === form.type)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-terre/40 p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onFermer() }}>
      <div className="bg-white rounded-2xl border border-beige-dark w-full max-w-2xl my-8">
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-beige-dark">
          <h3 className="font-serif text-base text-terre">
            {creation ? 'Nouvelle campagne' : 'Modifier la campagne'}
          </h3>
          <button type="button" onClick={onFermer} className="text-[13px] text-terre/50 hover:text-ocre-dark">
            Fermer
          </button>
        </div>

        <div className="p-6 space-y-4">
          <Champ label="Nom de la campagne" obligatoire erreur={erreurs.titreInterne}
            aide="Pour vous, dans cette liste. Ne s'affiche jamais sur le site.">
            <input type="text" value={form.titreInterne} disabled={envoi}
              onChange={(e) => maj('titreInterne', e.target.value)}
              placeholder="Tombola — rappel avant le tirage"
              className={classeSaisie(erreurs.titreInterne)} />
          </Champ>

          <Champ label="Message" obligatoire erreur={erreurs.message}
            aide="Une phrase ou deux : un bandeau se lit d'un coup d'œil.">
            <textarea rows={2} value={form.message} disabled={envoi} maxLength={400}
              onChange={(e) => maj('message', e.target.value)}
              placeholder="Le tirage de la tombola approche : il reste quelques billets."
              className={classeSaisie(erreurs.message) + ' resize-y'} />
          </Champ>

          <div className="grid sm:grid-cols-2 gap-4">
            <Champ label="Texte du bouton" erreur={erreurs.texteBouton}>
              <input type="text" value={form.texteBouton} disabled={envoi} maxLength={40}
                onChange={(e) => maj('texteBouton', e.target.value)} placeholder="Prendre un billet"
                className={classeSaisie(erreurs.texteBouton)} />
            </Champ>
            <Champ label="Adresse du bouton" erreur={erreurs.lien}>
              <input type="text" value={form.lien} disabled={envoi}
                onChange={(e) => maj('lien', e.target.value)} placeholder="/soutenir/tombola/"
                className={classeSaisie(erreurs.lien)} />
            </Champ>
          </div>

          <Champ label="Type" aide={typeChoisi?.aide} erreur={erreurs.type}>
            <select value={form.type} disabled={envoi} onChange={(e) => maj('type', e.target.value)}
              className={classeSaisie(erreurs.type)}>
              {types.map((t) => <option key={t.cle} value={t.cle}>{t.libelle}</option>)}
            </select>
          </Champ>

          <Champ label="Où l'afficher" erreur={erreurs.emplacement}>
            <select value={form.emplacement} disabled={envoi}
              onChange={(e) => maj('emplacement', e.target.value)}
              className={classeSaisie(erreurs.emplacement)}>
              {emplacements.map((e) => <option key={e.cle} value={e.cle}>{e.libelle}</option>)}
            </select>
          </Champ>

          {form.emplacement === 'page_specifique' && (
            <Champ label="Adresse de la page" obligatoire erreur={erreurs.pageCible}
              aide="Par exemple /defi-collecte — la barre finale n'a pas d'importance.">
              <input type="text" value={form.pageCible} disabled={envoi}
                onChange={(e) => maj('pageCible', e.target.value)}
                className={classeSaisie(erreurs.pageCible)} />
            </Champ>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <Champ label="Début" aide="Laissez vide pour commencer tout de suite." erreur={erreurs.debutLe}>
              <input type="datetime-local" value={form.debutLe} disabled={envoi}
                onChange={(e) => maj('debutLe', e.target.value)} className={classeSaisie(erreurs.debutLe)} />
            </Champ>
            <Champ label="Fin" aide="Laissez vide pour un bandeau sans échéance." erreur={erreurs.finLe}>
              <input type="datetime-local" value={form.finLe} disabled={envoi}
                onChange={(e) => maj('finLe', e.target.value)} className={classeSaisie(erreurs.finLe)} />
            </Champ>
          </div>

          <div className="border border-beige-dark rounded-xl p-4 bg-beige-light/40">
            <label className="flex items-start gap-3 select-none cursor-pointer">
              <input type="checkbox" checked={form.actif} disabled={envoi} className="accent-ocre mt-0.5"
                onChange={(e) => maj('actif', e.target.checked)} />
              <span>
                <span className="block text-[13.5px] font-semibold text-terre">Campagne active</span>
                <span className="block text-[12.5px] text-terre/60 leading-relaxed mt-0.5">
                  Décochez pour couper le bandeau immédiatement, sans perdre les dates
                  ni le texte.
                </span>
              </span>
            </label>

            <p className="mt-3 pt-3 border-t border-beige-dark text-[13px] text-terre/70">
              État une fois enregistrée : <strong className="text-terre">{ETATS[apercu]}</strong>
              {apercu === 'a_venir' && ' — le bandeau apparaîtra à la date de début.'}
              {apercu === 'terminee' && " — la date de fin est passée, le bandeau ne s'affichera pas."}
              {apercu === 'inactive' && " — rien ne s'affichera tant que la case n'est pas cochée."}
              {apercu === 'en_cours' && ' — le bandeau sera visible dès la prochaine mise en ligne.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            <button type="button" onClick={enregistrer} disabled={envoi}
              className="px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark disabled:opacity-40 transition-colors">
              {envoi ? 'Enregistrement…' : creation ? 'Créer la campagne' : 'Enregistrer'}
            </button>
            <button type="button" onClick={onFermer} disabled={envoi}
              className="px-4 py-2.5 rounded-lg border border-beige-dark text-[13.5px] font-semibold text-terre hover:border-ocre transition-colors">
              Annuler
            </button>
            {!creation && (
              <button type="button" onClick={supprimer} disabled={envoi}
                className="ml-auto px-4 py-2.5 rounded-lg border border-red-200 text-[13.5px] font-semibold text-red-700 hover:border-red-400 transition-colors">
                Supprimer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
