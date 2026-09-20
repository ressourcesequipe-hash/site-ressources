# CAHIER DES CHARGES : BACK-OFFICE DU SITE RESSOURCES

**Projet :** Ressources, Recyclerie solidaire  
**Site public :** https://www.ressourcesrecyclerie.fr/  
**Contexte technique :** site développé avec Claude Code et déployé sur Vercel  
**Version :** 2.3. Publication détaillée (brouillons, déploiements, programmation), médiathèque tranchée (Git + sharp), pages juridiques protégées, évolution Ressources 360 laissée ouverte sans engagement immédiat, module Formulaires et demandes organisé par rubrique avec réponse par email intégrée  
**Objet :** créer un back-office d’administration complet, simple et sécurisé, sans remettre en cause l’architecture publique existante ni dupliquer les fonctions métier déjà assurées par Ressource 360.

---

## 1. OBJECTIF GÉNÉRAL

Mettre en place un espace d’administration accessible via une URL de type :

`https://www.ressourcesrecyclerie.fr/admin`

Ce back-office doit permettre à l’équipe Ressources d’administrer le site sans modifier le code et sans passer par Claude Code pour les opérations courantes.

Le back-office doit notamment permettre de :

- modifier les contenus éditoriaux ;
- publier des actualités ;
- gérer les événements ;
- gérer les ateliers présentés au public ;
- gérer les partenaires et mécènes affichés sur le site ;
- gérer les points de collecte publics ;
- ajouter, remplacer et organiser des images et documents ;
- administrer les formulaires reçus ;
- modifier les informations globales du site ;
- gérer le SEO ;
- programmer des publications ;
- gérer différents niveaux de droits utilisateurs ;
- conserver un historique des modifications.

**Objectif utilisateur prioritaire :** une personne sachant utiliser un ordinateur, mais n’ayant jamais utilisé de CMS ni développé de site web, doit pouvoir réaliser les opérations éditoriales courantes en autonomie après une courte prise en main. La facilité d’utilisation doit être vérifiée en situation réelle (voir §§ 24 et 37).

---

# 2. PRINCIPE FONDAMENTAL : NE PAS DUPLIQUER RESSOURCE 360

## 2.1 Ressource 360 reste le logiciel métier

Ressource 360 est déjà utilisé pour gérer les données opérationnelles de Ressources.

Il constitue la **source de vérité** pour :

- le matériel informatique collecté ;
- les équipements ;
- la traçabilité ;
- le diagnostic ;
- le reconditionnement ;
- les statuts des équipements ;
- la disponibilité ;
- la vente ;
- les produits vendus ;
- la publication des équipements sur le site lorsqu’ils deviennent disponibles.

Le fonctionnement actuel suivant doit être conservé :

```text
RESSOURCE 360
      ↓
base matériel
      ↓
statut disponible / publication
      ↓
ressourcesrecyclerie.fr
      ↓
Disponible / Déjà vendu
```

Lorsqu’un équipement devient disponible dans Ressource 360, il peut déjà apparaître automatiquement sur le site.

Lorsqu’il est vendu, son statut sur le site est actualisé automatiquement.

**Il ne faut donc pas créer dans le nouveau back-office une seconde interface permettant de modifier ces équipements.**

## 2.2 Principe de séparation

### Ressource 360
Gère les données métier et opérationnelles.

### Back-office du site
Gère les contenus publics, institutionnels, éditoriaux et de communication.

Cette séparation doit rester claire dans l’architecture technique. Pour la V1, elle est totale : aucune interconnexion technique entre les deux systèmes (voir §30).

---

# 3. PHASE 0 OBLIGATOIRE : AUDIT DU PROJET EXISTANT

Avant toute modification importante du code, effectuer un audit du dépôt actuel.

Analyser notamment :

- framework utilisé ;
- version du framework ;
- structure du projet ;
- routing ;
- composants partagés ;
- système de styles ;
- hébergement Vercel ;
- variables d’environnement ;
- formulaires existants ;
- API existantes ;
- intégration Ressource 360 existante ;
- système de récupération des équipements ;
- gestion actuelle des images ;
- structure SEO ;
- sitemap ;
- robots.txt ;
- données actuellement codées en dur ;
- éventuelles bases de données existantes ;
- dépendances du projet ;
- pages générées statiquement ou dynamiquement.

Produire avant la refonte une synthèse courte précisant :

1. l’architecture actuelle ;
2. les éléments à conserver ;
3. les éléments à migrer vers le CMS ;
4. les risques de régression ;
5. la solution CMS recommandée ;
6. le plan de migration.

### Règle

Ne pas engager de refonte globale du front-end si elle n’est pas nécessaire.

L’objectif est d’ajouter un système d’administration au site existant, pas de reconstruire le site.

---

# 4. ARCHITECTURE CIBLE

Architecture retenue : le back-office est intégré au projet du site public existant (même dépôt, même déploiement Vercel). Ressources 360 reste une application séparée et indépendante.

```text
      SITE PUBLIC + BACK-OFFICE (un seul projet, un seul déploiement)
                 ressourcesrecyclerie.fr
                          │
            ┌─────────────┴─────────────┐
            │                           │
     pages publiques              back-office (/admin)
     (prérendu SSR)                même application
            │                           │
            └─────────────┬─────────────┘
                           │
              base de données du back-office
                       (nouvelle)
                           │
        pages / actus / événements / partenaires
      collecte publique / ateliers / médias / SEO
                    formulaires


        RESSOURCE 360 (application séparée, indépendante)
                           │
        matériel / traçabilité / statuts / ventes
                           │
             scripts/vitrine.mjs (au moment du build)
                           │
                  page « Boutique » du site public
```

Le site public et le back-office forment une seule et même application, qui doit consommer les contenus du CMS sans modifier l’identité graphique actuelle des pages publiques.

Ressources 360 reste relié au site uniquement par le mécanisme de build déjà existant (`scripts/vitrine.mjs`), totalement indépendant du back-office : voir §30.

---

# 5. SOLUTION CMS

## 5.1 Contrainte de déploiement (non négociable)

Le back-office est **directement intégré au projet du site public existant** (`site-ressources`) : même dépôt de code, même projet Vercel, un seul déploiement au total. Aucun service ni projet séparé n’est créé pour le CMS.

Cette contrainte exclut les solutions qui exigent leur propre application pour fonctionner, notamment **Payload CMS**, dont le panneau d’administration est lui-même une application Next.js distincte : il ne peut pas s’exécuter à l’intérieur du projet Vite existant sans devenir un second déploiement. Toute solution équivalente (CMS packagé imposant son propre framework ou son propre serveur applicatif) est exclue pour la même raison.

Une bibliothèque qui s’intègre comme simple dépendance du projet (éditeur de texte riche, composant de gestion de rôles, etc., au même titre que `leaflet` aujourd’hui pour la carte) reste possible : ce qui est exclu, c’est un service qui s’exécuterait et se déploierait séparément.

## 5.2 Architecture retenue

Le back-office est construit comme une extension du projet existant :

- une **base de données** est ajoutée au projet (elle n’existe pas aujourd’hui : le site est statique, sans stockage persistant hormis `src/data/vitrine.json`, régénéré à chaque build) ; cette base est **physiquement distincte** de celle de Ressources 360, même si le même fournisseur est réutilisé (Neon) : aucune base partagée entre les deux systèmes, conformément à l’indépendance posée au §30 ;
- l’interface d’administration est une nouvelle section de l’application existante (routes dédiées sous `/admin`), construite avec la même stack (React + Vite) ;
- les opérations d’écriture (créer, modifier, publier) passent par de nouvelles fonctions serverless Vercel, sur le modèle de celles qui existent déjà dans le projet (`api/contact.js`) ;
- la publication d’un contenu suit le même principe que l’intégration actuelle avec Ressources 360 (`scripts/vitrine.mjs`) : le contenu est lu depuis la base **au moment du build**, puis injecté dans les pages prérendues. Publier un contenu déclenche donc un nouveau déploiement (via un deploy hook Vercel), avec un court délai plutôt qu’une mise à jour instantanée : c’est ce qui préserve le prérendu et le référencement du site.

