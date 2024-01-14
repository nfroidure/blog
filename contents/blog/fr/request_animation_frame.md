---
title: Utilisation de requestAnimationFrame pour les jeux HTML5
description: Une nouvelle spécification permet d'optimiser l'affichage des jeux HTML5 en synchronisant ces derniers avec le moteur graphique du navigateur. Petit exemple de mise en oeuvre avec notre casse brique.
leafname: request_animation_frame
link:
  label: requestAnimationFrame
  title: En savoir plus sur cette nouvelle possibilité pour les jeux HTML5
date: "2012-07-26T08:13:35.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - HTML5
  - Jeux
categories:
  - Jeux HTML5
---

# Utilisation de `requestAnimationFrame` pour les jeux HTML5

---

⚠ Attention: Cet article est ancien et ne correspond pas à l'état de l'art de la création de casse briques pour le navigateur.

---

Une nouvelle spécification permet d'optimiser l'affichage des jeux HTML5 en synchronisant ces derniers avec le moteur graphique du navigateur. Petit exemple de mise en oeuvre avec notre casse brique.

Le [code de notre casse brique](https://github.com/nfroidure/Breakit "Voir son code sur GitHub") consiste en une fonction appelée régulièrement (toutes les 30ms) par la fonction `setTimeout`. J'expliquais dans l'[article dédié au développement du casse brique](./html5_casse_brique "Voir l'article en question") que cette manière de faire permettait de faire ralentir le jeu en cas de difficulté du navigateur à afficher les différents dessins a temps.

Le problème est donc que la vitesse ressentie est différente en fonction du matériel de notre utilisateur. Elle n'ira pas au delà de 30ms, mais peut aller bien moins vite sur du matériel ancien. C'est ici que `requestAnimationFrame` intervient. L'idée est de synchroniser l'affichage du jeu dans le canvas de façon à ce que le navigateur puisse optimiser au mieux sa gestion.

L'utilisation de `requestAnimationFrame` est simple bien que non-standardisée entre les divers navigateurs. Néanmoins, leur point commun est que l'on peut leur passer une fonction en argument qui sera appelé avant chaque repaint effectué par le navigateur. Ce petit morceau de code m'a permis de l'utiliser sur tous les navigateurs l'implémentant :

```js
this.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    null
  );
})();
```

J'ai donc créé une méthode `Game.draw()` qui permet d'afficher les différents objets de la scene du jeu que j'ai passé en argument de ma fonction wrappant les diverses implémentations (notez l'utilisation de la méthode `call` de l'objet `function` permettant de réinjecter le scope global à la fonction `wrapper` (nécessaire sous Chrome) :

```js
if (this.requestAnimFrame)
  this.requestAnimFrame.call(window, this.draw.bind(this));
```

J'ai cependant conservé mon timer pour les mouvements de objets et leurs collisions. En effet, le temps ne doit pas varier en fonction du matériel utilisé. Dans la réalité, il varie un peu tout de même car il y a bien un temps de calcul entre chaque appel de la fonction principale du jeu, mais cela est bien moins important depuis que le dessin a été complètement dissocié. Le timer sert également de fallback dans le cas où la fonction `requestAnimationFrame` ne serait pas disponible.

Malheureusement, seul Mozilla a implémenté une méthode permettant de détacher la fonction passée en argument (pour effectuer une pause du jeu sans consommer inutilement de ressources système) grâce à la fonction `cancelAnimationFrame` à laquelle on passe un id reçu en retour de la fonction `requestAnimationFrame` (un peu sur le modèle des fonctions `setTimeout` et `clearTimeout`). J'ai donc du me référer au timer afin de savoir si le jeu est mis en pause ou non pour ne pas dessiner inutilement la scène. La fonction est cependant toujours appelée, mais je n'y peux pas grand chose.

J'avoue que je n'ai pas vu de forte différences entre la version avec et la version sans requestAnimationFrame, cela est sûrement dû à mon PC assez musclé ;). Je n'ai pas encore testé sur mobile, j'imagine que la différence sera plus nette. Je vais certainement réutiliser le même patron de conception pour Tank Arena dès que j'aurai un peu plus de temps. La suite au prochain numéro ;).

PS : Et ce prochain numéro est [le support de l'accéléromètre](./accelerometre_casse_briques "Voir l'article sur le support de l'accéléromètre dans le casse brique").
