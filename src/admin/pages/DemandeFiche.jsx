import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { appelerApi } from '../lib/api'
import { authClient } from '../lib/authClient'
import { Champ, Etiquette, Message, classeSaisie } from '../components/Formulaire'
import {
  LIBELLES_RUBRIQUE, LIBELLES_STATUT_DEMANDE, STATUTS,
  champsLisibles, transitionStatutAutorisee,
} from '../../../lib/demandes.js'

// Fiche d'une demande — §15 du cahier des charges.
//
// Deux précautions structurent cet écran, et expliquent qu'il soit plus
// bavard que les autres :
//
//   — On ne rédige pas une réponse sans avoir pris le verrou. Le §15 demande
//     d'éviter que deux personnes répondent au même message ; la seule façon
//     d'y arriver est de le signaler AVANT la rédaction, pas au moment de
//     l'envoi, quand le message est déjà écrit.
//
//   — Un envoi dont on ignore le sort n'est jamais présenté comme réussi ni
//     comme échoué. L'écran le dit, et demande à l'équipe de trancher après
//     avoir regardé la boîte d'envoi. Deviner à sa place, c'est choisir entre
//     un doublon et un silence — sans le lui dire.

const TONS_ENVOI = {
  envoye: 'calme',
  echec: 'alerte',
  incertain: 'alerte',
  en_cours: 'neutre',
}

const LIBELLES_ENVOI = {
  envoye: 'Envoyé',
  echec: 'Non envoyé',
  incertain: 'Sort inconnu',
  en_cours: 'Envoi en cours',
}

