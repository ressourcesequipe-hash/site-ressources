import { useCallback, useEffect, useRef, useState } from 'react'
import { appelerApi } from '../lib/api'
import { authClient } from '../lib/authClient'
import { Champ, Etiquette, Message, classeSaisie, dateCourte } from '../components/Formulaire'
import { preparerImage, tailleLisible } from '../lib/image'

// Médiathèque — §14 du cahier des charges.
//
// Écran de gestion : corriger un texte alternatif, retrouver une image,
// faire le ménage. Le choix d'une image pendant la rédaction, lui, se fait
// sans passer par ici — c'est `components/SelecteurMedia.jsx`.
//
// §14.2 : le dépôt Git est public. Rien de confidentiel, aucune pièce jointe
// de demande ne doit atterrir ici, et l'écran le dit.

export default function Mediatheque() {
  const { data: sessionData } = authClient.useSession()
  const role = sessionData?.user?.role
  const peutImporter = role && role !== 'lecture_seule'
  const peutSupprimer = ['super_admin', 'coordination', 'communication'].includes(role)

  const [medias, setMedias] = useState([])
  const [categories, setCategories] = useState([])
  const [etat, setEtat] = useState({ chargement: true })
  const [message, setMessage] = useState(null)
  const [filtreCategorie, setFiltreCategorie] = useState('')
  const [recherche, setRecherche] = useState('')
  const [selection, setSelection] = useState(null)

  const charger = useCallback(async () => {
    const params = new URLSearchParams()
    if (filtreCategorie) params.set('categorie', filtreCategorie)
    if (recherche.trim()) params.set('recherche', recherche.trim())
    const r = await appelerApi('/medias' + (params.toString() ? '?' + params : ''))
    if (!r.ok) return setEtat({ chargement: false, erreur: r.erreur })
    setMedias(r.donnees.medias || [])
    setCategories(r.donnees.categories || [])
    setEtat({ chargement: false })
  }, [filtreCategorie, recherche])

  useEffect(() => {
    const minuteur = setTimeout(charger, recherche ? 300 : 0)
    return () => clearTimeout(minuteur)
  }, [charger, recherche])

  const sansDescription = medias.filter((m) => !m.alt).length

  return (
    <div>
      {message && <div className="mb-5"><Message type={message.type}>{message.texte}</Message></div>}

      <div className="flex items-start justify-between gap-4 mb-5">
        <p className="text-sm text-terre/70 max-w-xl leading-relaxed">
          Les images déposées ici sont publiques dès leur mise en ligne.
          N'y placez jamais de document confidentiel ni de pièce jointe reçue
          par formulaire.
        </p>
        {peutImporter && <Import categories={categories} onImporte={() => { setMessage({ type: 'succes', texte: 'Image ajoutée.' }); charger() }} />}
      </div>

      {sansDescription > 0 && (
        <div className="mb-5">
          <Message type="avertissement">
            {sansDescription === 1
              ? "Une image n'a pas de description. Sans elle, les personnes qui ne la voient pas ne savent pas ce qu'elle montre."
              : `${sansDescription} images n'ont pas de description. Sans elle, les personnes qui ne les voient pas ne savent pas ce qu'elles montrent.`}
          </Message>
        </div>
      )}

      <div className="flex flex-wrap gap-2.5 mb-5">
        <input type="search" value={recherche} onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher dans les titres et descriptions…"
          className="px-3.5 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre w-72" />
        <select value={filtreCategorie} onChange={(e) => setFiltreCategorie(e.target.value)}
          className="px-3 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre">
          <option value="">Toutes les rubriques</option>
          {categories.map((c) => <option key={c.cle} value={c.cle}>{c.libelle}</option>)}
        </select>
      </div>

      {etat.chargement && <p className="text-sm text-terre/50">Chargement…</p>}
      {etat.erreur && <Message type="erreur">{etat.erreur}</Message>}

      {!etat.chargement && !etat.erreur && medias.length === 0 && (
        <div className="bg-white border border-beige-dark rounded-2xl p-8 text-center">
          <p className="text-terre/70 text-sm">
            {recherche || filtreCategorie
              ? 'Aucune image ne correspond à cette recherche.'
              : "Aucune image pour l'instant."}
          </p>
        </div>
      )}

      {medias.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {medias.map((m) => (
            <button key={m.id} type="button" onClick={() => setSelection(m)}
              className="text-left bg-white border border-beige-dark rounded-xl overflow-hidden hover:border-ocre transition-colors">
              <div className="aspect-[4/3] bg-beige-light">
                <img src={m.chemin} alt={m.alt || ''} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="px-3 py-2.5">
                <div className="text-[13px] font-semibold text-terre truncate">{m.titre || 'Sans titre'}</div>
                <div className="text-[11.5px] text-terre/50 truncate mt-0.5">{dateCourte(m.creeLe)}</div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {!m.alt && <Etiquette ton="alerte">Sans description</Etiquette>}
                  {m.protege && <Etiquette ton="neutre">Image d'origine</Etiquette>}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selection && (
        <Fiche
          media={selection}
          peutModifier={peutImporter}
          peutSupprimer={peutSupprimer}
          onFermer={() => setSelection(null)}
          onFait={(texte, type = 'succes') => { setMessage({ type, texte }); setSelection(null); charger() }}
        />
      )}
    </div>
  )
}

// ── Import depuis l'écran de gestion ─────────────────────────────────────

function Import({ categories, onImporte }) {
  const champ = useRef(null)
  const [categorie, setCategorie] = useState('actualites')
  const [etat, setEtat] = useState({ phase: 'repos' })

  async function traiter(f) {
    if (!f) return
    setEtat({ phase: 'preparation' })
    let prepare
    try {
      prepare = await preparerImage(f)
    } catch (e) {
      return setEtat({ phase: 'erreur', message: e.message })
    }
    setEtat({ phase: 'envoi' })
    const r = await appelerApi('/medias', {
      methode: 'POST',
      corps: { categorie, fichierBase64: prepare.base64 },
    })
    if (!r.ok) return setEtat({ phase: 'erreur', message: r.erreur })
    setEtat({ phase: 'repos' })
    onImporte()
  }

  return (
    <div className="shrink-0 text-right">
      <div className="flex items-center gap-2.5">
        <select value={categorie} onChange={(e) => setCategorie(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre">
          {categories.map((c) => <option key={c.cle} value={c.cle}>{c.libelle}</option>)}
        </select>
        <input ref={champ} type="file" accept="image/*" className="hidden"
          onChange={(e) => { traiter(e.target.files?.[0]); e.target.value = '' }} />
        <button type="button" onClick={() => champ.current?.click()}
          disabled={etat.phase === 'preparation' || etat.phase === 'envoi'}
          className="px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark disabled:opacity-40 transition-colors">
          {etat.phase === 'preparation' ? 'Préparation…' : etat.phase === 'envoi' ? 'Envoi…' : 'Ajouter une image'}
        </button>
      </div>
      {etat.phase === 'erreur' && (
        <p className="text-[12.5px] text-red-700 mt-2 max-w-xs text-left leading-relaxed">{etat.message}</p>
      )}
    </div>
  )
}

// ── Fiche d'une image ────────────────────────────────────────────────────

function Fiche({ media, peutModifier, peutSupprimer, onFermer, onFait }) {
  const [form, setForm] = useState({
    titre: media.titre || '', alt: media.alt || '',
    credit: media.credit || '', description: media.description || '',
  })
  const [etat, setEtat] = useState({ phase: 'repos' })
  const [usages, setUsages] = useState(null)

  useEffect(() => {
    const surTouche = (e) => { if (e.key === 'Escape') onFermer() }
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [onFermer])

  async function enregistrer() {
    setEtat({ phase: 'envoi' })
    const r = await appelerApi(`/medias?id=${media.id}`, { methode: 'PATCH', corps: form })
    if (!r.ok) {
      const message = r.erreurs ? r.erreurs.map((e) => e.message).join(' ') : r.erreur
      return setEtat({ phase: 'erreur', message })
    }
    onFait('Image mise à jour.')
  }

  async function supprimer() {
    if (!window.confirm("Supprimer définitivement cette image ? Le fichier sera retiré du site.")) return
    setEtat({ phase: 'envoi' })
    const r = await appelerApi(`/medias?id=${media.id}`, { methode: 'DELETE' })
    if (!r.ok) {
      // 409 : l'image sert encore. On montre où, plutôt que de renvoyer un
      // refus que personne ne saurait quoi faire (§24.7).
      if (r.donnees?.usages) setUsages(r.donnees.usages)
      return setEtat({ phase: 'erreur', message: r.erreur })
    }
    onFait('Image supprimée.')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-terre/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onFermer() }}>
      <div className="bg-white rounded-2xl border border-beige-dark w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-beige-dark">
          <h3 className="font-serif text-base text-terre">Image</h3>
          <button type="button" onClick={onFermer} className="text-[13px] text-terre/50 hover:text-ocre-dark">Fermer</button>
        </div>

        <div className="p-6 space-y-4">
          <img src={media.chemin} alt={media.alt || ''} className="w-full max-h-64 object-contain rounded-xl border border-beige-dark bg-beige-light" />

          <p className="text-[12px] text-terre/50 break-all">
            {media.chemin} · ajoutée le {dateCourte(media.creeLe)}
            {media.auteurNom ? ` par ${media.auteurNom}` : ''}
          </p>

          {etat.phase === 'erreur' && <Message type="erreur">{etat.message}</Message>}

          {usages && usages.length > 0 && (
            <div className="border border-beige-dark rounded-xl p-3.5 bg-beige-light/40">
              <p className="text-[12.5px] font-semibold text-terre/70 mb-1.5">Utilisée par :</p>
              <ul className="text-[13px] text-terre space-y-1">
                {usages.map((u) => (
                  <li key={u.table + u.id}>{u.libelle} — {u.titre || 'sans titre'}</li>
                ))}
              </ul>
            </div>
          )}

          <Champ label="Que montre cette image ?" obligatoire
            aide="Lu par les personnes qui ne voient pas l'image, et par les moteurs de recherche.">
            <input type="text" value={form.alt} disabled={!peutModifier}
              onChange={(e) => setForm({ ...form, alt: e.target.value })} className={classeSaisie(false)} />
          </Champ>

          <Champ label="Titre" aide="Pour la retrouver dans la médiathèque.">
            <input type="text" value={form.titre} disabled={!peutModifier}
              onChange={(e) => setForm({ ...form, titre: e.target.value })} className={classeSaisie(false)} />
          </Champ>

          <Champ label="Crédit">
            <input type="text" value={form.credit} disabled={!peutModifier}
              onChange={(e) => setForm({ ...form, credit: e.target.value })} className={classeSaisie(false)} />
          </Champ>

          <Champ label="Description" aide="Contexte de la photo, pour l'équipe.">
            <textarea rows={2} value={form.description} disabled={!peutModifier}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={classeSaisie(false) + ' resize-y'} />
          </Champ>

          {peutModifier && (
            <div className="flex flex-wrap gap-2.5 pt-1">
              <button type="button" onClick={enregistrer} disabled={etat.phase === 'envoi'}
                className="px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark disabled:opacity-40 transition-colors">
                {etat.phase === 'envoi' ? 'Enregistrement…' : 'Enregistrer'}
              </button>
              {peutSupprimer && !media.protege && (
                <button type="button" onClick={supprimer} disabled={etat.phase === 'envoi'}
                  className="ml-auto px-4 py-2.5 rounded-lg border border-red-200 text-[13.5px] font-semibold text-red-700 hover:border-red-400 transition-colors">
                  Supprimer
                </button>
              )}
              {peutSupprimer && media.protege && (
                <p className="ml-auto max-w-xs text-[12px] text-terre/55 leading-relaxed text-right">
                  Image d'origine du site : sa suppression demande une vérification technique.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
