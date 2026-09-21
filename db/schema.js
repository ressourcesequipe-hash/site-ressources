// Schéma de la base de données du back-office — Étape 1 (socle) de
// docs/architecture-technique-backoffice.md.
//
// Base physiquement distincte de celle de Ressources 360, même fournisseur
// (Neon) ou non : voir §30 du cahier des charges et §5.2 de l'audit.
//
// Les tables user / session / account / verification suivent le schéma
// attendu par better-auth (vérifié contre node_modules/@better-auth/core/src/db/schema/*.ts
// le 19/09/2026, version better-auth 1.7.5) : les clés JS doivent
// correspondre exactement aux noms de champs internes de la bibliothèque
// (userId, expiresAt, emailVerified…), les noms de colonnes SQL peuvent en
// revanche suivre la convention snake_case du reste du projet. À régénérer
// avec `npx @better-auth/cli generate` dès qu'une connexion à une vraie base
// est disponible (Étape 0), pour confirmer qu'aucun champ n'a été oublié.

import {
  pgTable,
  text,
  boolean,
  timestamp,
  integer,
  serial,
  jsonb,
} from 'drizzle-orm/pg-core'

// ── Authentification (better-auth) ──────────────────────────────────────

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  // Champ additionnel propre au projet — §21 du cahier des charges.
  role: text('role').notNull().default('lecture_seule'),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  providerId: text('provider_id').notNull(),
  accountId: text('account_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  // Uniquement rempli pour le fournisseur email + mot de passe — hachage
  // géré entièrement par better-auth (§1 de l'architecture).
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// `createdAt`/`updatedAt` sont `notNull` ici comme dans les trois tables
// précédentes : better-auth 1.7.5 les déclare requis (vérifié le 20/09/2026
// en interrogeant `getAuthTables(auth.options)` sur la version réellement
// installée). La reconstitution manuelle les avait laissés nullables — sans
// conséquence tant qu'aucun flux de vérification d'email ou de
// réinitialisation de mot de passe n'utilise cette table, mais à corriger
// avant l'écran de changement de mot de passe prévu à l'Étape 2.
export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ── Permissions par rubrique — module Demandes (§5 de l'architecture) ────
//
// Une exception individuelle (utilisateur_id renseigné) prime sur la règle
// de rôle correspondante. Super administrateur et Coordination ont un
// plancher garanti par le code (lib/permissions.js), pas par cette table :
// ils gardent toujours accès à tout, même si cette table est mal configurée.

export const rubriquePermission = pgTable('rubrique_permissions', {
  id: serial('id').primaryKey(),
  role: text('role'),
  utilisateurId: text('utilisateur_id').references(() => user.id, {
    onDelete: 'cascade',
  }),
  rubriqueCle: text('rubrique_cle').notNull(),
  peutConsulter: boolean('peut_consulter').notNull().default(false),
  peutRepondre: boolean('peut_repondre').notNull().default(false),
})

// ── Médiathèque (§4 de l'architecture, §14 du cahier) ────────────────────
//
// Ne décrit que les médias PUBLICS (fichiers commités dans le dépôt Git).
// Les pièces jointes confidentielles des demandes ont leur propre table,
// ajoutée à l'Étape 3 (module Demandes) — jamais celle-ci (§14.2, §7 de
// l'architecture : contenu binaire hors base, dans Vercel Blob).

export const media = pgTable('medias', {
  id: serial('id').primaryKey(),
  // Chemin public servi par le site, ex. /medias/actualites/xyz.webp —
  // le chemin GitHub réel (public/medias/…) s'en déduit, jamais l'inverse.
  chemin: text('chemin').notNull().unique(),
  titre: text('titre'),
  alt: text('alt'),
  credit: text('credit'),
  categorie: text('categorie').notNull(),
  utilisateurId: text('utilisateur_id').references(() => user.id),
  // SHA du blob GitHub au dernier écrit — sert à détecter les conflits
  // d'écriture (409) et à retenter avec le SHA à jour (§4, §14.1).
  shaGithub: text('sha_github'),
  creeLe: timestamp('cree_le').notNull().defaultNow(),
})

// ── Paramètres généraux (§17 du cahier) ───────────────────────────────────
// Singleton : une seule ligne, id fixé à 1.

export const parametresSite = pgTable('parametres_site', {
  id: integer('id').primaryKey(),
  nomAssociation: text('nom_association'),
  logo: text('logo'),
  favicon: text('favicon'),
  adresse: text('adresse'),
  telephone: text('telephone'),
  emailGeneral: text('email_general'),
  emailPresse: text('email_presse'),
  siret: text('siret'),
  facebook: text('facebook'),
  instagram: text('instagram'),
  linkedin: text('linkedin'),
  lienDon: text('lien_don'),
  lienNewsletter: text('lien_newsletter'),
  majLe: timestamp('maj_le').defaultNow(),
})

// ── Déploiement (§2 de l'architecture) ────────────────────────────────────
//
// `etatDeploiement` est un singleton (id fixé à 1) : c'est la machine à
// états qui remplace le minuteur applicatif non fiable en serverless — voir
// lib/deploiement.js. `deploiement` journalise chaque déclenchement réel
// pour l'affichage du statut dans l'interface (§2 : jamais présenter un
// contenu comme « publié » avant que ce statut ne soit `pret`).

export const etatDeploiement = pgTable('etat_deploiement', {
  id: integer('id').primaryKey(),
  statut: text('statut').notNull().default('repos'), // repos | en_attente | en_cours
  redemande: boolean('redemande').notNull().default(false),
  vercelDeploymentId: text('vercel_deployment_id'),
  declencheLe: timestamp('declenche_le'),
  majLe: timestamp('maj_le').defaultNow(),
})

export const deploiement = pgTable('deploiements', {
  id: serial('id').primaryKey(),
  vercelDeploymentId: text('vercel_deployment_id'),
  statut: text('statut').notNull(), // en_cours | pret | echec
  contenusInclus: jsonb('contenus_inclus').default([]),
  declencheLe: timestamp('declenche_le').notNull().defaultNow(),
  resoluLe: timestamp('resolu_le'),
  erreur: text('erreur'),
})

// ── Actualités (§9 du cahier des charges) ────────────────────────────────
//
// Le schéma accueille sans perte les 11 articles existants de
// `src/data/articles.js` (migration prévue à l'Étape 4, jamais avant) :
// leurs blocs de contenu (`paragraph`, `heading`, `link`, `video`, `audio`)
// et les réglages de cadrage de l'image principale ont chacun leur place.
//
// `contenu` est un tableau de blocs en JSON plutôt que du HTML libre :
// c'est ce qui permet au site public de garder la maîtrise des styles
// (§8.3 : « l'utilisateur admin choisit le contenu, pas la charte »).
//
// `version` porte le verrou optimiste du §2 de l'architecture : un
// enregistrement envoie la version chargée au départ, et l'écriture est
// refusée si elle ne correspond plus — plutôt que d'écraser en silence le
// travail d'un collègue.

export const actualite = pgTable('actualites', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  titre: text('titre').notNull(),
  resume: text('resume'),
  contenu: jsonb('contenu').notNull().default([]),

  // Image principale et son cadrage — champs repris de l'existant.
  image: text('image'),
  imageAlt: text('image_alt'),
  imageCredit: text('image_credit'),
  imageLargeur: integer('image_largeur'),
  imageHauteur: integer('image_hauteur'),
  imageCadrage: text('image_cadrage'),
  imagePosition: text('image_position'),
  galerie: jsonb('galerie').default([]),

  categorie: text('categorie'),
  tags: jsonb('tags').default([]),
  lienExterne: text('lien_externe'),

  // §22 : brouillon | a_valider | programme | publie | archive
  statut: text('statut').notNull().default('brouillon'),
  datePublication: timestamp('date_publication'),
  dateDepublication: timestamp('date_depublication'),

  miseEnAvant: boolean('mise_en_avant').notNull().default(false),
  surAccueil: boolean('sur_accueil').notNull().default(false),

  // Calculé côté serveur à partir du contenu (§9) : jamais saisi à la main,
  // donc jamais faux ni oublié.
  tempsLectureMinutes: integer('temps_lecture_minutes'),

  seo: jsonb('seo').default({}),

  auteurId: text('auteur_id').references(() => user.id),
  modifieParId: text('modifie_par_id').references(() => user.id),
  version: integer('version').notNull().default(1),
  creeLe: timestamp('cree_le').notNull().defaultNow(),
  majLe: timestamp('maj_le').notNull().defaultNow(),
})

// ── Historique des versions (§23 du cahier des charges) ──────────────────
//
// Table transverse : une seule pour tous les types de contenu, plutôt
// qu'une table d'historique par module. `contenuPrecedent` conserve l'état
// AVANT la modification, ce qui permet de restaurer une version antérieure
// sans reconstituer quoi que ce soit.

export const versionContenu = pgTable('versions', {
  id: serial('id').primaryKey(),
  entiteType: text('entite_type').notNull(), // actualite | page | evenement…
  entiteId: integer('entite_id').notNull(),
  utilisateurId: text('utilisateur_id').references(() => user.id),
  typeModification: text('type_modification').notNull(), // creation | modification | changement_statut
  contenuPrecedent: jsonb('contenu_precedent'),
  creeLe: timestamp('cree_le').notNull().defaultNow(),
})

// ── Événements (§10 du cahier des charges) ───────────────────────────────
//
// Le §10 énumère comme « statuts » : brouillon, annoncé, en cours, terminé,
// annulé, archivé. Ces valeurs mêlent deux choses distinctes, et les garder
// dans un seul champ rendrait certains cas impossibles à représenter — un
// brouillon d'événement déjà passé, par exemple.
//
// Séparation retenue :
//   - `statut` : l'état de PUBLICATION, commun à tous les modules (§22).
//     C'est lui qui décide de la visibilité sur le site.
//   - `annule` : le seul état de cycle de vie qui relève d'une décision
//     humaine, et qui doit rester visible même une fois l'événement passé.
//   - « à venir / en cours / terminé » ne sont PAS stockés : ils se
//     déduisent des dates à l'affichage. C'est ce qui réalise
//     l'automatisation demandée au §10 (« un événement terminé ne figure
//     plus dans les à venir ») sans que personne ait à y penser, et sans
//     risque qu'un statut oublié contredise le calendrier.

export const evenement = pgTable('evenements', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  titre: text('titre').notNull(),
  descriptionCourte: text('description_courte'),
  descriptionComplete: jsonb('description_complete').default([]),
  programme: jsonb('programme').default([]),

  image: text('image'),
  imageAlt: text('image_alt'),
  imageCredit: text('image_credit'),

  debutLe: timestamp('debut_le'),
  finLe: timestamp('fin_le'),
  journeeEntiere: boolean('journee_entiere').notNull().default(false),

  lieu: text('lieu'),
  adresse: text('adresse'),
  codePostal: text('code_postal'),
  commune: text('commune'),
  lienCarte: text('lien_carte'),

  urlInscription: text('url_inscription'),
  appelAction: text('appel_action'),
  partenaires: jsonb('partenaires').default([]),
  documents: jsonb('documents').default([]),

  // Décision humaine, distincte du fait que l'événement soit passé : un
  // événement annulé doit le rester visiblement, même après sa date.
  annule: boolean('annule').notNull().default(false),
  motifAnnulation: text('motif_annulation'),

  statut: text('statut').notNull().default('brouillon'),
  datePublication: timestamp('date_publication'),
  miseEnAvant: boolean('mise_en_avant').notNull().default(false),
  surAccueil: boolean('sur_accueil').notNull().default(false),
  seo: jsonb('seo').default({}),

  auteurId: text('auteur_id').references(() => user.id),
  modifieParId: text('modifie_par_id').references(() => user.id),
  version: integer('version').notNull().default(1),
  creeLe: timestamp('cree_le').notNull().defaultNow(),
  majLe: timestamp('maj_le').notNull().defaultNow(),
})

