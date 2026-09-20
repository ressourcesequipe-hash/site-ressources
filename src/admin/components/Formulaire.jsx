// Briques de formulaire partagées par les modules de contenu.
//
// Regroupées ici pour que tous les écrans se comportent pareil : même
// placement des messages d'erreur (près du champ concerné, §24.4), même
// aide contextuelle, mêmes états visuels. Un module qui s'en écarterait
// donnerait à l'équipe l'impression d'un outil incohérent.

export const classeSaisie = (erreur) =>
  `w-full px-3.5 py-2.5 rounded-lg border text-[14px] text-terre bg-white outline-none focus:border-ocre disabled:bg-beige-light/60 disabled:text-terre/60 ${
    erreur ? 'border-red-300' : 'border-beige-dark'
  }`

/**
 * Un champ avec son intitulé, son aide et son erreur éventuelle.
 * L'erreur remplace l'aide : afficher les deux noierait le message utile.
 */
export function Champ({ label, aide, erreur, obligatoire, children }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-terre mb-1.5">
        {label}
        {obligatoire && <span className="text-ocre-dark ml-1" aria-hidden="true">*</span>}
      </label>
      {children}
      {erreur ? (
        <p className="text-[12px] text-red-700 mt-1.5">{erreur}</p>
      ) : aide ? (
        <p className="text-[12px] text-terre/50 mt-1.5">{aide}</p>
      ) : null}
    </div>
  )
}

const COULEURS_STATUT = {
  brouillon: 'bg-beige-dark/60 text-terre/70',
  a_valider: 'bg-ocre/15 text-ocre-dark',
  programme: 'bg-kaki-pale text-kaki',
  publie: 'bg-olive/15 text-olive',
  archive: 'bg-terre/10 text-terre/50',
}

export const LIBELLES_STATUT = {
  brouillon: 'Brouillon',
  a_valider: 'À valider',
  programme: 'Programmé',
  publie: 'Publié',
  archive: 'Archivé',
}

export function EtiquetteStatut({ statut }) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded-md text-[11.5px] font-semibold ${COULEURS_STATUT[statut] || COULEURS_STATUT.brouillon}`}>
      {LIBELLES_STATUT[statut] || statut}
    </span>
  )
}

/** Étiquette libre, pour les états propres à un module (annulé, à venir…). */
export function Etiquette({ ton = 'neutre', children }) {
  const tons = {
    neutre: 'bg-beige-dark/60 text-terre/70',
    alerte: 'bg-red-50 text-red-700',
    accent: 'bg-ocre/15 text-ocre-dark',
    calme: 'bg-kaki-pale text-kaki',
  }
  return (
    <span className={`inline-block px-2.5 py-1 rounded-md text-[11.5px] font-semibold ${tons[ton]}`}>
      {children}
    </span>
  )
}

export function Message({ type, children }) {
  const styles = {
    erreur: 'text-red-700 bg-red-50 border-red-200',
    succes: 'text-olive bg-kaki-pale/40 border-olive/30',
    avertissement: 'text-ocre-dark bg-ocre/10 border-ocre/30',
  }
  return (
    <div className={`text-[13px] border rounded-lg px-3.5 py-2.5 ${styles[type] || styles.avertissement}`}>
      {children}
    </div>
  )
}

export function dateCourte(valeur) {
  if (!valeur) return '—'
  return new Date(valeur).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Convertit une date de la base vers la valeur attendue par un champ. */
export function pourChampDate(valeur, avecHeure = false) {
  if (!valeur) return ''
  const d = new Date(valeur)
  if (Number.isNaN(d.getTime())) return ''
  // Décalage local : sans cela, un événement à 9 h affiché depuis une base
  // en UTC apparaîtrait à 7 h dans le formulaire.
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, avecHeure ? 16 : 10)
}
