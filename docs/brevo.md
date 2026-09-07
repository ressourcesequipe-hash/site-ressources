# Brevo — listes de contacts et formulaires

Les formulaires du site font deux choses à chaque envoi : ils **notifient
l'équipe par email** (comme avant) et ils **enregistrent le contact dans Brevo**
dans la bonne liste.

La description des listes, des attributs et du routage vit dans un seul
fichier : [`lib/brevo.js`](../lib/brevo.js). L'API `api/contact.js` y écrit, les
formulaires y prennent leurs menus déroulants, et le script d'installation y
vérifie les listes.

Compte concerné : **Ressources Recyclerie** (`contact@ressourcesrecyclerie.fr`).

---

## Les cinq listes

Elles existent déjà dans Brevo et sont **gérées à la main** : le script ne les
crée pas, il retrouve leur identifiant par le nom. Les noms dans `lib/brevo.js`
doivent donc correspondre au caractère près à ceux du compte.

| Liste | Alimentée par |
| --- | --- |
| **001-NEWSLETTERS** | Formulaire newsletter · inscription à l'événement de lancement · toute case de consentement cochée |
| **002 - Donateurs / Apports** | Demande d'enlèvement · contact « don de matériel » ou « don de plantes » |
| **003 - Bénévoles / Candidats** | Formulaire bénévole · nous rejoindre (bénévolat) · contact « bénévolat ou adhésion » |
| **004 - Partenaires / Prospects** | Point de collecte · partenariat végétal · nous rejoindre (mécénat, partenariat) · contact « partenariat ou mécénat » |
| **005 - Tombola** | Billetterie, alimentée hors site. Le site n'y écrit pas. |

### Routage selon le menu déroulant

Deux formulaires demandent au visiteur ce qui l'amène, et sa réponse décide de
la liste. Les options sont définies dans `lib/brevo.js` (`ENGAGEMENTS` et
`SUJETS_CONTACT`) et les pages les affichent depuis là : renommer une option la
renomme à l'écran **et** met à jour le routage, sans risque de divergence.

**Nous rejoindre** — menu « type d'engagement » :

| Choix | Liste |
| --- | --- |
| Bénévolat (informatique, végétal, événements) | 003 - Bénévoles / Candidats |
| Mécénat / Sponsoring | 004 - Partenaires / Prospects |
| Partenariat institutionnel | 004 - Partenaires / Prospects |
| Autre, ou menu non renseigné | 003 - Bénévoles / Candidats |

**Contact** — menu « sujet » :

| Choix | Liste |
| --- | --- |
| Don de matériel informatique | 002 - Donateurs / Apports |
| Don de plantes ou végétaux | 002 - Donateurs / Apports |
| Bénévolat ou adhésion | 003 - Bénévoles / Candidats |
| Partenariat ou mécénat | 004 - Partenaires / Prospects |
| Achat solidaire | aucune liste |
| Autre question | aucune liste |

« Aucune liste » ne veut pas dire « perdu » : le contact est bien créé dans
Brevo avec ses attributs (`SOURCE`, `DATE_DERNIER_CONTACT`…) et l'équipe reçoit
la notification. Il n'entre simplement dans aucune liste de diffusion.

---

## La règle à ne pas enfreindre

**Une campagne marketing ne cible que 001-NEWSLETTERS.**

Les autres listes contiennent des gens qui ont écrit à l'association pour une
raison précise — donner un ordinateur, proposer un local — sans avoir demandé à
recevoir quoi que ce soit d'autre. Leur envoyer une campagne, c'est de la
prospection sans consentement.

Trois garde-fous sont en place :

- la case « Je souhaite recevoir la newsletter » est **décochée par défaut** sur
  tous les formulaires, et c'est elle seule qui fait entrer dans
  001-NEWSLETTERS ;
