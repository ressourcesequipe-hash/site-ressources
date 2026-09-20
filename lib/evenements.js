// Logique métier des événements — §10 du cahier des charges.
//
// Fonctions pures, vérifiables sans base ni requête : la route d'API se
// contente de les appeler après avoir contrôlé les droits.

export { STATUTS, LIBELLES_STATUT, slugifier, transitionAutorisee } from './contenus.js'
import { nettoyerBlocs } from './contenus.js'

// Mêmes blocs que les actualités, moins l'audio : un programme ou une
// description d'événement se compose de texte, d'intertitres, de liens et
// éventuellement d'une vidéo. Liste fermée côté serveur (§8.3).
export const BLOCS = {
  paragraph: ['text'],
  heading: ['text'],
  link: ['label', 'href'],
  video: ['src', 'title', 'sourceUrl', 'sourceLabel', 'credit'],
}

export function nettoyerContenu(blocs) {
  return nettoyerBlocs(blocs, BLOCS)
}

/**
 * État du cycle de vie, DÉDUIT des dates plutôt que stocké.
 *
 * C'est ce qui réalise l'automatisation du §10 : un événement passé sort de
 * lui-même des « à venir », sans que personne ait à changer un statut — et
 * sans risque qu'un statut oublié contredise le calendrier.
 *
 * L'annulation, elle, est une décision humaine : elle prime sur tout le
 * reste et reste affichée même une fois la date passée.
 *
 * @returns {'annule'|'a_venir'|'en_cours'|'termine'|'sans_date'}
 */
export function etatCycleDeVie(evenement, maintenant = new Date()) {
  if (evenement?.annule) return 'annule'

  const debut = evenement?.debutLe ? new Date(evenement.debutLe) : null
  const fin = evenement?.finLe ? new Date(evenement.finLe) : null
  if (!debut || Number.isNaN(debut.getTime())) return 'sans_date'

  // Sans date de fin, l'événement est considéré terminé à la fin du jour de
  // son début : un événement du matin ne doit pas rester « en cours » le
  // lendemain.
  const finEffective = fin && !Number.isNaN(fin.getTime())
    ? fin
    : new Date(debut.getFullYear(), debut.getMonth(), debut.getDate(), 23, 59, 59)

  if (maintenant < debut) return 'a_venir'
  if (maintenant > finEffective) return 'termine'
  return 'en_cours'
}

export const LIBELLES_CYCLE = {
  annule: 'Annulé',
  a_venir: 'À venir',
  en_cours: 'En cours',
  termine: 'Terminé',
  sans_date: 'Date à définir',
}

/**
 * Contrôles de cohérence. Messages rédigés pour être affichés tels quels à
 * un utilisateur non technique (§24.4), chacun désignant son champ.
 */
export function valider(donnees, { statutVise }) {
  const erreurs = []

  if (!donnees.titre || !String(donnees.titre).trim()) {
    erreurs.push({ champ: 'titre', message: 'Le titre est obligatoire.' })
  }

  const debut = donnees.debutLe ? new Date(donnees.debutLe) : null
  const fin = donnees.finLe ? new Date(donnees.finLe) : null

  if (donnees.debutLe && Number.isNaN(debut?.getTime())) {
    erreurs.push({ champ: 'debutLe', message: "Cette date de début n'est pas valide." })
  }
  if (donnees.finLe && Number.isNaN(fin?.getTime())) {
    erreurs.push({ champ: 'finLe', message: "Cette date de fin n'est pas valide." })
  }
  // Contrôle de cohérence demandé au §24.4 : une fin avant le début est une
  // faute de saisie courante, qu'il vaut mieux signaler tout de suite.
  if (debut && fin && !Number.isNaN(debut.getTime()) && !Number.isNaN(fin.getTime()) && fin < debut) {
    erreurs.push({ champ: 'finLe', message: 'La fin ne peut pas précéder le début.' })
  }

  if (donnees.annule && !String(donnees.motifAnnulation || '').trim()) {
    erreurs.push({
      champ: 'motifAnnulation',
      message: "Indiquez pourquoi l'événement est annulé : le message sera lu par les personnes qui comptaient venir.",
    })
  }

  if (statutVise === 'publie' || statutVise === 'programme') {
    if (!donnees.debutLe) {
      erreurs.push({ champ: 'debutLe', message: "Indiquez la date de l'événement avant la mise en ligne." })
    }
    if (!String(donnees.descriptionCourte || '').trim()) {
      erreurs.push({
        champ: 'descriptionCourte',
        message: 'Une description courte est nécessaire avant la mise en ligne : elle apparaît dans les listes et les partages.',
      })
    }
    if (!String(donnees.lieu || '').trim() && !String(donnees.commune || '').trim()) {
      erreurs.push({ champ: 'lieu', message: "Indiquez au moins le lieu ou la commune, pour que l'on sache où se rendre." })
    }
    if (donnees.image && !String(donnees.imageAlt || '').trim()) {
      erreurs.push({
        champ: 'imageAlt',
        message: "Décrivez l'image pour les personnes qui ne la voient pas. Exemple : « Affiche de la journée portes ouvertes du 3 octobre. »",
      })
    }
  }

  if (statutVise === 'programme') {
    const dateMiseEnLigne = donnees.datePublication ? new Date(donnees.datePublication) : null
    if (!dateMiseEnLigne || Number.isNaN(dateMiseEnLigne.getTime())) {
      erreurs.push({ champ: 'datePublication', message: 'Indiquez la date de mise en ligne souhaitée.' })
    } else if (dateMiseEnLigne.getTime() <= Date.now()) {
      erreurs.push({ champ: 'datePublication', message: 'La date de programmation doit être dans le futur.' })
    }
  }

  return erreurs
}