## 5.3 Exigences fonctionnelles

Quelle que soit son implémentation précise, la solution doit fournir :

- authentification et gestion des rôles ;
- collections de contenu structurées (actualités, événements, partenaires, points de collecte, etc.) ;
- gestion des médias ;
- API interne de publication ;
- brouillons et statuts de publication ;
- historique / versioning des contenus ;
- publication programmée ;
- sauvegardes ;
- évolutivité pour les besoins futurs (§35).

## 5.4 Conséquence sur le chiffrage et le calendrier

Contrairement à une solution packagée, ces briques (authentification, rôles, éditeur de texte riche, versioning, publication programmée) ne sont pas fournies prêtes à l’emploi : elles doivent être développées. Le chiffrage et le calendrier (§43.2, §44.1) doivent intégrer ce travail de développement, en contrepartie de l’absence de coût d’hébergement et de maintenance d’un service tiers séparé.

## 5.5 Fonctionnement détaillé de la publication

- **Enregistrer un brouillon n’a aucun effet sur le site public.** Un brouillon est un simple enregistrement en base ; seule une action de publication déclenche la suite du processus ci-dessous.
- **Publier déclenche un nouveau déploiement du site** (§5.2) : le contenu est écrit en base, puis un déploiement Vercel est demandé via un deploy hook, qui régénère les pages concernées avec le contenu à jour.
- **Éviter les déploiements inutiles ou redondants.** Un ajout de média dans la médiathèque ne déclenche pas de déploiement à lui seul : seul un contenu réellement publié ou dépublié en déclenche un. Si plusieurs publications ont lieu en quelques secondes (plusieurs utilisateurs, ou plusieurs contenus publiés à la suite), les demandes de déploiement sont regroupées plutôt que déclenchées une à une, pour éviter des déploiements en double et rester dans les volumes raisonnables des offres utilisées (§43.2).
- **Retour visuel à l’utilisateur.** Après avoir cliqué sur « Publier », l’interface indique clairement l’état en cours (« Publication en cours... » puis « Publié, en ligne » avec un lien vers la page, ou un message d’échec explicite). Ce statut reflète l’état réel du déploiement, pas seulement l’enregistrement en base : un contenu marqué « publié » en base mais dont le déploiement a échoué n’est jamais présenté comme en ligne.
- **Un échec de déploiement ne casse jamais le site public.** C’est une garantie native de Vercel : un déploiement qui échoue à la construction ne remplace jamais la version en production, qui continue à servir la dernière version fonctionnelle. Le back-office doit simplement le signaler clairement à l’utilisateur plutôt que de le laisser dans l’incertitude.

## 5.6 Publication et dépublication programmées

Un contenu programmé (date de publication future) ou une campagne temporaire arrivée à sa date de fin (§19) ne peut pas se publier ou se dépublier tout seul sur un site prérendu : il faut qu’un nouveau déploiement soit déclenché au bon moment.

Mécanisme retenu : une tâche planifiée (par exemple Vercel Cron Jobs) vérifie régulièrement s’il existe des contenus dont la date de publication ou de fin de campagne vient d’être atteinte, et déclenche alors un déploiement selon le même principe que la publication manuelle (§5.5). La fréquence de vérification est un point à trancher en audit, selon les limites du plan Vercel utilisé (§43.2).

Ce mécanisme reste compatible avec le prérendu actuel : rien ne change dans la construction du site, seul le déclenchement du déploiement devient automatique plutôt que manuel.

---

# 6. PÉRIMÈTRE FONCTIONNEL V1

Le back-office V1 doit comporter les modules suivants :

1. Tableau de bord
2. Pages
3. Actualités
4. Événements
5. Ateliers
6. Partenaires et mécènes
7. Points de collecte publics
8. Médiathèque
9. Formulaires et demandes
10. Paramètres généraux
11. Navigation
12. SEO
13. Utilisateurs et rôles
14. Historique / versions
15. Bandeaux et campagnes temporaires

---

# 7. TABLEAU DE BORD

Créer une page d’accueil `/admin` simple et synthétique.

Afficher au minimum :

### Contenus

- nombre d’actualités publiées ;
- nombre de brouillons ;
- prochain événement ;
- contenus programmés ;
- contenus récemment modifiés.

### Points de collecte

- nombre de points actifs ;
- nombre de points temporaires ;
- nombre de points arrivant prochainement à expiration.

### Formulaires

- nouvelles demandes ;
- demandes à traiter ;
- demandes en cours ;
- demandes clôturées.

### Médias

- images récemment ajoutées ;
- médias sans texte alternatif ;
- éventuellement médias inutilisés.

### Actions rapides

Boutons :

- Ajouter une actualité
- Ajouter un événement
- Ajouter un partenaire
- Ajouter un point de collecte
- Ajouter un média
- Consulter les nouvelles demandes

---

# 8. MODULE PAGES

## 8.1 Objectif

Permettre la modification des pages institutionnelles existantes sans donner aux utilisateurs la possibilité de casser la mise en page du site.

Éviter un page builder totalement libre.

Utiliser des blocs structurés et contrôlés.

## 8.2 Champs généraux

Chaque page doit pouvoir comporter :

- titre interne ;
- titre public ;
- slug ;
- statut ;
- contenu ;
- image principale ;
- extrait éventuel ;
- SEO ;
- date de modification ;
- auteur de la modification.

## 8.3 Blocs autorisés

Prévoir des composants réutilisables tels que :

- texte riche ;
- titre + texte ;
- image ;
- image + texte ;
- galerie ;
- chiffres clés ;
- cartes ;
- appel à l’action ;
- citation ;
- accordéon / FAQ ;
- logos partenaires ;
- vidéo ;
- téléchargement de document ;
- encadré d’information ;
- liste ;
- tableau simple.

Les styles graphiques restent définis dans le code.

L’utilisateur admin choisit le contenu, pas la charte graphique.

## 8.4 Pages protégées

Certaines pages engagent l’association sur le plan juridique : mentions légales, politique de confidentialité, effacement des données, informations relatives aux garanties. Leur formulation a été validée avec soin et ne doit pas pouvoir être modifiée et publiée par n’importe quel profil disposant de droits éditoriaux.

- Ces pages sont marquées comme protégées dans le CMS.
- Seuls le Super administrateur et la Coordination (§21) peuvent les modifier.
- Toute modification, même par un profil autorisé, passe par le statut « à valider » avant publication, sans exception.
- La liste exacte des pages protégées est établie pendant l’audit à partir du contenu existant (au minimum : mentions légales, confidentialité, effacement des données, garanties de la page Boutique).

---

# 9. MODULE ACTUALITÉS

Créer une collection `Actualités`.

## Champs

- titre ;
- slug ;
- résumé ;
- contenu ;
- image principale ;
- galerie éventuelle ;
- catégorie ;
- auteur ;
- date de publication ;
- date de modification ;
- temps de lecture calculé automatiquement ;
- statut ;
- mise en avant ;
- affichage sur la page d’accueil ;
- tags éventuels ;
- SEO.

## Statuts

- brouillon ;
- à valider ;
- programmé ;
- publié ;
- archivé.

## Fonctions

- prévisualisation avant publication ;
- programmation de publication ;
- dépublication programmée ;
- duplication d’un article ;
- historique des versions.

---

# 10. MODULE ÉVÉNEMENTS

Créer une collection `Événements`.

