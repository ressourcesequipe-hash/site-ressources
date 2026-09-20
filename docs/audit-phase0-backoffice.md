# AUDIT PHASE 0 — BACK-OFFICE DU SITE RESSOURCES

**Statut :** audit de lecture seule, aucun code écrit ni modifié.
**Réalisé conformément aux §3 et §44 du** [cahier des charges v2.2](./cahier-des-charges-backoffice.md).
**Point d'arrêt (§44.2) :** ce document est soumis à validation avant toute écriture de code, migration ou maquette détaillée.

---

## PARTIE A — AUDIT TECHNIQUE (§3)

### A.1 Framework et version

- **React** 18.3.1 + **Vite** 5.4.2 (`@vitejs/plugin-react`), pas de framework applicatif type Next.js/Remix.
- **React Router** 6.26.2, utilisé en deux modes : `BrowserRouter` côté client (`src/App.jsx`), `StaticRouter` côté build pour le prérendu (`src/entry-server.jsx`).
- **react-helmet-async** 2.0.5 pour le `<head>` (SEO), forcé en bundle SSR (`noExternal`) car publié en CommonJS.
- **Tailwind CSS** 3.4.11 pour les styles, thème personnalisé (`tailwind.config.js`).
- **Leaflet** 1.9.4, chargé dynamiquement côté client uniquement (jamais au SSR, car la librairie touche `window` à l'import).
- Pas de TypeScript (JSX pur), pas de framework de test, pas de linter configuré (aucun `.eslintrc`).

### A.2 Structure du projet

```
src/
  pages/        38 composants de route, ~9 450 lignes au total
  components/   18 composants partagés (Header, Footer, Layout, SEO, formulaires, carte, modales)
  data/         10 fichiers de contenu codé en dur (voir A.16)
  hooks/        1 hook (useReveal.js)
  routes.jsx, App.jsx, entry-server.jsx, main.jsx, index.css
api/
  contact.js    unique fonction serverless (Vercel)
lib/
  brevo.js      configuration partagée Brevo (listes, attributs, routage des formulaires)
scripts/
  vitrine.mjs           synchronisation Ressources 360 (build-time)
  optimiser-logos.mjs   pipeline sharp pour les logos
  brevo-*.mjs (4)        outillage newsletter (setup, test, template, import HelloAsso)
public/          assets statiques servis tels quels (logos, photos, audio, robots.txt, sitemap.xml)
design/          sources graphiques haute résolution — gitignored, jamais déployé
emails/          3 gabarits HTML pour campagnes/automatisations Brevo
docs/            documentation existante (brevo.md) + ce cahier des charges
prerender.js     script de prérendu SSG (racine du dépôt)
```

Aucune base de données, aucun système d'authentification, aucune zone d'administration n'existe aujourd'hui : le site est un ensemble de composants React dont le contenu est écrit directement dans le code.

### A.3 Routing

- Déclaration unique des routes React Router dans `src/routes.jsx` (38 routes statiques + 2 routes dynamiques : `/association/actualites/:slug/` et `/materiel-disponible/:code/`).
- **Point d'attention :** `prerender.js` maintient sa **propre liste** `STATIC_ROUTES`, dupliquée à la main et qui doit rester synchronisée avec `routes.jsx`. Les routes dynamiques y sont ajoutées séparément à partir de `data/articles.js` et `data/vitrine.json`.
- **Aucune route catch-all (`*`) ni page 404 dédiée.** Seule `ArticlePage.jsx` affiche un message « article introuvable » stylé en 404 pour un slug d'actualité inconnu — ce n'est pas un comportement HTTP 404 générique. Une URL totalement inconnue tombe sur la réécriture Vercel (`vercel.json` → tout vers `/index.html`), qui sert aujourd'hui le HTML prérendu de la page d'accueil. **Point technique incertain, indépendant du back-office, à vérifier/corriger séparément.**
- Convention : toutes les URLs se terminent par `/`. 4 redirections 301 historiques codées dans `vercel.json`.

### A.4 Composants partagés

`Layout.jsx` (Header + Footer + contenu), `SEO.jsx` (centralise meta/OG/Twitter/schema.org via Helmet), `CartePoints.jsx` (carte Leaflet générique, chargement paresseux), `Breadcrumb.jsx`, plusieurs formulaires qui postent tous vers `/api/contact` avec un champ `type` discriminant, et des composants spécifiques à la campagne du 3 octobre 2026 (`EventBanner`, `BandeauTempsForts`, `CompteARebours`, `TombolaModal`, `TousLesLotsModal`, `PartenairesTombola`, `EncartTombola`).

### A.5 Système de styles

Tailwind avec thème personnalisé : palette (`ocre`, `kaki`, `olive`, `beige`, `terre`), polices `Playfair Display` (titres) + `Inter` (texte), chargées via Bunny Fonts (alternative RGPD à Google Fonts). C'est cette identité — et non la charte graphique institutionnelle — que le back-office doit reprendre (§24.9 du cahier).

### A.6 Hébergement Vercel

- `vercel.json` : 4 redirections 301 + réécriture SPA générique (`/(.*)` → `/index.html`).
- Pas de section `functions` ni `env` dans `vercel.json` (configuration par défaut).
- Aucun dossier `.vercel/` local : le projet n'est pas lié via la CLI Vercel sur ce poste (à vérifier si c'est le cas dans l'environnement de déploiement réel).
- **`netlify.toml` est présent à la racine** (build identique, publish `dist`) alors que le déploiement réel semble être Vercel (format des fonctions serverless dans `api/contact.js`, `vercel.json` actif). **Sa raison d'être n'est pas documentée — à clarifier avec l'équipe avant d'y toucher ou de le supprimer.**

### A.7 Variables d'environnement

Identifiées par recherche dans le code (noms uniquement, aucune valeur lue) :

| Variable | Usage | Statut |
|---|---|---|
| `BREVO_API_KEY` | `api/contact.js`, scripts `brevo-*` | active |
| `BREVO_LISTS` | JSON des identifiants de listes Brevo | active, avec repli si absente |
| `BREVO_DOI_TEMPLATE_ID`, `BREVO_DOI_REDIRECT_URL` | double opt-in newsletter | prévues dans le code, **inactives** (page de confirmation absente) |
| `VITRINE_URL` | URL de l'API Ressources 360 | active, valeur par défaut codée |

Aucun fichier `.env` dans le dépôt (cohérent avec `.gitignore`) : tout est géré directement dans Vercel (`Settings → Environment Variables`), comme documenté dans `docs/brevo.md`. Les futures variables du back-office (connexion base de données, secret de session, jeton GitHub pour la médiathèque, URL de deploy hook, secret de cron) suivront le même mode opératoire.

### A.8 Formulaires existants

8 formulaires, tous envoyés en `POST` vers l'unique endpoint `/api/contact`, discriminés par un champ `type` :

| Type | Formulaire / page | Liste Brevo alimentée |
|---|---|---|
| `newsletter` | pied de page (toutes les pages) | 001-NEWSLETTERS |
| `rejoindre` | Association → Nous rejoindre | selon menu (bénévoles / partenaires) |
| `benevole` | Soutenir → Devenir bénévole | 003-Bénévoles |
| `donMateriel` | pages « Comment donner » | 002-Donateurs |
| `evenement` | page Événement 3 octobre (temporaire) | 001-NEWSLETTERS |
| `pointCollecte` | Défi collecte → proposer un point | 004-Partenaires |
| `partenaireVegetal` | Recyclerie végétale → partenaires | 004-Partenaires |
| `contact` | page Contact | selon menu |

**Aucun stockage durable des demandes aujourd'hui.** Chaque envoi déclenche (a) un email à `contact@ressourcesrecyclerie.fr` et (b) une création/mise à jour de contact dans Brevo. Il n'existe ni identifiant de demande, ni statut, ni assignation, ni notes internes, ni historique — c'est tout l'objet du futur module 9 (§15). Aucune protection anti-spam (ni honeypot ni limitation de débit) : c'est documenté comme un manque connu dans `docs/brevo.md`, et le cahier (§15) en fait un prérequis explicite du module Formulaires — important puisque le stockage en base augmente la surface d'attaque par rapport à un simple envoi d'email.

### A.9 API existantes

Une seule : `POST /api/contact` (fonction serverless Vercel, Node/ESM). CORS ouvert (`Access-Control-Allow-Origin: *`), pas d'authentification (normal pour un endpoint public de réception de formulaire). Aucune autre route API dans le dépôt.

### A.10–A.11 Intégration Ressource 360 et récupération des équipements

Mécanisme unique : `scripts/vitrine.mjs`, exécuté **au moment du build** (première étape de `npm run build`) :

1. Appelle `GET {VITRINE_URL}/api/vitrine` (par défaut `https://ressources-360.vercel.app`), avec 3 tentatives et repli en cas d'échec (**le build continue avec le catalogue précédent** plutôt que d'échouer).
2. Télécharge et **recopie** les photos localement dans `public/vitrine/` — nécessaire car Ressources 360 sert ses médias avec `X-Robots-Tag: noindex, noimageindex`, donc une image servie depuis là-bas ne serait jamais indexée par Google Images.
3. Écrit `src/data/vitrine.json` (produits disponibles + vendus récents), **régénéré à chaque build** — ce fichier ne doit jamais être traité comme une source de contenu à migrer, malgré son emplacement dans `src/data/`.
4. `prerender.js` consomme ce même fichier pour générer une page statique par produit (`/materiel-disponible/:code/`) et `sitemap-materiel.xml`.
5. Consommé en affichage par `src/pages/Boutique.jsx` (liste) et `BoutiqueProduit.jsx` (fiche produit, incluant la FAQ garanties légales — candidate à page protégée, voir A.16).

