// Éditeur de contenu par blocs — §8.3 et §24.5 du cahier des charges.
//
// Pas d'éditeur de texte libre ni de page builder : l'utilisateur choisit
// des blocs d'une liste fermée et en remplit les champs. Les styles restent
// définis dans le code du site public — « l'utilisateur admin choisit le
// contenu, pas la charte graphique ».
//
// Ce choix colle aussi au format déjà utilisé par les articles existants
// (`src/data/articles.js`), ce qui évitera toute conversion à la migration.
//
// `typesAutorises` vient du module métier (lib/actualites.js, lib/pages.js…),
// la même source que celle appliquée par le serveur. Sans cela, l'interface
// pourrait proposer un bloc que le serveur écarte en silence : la personne
// remplirait son bloc, puis le verrait disparaître sans explication (§24.7).
//
// Limite assumée : le texte d'un paragraphe est brut, sans gras ni italique
// ni lien à l'intérieur. Les contenus existants n'en utilisent pas. Si le
// besoin apparaît, c'est là qu'un éditeur riche (Tiptap, prévu par
// l'architecture) viendra se greffer — sur le seul champ texte, sans
// toucher à la structure en blocs.

const TYPES = [
  { cle: 'paragraph', libelle: 'Paragraphe', aide: 'Un bloc de texte.' },
  { cle: 'heading', libelle: 'Sous-titre', aide: 'Un intertitre pour aérer une page longue.' },
  { cle: 'link', libelle: 'Lien', aide: 'Un bouton ou lien vers une autre page.' },
  { cle: 'video', libelle: 'Vidéo', aide: 'Une vidéo hébergée ailleurs.' },
  { cle: 'audio', libelle: 'Audio', aide: 'Un enregistrement sonore.' },
  { cle: 'image', libelle: 'Image', aide: 'Une image pleine largeur.' },
  { cle: 'imageTexte', libelle: 'Image + texte', aide: 'Une image à côté d’un paragraphe.' },
  { cle: 'galerie', libelle: 'Galerie', aide: 'Plusieurs images présentées ensemble.' },
  { cle: 'chiffresCles', libelle: 'Chiffres clés', aide: 'Quelques nombres mis en avant.' },
  { cle: 'cartes', libelle: 'Cartes', aide: 'Plusieurs encarts courts côte à côte.' },
  { cle: 'appelAction', libelle: 'Appel à l’action', aide: 'Un encart qui invite à faire quelque chose.' },
  { cle: 'citation', libelle: 'Citation', aide: 'Une parole rapportée, avec son auteur.' },
  { cle: 'faq', libelle: 'Questions / réponses', aide: 'Une liste dépliable de questions.' },
  { cle: 'logos', libelle: 'Logos', aide: 'Une rangée de logos de partenaires.' },
  { cle: 'document', libelle: 'Document à télécharger', aide: 'Un fichier proposé au téléchargement.' },
  { cle: 'encadre', libelle: 'Encadré d’information', aide: 'Une information mise en évidence.' },
  { cle: 'liste', libelle: 'Liste à puces', aide: 'Une énumération.' },
  { cle: 'tableau', libelle: 'Tableau simple', aide: 'Quelques lignes et colonnes.' },
]

