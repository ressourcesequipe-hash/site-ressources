# ARCHITECTURE TECHNIQUE DÉFINITIVE — BACK-OFFICE DU SITE RESSOURCES

**Statut :** document de conception, soumis à validation avant toute écriture de code (§44.2 du [cahier des charges](./cahier-des-charges-backoffice.md)).
**S'appuie sur :** [l'audit Phase 0](./audit-phase0-backoffice.md) et les orientations validées le 19/09/2026.
**Portée :** répond aux 7 points techniques à finaliser, complète le schéma de données avec le module Demandes, et fixe le plan de développement par étapes.
**Révision du 19/09/2026 :** les sections 2 (publication), 3 (programmation), 4 (médiathèque), 5 (permissions et suivi d'envoi des demandes) et 7 (sauvegarde) ont été retravaillées en réponse aux questions techniques posées lors de la relecture. Les changements substantiels sont signalés par « *(révisé)* ». Ce qui n'est pas signalé reste inchangé depuis la première version.

---

## 1. Authentification

### Recommandation : Better Auth

**Better Auth** — bibliothèque open source, agnostique du framework (elle ne suppose pas Next.js, contrairement à la plupart des solutions « batteries incluses »), activement maintenue, conçue pour s'intégrer comme une simple dépendance du projet plutôt que comme un service séparé. Elle correspond exactement à ce que permet le §26 du cahier : une brique d'authentification éprouvée, pas un système développé sur mesure.

Ce qu'elle apporte directement :

- gestion de session par cookie sécurisé (httpOnly, `secure`, `sameSite=lax`), sessions stockées en base plutôt que des JWT auto-portants — révocation immédiate possible (déconnexion forcée, compte désactivé) ;
- hachage des mots de passe géré par la bibliothèque (scrypt), aucune implémentation cryptographique à écrire ;
- limitation native des tentatives de connexion (rate limiting configurable par IP/compte) ;
- adaptateur officiel **Drizzle**, cohérent avec le choix d'ORM de l'audit (Partie B.5) ;
- champs personnalisés sur l'utilisateur — utilisés ici pour stocker le `role` (§21) ;
- fonctionne nativement dans une fonction serverless Vercel, sans dépendre d'un framework applicatif particulier.

### Ce que ça ne couvre pas (à construire par-dessus)

- Le **contrôle d'accès par rôle** (RBAC) reste une couche applicative simple : chaque route d'API vérifie `utilisateur.role` avant d'agir, jamais seulement côté interface (§24.3 — masquer un bouton ne suffit pas). Une fonction utilitaire unique (`verifierDroit(role, action)`) centralise ces règles, pour éviter que la logique de permissions se disperse dans chaque route.
- L'authentification email + mot de passe suffit pour une équipe interne d'une dizaine de comptes ; pas d'OAuth/SSO nécessaire en V1.

### Solution de repli

Si l'intégration de Better Auth se heurtait à une incompatibilité imprévue avec l'environnement de build Vite + fonctions serverless Vercel (à vérifier lors d'un premier test technique en tout début de Phase 1, avant de construire quoi que ce soit dessus) : repli sur **`iron-session`** (cookies de session chiffrés, bibliothèque éprouvée et minimale) + **`@node-rs/argon2`** (hachage natif, rapide) assemblés à la main. C'est plus de code à écrire, mais toujours construit sur des briques cryptographiques reconnues, jamais réinventées.

---

## 2. Processus de publication *(révisé)*

### Pourquoi la version précédente était fragile

La première version de ce document proposait une fenêtre de regroupement (« debounce ») de 60 secondes, avec l'idée qu'un processus attendrait ce délai avant d'appeler le deploy hook. **Ce n'est pas fiable dans un environnement serverless** : une fonction Vercel n'a aucune garantie de rester en mémoire après avoir répondu à sa requête, et deux invocations de la même fonction ne partagent pas de mémoire entre elles. Un minuteur applicatif qui « continue de courir » entre deux requêtes n'existe donc pas vraiment — il aurait fonctionné par accident sur une instance restée chaude, et aurait silencieusement disparu sur une instance froide. Ce qui suit remplace entièrement ce mécanisme par un design qui ne dépend que de la base de données et d'appels HTTP courts, chacun entièrement contenu dans une seule requête.

### Enregistrer un brouillon

Écriture en base uniquement (`statut = brouillon`). Aucun appel réseau vers Vercel, aucun déploiement déclenché — conforme au §5.5.

### Publier — machine à états en base, pas de minuteur

Une table singleton `etat_deploiement` (une seule ligne) remplace la file d'attente temporisée :

```
etat_deploiement (une seule ligne)
  statut       repos | en_attente | en_cours
  redemande    booléen — une publication est arrivée pendant un déploiement déjà en cours
  vercel_deployment_id
  declenche_le, maj_le
```

1. Le serveur revérifie les droits de l'utilisateur (jamais seulement l'état de l'interface).
2. Le contenu passe à `statut = publié` (ou `à valider` si le rôle ne peut pas publier directement, ou si la page est protégée — §8.4, toujours `à valider` sans exception), avec `auteur_id` et horodatage.
3. **Dans la même requête**, le serveur appelle une fonction `demanderDeploiement()` :
   - si `etat_deploiement.statut = repos` : il passe à `en_attente`, puis **appelle immédiatement le deploy hook Vercel** — un simple appel HTTP qui répond en quelques centaines de millisecondes (le hook accuse réception, il n'attend pas la fin du build) — récupère l'identifiant de déploiement renvoyé, et passe l'état à `en_cours`. **Toute la séquence tient dans la requête qui a traité la publication : rien à faire survivre après la réponse.**
   - si `etat_deploiement.statut` vaut déjà `en_attente` ou `en_cours` : il se contente de mettre `redemande = true` et s'arrête là. **Aucun second appel au deploy hook** — c'est ce qui évite les déploiements redondants (§5.5) lors de publications rapprochées, sans dépendre d'un délai fixe.
4. **Clore le cycle**, dès que le déploiement en cours se termine (prêt ou en échec) : soit via un **webhook Vercel** (le plus réactif, à confirmer en Phase 1 selon le plan), soit, en repli, quand la tâche planifiée (§3, qui tourne déjà pour les publications programmées) constate que `etat_deploiement.statut = en_cours` et interroge l'API Vercel sur l'état réel de ce déploiement précis. Dans les deux cas, la même fonction s'exécute : elle enregistre le résultat dans `deploiements` (visible dans l'interface), remet `etat_deploiement.statut = repos`, et **si `redemande = true`**, redéclenche aussitôt un nouveau déploiement (retour à l'étape 3) avant de remettre `redemande = false`.

Ce design a deux propriétés utiles par rapport à un simple minuteur : une publication isolée part **immédiatement**, sans attendre un délai fixe (meilleure réactivité perçue) ; et des publications qui arrivent pendant qu'un déploiement est déjà en cours de construction (souvent plus de 60 secondes) sont automatiquement regroupées en un seul déploiement suivant, sans jamais en perdre une.

### Suivi de l'état réel du déploiement

Une table `deploiements` enregistre chaque déclenchement : `id`, `vercel_deployment_id`, `statut` (`en_attente` → `en_cours` → `pret` / `echec`), `contenus_inclus[]`, `declenche_le`. Le statut est mis à jour par le webhook Vercel ou par l'interrogation périodique décrite ci-dessus — à confirmer techniquement en Phase 1 selon les webhooks disponibles sur le plan utilisé.

L'interface reflète cet état, jamais un raccourci optimiste :

- **« Publication en cours… »** tant que `en_attente`/`en_cours` ;
- **« Publié, en ligne »** avec un lien direct vers la page, uniquement quand `pret` ;
- **message d'échec explicite** si `echec`, avec un renvoi vers le journal d'erreur pour les profils autorisés (Super administrateur/Coordination).

Un contenu marqué « publié » en base mais dont le déploiement a échoué n'est jamais présenté comme en ligne — exigence explicite du §5.5.

### Comportement en cas d'échec de déploiement

Garantie native de Vercel, non développée par le back-office : un build qui échoue **ne remplace jamais** la production, qui continue de servir la dernière version fonctionnelle. Le rôle du back-office se limite à :

- ne jamais mentir sur l'état (voir ci-dessus) ;
- ne jamais bloquer la poursuite du travail (l'équipe peut continuer à créer des brouillons pendant qu'un déploiement échoue) ;
- conserver le message d'erreur du build pour diagnostic, sans l'exposer en clair à un profil non technique — un message générique (« La publication n'a pas pu aboutir, l'équipe technique a été alertée ») suffit pour Communication/Contributeur, le détail technique restant réservé à Coordination/Super administrateur.

### Éditions simultanées

Deux mécanismes complémentaires, l'un informatif, l'autre garant :

1. **Indicateur de présence (informatif, non bloquant).** À l'ouverture d'une fiche en édition, si une autre session a la même fiche ouverte depuis moins de quelques minutes (heartbeat léger), un bandeau prévient : « Actuellement modifié par [prénom] il y a [x] min ». Réduit le risque de collision sans empêcher de travailler.
2. **Verrou optimiste à l'enregistrement (garant).** Chaque contenu porte un compteur `version`. Un enregistrement envoie la version chargée au départ ; si elle ne correspond plus à celle en base (quelqu'un d'autre a enregistré entretemps), l'écriture est refusée avec un message clair (« Ce contenu a été modifié par [prénom] entretemps — recharger la page pour voir les changements avant de continuer »), plutôt que d'écraser silencieusement le travail d'un collègue. Aucune perte de contenu ne se produit sans que l'utilisateur en soit informé.

Pour le module Demandes, un mécanisme plus strict s'applique à la rédaction d'une réponse (voir §5 plus bas) : un verrou actif, pas seulement optimiste, pour éviter un double envoi d'email.

---

## 3. Publications programmées et campagnes temporaires *(révisé)*

### Mécanisme

**Vercel Cron Jobs**, conformément au §5.6 du cahier. Cette même tâche sert aussi de filet de sécurité pour le suivi de déploiement décrit au §2.

### Ce que l'on sait du plan Vercel, et ce qui reste à vérifier

D'expérience sur ce type de plan, un palier gratuit (Hobby) limite en général les tâches planifiées à une fréquence grossière (couramment : une exécution par jour, pas plus fine), alors qu'un palier payant (Pro) autorise une fréquence beaucoup plus fine (à la minute) et davantage de tâches. **Le palier exact retenu pour le projet Ressources, et la fréquence qu'il autorise réellement, doivent être vérifiés sur le compte lui-même en tout début de Phase 1** (Étape 0 du plan de développement) — c'est un point explicitement renvoyé à l'audit par le §5.6 du cahier, et la conception ci-dessous suppose délibérément le scénario le plus défavorable (vérification une fois par jour) pour rester correcte quel que soit le résultat de cette vérification :

1. Une tâche planifiée unique s'exécute à l'intervalle le plus fin que permet le plan effectivement utilisé.
2. À chaque exécution, elle recherche en base : les contenus `statut = programmé` dont la date de publication est atteinte, et les campagnes/bandeaux `actif` dont la date de fin est dépassée.
3. Elle bascule leur statut, puis appelle `demanderDeploiement()` — **le même mécanisme que la publication manuelle (§2)**, aucune logique de déploiement dupliquée.

### Le contrôle côté navigateur est un confort d'affichage, jamais une garantie

**Ce point mérite d'être dit sans ambiguïté : un contrôle exécuté dans le navigateur ne change rien au HTML réellement servi.** Il masque un bandeau expiré pour un visiteur humain dont le navigateur exécute le JavaScript de la page, mais :

- le fichier HTML prérendu, lui, contient toujours le contenu tant qu'un nouveau déploiement n'a pas eu lieu — c'est ce que voient les robots d'indexation (Google, réseaux sociaux) et n'importe quel outil qui lit la page sans exécuter de script (« Afficher le code source ») ;
- un moteur de recherche ne « voit » donc jamais l'effet du contrôle côté navigateur, seulement l'état réel du dernier déploiement.

Le contrôle côté navigateur (déjà présent en germe dans `EventBanner.jsx`) reste utile comme **filet de confort entre l'heure réelle de fin de campagne et le prochain rebuild** — mais il ne remplace en rien le déploiement effectif, qui est la seule chose qui retire vraiment le contenu du HTML et de ce que voient les moteurs de recherche. Le document ne le présente donc plus comme une garantie de conformité, seulement comme un bonus d'affichage.

### La vraie question à trancher : quelle précision l'association a-t-elle réellement besoin d'obtenir ?

Une fois le palier réel connu (Étape 0), trois issues possibles, à arbitrer avec l'équipe plutôt qu'à décider seul :

1. **Le délai du palier gratuit (jusqu'à ~24 h dans le pire cas) est acceptable** pour les usages prévus (une campagne qui se termine « autour du » 3 octobre, pas à la seconde près) — aucun coût supplémentaire, c'est l'hypothèse par défaut de ce document.
2. **Passer au palier payant** si une précision plus fine (de l'ordre de la minute ou de l'heure) est réellement nécessaire — à chiffrer explicitement dans les coûts récurrents (§43.2 de l'audit), ce n'est pas gratuit.
3. **Le bouton manuel de secours** (ci-dessous) pour les échéances connues à l'avance et ponctuelles (une fin de campagne dont la date est déjà fixée) : un membre de l'équipe le déclenche au moment voulu, ce qui donne une précision humaine sans dépendre du palier Vercel.

### Solution manuelle de secours

Un bouton « Vérifier et publier maintenant », réservé à Coordination/Super administrateur, dans les Paramètres du back-office, permet de déclencher la même vérification à la demande, sans attendre le prochain passage du cron — utile lors d'un lancement de campagne où l'équipe veut une mise en ligne immédiate et certaine, et c'est le principal recours si le palier gratuit s'avère trop grossier pour une échéance précise.

---

## 4. Médiathèque : GitHub + Sharp

### Flux d'upload

1. **Compression côté navigateur** avant envoi, si le fichier dépasse un seuil (~2 Mo) — typiquement une photo de téléphone. Objectif : rester sous la limite de taille de charge utile des fonctions serverless Vercel et accélérer l'envoi. Ce n'est qu'un pré-traitement : `sharp`, côté serveur, reste la source de vérité pour les tailles finales (§14.1).
2. **Validation côté serveur**, jamais seulement côté client : type de fichier réellement détecté (pas seulement l'extension — `sharp` lève une erreur sur un contenu qui n'est pas une image valide, ce qui sert aussi de vérification), taille maximale, nombre de fichiers par requête.
3. **Génération des variantes** avec `sharp` : original conservé, puis déclinaisons pour les usages du §14 (miniature, carte, article, hero, partage réseaux sociaux), au format WebP avec repli PNG si nécessaire — même logique que `scripts/optimiser-logos.mjs` aujourd'hui.
4. **Écriture dans le dépôt GitHub** via l'API (bibliothèque `octokit`) : lecture du SHA actuel du fichier si remplacement, écriture par `PUT /repos/:owner/:repo/contents/:chemin`. Chemin proposé : `public/medias/<categorie>/<nom-fichier>`, dans la continuité de `public/photos/` et `public/logos/` existants.
5. **Remplacement, pas accumulation** : remplacer un média réécrit le même chemin (§14.1) — pas de nouveau fichier à chaque republication.
6. **Conflit d'écriture (409)** : nouvelle tentative automatique après relecture du SHA à jour (le scénario décrit au §14.1 : deux publications proches se chevauchent sur l'API GitHub). Un seul réessai automatique, puis message d'erreur explicite si le conflit persiste — pas de boucle infinie.
7. **Suppression** : un média détecté comme inutilisé (indicateur du tableau de bord, §7) peut être supprimé du dépôt via `DELETE /repos/:owner/:repo/contents/:chemin`, en plus de sa fiche en base — les deux actions vont ensemble.

### Éviter les déploiements redondants entre commits GitHub et deploy hooks *(révisé)*

> **⚠️ Section caduque depuis le 20/09/2026 — mécanisme abandonné en conditions réelles.**
> L'« Ignored Build Step » décrit ci-dessous a été mis en place, puis **retiré** (réglage Vercel repassé en `Automatic`). Deux raisons, constatées et non théoriques :
> 1. il décide en lisant l'auteur du **dernier commit**, alors que Vercel construit toujours la tête de la branche *quelle que soit la cause du déploiement* — un deploy hook appelé alors que la tête de `main` est un commit de média aurait vu son build ignoré, faisant échouer une publication **silencieusement** ;
> 2. collé dans le champ Vercel (entrée d'**une seule ligne**, limitée à **256 caractères**), le script multi-lignes a provoqué une panne totale de déploiement le 20/09/2026.
>
> Conséquence assumée : un ajout de média déclenche désormais un build. Le regroupement des publications rapprochées reste assuré par la machine à états du §2, qui n'est pas concernée par ce retrait. Piste éventuelle si le volume de builds devenait un sujet : `[skip ci]` dans le message des commits de média (par commit, pas par règle globale). Détail complet dans [le journal d'avancement](./backoffice-etat-avancement.md).
>
> Le reste de cette section est conservé tel quel pour mémoire du raisonnement d'origine.

Point important soulevé à la relecture : un dépôt GitHub connecté à un projet Vercel déclenche par défaut **un déploiement automatique à chaque push sur la branche de production** — en plus des déploiements déclenchés par nos propres deploy hooks (§2). Sans précaution, un commit de média ferait donc doublon avec le mécanisme de publication déjà en place, à l'encontre du §5.5 (« éviter les déploiements inutiles ou redondants »).

Solution retenue, native à Vercel, sans nouvelle brique technique : le paramètre projet **« Ignored Build Step »**. C'est un script que Vercel exécute avant de décider s'il construit ou non un déploiement déclenché par un push Git. Le back-office configure ce script pour qu'il **ignore** (renvoie « pas de build ») tout push dont le seul auteur est le compte de service GitHub dédié à l'upload de médias — reconnaissable par son identité de commit, distincte de celle d'un vrai commit de développement (Claude Code, un développeur). Concrètement :

- un commit de média seul (upload sans publication associée) est **poussé sur GitHub mais ignoré par le déploiement automatique** de Vercel — il ne construit rien tout seul ;
- **le seul chemin qui déclenche réellement un déploiement reste le deploy hook** appelé par `demanderDeploiement()` (§2) — que ce soit pour un contenu publié, ou pour un média nouvellement rattaché à un contenu qui vient d'être publié ;
- un vrai commit de code (développement, correctif) n'est jamais concerné par cette règle — il continue de déclencher le déploiement Git standard, normal en dehors du fonctionnement du back-office.

Ce découplage confirme et complète la règle déjà posée : « un ajout de média en réserve ne déclenche pas de déploiement à lui seul » — désormais vrai aussi bien au niveau applicatif (pas d'appel au deploy hook) qu'au niveau de la plateforme (le commit seul ne construit rien).

### Conservation des médias en brouillon, et exposition avant publication *(révisé)*

Un média ajouté pendant la rédaction d'un brouillon (actualité, événement…) est **committé dans GitHub dès l'upload**, pas seulement au moment où le contenu qui l'utilise est publié — c'est nécessaire pour que la médiathèque fonctionne normalement pendant l'édition (aperçu immédiat, réutilisation du média dans un autre brouillon, §14.1). Le fichier existe donc dans le dépôt avant que son contenu ne soit publié.

**Conséquence à assumer explicitement** : comme Vite recopie l'intégralité du dossier `public/` dans chaque build, un fichier présent dans le dépôt devient sur le site — à son adresse directe, non listée nulle part — dès le **prochain déploiement effectif**, que ce déploiement soit ou non celui qui publie le contenu qui utilise cette image. Autrement dit, une image liée à un brouillon peut techniquement devenir accessible par son URL directe avant que l'article ne soit publié, si un déploiement a lieu entretemps pour une tout autre raison.

- C'est une conséquence assumée du modèle retenu au §14.1 du cahier (médias publics = fichiers dans un dépôt public), pas une faille à corriger ici : le fichier n'est jamais référencé par une page, n'est jamais indexé, n'apparaît dans aucun sitemap — seule une personne qui devine ou scanne l'URL exacte pourrait le trouver.
- Cette conséquence ne s'applique **jamais** aux documents confidentiels (§14.2), qui ne passent par aucun moment par ce circuit — c'est précisément pour éviter ce type d'exposition que la séparation entre médias publics et pièces confidentielles existe.
- Si l'équipe juge ce risque inacceptable pour un visuel particulièrement sensible (par exemple l'annonce d'un partenariat non encore public), la seule protection réelle serait de retarder l'écriture GitHub jusqu'à la publication elle-même plutôt qu'à l'upload — un changement de conception plus lourd, hors périmètre de la V1 sauf demande explicite de l'équipe.

### Empêcher l'upload en dehors des répertoires autorisés *(révisé)*

Le chemin GitHub d'un média n'est **jamais construit à partir d'une valeur envoyée par le client** :

- la catégorie est choisie dans une liste fermée, définie côté serveur (pas un champ texte libre) ;
- le nom de fichier final est généré par le serveur à partir d'un identifiant et d'une extension déduite du type réel détecté par `sharp` — jamais le nom de fichier tel qu'envoyé par le navigateur ;
- toute valeur qui contiendrait `..`, un séparateur de répertoire, ou tout caractère hors d'un jeu autorisé (lettres, chiffres, tiret) est rejetée avant même d'atteindre la construction du chemin ;
- le chemin final est systématiquement recomposé sous un préfixe fixe et non négociable, `public/medias/<categorie-autorisee>/<nom-genere>`, sans jamais interpoler une chaîne reçue du client dans ce préfixe.

Un chemin en dehors de `public/medias/` n'est structurellement pas atteignable par cette API, quelle que soit l'entrée fournie.

### Sécurité des accès au dépôt

- Jeton **fine-grained Personal Access Token**, limité strictement au dépôt `site-ressources`, permission `Contents: Read and write` uniquement — pas d'accès plus large.
- Généré depuis un **compte GitHub dédié** (compte de service), pas un compte personnel, ajouté explicitement comme collaborateur du dépôt. C'est directement la précaution que demande le §14.1 : c'est l'absence de reconnaissance d'un compte comme collaborateur qui a déjà bloqué silencieusement des déploiements sur d'autres dépôts de l'association. C'est aussi l'identité qui permet à l'« Ignored Build Step » ci-dessus de reconnaître un commit de média.
- Jeton stocké comme variable d'environnement Vercel chiffrée, lu uniquement dans la fonction serverless dédiée à l'upload, jamais transmis au client.
- Les fichiers SVG sont acceptés mais assainis avant stockage (suppression de tout `<script>`/gestionnaire d'événement embarqué) — « SVG si sécurisé » du §14.

### Ce qui reste hors de ce circuit

Les documents confidentiels et pièces jointes contenant des données personnelles (candidatures bénévoles, pièces jointes d'une demande) **ne passent jamais par GitHub** — ils restent en base de données, conformément au §14.2. Deux points d'entrée d'upload distincts existeront côté API pour rendre cette séparation impossible à contourner par erreur : un pour les médias publics (circuit ci-dessus), un pour les pièces jointes confidentielles des demandes (circuit base de données, §5 ci-dessous).

---

## 5. Intégration du module Demandes

### Schéma de données (complète le schéma de l'audit, Partie C.5)

```
demandes
  id, type (enum : don_materiel | partenariat_vegetal | partenariat |
            benevolat_adhesion | evenement_atelier | contact_general),
  donnees (JSON — contenu brut du formulaire d'origine),
  statut (nouveau | à_traiter | en_cours | en_attente | traité | clôturé | spam),
  assigne_a → utilisateurs.id (nullable),
  cree_le, maj_le

demande_notes
  id, demande_id → demandes.id, auteur_id → utilisateurs.id, contenu, cree_le

demande_emails
  id, demande_id → demandes.id, auteur_id → utilisateurs.id,
  destinataire, sujet, corps,
  statut_envoi (en_cours | envoye | echec | incertain),
  brevo_message_id (nullable), erreur (nullable),
  tentative_le, confirme_le (nullable)

demande_verrous
  demande_id → demandes.id (clé primaire),
  verrouille_par → utilisateurs.id, verrouille_le, expire_le

rubrique_permissions
  role (ou utilisateur_id, nullable — une exception individuelle prime sur le rôle),
  rubrique_cle, peut_consulter, peut_repondre
```

### Correspondance rubriques ↔ types de formulaires existants

| Rubrique (demandée) | Type(s) de formulaire d'origine (audit A.8) |
|---|---|
| Don de matériel | `donMateriel` |
| Partenariat végétal | `partenaireVegetal` |
| Partenariats | `pointCollecte`, et la part « partenariat/mécénat » de `rejoindre` et `contact` |
| Bénévolat et adhésion | `benevole`, et la part « bénévolat » de `rejoindre` et `contact` |
| Événements et ateliers | `evenement` (et toute future demande liée aux ateliers) |
| Contact général | `contact` (sujets restants : achat solidaire, autre question) |

Le classement automatique (demandé) se fait donc en deux temps : le `type` brut du formulaire détermine la rubrique par défaut, et pour les deux formulaires à menu déroulant (`rejoindre`, `contact`), le choix déjà fait par le visiteur dans son menu — celui qui décide aujourd'hui de la liste Brevo (`lib/brevo.js`, `ENGAGEMENTS`/`SUJETS_CONTACT`) — décide aussi de la rubrique. Aucune double saisie, une seule logique de routage réutilisée.

**La newsletter n'entre jamais dans ce module** : son formulaire ne crée pas de ligne dans `demandes`, conformément à la demande explicite.

### Permissions configurables par rubrique *(révisé)*

Le §21 du cahier donne à **Coordination** un accès explicite aux « formulaires » ; **Communication** n'y figure pas dans sa liste actuelle. Plutôt qu'un découpage figé dans le code, les droits sont **des données** (table `rubrique_permissions` ci-dessus), modifiables depuis un écran d'administration (Utilisateurs & rôles) par le Super administrateur, sans jamais toucher au code :

- **Super administrateur** et **Coordination** : droits complets sur toutes les rubriques, non modifiables depuis cet écran (plancher garanti par le code, pas seulement par la donnée — pour qu'une erreur de configuration ne puisse jamais retirer l'accès aux deux rôles qui doivent toujours l'avoir).
- **Communication** : droits initiaux sur « Événements et ateliers » et « Partenariats » (lecture + réponse), conformément à la décision — les autres rubriques (Don de matériel, Partenariat végétal, Bénévolat et adhésion, Contact général) lui sont fermées par défaut, ouvrables plus tard d'un simple changement dans l'écran de permissions.
- **Contributeur** et **Lecture seule** : aucun accès par défaut, également modifiable par rubrique si le besoin apparaît.
- Le contrôle reste **vérifié côté serveur à chaque appel** (`rubrique_permissions` lu à chaque requête, jamais mis en cache de façon à devenir périmé), conformément au principe du §24.3 : masquer un bouton ne suffit jamais à sécuriser une action.

*Le périmètre initial de Communication ci-dessus applique littéralement la décision transmise ; à confirmer que « Partenariats » doit ou non inclure également « Partenariat végétal » — sans conséquence si la réponse est oui, un simple changement dans l'écran de permissions suffira, sans redéploiement.*

### Suivi fiable des envois d'email — éviter les doubles envois silencieux *(révisé)*

Le verrou de rédaction (`demande_verrous`) empêche deux personnes de rédiger *en même temps*. Il ne dit rien du cas soulevé à la relecture : Brevo accepte le message, mais la fonction serverless ne reçoit pas — ou ne traite pas — correctement la confirmation (coupure réseau, redémarrage de l'instance en plein appel). Le principe retenu : **ne jamais présenter un envoi comme confirmé tant que la confirmation n'a pas été reçue et lue avec certitude**, et rendre l'incertitude elle-même visible plutôt que de la masquer par une nouvelle tentative automatique qui risquerait un vrai double envoi.

`demande_emails.statut_envoi` a quatre valeurs, jamais trois :

1. **`en_cours`** — la ligne est écrite en base *avant* l'appel à Brevo (donc de façon durable, avant même que la question du réseau se pose). Tant qu'aucune réponse n'a été traitée, le statut reste ici. C'est aussi ce qui sert de verrou pratique : l'interface ne permet pas de relancer un envoi déjà `en_cours`.
2. **`envoye`** — la requête à Brevo a répondu avec succès et un identifiant de message a été renvoyé et enregistré (`brevo_message_id`). Seul ce statut déclenche l'affichage « Envoyé » et l'historique visible dans la fiche.
3. **`echec`** — Brevo a répondu par un rejet explicite (erreur 4xx/5xx claire). Message d'erreur affiché, et l'équipe peut relancer — ce qui crée une **nouvelle tentative** (nouvelle ligne), jamais une réécriture de la précédente.
4. **`incertain`** — aucune réponse exploitable n'a été reçue avant l'expiration de la requête (délai réseau, instance interrompue). C'est le cas que Brevo ne permet pas de trancher a posteriori de façon fiable : l'API n'offre pas de clé d'idempotence consultable comme le ferait un prestataire de paiement. Plutôt que de deviner, l'interface affiche clairement « Statut d'envoi incertain — nous n'avons pas reçu de confirmation. Vérifiez auprès du destinataire avant de renvoyer. », et **exige une confirmation explicite de l'utilisateur** avant de permettre un nouvel envoi. Une ligne `en_cours` non résolue après un délai raisonnable (quelques minutes) bascule automatiquement en `incertain` par la même tâche planifiée qui sert déjà aux publications programmées (§3) — pour qu'aucune fiche ne reste bloquée indéfiniment sur « en cours », et pour libérer le verrou de rédaction associé.

Ce mécanisme répond directement à la demande : jamais de confirmation affichée avant acceptation réelle par Brevo, et un état explicite pour le cas ambigu plutôt qu'un silence ou une supposition.

### Parcours utilisateur

1. **Boîte de demandes** — écran d'entrée du module : une carte par rubrique, avec le nombre de nouvelles demandes et le nombre à traiter, limitée aux rubriques auxquelles l'utilisateur a accès (voir maquette).
2. **Liste d'une rubrique** (ou vue globale toutes rubriques confondues) — filtrable par statut, par personne assignée, recherche texte.
3. **Fiche de demande** — les données du formulaire d'origine, le statut, l'assignation, les notes internes, l'historique (notes + emails envoyés, distingués visuellement), et le bouton **« Répondre par email »** (visible seulement si `peut_repondre` est vrai pour la rubrique et le rôle de l'utilisateur).
4. **Rédaction de la réponse** — un utilisateur qui ouvre la réponse **pose le verrou** (`demande_verrous`) ; toute autre personne qui tente d'ouvrir la même réponse voit « [Prénom] est en train de répondre à cette demande » et ne peut pas rédiger en parallèle (mais peut toujours consulter, assigner, ou noter). Le verrou expire automatiquement après une période d'inactivité (quelques minutes) pour ne jamais bloquer définitivement une fiche en cas de fermeture d'onglet oubliée.
5. **Envoi** — écrit d'abord la ligne `demande_emails` en `en_cours`, appelle l'API transactionnelle Brevo (`/v3/smtp/email`, même mécanisme que les notifications actuelles de `api/contact.js`, depuis l'adresse officielle), puis résout le statut réel comme décrit ci-dessus. Le verrou n'est libéré qu'une fois le statut résolu (`envoye`, `echec`, ou `incertain` confirmé par l'utilisateur) ; le statut de la demande passe automatiquement à `en_cours` seulement quand l'envoi est confirmé `envoye`.

Voir les maquettes en fin de document pour l'écran de boîte de demandes et l'écran de réponse.

---

## 6. Notifications email existantes et fonctionnement Brevo

Rien de l'existant n'est remplacé, le module Demandes **s'ajoute** au circuit actuel :

- Chaque soumission de formulaire continue de déclencher, exactement comme aujourd'hui, l'email de notification vers `contact@ressourcesrecyclerie.fr` **et** la création/mise à jour du contact dans Brevo par `api/contact.js` (`lib/brevo.js` inchangé). Le back-office ajoute simplement, dans le même appel serveur, l'écriture d'une ligne dans `demandes` — une troisième conséquence, pas un remplacement des deux premières.
- **Répondre à une demande depuis le back-office n'utilise que l'API transactionnelle de Brevo** (`/v3/smtp/email`, envoi ponctuel), jamais l'API de gestion de contacts/listes. Concrètement : répondre à une demande de don de matériel **ne crée aucun contact**, **ne l'ajoute à aucune liste**, et **ne modifie jamais** l'attribut `OPTIN_NEWSLETTER`. L'inscription à une liste de diffusion reste décidée uniquement par la case à cocher du formulaire d'origine, comme aujourd'hui (`lib/brevo.js`) — le module Demandes n'a pas de chemin d'écriture vers les listes Brevo, un choix d'architecture, pas seulement une consigne.

---

## 7. Sauvegarde, restauration et pièces jointes confidentielles *(révisé)*

### Pièces jointes confidentielles : métadonnées en base, contenu hors base

En relisant la question, stocker le contenu binaire des pièces jointes (candidature bénévole, document joint à une demande) **directement dans les lignes PostgreSQL** n'est pas la bonne option, pour deux raisons concrètes :

- chaque sauvegarde/restauration à un instant donné (PITR) recopie l'intégralité des données, y compris ces blobs — plus ils sont volumineux, plus la fenêtre de rétention réelle et le temps de restauration se dégradent, sur une base qui, par ailleurs, doit rester rapide pour l'usage quotidien du back-office ;
- ce n'est pas nécessaire : le §14.2 du cahier prévoit déjà explicitement une alternative (« la base de données du back-office, **ou un espace de stockage privé si le volume le justifie** »).

Architecture retenue : **seules les métadonnées vivent en base** (nom de fichier, type, taille, `demande_id` associée, utilisateur ayant déposé le fichier, date, politique de conservation applicable) ; **le contenu binaire est stocké dans Vercel Blob, en accès privé** — pas d'exposition publique, pas de nouveau fournisseur à intégrer (déjà dans l'écosystème Vercel du projet), accès exclusivement via une URL signée et temporaire, générée côté serveur après vérification des droits de l'utilisateur sur la demande concernée. Ce circuit reste strictement distinct de celui des médias publics (§4) : jamais de passage par GitHub, jamais d'exposition par une adresse devinable.

### Sauvegarde et restauration

| Donnée | Mécanisme | Statut |
|---|---|---|
| Base de données (contenus, brouillons, comptes, demandes, métadonnées des pièces jointes) | Restauration à un instant donné (PITR) native de Neon | à titre indicatif, les offres de ce type limitent typiquement la fenêtre PITR gratuite à une fenêtre courte (de l'ordre de 24 h) contre plusieurs jours sur les paliers payants — **le chiffre exact du palier retenu est à vérifier sur le compte réel en Étape 0**, avant tout engagement ; si la fenêtre gratuite s'avère insuffisante pour les besoins de l'association, budgéter le palier payant le plus proche qui l'assure (§43.2 de l'audit) |
| Base de données (filet secondaire) | Export logique planifié (tâche Vercel Cron à faible fréquence), stocké dans un emplacement **privé**, distinct du dépôt public `site-ressources` (dépôt GitHub privé séparé, ou stockage privé Vercel) | à mettre en place en Phase 1 |
| Pièces jointes confidentielles (contenu binaire) | Durabilité propre à Vercel Blob — niveau de garantie et politique de sauvegarde propres à ce service, **à vérifier en Étape 0** avant de considérer le sujet clos | à confirmer techniquement |
| Médias publics | Déjà versionnés et dupliqués par Git/GitHub à chaque commit — aucune sauvegarde supplémentaire nécessaire, comme le constate déjà le §28 du cahier | acquis |
| Procédure de restauration | Testée au moins une fois avant mise en production (base **et** pièces jointes Vercel Blob), documentée dans `/docs/backoffice-architecture.md` (livrable §39) | à réaliser en fin de Phase 1/avant recette |

Les métadonnées des pièces jointes restent soumises à la politique de conservation configurable du §27 (la suppression logique en base peut être accompagnée d'une suppression du fichier binaire correspondant dans Vercel Blob, dans le même geste).

---

## Plan de développement par étapes

Reprend et affine le phasage de l'audit (Partie C.8), en y intégrant le module Demandes. Étapes de développement, sans durée chiffrée à ce stade (§44.1.8) :

### Ce qui est autorisé à ce stade *(rappel)*

Seules les Étapes 0 et 1 ci-dessous (spike technique puis socle) sont autorisées pour l'instant. Les étapes suivantes (contenus, demandes, branchement du site public, finitions) restent décrites ici pour la cohérence du plan d'ensemble, mais **chacune fera l'objet d'une validation explicite avant d'être engagée** — en particulier l'Étape 4 (branchement du site public), qui inclut la migration des contenus existants et qui fera l'objet d'une validation distincte, conformément au §44.2 du cahier. **Le site public actuel et l'intégration avec Ressources 360 (`scripts/vitrine.mjs`, `/api/vitrine`) ne sont touchés par aucune de ces étapes tant que l'Étape 4 n'a pas été explicitement autorisée** : le développement du socle (Étape 1) est un ajout au projet, pas une modification de ce qui existe déjà (cohérent avec l'audit, Partie B.2).

### Étape 0 — Spike technique (avant tout développement de fonctionnalité)
Vérifier concrètement, sur le compte réel : compatibilité de Better Auth avec Vite + fonctions serverless Vercel ; fréquence exacte permise pour les Cron Jobs sur le plan actuel (§3) ; fenêtre de rétention PITR de Neon sur le plan actuel (§7) ; durabilité et modalités de sauvegarde de Vercel Blob pour les pièces jointes confidentielles (§7) ; comportement réel de l'« Ignored Build Step » pour éviter les déploiements redondants entre commits GitHub et deploy hooks (§4) ; taille limite de charge utile d'une fonction serverless Vercel. Ces six vérifications conditionnent des choix pris comme acquis plus haut — à confirmer avant de s'engager dessus.

### Étape 1 — Socle
Base de données (schéma initial), authentification (Better Auth), rôles et permissions par rubrique (§21, module Demandes), médiathèque (GitHub + sharp), paramètres généraux. Maquettage validé avec l'équipe avant d'aller plus loin (§36).

### Étape 2 — Contenus
Pages (avec pages protégées, §8.4), actualités, événements, ateliers, partenaires, points de collecte (module unique permanents/temporaires, orientation validée).

### Étape 3 — Demandes
Le module complet : classement automatique, boîte par rubrique, fiche, réponse par email, verrou, historique. Placé après les contenus (étape 2) parce qu'il réutilise le mécanisme de rôles/permissions déjà posé, mais avant le branchement du site public (étape 4) car il ne touche à aucune page publique.

### Étape 4 — Site public
Branchement progressif des pages existantes au CMS, maintien strict des URLs (§20, §31), mécanisme de publication (§2) et de programmation (§3) en conditions réelles.

### Étape 5 — Finitions et validation
Recette ergonomique avec deux utilisateurs non techniques (§37), versioning/historique, SEO, sauvegarde/restauration testée, documentation livrée (§39).

*La campagne du 3 octobre 2026 reste hors de ce plan de migration, conformément à l'orientation validée.*

---

## Maquettes des principaux écrans

Une maquette interactive (HTML, non fonctionnelle — aucune donnée réelle, aucun appel réseau) a été produite séparément pour validation visuelle : tableau de bord, boîte de demandes par rubrique, fiche de demande avec réponse par email, actualités, médiathèque, points de collecte. Voir le lien fourni avec ce document.
