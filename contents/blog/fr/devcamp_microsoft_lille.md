---
title: "Dev camp Microsoft Lille : Bienvenue en boîte !"
description: Hier je suis allé au Devcamp Microsoft organisé à Lille pour découvrir le nouveau Windows et ses nouvelles possibilités pour la création de logiciels. Je pense que l'expérience mérite un petit résumé, surtout en ce qui concerne HTML5 / Javascript.
leafname: devcamp_microsoft_lille
link:
  label: Devcamp Windows 8
  title: En savoir plus sur le déroulement de cette journée.
date: "2012-09-28T12:50:44.000Z"
lang: fr
location: FR
keywords:
  - MicroSoft
  - Windows
categories:
  - Windows
---

# Dev camp Microsoft Lille : Bienvenue en boîte !

Hier je suis allé au Devcamp Microsoft organisé à Lille pour découvrir le nouveau Windows et ses nouvelles possibilités pour la création de logiciels. Je pense que l'expérience mérite un petit résumé, surtout en ce qui concerne HTML5 / Javascript.

Christophe Peugnet, développeur spécialisé Windows, éditeur de logiciels de planification, m'a convié à cet évènement Microsoft pour me permettre de découvrir ce fameux Windows 8 qui devrait sortir dans peu de temps, mais surtout, de jouer un peu avec ses APIs et outils.

Vous connaissez sûrement mon penchant pour Linux et vous vous demandez sûrement ce qui a bien pu me motiver. C'est simplement HTML5. En effet, selon Microsoft, le développement d'applications en HTML5 / Javascript est intégré à la nouvelle mouture de Windows. Cela a donc piqué ma curiosité.

J'avais justement sous la main mon Casse Brique et le projet Tank Arena, j'ai donc décidé de les intégrer au sein d'une application packagée pour Windows au cours de cette journée.

## Faîtes ce que j'EDI, mais pas ce que je fais

Il a d'abord fallu que j'installe Windows 8 sur un disque dur vacant puis Visual Studio. Venant des mondes du web et d'Unix, j'ai tout d'abord été choqué par l'obligation d'utiliser un EDI. En effet, les développeurs Javascript ne sont pas habitués à devoir cliquer tous azimuts pour faire tourner du code et créer des apps. De plus l'interface est assez complexe et ne permet pas d'être efficace rapidement.