Ce mécanisme est strictement hors périmètre du back-office (§30) et aucun autre point de contact avec Ressources 360 n'existe dans le dépôt.

### A.12 Gestion actuelle des images

- Photos et logos de contenu : déposés directement dans `public/photos/` et `public/logos/`, référencés par chemin en dur dans le JSX ou les fichiers `data/`. Pas de médiathèque, pas de métadonnées centralisées (le texte alternatif est écrit à chaque usage, pas géré une fois pour toutes).
- `scripts/optimiser-logos.mjs` : utilise **sharp** pour générer les variantes WebP/PNG des logos à partir de `design/logos-sources/` (gitignored) vers `public/logos/`. C'est exactement le modèle que le cahier (§14.1) demande de réutiliser pour la médiathèque — **mais `sharp` n'est pas une dépendance déclarée dans `package.json`** : le script précise lui-même qu'il faut l'installer à la main (`npm install --no-save sharp`). Il faudra en faire une dépendance réelle et vérifier sa compatibilité avec l'environnement serverless Vercel (taille de fonction, temps de build).
- Les photos de la vitrine suivent un circuit séparé (A.10), sans passage par `sharp`.
- Aucun mécanisme d'upload existant : aujourd'hui, ajouter une image = un commit Git fait par un développeur.

### A.13 Structure SEO