## Champs

- titre ;
- slug ;
- image ;
- description courte ;
- description complète ;
- date de début ;
- heure de début ;
- date de fin ;
- heure de fin ;
- lieu ;
- adresse ;
- commune ;
- lien cartographique éventuel ;
- programme ;
- partenaires associés ;
- documents associés ;
- URL d’inscription éventuelle ;
- appel à l’action ;
- statut ;
- mise en avant sur l’accueil ;
- SEO.

## Statuts

- brouillon ;
- annoncé ;
- en cours ;
- terminé ;
- annulé ;
- archivé.

## Automatisations souhaitées

Un événement terminé peut automatiquement :

- ne plus apparaître dans les événements à venir ;
- rester consultable dans les événements passés.

---

# 11. MODULE ATELIERS

Créer une collection `Ateliers`.

## Champs

- nom ;
- slug ;
- thème ;
- public cible ;
- image ;
- description ;
- objectifs pédagogiques ;
- contenu / programme ;
- durée ;
- capacité / jauge ;
- lieu possible ;
- matériel nécessaire ;
- modalités ;
- tarif ou mention « sur devis » ;
- statut disponible / indisponible ;
- bouton de demande ;
- SEO.

## Catégories possibles

La structure doit permettre de gérer plusieurs familles d’ateliers, par exemple :

- numérique ;
- informatique ;
- réemploi ;
- végétal ;
- sensibilisation ;
- collectivités ;
- entreprises ;
- établissements scolaires.

Les catégories doivent être administrables et non codées en dur.

---

# 12. MODULE PARTENAIRES ET MÉCÈNES

Créer une collection unique `Organisations` avec catégories et statuts.

Cela évite de dupliquer les fiches.

## Champs

- nom ;
- logo ;
- type d’organisation ;
- description courte publique ;
- site internet ;
- commune ;
- coordonnées publiques éventuelles ;
- statut du partenariat ;
- date de début ;
- date de fin éventuelle ;
- ordre d’affichage ;
- visible sur le site : oui/non ;
- visible sur l’accueil : oui/non ;
- catégorie d’affichage ;
- notes internes éventuelles non publiques.

## Types

Prévoir au minimum :

- commune ;
- intercommunalité ;
- établissement public ;
- association ;
- entreprise ;
- mécène ;
- réseau ;
- partenaire technique ;
- partenaire logistique.

## Statuts internes

- prospect ;
- contact établi ;
- échange en cours ;
- partenariat en formalisation ;
- actif ;
- convention signée ;
- terminé ;
- archivé.

Les statuts internes ne doivent pas nécessairement être visibles publiquement.

---

# 13. MODULE POINTS DE COLLECTE PUBLICS

Attention : ce module concerne uniquement la **publication des lieux de collecte accessibles au public**.

Il ne remplace pas la traçabilité des collectes réalisée dans Ressource 360.

Créer une collection `Points de collecte`.

## Champs

- nom du lieu ;
- organisation liée ;
- logo éventuellement hérité de l’organisation ;
- adresse ;
- complément d’adresse ;
- code postal ;
- commune ;
- latitude ;
- longitude ;
- horaires ;
- consignes de dépôt ;
- type de point ;
- campagne associée ;
- date de début ;
- date de fin ;
- statut ;
- visible sur la carte ;
- visible dans la liste ;
- ordre éventuel ;
- informations temporaires.

## Types

- mairie ;
- entreprise ;
- association ;
- commerce ;
- déchèterie ;
- événement ;
- autre.

## Statuts

- brouillon ;
- prévu ;
- actif ;
- temporairement fermé ;
- terminé ;
- archivé.

## Comportement

Une information modifiée ici doit être répercutée partout où le point apparaît sur le site.

Il ne doit jamais être nécessaire de modifier plusieurs pages pour corriger un horaire ou une adresse.

---

# 14. MÉDIATHÈQUE

Créer une médiathèque centralisée pour les médias **publics** du site. Les documents confidentiels et les pièces jointes personnelles suivent une règle différente : voir §14.2, qui prime sur le reste de cette section.

## 14.1 Stockage retenu

Principe validé pour la V1 : les médias publics sont stockés comme des fichiers dans le dépôt `site-ressources` lui-même, ajoutés automatiquement via l’API GitHub au moment de l’upload dans le back-office, puis optimisés avec `sharp` (déjà utilisé par `scripts/optimiser-logos.mjs`, qui sert de modèle). Ce choix respecte la contrainte d’un seul déploiement (§5.1) et ne repose sur aucun service de stockage tiers.

Validé sous réserve des vérifications techniques de l’audit, notamment :

- **Compression avant transmission.** Si nécessaire (photo de téléphone de plusieurs Mo), réduire l’image côté navigateur avant l’envoi au serveur, pour rester sous les limites de taille des fonctions serverless Vercel et accélérer l’upload. Le traitement `sharp` côté serveur reste la source de vérité pour les tailles finales.
- **Conflits d’écriture GitHub.** Deux publications proches dans le temps peuvent entrer en conflit sur l’API GitHub (le fichier a changé entre la lecture de sa version et l’écriture). Prévoir une détection du conflit avec nouvelle tentative automatique sur la dernière version, plutôt qu’un échec silencieux ou une écriture qui écrase une modification concurrente.
- **Protection du dépôt.** Le jeton utilisé pour écrire depuis le back-office est un secret Vercel, limité au dépôt `site-ressources`, jamais exposé côté client. Il doit être associé à un compte GitHub que Vercel reconnaît comme collaborateur, sans quoi les déploiements déclenchés par une publication du back-office pourraient être bloqués silencieusement, comme cela s’est déjà produit sur d’autres dépôts de l’association pour cette raison.
- **Éviter de multiplier les fichiers dans l’historique.** Remplacer un média réécrit le même chemin de fichier plutôt que d’en créer un nouveau ; supprimer un contenu qui référence un média propose de supprimer le fichier associé s’il n’est plus utilisé ; l’indicateur « médias inutilisés » du tableau de bord (§7) sert à repérer et nettoyer les fichiers orphelins avant qu’ils ne s’accumulent.

## 14.2 Documents confidentiels et données personnelles : hors du dépôt

Le dépôt `site-ressources` est **public**. Aucun document confidentiel ni aucune pièce jointe contenant des données personnelles (par exemple les pièces jointes d’une candidature bénévole ou d’une demande, §15) ne doit y être stocké, quelle que soit la facilité qu’offrirait le mécanisme du §14.1. Ces fichiers restent dans la base de données du back-office, ou un espace de stockage privé si le volume le justifie. Voir §15 et §27.

## Formats

- JPG ;
- PNG ;
- WebP ;
- SVG si sécurisé ;
- PDF ;
- vidéo courte uniquement ; au-delà, privilégier un hébergement externe (lien ou intégration YouTube/Vimeo) plutôt que d’alourdir l’historique du dépôt.

## Données associées

Pour chaque média :

- fichier ;
- titre ;
- description ;
- texte alternatif ;
- crédit ;
- catégorie ;
- date d’ajout ;
- utilisateur ayant ajouté le fichier ;
- point focal éventuel ;
- usages du média si techniquement disponible.

## Traitement des images

Lors de l’upload :

- conserver un original ;
- générer automatiquement des formats optimisés ;
- produire des versions adaptées au responsive ;
- privilégier les formats modernes ;
- compresser sans dégradation excessive ;
- éviter les fichiers inutilement lourds.

Prévoir des tailles adaptées aux principaux usages :

- miniature ;
- carte ;
- article ;
- hero ;
- partage réseaux sociaux.

## UX

Pouvoir :

- rechercher un média ;
- filtrer par catégorie ;
- remplacer une image ;
- renseigner facilement le texte alternatif ;
- sélectionner une image existante sans la ré-uploader.