- deux formulaires y entrent sans case, parce que s'y inscrire **est** l'acte de
  consentement : le formulaire newsletter, et l'inscription à l'événement de
  lancement — dont le texte annonce explicitement qu'on rejoint la lettre de
  l'association ;
- l'attribut `OPTIN_NEWSLETTER` vaut `true` ou `false` sur chaque contact, ce qui
  permet de construire un segment de sécurité dans Brevo si besoin.

L'API ne renvoie **jamais** `emailBlacklisted` : quelqu'un qui s'est désinscrit
ne peut pas être réinscrit de force en renvoyant un formulaire.

---

## Installation

### 1. La clé API

Elle est déjà en place sur ce poste : `C:\Users\Mini7\secrets\brevo-ressources.txt`,
hors de tout dépôt Git. Ne jamais la déposer dans ce dépôt — il est public.

### 2. Créer les attributs et relever les identifiants de listes

Depuis la racine du dépôt :

```bash
BREVO_API_KEY="xkeysib-…" npm run brevo:setup -- --dry-run
```

Le mode `--dry-run` affiche le compte visé et ce qui serait créé, sans rien
écrire. Vérifiez que le compte est bien **Ressources Recyclerie**, puis relancez
sans `--dry-run`.

Le script est idempotent : il ne crée que les attributs manquants, ne renomme
rien, ne supprime jamais. Si une liste est introuvable, il s'arrête et affiche
le nom exact attendu plutôt que d'en créer une en double.

### 3. Reporter les identifiants dans Vercel

Le script termine en affichant une ligne comme :

```
BREVO_LISTS
{"newsletter":2,"donateurs":3,"benevoles":4,"partenaires":5,"tombola":6}
```

Dans Vercel → `Settings → Environment Variables`, ajouter :

| Variable | Valeur | Environnements |
| --- | --- | --- |
| `BREVO_API_KEY` | la clé du compte Ressources | Production, Preview |
| `BREVO_LISTS` | le JSON affiché par le script | Production, Preview |
| `BREVO_TEMPLATE_BIENVENUE` | l'identifiant du modèle (voir plus bas) | Production, Preview |

Puis redéployer.

> Tant que `BREVO_LISTS` est absente, le site se comporte exactement comme
> avant : les formulaires notifient l'équipe par email, sans rien écrire dans
> Brevo. C'est le repli en cas de problème — il suffit de retirer la variable.

---

## Les attributs de contact

| Attribut | Type | Rempli depuis |
| --- | --- | --- |
| `PRENOM`, `NOM` | texte | Champ nom du formulaire (découpé au dernier espace) |
| `TELEPHONE` | texte | Champ téléphone |
| `COMMUNE` | texte | Champ commune |
| `ADRESSE` | texte | Adresse d'enlèvement |
| `STRUCTURE` | texte | Nom de la structure |
| `TYPE_STRUCTURE` | texte | Commerce, commune, association… |
| `MISSION` | texte | Mission bénévole ou type d'engagement |
| `SOURCE` | texte | Nom du formulaire d'origine |
| `OPTIN_NEWSLETTER` | booléen | Case de consentement |
| `DATE_DERNIER_CONTACT` | date | Réécrit à chaque envoi |

`DATE_DERNIER_CONTACT` est ce qui fait courir la durée de conservation annoncée
dans la politique de confidentialité (« 3 ans après le dernier contact »).

Le téléphone est un attribut **texte**, pas l'attribut standard `SMS` : Brevo
rejette le contact entier si le numéro n'est pas au format international, et les
visiteurs saisissent « 06 12 34 56 78 ».

---

## L'email de bienvenue

Qui rejoint la lettre d'information reçoit aussitôt un message de remerciement —
quelques secondes, pas cinq minutes.

Le HTML vit dans [`emails/newsletter-bienvenue.html`](../emails/newsletter-bienvenue.html),
versionné dans ce dépôt. `npm run brevo:template` le pousse dans Brevo, où il
devient un modèle transactionnel. Le script retrouve le modèle par son nom et le
met à jour : relancé, il ne crée pas de doublon.