Base solide à conserver :

- `SEO.jsx` centralise, page par page : title, description, canonical, Open Graph, Twitter Card, et injecte sur **chaque page** un schema.org `LocalBusiness`/`NGO` (adresse, géolocalisation, zone desservie, catalogue de services).
- Schemas additionnels réutilisables dans `data/ateliers.js` (`serviceSchema`, `faqSchema`, `graph`).
- `prerender.js` génère un `llms.txt` (plan de site pour agents IA) à partir des `<title>`/`<meta description>` réellement rendus par chaque page — pas écrit à la main.
- Balise de vérification Google Search Console codée en dur dans `SEO.jsx`.

### A.14 Sitemap

Deux sitemaps distincts, tous deux référencés dans `robots.txt` :
- `public/sitemap.xml` : écrit et maintenu **à la main**, 43 URLs, modifié « deux fois par an » selon le commentaire du code.
- `dist/sitemap-materiel.xml` : généré à **chaque build** par `prerender.js` à partir de `vitrine.json`.

### A.15 robots.txt

Minimal : `Allow: /` pour tous les agents, référence les deux sitemaps. Aucune règle pour un futur `/admin` — à ajouter (`Disallow: /admin`) en même temps que le header `noindex` sur ces routes.

### A.16 Données actuellement codées en dur — inventaire complet

