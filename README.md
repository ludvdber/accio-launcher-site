# Accio Launcher — Site

Page vitrine d'[Accio Launcher](https://github.com/ludvdber/AccioLauncher), le launcher pour les
8 jeux Harry Potter PC (2001–2011).

**→ [acciolauncher.be](https://acciolauncher.be/)**

## Ce qu'il y a dedans

HTML, CSS et JavaScript à la main. Pas de framework, pas de bundler, pas de dépendance :
ce qui est dans le dépôt est exactement ce qui est servi.

```text
index.html          page unique : hero, jeux, aperçu du launcher,
                    avant/après, communauté, FAQ, footer
css/styles.css      tous les styles (variables dans :root, polices Cinzel auto-hébergées)
js/main.js          une IIFE : particules, animation de frappe, apparitions au scroll,
                    slider avant/après, onglets, bascule FR/EN, compteur de
                    téléchargements et version lus sur l'API GitHub
assets/             images, polices, audio, vidéo — voir ci-dessous
```

Le site est bilingue : le français est écrit dans le HTML, l'anglais vit dans le
dictionnaire `i18n.en` de `js/main.js`. Chaque texte porte un attribut `data-i18n` —
un nouveau texte a besoin des deux.

## Images

Tout ce que la page charge est un JPEG en 1920×1080, entre 200 et 450 Ko. Les captures
brutes en pleine résolution et le pack logo complet restent sur le disque dans `_local/`,
qui est ignoré par git — comme toute image déposée à la racine du dépôt.

Les paires avant/après sont recadrées en 16:9 après alignement : le rendu amélioré a un
champ de vision plus étroit que l'original, et un slider mal aligné donne l'impression
que la caméra bouge.

## Aperçu local

Aucune installation, aucune compilation. Un serveur statique suffit :

```bash
python -m http.server
# ou
npx serve .
```

Puis `Ctrl+Shift+R` pour passer outre le cache du navigateur.

## Mise en ligne

Un push sur `main` suffit : GitHub Pages sert la racine du dépôt. `.nojekyll` désactive
le traitement Jekyll, `CNAME` porte le domaine.

## Mentions

Projet communautaire indépendant, non affilié à Warner Bros. Entertainment Inc. ni à
Electronic Arts Inc. Les jaquettes et visuels des jeux appartiennent à leurs ayants droit.
Harry Potter™ est une marque déposée de Warner Bros. Entertainment Inc.
