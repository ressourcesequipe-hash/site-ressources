// Éditeur de contenu par blocs — §8.3 et §24.5 du cahier des charges.
//
// Pas d'éditeur de texte libre ni de page builder : l'utilisateur choisit
// des blocs d'une liste fermée et en remplit les champs. Les styles restent
// définis dans le code du site public — « l'utilisateur admin choisit le
// contenu, pas la charte graphique ».
//
// Ce choix colle aussi exactement au format déjà utilisé par les articles
// existants (`src/data/articles.js`), ce qui évitera toute conversion à la
// migration.
//
// Limite assumée pour l'instant : le texte d'un paragraphe est brut, sans
// gras ni italique ni lien à l'intérieur. Les articles existants n'en
// utilisent pas. Si le besoin apparaît, c'est là qu'un éditeur riche
// (Tiptap, prévu par l'architecture) viendra se greffer — sur le seul champ
// texte, sans toucher à la structure en blocs.

const TYPES = [
  { cle: 'paragraph', libelle: 'Paragraphe', aide: 'Un bloc de texte.' },
  { cle: 'heading', libelle: 'Sous-titre', aide: 'Un intertitre pour aérer un article long.' },
  { cle: 'link', libelle: 'Lien', aide: 'Un bouton ou lien vers une autre page.' },
  { cle: 'video', libelle: 'Vidéo', aide: 'Une vidéo hébergée ailleurs.' },
  { cle: 'audio', libelle: 'Audio', aide: 'Un enregistrement sonore.' },
]

// Champs affichés par type, avec leur libellé métier. Le nom technique
// n'apparaît jamais à l'écran (§24.1).
const CHAMPS = {
  paragraph: [{ cle: 'text', libelle: 'Texte', multiligne: true }],
  heading: [{ cle: 'text', libelle: 'Sous-titre' }],
  link: [
    { cle: 'label', libelle: 'Texte du lien', exemple: 'Lire le communiqué' },
    { cle: 'href', libelle: 'Adresse', exemple: 'https://…' },
  ],
  video: [
    { cle: 'src', libelle: 'Adresse de la vidéo', exemple: 'https://…' },
    { cle: 'title', libelle: 'Titre' },
    { cle: 'sourceLabel', libelle: 'Source', exemple: 'TV Landes' },
    { cle: 'sourceUrl', libelle: 'Lien vers la source' },
    { cle: 'credit', libelle: 'Crédit' },
  ],
  audio: [
    { cle: 'src', libelle: "Adresse de l'enregistrement", exemple: 'https://…' },
    { cle: 'title', libelle: 'Titre' },
    { cle: 'sourceLabel', libelle: 'Source' },
    { cle: 'sourceUrl', libelle: 'Lien vers la source' },
    { cle: 'credit', libelle: 'Crédit' },
    { cle: 'note', libelle: 'Précision éventuelle' },
  ],
}

function BoutonIcone({ onClick, titre, desactive, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desactive}
      title={titre}
      aria-label={titre}
      className="w-7 h-7 rounded-md border border-beige-dark text-terre/60 text-[13px] leading-none hover:border-ocre hover:text-ocre-dark disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  )
}

export default function EditeurBlocs({ blocs, onChange, desactive }) {
  const liste = Array.isArray(blocs) ? blocs : []

  const modifier = (index, cle, valeur) => {
    const copie = liste.map((b, i) => (i === index ? { ...b, [cle]: valeur } : b))
    onChange(copie)
  }

  const ajouter = (type) => onChange([...liste, { type }])

  const supprimer = (index) => onChange(liste.filter((_, i) => i !== index))

  const deplacer = (index, sens) => {
    const cible = index + sens
    if (cible < 0 || cible >= liste.length) return
    const copie = [...liste]
    ;[copie[index], copie[cible]] = [copie[cible], copie[index]]
    onChange(copie)
  }

  return (
    <div>
      {liste.length === 0 && (
        <p className="text-[13px] text-terre/50 bg-beige-light border border-beige-dark border-dashed rounded-xl px-4 py-5 text-center mb-3">
          Le contenu est vide. Ajoutez un premier paragraphe ci-dessous.
        </p>
      )}

      <div className="space-y-3">
        {liste.map((bloc, index) => {
          const type = TYPES.find((t) => t.cle === bloc.type)
          return (
            <div key={index} className="border border-beige-dark rounded-xl bg-white">
              <div className="flex items-center justify-between px-3.5 py-2 border-b border-beige-dark bg-beige-light/50 rounded-t-xl">
                <span className="text-[12px] font-semibold text-terre/70">
                  {type?.libelle || bloc.type}
                </span>
                <div className="flex items-center gap-1.5">
                  <BoutonIcone onClick={() => deplacer(index, -1)} titre="Monter" desactive={desactive || index === 0}>↑</BoutonIcone>
                  <BoutonIcone onClick={() => deplacer(index, 1)} titre="Descendre" desactive={desactive || index === liste.length - 1}>↓</BoutonIcone>
                  <BoutonIcone onClick={() => supprimer(index)} titre="Supprimer ce bloc" desactive={desactive}>✕</BoutonIcone>
                </div>
              </div>

              <div className="p-3.5 space-y-3">
                {(CHAMPS[bloc.type] || []).map((champ) => (
                  <div key={champ.cle}>
                    <label className="block text-[12px] font-semibold text-terre/70 mb-1">
                      {champ.libelle}
                    </label>
                    {champ.multiligne ? (
                      <textarea
                        rows={4}
                        value={bloc[champ.cle] || ''}
                        disabled={desactive}
                        onChange={(e) => modifier(index, champ.cle, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre resize-y leading-relaxed"
                      />
                    ) : (
                      <input
                        type="text"
                        value={bloc[champ.cle] || ''}
                        disabled={desactive}
                        placeholder={champ.exemple || ''}
                        onChange={(e) => modifier(index, champ.cle, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t.cle}
            type="button"
            onClick={() => ajouter(t.cle)}
            disabled={desactive}
            // Le nom annoncé doit décrire l'action, pas le type de bloc :
            // sans cela, un lecteur d'écran lit l'info-bulle (« Un bloc de
            // texte ») au lieu de « Ajouter un paragraphe » (§33).
            aria-label={'Ajouter : ' + t.libelle.toLowerCase() + '. ' + t.aide}
            title={t.aide}
            className="px-3 py-1.5 rounded-lg border border-beige-dark text-[12.5px] font-medium text-terre/75 bg-white hover:border-ocre hover:text-ocre-dark disabled:opacity-40 transition-colors"
          >
            + {t.libelle}
          </button>
        ))}
      </div>
    </div>
  )
}
