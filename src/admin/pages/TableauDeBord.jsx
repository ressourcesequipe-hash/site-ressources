import { useEffect, useState } from 'react'
import { appelerApi } from '../lib/api'
import { authClient } from '../lib/authClient'
import { Message } from '../components/Formulaire'
import { cheminLisible, nombreLisible, tendance } from '../../../lib/statistiques.js'

// Tableau de bord — §7 du cahier des charges.
//
// Première rubrique réelle : la fréquentation du site. Elle était jusqu'ici
// consultable dans le seul tableau de bord Vercel, donc par les seules
// personnes ayant un compte Vercel — c'est-à-dire une.
//
// Les compteurs de contenus à valider et de demandes en attente, également
// prévus au §7, viendront à côté.

export default function TableauDeBord() {
  const { data: session } = authClient.useSession()
  const [etat, setEtat] = useState({ chargement: true })
  const [donnees, setDonnees] = useState(null)

  useEffect(() => {
    let annule = false
    appelerApi('/tableau-de-bord').then((r) => {
      if (annule) return
      if (!r.ok) return setEtat({ chargement: false, erreur: r.erreur })
      setDonnees(r.donnees)
      setEtat({ chargement: false })
    })
    return () => { annule = true }
  }, [])

  return (
    <div className="max-w-4xl">
      <p className="text-sm text-terre/70 mb-6">
        Bonjour {session?.user.name} — connecté avec le rôle{' '}
        <span className="font-semibold">{session?.user.role}</span>.
      </p>

      <section>
        <h2 className="font-serif text-lg text-terre mb-1">Statistiques</h2>
        <p className="text-[12.5px] text-terre/55 mb-4">
          Fréquentation du site public. Le back-office n'est pas compté.
        </p>

        {etat.chargement && <p className="text-sm text-terre/50">Chargement…</p>}
        {etat.erreur && <Message type="erreur">{etat.erreur}</Message>}

        {!etat.chargement && donnees?.indisponible && (
          <Message type="avertissement">{donnees.indisponible.message}</Message>
        )}

        {donnees?.frequentation && <Frequentation f={donnees.frequentation} />}
      </section>
    </div>
  )
}

function Frequentation({ f }) {
  const t = tendance(f.serie)

  // Une période sans aucune visite n'est pas une panne : le site vient
  // peut-être d'activer la mesure. Le dire évite de chercher un bug.
  if (f.total.vues === 0) {
    return (
      <Message type="avertissement">
        Aucune visite enregistrée sur les {f.fenetreJours} derniers jours. Si la mesure
        vient d'être activée, les chiffres commenceront à s'accumuler à partir de
        maintenant — ils ne remontent pas dans le passé.
      </Message>
    )
  }

  return (
    <div className="space-y-4">
      {f.champsInconnus && (
        <Message type="avertissement">
          Les données sont arrivées sous une forme inattendue : les totaux peuvent être
          faux. Signalez-le à l'équipe technique.
        </Message>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        <Chiffre valeur={f.total.vues} libelle="pages vues" precision={`sur ${f.fenetreJours} jours`} />
        <Chiffre valeur={f.total.visiteurs} libelle="visiteurs" precision={`sur ${f.fenetreJours} jours`} />
        <div className="bg-white border border-beige-dark rounded-2xl p-5">
          <div className="text-[12.5px] text-terre/55 mb-1">Tendance</div>
          {t.fiable ? (
            <>
              <div className={`font-serif text-2xl ${t.variation >= 0 ? 'text-olive' : 'text-ocre-dark'}`}>
                {t.variation >= 0 ? '+' : ''}{t.variation} %
              </div>
              <div className="text-[11.5px] text-terre/45 mt-1">
                seconde moitié de la période par rapport à la première
              </div>
            </>
          ) : (
            // Sur de petits volumes, trois visites d'écart produisent des
            // pourcentages spectaculaires et faux. Mieux vaut ne rien affirmer.
            <div className="text-[12.5px] text-terre/55 leading-relaxed mt-1">
              Trop peu de visites pour dégager une tendance qui veuille dire quelque chose.
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Liste titre="Pages les plus vues" lignes={f.pages} transforme={cheminLisible} />
        <Liste titre="D'où viennent les visiteurs" lignes={f.provenances} />
      </div>

      <Liste titre="Appareils" lignes={f.appareils} horizontal />

      <p className="text-[12px] text-terre/45 leading-relaxed">
        Mesure anonyme, sans cookie : le nombre de visiteurs est une estimation, pas un
        décompte de personnes. L'hébergeur ne conserve qu'un mois d'historique — au-delà,
        ces chiffres ne sont plus consultables.
      </p>
    </div>
  )
}

function Chiffre({ valeur, libelle, precision }) {
  return (
    <div className="bg-white border border-beige-dark rounded-2xl p-5">
      <div className="text-[12.5px] text-terre/55 mb-1">{libelle}</div>
      <div className="font-serif text-2xl text-terre">{nombreLisible(valeur)}</div>
      <div className="text-[11.5px] text-terre/45 mt-1">{precision}</div>
    </div>
  )
}

function Liste({ titre, lignes, transforme = (x) => x, horizontal = false }) {
  if (!lignes || lignes.length === 0) return null
  const maximum = Math.max(...lignes.map((l) => l.vues), 1)

  return (
    <div className="bg-white border border-beige-dark rounded-2xl p-5">
      <div className="text-[12.5px] font-semibold text-terre/70 mb-3">{titre}</div>
      <div className={horizontal ? 'flex flex-wrap gap-x-6 gap-y-2' : 'space-y-2'}>
        {lignes.map((l) => (
          <div key={l.cle} className={horizontal ? 'flex items-baseline gap-2' : ''}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[13px] text-terre truncate" title={l.cle}>
                {transforme(l.cle)}
              </span>
              <span className="text-[13px] text-terre/60 shrink-0 tabular-nums">
                {nombreLisible(l.vues)}
              </span>
            </div>
            {/* Une barre proportionnelle plutôt qu'un simple nombre : l'écart
                entre la première ligne et la dernière se lit d'un coup d'œil,
                là où une colonne de chiffres demande de les comparer. */}
            {!horizontal && (
              <div className="h-1 bg-beige-light rounded-full overflow-hidden mt-1">
                <div className="h-full bg-ocre/50 rounded-full"
                  style={{ width: `${Math.round((l.vues / maximum) * 100)}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