| Fichier / emplacement | Contenu | Nature |
|---|---|---|
| `src/data/articles.js` | 9 articles d'actualité (blocs riches : paragraphe, titre, lien, vidéo, audio) | éditorial |
| `src/data/partenaires.js` | 3 partenaires confirmés + 2 coopérations en cours | éditorial |
| `src/data/ateliers.js` | Métadonnées des 5 sous-pages ateliers (SEO, accroches) — **le contenu détaillé de chaque page vit directement dans `src/pages/ateliers/*.jsx`**, pas ici | éditorial + structure |
| `src/data/defiCollecte.js` | 15 points de collecte **du Défi collecte** (campagne temporaire 1er sept.–3 oct. 2026), avec horaires/adresses sourcés et datés à la main | campagne temporaire — **à ne pas confondre avec les points de collecte pérennes du module 7** |
| `src/data/evenement.js` | Métadonnées de l'affiche de l'événement du 3 octobre 2026 | campagne temporaire, retrait prévu après le 3/10/2026 |
| `src/data/lotsTombola.js` | Lots et tarifs de la tombola (non lu en détail, référencé abondamment) | campagne temporaire |
| `src/data/objectifs.js` | 4 chiffres clés de la première année (source unique reprise à 6 endroits) | paramètres/chiffres clés transverses |
| `src/data/redistribution.js` | Modèle de redistribution du matériel (texte transverse) | éditorial transverse |
| `src/data/carte.js` | Utilitaires de carte (tracé d'épingle, lien OSM) — **pas du contenu** | technique |
| `src/data/vitrine.json` | Catalogue matériel | **généré à chaque build depuis Ressources 360 — jamais à migrer** |
| Toutes les autres pages (Association, Gouvernance, Territoire, Presse, ~15 pages `info/`, `vegetale/`, `soutenir/`, pages légales) | texte directement dans le JSX, jamais extrait | éditorial |
| `Header.jsx` (`NAV`), `Footer.jsx` (`SILOS`) | menu principal et pied de page, **dupliqués entre les deux fichiers** | navigation |
| `SEO.jsx`, `Footer.jsx`, `Contact.jsx` | coordonnées, réseaux sociaux, liens HelloAsso — **répétés à plusieurs endroits** | paramètres généraux |

**Pages candidates à « page protégée » (§8.4)**, au sens juridique : `MentionsLegales.jsx`, `Confidentialite.jsx`, `info/EffacementDonnees.jsx`, et le bloc garanties légales de `Boutique.jsx` (FAQ « Quelle garantie sur le matériel reconditionné ? »). Liste à confirmer avec l'équipe, conformément au cahier.

### A.17 Bases de données existantes

Aucune. La seule persistance actuelle est (a) les fichiers versionnés dans Git et (b) le CRM externe Brevo pour les contacts issus des formulaires. Ceci confirme la prémisse du §5.2 : une base de données doit être ajoutée intégralement.

### A.18 Dépendances du projet

Runtime : `react`/`react-dom` 18.3, `react-router-dom` 6.26, `react-helmet-async` 2.0 (bundlé en SSR, pas externalisé), `leaflet` 1.9 (client uniquement).
Dev : `vite` 5.4, `@vitejs/plugin-react`, `tailwindcss` 3.4, `postcss`, `autoprefixer`.
Non déclarée : `sharp` (voir A.12).
Aucun framework de test, aucun linter configuré, pas de TypeScript — le cahier (§40) ne demande un typage strict que « si le projet utilise TypeScript », ce qui n'est pas le cas ; pas de migration TS à prévoir de ce fait.

### A.19 Pages générées statiquement ou dynamiquement

**Tout est en SSG (prérendu statique), aucune page n'est rendue à la demande.** `npm run build` enchaîne : `scripts/vitrine.mjs` (sync Ressources 360) → `vite build` (bundle client) → `vite build --ssr` (bundle serveur `entry-server.jsx`) → `prerender.js` (exécute un `renderToString` par route et écrit un `dist/<route>/index.html`). Après ce build, le visiteur reçoit du HTML complet, puis React prend le relais en SPA pour la navigation suivante. **C'est ce mécanisme que le cahier (§5.2, §32) demande de conserver** : toute publication depuis le futur back-office devra déclencher un nouveau build complet via un deploy hook Vercel — il n'existe aujourd'hui aucun rendu à la demande, et en introduire un serait un changement d'architecture plus large que ce que le cahier demande.

---

## PARTIE B — SYNTHÈSE (§3, 6 points)

### B.1 Architecture actuelle (résumé)

Site vitrine React 18 + Vite, entièrement prérendu en HTML statique à chaque build et déployé sur Vercel, sans base de données ni back-office. Le contenu vit dans le code (JSX et fichiers `data/`). Une seule fonction serverless (formulaires → email + Brevo). Une intégration build-time avec Ressources 360 pour le catalogue matériel. Aucune authentification, aucune gestion de droits.

### B.2 Éléments à conserver strictement

- Le pipeline de build (`vitrine.mjs` → `vite build` → SSR → `prerender.js`) — à déclencher depuis un deploy hook, jamais à réécrire.
- L'intégration Ressources 360 (`scripts/vitrine.mjs`, consommation de `/api/vitrine`) — hors périmètre, ne pas toucher.
- `SEO.jsx` et ses schemas — à réutiliser tel quel pour le contenu venant du CMS, en lui passant les champs saisis en back-office au lieu de chaînes codées en dur.
- Le pipeline Brevo (`lib/brevo.js`, `api/contact.js`) — devient un des consommateurs du futur module Formulaires, pas à remplacer.
- La palette et les polices Tailwind — identité graphique du back-office (§24.9).
- Les URLs actuelles (silos, trailing slash) — à préserver strictement (§20, §31).
- Le mécanisme de prérendu par route + `sitemap-materiel.xml` + `llms.txt` — à étendre, pas à remplacer.

### B.3 Éléments à migrer vers le CMS

Voir le tableau de correspondance complet en **Partie C.3**.

### B.4 Risques de régression

1. **Duplication de routes** entre `src/routes.jsx` et `prerender.js` (`STATIC_ROUTES`) : toute page pilotée par le CMS doit rester synchronisée aux deux endroits, ou le mécanisme de prérendu doit évoluer pour lire les slugs publiés depuis la base plutôt qu'une liste statique en dur.
2. **Contenu de la campagne du 3 octobre 2026 fortement interconnecté en code** (imports croisés entre `articles.js`, `evenement.js`, `lotsTombola.js`, `defiCollecte.js`, `BandeauTempsForts.jsx`, `EventBanner.jsx`). Migrer cela vers le CMS pendant que la campagne est active est plus risqué que d'attendre son terme (3 octobre 2026) — à trancher avec l'équipe, ce n'est probablement pas prioritaire pour la V1.
3. **Les « points de collecte » du Défi collecte ne sont pas les points de collecte pérennes** visés par le module 7 (§13) : les confondre produirait un mauvais modèle de données (statut de campagne temporaire vs. point permanent avec horaires réguliers). À clarifier avec l'équipe avant de concevoir la collection.
4. **`sharp` n'est pas une dépendance déclarée** : la médiathèque (§14.1) en dépend directement. À formaliser dans `package.json` et à valider en environnement serverless Vercel (taille de fonction, temps de build).
5. **`netlify.toml` non expliqué** : à clarifier avec l'équipe avant toute suppression ou modification — ne pas présumer qu'il est mort.
6. **Absence de page 404 dédiée** : comportement à vérifier en production, indépendant du back-office mais à ne pas aggraver en ajoutant des routes CMS.
7. **Aucune protection anti-spam sur les formulaires actuels** : le passage à un stockage en base (module Formulaires) augmente la surface d'attaque (une base qui se remplit plutôt qu'un email isolé) — l'anti-spam devient un prérequis de la première version du module, pas une amélioration ultérieure.
8. Toute nouvelle étape de build lisant la base de données doit **reproduire la dégradation gracieuse** déjà en place pour Ressources 360 : le build ne doit jamais échouer totalement si la base est temporairement indisponible.
9. Le double opt-in Brevo est câblé dans le code mais inactif — à ne pas casser en touchant `lib/brevo.js` pour le module Formulaires.

