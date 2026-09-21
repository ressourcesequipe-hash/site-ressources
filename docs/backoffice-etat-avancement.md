# ÉTAT D'AVANCEMENT — BACK-OFFICE (Étapes 0 et 1)

**Portée de ce document :** ce qui a été effectivement écrit et vérifié, ce qui reste à vérifier, et ce qui dépend encore d'une action de votre part. Le site public et l'intégration Ressources 360 n'ont pas été touchés — aucun fichier de `src/pages`, `src/routes.jsx` (hors ajout de la route `/admin`), `scripts/vitrine.mjs`, `prerender.js` ou `api/contact.js` n'a été modifié dans son fonctionnement existant. **Rien n'est commité ni déployé** : tout vit dans la copie de travail locale, à la demande explicite du 20/09/2026 (« on garde en local »).

---

## Étape 0 — Spike technique : soldée

| Point à vérifier | État |
|---|---|
| Compatibilité better-auth / Drizzle / Vite | **Vérifiée par lecture du code source réel** de la dépendance installée, conflits de versions résolus et verrouillés dans `package.json`. |
| `drizzle-kit generate` sur ce schéma | **Vérifié en exécution réelle** : migration SQL générée et **appliquée avec succès sur la vraie base** `ressources-backoffice` (Neon) — les 9 tables existent, vérifié par requête directe. |
| Build client existant non affecté | **Vérifié en exécution réelle** (`npm run build:client`) : succès, code admin correctement isolé dans un chunk séparé (37 Ko) jamais livré au public. |
| Comportement de `toNodeHandler` face aux fonctions Vercel | **Vérifié en conditions quasi réelles** : le vrai handler `api/auth/[...all].js` a été monté sur un serveur HTTP Node isolé et testé avec un vrai appel de connexion contre la vraie base. Résultat : `200 OK`, cookie de session `HttpOnly; SameSite=Lax` correctement posé, rôle `super_admin` renvoyé correctement. |
| Risque de conflit entre le rewrite SPA de `vercel.json` et les routes `/api/` | **Levé par la documentation officielle Vercel**, citée explicitement : « precedence is given to the filesystem prior to rewrites being applied ». Les fonctions serverless sont donc prioritaires sur le rewrite en production — le souci observé localement (voir ci-dessous) ne s'y reproduit pas. |
| Test de bout en bout via `vercel dev` (interface + API ensemble) | **Non concluant : limite connue de l'outil, pas du code.** `vercel dev` sert mal les fichiers de développement Vite (`/@vite/client`, etc. en 404) et achemine mal les requêtes `/api/` vers les fonctions locales — la documentation Vercel elle-même reconnaît des écarts de comportement entre `vercel dev` et le déploiement réel. Contourné en testant le handler d'authentification isolément (voir ligne ci-dessus), ce qui couvre l'essentiel du risque. |
| Fréquence réelle des Cron Jobs | Palier **Hobby confirmé**. Page « Cron Jobs » du projet consultée : aucune fréquence précise affichée explicitement, mais l'exemple par défaut de Vercel est quotidien, cohérent avec la limite Hobby connue (une exécution/jour). Traité comme suffisamment confirmé — l'architecture est conçue pour rester correcte même dans ce cas. |
| Fenêtre de rétention PITR de Neon | Palier **Free confirmé** : **0,5 Go de stockage, 100 heures de calcul (CU-hours) par projet** (chiffres réels relevés à la création). La fenêtre de rétention précise (Settings → Backup & Restore) n'a pas été relevée explicitement — à vérifier si le sujet sauvegarde devient prioritaire. |
| Durabilité/accès privé de Vercel Blob | Non concerné pour l'instant — nécessaire seulement à l'Étape 3 (pièces jointes confidentielles des demandes). |
| Comportement réel de l'« Ignored Build Step » | **Testé, puis MÉCANISME ABANDONNÉ le 20/09/2026.** Collé dans Vercel, il a provoqué une panne totale de déploiement (champ d'une seule ligne, script multi-lignes écrasé), et la panne a révélé un angle mort structurel : le test lit l'auteur du dernier commit, or Vercel construit la tête de branche quelle que soit la cause du déploiement. Réglage repassé en `Automatic` — voir « Panne de déploiement du 20/09/2026 » plus bas. |
| Taille limite de charge utile d'une fonction serverless Vercel | Toujours non vérifiée ; 12 Mo reste une limite de départ prudente dans `api/admin/medias/upload.js`. |

## Comptes et jetons — tous configurés (20/09/2026)

Les 8 variables sont en place dans Vercel (`ressources-recyclerie` → Environment Variables) : `DATABASE_URL`, `VERCEL_DEPLOY_HOOK_URL`, `GITHUB_MEDIA_TOKEN`, `GITHUB_MEDIA_OWNER` (`ressourcesequipe-hash`), `GITHUB_MEDIA_REPO`, `GITHUB_MEDIA_COMMITTER_EMAIL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`. Simplification actée en cours de route : le jeton GitHub est généré depuis le compte propriétaire du dépôt lui-même (déjà reconnu comme collaborateur), scopé à ce seul dépôt avec la seule permission *Contents: Read and write* — pas de second compte GitHub à créer ni à maintenir (voir `api/admin/medias/upload.js`, qui fixe l'identité de commit explicitement via l'API plutôt que via le compte authentifié).

**Non encore testé** : `GITHUB_MEDIA_TOKEN` — aucun média n'a encore été réellement envoyé vers GitHub. À faire à l'usage, ou lors d'un prochain test ciblé.

**Incident traité en cours de route** : `vercel link` a par erreur créé un second projet Vercel vide (`site-ressources`) connecté au même dépôt GitHub — supprimé par vous après confirmation, avant qu'il ne cause de déploiements en double. Le projet local est maintenant correctement lié à `ressources-recyclerie`.

## Premier compte — créé et vérifié

- **Email** : `borislalanne@gmail.com`, **rôle** : `super_admin`.
- Créé via l'API serveur réelle de better-auth (hachage du mot de passe géré par la bibliothèque, pas par du code maison), puis promu `super_admin` par une mise à jour SQL directe (la seule voie possible : le champ `role` n'est jamais modifiable via l'inscription elle-même, par conception — voir `lib/auth.js`).
- **Connexion testée avec succès** contre la vraie base (voir tableau ci-dessus).
- Mot de passe temporaire communiqué une seule fois dans la conversation ; aucun écran de changement de mot de passe n'existe encore (prévu à l'Étape 2) — à conserver dans un gestionnaire de mots de passe en attendant.

## Étape 1 — Socle (ce qui est scaffoldé)

