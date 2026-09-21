// Règles communes aux modules de contenu — §22, §23 et §24 du cahier.
//
// Les six modules (pages, actualités, événements, ateliers, organisations,
// points de collecte) partagent exactement les mêmes règles : mêmes statuts,
// mêmes transitions selon le rôle, même verrou optimiste, même historique,
// même déclenchement de déploiement. Les écrire six fois reviendrait à
// garantir qu'ils finiraient par diverger — un module où l'on oublierait le
// verrou, un autre où l'historique manquerait.
//
// Ce fichier ne contient QUE des fonctions pures : aucune dépendance à la
// base ni à l’authentification, pour rester vérifiable sans rien démarrer.
// Le gestionnaire HTTP qui s’en sert vit dans lib/module-contenu.js.

// §22 : brouillon → à valider → programmé → publié → archivé.
export const STATUTS = ['brouillon', 'a_valider', 'programme', 'publie', 'archive']

export const LIBELLES_STATUT = {
  brouillon: 'Brouillon',
  a_valider: 'À valider',
  programme: 'Programmé',
  publie: 'Publié',
  archive: 'Archivé',
}

// Seul ce statut rend un contenu visible du public, donc seul lui justifie
// de reconstruire le site.
export const STATUTS_EN_LIGNE = ['publie']

/**
 * Transforme un libellé en slug d'URL. Les accents sont retirés : les
 * adresses du site sont toutes en ASCII et doivent le rester (§20, §31).
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
 * Transitions autorisées entre statuts, croisées avec les droits.
 *
 * @param {object} options
 * @param {boolean} options.peutPublier faux pour un Contributeur : le §21
 *   lui interdit de publier directement, il demande la validation.
 * @param {boolean} options.toujoursAValider vrai pour une page protégée
 *   (§8.4) : toute modification passe par « à valider », sans exception,
 *   même pour un profil qui pourrait publier ailleurs.
 */
export function transitionAutorisee(depuis, vers, { peutPublier, toujoursAValider = false }) {
  if (!STATUTS.includes(vers)) return { ok: false, raison: 'Statut inconnu.' }

  const misesEnLigne = ['publie', 'programme']

  // §8.4 : une page juridique ne se met en ligne qu'en VENANT de l'état
  // « à valider ». La validation est une étape obligatoire du parcours, pas
  // une interdiction de publier.
  //
  // Ce contrôle vient AVANT le raccourci « même statut » ci-dessous, et
  // c'est essentiel : enregistrer une page juridique déjà publiée en la
  // laissant publiée serait une modification mise en ligne sans relecture.
  // Le §8.4 l'interdit « sans exception » — y compris quand le statut ne
  // change pas en apparence. Les deux défauts ont été trouvés par les tests
  // le 21/09/2026, à une correction d'intervalle.
  if (toujoursAValider && misesEnLigne.includes(vers) && depuis !== 'a_valider') {
    return {
      ok: false,
      raison:
        "Cette page engage l'association sur le plan juridique : toute modification passe par une validation avant mise en ligne, sans exception.",
    }
  }

  if (depuis === vers) return { ok: true }

  if (misesEnLigne.includes(vers) && !peutPublier) {
    return {
      ok: false,
      raison: "Votre profil ne peut pas publier directement. Utilisez « Demander la validation ».",
    }
  }

  // On ne remet jamais en ligne d'un seul geste un contenu retiré : il
  // repasse par le brouillon, donc par une relecture.
  if (depuis === 'archive' && vers !== 'brouillon') {
    return { ok: false, raison: 'Un contenu archivé doit redevenir un brouillon avant toute autre étape.' }
  }

  return { ok: true }
}

/**
 * Ne conserve que les blocs reconnus, et pour chacun que ses champs
 * autorisés (§8.3 : l'utilisateur choisit le contenu, jamais la mise en
 * page). Un bloc inconnu est écarté sans faire échouer l'enregistrement :
 * personne ne doit perdre son travail à cause d'un bloc mal formé.
 */
export function nettoyerBlocs(blocs, definitions) {
  if (!Array.isArray(blocs)) return []
  const propres = []
  for (const bloc of blocs) {
    const champsAutorises = definitions[bloc?.type]
    if (!champsAutorises) continue
    const propre = { type: bloc.type }

    for (const champ of champsAutorises) {
      // Champ simple : une chaîne.
      if (typeof champ === 'string') {
        const valeur = bloc[champ]
        if (valeur !== undefined && valeur !== null && valeur !== '') {
          propre[champ] = typeof valeur === 'string' ? valeur : String(valeur)
        }
        continue
      }

      // Champ composé : une suite d'éléments répétables (les images d'une
      // galerie, les questions d'une FAQ). Chaque élément est filtré sur
      // ses propres champs autorisés, et les éléments entièrement vides
      // sont écartés — quelqu'un peut avoir ajouté une ligne sans la
      // remplir avant d'enregistrer.
      const elements = Array.isArray(bloc[champ.cle]) ? bloc[champ.cle] : []
      const propresElements = []
      for (const element of elements) {
        if (!element || typeof element !== 'object') continue
        const propreElement = {}
        for (const sousChamp of champ.sousChamps) {
          const valeur = element[sousChamp]
          if (valeur !== undefined && valeur !== null && valeur !== '') {
            propreElement[sousChamp] = typeof valeur === 'string' ? valeur : String(valeur)
          }
        }
        if (Object.keys(propreElement).length) propresElements.push(propreElement)
      }
      if (propresElements.length) propre[champ.cle] = propresElements
    }

    propres.push(propre)
  }
  return propres
}

