# Interface de projection `/defi` (3 octobre 2026)

Page d'écran géant : compteur animé, flèche de progression, dépassement des
500 kg. Adresse : `https://www.ressourcesrecyclerie.fr/defi`.

## Ce que la page n'est pas

Hors du site : pas de menu, pas de lien, pas dans `sitemap.xml`, pas
prérendue, balise `noindex, nofollow` **et** en-tête `X-Robots-Tag` (`vercel.json`).
Bandeaux de campagne, demande de consentement et mesure d'audience y sont coupés.
Elle ne fait aucun appel réseau une fois chargée.

## Où vit l'état

Dans le `localStorage` **du navigateur qui projette**. Conséquences :
- un visiteur qui ouvre `/defi` voit son propre écran à 0 kg : il ne peut rien
  changer sur l'ordinateur de la salle ;
- il faut préparer et projeter **sur le même ordinateur et le même navigateur**
  (ou transporter les données par le JSON) ;
- vider les données du navigateur efface la présentation.

Il n'y a pas de code PIN : la barre du bas et le panneau sont accessibles à
qui ouvre la page (décision du 29/09/2026).

## Utilisation le jour J

La barre du bas est visible dès l'ouverture : compteur de collectes,
précédente / suivante, saisie du jour (date du jour pré-remplie).

| Geste | Effet |
|---|---|
| `→` / `←` | Collecte suivante / précédente |
| `F` | Plein écran (`Échap` pour sortir) |
| `B` | Masque / affiche la barre du bas |
| `O` ou ⚙ en bas à droite | Ouvre / ferme le panneau opérateur complet |
| `M` ou icône en haut à droite | Sourdine / remise du son de la musique |

La musique (`public/audio/fond.mp3`) démarre à l'ouverture de la page ; si le
navigateur refuse le démarrage automatique, elle démarre au premier clic ou à
la première touche.

Mode B (recommandé) : collectes préparées, on appuie sur `→`.
Mode A : saisie date + poids, « + Ajouter ».
Les touches sont inactives pendant une animation (anti double-clic).
« Annuler la dernière action » (panneau) restaure l'état précédent (30 niveaux).

## Préparer les collectes avant le 3 octobre

1. Sur l'ordinateur de la salle : touche `O` pour le panneau.
2. Bloc « Enregistrement de collecte » : date, poids, **Préparer sans afficher**.
   Les collectes se rangent par date, l'écran reste à 0 kg.
3. Ou, en bloc : `src/data/defiCollectes.json`
   (`[{"date":"2026-09-03","poids":32}, …]`, dates ISO) puis déploiement,
   puis « Restaurer les données du fichier ». Ou coller le JSON dans le bloc
   « Données (JSON) » → Appliquer.
4. Répéter avec « Charger la démonstration » (9 collectes, 847 kg), puis
   « Revenir à 0 kg (garde les collectes) » avant l'événement.

## Réglages

`src/data/defiConfig.js` : objectif et dates (`challenge`), `communes`,
`collectionPoints`, `partners`, `SOUND_ENABLED`, `MUSIC_FILE`, `MUSIC_VOLUME`, démo.

## Règles de conception

- Le cumul est recalculé depuis la liste, jamais stocké seul.
- Aucun poids n'est rattaché à une commune, un point ou un partenaire.
- La célébration des 500 kg ne se joue qu'une fois ; elle se réarme si on
  revient sous 500 kg (précédente, annulation, correction).
- La jauge : 500 kg à 75 % de la flèche, le reste (ocre) est le dépassement,
  dont l'échelle s'élargit seule (`position()` dans `src/defi/store.js`).

## Sons

Au franchissement des 500 kg : fanfare + applaudissements synthétisés
(`src/defi/son.js`), musique de fond baissée pendant la célébration. Coupure
générale : `SOUND_ENABLED = false` dans `defiConfig.js`. Le navigateur ne joue
un son qu'après un clic ou une touche.