### B.5 Solution CMS recommandée

Le §5.1 du cahier fixe déjà la contrainte : pas de service ni de déploiement séparé. « Choisir un CMS » revient donc à choisir les briques techniques concrètes :

| Brique | Recommandation | Pourquoi |
|---|---|---|
| Base de données | **Neon** (Postgres serverless) | mentionné explicitement par le cahier (§5.2) comme fournisseur envisagé ; intégration native Vercel ; palier gratuit correct ; modèle relationnel adapté aux rôles/relations/versioning |
| Accès aux données | **Drizzle ORM** | bundle léger et démarrage à froid rapide, mieux adapté aux fonctions serverless que Prisma |
| Authentification | à trancher en Phase 1 entre (a) une librairie de sessions/hachage éprouvée intégrée au projet (ex. Lucia, ou cookies de session + `argon2`), ou (b) un service d'auth externe (compte tiers, pas d'app séparée) | le cahier (§26) demande une brique éprouvée plutôt que « fait maison », sans imposer l'une ou l'autre option |
| Éditeur de texte riche | **Tiptap** | headless, React, léger — évite un page builder complet (interdit par §43.1) |
| Pipeline médias | **sharp** (déjà utilisé) + **octokit** (API GitHub) | reprend exactement le modèle de `optimiser-logos.mjs`, conforme au §14.1 |
| Déclenchement de publication | **Vercel Deploy Hooks** | natif, aucun nouvel outil |
| Publication programmée | **Vercel Cron Jobs** | natif, conforme au §5.6 |

