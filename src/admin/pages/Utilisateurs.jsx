import { Fragment, useCallback, useEffect, useState } from 'react'
import { appelerApi } from '../lib/api'
import { authClient } from '../lib/authClient'
import { Champ, Etiquette, Message, classeSaisie, dateCourte } from '../components/Formulaire'

// Utilisateurs et rôles — §21 du cahier des charges.
//
// Deux principes tiennent cet écran :
//
//   — **On désactive, on ne supprime pas.** La suppression est d'ailleurs
//     impossible dès que la personne a modifié un contenu : l'historique
//     garde son auteur. Le dire ici évite de chercher un bouton qui n'existe
//     pas.
//
//   — **Aucun mot de passe ne passe par cet écran.** Créer un compte envoie
//     une invitation ; la personne choisit son mot de passe elle-même. Vous
//     ne le voyez jamais, et n'avez donc jamais à le transmettre.

const TONS_ROLE = {
  super_admin: 'accent',
  coordination: 'calme',
  communication: 'calme',
  contributeur: 'neutre',
  lecture_seule: 'neutre',
}

// Les rôles dont l'accès aux demandes se configure. Super administrateur et
// Coordination en sont absents : le leur, garanti par le code, ne se retire
// pas — les afficher ici laisserait croire le contraire.
const ROLES_CONFIGURABLES = ['communication', 'contributeur', 'lecture_seule']

export default function Utilisateurs() {
  const { data: sessionData } = authClient.useSession()
  const moi = sessionData?.user

  const [etat, setEtat] = useState({ chargement: true })
  const [donnees, setDonnees] = useState(null)
  const [message, setMessage] = useState(null)

  const charger = useCallback(async () => {
    const r = await appelerApi('/utilisateurs')
    if (!r.ok) return setEtat({ chargement: false, erreur: r.erreur })
    setDonnees(r.donnees)
    setEtat({ chargement: false })
  }, [])

  useEffect(() => { charger() }, [charger])

  if (etat.chargement) return <p className="text-sm text-terre/50">Chargement…</p>
  if (etat.erreur) return <Message type="erreur">{etat.erreur}</Message>
  if (!donnees) return null

  return (
    <div className="max-w-4xl">
      {message && <div className="mb-5"><Message type={message.type}>{message.texte}</Message></div>}

      <NouveauCompte
        roles={donnees.roles}
        onCree={(texte, type = 'succes') => { setMessage({ type, texte }); charger() }}
      />

      <Liste
        donnees={donnees} moiId={moi?.id}
        onFait={(texte, type = 'succes') => { setMessage({ type, texte }); charger() }}
      />

      <Permissions
        donnees={donnees}
        onFait={(texte, type = 'succes') => { setMessage({ type, texte }); charger() }}
      />
    </div>
  )
}

// ── Création ─────────────────────────────────────────────────────────────

