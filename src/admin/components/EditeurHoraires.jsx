// Éditeur d'horaires d'ouverture — §13 du cahier des charges.
//
// Une ligne par créneau plutôt qu'un champ de texte libre : le site pourra
// afficher, trier et comparer ces horaires, ce qu'un texte libre ne permet
// pas. Un même jour peut avoir plusieurs créneaux (matin et après-midi),
// d'où une liste et non une case par jour.
//
// Les créneaux incomplets sont ignorés à l'enregistrement, côté serveur —
// l'utilisateur peut donc commencer une ligne et y revenir plus tard sans
// que cela bloque la sauvegarde d'un brouillon.

export default function EditeurHoraires({ horaires, jours, onChange, desactive }) {
  const liste = Array.isArray(horaires) ? horaires : []

  const modifier = (index, cle, valeur) =>
    onChange(liste.map((h, i) => (i === index ? { ...h, [cle]: valeur } : h)))

  const ajouter = () =>
    onChange([...liste, { jour: jours[0]?.cle || 'lundi', ouverture: '', fermeture: '' }])

  const supprimer = (index) => onChange(liste.filter((_, i) => i !== index))

  return (
    <div>
      {liste.length === 0 && (
        <p className="text-[13px] text-terre/50 bg-beige-light border border-beige-dark border-dashed rounded-xl px-4 py-4 text-center mb-3">
          Aucun horaire indiqué. Le point apparaîtra sans horaires d'ouverture.
        </p>
      )}

      <div className="space-y-2">
        {liste.map((h, index) => (
          <div key={index} className="flex flex-wrap items-end gap-2 border border-beige-dark rounded-xl p-3 bg-white">
            <div>
              <label className="block text-[11.5px] font-semibold text-terre/65 mb-1">Jour</label>
              <select value={h.jour || ''} disabled={desactive}
                onChange={(e) => modifier(index, 'jour', e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-beige-dark text-[13px] text-terre bg-white outline-none focus:border-ocre">
                {jours.map((j) => <option key={j.cle} value={j.cle}>{j.libelle}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11.5px] font-semibold text-terre/65 mb-1">De</label>
              <input type="time" value={h.ouverture || ''} disabled={desactive}
                onChange={(e) => modifier(index, 'ouverture', e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-beige-dark text-[13px] text-terre bg-white outline-none focus:border-ocre" />
            </div>
            <div>
              <label className="block text-[11.5px] font-semibold text-terre/65 mb-1">À</label>
              <input type="time" value={h.fermeture || ''} disabled={desactive}
                onChange={(e) => modifier(index, 'fermeture', e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-beige-dark text-[13px] text-terre bg-white outline-none focus:border-ocre" />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-[11.5px] font-semibold text-terre/65 mb-1">
                Précision <span className="font-normal text-terre/45">(facultatif)</span>
              </label>
              <input type="text" value={h.precision || ''} disabled={desactive}
                placeholder="Sur rendez-vous"
                onChange={(e) => modifier(index, 'precision', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-beige-dark text-[13px] text-terre bg-white outline-none focus:border-ocre" />
            </div>
            <button type="button" onClick={() => supprimer(index)} disabled={desactive}
              aria-label="Supprimer ce créneau"
              className="h-[34px] px-2.5 rounded-lg border border-beige-dark text-terre/60 text-[13px] hover:border-ocre hover:text-ocre-dark disabled:opacity-30">
              ✕
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={ajouter} disabled={desactive}
        className="mt-3 px-3 py-1.5 rounded-lg border border-beige-dark text-[12.5px] font-medium text-terre/75 bg-white hover:border-ocre hover:text-ocre-dark disabled:opacity-40 transition-colors">
        + Ajouter un créneau
      </button>
    </div>
  )
}