---

# 15. MODULE FORMULAIRES ET DEMANDES

Centraliser les formulaires du site dans le back-office.

Identifier lors de l’audit tous les formulaires actuellement présents.

Prévoir au minimum la possibilité de gérer :

- contact général ;
- demande d’enlèvement ;
- candidature bénévole ;
- demande d’atelier ;
- demande de devis ;
- prise de contact partenaire ;
- autres formulaires futurs.

## Chaque demande doit comporter

- identifiant ;
- type ;
- date et heure ;
- identité ;
- email ;
- téléphone si demandé ;
- commune si demandée ;
- contenu de la demande ;
- pièces jointes éventuelles ;
- statut ;
- utilisateur responsable ;
- notes internes ;
- historique.

## Statuts

- nouveau ;
- à traiter ;
- en cours ;
- en attente ;
- traité ;
- clôturé ;
- spam.

## Fonctions

- filtre ;
- recherche ;
- assignation ;
- notes internes ;
- export CSV si nécessaire ;
- notification email à réception ;
- archivage.

## Sécurité

Prévoir :

- protection anti-spam ;
- validation serveur ;
- limitation de débit si nécessaire ;
- aucune donnée personnelle sensible dans les logs techniques ;
- les pièces jointes ne sont jamais stockées dans le dépôt Git du site, qui est public (voir §14.2).

## Organisation par rubrique et réponse par email

Le module Formulaires et demandes n'est pas une simple liste : c'est l'espace où l'équipe traite ses demandes **à la place** d'une boîte email où tout est mélangé.

### Classement automatique

Chaque demande est rattachée automatiquement au type de formulaire dont elle provient, sans action manuelle de l'équipe. Le back-office présente des rubriques distinctes, au minimum :

- don de matériel ;
- partenariat végétal ;
- partenariats ;
- bénévolat et adhésion ;
- événements et ateliers ;
- contact général.

Chaque rubrique affiche le nombre de nouvelles demandes et le nombre de demandes restant à traiter, visibles sans avoir à ouvrir la rubrique (voir aussi le tableau de bord, §7).

### Vue globale et traitement

En complément des rubriques, une vue globale liste toutes les demandes, avec filtre par rubrique/statut et recherche. Depuis une fiche de demande, un utilisateur autorisé peut :

- l'attribuer à un membre de l'équipe ;
- suivre et modifier son statut (voir les statuts ci-dessus) ;
- ajouter des notes internes.

### Répondre par email depuis le back-office

Chaque fiche de demande comporte un bouton **« Répondre par email »**. La réponse part de l'adresse officielle de l'association, en réutilisant Brevo (déjà utilisé pour les notifications de formulaire et la newsletter, voir §16) plutôt qu'un nouvel outil d'envoi.

- Les emails envoyés depuis la fiche sont conservés dans l'historique de la demande, au même titre que les notes internes.
- Deux utilisateurs ne doivent pas pouvoir répondre simultanément à la même demande sans le savoir : la fiche signale qu'une réponse est en cours de rédaction par quelqu'un d'autre, pour éviter un double envoi.
- **Pour la V1**, les réponses que le destinataire renvoie par email continuent d'arriver dans la boîte email de l'association, sans remontée ni synchronisation automatique vers le back-office. Ce n'est pas une boîte de réception à double sens, seulement un canal d'envoi sortant.

### Ce qui reste hors de ce module

- **Les inscriptions à la newsletter restent gérées directement par Brevo** (§16) et ne sont pas traitées comme des demandes dans ce module.
- **La structure des formulaires publics n'est pas éditable depuis le back-office.** Il ne s'agit pas de créer un éditeur de formulaires : le nombre de champs, leur libellé et leur ordre sur le site restent gérés dans le code. Le back-office organise et traite les demandes déjà reçues, il ne modifie pas les formulaires qui les produisent.

Comme le reste du back-office, ce module doit rester simple et utilisable par des membres de l'équipe sans compétences techniques (§24).

---

# 16. NEWSLETTER

Le formulaire newsletter doit rester simple.

Si un outil de newsletter externe est déjà utilisé, conserver cet outil comme source principale des abonnés.

Le CMS ne doit pas obligatoirement dupliquer la liste complète des abonnés.

Le back-office doit au minimum permettre :

- de modifier le texte du bloc newsletter ;
- de modifier le CTA ;
- de gérer la connexion avec l’outil existant ;
- de vérifier qu’une inscription a bien été transmise.

Ne pas créer un nouvel outil d’emailing dans le CMS.

**Les tests du bloc newsletter (§37, §38) n’utilisent jamais une vraie adresse ajoutée à la liste de production** : l’outil externe déclenche ses propres automatisations (par exemple un email de bienvenue) dès l’ajout d’un contact, indépendamment du CMS et sans que celui-ci puisse l’en empêcher. Utiliser une liste de test dédiée ou une adresse jetable.

---

# 17. PARAMÈTRES GÉNÉRAUX

Créer une collection ou un singleton `Paramètres du site`.

## Informations générales

- nom de l’association ;
- logo ;
- favicon ;
- adresse ;
- téléphone ;
- email général ;
- email presse éventuel ;
- horaires éventuels ;
- SIRET si affiché ;
- autres mentions administratives nécessaires.

## Réseaux sociaux

- Facebook ;
- Instagram ;
- LinkedIn ;
- autres réseaux futurs.

## Liens externes

- plateforme de don ;
- newsletter ;
- billetterie éventuelle ;
- autres CTA globaux.

Une modification dans ces paramètres doit se propager automatiquement à tous les endroits du site concernés.

---

# 18. NAVIGATION

Permettre l’administration du :

- menu principal ;
- sous-menus ;
- footer ;
- liens secondaires.

## Contraintes

- empêcher la création de niveaux de navigation excessifs ;
- valider les URLs ;
- permettre l’ordre par glisser-déposer si possible ;
- permettre liens internes et externes ;
- permettre ouverture dans un nouvel onglet uniquement si nécessaire.

Les éléments essentiels ne doivent pas pouvoir être supprimés accidentellement sans confirmation.

---

# 19. BANDEAUX ET CAMPAGNES TEMPORAIRES

Créer un module `Campagnes / Bandeaux`.

Il doit permettre de publier une information temporaire sans intervention dans le code.

## Champs

- titre interne ;
- message ;
- lien ;
- texte du bouton ;
- type ;
- date de début ;
- date de fin ;
- actif ;
- emplacement.

## Types

- information ;
- événement ;
- alerte ;
- collecte ;
- appel à bénévoles ;
- campagne de soutien.

## Emplacements possibles

- bandeau global ;
- accueil ;
- page spécifique.

La campagne doit pouvoir s’activer et se désactiver automatiquement en fonction des dates.

---

# 20. SEO

Le back-office doit permettre de contrôler le SEO sans nécessiter une intervention dans le code.

## Pour chaque contenu public

- titre SEO ;
- meta description ;
- slug ;
- image Open Graph ;
- canonical si nécessaire ;
- index / noindex ;
- aperçu éventuel.

## Automatisations

Prévoir :

- sitemap généré automatiquement ;
- Open Graph ;
- données structurées lorsqu’elles sont pertinentes ;
- redirections 301 ;
- canonical par défaut ;
- contrôle des slugs ;
- URLs stables.

## Règle de migration

Les URLs actuelles doivent être conservées autant que possible.

Si une URL doit changer, créer automatiquement ou explicitement une redirection 301.

---

# 21. UTILISATEURS ET RÔLES

Prévoir plusieurs niveaux de droits.

## Super administrateur

Droits complets :

- configuration ;
- utilisateurs ;
- contenu ;
- données ;
- sécurité ;
- paramètres.

## Coordination

Peut gérer :