// ── Organisations : partenaires et mécènes (§12 du cahier) ───────────────
//
// Collection unique plutôt qu'une table par type, comme le demande le §12 :
// « cela évite de dupliquer les fiches ». Une même commune peut être à la
// fois partenaire et hôte d'un point de collecte.
//
// Deux informations sont ici volontairement séparées :
//   - `statut` : l'état de PUBLICATION de la fiche (§22). C'est lui qui
//     décide de la visibilité sur le site — pas un second interrupteur
//     « visible oui/non », qui créerait deux réglages contradictoires pour
//     une même question.
//   - `statutPartenariat` : le suivi INTERNE de la relation (prospect,
//     échange en cours, convention signée…). Le §12 précise qu'il « ne doit
//     pas nécessairement être visible publiquement » : il ne l'est jamais,
//     et n'est renvoyé qu'aux comptes connectés.

export const organisation = pgTable('organisations', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  nom: text('nom').notNull(),
  type: text('type'),
  descriptionCourte: text('description_courte'),
  siteInternet: text('site_internet'),
  commune: text('commune'),
  emailPublic: text('email_public'),
  telephonePublic: text('telephone_public'),

  logo: text('logo'),
  logoAlt: text('logo_alt'),

  // Suivi interne de la relation — jamais publié.
  statutPartenariat: text('statut_partenariat').default('prospect'),
  notesInternes: text('notes_internes'),
  debutLe: timestamp('debut_le'),
  finLe: timestamp('fin_le'),

  categorieAffichage: text('categorie_affichage'),
  ordre: integer('ordre').default(0),
  surAccueil: boolean('sur_accueil').notNull().default(false),

  statut: text('statut').notNull().default('brouillon'),
  datePublication: timestamp('date_publication'),
  seo: jsonb('seo').default({}),

  auteurId: text('auteur_id').references(() => user.id),
  modifieParId: text('modifie_par_id').references(() => user.id),
  version: integer('version').notNull().default(1),
  creeLe: timestamp('cree_le').notNull().defaultNow(),
  majLe: timestamp('maj_le').notNull().defaultNow(),
})