- **Base de données** : `db/schema.js` (9 tables), migrée sur la vraie base.
- **Authentification** : `lib/auth.js`, montée sur `/api/auth/*`, **testée en conditions réelles**.
- **Permissions** : `lib/permissions.js` + table `rubrique_permissions`, amorcée avec les droits de Communication (`evenement_atelier`, `partenariat`) — vérifié par requête directe sur la base.
- **Machine à états de déploiement** : `lib/deploiement.js` — **testée en conditions réelles le 20/09/2026**, cycle complet validé après correction de deux défauts réels (boucle jamais refermée, puis réattribution d’un déploiement déjà consommé). Voir « Fermeture du cycle de déploiement » plus bas.
- **Médiathèque** : `api/admin/medias/upload.js` — **testée en conditions réelles** (voir plus bas).
- **Paramètres généraux** : `api/admin/parametres.js` — **testée en conditions réelles** (voir plus bas).
- **Espace `/admin`** : `src/admin/` (connexion, tableau de bord minimal honnête, chargement paresseux vérifié) — **rendu visuel jamais vérifié dans un navigateur** (limite d'outillage de cette session, voir Étape 0 ci-dessus), mais la logique serveur sous-jacente (authentification) l'a été directement.

## 20/09/2026 — Médiathèque et paramètres testés en conditions réelles

- **Médiathèque** (`api/admin/medias/upload.js`) : test complet réussi — image générée localement, envoyée, traitée par `sharp` (JPEG→WebP), réellement commitée sur GitHub (vérifié par une lecture séparée), ligne créée en base avec les bonnes métadonnées. Nettoyé ensuite (fichier et ligne supprimés).
- **Protection CSRF de better-auth confirmée active** : une requête de connexion sans en-tête `Origin` valide est rejetée (`MISSING_OR_NULL_ORIGIN`). Bon signe, rien à corriger.
- **« Ignored Build Step »** collé dans Vercel (Settings → Build and Deployment), en mode `Custom` avec le script fourni.
- **Paramètres généraux** (`api/admin/parametres.js`) : test complet réussi — création automatique du singleton, écriture, relecture, persistance confirmée, puis remis à vide.
- **Incident de jeton résolu** : `GITHUB_MEDIA_TOKEN` avait été créé en type `Secret`, donc illisible même par vous après coup. Un nouveau jeton a été généré et les 4 variables `GITHUB_MEDIA_*` recréées en type `Config`. L'ancien jeton (`mediatheque-backoffice`) est à supprimer côté GitHub si ce n'est pas déjà fait.
- `DATABASE_URL` reste pour l'instant en `Secret` par défaut (gérée par l'intégration Neon) — récupérée via la page Neon (« Show secret ») à chaque test. Vous avez demandé une conversion en `Config` (en cours), avec un rappel prévu pour la repasser en `Secret` une fois le projet terminé.

## 20/09/2026 (suite) — Vérification visuelle et correctif de robustesse

- **`vercel dev` abandonné comme piste de test local** : confirmé reproductible (même symptôme après mise à jour du CLI) que les fichiers de développement Vite (`/@vite/client`, etc.) ne sont pas correctement servis à travers son proxy sur ce projet. Limite d'outillage actée, non poursuivie — la logique serveur a déjà été vérifiée par ailleurs (voir plus haut).
- **Écran de connexion vérifié visuellement** avec `vite` simple : rendu fidèle à la maquette validée (palette, typographie, mise en page).
- **Bug réel trouvé et corrigé** : sans back-end disponible, l'appel de vérification de session recevait une réponse HTML au lieu de JSON, ce que le client d'authentification ne gérait pas — l'écran `/admin` plantait en page blanche plutôt que de retomber sur la connexion. Corrigé par l'ajout d'un filet de sécurité (`src/admin/components/ErreurAuth.jsx`, error boundary React) : testé, l'interface affiche maintenant un message clair avec un retour à la connexion au lieu de planter. Conforme au §24.7 du cahier (jamais laisser l'utilisateur dans l'incertitude).
- Build client revérifié après ce correctif : toujours propre, code admin toujours isolé dans son chunk séparé.

## 20/09/2026 (suite) — Fermeture du cycle de déploiement

**Défaut réel trouvé à la relecture du code, et corrigé.** `resoudreDeploiement()` existait dans `lib/deploiement.js` mais **rien ne l'appelait** : ni endpoint de cron, ni webhook, ni section `crons` dans `vercel.json`. Conséquence concrète : au premier déploiement, `etat_deploiement.statut` passait à `en_cours` et n'en ressortait jamais ; toute publication suivante se serait contentée de poser `redemande = true`, et **plus aucun déploiement n'aurait été déclenché**. Le back-office aurait cessé de publier après la première publication, sans message d'erreur.

Ce qui a été écrit pour refermer ce cycle — trois chemins, du plus réactif au plus tardif, tous passant par la même fonction :

1. **Opportuniste** — toute demande de publication commence par vérifier si le déploiement précédent est terminé (`resoudreSiTermine()`). C'est le chemin normal : sur le palier Hobby, attendre la tâche planifiée quotidienne aurait bloqué les publications jusqu'à 24 h.
2. **Manuel** — `api/admin/deploiement.js` : `GET` renvoie l'état courant pour que l'interface ne présente jamais un contenu comme en ligne avant que le déploiement ne soit `pret` (§5.5) ; `POST` est le bouton « Vérifier et publier maintenant » du §3, réservé à Coordination/Super administrateur, contrôle de droits fait côté serveur.
3. **Filet de sécurité** — `api/cron/taches.js`, déclaré dans `vercel.json` (`crons`, quotidien). Tâche unique, comme prévu par l'architecture : les publications programmées (Étape 2) et les envois Brevo restés `en_cours` (Étape 3) la rejoindront sans en créer une seconde.

**Garde-fou anti-blocage.** Au-delà de 30 minutes sans avoir pu lire l'état réel, le cycle est refermé d'office en `echec`. C'est ce qui garantit qu'aucune panne d'API Vercel, aucun jeton expiré et aucun déploiement disparu ne peut bloquer durablement la publication — la propriété qui manquait justement à la version précédente.

**Point technique tranché en lisant la documentation, à confirmer en réel** : un deploy hook Vercel répond `{ job: { id, state, createdAt } }`, où `job.id` identifie le *travail de déclenchement*, pas le déploiement `dpl_…` que manipulent l'API et les webhooks. Le rapprochement par identifiant ne pouvait donc pas fonctionner. `lib/vercel.js` retrouve le déploiement par **fenêtre temporelle** depuis `declencheLe` (avec une minute de marge d'horloge), puis mémorise le vrai `dpl_…` pour les interrogations suivantes. Ce choix est volontairement robuste aux deux issues possibles de la vérification réelle.

**Rapprochement rendu exact (20/09/2026, après constat)** : le projet a **deux deploy hooks actifs sur la même branche `main`** — `BACKOFFICE_HOOK` (le nôtre) et `VITRINE_HOOK`. La seule fenêtre temporelle aurait donc pu confondre un déploiement déclenché par l'autre hook avec le nôtre — risque documenté à l'origine comme théorique, devenu plausible. `lib/vercel.js` extrait désormais l'identifiant du hook depuis `VERCEL_DEPLOY_HOOK_URL` (dont c'est le dernier segment) et le compare à `meta.deployHookId` de chaque déploiement : rapprochement exact, sans variable d'environnement supplémentaire. La fenêtre temporelle reste en repli si Vercel ne renseigne pas cette métadonnée — moins précis, mais jamais bloquant.

**Quatre variables d'environnement nouvelles** sont nécessaires (`CRON_SECRET`, `VERCEL_API_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID`) — voir `docs/backoffice-variables-environnement.md`. Aucune n'est encore créée dans Vercel.

### Ce qui a été vérifié, et ce qui ne l'a pas été

