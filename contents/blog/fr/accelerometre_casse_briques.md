---
title: Utilisation de l'accéléromètre dans le Casse Brique
description: HTML5 expose via l'API accelerometer des information sur l'inclinaison de l'appareil en fonction des trois axes de l'espace, utilisons les pour notre Casse brique.
leafname: accelerometre_casse_briques
link:
  label: Accéléromètre et Casse Brique
  title: En savoir plus sur cette amélioration
date: "2012-08-09T12:14:36.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - HTML5
  - API
categories:
  - Jeux HTML5
---

# Utilisation de l'accéléromètre dans le Casse Brique

---

⚠ Attention : cet article est périmé et présent uniquement pour mémoire.

---

HTML5 expose via l'API Accelerometer des informations sur l'inclinaison de l'appareil en fonction des trois axes de l'espace, utilisons les pour notre casse brique.

En effet, il pourrait être intéressant de faire bouger la barre du casse brique en fonction des mouvements du téléphone.

Je me suis donc mis à l'ouvrage et j'ai commencé à explorer l'API Accelerometer [très bien documentée](https://developer.mozilla.org/en-US/docs/Web/API/Detecting%5Fdevice%5Forientation "Voir les détails de l'API") par le Mozilla Developer Network.

Obtenir les coordonnées de l'accéléromètre est assez simple. Il suffit d'ajouter un écouteur d'évènement sur l'objet `window`. On récupère ainsi dans la fonction passée en paramètre les évènements relatifs au changement d'orientation du téléphone ou autre appareil contenant un accéléromètre.

```js
window.addEventListener(
  "deviceorientation",
  this.orientationHandler.bind(this),
  true,
);
```

En revanche, il est plus compliqué d'interpréter ces coordonnées. En effet, en fonction de la valeur de `event.absolute``, le référentiel peut varier. Soit ce dernier est relatif à la position de la terre, soit le référentiel est arbitraire (a priori, relatif au périphérique lui même voire à la position initiale ou à la gravité vu que c'est un peu le principe de l’accéléromètre).

Les deux coordonnées qui m'intéressent sont les rotations de gauche à droite (pour guider la barre) et l'inclinaison d'avant en arrière (pour utiliser le tir laser ou fusil). Seulement, celles-ci changent selon que le périphérique est en mode paysage ou en mode portrait. J'ai donc du passer par une détection du mode via les media queries et la fonction bien pratique matchMedia.

Ainsi, en mode portrait, la valeur e.beta désigne l'orientation de gauche à droite et la valeur e.gamma celle d'avant en arrière et inversement en mode paysage.

J'aurai pu utiliser l'axe e.alpha pour déterminer l'orientation de l'appareil, mais il semble que tous les navigateurs ont leurs propres coordonnées limites et cela pose donc un problème évident de détection. Voilà ma fonction finale que vous retrouvez [dans ce commit](https://github.com/nfroidure/Breakit/commit/3fa71a35035a7289d2a67baf1786a81a0d13a4bc "Voir le commit") :

```js
orientationHandler: function(e) {
 var portrait=(window.matchMedia&&window.matchMedia('(orientation: portrait)').matches);
 if((portrait&&e.beta<50)||((!portrait)&&(e.gamma<0&&e.gamma>-50)))
 this.bar.fire();
 if((portrait&&e.gamma<-15)||((!portrait)&&e.beta<-10))
 this.bar.setDirection(-1);
 else if((portrait&&e.gamma>15)||((!portrait)&&e.beta>10))
 this.bar.setDirection(1);
 else
 this.bar.setDirection(0);
 },
```

Cette dernière se contente de modifier la direction prise par la barre en fonction de l'orientation. Elle fonctionne bien sur mon Galaxy S3 mais je n'ai pas d'autre appareil pour tester la compatibilité sur d'autres périphériques. N'hésitez donc pas à me relater vos éventuels problèmes voire à proposer vos commits. [Bon jeu !](http://breakit.insertafter.com/index.html "Jouer au Casse Brique")

J'oubliais, puisqu'un malheur n'arrive jamais seul, j'ai ajouté un goodie qui inverse les contrôles (et donc l'accéléromètre), attention de bien éviter ce dernier, à moins que vous n'aimiez la difficulté ;). Tout est [dans ce commit](https://github.com/nfroidure/Breakit/commit/413b87edbd35e75b8b7101021ab0126be0678c52 "Voir le commit d'inversion des contrôles").