Un peu déconcerté par cette salle où on entendait plus les clics que les touches du clavier (on aurait pu penser qu'on faisait un LAN Starcraft), je me suis mis à découvrir ce qu'on pouvait faire en Javascript sur Windows8.

## Jacques a dit HTML5 !

Après un peu de démotivation, je trouve de la ressource en constatant que mon Casse Brique et Tank Arena fonctionnaient tous les deux forts bien (à part un petit bug son) sur Internet Explorer. De ce côté, on peut dire que Microsoft a tenu sa promesse de sortir Windows 8 avec un vrai navigateur prêt pour le HTML5 d'aujourd'hui.

Bref, je crée un projet HTML5 / Javascript sous Visual Studio et là grosse frayeur. Je vois que le projet de départ est bien du Javascript, ça en a le goût, ça en a l'odeur, mais quelques petits trucs clochent.

En effet, Windows 8, propose sont propre Framework du coup, le Javascript qu'on trouve dans les projets "prédéfinis" ne ressemble pas à ce qu'on peut trouver dans une page web. Les requêtes xhr à titre d'exemple ressemblent à ça :

```js
WinJS.xhr("/monfichier.json").then(function moncallback(xhr) {
  alert(xhr.responseText);
});
```

Deux questions me submergent à ce moment là :

- mon JS pourra-t-il fonctionner out of the box avec Windows 8 ? Vais-je devoir réécrire toutes les fonction XHR ? Est-ce la seule syntaxe propre à ce fameux WinJS qu'on retrouve partout ?
- ces développeurs DotNet qui m'entourent et qui n'ont pas l'air versé dans le JS, vont-ils apprendre ce JS là ? Si oui, ne risquent-ils pas de se sentir trompés dès lors qu'ils voudront se tourner vers d'autres horizons ?

Heureusement, après avoir importé les fichiers du Casse Brique, je me rend compte que le JS classique fonctionne. On peut donc faire tourner un projet JS existant assez facilement. Il suffit d'importer les fichiers JS et les autres ressources éventuelles, puis d'appeler sa fonction principale au sein du fichier javascript default.js (créé lors de la fabrication du projet par défaut).

D'ailleurs on observe dans ce fichier default.js un comportement fort ressemblant à Android avec plusieurs niveaux de notifications en fonction de l'état de l'application. Cela permet de donner des directives à son application dans le cas où il serait nécessaire d'enregistrer des données avant la fermeture prématurée ou volontaire de cette dernière.

La deuxième question reste en suspend, mais elle va finalement converger avec une autre réflexion initiée l'ors du repas. Bref, finalement, l'application a fonctionné, même le son a fini par marcher (`.ogg` remplacés par des `.mp3`). Donc, oui, je confirme, Windows 8 est ok pour le HTML5 d'aujourd'hui.

## Oui, mais demain

Une question est cependant restée en suspens. En effet, le problème de Microsoft n'a jamais été d'être innovant à un instant t. Le problème a été de le rester durant tout le cycle de vie du produit, par la force des mises à jour. L'impossibilité d'installer Internet Explorer 9 sur XP en est un exemple.

A cela, vous pouvez rétorquer que XP c'est mort et ça pue. Je dirai pas que vous avez tort. Mais le métier d'une éditeur de logiciel est d'accompagner ses clients en mettant à jour les logiciels qu'il lui fournit. Soit en encourageant le passage à la version supérieure de l'OS (par des tarifs acceptables ou mieux gratuitement), mais certainement pas en attendant que l'utilisateur renouvèle son matériel ! D'ailleurs les licences sont liées au matériel. Qu'est-ce que ça coûterait à Microsoft de laisser les gens upgrader ?

Bon, en fait, ça leur coûterait car ils devraient développer leurs nouveaux OS de manière plus responsable pour qu'ils consomment moins de mémoire, moins de CPU et ainsi qu'ils puissent toujours être utilisés sur de vielles machines. Mais ça, c'est dû à un mauvais choix dès le départ qui a été de faire payer aux utilisateurs un renouvèlement de matériel, plutôt qu'un renouvèlement de licence seulement.

Bref, le rapport avec HTML5, c'est que Windows est prêt pour le HTML5 d'aujourd'hui, mais il n'a pas démontré sa capacité à être prêt pour le HTML5 de demain. HTML5 évolue très rapidement, Windows doit suivre, sinon, il aura vendu HTML5 avec de la publicité mensongère. HTML5, c'est pas le code de 2012, c'est celui de 2014 quand le draft sera enfin finalisé.

## Univers fermé

Malheureusement, un autre point sur lequel Microsoft n'a pas changé est que Windows reste un univers fermé. A moins de changer de business model, cela risque de ne pas changer. Au même titre qu'avec iOS d'Apple et dans une moindre mesure Android de Google, on ne peut développer une application qu'avec les outils qui sont édités par cette entreprise.

Ainsi, en tant qu'utilisateur Linux, le monde iOS et le monde Windows 8 me sont fermés. Si je veux y accéder d'un point de vue business, je dois posséder une licence (Windows + Visual Studio). C'est ici que le business model d'Android est brillant. Quel que soit l'OS utilisé, les développeurs d'Android ont su factoriser les technologies afin de permettre une ouverture maximale du marché de leur applications.

Quand on vient du web, on vit cela encore plus durement. En effet, malgré la guerre des navigateurs, les technologies web ont toujours été accessibles quel que soit l'OS, l'éditeur ou l'EDI utilisé. Et ça, on s'en rend vraiment compte quand on entre dans l'univers de Microsoft, on le vit très mal.

Je remercie quand même Microsoft de m'avoir invité à cet évènement qui malgré tout m'a montré qu'ils vont dans le bon sens. J'ai d'ailleurs été très bien reçu et être respecté ça fait toujours plaisir.

Je vais terminer par une petite phrase que j'ai dite aux organisateurs lors du repas et qui je pense résume assez bien mon avis sur Microsoft, Apple et Google, le cloud et tous ces rêves qu'on veut vendre aux développeurs : "Autrefois vous vendiez des radios portables, aujourd'hui vous vendez des entrées en discothèque : tout le monde ne peut pas rentrer, les consommations sont hors de prix, tu peux être sorti à tout moment et une fois dehors, la musique s'arrête.".