// Champs affichés par type, avec leur libellé métier. Le nom technique
// n'apparaît jamais à l'écran (§24.1).
//
// `kind: 'liste'` décrit une suite d'éléments répétables (les images d'une
// galerie, les questions d'une FAQ). Sans cela, ces blocs se seraient
// réduits à un champ de texte libre dont le site n'aurait rien pu faire.
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
  image: [
    { cle: 'src', libelle: 'Image', exemple: '/photos/mon-image.webp' },
    { cle: 'alt', libelle: "Description pour l'accessibilité", exemple: 'Deux bénévoles trient des ordinateurs.' },
    { cle: 'credit', libelle: 'Crédit' },
    { cle: 'legende', libelle: 'Légende' },
  ],
  imageTexte: [
    { cle: 'src', libelle: 'Image', exemple: '/photos/mon-image.webp' },
    { cle: 'alt', libelle: "Description pour l'accessibilité" },
    { cle: 'text', libelle: 'Texte', multiligne: true },
  ],
  galerie: [{
    cle: 'images', libelle: 'Images', kind: 'liste', libelleElement: 'image',
    sousChamps: [
      { cle: 'src', libelle: 'Image', exemple: '/photos/mon-image.webp' },
      { cle: 'alt', libelle: "Description pour l'accessibilité" },
    ],
  }],
  chiffresCles: [{
    cle: 'chiffres', libelle: 'Chiffres', kind: 'liste', libelleElement: 'chiffre',
    sousChamps: [
      { cle: 'valeur', libelle: 'Nombre', exemple: '120' },
      { cle: 'libelle', libelle: 'Ce qu’il désigne', exemple: 'équipements collectés' },
    ],
  }],
  cartes: [{
    cle: 'cartes', libelle: 'Cartes', kind: 'liste', libelleElement: 'carte',
    sousChamps: [
      { cle: 'titre', libelle: 'Titre' },
      { cle: 'texte', libelle: 'Texte', multiligne: true },
      { cle: 'href', libelle: 'Lien éventuel' },
    ],
  }],
  appelAction: [
    { cle: 'titre', libelle: 'Titre' },
    { cle: 'text', libelle: 'Texte', multiligne: true },
    { cle: 'label', libelle: 'Texte du bouton', exemple: 'Je donne du matériel' },
    { cle: 'href', libelle: 'Adresse du bouton' },
  ],
  citation: [
    { cle: 'text', libelle: 'Citation', multiligne: true },
    { cle: 'auteur', libelle: 'Qui l’a dite' },
    { cle: 'fonction', libelle: 'Sa fonction', exemple: 'Maire de Castets' },
  ],
  faq: [{
    cle: 'questions', libelle: 'Questions', kind: 'liste', libelleElement: 'question',
    sousChamps: [
      { cle: 'question', libelle: 'Question' },
      { cle: 'reponse', libelle: 'Réponse', multiligne: true },
    ],
  }],
  logos: [{
    cle: 'logos', libelle: 'Logos', kind: 'liste', libelleElement: 'logo',
    sousChamps: [
      { cle: 'src', libelle: 'Logo', exemple: '/logos/mairie.webp' },
      { cle: 'alt', libelle: "Description pour l'accessibilité", exemple: 'Logo de la commune de Castets' },
      { cle: 'href', libelle: 'Lien éventuel' },
    ],
  }],
  document: [
    { cle: 'href', libelle: 'Adresse du fichier', exemple: '/documents/rapport-2026.pdf' },
    { cle: 'label', libelle: 'Nom affiché', exemple: 'Rapport d’activité 2026' },
    { cle: 'poids', libelle: 'Poids indicatif', exemple: '2,4 Mo' },
  ],
  encadre: [
    { cle: 'titre', libelle: 'Titre' },
    { cle: 'text', libelle: 'Texte', multiligne: true },
  ],
  liste: [{
    cle: 'elements', libelle: 'Éléments', kind: 'liste', libelleElement: 'élément',
    sousChamps: [{ cle: 'text', libelle: 'Texte' }],
  }],
  tableau: [
    { cle: 'entetes', libelle: 'Titres des colonnes', exemple: 'Jour, Horaires, Lieu' },
    {
      cle: 'lignes', libelle: 'Lignes', kind: 'liste', libelleElement: 'ligne',
      sousChamps: [{ cle: 'cellules', libelle: 'Cellules, séparées par des virgules', exemple: 'Lundi, 9 h – 12 h, Mairie' }],
    },
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

const classeChamp =
  'w-full px-3 py-2 rounded-lg border border-beige-dark text-[13.5px] text-terre bg-white outline-none focus:border-ocre'

function Saisie({ champ, valeur, onChange, desactive }) {
  if (champ.multiligne) {
    return (
      <textarea rows={4} value={valeur || ''} disabled={desactive}
        placeholder={champ.exemple || ''}
        onChange={(e) => onChange(e.target.value)}
        className={classeChamp + ' resize-y leading-relaxed'} />
    )
  }
  return (
    <input type="text" value={valeur || ''} disabled={desactive}
      placeholder={champ.exemple || ''}
      onChange={(e) => onChange(e.target.value)}
      className={classeChamp} />
  )
}

// Suite d'éléments répétables au sein d'un bloc : les images d'une galerie,
// les questions d'une FAQ, les lignes d'un tableau.
function ListeElements({ champ, elements, onChange, desactive }) {
  const liste = Array.isArray(elements) ? elements : []

  const modifier = (i, cle, valeur) =>
    onChange(liste.map((el, j) => (j === i ? { ...el, [cle]: valeur } : el)))
  const ajouter = () => onChange([...liste, {}])
  const supprimer = (i) => onChange(liste.filter((_, j) => j !== i))
  const deplacer = (i, sens) => {
    const cible = i + sens
    if (cible < 0 || cible >= liste.length) return
    const copie = [...liste]
    ;[copie[i], copie[cible]] = [copie[cible], copie[i]]
    onChange(copie)
  }

  return (
    <div>
      {liste.length === 0 && (
        <p className="text-[12.5px] text-terre/45 mb-2">Aucun {champ.libelleElement} pour l’instant.</p>
      )}
      <div className="space-y-2">
        {liste.map((el, i) => (
          <div key={i} className="border border-beige-dark rounded-lg p-2.5 bg-beige-light/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11.5px] font-semibold text-terre/55">
                {champ.libelleElement} {i + 1}
              </span>
              <div className="flex gap-1.5">
                <BoutonIcone onClick={() => deplacer(i, -1)} titre="Monter" desactive={desactive || i === 0}>↑</BoutonIcone>
                <BoutonIcone onClick={() => deplacer(i, 1)} titre="Descendre" desactive={desactive || i === liste.length - 1}>↓</BoutonIcone>
                <BoutonIcone onClick={() => supprimer(i)} titre={'Supprimer ce ' + champ.libelleElement} desactive={desactive}>✕</BoutonIcone>
              </div>
            </div>
            <div className="space-y-2">
              {champ.sousChamps.map((sc) => (
                <div key={sc.cle}>
                  <label className="block text-[11.5px] font-semibold text-terre/65 mb-1">{sc.libelle}</label>
                  <Saisie champ={sc} valeur={el[sc.cle]} desactive={desactive}
                    onChange={(val) => modifier(i, sc.cle, val)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={ajouter} disabled={desactive}
        className="mt-2 px-3 py-1.5 rounded-lg border border-beige-dark text-[12.5px] font-medium text-terre/75 bg-white hover:border-ocre hover:text-ocre-dark disabled:opacity-40">
        + Ajouter un {champ.libelleElement}
      </button>
    </div>
  )
}

export default function EditeurBlocs({ blocs, onChange, desactive, typesAutorises }) {
  const liste = Array.isArray(blocs) ? blocs : []
  const typesProposes = typesAutorises ? TYPES.filter((t) => typesAutorises.includes(t.cle)) : TYPES

  const modifier = (index, cle, valeur) =>
    onChange(liste.map((b, i) => (i === index ? { ...b, [cle]: valeur } : b)))
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
          Le contenu est vide. Ajoutez un premier bloc ci-dessous.
        </p>
      )}

      <div className="space-y-3">
        {liste.map((bloc, index) => {
          const type = TYPES.find((t) => t.cle === bloc.type)
          return (
            <div key={index} className="border border-beige-dark rounded-xl bg-white">
              <div className="flex items-center justify-between px-3.5 py-2 border-b border-beige-dark bg-beige-light/50 rounded-t-xl">
                <span className="text-[12px] font-semibold text-terre/70">{type?.libelle || bloc.type}</span>
                <div className="flex items-center gap-1.5">
                  <BoutonIcone onClick={() => deplacer(index, -1)} titre="Monter" desactive={desactive || index === 0}>↑</BoutonIcone>
                  <BoutonIcone onClick={() => deplacer(index, 1)} titre="Descendre" desactive={desactive || index === liste.length - 1}>↓</BoutonIcone>
                  <BoutonIcone onClick={() => supprimer(index)} titre="Supprimer ce bloc" desactive={desactive}>✕</BoutonIcone>
                </div>
              </div>

              <div className="p-3.5 space-y-3">
                {(CHAMPS[bloc.type] || []).map((champ) => (
                  <div key={champ.cle}>
                    <label className="block text-[12px] font-semibold text-terre/70 mb-1">{champ.libelle}</label>
                    {champ.kind === 'liste' ? (
                      <ListeElements champ={champ} elements={bloc[champ.cle]} desactive={desactive}
                        onChange={(v) => modifier(index, champ.cle, v)} />
                    ) : (
                      <Saisie champ={champ} valeur={bloc[champ.cle]} desactive={desactive}
                        onChange={(v) => modifier(index, champ.cle, v)} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {typesProposes.map((t) => (
          <button
            key={t.cle}
            type="button"
            onClick={() => ajouter(t.cle)}
            disabled={desactive}
            // Le nom annoncé doit décrire l'action, pas le type de bloc :
            // sans cela, un lecteur d'écran lit l'info-bulle au lieu de
            // « Ajouter un paragraphe » (§33).
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
