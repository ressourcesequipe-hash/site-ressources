# Présentation `/inauguration` (3 octobre 2026)

Support visuel de la prise de parole : Ressources en quelques slides, puis
bascule vers la jauge `/defi` pour le décompte. Adresse :
`https://www.ressourcesrecyclerie.fr/inauguration`.

Même statut que `/defi` : hors du site (ni menu, ni bandeau, ni cookies, ni
mesure d'audience), non prérendue, `noindex` (balise + `X-Robots-Tag`), aucun
appel réseau une fois chargée. Code : `src/pages/Inauguration.jsx`, style
`src/inauguration/inauguration.css`, couleurs de la charte du site (kaki, olive, ocre, beige de `tailwind.config.js`), les mêmes que `/defi`.

## Parcours

1. Accueil · 2. Ressources, c'est quoi ? · 3. Réemploi / Solidarité / Territoire
(les trois blocs apparaissent un à un) · 4. Un territoire qui se mobilise
(communes et partenaires lus dans `src/data/defiConfig.js`) · 5. Le défi
(4 apparitions : « Et pour le vérifier… », « Nous nous sommes lancé un défi. »,
« 500 KG », détail et dates) · 6. Lancer le décompte · 7. Final (titre, trois verbes, CONSTRUIRE à part « ensemble, autour d’une dynamique locale »,
remerciements, logo, adresse).

Pour changer un texte : les slides sont les composants du haut de
`Inauguration.jsx` ; l'ordre est le tableau `SLIDES`.

## Commandes

| Geste | Effet |
|---|---|
| `→` `Espace` `PageDown` `Entrée` | Apparition suivante, puis slide suivante |
| `←` `PageUp` | Retour |
| `F` | Plein écran (`Échap` pour sortir) |
| Slide « Lancer » : `Entrée`, `Espace`, `→` ou le bouton | Ouvre la jauge |

Flèches ‹ › très discrètes dans les angles, compteur « 2 / 7 » en bas à gauche.

## Lien avec la jauge

« Lancer le décompte » ouvre `/defi` par navigation interne : pas de
rechargement, donc le plein écran, le `localStorage` (les collectes préparées)
et la musique restent en place. Sur `/defi`, le bouton **FIN** de la barre du
bas ouvre l'écran « Merci ! » ; son bouton **Continuer →** revient sur
`/inauguration?slide=final`. `/defi` n'est modifiée que par ce bouton.

**Il faut projeter `/inauguration` et `/defi` dans le même navigateur** (même
origine, même profil), sinon les collectes préparées ne sont pas visibles.

## Accès direct, secours

`?slide=` accepte un numéro (`3`) ou un nom : `accueil`, `ressources`,
`dynamiques`, `territoire`, `defi`, `lancer`, `final`. F5 garde la slide
(URL + `sessionStorage`). Une slide ouverte directement s'affiche entièrement
révélée.

Plan B : onglet 2 sur `/defi`, onglet 3 sur `/inauguration?slide=final`.

## Jour J

1. Ordinateur branché, Chrome, **même profil** que celui où les collectes sont préparées.
2. Ouvrir `/defi`, vérifier le total préparé (panneau `O`), puis « Revenir à 0 kg ».
3. Ouvrir `/inauguration` dans un autre onglet, `F` pour le plein écran.
4. Couper notifications Windows, WhatsApp, Gmail.
5. Dérouler une fois jusqu'à « Lancer », revenir en arrière avec `←`.
6. Internet : utile seulement si les polices (bunny.net) ne sont pas en cache ; repli Georgia / Segoe UI.

## Logos de la slide « territoire »

Originaux dans `design/logos-sources/partenaires/` (ignoré par git, jamais
déployé). `node scripts/logos-inauguration.mjs` les convertit en WebP dans
`public/logos/inauguration/` (marges blanches des JPG retirées, logos jamais
recolorés). La liste `logosPartenaires` de `Inauguration.jsx` associe chaque
nom de `defiConfig.js` à son fichier ; les logos blancs (Saint-Geours, dont la version négative est générée par le script à partir du logo noir, Seignosse,
Vieux-Boucau, Saint-Vincent-de-Tyrosse, Labenne) sont posés sur une tuile
kaki. Un nom sans logo (Imagine Linxe, Landes Attractivité) s'affiche en texte
sous la rangée. Pour ajouter un logo : déposer le fichier, l'ajouter à
`scripts/logos-inauguration.mjs` et à `logosPartenaires`.