- pages ;
- actualités ;
- événements ;
- ateliers ;
- partenaires ;
- points de collecte ;
- formulaires ;
- médias ;
- paramètres éditoriaux.

Ne doit pas avoir accès aux paramètres techniques critiques si ce n’est pas nécessaire.

## Communication

Peut gérer :

- actualités ;
- événements ;
- médias ;
- contenus de communication ;
- SEO éditorial ;
- campagnes.

## Contributeur

Peut :

- créer des brouillons ;
- modifier les contenus qui lui sont autorisés.

Ne peut pas publier directement si la validation est activée.

## Lecture seule

Peut consulter le back-office mais ne peut rien modifier.

**Les pages protégées (§8.4) restent hors de portée des rôles Communication et Contributeur**, quel que soit le contenu qu’ils peuvent par ailleurs publier : ce n’est pas une autorisation qui peut être étendue à un autre rôle sans revoir ce cahier des charges.

---

# 22. WORKFLOW DE PUBLICATION

Pour les contenus importants, prévoir :

```text
BROUILLON
   ↓
À VALIDER
   ↓
PROGRAMMÉ
   ↓
PUBLIÉ
   ↓
ARCHIVÉ
```

Prévoir selon les droits :

- prévisualisation ;
- validation ;
- publication ;
- programmation ;
- dépublication ;
- archivage.

---

# 23. HISTORIQUE ET VERSIONING

Le back-office doit conserver un historique des modifications pour les contenus importants.

Afficher :

- utilisateur ;
- date ;
- type de modification ;
- version précédente.

Permettre si la solution CMS le permet :

- comparaison ;
- restauration d’une version précédente.

Priorité forte pour :

- pages ;
- actualités ;
- partenaires ;
- points de collecte ;
- paramètres globaux.

---

# 24. ERGONOMIE ET AUTONOMIE DES UTILISATEURS NON TECHNIQUES : EXIGENCE PRIORITAIRE

## 24.1 Public cible et principe directeur

Le back-office s’adresse notamment à des membres du bureau, responsables de communication et bénévoles qui savent utiliser un navigateur et remplir un formulaire, mais ne maîtrisent ni le code, ni les CMS, ni les notions techniques du web.

**Critère directeur :** les tâches courantes doivent être réalisables depuis une interface en français, explicite, prévisible et rassurante, sans intervention de Claude Code.

Les termes techniques tels que `collection`, `singleton`, `slug`, `API`, `cache`, `revalidation`, `Open Graph` ou `canonical` ne doivent pas être affichés dans le parcours standard. Ils restent accessibles seulement dans des paramètres avancés réservés aux profils autorisés, si nécessaire.

## 24.2 Accueil du back-office

La page `/admin` doit présenter un tableau de bord visuel sobre avec :

- un message d’accueil et les actions fréquentes (« Ajouter une actualité », « Ajouter une photo », « Ajouter un partenaire », « Modifier un point de collecte ») ;
- des cartes compréhensibles : Actualités, Photos et documents, Événements, Partenaires, Points de collecte, Messages reçus ;
- les informations utiles uniquement au rôle connecté ;
- le nombre de nouveaux messages et les contenus en attente de validation ;
- un accès permanent à « Voir le site » et à l’aide.

**Interdiction d’un écran d’accueil réduit à une liste brute de collections techniques.** Les libellés de navigation doivent reprendre le vocabulaire métier de Ressources.

## 24.3 Navigation par rôle

- Le menu de chaque utilisateur ne montre que les rubriques utiles et autorisées pour son rôle.
- Les réglages sensibles, informations personnelles et options techniques restent absents pour les profils qui n’y ont pas droit.
- Pas plus de deux niveaux de navigation pour les usages courants, sauf justification issue de l’audit.
- Recherche, filtres, fil d’Ariane ou retour clair vers la liste sur les écrans complexes.
- Les boutons d’action sont explicites : « Enregistrer le brouillon », « Prévisualiser », « Demander la validation », « Publier ».

**Les contrôles d’accès sont appliqués côté serveur** ; masquer un bouton ne suffit pas à sécuriser une fonction.

## 24.4 Formulaires guidés et progressifs

- Champs essentiels affichés d’abord, avec intitulés métier et exemples courts.
- Champs facultatifs ou techniques regroupés sous « Options avancées ».
- Champs obligatoires identifiables avant validation ; erreur affichée près du champ concerné, en français, avec action corrective.
- Valeurs par défaut cohérentes, contrôles de cohérence et listes déroulantes pour les statuts/catégories.
- Aide contextuelle à proximité des champs délicats, sans notice externe obligatoire.
- Création et modification d’une fiche réalisables sans devoir comprendre les relations entre tables ou collections.

### Exemple : création d’un partenaire

**Parcours normal :** « Ajouter un partenaire » → saisir le nom → ajouter son logo → sélectionner le type → saisir une courte présentation → « Prévisualiser » → « Publier ».

Les dates internes, paramètres d’ordre d’affichage et notes privées ne doivent pas être imposés pour cette opération simple.

## 24.5 Édition visuelle et modèles prêts à l’emploi

- Un éditeur de texte enrichi accessible permet titres, paragraphes, listes, liens, images et boutons approuvés, sans HTML à saisir.
- Prévoir des modèles de départ pour actualité, événement, atelier et partenaire.
- Prévoir un aperçu fidèle de la page publique **avant publication**, y compris sur ordinateur et téléphone ; il peut s’agir d’un aperçu plein écran et non nécessairement d’un éditeur « drag and drop ».
- Lorsque cela est techniquement pertinent, proposer une prévisualisation côte à côte pendant l’édition ; ne pas sacrifier la fiabilité de l’aperçu pour cette présentation.
- Les composants publics gardent leurs styles définis dans le code : l’utilisateur choisit les contenus et les blocs autorisés, pas une mise en page arbitraire.

## 24.6 Gestion simple des médias

- Ajout par sélection de fichier et par glisser-déposer sur ordinateur.
- Aperçu immédiat avant enregistrement et après insertion dans un article.
- Recadrage facile si nécessaire, sans obligation d’utiliser un logiciel graphique.
- Redimensionnement/optimisation automatiques selon la stratégie de stockage et de diffusion retenue.
- Champ « Description de l’image pour l’accessibilité » avec exemple clair ; texte alternatif obligatoire pour les images informatives, et possibilité de marquer une image comme décorative si approprié.
- Possibilité de réutiliser un média déjà présent plutôt que de l’importer à nouveau.
- Erreur compréhensible si le fichier est trop lourd ou dans un format non accepté.

## 24.7 Réduction du risque d’erreur

- Sauvegarde automatique des **brouillons** lorsque l’éditeur et la solution technique le permettent, ou à défaut sauvegarde explicite avec avertissement avant départ de la page ; afficher sans ambiguïté l’état « Modifications enregistrées » / « Modifications non enregistrées ».
- Aucune publication automatique d’un brouillon par simple sauvegarde.
- Confirmation avant suppression, dépublication ou changement susceptible de rendre une page indisponible.
- Restauration d’une version antérieure sur les contenus critiques.
- Notification de succès ou d’échec formulée en langage clair.
- Les suppressions définitives et modifications des permissions sont réservées aux rôles autorisés.

## 24.8 Aide intégrée et prise en main

- Ajouter une aide courte par écran (« Comment publier une actualité ? », « Comment modifier les horaires ? »).
- Fournir au minimum quatre guides illustrés : actualité avec photo, partenaire avec logo, point de collecte, événement.
- Prévoir des exemples de fiches de démonstration **dans un environnement de test**, jamais publiés par mégarde sur le site public.
- Prévoir un parcours de première connexion : présentation des rubriques accessibles, lien vers « Voir le site » et aide.

## 24.9 Présentation graphique du back-office

