// Logique métier des actualités — §9 et §22 du cahier des charges.
//
// Volontairement séparée de la route d'API : ces fonctions sont pures, donc
// vérifiables sans base de données ni requête HTTP. La route se contente de
// les appeler après avoir contrôlé les droits.

// §9 : les catégories reprennent celles déjà utilisées par le site public
// (`src/data/articles.js`), moins la pseudo-catégorie « Tous les articles »
// qui n'est qu'un filtre d'affichage. Liste fermée côté serveur : une valeur
// envoyée par le navigateur n'est jamais reprise telle quelle.
//
// À la différence des ateliers, dont le §11 exige des catégories
// administrables, le cahier ne demande rien de tel ici — d'où cette liste
// dans le code plutôt qu'une table.
export const CATEGORIES = [
  { cle: 'association', libelle: "Vie de l'association" },
  { cle: 'informatique', libelle: 'Réemploi informatique' },
  { cle: 'numerique', libelle: 'Inclusion numérique' },
  { cle: 'vegetale', libelle: 'Recyclerie végétale' },
  { cle: 'circulaire', libelle: 'Économie circulaire' },
  { cle: 'partenariats', libelle: 'Partenariats & territoire' },
  { cle: 'evenements', libelle: 'Événements' },
]

// Statuts, transitions et slug sont communs a tous les modules de contenu :
// ils vivent dans lib/contenus.js et sont re-exportes ici pour que ce module
// reste lisible seul.
export { STATUTS, LIBELLES_STATUT, slugifier, transitionAutorisee } from './contenus.js'
import { nettoyerBlocs } from './contenus.js'

// Types de blocs acceptés, et champs autorisés pour chacun. Tout le reste
// est écarté à l'entrée : le site public garde la maîtrise de ses styles
// (§8.3), et rien d'arbitraire ne peut être injecté dans une page.
export const BLOCS = {
  paragraph: ['text'],
  heading: ['text'],
  link: ['label', 'href'],
  video: ['src', 'title', 'sourceUrl', 'sourceLabel', 'durationIso', 'duration', 'credit', 'uploadDate', 'thumbnailUrl'],
  audio: ['src', 'title', 'sourceUrl', 'sourceLabel', 'durationIso', 'duration', 'credit', 'note'],
}

const MOTS_PAR_MINUTE = 200

/**
 * Temps de lecture en minutes, calculé à partir du contenu (§9 : « calculé
 * automatiquement »). Jamais saisi à la main, donc jamais faux ni oublié.
 * Toujours au moins 1 minute : afficher « 0 min » n'aurait aucun sens.
 *
 * Arrondi au supérieur, et non au plus proche : annoncer moins de temps qu'il
 * n'en faut réellement dessert le lecteur, alors qu'annoncer un peu plus ne
 * coûte rien. Un article de 232 mots affiche donc 2 min et non 1.
 */
export function tempsLecture(blocs) {
  const mots = (Array.isArray(blocs) ? blocs : [])
    .map((b) => (typeof b?.text === 'string' ? b.text : ''))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.ceil(mots / MOTS_PAR_MINUTE))
}

/**
 * Ne conserve que les blocs reconnus et leurs champs autorises (§8.3).
 */
export function nettoyerContenu(blocs) {
  return nettoyerBlocs(blocs, BLOCS)
}

/**
 * Contrôles de cohérence avant enregistrement. Les messages sont rédigés
 * pour être affichés tels quels à un utilisateur non technique (§24.4), et
 * chacun désigne le champ concerné.
 */
export function valider(donnees, { statutVise }) {
  const erreurs = []

  if (!donnees.titre || !String(donnees.titre).trim()) {
    erreurs.push({ champ: 'titre', message: 'Le titre est obligatoire.' })
  }
  if (donnees.categorie && !CATEGORIES.some((c) => c.cle === donnees.categorie)) {
    erreurs.push({ champ: 'categorie', message: "Cette catégorie n'existe pas." })
  }

  // Exigences propres à la mise en ligne : un brouillon peut rester
  // incomplet, une page publiée ne le doit pas.
  if (statutVise === 'publie' || statutVise === 'programme') {
    if (!donnees.resume || !String(donnees.resume).trim()) {
      erreurs.push({ champ: 'resume', message: 'Le résumé est nécessaire avant la mise en ligne : il apparaît dans les listes et les partages.' })
    }
    if (!donnees.categorie) {
      erreurs.push({ champ: 'categorie', message: 'Choisissez une catégorie avant la mise en ligne.' })
    }
    if (donnees.image && !donnees.imageAlt) {
      // §24.6 et §33 : une image informative sans texte alternatif est
      // inaccessible aux lecteurs d'écran.
      erreurs.push({ champ: 'imageAlt', message: "Décrivez l'image pour les personnes qui ne la voient pas. Exemple : « Deux bénévoles trient des ordinateurs à l'atelier. »" })
    }
  }

  if (statutVise === 'programme') {
    const date = donnees.datePublication ? new Date(donnees.datePublication) : null
    if (!date || Number.isNaN(date.getTime())) {
      erreurs.push({ champ: 'datePublication', message: 'Indiquez la date de mise en ligne souhaitée.' })
    } else if (date.getTime() <= Date.now()) {
      erreurs.push({ champ: 'datePublication', message: 'La date de programmation doit être dans le futur.' })
    }
  }

  return erreurs
}

// Le libellé de date (« Septembre 2026 ») était saisi à la main à côté de la
// date elle-même, et pouvait donc la contredire. Il se déduit.
function libelleDate(valeur) {
  if (!valeur) return ''
  const t = new Date(valeur).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  return t.charAt(0).toUpperCase() + t.slice(1)
}

// Le site attend les articles sous la forme qu'il a toujours connue. La
// traduction est faite ici, en un seul endroit : les pages n'ont pas à savoir
// que le contenu vient désormais d'une base.
export function versArticlePublic(a) {
  return {
    slug: a.slug,
    title: a.titre,
    excerpt: a.resume ?? '',
    category: a.categorie ?? '',
    date: a.datePublication ? new Date(a.datePublication).toISOString().slice(0, 10) : '',
    dateLabel: libelleDate(a.datePublication),
    readingTime: `${a.tempsLectureMinutes ?? 1} min`,
    featured: Boolean(a.miseEnAvant),
    image: a.image ?? undefined,
    imageAlt: a.imageAlt ?? undefined,
    imageCredit: a.imageCredit ?? undefined,
    imageWidth: a.imageLargeur ?? undefined,
    imageHeight: a.imageHauteur ?? undefined,
    imageFit: a.imageCadrage ?? undefined,
    imagePosition: a.imagePosition ?? undefined,
    externalLink: a.lienExterne ?? undefined,
    content: a.contenu ?? [],
  }
}
