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

// §22. `archive` est un aboutissement : on en ressort en repassant par
// `brouillon`, jamais directement en ligne.
export const STATUTS = ['brouillon', 'a_valider', 'programme', 'publie', 'archive']

export const LIBELLES_STATUT = {
  brouillon: 'Brouillon',
  a_valider: 'À valider',
  programme: 'Programmé',
  publie: 'Publié',
  archive: 'Archivé',
}

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
 * Transforme un titre en slug d'URL. Les accents sont retirés plutôt que
 * conservés : les URLs du site sont toutes en ASCII (§20, §31 — les adresses
 * existantes doivent rester stables et lisibles).
 */
export function slugifier(texte) {
  return String(texte ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
    .replace(/-+$/g, '')
}

/**
 * Temps de lecture en minutes, calculé à partir du contenu (§9 : « calculé
 * automatiquement »). Jamais saisi à la main, donc jamais faux ni oublié.
 * Toujours au moins 1 minute : afficher « 0 min » n'aurait aucun sens.
 */
export function tempsLecture(blocs) {
  const mots = (Array.isArray(blocs) ? blocs : [])
    .map((b) => (typeof b?.text === 'string' ? b.text : ''))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(mots / MOTS_PAR_MINUTE))
}

/**
 * Ne conserve que les blocs reconnus, et pour chacun que ses champs
 * autorisés. Un bloc de type inconnu est écarté silencieusement plutôt que
 * de faire échouer tout l'enregistrement : l'utilisateur ne doit pas perdre
 * son article à cause d'un bloc mal formé.
 */
export function nettoyerContenu(blocs) {
  if (!Array.isArray(blocs)) return []
  const propres = []
  for (const bloc of blocs) {
    const champsAutorises = BLOCS[bloc?.type]
    if (!champsAutorises) continue
    const propre = { type: bloc.type }
    for (const champ of champsAutorises) {
      if (bloc[champ] !== undefined && bloc[champ] !== null && bloc[champ] !== '') {
        propre[champ] = typeof bloc[champ] === 'string' ? bloc[champ] : String(bloc[champ])
      }
    }
    propres.push(propre)
  }
  return propres
}

/**
 * Transitions autorisées entre statuts (§22), croisées avec les droits.
 * `peutPublier` est faux pour un Contributeur : le §21 lui interdit de
 * publier directement quand la validation est activée — il demande la
 * validation à la place.
 */
export function transitionAutorisee(depuis, vers, { peutPublier }) {
  if (!STATUTS.includes(vers)) return { ok: false, raison: 'Statut inconnu.' }
  if (depuis === vers) return { ok: true }

  const misesEnLigne = ['publie', 'programme']
  if (misesEnLigne.includes(vers) && !peutPublier) {
    return {
      ok: false,
      raison: "Votre profil ne peut pas publier directement. Utilisez « Demander la validation ».",
    }
  }

  // Un contenu archivé repasse par le brouillon avant de revenir en ligne :
  // on ne remet jamais en ligne d'un seul geste quelque chose de retiré.
  if (depuis === 'archive' && vers !== 'brouillon') {
    return { ok: false, raison: 'Un contenu archivé doit redevenir un brouillon avant toute autre étape.' }
  }

  return { ok: true }
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