function dateHeure(valeur) {
  if (!valeur) return '—'
  return new Date(valeur).toLocaleString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function DemandeFiche() {
  const { id } = useParams()
  const { data: sessionData } = authClient.useSession()
  const moi = sessionData?.user

  const [etat, setEtat] = useState({ chargement: true })
  const [donnees, setDonnees] = useState(null)
  const [message, setMessage] = useState(null)

  const charger = useCallback(async () => {
    const r = await appelerApi(`/demandes?id=${id}`)
    if (!r.ok) return setEtat({ chargement: false, erreur: r.erreur })
    setDonnees(r.donnees)
    setEtat({ chargement: false })
  }, [id])

  useEffect(() => { setEtat({ chargement: true }); charger() }, [charger])

  if (etat.chargement) return <p className="text-sm text-terre/50">Chargement…</p>
  if (etat.erreur) return <Message type="erreur">{etat.erreur}</Message>
  if (!donnees) return null

  const { demande, notes, emails, verrou, peutRepondre, equipe } = donnees
  const champs = champsLisibles(demande)

  return (
    <div className="max-w-4xl">
      <Link to="/admin/demandes" className="text-[13px] text-olive font-semibold hover:underline">
        ← Retour à la boîte
      </Link>

      {message && <div className="mt-4"><Message type={message.type}>{message.texte}</Message></div>}

      <div className="mt-4 bg-white border border-beige-dark rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="min-w-0">
            <h2 className="font-serif text-xl text-terre truncate">
              {demande.nom || demande.email || 'Demande sans nom'}
            </h2>
            <p className="text-[12.5px] text-terre/55 mt-1">
              {LIBELLES_RUBRIQUE[demande.rubrique] || demande.rubrique}
              {' · reçue le '}{dateHeure(demande.creeLe)}
            </p>
          </div>
          <Etiquette ton={demande.statut === 'spam' ? 'alerte' : 'accent'}>
            {LIBELLES_STATUT_DEMANDE[demande.statut] || demande.statut}
          </Etiquette>
        </div>

        {demande.statut === 'spam' && (
          <div className="mb-5">
            <Message type="avertissement">
              Cette demande a été classée en indésirable. Si c'est une erreur, changez son
              statut ci-dessous : rien n'a été supprimé.
            </Message>
          </div>
        )}

        <dl className="border border-beige-dark rounded-xl overflow-hidden">
          {champs.map((c, i) => (
            <div key={c.cle} className={`flex gap-4 px-4 py-2.5 ${i > 0 ? 'border-t border-beige-dark' : ''}`}>
              <dt className="w-44 shrink-0 text-[12.5px] text-terre/55">{c.libelle}</dt>
              <dd className="text-[13.5px] text-terre whitespace-pre-wrap break-words">{c.valeur}</dd>
            </div>
          ))}
          {champs.length === 0 && (
            <div className="px-4 py-3 text-[13px] text-terre/50">Ce formulaire n'a transmis aucun champ.</div>
          )}
        </dl>

        <BarreTraitement
          demande={demande} equipe={equipe} peutRepondre={peutRepondre}
          onFait={(texte) => { setMessage({ type: 'succes', texte }); charger() }}
          onErreur={(texte) => setMessage({ type: 'erreur', texte })}
        />
      </div>

      <Notes id={id} notes={notes} onMaj={(n) => setDonnees({ ...donnees, notes: n })} />

      <Reponse
        id={id} demande={demande} emails={emails} verrou={verrou}
        peutRepondre={peutRepondre} moiId={moi?.id}
        onRecharger={charger}
      />
    </div>
  )
}

// ── Statut et assignation ────────────────────────────────────────────────

function BarreTraitement({ demande, equipe, peutRepondre, onFait, onErreur }) {
  const [occupe, setOccupe] = useState(false)

  async function modifier(champs, texte) {
    setOccupe(true)
    const r = await appelerApi(`/demandes?id=${demande.id}`, { methode: 'PATCH', corps: champs })
    setOccupe(false)
    if (!r.ok) return onErreur(r.erreur)
    onFait(texte)
  }

  if (!peutRepondre) {
    return (
      <p className="mt-5 text-[12.5px] text-terre/55">
        Vous pouvez consulter cette rubrique mais pas y agir : le statut et l'assignation
        sont en lecture seule. La Coordination peut vous ouvrir ce droit.
      </p>
    )
  }

  // « Nouveau » disparaît de la liste dès qu'on en est sorti : le proposer
  // sans pouvoir l'appliquer reviendrait à annoncer une action impossible.
  const statutsProposables = STATUTS.filter(
    (s) => s.cle === demande.statut || transitionStatutAutorisee(demande.statut, s.cle).ok
  )

  return (
    <div className="mt-5 flex flex-wrap items-end gap-4">
      <div>
        <label className="block text-[12.5px] text-terre/60 mb-1.5">Statut</label>
        <select value={demande.statut} disabled={occupe}
          onChange={(e) => modifier({ statut: e.target.value }, 'Statut mis à jour.')}
          className="px-3 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre">
          {statutsProposables.map((s) => <option key={s.cle} value={s.cle}>{s.libelle}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-[12.5px] text-terre/60 mb-1.5">Confiée à</label>
        <select value={demande.assigneAId || ''} disabled={occupe}
          onChange={(e) => modifier({ assigneAId: e.target.value || null }, 'Assignation mise à jour.')}
          className="px-3 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre">
          <option value="">Personne</option>
          {equipe.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </div>
    </div>
  )
}

// ── Notes internes ───────────────────────────────────────────────────────

function Notes({ id, notes, onMaj }) {
  const [contenu, setContenu] = useState('')
  const [occupe, setOccupe] = useState(false)
  const [erreur, setErreur] = useState(null)

  async function ajouter(e) {
    e.preventDefault()
    if (!contenu.trim()) return
    setOccupe(true)
    const r = await appelerApi(`/demandes?id=${id}&action=note`, {
      methode: 'POST', corps: { contenu },
    })
    setOccupe(false)
    if (!r.ok) return setErreur(r.erreur)
    setErreur(null)
    setContenu('')
    onMaj(r.donnees.notes)
  }

  return (
    <section className="mt-5 bg-white border border-beige-dark rounded-2xl p-6">
      <h3 className="font-serif text-base text-terre mb-1">Notes internes</h3>
      <p className="text-[12.5px] text-terre/55 mb-4">
        Visibles uniquement par l'équipe. Elles ne sont jamais envoyées au demandeur.
      </p>

      <form onSubmit={ajouter} className="mb-4">
        <textarea value={contenu} onChange={(e) => setContenu(e.target.value)} rows={3}
          placeholder="Ce qu'il faut savoir pour la suite…"
          className={classeSaisie(false) + ' resize-y'} />
        {erreur && <div className="mt-2"><Message type="erreur">{erreur}</Message></div>}
        <button type="submit" disabled={occupe || !contenu.trim()}
          className="mt-2 px-4 py-2 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark disabled:opacity-40 transition-colors">
          {occupe ? 'Enregistrement…' : 'Ajouter la note'}
        </button>
      </form>

      {notes.length === 0 && <p className="text-[13px] text-terre/50">Aucune note pour l'instant.</p>}
      {notes.map((n) => (
        <div key={n.id} className="border-t border-beige-dark pt-3 mt-3">
          <div className="text-[11.5px] text-terre/45 mb-1">
            {n.auteurNom || 'Compte supprimé'} · {dateHeure(n.creeLe)}
          </div>
          <div className="text-[13.5px] text-terre whitespace-pre-wrap">{n.contenu}</div>
        </div>
      ))}
    </section>
  )
}

// ── Réponse par email ────────────────────────────────────────────────────

function Reponse({ id, demande, emails, verrou, peutRepondre, moiId, onRecharger }) {
  const [ouvert, setOuvert] = useState(false)
  const [champs, setChamps] = useState({ destinataire: '', sujet: '', corps: '' })
  const [occupe, setOccupe] = useState(false)
  const [erreur, setErreur] = useState(null)
  const verrouPris = useRef(false)

  const jeDetiens = verrou && verrou.verrouilleParId === moiId
  const quelquUnDautre = verrou && verrou.verrouilleParId !== moiId

  // Le verrou est relâché quand on quitte la page : sans cela, fermer
  // l'onglet en cours de rédaction bloquerait la demande pour tout le monde
  // pendant dix minutes, sans que personne sache pourquoi.
  useEffect(() => {
    return () => {
      if (verrouPris.current) {
        appelerApi(`/demandes?id=${id}&action=verrou`, { methode: 'DELETE' })
      }
    }
  }, [id])

  async function commencer() {
    setOccupe(true)
    const r = await appelerApi(`/demandes?id=${id}&action=verrou`, { methode: 'POST' })
    setOccupe(false)
    if (!r.ok) { setErreur(r.erreur); onRecharger(); return }
    verrouPris.current = true
    setErreur(null)
    setChamps({
      destinataire: demande.email || '',
      sujet: `Votre message à Ressources`,
      corps: '',
    })
    setOuvert(true)
    onRecharger()
  }

  async function annuler() {
    await appelerApi(`/demandes?id=${id}&action=verrou`, { methode: 'DELETE' })
    verrouPris.current = false
    setOuvert(false)
    setErreur(null)
    onRecharger()
  }

  async function envoyer(e) {
    e.preventDefault()
    setOccupe(true)
    const r = await appelerApi(`/demandes?id=${id}&action=repondre`, { methode: 'POST', corps: champs })
    setOccupe(false)
    if (!r.ok) { setErreur(r.erreur); onRecharger(); return }
    verrouPris.current = false
    setOuvert(false)
    setErreur(null)
    onRecharger()
  }

  async function trancher(emailId, resultat) {
    const r = await appelerApi(`/demandes?id=${id}&action=confirmer-envoi`, {
      methode: 'POST', corps: { emailId, resultat },
    })
    if (!r.ok) setErreur(r.erreur)
    onRecharger()
  }

  const incertains = emails.filter((e) => e.statutEnvoi === 'incertain')

  return (
    <section className="mt-5 bg-white border border-beige-dark rounded-2xl p-6">
      <h3 className="font-serif text-base text-terre mb-4">Répondre par email</h3>

      {erreur && <div className="mb-4"><Message type="erreur">{erreur}</Message></div>}

      {incertains.length > 0 && (
        <div className="mb-4">
          <Message type="avertissement">
            Un message a été envoyé sans que nous recevions la confirmation de Brevo :
            nous ne savons pas s'il est arrivé. Ouvrez la boîte d'envoi de l'association
            pour vérifier, puis indiquez-le ci-dessous. Tant que ce n'est pas fait,
            aucun nouvel envoi n'est possible — pour éviter d'écrire deux fois à la
            même personne.
          </Message>
        </div>
      )}

      {!peutRepondre && (
        <p className="text-[13px] text-terre/55">
          Vous n'avez pas le droit de répondre dans cette rubrique.
        </p>
      )}

      {peutRepondre && quelquUnDautre && (
        <Message type="avertissement">
          {verrou.parNom || 'Quelqu’un'} rédige actuellement une réponse à cette demande.
          Attendez la fin de sa rédaction plutôt que d'écrire en parallèle.
        </Message>
      )}

      {peutRepondre && !ouvert && !quelquUnDautre && (
        <button type="button" onClick={commencer} disabled={occupe || incertains.length > 0}
          className="px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark disabled:opacity-40 transition-colors">
          {occupe ? 'Un instant…' : 'Rédiger une réponse'}
        </button>
      )}

      {peutRepondre && ouvert && jeDetiens !== false && (
        <form onSubmit={envoyer} className="space-y-4">
          <p className="text-[12.5px] text-terre/55">
            La demande vous est réservée le temps de la rédaction : personne d'autre ne
            peut y répondre tant que cette fenêtre est ouverte.
          </p>

          <Champ label="Destinataire" obligatoire>
            <input type="email" value={champs.destinataire}
              onChange={(e) => setChamps({ ...champs, destinataire: e.target.value })}
              className={classeSaisie(false)} />
          </Champ>

          <Champ label="Objet" obligatoire>
            <input type="text" value={champs.sujet} maxLength={200}
              onChange={(e) => setChamps({ ...champs, sujet: e.target.value })}
              className={classeSaisie(false)} />
          </Champ>

          <Champ label="Message" obligatoire
            aide="Texte simple : les retours à la ligne sont conservés, la mise en forme n'est pas gérée.">
            <textarea value={champs.corps} rows={10}
              onChange={(e) => setChamps({ ...champs, corps: e.target.value })}
              className={classeSaisie(false) + ' resize-y'} />
          </Champ>

          <div className="flex gap-2.5">
            <button type="submit" disabled={occupe}
              className="px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark disabled:opacity-40 transition-colors">
              {occupe ? 'Envoi…' : 'Envoyer'}
            </button>
            <button type="button" onClick={annuler} disabled={occupe}
              className="px-4 py-2.5 rounded-lg border border-beige-dark text-[13.5px] font-semibold text-terre hover:border-ocre transition-colors">
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="mt-6">
        <h4 className="text-[13px] font-semibold text-terre/70 mb-2">Messages envoyés</h4>
        {emails.length === 0 && (
          <p className="text-[13px] text-terre/50">Aucune réponse n'a encore été envoyée.</p>
        )}
        {emails.map((e) => (
          <div key={e.id} className="border-t border-beige-dark pt-3 mt-3">
            <div className="flex items-center gap-2.5 mb-1">
              <Etiquette ton={TONS_ENVOI[e.statutEnvoi]}>
                {LIBELLES_ENVOI[e.statutEnvoi] || e.statutEnvoi}
              </Etiquette>
              <span className="text-[11.5px] text-terre/45">
                {dateHeure(e.tentativeLe)} · {e.auteurNom || 'Compte supprimé'} · à {e.destinataire}
              </span>
            </div>
            <div className="text-[13.5px] font-semibold text-terre">{e.sujet}</div>
            <div className="text-[13px] text-terre/75 whitespace-pre-wrap mt-1">{e.corps}</div>
            {e.erreur && <div className="text-[12px] text-red-700 mt-1.5">{e.erreur}</div>}

            {e.statutEnvoi === 'incertain' && peutRepondre && (
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                <span className="text-[12.5px] text-terre/60">
                  Après vérification de la boîte d'envoi, ce message :
                </span>
                <button type="button" onClick={() => trancher(e.id, 'envoye')}
                  className="px-3 py-1.5 rounded-lg border border-beige-dark text-[12.5px] font-semibold text-terre hover:border-ocre transition-colors">
                  est bien parti
                </button>
                <button type="button" onClick={() => trancher(e.id, 'echec')}
                  className="px-3 py-1.5 rounded-lg border border-beige-dark text-[12.5px] font-semibold text-terre hover:border-ocre transition-colors">
                  n'est jamais parti
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