function NouveauCompte({ roles, onCree }) {
  const [ouvert, setOuvert] = useState(false)
  const [form, setForm] = useState({ nom: '', email: '', role: 'contributeur' })
  const [erreurs, setErreurs] = useState({})
  const [envoi, setEnvoi] = useState(false)

  const roleChoisi = roles.find((r) => r.cle === form.role)

  async function soumettre(e) {
    e.preventDefault()
    setEnvoi(true)
    setErreurs({})
    const r = await appelerApi('/utilisateurs', { methode: 'POST', corps: form })
    setEnvoi(false)

    if (r.erreurs) return setErreurs(Object.fromEntries(r.erreurs.map((x) => [x.champ, x.message])))
    if (!r.ok) return onCree(r.erreur, 'erreur')

    setForm({ nom: '', email: '', role: 'contributeur' })
    setOuvert(false)
    // Le compte existe même si l'email n'est pas parti : le dire évite de le
    // recréer en double, et indique le bon geste.
    if (r.donnees?.invitation?.envoyee === false) {
      return onCree(
        `Le compte est créé, mais l'invitation n'a pas pu partir. Utilisez « Renvoyer l'invitation » dans la liste.`,
        'avertissement'
      )
    }
    onCree(`Invitation envoyée à ${form.email}. La personne choisira son mot de passe elle-même.`)
  }

  if (!ouvert) {
    return (
      <div className="flex items-start justify-between gap-4 mb-5">
        <p className="text-sm text-terre/70 max-w-xl leading-relaxed">
          Créer un compte envoie une invitation par email : la personne choisit son
          mot de passe elle-même, et vous ne le connaissez jamais.
        </p>
        <button type="button" onClick={() => setOuvert(true)}
          className="shrink-0 px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark transition-colors">
          Ajouter un membre
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={soumettre} className="bg-white border border-beige-dark rounded-2xl p-6 mb-5 space-y-4">
      <h2 className="font-serif text-base text-terre">Ajouter un membre</h2>

      <Champ label="Nom" obligatoire erreur={erreurs.nom}>
        <input type="text" value={form.nom} disabled={envoi}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
          className={classeSaisie(erreurs.nom)} />
      </Champ>

      <Champ label="Adresse email" obligatoire erreur={erreurs.email}
        aide="C'est à cette adresse que partira l'invitation, et elle servira d'identifiant.">
        <input type="email" value={form.email} disabled={envoi}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={classeSaisie(erreurs.email)} />
      </Champ>

      <Champ label="Rôle" obligatoire erreur={erreurs.role} aide={roleChoisi?.description}>
        <select value={form.role} disabled={envoi}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className={classeSaisie(erreurs.role)}>
          {roles.map((r) => <option key={r.cle} value={r.cle}>{r.libelle}</option>)}
        </select>
      </Champ>

      <div className="flex gap-2.5 pt-1">
        <button type="submit" disabled={envoi}
          className="px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark disabled:opacity-40 transition-colors">
          {envoi ? 'Envoi…' : "Créer et inviter"}
        </button>
        <button type="button" onClick={() => { setOuvert(false); setErreurs({}) }} disabled={envoi}
          className="px-4 py-2.5 rounded-lg border border-beige-dark text-[13.5px] font-semibold text-terre hover:border-ocre transition-colors">
          Annuler
        </button>
      </div>
    </form>
  )
}

// ── Liste ────────────────────────────────────────────────────────────────

function Liste({ donnees, moiId, onFait }) {
  const [occupe, setOccupe] = useState(null)
  const libelleRole = Object.fromEntries(donnees.roles.map((r) => [r.cle, r.libelle]))

  async function modifier(compte, champs, texte) {
    setOccupe(compte.id)
    const r = await appelerApi(`/utilisateurs?id=${compte.id}`, { methode: 'PATCH', corps: champs })
    setOccupe(null)
    if (!r.ok) return onFait(r.erreur, 'erreur')
    onFait(texte)
  }

  async function reinviter(compte) {
    setOccupe(compte.id)
    const r = await appelerApi(`/utilisateurs?id=${compte.id}&action=reinviter`, { methode: 'POST', corps: {} })
    setOccupe(null)
    if (!r.ok) return onFait(r.erreur, 'erreur')
    onFait(`Nouvelle invitation envoyée à ${compte.email}.`)
  }

  return (
    <div className="bg-white border border-beige-dark rounded-2xl overflow-hidden mb-5">
      {donnees.utilisateurs.map((u, index) => {
        const soiMeme = u.id === moiId
        return (
          <div key={u.id}
            className={`flex flex-wrap items-center gap-4 px-5 py-4 ${index > 0 ? 'border-t border-beige-dark' : ''} ${
              u.actif ? '' : 'bg-beige-light/50'}`}>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[14px] font-semibold ${u.actif ? 'text-terre' : 'text-terre/45'}`}>
                  {u.name}
                </span>
                {soiMeme && <span className="text-[11px] text-terre/45">(vous)</span>}
                {!u.actif && <Etiquette ton="neutre">Désactivé</Etiquette>}
                {u.actif && u.doitDefinirMotDePasse && <Etiquette ton="accent">Invitation en attente</Etiquette>}
              </div>
              <div className="text-[12px] text-terre/55 truncate mt-0.5">
                {u.email}
                {u.actif
                  ? ` · depuis le ${dateCourte(u.creeLe)}`
                  : ` · désactivé le ${dateCourte(u.desactiveLe)}`}
              </div>
            </div>

            {soiMeme ? (
              // Son propre rôle n'est pas modifiable : un menu grisé dit
              // pourquoi mieux qu'un menu actif qui refuserait à l'envoi.
              <Etiquette ton={TONS_ROLE[u.role]}>{libelleRole[u.role] || u.role}</Etiquette>
            ) : (
              <select value={u.role} disabled={occupe === u.id || !u.actif}
                onChange={(e) => modifier(u, { role: e.target.value }, `Rôle de ${u.name} mis à jour.`)}
                className="px-3 py-1.5 rounded-lg border border-beige-dark text-[13px] text-terre bg-white outline-none focus:border-ocre disabled:opacity-50">
                {donnees.roles.map((r) => <option key={r.cle} value={r.cle}>{r.libelle}</option>)}
              </select>
            )}

            <div className="flex items-center gap-2 shrink-0">
              {u.actif && u.doitDefinirMotDePasse && (
                <button type="button" onClick={() => reinviter(u)} disabled={occupe === u.id}
                  className="px-3 py-1.5 rounded-lg border border-beige-dark text-[12.5px] font-semibold text-terre hover:border-ocre disabled:opacity-40 transition-colors">
                  Renvoyer l'invitation
                </button>
              )}
              {!soiMeme && (
                <button type="button" disabled={occupe === u.id}
                  onClick={() => modifier(u, { actif: !u.actif },
                    u.actif ? `${u.name} n'a plus accès au back-office.` : `${u.name} a de nouveau accès.`)}
                  className="px-3 py-1.5 rounded-lg border border-beige-dark text-[12.5px] font-semibold text-terre hover:border-ocre disabled:opacity-40 transition-colors">
                  {u.actif ? 'Désactiver' : 'Réactiver'}
                </button>
              )}
            </div>
          </div>
        )
      })}

      <p className="px-5 py-3 border-t border-beige-dark text-[12.5px] text-terre/55 bg-beige-light/40">
        Un compte se désactive, il ne se supprime pas : l'historique des modifications
        garde le nom de son auteur. Désactiver retire l'accès immédiatement, y compris
        pour une session déjà ouverte.
      </p>
    </div>
  )
}