Le back-office reprend l’identité visuelle **actuellement utilisée par le site public** (`site-ressources`), pas la charte graphique institutionnelle du document officiel de l’association : palette kaki/olive/ocre et typographies Playfair Display + Inter, telles qu’utilisées aujourd’hui sur le site. Si cette identité évolue sur le site public, le back-office la suit, puisqu’il partage le même projet.

Interface sobre, lisible, hiérarchie typographique nette, contrastes suffisants, champs et boutons assez grands, espaces de respiration. Éviter les tableaux surchargés, les icônes seules sans libellé et la multiplication des réglages sur un même écran.

**Priorité à la clarté et à l’accessibilité, pas à la reproduction exacte des pages publiques sur les écrans d’administration.** Un écran de gestion (liste, formulaire, tableau) réutilise les couleurs, polices et composants de base du projet, avec une mise en page propre aux usages d’administration plutôt qu’une transposition d’une page vitrine.

## 24.10 Définition de « suffisamment simple »

La conformité UX est mesurée par les tests utilisateurs du § 37. Un écran techniquement fonctionnel ne sera pas considéré comme livré si les utilisateurs cibles n’arrivent pas à accomplir les tâches courantes sans assistance du développeur.

---

# 25. RESPONSIVE DU SITE ET DE L’ADMINISTRATION

Le site public doit conserver son fonctionnement responsive actuel.

Le back-office doit être pleinement utilisable sur ordinateur et tablette. Les actions simples doivent être praticables sur smartphone sans zoom horizontal :

- consulter une nouvelle demande ;
- corriger un horaire ;
- ajouter une photo ;
- modifier le statut d’un contenu ;
- publier une actualité courte lorsque les permissions l’autorisent.

L’édition très complexe de longues pages sur mobile peut rester moins confortable ; la création et la modification des contenus restent néanmoins accessibles sur ordinateur et tablette.

---

# 26. SÉCURITÉ

Mettre en œuvre au minimum :

- authentification sécurisée ;
- mots de passe correctement hachés ;
- cookies sécurisés ;
- contrôle d’accès serveur ;
- validation des permissions côté serveur ;
- protection des routes `/admin` ;
- protection des API ;
- limitation des tentatives de connexion ;
- protection anti-CSRF si nécessaire selon architecture ;
- validation stricte des uploads ;
- restrictions des types de fichiers ;
- gestion sécurisée des secrets ;
- aucune clé sensible exposée côté client.

Les variables d’environnement doivent rester dans Vercel / environnement sécurisé.

**Privilégier des bibliothèques d’authentification éprouvées** (gestion de session, hachage des mots de passe) plutôt qu’un système développé intégralement sur mesure : la contrainte d’un seul déploiement (§5.1) exclut un CMS packagé, elle n’exclut pas de s’appuyer sur des briques d’authentification reconnues plutôt que de réinventer cette partie sensible.

---

# 27. RGPD ET DONNÉES PERSONNELLES

Pour les formulaires :

- ne collecter que les données nécessaires ;
- permettre la suppression d’une demande ;
- permettre l’export si nécessaire ;
- permettre l’archivage ;
- définir une politique de conservation configurable ;
- ne pas copier inutilement les données dans plusieurs systèmes.

Ne pas définir arbitrairement une durée légale de conservation : la rendre configurable et la documenter pour validation par Ressources.

---

# 28. SAUVEGARDES

Le stockage retenu pour les médias publics (§14.1) et celui de la base de données ont des besoins différents :

- **Médias publics** : déjà versionnés et dupliqués par Git/GitHub (chaque commit garde l’historique complet). Aucune sauvegarde supplémentaire dédiée n’est nécessaire pour eux, au-delà de la disponibilité du dépôt lui-même.
- **Base de données** (contenus, brouillons, comptes, pièces jointes confidentielles du §14.2) : nécessite une vraie stratégie de sauvegarde, indépendante de celle de Ressources 360 (§5.2). Prévoir sauvegarde régulière, procédure de restauration testée au moins une fois, et documentation de la procédure.

La stratégie doit être compatible avec les services retenus et Vercel, et tenir compte des limites de sauvegarde réellement offertes par le plan gratuit du fournisseur de base de données choisi (§43.2) : à vérifier en audit plutôt qu’à supposer.

---

# 29. OBSERVABILITÉ ET JOURNAUX

Prévoir des logs techniques permettant de diagnostiquer :

- erreurs CMS ;
- échec formulaire ;
- échec d’upload ;
- problème de synchronisation ;
- erreur API.

Ne pas enregistrer inutilement les données personnelles des utilisateurs dans les logs.

---

# 30. INTÉGRATION RESSOURCE 360

## Impératif

**Pour la V1, par choix de périmètre et non par contrainte technique, le back-office reste indépendant de Ressources 360 : aucune interconnexion entre les deux dans un premier temps.**

Ce choix n’engage que la V1. Rien dans l’architecture retenue (§5) n’empêche techniquement d’ajouter plus tard une visualisation de certains aspects de Ressources 360 depuis le back-office : c’est une question de priorité, à rouvrir quand Ressources le souhaitera (voir §35), pas une limite définitive.

Concrètement, pour la V1 :

- le back-office n’appelle aucune donnée de Ressources 360 ;
- Ressources 360 n’appelle et ne consulte rien du back-office ;
- le mécanisme actuel de publication du matériel sur le site public (`scripts/vitrine.mjs`, exécuté au moment du build du site) reste **strictement inchangé** et **hors périmètre** de ce projet ;
- ne pas casser cette intégration actuelle en modifiant le processus de build du site.

Lors de la phase d’audit, documenter tout de même précisément ce mécanisme existant, pour s’assurer que le nouveau processus de build du back-office (§5.2) ne le perturbe pas.

## Dans le back-office, pour la V1

Ne pas créer de gestion parallèle du matériel, ni de widget de supervision de Ressources 360, même en lecture seule.

## Pour une version future

Une évolution ultérieure du back-office pourra ajouter des vues en lecture seule sur certains aspects de Ressources 360 (stock, statistiques...), sur demande explicite de Ressources : voir §35. `/api/vitrine` est déjà un point d’accès public non protégé qui pourrait servir de base à ce type d’écran le moment venu. C’est une évolution V2 possible, pas un objectif de la V1.

---

# 31. MIGRATION DU CONTENU EXISTANT

Le site actuel contient déjà des contenus.

Ils doivent être migrés vers le CMS sans perte.

## À migrer

Selon l’audit :

- pages institutionnelles ;
- actualités ;
- événements pertinents ;
- partenaires ;
- points de collecte ;
- ateliers ;
- paramètres globaux ;
- images ;
- SEO.

## Exigences

- conserver les contenus actuels ;
- conserver les URLs ;
- conserver les métadonnées utiles ;
- éviter les doublons ;
- ne pas dégrader le référencement ;
- vérifier les liens internes après migration.

Prévoir si possible un script de migration reproductible.

---

# 32. PERFORMANCE

Le back-office ne doit pas dégrader les performances du site public.

Prévoir selon l’architecture :

- cache ;
- revalidation ;
- génération statique lorsque pertinente ;
- optimisation des images ;
- requêtes limitées ;
- indexation des champs importants en base.

Une publication depuis le CMS doit apparaître sur le site dans un délai raisonnable sans nécessiter un nouveau déploiement manuel.

---

# 33. ACCESSIBILITÉ

Conserver ou améliorer l’accessibilité du site.

Prévoir notamment :

- textes alternatifs des images ;
- titres hiérarchisés ;
- labels de formulaires ;
- navigation clavier ;
- contrastes suffisants ;
- messages d’erreur compréhensibles.

Le CMS doit encourager la saisie des textes alternatifs et rendre les contrôles utilisables au clavier. Les libellés et messages d’erreur de l’administration doivent être compréhensibles sans connaissance technique.