> ⚠️ Retoucher le modèle dans l'interface Brevo puis relancer le script **écrase
> les retouches**. Reportez-les dans `emails/` sinon elles sont perdues.

**Qui le reçoit, et une seule fois.** Avant d'enregistrer le contact, l'API
demande à Brevo s'il figure déjà dans 001-NEWSLETTERS. Si oui, pas de second
message : quelqu'un qui remplit un autre formulaire des mois plus tard n'est pas
réaccueilli. Quelqu'un inscrit à une autre liste qui coche enfin la case, lui,
le reçoit. En cas de doute — contact inconnu, appel en échec — le message part :
mieux vaut un email de trop qu'un abonné jamais accueilli.

En double opt-in, aucun email de bienvenue : l'email de confirmation joue ce
rôle, et l'inscription n'est pas encore acquise au moment de l'envoi.

**Contraintes du format**, à respecter en modifiant le fichier — elles sont
rappelées en commentaire en tête :

- mise en page en tableaux et styles en ligne, Outlook ignore le CSS moderne ;
- 600 px de large, la valeur que tous les clients gèrent ;
- pas de police web : Open Sans n'est pas chargeable dans un email, les replis
  Helvetica et Georgia sont ce que la plupart des gens verront ;
- images en PNG servies par le site, jamais en WebP, qu'Outlook desktop ne sait
  pas afficher ;
- couleurs de fond toujours explicites, sinon le mode sombre de certains clients
  les remplace.

**Palette.** Relevée dans `charte-graphique-site.png` — attention, ce document
s'intitule « Analyse du site » et se présente comme une *proposition*
d'application de la charte ; il diverge de la charte officielle. Ses pastilles
« Éléments annexes » portent des codes erronés, recopiés de la ligne
« Les fonds » : l'ocre réel, relevé dans l'image, est **`#C49845`**.

Trois écarts de contraste ont été corrigés par rapport à une lecture littérale
de la palette, une case de consentement et un appel à l'action devant rester
lisibles :

| Élément | Choix littéral | Retenu | Contraste |
| --- | --- | --- | --- |
| Texte du bouton | blanc sur ocre | `#2B3520` sur ocre | 2,65 → 4,85:1 |
| Sous-titre du bandeau | crème sur vert | blanc sur vert | 3,79 → 4,55:1 |
| Texte du pied | `#726E24` sur crème | `#404C2F` sur crème | 4,40 → 7,63:1 |

**Désabonnement.** Le lien du pied est un `mailto:` : un email transactionnel
n'a pas de lien de désinscription géré par Brevo. Les vraies campagnes, elles,
en reçoivent un automatiquement.

---

## Double opt-in (optionnel, recommandé)

Par défaut, le consentement inscrit directement à 001-NEWSLETTERS. Le double
opt-in ajoute un email de confirmation : l'inscription n'aboutit qu'après le
clic du destinataire. C'est la pratique recommandée par la CNIL, et elle protège
la réputation d'envoi du domaine.

Pour l'activer, il faut trois choses :

1. **Un modèle d'email de confirmation** dans Brevo
   (`Campagnes → Modèles`), de type double opt-in. Noter son identifiant.
2. **Une page de confirmation** sur le site, par exemple
   `/newsletter-confirmee/`. *Elle n'existe pas encore : à créer avant
   d'activer.*
3. **Deux variables d'environnement** dans Vercel :

| Variable | Valeur |
| --- | --- |
| `BREVO_DOI_TEMPLATE_ID` | l'identifiant du modèle |
| `BREVO_DOI_REDIRECT_URL` | `https://ressourcesrecyclerie.fr/newsletter-confirmee/` |

Tant que ces deux variables sont absentes, le code emprunte le chemin simple.
Les listes métier ne sont pas concernées : elles sont alimentées directement
dans les deux cas.

---