// ── Permissions du module Demandes ───────────────────────────────────────

function Permissions({ donnees, onFait }) {
  const initial = () => {
    const t = {}
    for (const role of ROLES_CONFIGURABLES) {
      t[role] = {}
      for (const r of donnees.rubriques) {
        const ligne = donnees.permissions.find(
          (p) => p.role === role && p.rubriqueCle === r.cle && !p.utilisateurId
        )
        t[role][r.cle] = {
          peutConsulter: Boolean(ligne?.peutConsulter),
          peutRepondre: Boolean(ligne?.peutRepondre),
        }
      }
    }
    return t
  }

  const [table, setTable] = useState(initial)
  const [envoi, setEnvoi] = useState(false)

  function basculer(role, rubrique, cle) {
    setTable((t) => {
      const cellule = { ...t[role][rubrique], [cle]: !t[role][rubrique][cle] }
      // Répondre suppose de consulter : cocher l'un coche l'autre, décocher
      // « consulter » retire « répondre ». Laisser les deux indépendants
      // produirait un droit qui ne veut rien dire.
      if (cle === 'peutRepondre' && cellule.peutRepondre) cellule.peutConsulter = true
      if (cle === 'peutConsulter' && !cellule.peutConsulter) cellule.peutRepondre = false
      return { ...t, [role]: { ...t[role], [rubrique]: cellule } }
    })
  }

  async function enregistrer() {
    setEnvoi(true)
    const permissions = []
    for (const role of ROLES_CONFIGURABLES) {
      for (const r of donnees.rubriques) permissions.push({ role, rubriqueCle: r.cle, ...table[role][r.cle] })
    }
    const res = await appelerApi('/utilisateurs?action=permissions', { methode: 'PUT', corps: { permissions } })
    setEnvoi(false)
    if (!res.ok) return onFait(res.erreur, 'erreur')
    onFait('Accès aux demandes mis à jour.')
  }

  return (
    <div className="bg-white border border-beige-dark rounded-2xl p-6">
      <h2 className="font-serif text-base text-terre mb-1">Accès à la boîte de demandes</h2>
      <p className="text-[12.5px] text-terre/60 mb-5 max-w-2xl leading-relaxed">
        Qui voit quelles demandes, et qui peut y répondre. Le Super administrateur et la
        Coordination voient tout : cet accès est garanti par le code et ne se retire pas,
        c'est pourquoi ils ne figurent pas dans ce tableau.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr>
              <th className="text-left font-semibold text-terre/70 py-2 pr-4 align-bottom">Rubrique</th>
              {ROLES_CONFIGURABLES.map((role) => (
                <th key={role} colSpan={2} className="text-center font-semibold text-terre/70 py-2 px-3 border-l border-beige-dark">
                  {donnees.roles.find((r) => r.cle === role)?.libelle || role}
                </th>
              ))}
            </tr>
            <tr className="text-[11.5px] text-terre/50">
              <th />
              {ROLES_CONFIGURABLES.map((role) => (
                <Fragment key={role}>
                  <th className="font-normal py-1 px-2 border-l border-beige-dark">voir</th>
                  <th className="font-normal py-1 px-2">répondre</th>
                </Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {donnees.rubriques.map((r) => (
              <tr key={r.cle} className="border-t border-beige-dark">
                <td className="py-2.5 pr-4 text-terre">{r.libelle}</td>
                {ROLES_CONFIGURABLES.map((role) => (
                  <Fragment key={role + r.cle}>
                    <td className="text-center py-2.5 px-2 border-l border-beige-dark">
                      <input type="checkbox" className="accent-ocre" disabled={envoi}
                        aria-label={`${r.libelle} — voir`}
                        checked={table[role][r.cle].peutConsulter}
                        onChange={() => basculer(role, r.cle, 'peutConsulter')} />
                    </td>
                    <td className="text-center py-2.5 px-2">
                      <input type="checkbox" className="accent-ocre" disabled={envoi}
                        aria-label={`${r.libelle} — répondre`}
                        checked={table[role][r.cle].peutRepondre}
                        onChange={() => basculer(role, r.cle, 'peutRepondre')} />
                    </td>
                  </Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button type="button" onClick={enregistrer} disabled={envoi}
        className="mt-5 px-4 py-2.5 rounded-lg bg-ocre text-white text-[13.5px] font-semibold hover:bg-ocre-dark disabled:opacity-40 transition-colors">
        {envoi ? 'Enregistrement…' : 'Enregistrer les accès'}
      </button>
    </div>
  )
}