- **Vérifié hors-ligne** : la logique de rapprochement de `lib/vercel.js` (13 contrôles avec `fetch` simulé — fenêtre temporelle, marge d'horloge, `READY`/`BUILDING`/`ERROR`/`CANCELED`, recherche par identifiant connu, liste vide, HTTP 403) ; le câblage de `lib/deploiement.js` (exports, existence réelle de chaque colonne référencée, construction des conditions SQL) ; contrôle syntaxique des quatre fichiers ; build client de non-régression (propre, chunk admin toujours isolé à 37,9 Ko).
### Vérification en conditions réelles — faite le 20/09/2026, cycle complet validé

Quatre vrais déploiements de production déclenchés et suivis de bout en bout, contre la vraie base et le vrai projet Vercel.

**Faits établis, qui n'étaient que des hypothèses documentaires :**

- **`job.id` n'est pas un identifiant de déploiement.** Réponse réelle du hook : `jVBP2KJpD3Xls3yI6hQA` — 20 caractères, sans préfixe, là où l'API et les webhooks manipulent des `dpl_…`. Ne pas s'appuyer dessus était le bon choix ; il n'est conservé que pour le journal applicatif.
- **`meta.deployHookId` est bien renseigné** par Vercel sur les déploiements issus d'un hook (`BACKOFFICE_HOOK/OEly36rt2O`), et absent sur ceux issus d'un push git. Le rapprochement exact fonctionne.
- **Un déploiement est créé ~5 secondes APRÈS l'appel au hook**, jamais avant — ce qui a permis de resserrer la marge d'horloge (voir défaut ci-dessous).
- **Durées de build réelles** : 37 s et 28 s.

**Défaut réel trouvé par ce test, et corrigé.** Au premier passage, les deux cycles ont été journalisés avec le **même** `dpl_…`, le second se refermant 13 secondes après son déclenchement — impossible pour un build de 40 s. Cause : la marge de 60 secondes en arrière faisait remonter la fenêtre du cycle 2 jusqu'au déploiement du cycle 1, et comme les deux publications passent par le **même** deploy hook, `meta.deployHookId` ne pouvait pas les distinguer l'une de l'autre. Conséquence concrète si ce n'avait pas été vu : le back-office aurait annoncé « Publié, en ligne » alors que le build correspondant tournait encore — précisément le mensonge que le §5.5 interdit. Corrigé par deux protections complémentaires : marge ramenée à 15 secondes (justifiée par la mesure réelle ci-dessus), et **exclusion des déploiements déjà attribués à un cycle refermé**, lue depuis le journal à chaque rapprochement. C'est l'exclusion qui est la garantie de fond ; la marge n'est qu'un confort.

**Scénario complet rejoué après correctif, tables remises à zéro — tous les points validés :** deux demandes rapprochées ⇒ **un seul** appel au hook et `redemande = true` ; déploiement identifié une seconde après le déclenchement, pendant qu'il construisait encore ; cycle 1 fermé en `pret` ; `redemande` relançant aussitôt un second déploiement d'**identifiant distinct** ; cycle 2 fermé en `pret` ; état final `repos`, `redemande = false`, aucun identifiant résiduel.

**Points d'entrée HTTP testés** (handlers montés sur un serveur Node local, même méthode que pour l'authentification) : `api/cron/taches.js` refuse une requête sans en-tête `Authorization` et avec un mauvais secret (401), l'accepte avec le bon (200) et exécute bien la résolution ; `api/admin/deploiement.js` refuse `GET` et `POST` sans session, ainsi qu'un cookie forgé (401) ; les droits par rôle se comportent comme le §21 le demande (Super administrateur et Coordination seuls habilités, détail technique d'erreur masqué à Communication).

**Non-régression du site public** vérifiée après ces quatre déploiements : les pages répondent en 200 avec titre, description et schema.org intacts.

**Reste non couvert** : le chemin `echec` n'a pas été exercé de bout en bout — provoquer un vrai build en échec supposait de casser volontairement la production. La correspondance `ERROR`/`CANCELED` → `echec` est couverte hors-ligne, et les deux déploiements réellement en échec de l'après-midi confirment que Vercel expose bien cet état. À éprouver en réel si l'occasion se présente sans risque.

### Panne de déploiement du 20/09/2026, diagnostiquée et résolue

**Symptôme** : deux déploiements de production en échec vers 16 h 54 (2 s chacun), alors que le dernier succès datait de la veille — plus aucun déploiement ne pouvait aboutir, ni par push ni par deploy hook.

**Cause, lue dans le journal de build** : le champ « Ignored Build Step » de Vercel est une **entrée d'une seule ligne**. Le script `scripts/ignored-build-step.sh` y ayant été collé en multi-lignes, les retours à la ligne ont été écrasés et le `if … then … fi` s'est retrouvé sans séparateurs :

```
/bin/sh: -c: line 1: syntax error near unexpected token `then'
```

Vercel a traité le code de sortie 2 comme un échec de build. Erreur reproduite à l'identique en local, ce qui confirme le diagnostic sans ambiguïté.

**Ce que la panne a révélé au passage** : les deux déploiements en échec venaient des deux commits du test de médiathèque (`2d8e8c4` ajout, `3b2ce9e` retrait), tous deux signés `Médiathèque Ressources <mediatheque@ressourcesrecyclerie.fr>`. **La tête de `origin/main` est donc un commit de média** — exactement le cas où l'angle mort du script mordait. Ce n'était plus une hypothèse.

**Décision prise le 20/09/2026 : l'« Ignored Build Step » est abandonné.** Le réglage Vercel est repassé en `Automatic`.

- *Ce qu'il apportait* : éviter un build lors d'un ajout de média sans publication derrière.
- *Ce qu'il risquait* : ignorer le build d'une publication, silencieusement — le §5.5 du cahier à l'envers. Et il avait déjà provoqué une panne totale de déploiement.
- *Ce qu'on perd* : un upload de média déclenche désormais un build ; si une publication suit, deux builds au lieu d'un. Sans conséquence au rythme de publication de l'association, sur un palier Hobby.
- *Ce qu'on gagne* : plus aucun mécanisme ne peut ignorer le build d'une publication. La question « l'étape est-elle exécutée pour un deploy hook ? » est close, pas reportée.
- *Contrainte découverte au passage* : Vercel limite cette commande à **256 caractères**, ce qui excluait de toute façon la version instrumentée (357 caractères).

**Écart assumé au §4 de l'architecture validée**, qui prescrivait ce mécanisme — noté dans ce document et signalé dans l'architecture. Piste plus propre si le volume de builds devenait un jour un sujet : `[skip ci]` dans le message des commits de média, décidé dans `api/admin/medias/upload.js` — par commit plutôt que par règle globale, donc sans effet de bord sur les publications. À vérifier en réel le jour où ce sera utile ; rien ne presse.

## Ce qui manque encore pour considérer l'Étape 1 terminée

- ~~Regénérer `CRON_SECRET`~~ — **décision du 20/09/2026 : conservée en l'état**, en connaissance de cause. La valeur a été composée à la main (30 caractères, 17 distincts, minuscules et symboles, sans majuscule ni chiffre) : moins d'entropie réelle que sa longueur ne le suggère, mais elle protège un endpoint qui ne fait que refermer un cycle de déploiement, sans accès aux données ni aux comptes. À reconsidérer si cette tâche planifiée se voit confier des traitements plus sensibles (Étape 3, envois Brevo).
- **Type des variables — tranché le 20/09/2026.** `VERCEL_API_TOKEN` a été recréée en type `Config` (vérifié : relisible, 60 caractères) car elle sert à chaque test local et n'est récupérable nulle part une fois créée ; elle expire le 20/09/2027, à renouveler avant. Les trois autres restent délibérément en type `Secret` : `DATABASE_URL` est gérée par l'intégration Neon et la recréer à la main casserait sa mise à jour automatique ; `VERCEL_DEPLOY_HOOK_URL` se recopie à tout moment depuis Settings → Git → Deploy Hooks ; `BETTER_AUTH_SECRET` signe les sessions et n'a aucune raison d'être lisible. Pour un test local, ces trois-là passent par un fichier temporaire supprimé aussitôt après.
- **Tester la tâche planifiée dans son vrai environnement** : Vercel appelant lui-même `/api/cron/taches` avec l'en-tête `Authorization` qu'il injecte. C'est la seule chose qu'aucun test local ne peut couvrir — elle suppose donc un déploiement du back-office.
- Décider du sort de `scripts/ignored-build-step.sh`, devenu sans usage (le mécanisme est abandonné) : à supprimer, ou à conserver uniquement si la piste `[skip ci]` est reprise un jour.
- ~~Appliquer la migration `0001`~~ — **fait le 20/09/2026**, voir ci-dessous.

## 20/09/2026 — Contrôle du schéma d'authentification : deux écarts réels trouvés et corrigés

Le résidu « régénérer le schéma avec `npx @better-auth/cli generate` » a été traité, mais **autrement que prévu** : ce CLI est publié en version 1.4.21 et marqué *« no longer supported »*, soit trois versions mineures de retard sur la bibliothèque réellement installée (1.7.5). L'utiliser aurait risqué de signaler des champs inexistants en 1.7.5, ou d'en rater de nouveaux.

Méthode retenue à la place, plus fiable car liée à la version exacte installée : interroger `getAuthTables(auth.options)`, exporté par `better-auth/db`, et comparer champ par champ avec le schéma Drizzle. La comparaison porte sur la **clé JavaScript** de chaque colonne, pas sur son nom SQL — c'est par elle que l'adaptateur Drizzle fait la correspondance, ce qui autorise le `snake_case` côté base.

**Résultat** : `user` (7 champs), `session` (7) et `account` (12) conformes. **`verification` ne l'était pas** : `createdAt` et `updatedAt` sont déclarés requis par better-auth, mais la reconstitution manuelle les avait laissés nullables. Sans conséquence aujourd'hui — cette table n'est utilisée par aucun flux actif — mais elle le deviendra avec l'écran de changement de mot de passe prévu à l'Étape 2, qui passe par ce mécanisme.

Corrigé dans `db/schema.js`, conformité revérifiée (aucun écart restant), et migration générée : `db/migrations/0001_free_namorita.sql`, deux `ALTER TABLE` sur la seule table `verification`. **Pas encore appliquée sur la base** — à faire au prochain accès à `DATABASE_URL`. La table étant vide, l'application est sans risque.

### Migration appliquée, et deux pièges découverts en la posant

La migration `0001` est **appliquée et vérifiée sur la vraie base** : `verification.created_at` et `verification.updated_at` sont désormais `NOT NULL`, le registre compte 2 migrations, les 9 tables sont intactes. Deux obstacles ont dû être levés au passage, tous deux latents et qui auraient piégé n'importe qui plus tard :

1. **`drizzle-kit migrate` ne peut pas fonctionner sur ce projet.** Il enveloppe les migrations dans une transaction, or le pilote HTTP de Neon — choisi précisément parce qu'il fonctionne en serverless sans pool de connexions (`lib/db.js`) — ne sait pas en ouvrir : « can only connect to remote instances through a websocket ». Le script `db:migrate` documenté dans `package.json` était donc inopérant depuis le début. Remplacé par `scripts/migrer.mjs`, qui utilise `drizzle-orm/neon-http/migrator`, le migrateur prévu pour ce pilote. Testé : applique bien la migration, et ne fait rien au second passage. `db:generate` reste sur drizzle-kit, qui ne touche pas à la base.
2. **Le registre de migrations n'avait jamais été initialisé.** Les 9 tables existaient bien (migration 0000 appliquée le 19/09), mais `drizzle.__drizzle_migrations` était vide : le migrateur a donc tenté de **recréer toutes les tables**, échouant sur `relation "account" already exists`. Corrigé en consignant la migration 0000 comme déjà appliquée (hash SHA-256 du fichier, horodatage repris du journal), avant d'appliquer la 0001. À retenir : appliquer une migration autrement que par `npm run db:migrate` laisse la base et son registre désynchronisés.

## 20/09/2026 — Premier déploiement, et un défaut que seul le déploiement pouvait révéler

Les cinq commits du socle ont été poussés sur `main` et déployés. Deux constats immédiats :

**La conclusion de l'Étape 0 sur le rewrite SPA était incomplète.** Elle retenait de la documentation Vercel que « la priorité est donnée au système de fichiers avant application des rewrites », et en concluait que les routes `/api/` seraient servies correctement. Vérifié en production : c'est vrai pour les fonctions à **chemin concret** — `/api/contact`, `/api/admin/parametres`, `/api/admin/deploiement`, `/api/cron/taches` répondent toutes en JSON. Ce ne l'est **pas** pour une route **dynamique catch-all** : tout `/api/auth/*` tombait sur le rewrite `/(.*)` → `/index.html` et renvoyait le HTML du site. L'authentification était donc entièrement hors service en production, sans qu'aucun test local n'ait pu le montrer.

Corrigé en excluant les chemins `/api/` du rewrite : `"source": "/((?!api/).*)"`. Les 4 redirections 301 et la déclaration du cron sont inchangées ; seuls les chemins commençant par `api/` cessent d'être réécrits, ce qui ne modifie le comportement d'aucune page publique.

**La route « catch-all » de better-auth ne couvrait qu'un seul segment.** Une fois le rewrite corrigé, `/api/auth/get-session` et `/api/auth/ok` répondaient bien en JSON — mais `/api/auth/sign-in/email` renvoyait le `NOT_FOUND` de Vercel, tout comme n'importe quel chemin à deux segments ou plus. Vercel ne résolvait donc pas `api/auth/[...all].js` comme un vrai catch-all, alors que le nom de fichier est correct sur disque comme dans le dépôt. Or better-auth a besoin de chemins à plusieurs segments (`sign-in/email`, `sign-up/email`, `callback/…`) : **la connexion était structurellement injoignable**, et c'est ce qui a fait échouer la première tentative de connexion réelle. Corrigé par une réécriture explicite dans `vercel.json`, placée avant celle du site : `/api/auth/(.*)` → `/api/auth/[...all]?__auth=$1`, le chemin d'origine étant transmis en paramètre.

**Le corps des requêtes POST était consommé avant d'atteindre better-auth.** Risque signalé dès l'écriture du handler (« à confirmer en conditions réelles »), confirmé : le runtime Node de Vercel parse le JSON entrant dans `req.body`, ce qui vide le flux que `toNodeHandler` allait lire. Une requête GET ne le révèle pas ; toute connexion, si. Le handler appelle désormais directement `auth.handler` (interface Request/Response native) et reconstruit la requête depuis `req.body` quand il est déjà rempli, depuis le flux brut sinon. Testé localement contre la vraie base, en simulant les deux comportements de la plateforme : connexion acceptée, `super_admin` renvoyé, cookie `HttpOnly; SameSite=Lax` posé, mauvais mot de passe refusé en 401.

**Fausse piste écartée** : le serveur de test local fait apparaître un avertissement de better-auth sur l'impossibilité de déterminer l'IP du client pour la limitation des tentatives. Vérification faite dans le code de la bibliothèque : `ipAddressHeaders` vaut déjà `x-forwarded-for` par défaut, en-tête que Vercel renseigne. L'avertissement est donc un artefact du test local, pas un défaut de configuration — à confirmer tout de même dans les journaux d'exécution de production, sans rien changer d'ici là. À savoir si le sujet revient : sans `trustedProxies` configuré, better-auth renonce à identifier l'IP dès que `x-forwarded-for` contient plusieurs adresses.

**Le déclenchement Git peut être très lent.** Le push de 16:38 UTC n'a produit son déploiement qu'environ quinze minutes plus tard. Entre-temps, ni déploiement, ni statut de commit publié par Vercel, alors que GitHub avait bien émis l'événement — ce qui a fait conclure à tort à une liaison rompue, et conduit à un déploiement CLI de contournement inutile (doublon sans conséquence). À retenir : avant de diagnostiquer une liaison Git cassée, laisser un délai franc. Le statut de commit GitHub est ensuite bien passé à `success`, et la liaison est saine.

### Vérification complète en production — 20/09/2026, tout passe

Après les deux correctifs, contrôlé directement contre `https://www.ressourcesrecyclerie.fr` :

- **Connexion réelle** : acceptée, rôle `super_admin` renvoyé, cookie de session `HttpOnly; Secure; SameSite=Lax`.
- **La session ouvre bien les portes** : `/api/auth/get-session` reconnaît l'utilisateur, `/api/admin/deploiement` et `/api/admin/parametres` répondent en 200.
- **Sans session, tout reste fermé** : 401 sur les deux endpoints admin.
- **Déconnexion** acceptée.
- **Tâche planifiée** (`/api/cron/taches`) : refuse sans en-tête `Authorization` et avec un mauvais secret, s'exécute avec le bon, lit l'état de déploiement en base et le renvoie correctement.
- **Site public intact** : pages en 200 avec leurs titres.
- **Connexion confirmée depuis le navigateur** par l'utilisateur, en plus des tests automatisés.

**Mot de passe du compte super administrateur changé** le 20/09/2026, à la demande de l'utilisateur, le mot de passe généré à la création étant trop difficile à saisir. Posé en base avec le hachage de better-auth (`ctx.password.hash`), vérifié localement puis par une connexion réelle en production. La demande initiale portait sur un mot de passe à 4 chiffres : impossible sans abaisser `minPasswordLength` (12) dans `lib/auth.js`, ce qui a été écarté — `/admin` étant désormais public et ce compte contrôlant l'ensemble du back-office. Un mot de passe simple à taper de 14 caractères a été retenu à la place. L'écran de changement de mot de passe reste à faire à l'Étape 2.

**Tâche planifiée confirmée de bout en bout** (20/09/2026, 21 h 43). La page « Cron Jobs » du projet liste bien `/api/cron/taches` avec la cadence `0 4 * * *`, fonctionnalité `Enabled`. Déclenchée depuis le bouton `Run` de cette page, elle répond **200** dans les journaux d'exécution, sur l'hôte du déploiement : **Vercel injecte donc bien l'en-tête `Authorization` avec `CRON_SECRET`**, et le contrôle de `api/cron/taches.js` l'accepte. C'était le seul maillon qu'aucun test local ne pouvait couvrir, et le motif même de ce déploiement.

Les journaux montrent aussi, sur l'hôte `www.ressourcesrecyclerie.fr`, les deux `401` puis le `200` des tests de protection menés juste avant — sans en-tête, avec un mauvais secret, puis avec le bon.

**Palier Hobby désormais confirmé explicitement** : la page Cron Jobs affiche « Cron jobs on Hobby have a flexible time window of 1-hour ». L'Étape 0 ne l'avait déduit que par recoupement ; c'est maintenant écrit noir sur blanc. La conception, qui suppose déjà le scénario le plus défavorable, reste valable — et la vérification opportuniste à chaque publication reste le chemin normal, la tâche planifiée n'étant qu'un filet.

**L'Étape 1 (socle) est donc terminée et vérifiée en conditions réelles, en production.**

## 20/09/2026 — Faille trouvée juste après la mise en ligne : l'inscription était ouverte

**N'importe qui sur internet pouvait se créer un compte sur le back-office.** better-auth expose `/api/auth/sign-up/email` dès que `emailAndPassword` est activé, et la configuration ne fermait pas cette porte. Vérifié contre la production : la requête était acceptée et ne tombait que sur la longueur du mot de passe (`PASSWORD_TOO_SHORT`) — avec un mot de passe conforme, le compte aurait été créé.

Le compte obtenu aurait porté le rôle `lecture_seule`, donc sans droit de modification, mais avec accès en consultation à l'intérieur du back-office. Le §21 du cahier ne prévoit à aucun moment d'auto-inscription : les comptes sont créés par le Super administrateur.

Corrigé par `disableSignUp: true` dans `lib/auth.js`, vérifié en local : la requête est désormais refusée avec `EMAIL_PASSWORD_SIGN_UP_DISABLED`. **À vérifier de nouveau en production dès le déploiement de ce correctif.**

Cette faille n'existait que depuis la mise en ligne de `/admin` le jour même, et le trou est resté ouvert environ une heure.

## 20/09/2026 — Étape 2 : écran de changement de mot de passe

Premier écran de l'Étape 2, traité en priorité parce que `/admin` est désormais public et que le mot de passe du compte super administrateur ne pouvait être changé que par un script.

`src/admin/pages/MotDePasse.jsx`, accessible depuis la barre latérale. **Aucune route d'API propre au projet** : better-auth expose déjà `change-password`, qui vérifie l'ancien mot de passe, applique le minimum de 12 caractères et gère le hachage — en écrire une aurait réimplémenté moins bien ce que la bibliothèque fait déjà (§26). Les codes d'erreur sont traduits en français et affichés près du champ concerné (§24.4), avec validation en direct (caractères restants, concordance des deux saisies) et une case « me déconnecter des autres appareils » cochée par défaut.

`ProtectedRoute` porte désormais le titre par route, comme son propre commentaire le prévoyait à l'arrivée d'un deuxième écran.

**Vérifié de bout en bout en local, dans un navigateur, réellement connecté** : rendu conforme à l'identité du site, bouton désactivé tant que la saisie est incomplète, mauvais mot de passe actuel rejeté avec un message clair, changement accepté, message de succès, champs vidés. Puis confirmé en base : connexion avec le nouveau mot de passe acceptée, ancien refusé. Compte de test créé pour l'occasion puis supprimé (un seul compte en base à l'arrivée).

## 20/09/2026 — Un environnement de développement local qui fonctionne enfin

`scripts/dev-backoffice.mjs` (`npm run dev:backoffice`) fait tourner Vite **et** les vraies fonctions de `api/` sur le même port. Il comble la limite d'outillage traînée depuis le 19/09 : `vercel dev` ne servait pas correctement les fichiers de développement de Vite sur ce projet, ce qui obligeait à déployer pour voir le moindre écran — et a coûté cher le 20/09, plusieurs défauts n'ayant été découverts qu'en production.

Il imite volontairement les deux comportements de Vercel qui nous avaient piégés : corps JSON parsé dans `req.body` (flux vidé), et aides `res.status()` / `res.json()`. Il résout les routes comme Vercel : fichier exact, puis `[...nom].js` du répertoire le plus proche — **y compris à plusieurs segments**, ce que la plateforme ne fait pas nativement et que la réécriture de `vercel.json` compense en production.

`vercel dev` est retiré de `.claude/launch.json`, remplacé par cette configuration.

## Étape 2 — Contenus : modules livrés

Quatre modules sur six, chacun avec schéma, logique métier vérifiable sans base, API et deux écrans, testés en local contre la vraie base.

| Module | §  | Contrôles | Arbitrage notable |
|---|---|---|---|
| Actualités | 9 | 27 unitaires + 33 intégration | Schéma conçu pour accueillir sans perte les 11 articles existants (5 types de blocs, cadrage d'image) |
| Événements | 10 | 21 + 21 | Les statuts du §10 mêlaient publication et cycle de vie : séparés, l'état « à venir / en cours / terminé » se déduit des dates |
| Partenaires | 12 | 10 + 9 | Le statut de partenariat est un suivi interne, jamais publié et absent de la liste |
| Points de collecte | 13 | 17 + 16 | Même principe que les événements ; seule la fermeture temporaire est un geste humain, avec motif obligatoire |
| Ateliers | 11 | 12 + 19 | Seul module dont les catégories sont administrables, comme le §11 l’exige : table dédiée, écran de gestion, amorçage automatique avec les exemples du cahier |
| Pages | 8 | 13 + 14 | Pages juridiques du §8.4 : liste confirmée par l’association, figée dans le code, avec parcours de validation obligatoire |

**Socle commun** (`lib/contenus.js` pour les règles pures, `lib/module-contenu.js` pour la fabrique de gestionnaire HTTP) : statuts, transitions selon le rôle, verrou optimiste, historique et déclenchement du déploiement sont écrits une fois. Une route de module fait désormais 70 à 90 lignes de configuration. Le socle porte déjà la règle du §8.4 sur les pages protégées, dont le module Pages aura besoin.

**Deux constats de conception relevés en chemin :**

- L'éditeur de blocs proposait des types que le serveur écartait en silence. Il est désormais piloté par la même source que le serveur — l'interface ne peut plus proposer ce qui sera refusé.
- **Un compte ayant modifié du contenu ne peut pas être supprimé** : la clé étrangère de `versions` l'interdit. C'est le bon comportement — l'historique ne doit pas perdre son auteur — mais l'écran Utilisateurs & rôles devra donc **désactiver** un compte plutôt que le supprimer.

**L’Étape 2 est complète : les six modules sont livrés.**

**Pages juridiques (§8.4) — liste confirmée par l’association le 21/09/2026** : mentions légales, politique de confidentialité, effacement des données, garanties du matériel reconditionné. Ces slugs sont figés dans `lib/pages.js`, pas en base : une protection désactivable depuis l’interface n’en serait pas une. Une case permet d’en protéger une de plus, jamais d’en déprotéger une de la liste.

**Le parcours d’une page juridique, tel qu’il est appliqué :** création ou modification → « à valider » → publication. Trois défauts ont été trouvés par les tests, à trois corrections d’intervalle, et méritent d’être notés parce qu’ils portaient tous sur la même règle lue trop vite :

1. Enregistrer une page juridique déjà publiée en la laissant publiée contournait la validation — le contrôle sortait sur le raccourci « même statut ».
2. La correction, trop stricte, rendait ces pages **impossibles à publier du tout**. Le §8.4 impose une étape de validation, pas une interdiction : seule la transition venant de « à valider » met en ligne.
3. À la création, le contrôle s’exécutait **avant** le calcul du slug — or c’est le slug qui dit si la page est juridique. Une page pouvait donc être créée directement publiée.

Aucun de ces trois défauts n’était visible à la lecture du code ; chacun a été révélé par un test qui exerçait le parcours réel.

**Sur les catégories d’ateliers** : une catégorie ne se supprime pas, elle se désactive. Une suppression laisserait des fiches rattachées à une catégorie disparue et ferait perdre l’information sans retour possible (§24.7). Le nombre d’ateliers concernés est affiché à côté de chacune, pour qu’on sache ce qu’on déplace avant d’agir. La clé technique n’est jamais modifiée par un renommage : changer un libellé est sans conséquence sur les rattachements.

## 20/09/2026 — Incident : des données réelles supprimées par un script de test

**Ce qui s'est passé.** Les scripts de nettoyage exécutés après chaque série de tests faisaient `db.delete(table)` sans condition — c'est-à-dire un vidage complet de la table. Appliqué à `actualites` et à `versions`, cela a supprimé, en plus des données de démonstration, **un article de test créé par l'utilisateur depuis le back-office en production**, ainsi que tout l'historique des modifications.

**Gravité réelle.** Faible : l'article était un essai, et la base ne contenait aucun contenu de production. **Gravité potentielle : élevée.** Le même script, exécuté une fois les vrais contenus saisis, aurait détruit du travail irremplaçable — exactement ce que le §24.7 demande d'empêcher. La base de travail étant la base de production, il n'existe aucun filet.

**Règle adoptée, à ne plus enfreindre :**

1. Un script de test ne supprime **jamais** une table entière. Il supprime uniquement les lignes qu'il a lui-même créées, désignées par leur identifiant ou par un marqueur explicite.
2. Les comptes et contenus de test portent un préfixe reconnaissable (`tst-`, `tev-`, `visuel-`, ou un slug commençant par `test-`), et le nettoyage filtre dessus.
3. Aucune instruction `delete` sans clause `where` dans un script touchant la base de production, quelle que soit la table.

**Ce que cela dit du dispositif, au-delà du script.** Tant qu'il n'y a qu'une seule base, tout test se fait sur les données réelles. Deux pistes à arbitrer avant que l'équipe ne saisisse du contenu pour de bon : une base de développement séparée (Neon permet de créer une branche de base de données, ce qui serait l'option la plus propre), ou à défaut un export logique régulier, déjà prévu au §7 de l'architecture mais pas encore mis en place.

## `VITRINE_HOOK` — réponse obtenue le 20/09/2026, et ce qu'elle implique

**C'est Ressources 360 qui l'appelle** : à chaque mise en vente d'un produit, pour rafraîchir la page Boutique du site. Des déploiements de production partent donc **automatiquement, à des moments imprévisibles, sans que le back-office en sache rien**. Quatre conséquences :

- **Le rapprochement exact par `meta.deployHookId` n'est pas une précaution théorique, il est nécessaire.** Sans lui, un déploiement vitrine tombant dans la même fenêtre qu'une publication serait confondu avec elle. C'est protégé et vérifié.
- **L'exposition des médias de brouillon devient immédiate en pratique.** Le §4 de l'architecture assumait qu'une image liée à un brouillon puisse devenir accessible à son adresse directe « si un déploiement a lieu entretemps pour une autre raison ». On sait maintenant que cet « entretemps » est fréquent, pas exceptionnel : le fichier est en ligne dès la prochaine mise en vente d'un produit. L'analyse reste valable (fichier non référencé, non indexé, non listé), mais l'hypothèse doit être lue comme « exposition quasi immédiate », pas « improbable ».
- **Cela conforte l'abandon de l'« Ignored Build Step »** : éviter un build déclenché par un ajout de média était un gain marginal, sur une production qui se reconstruit déjà à chaque mise en vente.
- **Le journal `deploiements` du back-office ne verra jamais les déploiements vitrine.** L'interface ne devra donc pas prétendre lister « tous les déploiements », seulement ceux qu'elle a elle-même déclenchés.

## Autres résidus traités le 20/09/2026

- **Copie locale remise à niveau** sur `origin/main` en avance rapide (les deux commits de médiathèque). Vérifié : aucune différence de contenu de fichiers, travail non versionné intact.
- Supprimer l'ancien jeton GitHub `mediatheque-backoffice` (orphelin, remplacé par un second jeton).
- `vercel@59.23.2` installé globalement a cassé l'authentification CLI locale — `.claude/launch.json` épingle maintenant `vercel@56.4.0` via `npx` pour contourner. Non bloquant, mais à savoir si `vercel dev` est retenté un jour.

## Rappel de sécurité

La chaîne de connexion à la base est apparue partiellement dans cette conversation lors d'un incident de copier-coller PowerShell. **Recommandé** : régénérer le mot de passe de la base depuis Neon (`ressources-backoffice` → Settings → Reset password) à l'occasion — l'intégration Vercel met à jour `DATABASE_URL` automatiquement quand vous le faites.

## 21/09/2026 — Étape 3 : module Demandes (boîte, verrou, suivi des envois)

**Ce qui est livré.** Quatre tables (`demandes`, `demande_notes`, `demande_emails`, `demande_verrous`), une route unique `api/admin/demandes.js`, deux écrans (boîte et fiche), et le balayage périodique ajouté à la tâche planifiée existante — sans en créer une seconde. Huit fonctions serverless sur les douze autorisées.

**65 vérifications en conditions réelles**, sur la vraie base, plus 13 tests unitaires sur les règles pures. Le script de test crée trois comptes préfixés et ne supprime que les lignes dont il a l'identifiant — règle du 20/09 appliquée, base vérifiée vide après coup.

### Le routage : une seule décision côté visiteur

La rubrique ne se choisit pas, elle se déduit du formulaire rempli et, pour « Contact » et « Nous rejoindre », de l'option du menu déroulant — **la même option qui décide déjà de la liste Brevo**. Deux conséquences d'une seule décision, donc jamais de demande classée d'un côté et de contact rangé de l'autre. Un test compare d'ailleurs les deux routages option par option, pour que l'écart se voie s'il apparaît un jour.

`optionsNonRoutees()` existe pour la même raison : ajouter une option aux menus de `lib/brevo.js` sans la router ici ferait silencieusement tomber la demande dans « Contact général ». Le test le signale au moment où l'oubli est commis.

**Un arbitrage à confirmer** : « Don de plantes ou végétaux » (menu Contact) part dans *Partenariat végétal*, pas dans *Don de matériel*. C'est la filière végétale qui traite les deux, alors que « Don de matériel » désigne l'informatique.

### Pourquoi quatre statuts d'envoi et non trois

Un email parti ne revient pas. L'architecture prévoyait `en_cours | envoye | echec` ; il en manquait un. Brevo peut accepter un message sans que sa réponse nous parvienne — coupure réseau, fonction serverless interrompue. Classer ce cas en « échec » invite à renvoyer, donc à écrire deux fois à la même personne ; le classer en « envoyé » risque le silence. **`incertain` nomme l'ignorance au lieu de la masquer**, bloque toute relance, et demande à l'équipe de trancher après avoir regardé la boîte d'envoi.

Trois règles en découlent, appliquées dans `lib/envoi-reponse.js` : la ligne de suivi est écrite **avant** l'appel à Brevo ; une panne réseau ne se confond jamais avec un refus de Brevo ; aucun envoi incertain n'est relancé automatiquement.

Un envoi resté `en_cours` est requalifié en `incertain` à l'ouverture de la fiche, pas seulement par le cron : sur le palier Hobby la tâche ne passe qu'une fois par jour, ce qui bloquerait la demande vingt-quatre heures. Même schéma à deux chemins que le cycle de déploiement.

### Le verrou est actif, pas optimiste

Contrairement aux contenus, une écriture concurrente ne se rattrape pas ici. Le verrou se prend **avant** la rédaction — signaler le conflit au moment de l'envoi arriverait trop tard, le message est déjà écrit. Il expire au bout de dix minutes pour qu'un onglet laissé ouvert ne bloque jamais une demande, et se relâche quand on quitte l'écran.

### Trois défauts trouvés par les tests

1. **Le contrôle de cadence ne déclenchait jamais seul.** Il ajoutait 2 points à un score dont le seuil est 3 : une rafale de messages anodins passait intégralement. Corrigé avec deux niveaux — cinq envois en dix minutes depuis la même origine *signalent* (2 points), douze *classent* (seuil atteint). Cinq envois, c'est ce que produit une mairie ou une école dont tous les postes sortent par la même adresse ; douze, plus aucune explication ordinaire ne tient. Aucun envoi n'est jamais refusé, seulement classé : une erreur de jugement coûte un clic, pas une demande perdue.
2. **Les coordonnées des visiteurs partaient dans les journaux Vercel.** Drizzle recopie les **paramètres** de la requête dans le message de ses erreurs : journaliser `e.message` après un échec d'insertion aurait écrit le nom, l'email, le téléphone, la commune et le message du visiteur dans les logs — exactement ce que le §16 interdit. Vérifié en provoquant l'échec, pas supposé. `messageSansDonnees()` retire la section `params:` de Drizzle et les `Key (colonne)=(valeur)` de Postgres, les deux seuls endroits où des valeurs se glissent dans un message ; le nom de la requête et des colonnes reste, il suffit au diagnostic. Appliqué aux trois points de journalisation (`api/contact.js`, `api/admin/demandes.js`, `lib/envoi-reponse.js`).

   *Ce que cela dit au-delà du correctif* : « ne pas journaliser de données personnelles » ne s'obtient pas en écrivant des `console.error` prudents. La fuite ne venait pas de ce qu'on écrivait, mais de ce que la bibliothèque avait déjà mis dans l'objet d'erreur.

3. **`rubrique_permissions` n'avait pas de contrainte d'unicité.** Deux lignes contradictoires pour le même rôle et la même rubrique étaient acceptées, et c'est l'ordre de lecture qui décidait qui avait le droit de répondre — autrement dit le hasard. Deux index uniques partiels ajoutés (migration 0008), partiels parce qu'en SQL deux `NULL` ne sont pas égaux et qu'un index ordinaire laisserait passer tous les doublons de règles de rôle.

### Données personnelles (§16)

L'adresse IP **n'est pas conservée** : seule une empreinte salée l'est, qui suffit à reconnaître un même expéditeur. Les journaux ne portent que l'identifiant de la demande, jamais son contenu. `donnees` garde le formulaire d'origine intact — les colonnes `nom`, `email`, `commune`, `message` n'en sont que des copies pour la liste et la recherche, jamais la source affichée.

L'export CSV neutralise les cellules commençant par `=`, `+`, `-` ou `@`, qu'Excel interpréterait comme des formules — ces valeurs viennent d'un formulaire public.

### Ce qui reste avant que la boîte serve à quelque chose

- **Le champ piège anti-robot** est lu s'il existe, mais l'ajouter aux formulaires suppose de toucher à `src/pages` — non fait.
- Le formulaire lui-même reste non modifiable depuis le back-office, conformément au §15.

### `api/contact.js` : le branchement, validé et appliqué le 21/09/2026

**19 lignes ajoutées, aucune retirée.** Le bloc s'exécute après l'email à l'équipe et après la mise à jour du contact Brevo : les deux conséquences historiques d'un envoi de formulaire sont intactes et se sont déjà produites quand on l'atteint. L'enregistrement de la demande est une troisième conséquence, pas un remplacement.

L'import est dynamique et conditionné à `DATABASE_URL` : sans cette variable, le module de base de données n'est même pas chargé et le formulaire se comporte exactement comme avant.

**Vérifié en conditions réelles** (13 contrôles, Brevo intercepté, base réelle) : un formulaire rempli déclenche bien les trois effets ; la newsletter n'en crée toujours aucun ; le routage par menu déroulant aboutit aux bonnes rubriques.

**Et la promesse la plus importante, testée pour de vrai** : avec une base délibérément injoignable, le visiteur reçoit `200 {ok:true}`, l'email part, le contact Brevo est mis à jour, et l'incident n'existe que dans les journaux. C'est ce test qui a révélé la fuite de données personnelles décrite plus haut.

## 21/09/2026 — Base de développement séparée (enfin)

Depuis le début, tous les tests tournaient sur la base de production. L'incident du 20/09 l'a montré : il n'existait aucun filet. C'est réglé.

**Branche Neon `dev`**, créée depuis `main` en copie-sur-écriture (instantanée, sans coût de stockage tant qu'elle ne diverge pas), avec **auto-suppression désactivée** — le réglage par défaut était « After 1 day », ce qui aurait fait disparaître la branche du jour au lendemain sans prévenir.

- `main` : `br-long-water-b2tlo9tm` — production, alimentée par Vercel
- `dev` : `br-calm-poetry-b22ie2a0` — développement local, `.env.local`

**Comment vérifier sur quelle branche on travaille**, sans comparer des chaînes de connexion qui se ressemblent : Postgres expose l'information côté Neon.

```sql
select current_setting('neon.branch_id', true);
```

C'est le seul contrôle fiable au moment de la création : les deux bases sont alors rigoureusement identiques, donc comparer les données ne prouverait rien.

**Les 93 vérifications de l'Étape 3 ont été rejouées sur `dev`** : 15 unitaires, 65 sur l'API, 13 sur le chemin public. Aucun échec.

### Conséquence sur les migrations — à ne pas oublier

`scripts/migrer.mjs` s'exécute à la main et lit `.env.local` : **il n'atteint donc plus la production**. Le déploiement Vercel n'applique aucune migration non plus.

Toute nouvelle migration suit désormais deux temps :

1. générée et appliquée sur `dev`, testée ;
2. appliquée sur `main` **explicitement**, avec la chaîne de production, une fois validée — avant ou avec le déploiement qui en dépend.

Oublier le second temps déploierait du code attendant des colonnes absentes. Les migrations 0007 et 0008 sont déjà sur les deux branches : `dev` a été créée après leur application.

C'est un manque du §7 de l'architecture, qui décrit les sauvegardes mais pas la procédure de migration en production. À trancher avant le branchement du site public, qui en apportera d'autres.

### À refaire plus tard

`dev` contient aujourd'hui une copie intégrale des données — sans conséquence : un compte, deux lignes de permissions, aucune demande. **Le jour où la boîte contiendra de vraies demandes**, avec des noms et des emails de visiteurs, cette branche devra être recréée avec l'option « Branch & anonymize data » : dupliquer des données personnelles dans une base de test n'aurait aucune justification (§27).

## 21/09/2026 — Confrontation des schémas au contenu réel du site (avant Phase 3)

Avant d'écrire la moindre migration, les données codées en dur du site ont été confrontées aux schémas de l'Étape 2. C'était la question ouverte depuis trois jours : ces schémas ont été conçus pour accueillir l'existant sans perte, sans que ce soit jamais vérifié.

### Deux fichiers ne sont pas ce qu'on croyait

- **`src/data/carte.js`** n'est pas du contenu : un tracé SVG d'épingle et un constructeur de liens OpenStreetMap, partagés par deux rendus. Rien à migrer.
- **`src/data/ateliers.js`** ne contient **aucun atelier**. C'est la structure du silo SEO (5 pages, accroches, résumés) et des générateurs de JSON-LD. **Les ateliers n'existent nulle part comme données** : `FORMATS`, `DUREES`, `THEMES`, `FAQ` sont rédigés en dur dans `Ateliers.jsx` et ses cinq sous-pages.
- **`src/data/evenement.js`** décrit l'affiche du 3 octobre (fichier, dimensions, poids, texte alternatif), pas un événement au sens du §10. Relève de la médiathèque, et son propre commentaire le dit temporaire.

Le module Ateliers n'a donc **rien à reprendre** : son contenu reste à saisir, ou les cinq pages restent en dur. À trancher.

### Actualités — le schéma tient

Les cinq types de blocs utilisés (`paragraph`, `heading`, `link`, `video`, `audio`) correspondent exactement à ceux qu'accepte le module. Les sept catégories correspondent clé pour clé. Tous les champs trouvent leur colonne, `imageFit` et `imagePosition` compris. `dateLabel` n'a pas de colonne mais se déduit de la date — vérifié sur les 11 articles, un par un.

### Partenaires — une colonne manquait, et pour une mauvaise raison

Chaque partenaire porte un **libellé affiché publiquement** : « Réseau professionnel rejoint », « Partenariat convenu », « Échange en cours »… Aucune colonne ne l'accueillait.

L'Étape 2 avait lu le §12 — « les statuts internes ne doivent **pas nécessairement** être visibles publiquement » — comme une interdiction de publier quoi que ce soit, et fait du statut de partenariat un suivi strictement interne. C'est une permission, pas une interdiction.

Les deux ne se remplacent d'ailleurs pas : les 5 libellés existants ne correspondent à aucun des 8 statuts internes, et la nuance qu'ils portent est institutionnelle. Présenter une collectivité comme partenaire établi alors qu'aucune convention n'existe l'engage à tort — c'est exactement ce que le commentaire de `partenaires.js` défendait.

**Colonne `libellePublic` ajoutée** (migration 0009), texte libre, 60 caractères, facultative, saisie **parmi les champs publics** et non dans l'encadré de suivi interne — les placer côte à côte inviterait à confondre ce qu'on note et ce qu'on publie. 8 vérifications en conditions réelles sur `dev`.

### Temps de lecture : arrondi au supérieur

Les valeurs saisies à la main sont incohérentes entre elles — 232 mots annoncés « 5 min », 502 mots annoncés « 3 min ». `Math.round` devenait `Math.ceil` : annoncer moins de temps qu'il n'en faut dessert le lecteur, en annoncer un peu plus ne coûte rien.

**Des temps affichés vont baisser sur le site public** à la migration (jusqu'à « 5 min » → « 2 min »). C'est assumé : la valeur calculée est juste, celles saisies ne l'étaient pas.

### Valeurs calculées : figées, décision du 21/09/2026

Trois textes interpolent des valeurs venues d'autres fichiers — le prix du billet et la valeur des lots depuis `lotsTombola.js`, l'affiche depuis `evenement.js`, le nombre de déchèteries SITCOM depuis `defiCollecte.js`. En base, ils deviennent **figés**.

C'est précisément ce que les commentaires de ces fichiers cherchaient à éviter (« serait resté faux quand il est passé à trois »). Décision prise en connaissance de cause : prévoir des variables dans le contenu serait plus coûteux et plus fragile qu'un texte qu'on relit.

**À surveiller** : si le prix du billet, la valeur des lots ou le nombre de déchèteries change, les articles concernés devront être corrigés à la main. Rien ne le signalera.

## 21/09/2026 — Phase 3 : le site public lit le back-office

Les actualités et les partenaires ne sont plus écrits dans le code du site. **Aucune page n'a été modifiée**, ni `prerender.js` : c'est le résultat le plus important de cette étape.

### Comment, sans toucher aux pages

Le site est prérendu, il n'interroge aucune base à l'exécution. Le contenu est donc figé au build, exactement comme le catalogue de la boutique l'est déjà par `scripts/vitrine.mjs` — même principe, mêmes garde-fous.

- **`scripts/contenus.mjs`** lit le contenu publié et écrit `src/data/cms.json`, dans la forme que le site a toujours connue. Ajouté au `npm run build`, avant `vite build`.
- **`src/data/articles.js` et `src/data/partenaires.js`** ne contiennent plus de contenu : ils exposent `ARTICLES`, `CATEGORIES`, `PARTENAIRES_CONFIRMES`… en relisant ce fichier. Les pages et `prerender.js` importent la même chose qu'avant et ignorent tout de la base.
- **`scripts/importer-contenu-existant.mjs`** a repris les 11 articles et les 5 structures. Idempotent : relancé, il ne réécrit rien — une correction faite depuis le back-office survit.

`cms.json` est committé : il sert de repli, et permet de reconstruire le site sans accès à la base.

### Trois pannes, trois fois testées pour de vrai

Le pire résultat possible serait un site vidé de son contenu par une panne de base. Les trois cas ont été provoqués, pas raisonnés :

| Panne | Comportement constaté |
|---|---|
| Base injoignable | Contenu précédent conservé, build poursuivi |
| `DATABASE_URL` absente | Contenu précédent conservé, build poursuivi |
| Base joignable, **aucun contenu publié** | Contenu précédent conservé, build poursuivi |

Le troisième est le plus sournois : une mauvaise branche de base ou une migration en cours produirait un site sans aucun article, et le mal serait fait au déploiement suivant. Le repli a la **même forme** que le fichier nominal, les deux blocs de partenaires compris — un repli d'une autre forme ferait échouer les pages au moment précis où l'on cherche à les protéger.

### La vérification : 49 pages identiques au caractère près

Le HTML des 58 pages a été figé avant le branchement, puis comparé après (empreintes de bundle neutralisées).

**49 pages rigoureusement identiques**, dont `/association/partenaires/` : la reprise des 5 structures est parfaite, libellés publics compris.

**9 pages modifiées, et uniquement comme prévu :**
- 8 pages d'articles : **le temps de lecture, et rien d'autre**. Pas un mot de contenu, pas un titre, pas une image.
- `/association/actualites/` : l'ordre des cartes. L'ordre venait de la position dans le fichier, qui n'était pas chronologique — un article du 20 mai passait devant un du 15 septembre. Il vient désormais de la date. Aucun article perdu ni ajouté, l'article mis en avant reste en tête.

### Deux défauts trouvés en chemin

1. **Le lecteur de `.env.local` ne lisait rien**, sans le moindre message. Le fichier est en CRLF, et en JavaScript `.` ne matche pas `\r` : `(.*)$` ne correspondait jamais. `scripts/dev-backoffice.mjs` découpait déjà sur `/\r?\n/` — la raison est maintenant écrite à côté du code.
2. **Le repli vide n'avait pas la bonne forme** (`organisations: []` au lieu des deux blocs). Il aurait fait échouer les pages dans le seul cas où il servait.

### Ce qui reste en dur, volontairement

- **Les six pages Ateliers** — décision du 21/09/2026. Leur contenu (formats, durées, thèmes, FAQ, JSON-LD par page) est rédigé dans les pages, le SEO y est travaillé, et le module Ateliers n'a rien à reprendre. Il servira aux ateliers à venir.
- **`MENTION_COOPERATIONS` et `PAYS_ZONE_ACTION`** : ce ne sont pas des organisations. Ils restent dans `partenaires.js` et suivront les pages institutionnelles.
- **`evenement.js`** (l'affiche) et **`carte.js`** (du code).