## Ajouter une liste ou un formulaire

1. Créer la liste dans Brevo, puis la déclarer dans `LISTES` (`lib/brevo.js`)
   avec son nom exact.
2. Déclarer le formulaire dans `FORMULAIRES` : les listes visées — un tableau,
   ou une fonction des données saisies pour un routage selon un menu — et la
   traduction de ses champs en attributs.
3. Ajouter son libellé dans `SOURCES`.
4. Ajouter le modèle d'email de notification dans `templates`
   (`api/contact.js`).
5. Relancer `npm run brevo:setup` et remplacer `BREVO_LISTS` dans Vercel.

⚠️ Dans un formulaire, **ne jamais nommer un champ `type`** : le discriminant
envoyé à l'API s'appelle `type`, et un champ homonyme l'écrase au moment du
spread. C'est ce qui a empêché le formulaire « point de collecte » de
fonctionner jusqu'ici. Placer le discriminant après le spread
(`{ ...champs, type: 'monFormulaire' }`) protège de ce piège.

---

## Vérifier que ça marche

### Avant de déployer

```bash
npm run brevo:test
```

Le script rejoue les huit formulaires contre `api/contact.js` avec un `fetch`
espion : rien n'est envoyé, aucune clé réelle n'est nécessaire. Il vérifie le
routage de chaque menu déroulant, que 001-NEWSLETTERS n'est alimentée que sur
consentement, que `emailBlacklisted` n'est jamais renvoyé, et que le HTML des
notifications est échappé. Pour rejouer avec les listes actives, ou en double
opt-in :

```bash
BREVO_LISTS='{"newsletter":2,"donateurs":3,"benevoles":4,"partenaires":5,"tombola":6}' npm run brevo:test
```

En ajoutant `BREVO_TEMPLATE_BIENVENUE=1`, il vérifie aussi l'email de bienvenue :
envoyé au nouvel inscrit, jamais à quelqu'un déjà dans la liste, jamais sans
consentement, et jamais en double opt-in.

### Après déploiement

Envoyer un formulaire de test puis :

- **Logs Vercel** (`Deployments → Functions → api/contact`) : la ligne
  `Contact Brevo enregistré: …` confirme l'écriture. `Brevo contacts HTTP 4xx`
  signale un rejet, avec le détail renvoyé par Brevo.
- **Brevo → Contacts** : le contact doit apparaître dans la liste attendue, avec
  ses attributs.

Un échec d'écriture dans Brevo **ne fait jamais échouer le formulaire** : la
notification à l'équipe part d'abord, le visiteur voit son message de
confirmation, et l'erreur est tracée dans les logs.

---

## Reste à faire

- **Anti-spam.** Les formulaires n'ont ni honeypot ni limitation de débit. Tant
  qu'ils ne faisaient qu'envoyer un email, le coût d'un robot était un message
  parasite ; maintenant qu'ils écrivent dans Brevo, il pollue la base de
  contacts.
- **Page de confirmation** `/newsletter-confirmee/`, préalable au double opt-in.
- **Contrat de sous-traitance (DPA).** Brevo en fournit un ; il doit être
  accepté depuis le compte de l'association.
- **Plafond du plan gratuit : 300 envois par jour**, partagés entre les
  notifications à l'équipe et les emails de bienvenue. Chaque formulaire envoyé
  coûte un crédit, deux si la personne s'abonne. À surveiller si le trafic
  monte.
- **Scénarios d'automatisation.** L'endpoint `/v3/automations` renvoie 404 sur
  ce compte : les workflows Brevo ne se créent que dans leur interface, et
  l'option n'apparaît pas sur le plan gratuit. D'où l'envoi par le code plutôt
  que par un scénario.
- **Après le 3 octobre 2026.** L'inscription à l'événement de lancement
  disparaîtra avec la page ; rien à défaire côté Brevo, les contacts restent
  dans 001-NEWSLETTERS.