// ── Points de collecte publics (§13 du cahier) ───────────────────────────
//
// Attention (§13) : il s'agit des lieux de dépôt ouverts au public, pas de
// la traçabilité des collectes, qui reste dans Ressources 360.
//
// Le §13 exige qu'« une information modifiée ici soit répercutée partout où
// le point apparaît ». C'est la raison d'être de cette table : une seule
// ligne fait foi, et chaque page du site la relira au moment du build. Il
// n'y a donc jamais deux endroits à corriger pour un horaire.
//
// Comme pour les événements, les états « prévu / actif / terminé » se
// déduisent des dates et ne sont pas stockés. Seule la fermeture
// temporaire, qui est une décision humaine, a son propre champ.

export const pointCollecte = pgTable('points_collecte', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  nom: text('nom').notNull(),

  // Le logo et la commune peuvent être hérités de l'organisation (§13).
  organisationId: integer('organisation_id').references(() => organisation.id),

  adresse: text('adresse'),
  complementAdresse: text('complement_adresse'),
  codePostal: text('code_postal'),
  commune: text('commune'),
  latitude: text('latitude'),
  longitude: text('longitude'),

  horaires: jsonb('horaires').default([]),
  consignes: text('consignes'),
  informationsTemporaires: text('informations_temporaires'),

  type: text('type'),
  campagne: text('campagne'),
  debutLe: timestamp('debut_le'),
  finLe: timestamp('fin_le'),

  fermeTemporairement: boolean('ferme_temporairement').notNull().default(false),
  motifFermeture: text('motif_fermeture'),

  visibleCarte: boolean('visible_carte').notNull().default(true),
  visibleListe: boolean('visible_liste').notNull().default(true),
  ordre: integer('ordre').default(0),

  statut: text('statut').notNull().default('brouillon'),
  datePublication: timestamp('date_publication'),
  seo: jsonb('seo').default({}),

  auteurId: text('auteur_id').references(() => user.id),
  modifieParId: text('modifie_par_id').references(() => user.id),
  version: integer('version').notNull().default(1),
  creeLe: timestamp('cree_le').notNull().defaultNow(),
  majLe: timestamp('maj_le').notNull().defaultNow(),
})