### B.6 Plan de migration (aperçu — détail en Partie D)

Migration progressive, silo par silo, en suivant le phasage du cahier (§36) : socle (base, auth, rôles, médiathèque, paramètres) → contenus structurés (pages, actualités, événements, ateliers, partenaires, points de collecte) → branchement des pages publiques → formulaires → finitions/validation UX. La campagne du 3 octobre 2026 reste en dehors du périmètre de migration V1 (risque 2 ci-dessus).

---

## PARTIE C — LIVRABLES §44.1 (compléments)

### C.1 Inventaire des pages et contenus existants

38 routes (voir A.3), réparties en 6 silos : Recyclerie informatique (7 pages), Recyclerie végétale (5), Ateliers (6), Association (7), Soutenir (5), pages racine/légales (8). Contenu éditorial détaillé en A.16.

### C.2 Cartographie de l'intégration Ressource 360

Voir A.10–A.11 : point d'entrée unique `scripts/vitrine.mjs`, exécuté au build, aucune dépendance côté runtime, aucun autre point de contact dans le dépôt.

### C.3 Tableau de correspondance contenu existant → module CMS

| Contenu existant | Emplacement actuel | Futur module (§6) |
|---|---|---|
| 9 articles d'actualité | `src/data/articles.js` | Module 3 — Actualités |
| Pages ateliers (hub + 5 sous-pages) | `src/pages/ateliers/*.jsx` + `data/ateliers.js` | Module 5 — Ateliers |
| Partenaires confirmés + coopérations | `src/data/partenaires.js` | Module 6 — Partenaires et mécènes (Organisations) |
| Points de collecte | `src/data/defiCollecte.js` (`POINTS_COLLECTE`) | Module 7 — à clarifier (voir risque B.4.3) |
| Pages institutionnelles (Association, Gouvernance, Territoire, Presse, Nous rejoindre, pages `info/`, `vegetale/`) | JSX en dur | Module 2 — Pages |
| Pages juridiques + FAQ garanties Boutique | `MentionsLegales.jsx`, `Confidentialite.jsx`, `info/EffacementDonnees.jsx`, `Boutique.jsx` | Module 2 — Pages protégées (§8.4) |
| Campagne 3 octobre (bandeau, carrousel, affiche) | `EventBanner.jsx`, `BandeauTempsForts.jsx`, `data/evenement.js`, `data/lotsTombola.js` | Module 15 — Bandeaux et campagnes (hors périmètre V1, voir B.4.2) |
| Coordonnées, réseaux sociaux, liens externes | `Header.jsx`, `Footer.jsx`, `SEO.jsx` (dupliqués) | Module 10 — Paramètres généraux |
| Menu principal / pied de page | `Header.jsx` (`NAV`), `Footer.jsx` (`SILOS`), dupliqués | Module 11 — Navigation |
| 8 formulaires | composants dispersés + `api/contact.js` | Module 9 — Formulaires et demandes (nouvelle couche statuts/stockage, en complément de Brevo) |
| Logos, photos | `public/logos/`, `public/photos/` | Module 8 — Médiathèque |
| Métadonnées SEO par page | props `<SEO>` par page | Module 12 — SEO |
| Chiffres clés transverses | `data/objectifs.js` | Paramètres généraux / bloc « chiffres clés » (§8.3) |