---

# 34. CE QUI EST HORS PÉRIMÈTRE V1

Ne pas développer dans cette première phase :

- un nouvel ERP ;
- une deuxième version de Ressource 360 ;
- un nouveau système de gestion du matériel ;
- une comptabilité ;
- un CRM commercial complet ;
- un outil d’emailing complet ;
- un réseau social interne ;
- une refonte graphique globale du site ;
- un page builder totalement libre ;
- un éditeur permettant de modifier librement la structure des formulaires publics (champs, libellés, ordre) : elle reste gérée dans le code (voir §15).

Ces fonctions pourront être étudiées plus tard.

---

# 35. ÉVOLUTIONS V2 ENVISAGEABLES

Prévoir une architecture pouvant accueillir ultérieurement :

- gestion plus avancée des bénévoles ;
- inscriptions aux ateliers ;
- réservations ;
- statistiques d’impact ;
- tableaux de bord territoriaux ;
- éventuels tableaux de bord présentant, en lecture seule, certaines données de Ressources 360 : une **possibilité** à évaluer le moment venu, pas une synchronisation à développer dès maintenant (voir §30) ;
- intégration newsletter ;
- exports partenaires ;
- espace partenaires ;
- médiathèque presse ;
- workflow de validation avancé ;
- notifications internes ;
- carte dynamique avancée ;
- API publique maîtrisée.

Ces fonctions ne doivent pas alourdir la V1.

---

# 36. PHASAGE RECOMMANDÉ

## Phase 0 : Audit

- architecture ;
- dépendances ;
- intégrations ;
- contenu ;
- SEO ;
- Ressource 360 ;
- plan technique.

## Phase 1 : Socle et parcours débutants

- maquettage des parcours essentiels et validation des libellés avec l’équipe avant multiplication des formulaires ;
- CMS ;
- base ;
- authentification ;
- utilisateurs ;
- rôles ;
- médiathèque ;
- paramètres généraux.

## Phase 2 : Contenus

- pages ;
- actualités ;
- événements ;
- ateliers ;
- partenaires ;
- points de collecte.

## Phase 3 : Site public

- remplacement progressif des données codées en dur ;
- connexion des pages au CMS ;
- maintien des URLs ;
- preview ;
- cache / revalidation.

## Phase 4 : Formulaires

- centralisation ;
- statuts ;
- notifications ;
- anti-spam ;
- sécurité.

## Phase 5 : Finitions et validation UX

- test utilisateur sur les quatre tâches représentatives définies au § 37 ;
- correction des blocages et simplification des formulaires avant lancement ;
- dashboard ;
- versioning ;
- programmation ;
- SEO ;
- migration définitive ;
- tests ;
- documentation.

---

# 37. CRITÈRES DE RECETTE

Le projet sera considéré comme fonctionnel lorsque les scénarios suivants pourront être réalisés sans modifier le code.

## Actualité

Un utilisateur Communication peut :

1. se connecter ;
2. créer une actualité ;
3. ajouter une photo ;
4. renseigner son texte alternatif ;
5. prévisualiser ;
6. programmer la publication ;
7. retrouver automatiquement l’article sur le site.

## Partenaire

Un utilisateur autorisé peut :

1. créer un partenaire ;
2. importer son logo ;
3. définir son type ;
4. publier la fiche ;
5. le faire apparaître automatiquement aux endroits concernés.

## Point de collecte

Un utilisateur peut :

1. modifier les horaires ;
2. sauvegarder ;
3. constater que l’horaire est mis à jour partout sur le site sans modifier plusieurs pages.

## Événement

Un utilisateur peut :

1. créer un événement ;
2. renseigner date, lieu et programme ;
3. le mettre en avant sur l’accueil ;
4. définir sa date de fin ;
5. le voir basculer ensuite parmi les événements passés.

## Formulaire

Lorsqu’un visiteur remplit un formulaire :

1. les données sont validées ;
2. la demande apparaît dans le back-office ;
3. une notification est envoyée ;
4. un membre de l’équipe peut l’assigner ;
5. modifier son statut ;
6. ajouter une note interne ;
7. la clôturer.

## Ressource 360

Après installation du CMS :

1. l’intégration matériel existante fonctionne toujours ;
2. un matériel publié depuis Ressource 360 apparaît toujours correctement ;
3. son changement de statut reste synchronisé ;
4. aucune donnée matériel n’est dupliquée dans le CMS.

## Recette ergonomique : condition de mise en production

Organiser une séance avec **au moins deux personnes non techniques de l’équipe**, qui n’ont pas participé au développement du back-office. Elles disposent uniquement de leurs identifiants et du guide utilisateur court ; le développeur observe sans faire les actions à leur place.

Leurs missions, avec un compte correspondant à leurs permissions :

1. **Actualité :** créer un brouillon, ajouter une photo, renseigner sa description, prévisualiser sur ordinateur/mobile et publier ou soumettre à validation.
2. **Point de collecte :** retrouver un point existant, corriger ses horaires et vérifier que le changement est visible sur le site public à tous les emplacements concernés.
3. **Partenaire :** ajouter le nom, le logo, la catégorie et la description d’un partenaire, puis contrôler l’affichage public.
4. **Événement :** créer un événement, saisir date/lieu/programme, l’afficher sur l’accueil et le retrouver parmi les événements à venir.
5. **Erreur volontaire :** se tromper dans un champ, corriger l’erreur, retrouver un brouillon et revenir à une version précédente si la fonction est prévue.

**Condition d’acceptation :** les deux utilisateurs doivent accomplir seuls les quatre premières tâches sans intervention technique ; les incompréhensions, erreurs, hésitations majeures et blocages sont relevés et corrigés avant validation. Si les deux échouent sur une même étape, le problème doit être traité par l’interface (libellé, chemin, aide ou simplification), et non par une simple explication orale.

Le rapport de recette consigne : nom du scénario, rôle du testeur, réussite ou échec, points de friction, correction apportée, nouvelle validation. Aucun contenu créé pendant les tests ne doit être publié par mégarde sur le site public.

---

# 38. TESTS OBLIGATOIRES

Prévoir des tests de non-régression au minimum sur :

- navigation ;
- accueil ;
- actualités ;
- partenaires ;
- ateliers ;
- points de collecte ;
- formulaires ;
- newsletter (sans jamais utiliser l’outil externe de production, voir §16) ;
- SEO ;
- responsive ;
- uploads ;
- authentification ;
- permissions ;
- intégration Ressource 360.

Tester également les erreurs :

- image trop lourde ;
- mauvais format ;
- formulaire incomplet ;
- lien invalide ;
- slug déjà utilisé ;
- utilisateur sans permission ;
- erreur API.

---

# 39. DOCUMENTATION À LIVRER

À la fin du développement, créer dans le dépôt :

## Documentation technique

Exemple :

`/docs/backoffice-architecture.md`

Contenu :

- architecture ;
- base ;
- CMS ;
- stockage ;
- variables d’environnement ;
- API ;
- intégration Ressource 360 ;
- sauvegardes ;
- déploiement.

## Guide utilisateur pour débutants

Exemple :

`/docs/backoffice-guide-utilisateur.md`

Contenu simple :

- connexion ;
- publier une actualité ;
- ajouter une image ;
- modifier un partenaire ;
- modifier un point de collecte ;
- créer un événement ;
- traiter un formulaire ;
- comprendre les statuts « brouillon », « à valider », « publié » ;
- corriger une erreur et restaurer une ancienne version ;
- identifier les tâches qui nécessitent encore Claude Code.

Le guide doit être en français, illustré par captures d’écran après développement, et rédigé pour une personne sans expérience d’un CMS.

---