// ── Catégories d'ateliers (§11 du cahier des charges) ────────────────────
//
// Le §11 l'exige explicitement : « les catégories doivent être
// administrables et non codées en dur ». C'est la seule liste du projet
// dans ce cas — celles des actualités, des organisations ou des points de
// collecte restent fixées dans le code, le cahier ne demandant rien de tel.
//
// `cle` est l'identifiant stable utilisé par le site public ; `libelle` est
// ce que lit l'équipe. Renommer un libellé ne casse donc aucun lien.

export const categorieAtelier = pgTable('categories_ateliers', {
  id: serial('id').primaryKey(),
  cle: text('cle').notNull().unique(),
  libelle: text('libelle').notNull(),
  ordre: integer('ordre').notNull().default(0),
  actif: boolean('actif').notNull().default(true),
  creeLe: timestamp('cree_le').notNull().defaultNow(),
})

// ── Ateliers (§11 du cahier des charges) ─────────────────────────────────
//
// `disponible` est distinct du statut de publication, pour la même raison
// que partout ailleurs : une fiche d'atelier peut rester consultable sur le
// site tout en indiquant que l'atelier n'est pas proposé en ce moment.
// Les confondre obligerait à dépublier la fiche pour signaler une
// indisponibilité, donc à la faire disparaître au lieu de l'expliquer.

