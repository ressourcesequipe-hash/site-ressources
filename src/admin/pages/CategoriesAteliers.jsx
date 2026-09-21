import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { appelerApi } from '../lib/api'
import { Champ, classeSaisie, Message } from '../components/Formulaire'

// Gestion des catégories d'ateliers — §11 du cahier des charges.
//
// « Les catégories doivent être administrables et non codées en dur. »
// C'est la seule liste du projet dans ce cas.
//
// Une catégorie ne se supprime pas, elle se désactive : une suppression
// laisserait des fiches d'atelier rattachées à une catégorie disparue, et
// surtout ferait perdre l'information sans retour possible (§24.7). Le
// nombre d'ateliers concernés est affiché à côté de chacune, pour qu'on
// sache ce qu'on déplace avant de le faire.

export default function CategoriesAteliers() {
  const [etat, setEtat] = useState({ chargement: true })
  const [categories, setCategories] = useState([])
  const [nouveau, setNouveau] = useState('')
  const [message, setMessage] = useState(null)

  async function charger() {
    const r = await appelerApi('/categories-ateliers')
    if (!r.ok) return setEtat({ chargement: false, erreur: r.erreur })
    setCategories(r.donnees.categories || [])
    setEtat({ chargement: false })
  }

  useEffect(() => { charger() }, [])

  async function ajouter(e) {
    e.preventDefault()
    if (!nouveau.trim()) return
    setMessage(null)
    const r = await appelerApi('/categories-ateliers', { methode: 'POST', corps: { libelle: nouveau.trim(), ordre: categories.length + 1 } })
    if (!r.ok) return setMessage({ type: 'erreur', texte: r.erreurs?.[0]?.message || r.erreur })
    setNouveau('')
    setMessage({ type: 'succes', texte: 'Catégorie ajoutée.' })
    charger()
  }

  async function enregistrer(categorie, modifications) {
    setMessage(null)
    const r = await appelerApi('/categories-ateliers', {
      methode: 'PUT',
      corps: { id: categorie.id, libelle: categorie.libelle, ordre: categorie.ordre, actif: categorie.actif, ...modifications },
    })
    if (!r.ok) return setMessage({ type: 'erreur', texte: r.erreurs?.[0]?.message || r.erreur })
    charger()
  }

  if (etat.chargement) return <p className="text-sm text-terre/50">Chargement…</p>

  return (
    <div className="max-w-2xl">
      <Link to="/admin/ateliers" className="text-[13px] text-olive font-semibold hover:underline">
        ← Tous les ateliers
      </Link>

      <p className="text-sm text-terre/70 leading-relaxed mt-4 mb-5">
        Ces catégories servent à ranger les ateliers et à les filtrer sur le site.
        Renommer une catégorie est sans conséquence : les ateliers restent rattachés.
        Une catégorie retirée est simplement masquée, jamais effacée.
      </p>

      {etat.erreur && <Message type="erreur">{etat.erreur}</Message>}
      {message && <div className="mb-4"><Message type={message.type}>{message.texte}</Message></div>}

      <div className="bg-white border border-beige-dark rounded-2xl overflow-hidden mb-5">
        {categories.map((c, index) => (
          <div key={c.id}
            className={`flex items-center gap-3 px-5 py-3 ${index > 0 ? 'border-t border-beige-dark' : ''} ${
              c.actif ? '' : 'bg-beige-light/50'}`}>
            <input
              type="text"
              defaultValue={c.libelle}
              onBlur={(e) => e.target.value.trim() && e.target.value !== c.libelle && enregistrer(c, { libelle: e.target.value.trim() })}
              className={`flex-1 px-3 py-1.5 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre ${
                c.actif ? '' : 'text-terre/50'}`}
            />
            <span className="text-[12px] text-terre/50 w-28 text-right shrink-0">
              {c.nbAteliers === 0 ? 'aucun atelier' : c.nbAteliers === 1 ? '1 atelier' : `${c.nbAteliers} ateliers`}
            </span>
            <label className="flex items-center gap-2 text-[12.5px] text-terre/70 shrink-0 cursor-pointer">
              <input type="checkbox" checked={c.actif}
                onChange={(e) => enregistrer(c, { actif: e.target.checked })} className="accent-ocre" />
              Proposée
            </label>
          </div>
        ))}
      </div>

      <form onSubmit={ajouter} className="bg-white border border-beige-dark rounded-2xl p-5">
        <Champ label="Ajouter une catégorie" aide="Exemple : Numérique, Réemploi, Établissements scolaires.">
          <div className="flex gap-2.5">
            <input type="text" value={nouveau} onChange={(e) => setNouveau(e.target.value)}
              className={classeSaisie(false)} />
            <button type="submit" disabled={!nouveau.trim()}
              className="shrink-0 px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark disabled:opacity-40">
              Ajouter
            </button>
          </div>
        </Champ>
      </form>
    </div>
  )
}