### C.4 Choix CMS argumenté et architecture

Voir B.5. Architecture générale conforme au §4/§5 du cahier : back-office intégré au projet existant (`/admin`), même dépôt, même déploiement Vercel, base de données neuve et physiquement distincte de celle de Ressources 360.

### C.5 Schéma des collections, relations et droits (première ébauche)

À affiner et valider en Phase 1 (le cahier situe le maquettage détaillé et la validation des libellés en Phase 1, §36). Première proposition de tables :

- `utilisateurs` (id, email, mot_de_passe_hash, role, actif, cree_le)
- `roles` : super_admin | coordination | communication | contributeur | lecture_seule (énumération fixe, §21)
- `pages` (id, slug, titre_interne, titre_public, statut, contenu_blocs[JSON], protegee[bool], seo, auteur_id, modifie_le)
- `actualites` (id, slug, titre, resume, contenu_blocs, image_principale, categorie, statut, date_publication, mise_en_avant, seo)
- `evenements` (id, slug, titre, dates/heures, lieu, programme, statut, mise_en_avant, seo)
- `ateliers` (id, slug, nom, theme, categories[], description, statut, seo)
- `organisations` (id, nom, logo, type, statut_partenariat, visible_site, visible_accueil, ordre, notes_internes)
- `points_collecte` (id, nom, organisation_id, adresse, coords, horaires[JSON], type, campagne_id, statut, visible_carte, visible_liste)
- `medias` (id, fichier_chemin, titre, alt, credit, categorie, utilisateur_id, usages[])
- `campagnes_bandeaux` (id, titre_interne, message, lien, type, date_debut, date_fin, actif, emplacement)
- `demandes` (id, type, donnees[JSON], statut, utilisateur_responsable_id, notes_internes, historique[JSON])
- `parametres_site` (singleton : coordonnées, réseaux sociaux, liens externes)
- `navigation` (menu principal, sous-menus, footer — structure arborescente)
- `versions` (table transverse : entite_type, entite_id, utilisateur_id, date, contenu_precedent[JSON]) — historique/versioning (§23)

Chaque table de contenu porte : `statut` (brouillon/à valider/programmé/publié/archivé), `auteur_id`, `modifie_le`, `seo[JSON]`, conformément au workflow §22.

### C.6 Descriptions écran par écran (première ébauche textuelle)

*(mockups visuels détaillés à produire en Phase 1, §36 ; ce qui suit est une description fonctionnelle pour validation du principe.)*

**Tableau de bord (`/admin`)** — cartes métier (Actualités, Photos et documents, Événements, Partenaires, Points de collecte, Messages reçus) avec compteurs (§7, §24.2), actions rapides en boutons explicites, contenu filtré selon le rôle connecté, accès permanent à « Voir le site ».

