# Variables d'environnement du back-office

Sur le même modèle que `BREVO_API_KEY` aujourd'hui (voir `docs/brevo.md`) :
toutes gérées directement dans Vercel (`Settings → Environment Variables`),
jamais dans un fichier commité — le dépôt `site-ressources` est public.

Aucune de ces variables n'existe encore : c'est à faire avant que le socle
scaffoldé (Étape 1) puisse réellement fonctionner, au-delà de la relecture du
code.

## Base de données

| Variable | Rôle | Provenance |
|---|---|---|
| `DATABASE_URL` | Connexion à la base Neon **du back-office**, physiquement distincte de celle de Ressources 360 (§30 du cahier, §5.2 de l'audit) | tableau de bord Neon, après création du projet |

## Authentification (better-auth)

| Variable | Rôle | Provenance |
|---|---|---|
| `BETTER_AUTH_SECRET` | Signature des sessions — une chaîne aléatoire longue, générée une fois | `openssl rand -base64 32` ou équivalent |
| `BETTER_AUTH_URL` | URL publique du back-office (ex. `https://www.ressourcesrecyclerie.fr`) | connue à l'avance |

## Déploiement (§2 de l'architecture)

| Variable | Rôle | Provenance |
|---|---|---|
| `VERCEL_DEPLOY_HOOK_URL` | Hook appelé par `demanderDeploiement()` (`lib/deploiement.js`) à chaque publication | Vercel → Project Settings → Git → Deploy Hooks |

## Fermeture du cycle de déploiement (§2 et §3 de l'architecture)

Ajoutées le 20/09/2026, en même temps que `api/cron/taches.js` et
`api/admin/deploiement.js`. **Sans elles, la publication fonctionne mais le
cycle ne se referme que par le garde-fou de délai** (30 minutes, voir
`lib/deploiement.js`) : chaque déploiement serait donc journalisé en échec
même lorsqu'il a réussi. Le site resterait correct, l'interface mentirait.

| Variable | Rôle | Provenance |
|---|---|---|
| `CRON_SECRET` | Vercel ajoute automatiquement `Authorization: Bearer <valeur>` aux appels de la tâche planifiée dès que cette variable existe. `api/cron/taches.js` la vérifie et refuse tout appel sans elle — sans quoi l'URL serait déclenchable par n'importe qui. | chaîne aléatoire longue, générée une fois (`openssl rand -base64 32`) |
| `VERCEL_API_TOKEN` | Lecture seule de l'état réel d'un déploiement (`lib/vercel.js`). Ne déclenche jamais rien : le seul chemin qui déclenche un déploiement reste le deploy hook. | Vercel → Account Settings → Tokens, portée limitée à l'équipe du projet |
| `VERCEL_PROJECT_ID` | Identifie le projet interrogé (`prj_…`) | Vercel → Project Settings → General, ou `.vercel/project.json` en local |
| `VERCEL_TEAM_ID` | Le projet appartient à une équipe (`team_…`) : sans ce paramètre, l'API Vercel répond 403 même avec un jeton valide | même provenance que ci-dessus (`orgId` dans `.vercel/project.json`) |

## Médiathèque (§4 de l'architecture)

| Variable | Rôle | Provenance |
|---|---|---|
| `GITHUB_MEDIA_OWNER` | Compte/organisation propriétaire du dépôt `site-ressources` (`ressourcesequipe-hash`) | connu |
| `GITHUB_MEDIA_REPO` | Nom du dépôt (par défaut `site-ressources`) | connu |
| `GITHUB_MEDIA_TOKEN` | Jeton fine-grained, scopé **uniquement** à ce dépôt, permission `Contents: Read and write` — généré depuis le compte propriétaire du dépôt lui-même (§14.1 demande seulement un compte reconnu comme collaborateur, pas nécessairement un second compte ; le propriétaire l'est déjà). Un jeton qui fuit ne permet rien d'autre qu'écrire des fichiers dans ce dépôt. | GitHub → Settings (du compte) → Developer settings → Fine-grained tokens |
| `GITHUB_MEDIA_COMMITTER_EMAIL` | Adresse, au choix (pas nécessairement une vraie boîte ni un compte GitHub existant), utilisée comme identité de commit par `api/admin/medias/upload.js` (`author`/`committer` fournis explicitement à l'API GitHub) — lue par `scripts/ignored-build-step.sh` pour reconnaître ces commits et éviter un déploiement automatique redondant | choisie librement, ex. `mediatheque@ressourcesrecyclerie.fr` |

## Pièces jointes confidentielles (Étape 3 — pas encore nécessaire)

| Variable | Rôle |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | Accès à Vercel Blob (accès privé) pour les pièces jointes de demandes — voir §7 de l'architecture. À ajouter à l'Étape 3, pas avant. |

---

## Points à vérifier en Étape 0 (spike technique)

Documenté en détail dans `docs/architecture-technique-backoffice.md` :

- fréquence réelle autorisée pour les Cron Jobs sur le plan Vercel retenu ;
- fenêtre de rétention PITR de Neon sur le plan retenu ;
- comportement de `toNodeHandler` (better-auth) face au traitement du corps de requête par les fonctions Vercel ;
- taille limite de charge utile d'une fonction serverless Vercel (contrainte l'upload de médias) ;
- comportement réel de l'« Ignored Build Step » avec le script fourni.