export const atelier = pgTable('ateliers', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  nom: text('nom').notNull(),
  theme: text('theme'),
  publicCible: text('public_cible'),

  image: text('image'),
  imageAlt: text('image_alt'),
  imageCredit: text('image_credit'),

  description: jsonb('description').default([]),
  objectifs: jsonb('objectifs').default([]),
  programme: jsonb('programme').default([]),

  duree: text('duree'),
  capacite: integer('capacite'),
  lieuPossible: text('lieu_possible'),
  materielNecessaire: text('materiel_necessaire'),
  modalites: text('modalites'),

  // §11 : « tarif ou mention sur devis ». Deux champs plutôt qu'un texte
  // libre, pour que le site sache quoi afficher sans interpréter.
  surDevis: boolean('sur_devis').notNull().default(false),
  tarif: text('tarif'),

  disponible: boolean('disponible').notNull().default(true),
  motifIndisponibilite: text('motif_indisponibilite'),

  categories: jsonb('categories').default([]),
  urlDemande: text('url_demande'),
  libelleBoutonDemande: text('libelle_bouton_demande'),

  statut: text('statut').notNull().default('brouillon'),
  datePublication: timestamp('date_publication'),
  ordre: integer('ordre').default(0),
  seo: jsonb('seo').default({}),

  auteurId: text('auteur_id').references(() => user.id),
  modifieParId: text('modifie_par_id').references(() => user.id),
  version: integer('version').notNull().default(1),
  creeLe: timestamp('cree_le').notNull().defaultNow(),
  majLe: timestamp('maj_le').notNull().defaultNow(),
})