**Édition d'une actualité** — formulaire progressif : champs essentiels d'abord (titre, image, résumé, contenu), options avancées repliées (SEO, tags, mise en avant) ; éditeur de texte riche (Tiptap) ; bouton « Prévisualiser » ouvrant un aperçu fidèle desktop/mobile ; boutons d'action explicites (« Enregistrer le brouillon », « Demander la validation », « Publier ») ; statut d'enregistrement visible en permanence.

**Édition d'un partenaire** — parcours minimal conforme à l'exemple du §24.4 : nom → logo → type → présentation courte → prévisualiser → publier, sans imposer les champs internes (dates, ordre d'affichage, notes privées) à cette étape.

**Édition d'un point de collecte** — formulaire adresse/horaires/consignes, carte de positionnement, statut, et un principe fort : modifier un horaire ici le répercute partout où le point apparaît (§13), sans jamais nécessiter une seconde modification ailleurs.

**Médiathèque** — grille de vignettes avec recherche/filtre par catégorie, glisser-déposer pour l'ajout, aperçu immédiat, champ texte alternatif mis en avant avec exemple, possibilité de réutiliser un média existant plutôt que de le réimporter.

### C.7 Risques, coûts récurrents et limites à vérifier (§43.2)

| Service | Palier gratuit à vérifier précisément | Statut |
|---|---|---|
| Neon (base de données) | stockage, nombre de branches, limite de calcul (compute hours), politique de sauvegarde | à chiffrer en Phase 1 |
| Vercel (fonctions serverless) | durée d'exécution max, nombre d'invocations, fréquence des Cron Jobs, nombre de déploiements/mois | à chiffrer en Phase 1 |
| API GitHub (médiathèque) | limite de requêtes/heure pour le jeton utilisé | à chiffrer en Phase 1 |
| Brevo | 300 envois/jour déjà documenté (`docs/brevo.md`) — partagé entre notifications formulaires et emails de bienvenue | connu, à surveiller si le trafic augmente |

Points techniques incertains supplémentaires : comportement 404 réel en production (A.3), statut du `netlify.toml` (A.6), compatibilité de `sharp` en fonction serverless Vercel (A.12).

### C.8 Calendrier en étapes et tests de non-régression

**Calendrier** — en étapes de développement, sans durée chiffrée à ce stade (conformément à la consigne du §44.1.8 de ne pas promettre de durée irréaliste) :

1. Validation du présent audit par l'équipe (point d'arrêt en cours).
2. Phase 1 — socle : base de données, authentification, rôles, médiathèque, paramètres généraux ; maquettage validé avec l'équipe avant d'aller plus loin.
3. Phase 2 — contenus : pages, actualités, événements, ateliers, partenaires, points de collecte.
4. Phase 3 — site public : branchement progressif des pages au CMS, maintien strict des URLs.
5. Phase 4 — formulaires : centralisation, statuts, anti-spam.
6. Phase 5 — finitions : recette ergonomique avec deux utilisateurs non techniques (§37), versioning, programmation, SEO, documentation.

**Tests de non-régression minimaux (§38)** : navigation, accueil, actualités, partenaires, ateliers, points de collecte, formulaires, newsletter (jamais sur la liste de production), SEO, responsive, uploads, authentification, permissions, intégration Ressources 360 — plus les cas d'erreur (image trop lourde, mauvais format, formulaire incomplet, lien invalide, slug déjà utilisé, utilisateur sans permission, erreur API).

---

## Points à trancher avec l'équipe avant la Phase 1

1. Statut du `netlify.toml` — vestige à supprimer, ou usage actif à préserver ?
2. Les « points de collecte » doivent-ils, pour la V1, couvrir uniquement des points pérennes, ou aussi des points de campagne temporaire comme le Défi collecte ?
3. Le contenu de la campagne du 3 octobre 2026 doit-il entrer dans le périmètre de migration V1, ou rester tel quel jusqu'à son terme ?
4. Confirmation de la liste exacte des pages protégées (§8.4) : mentions légales, confidentialité, effacement des données, garanties Boutique — d'autres pages à ajouter ?
5. Choix d'authentification : brique intégrée au projet, ou service externe ?