# 40. CONSIGNES DE DÉVELOPPEMENT POUR CLAUDE CODE

Avant de coder :

1. lire l’ensemble du projet ;
2. inspecter les composants et données existantes ;
3. identifier toutes les pages publiques ;
4. identifier toutes les données codées en dur ;
5. localiser précisément l’intégration Ressource 360 ;
6. vérifier la structure de déploiement Vercel ;
7. proposer un plan d’implémentation ;
8. présenter les principaux parcours d’administration sous forme de maquettes ou descriptions écran par écran ;
9. éviter les modifications inutiles.

Pendant le développement :

- réutiliser les composants existants ;
- préserver l’identité graphique ;
- préserver les URLs publiques ;
- préserver Ressource 360 ;
- faire des changements progressifs ;
- éviter les duplications de données ;
- maintenir un code lisible ;
- typer strictement les données si le projet utilise TypeScript ;
- documenter les choix structurants ;
- masquer les libellés techniques aux profils non techniques ;
- privilégier les parcours courts et les formulaires progressifs ;
- prévoir les migrations de base ;
- ne jamais stocker de secret dans le dépôt.

Après chaque grande phase :

- lancer les tests ;
- lancer le build de production ;
- vérifier l’absence d’erreurs TypeScript / lint pertinentes ;
- tester les pages affectées ;
- vérifier les données réelles existantes ;
- vérifier la non-régression Ressource 360.

---

# 41. PRIORITÉ PRODUIT

Le back-office doit avant tout être :

1. **simple à utiliser** ;
2. **fiable** ;
3. **difficile à casser** ;
4. **cohérent avec le site actuel** ;
5. **évolutif** ;
6. **sans duplication avec Ressource 360**.

La sophistication technique ne doit jamais être privilégiée au détriment de la simplicité d’usage.

---

# 42. RÉSULTAT ATTENDU

À terme, le fonctionnement quotidien doit être le suivant :

```text
ÉQUIPE RESSOURCES
       │
       ├───────────────┐
       │               │
       ▼               ▼
BACK-OFFICE        RESSOURCE 360
DU SITE            LOGICIEL MÉTIER
       │               │
       │               │
contenu             matériel
actualités          collecte
événements          traçabilité
partenaires         diagnostic
points publics      statut
ateliers            disponibilité
médias              vente
formulaires
SEO
       │               │
       └───────┬───────┘
               ▼
     ressourcesrecyclerie.fr
```

L’équipe doit pouvoir administrer l’ensemble du site public sans avoir à intervenir dans le code pour les opérations courantes, tout en conservant Claude Code pour les évolutions fonctionnelles, techniques et graphiques importantes.

---

# 43. LIMITES FONCTIONNELLES ET FRONTIÈRES D’ADMINISTRATION

Le CMS ne constitue **ni un outil de développement visuel illimité, ni un remplacement des autres logiciels de Ressources**. Les limites ci-dessous doivent être explicitement documentées et visibles dans le guide utilisateur.

| Demande de l’équipe | Réponse attendue |
|---|---|
| Modifier un texte, une image, un horaire ou des coordonnées | Faisable dans le back-office par un profil autorisé. |
| Publier une actualité, un partenaire, un atelier ou un événement | Faisable dans le back-office avec les modèles et champs prévus. |
| Adapter des contenus et blocs de page existants | Faisable dans les limites des blocs autorisés et des droits. |
| Refaire librement la charte graphique, créer une animation ou un nouveau type de composant | Intervention de développement / Claude Code, sauf option déjà prévue. |
| Créer une nouvelle fonction : réservation, billetterie intégrée, espace adhérent, nouveau paiement | Développement et configuration complémentaires, puis administration possible une fois la fonction créée. |
| Modifier les stocks, diagnostics, ventes, statuts et fiches matériel | À faire exclusivement dans Ressource 360 ; le CMS n’offre pas d’édition parallèle. |
| Envoyer des newsletters ou modifier les campagnes de dons hébergées sur des services tiers | À gérer dans l’outil concerné, sauf intégration spécifique validée et développée. |
| Changer une connexion API, restaurer une sauvegarde, mettre à jour des dépendances | Maintenance technique, pas opération éditoriale courante. |
| Analyser finement trafic, conversion, performance et impact territorial | Hors tableau de bord éditorial V1 ; s’appuyer sur les outils existants ou prévoir un développement V2. |

## 43.1 Préserver la simplicité plutôt qu’offrir une liberté sans limite

Le back-office doit permettre un ensemble défini d’opérations éditoriales fréquentes, mais **ne doit pas devenir un page builder permettant de modifier arbitrairement le HTML, les CSS ou le code**. Cette limite protège l’identité graphique, le responsive, les performances et la sécurité du site.

## 43.2 Coût et maintenance à préciser après audit

Le back-office étant intégré au projet existant plutôt que déployé comme service séparé (§5.1), il n’y a pas de coût d’hébergement ou d’abonnement CMS tiers à prévoir pour l’administration elle-même. Claude Code doit néanmoins chiffrer **avant mise en œuvre**, à partir de l’architecture réelle et des offres choisies : la nouvelle base de données, le stockage des médias, les sauvegardes, le volume d’emails et la maintenance. Le développement des briques qu’un CMS packagé aurait fournies (authentification, rôles, éditeur, versioning, publication programmée) représente en contrepartie un temps de développement supplémentaire à intégrer au calendrier (§44.1), plutôt qu’un coût récurrent de service.

**Documenter, pour chaque service gratuit retenu (base de données, dépôt Git, tâches planifiées...), les limites précises de son offre gratuite** (stockage, opérations, fréquence, bande passante) et ce qui se passerait en cas de dépassement. Ne jamais supposer que la V1 sera entièrement gratuite indéfiniment, ni annoncer un coût sans avoir vérifié les services effectivement utilisés.

## 43.3 Les intégrations ont des périmètres propres

Conserver les services déjà opérationnels. Avant de connecter un outil tiers au CMS, préciser pour chaque champ : qui est la source maître, qui peut le modifier, le sens de synchronisation, la gestion des erreurs, les permissions et le comportement si le service externe est indisponible.

---

# 44. LIVRABLES ET POINT D’ARRÊT AVANT CODAGE

## 44.1 Livrables obligatoires en fin d’audit (phase 0)

Claude Code remet :

1. un inventaire des pages et contenus existants ;
2. la cartographie de l’intégration Ressource 360 et de ses dépendances ;
3. un tableau de correspondance entre chaque contenu existant et son futur emplacement dans le CMS ;
4. un choix CMS argumenté et une architecture compatible avec le projet réel ;
5. le schéma des collections, relations et droits ;
6. des maquettes ou descriptions écran par écran du tableau de bord, d’une actualité, d’un partenaire, d’un point de collecte et de la médiathèque ;
7. les risques de régression, les coûts récurrents à vérifier, les limites précises des offres gratuites retenues (§43.2) et les points techniques incertains ;
8. un calendrier **en étapes de développement**, sans promettre de durée irréaliste, et la liste des tests de non-régression.

## 44.2 Validation

**Ne pas effectuer de migration massive ni remplacer les données du site public avant validation de l’audit et des parcours ergonomiques par Ressources.** Un premier prototype fonctionnel sur environnement de test doit précéder toute bascule en production. Les identifiants, secrets et données personnelles réelles ne doivent jamais être exposés dans les captures, maquettes ou logs.

## 44.3 Résultat final attendu

Une personne débutante doit être capable de publier une actualité illustrée, ajouter un partenaire, changer un horaire, créer un événement et traiter un formulaire avec le back-office, sans éditer le code. Le site public conserve ses URL, son identité visuelle et la synchronisation opérationnelle existante avec Ressource 360. Les limites du CMS et les opérations nécessitant Claude Code restent clairement documentées.
