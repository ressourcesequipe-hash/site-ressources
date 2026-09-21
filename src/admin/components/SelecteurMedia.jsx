import { useCallback, useEffect, useRef, useState } from 'react'
import { appelerApi } from '../lib/api'
import { preparerImage, tailleLisible } from '../lib/image'
import { Champ, Message, classeSaisie } from './Formulaire'

// Choix d'une image dans un formulaire — §14, rubrique UX.
//
// Remplace le champ où il fallait taper « /medias/actualites/xyz.webp » de
// mémoire. Deux gestes possibles, et c'est le point : reprendre une image
// déjà présente, ou en déposer une nouvelle — « sélectionner une image
// existante sans la ré-uploader », dit le §14.
//
// Le texte alternatif est demandé au moment du dépôt, pas plus tard : c'est
// le seul instant où la personne a l'image sous les yeux et sait ce qu'elle
// montre. Réclamé après coup, il finit rempli au jugé, ou pas du tout.

export default function SelecteurMedia({
  valeur,
  onChange,
  categorie,
  label = 'Image',
  aide,
  erreur,
  peutImporter = true,
}) {
  const [ouvert, setOuvert] = useState(false)

  return (
    <Champ label={label} aide={aide} erreur={erreur}>
      {valeur ? (
        <div className="flex items-center gap-3.5 p-3 border border-beige-dark rounded-xl bg-beige-light/40">
          <img src={valeur} alt="" className="w-20 h-20 object-cover rounded-lg border border-beige-dark bg-white" />
          <div className="min-w-0 flex-1">
            <div className="text-[12px] text-terre/55 truncate">{valeur}</div>
            <div className="flex gap-2 mt-2">
              <button type="button" onClick={() => setOuvert(true)}
                className="px-3 py-1.5 rounded-lg border border-beige-dark text-[12.5px] font-semibold text-terre hover:border-ocre transition-colors">
                Changer
              </button>
              <button type="button" onClick={() => onChange('')}
                className="px-3 py-1.5 rounded-lg border border-beige-dark text-[12.5px] font-semibold text-terre/70 hover:border-ocre transition-colors">
                Retirer
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setOuvert(true)}
          className={classeSaisie(erreur) + ' text-left text-terre/50 hover:border-ocre cursor-pointer'}>
          Choisir une image…
        </button>
      )}

      {ouvert && (
        <Mediatheque
          categorie={categorie}
          peutImporter={peutImporter}
          onChoisir={(chemin) => { onChange(chemin); setOuvert(false) }}
          onFermer={() => setOuvert(false)}
        />
      )}
    </Champ>
  )
}

// ── Fenêtre de choix ─────────────────────────────────────────────────────

function Mediatheque({ categorie, peutImporter, onChoisir, onFermer }) {
  const [medias, setMedias] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)
  const [recherche, setRecherche] = useState('')
  const [toutesCategories, setToutesCategories] = useState(false)

  const charger = useCallback(async () => {
    setChargement(true)
    const params = new URLSearchParams()
    if (!toutesCategories && categorie) params.set('categorie', categorie)
    if (recherche.trim()) params.set('recherche', recherche.trim())
    const r = await appelerApi('/medias' + (params.toString() ? '?' + params : ''))
    setChargement(false)
    if (!r.ok) return setErreur(r.erreur)
    setErreur(null)
    setMedias(r.donnees.medias || [])
  }, [categorie, toutesCategories, recherche])

  useEffect(() => {
    const minuteur = setTimeout(charger, recherche ? 300 : 0)
    return () => clearTimeout(minuteur)
  }, [charger, recherche])

  // Échap ferme, comme partout ailleurs : rester coincé dans une fenêtre est
  // le genre de détail qui fait renoncer (§24).
  useEffect(() => {
    const surTouche = (e) => { if (e.key === 'Escape') onFermer() }
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [onFermer])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-terre/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onFermer() }}>
      <div className="bg-white rounded-2xl border border-beige-dark w-full max-w-3xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-beige-dark">
          <h3 className="font-serif text-base text-terre">Choisir une image</h3>
          <button type="button" onClick={onFermer}
            className="text-[13px] text-terre/50 hover:text-ocre-dark">Fermer</button>
        </div>

        <div className="px-6 py-3 border-b border-beige-dark flex flex-wrap items-center gap-2.5">
          <input type="search" value={recherche} onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher…"
            className="px-3.5 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre flex-1 min-w-[180px]" />
          {categorie && (
            <label className="flex items-center gap-2 text-[13px] text-terre/70 select-none">
              <input type="checkbox" checked={toutesCategories} className="accent-ocre"
                onChange={(e) => setToutesCategories(e.target.checked)} />
              Toutes les rubriques
            </label>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {erreur && <Message type="erreur">{erreur}</Message>}
          {chargement && <p className="text-sm text-terre/50">Chargement…</p>}

          {!chargement && !erreur && medias.length === 0 && (
            <p className="text-[13.5px] text-terre/55 text-center py-6">
              {recherche
                ? 'Aucune image ne correspond à cette recherche.'
                : "Aucune image pour l'instant. Déposez-en une ci-dessous."}
            </p>
          )}

          {medias.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {medias.map((m) => (
                <button key={m.id} type="button" onClick={() => onChoisir(m.chemin)}
                  className="group text-left border border-beige-dark rounded-xl overflow-hidden hover:border-ocre transition-colors">
                  <div className="aspect-[4/3] bg-beige-light">
                    <img src={m.chemin} alt={m.alt || ''} loading="lazy"
                      className="w-full h-full object-cover" />
                  </div>
                  <div className="px-2.5 py-2">
                    <div className="text-[12px] text-terre truncate">{m.titre || 'Sans titre'}</div>
                    {!m.alt && (
                      <div className="text-[11px] text-ocre-dark mt-0.5">Sans description</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {peutImporter && (
          <Depot categorie={categorie} onImporte={(chemin) => onChoisir(chemin)} />
        )}
      </div>
    </div>
  )
}

// ── Dépôt d'une nouvelle image ───────────────────────────────────────────

function Depot({ categorie, onImporte }) {
  const champFichier = useRef(null)
  const [fichier, setFichier] = useState(null)
  const [apercu, setApercu] = useState(null)
  const [alt, setAlt] = useState('')
  const [credit, setCredit] = useState('')
  const [etat, setEtat] = useState({ phase: 'repos' })

  async function choisirFichier(f) {
    if (!f) return
    setEtat({ phase: 'preparation' })
    try {
      const prepare = await preparerImage(f)
      setFichier(prepare)
      setApercu(URL.createObjectURL(f))
      setEtat({ phase: 'pret' })
    } catch (e) {
      setFichier(null)
      setEtat({ phase: 'erreur', message: e.message })
    }
  }

  async function envoyer() {
    if (!alt.trim()) {
      return setEtat({
        phase: 'erreur',
        message: "Décrivez ce que montre l'image : c'est ce que liront les personnes qui ne la voient pas, et ce que comprendra un moteur de recherche.",
      })
    }
    setEtat({ phase: 'envoi' })
    const r = await appelerApi('/medias', {
      methode: 'POST',
      corps: { categorie, fichierBase64: fichier.base64, alt: alt.trim(), credit: credit.trim() },
    })
    if (!r.ok) {
      const message = r.erreurs ? r.erreurs.map((e) => e.message).join(' ') : r.erreur
      return setEtat({ phase: 'erreur', message })
    }
    onImporte(r.donnees.media.chemin)
  }

  return (
    <div className="border-t border-beige-dark px-6 py-4 bg-beige-light/40">
      {etat.phase === 'erreur' && (
        <div className="mb-3"><Message type="erreur">{etat.message}</Message></div>
      )}

      {!fichier ? (
        <div className="flex items-center gap-3">
          <input ref={champFichier} type="file" accept="image/*" className="hidden"
            onChange={(e) => choisirFichier(e.target.files?.[0])} />
          <button type="button" onClick={() => champFichier.current?.click()}
            disabled={etat.phase === 'preparation'}
            className="px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark disabled:opacity-40 transition-colors">
            {etat.phase === 'preparation' ? 'Préparation…' : 'Déposer une image'}
          </button>
          <p className="text-[12.5px] text-terre/55">
            JPG, PNG ou WebP. Les grandes photos sont réduites automatiquement.
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-4">
          <img src={apercu} alt="" className="w-24 h-24 object-cover rounded-lg border border-beige-dark" />
          <div className="min-w-0 flex-1 space-y-3">
            <p className="text-[12px] text-terre/55">
              {fichier.largeur} × {fichier.hauteur} px — {tailleLisible(fichier.octets)}
              {fichier.reduite && ` (réduite depuis ${tailleLisible(fichier.octetsOrigine)})`}
            </p>

            <div>
              <label className="block text-[12.5px] text-terre/60 mb-1.5">
                Que montre cette image ? <span className="text-ocre-dark">obligatoire</span>
              </label>
              <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)}
                placeholder="Un bénévole démonte un ordinateur portable à l'établi."
                className={classeSaisie(false)} />
            </div>

            <div>
              <label className="block text-[12.5px] text-terre/60 mb-1.5">Crédit photo</label>
              <input type="text" value={credit} onChange={(e) => setCredit(e.target.value)}
                placeholder="Photo Ressources" className={classeSaisie(false)} />
            </div>

            <div className="flex gap-2.5">
              <button type="button" onClick={envoyer} disabled={etat.phase === 'envoi'}
                className="px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark disabled:opacity-40 transition-colors">
                {etat.phase === 'envoi' ? 'Envoi…' : 'Ajouter cette image'}
              </button>
              <button type="button" disabled={etat.phase === 'envoi'}
                onClick={() => { setFichier(null); setApercu(null); setAlt(''); setCredit(''); setEtat({ phase: 'repos' }) }}
                className="px-4 py-2.5 rounded-lg border border-beige-dark text-[13.5px] font-semibold text-terre hover:border-ocre transition-colors">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
