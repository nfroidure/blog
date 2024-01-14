---
title: "Les promises avec JavaScript : ouvrons le capot !"
description: Dans le petit monde de JavaScript les promises font l'actualité. Je vous propose de comprendre les promises par l'implémentation.
leafname: promises_javascript_ouvrons_capot
link:
  label: Les Promises en JS
  title: En savoir plus sur les Promises en JavaScript
date: "2013-06-08T10:04:17.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - Promises
categories:
  - JavaScript
  - Promises
---

# Les promises avec JavaScript : ouvrons le capot !

---

⚠ Attention: Cet article est ancien et bien qu'il reste une bonne façon de comprendre les promesses en JavaScript, le projet réalisé ne doit pas être utilisé car de nos jours les promesses sont présentes nativement dans tous les environnements exécutant du JavaScript.

---

Dans le petit monde de JavaScript les promises font l'actualité. Je vous propose de comprendre les promises par l'implémentation.

## Qu'est-ce qu'une promise ?

Selon le [Wiki CommonJS](http://wiki.commonjs.org/wiki/Promises/A "Voir la spécification en cours"), une promise, en JavaScript, est un objet représentant une valeur qui pourrait être retournée par l'exécution d'une opération unique (souvent asynchrone). Elle peut donc avoir trois états ; en attente de résultat, complétée avec succès ou en échec. Une fois complétée ou en échec, une promise ne peut plus changer d'état.

Afin de pouvoir être informé de la complétion, de l'échec ou de la progression de l'exécution de l'opération associée, les objets de type promise ont une propriété `then` dont la valeur est une fonction prenant en argument trois fonctions de callback :

```js
// From the Gist: https://gist.github.com/nfroidure/4bba7b16a5b5ae2c8afd
promise.prototype.then = function (
  callbackSuccess,
  callbackError,
  callbackProgress,
) {
  // my promise logic
  // calling callbacks depending on it's state
};
```

Le premier callback sera appelé en cas de réalisation avec succès de l'opération, le second en cas d'échec et le troisième pour indiquer une éventuelle progression de cette opération. Ces trois fonctions de retour sont optionnelles.

La méthode then doit retourner un autre objet promise qui sera complété dès lors que la fonction de retour de succès ou d'échec de la promise initiale aura été complètement exécutée. On peut considérer cette nouvelle promise comme un objet représentant l'opération réalisée par les fonctions de retour.

La fonction `callbackSuccess` peut retourner une valeur qui sera alors associée à la promise retournée par la méthode `then` :

```js
// From the Gist: https://gist.github.com/nfroidure/865249904d6496982a33

var p = new Promise(function myPromiseLogic(success, error, progress) {
  success(1);
})
  .then(function (value) {
    return value + 1;
  })
  .then(function (value) {
    console.log(value);
  });
// 2
```

Ici, on crée une promise avec l'opérateur `new` qui se résous immédiatement avec la valeur 1\. Dans le premier `then`, on incrémente la valeur puis on la retourne, dans le troisième `then`, on l'affiche.

La fonction de retour, ici `callbackSuccess`, peut aussi retourner une promise. Dans ce cas, cette dernière se substitue en quelque sorte à la promise générée par la méthode `then`. En effet, puisque la fonction de callback retourne une promise, elle est donc asynchrone, on peut donc considérer que l'exécution complète du callback ne sera vraie que lorsque la promise retournée sera complétée. Le code ci-dessus peut donc également être écrit ainsi :

```js
// From the Gist: https://gist.github.com/nfroidure/d2bde0088e6d0beb82ff

var p = new Promise(function myPromiseLogic(success, error, progress) {
  success(1);
})
  .then(function (value) {
    return new Promise(function myPromiseLogic(success, error, progress) {
      success(value + 1);
    });
  })
  .then(function (value) {
    console.log(value);
  });
// output : 2
```

## Implémentation

Si comme moi vous aimez voir ce qu'il se passe sous le capot pour mieux comprendre, je vous propose une petite [implémentation](https://gist.github.com/nfroidure/5697689 "Voir le gist de cette implémentation") que je vais vous expliquer pas à pas. Tout d'abord, on implémente le constructeur. Ce dernier a pour responsabilité le fait de prendre en argument la fonction représentant la "logique" de notre promise. Le but est de préparer des fonctions permettant à cette logique de signaler le succès, l'échec ou la progression de la tâche qu'elle exécute :

```js
// From the Gist: https://gist.github.com/nfroidure/adc6ae6bfe183ef3457f

function Promise(logic) {
  // create callbacks
  // executes the logic by passing callbacks
  logic(success, fail, progress);
}
```

Comme vous pouvez [le voir ligne 12](https://gist.github.com/nfroidure/5697689#file-promise-js-L12 "Voir la ligne 12"), les fonctions de callback générées dans le constructeur modifient le statut de la promise en fonction de la réussite ou l'échec, mais aussi, tentent d'exécuter une fonction de callback qui pour le moment, n'existe pas. Il s'agit de la fonction de callback qui sera injectée par la méthode `then`.

La méthode then a deux responsabilités, permettre l'exécution des callbacks qu'elle prend en argument et générer une nouvelle promise subordonnée à la première qu'elle fournira en retour.

La promise nouvellement créée a une logique particulière. En effet, la [fonction fournie au constructeur](https://gist.github.com/nfroidure/5697689#file-promise-js-L33 "Voir la ligne en question") est vide est ne sert qu'à récupérer une référence vers les fonctions de callback que le constructeur va lui fournir. Cette astuce va nous permettre de lier la complétion de notre nouvelle promise à la promise originale.

L'exécution des callback fournis à la méthode then est enrobée de manière à compléter la nouvelle promise en conséquence. Il existe deux possibilités. Soit au moment de l'exécution de `then`, la promise est déjà complétée et à ce moment, on exécute tout de suite [les callbacks](https://gist.github.com/nfroidure/5697689#file-promise-js-L56 "Voir la ligne concernée") adéquats, soit elle n'a pas encore eu lieu et dans ce cas, on [attache ces callbacks à la promise](https://gist.github.com/nfroidure/5697689#file-promise-js-L52 "Voir la ligne où ils sont attachés") pour qu'ils soient exécutés quand la logique appellera une des fonctions de callback passées par le contructeur.

Vous remarquerez l'[utilisation de setTimeout](https://gist.github.com/nfroidure/5697689#file-promise-js-L57 "Voir la ligne où l'exécution a lieu") pour exécuter les callbacks de manière asynchrone. Ce n'est pas précisé par le brouillon de la spécification, mais je pense que c'est une bonne pratique, de cette manière toute résolution de promise est asynchrone.

Nous allons voir comment utiliser les promises pour en tirer le meilleur parti, mais avant tout, je vous recommande de jeter un œil à l'implémentation des méthodes statiques [Promise.all](https://gist.github.com/nfroidure/5697689#file-promise-js-L64 "Voir l'implémentation de Promise.all") et [Promise.any](https://gist.github.com/nfroidure/5697689#file-promise-js-L94 "Voir l'implémentation de Promise.any") que nous allons bientôt utiliser.

## Le paradigme des promises

Ok, on sait ce que sont les promises et comment fonctionne leur implémentation. Mais qu'est-ce qu'on peut bien faire avec ? Les promises sont vendues comme LA solution au JavaScript callback hell. Je trouve cette présentation un peu réductrice.

Ceux qui utilisent MooTools savent bien qu'on peut très facilement se sortir du callback hell en ayant une approche orientée objet à coup de binding de fonctions et ceux qui connaissent les streams sous Node savent également qu'on peut aisément linéariser son code en les utilisant.

D'ailleurs, les streams relèvent du même concept que les promises, il sont une "promesse" que des données vont arriver ou seront envoyées indépendamment de l'arrivée effective synchrone ou non de celles-cis. En réalité, seule l'API diffère entre les streams et les promises dans NodeJS.

Bref, les promises sont surtout une nouveau paradigme de programmation. Elles permettent d'envisager une application comme une sorte d'arbre logique de promises. Nous allons prendre un exemple simple, le cas d'une application avec un menu principal qui charge des vues différentes en fonction du bouton cliqué sur le menu. Nous allons devoir créer des promises d'évènements. Pour nous simplifier la tâche, j'ai créé un [générateur de promises](https://gist.github.com/nfroidure/5697689#file-promise-js-L151 "Voir la fonction en question") basé sur les écouteurs d'évènements.

Commençons par le menu. Un menu est un promesse d'un clic sur un des boutons qui le composent. Nous utilisons donc la méthode `Promise.any` qui permet de créer une promise qui sera complétée si l'une des promises reçues en argument est complétée avec succès :

```js
// From the Gist: https://gist.github.com/nfroidure/00cda6f306919ed9d172

function menu() {
  // showing the menu
  Promise.any(
    getEventPromise("click", document.getElementById("view2button")),
    getEventPromise("click", document.getElementById("view3button")),
  )
    .then(function (event) {
      // view actions
      // here goes view code
      // return a promise of exit
      return getEventPromise(
        "click",
        document.getElementById(viewId + "backbutton"),
      ).then(function () {
        // hide the view
      });
    })
    // executing the menu
    .then(menu);
}

// First execution
menu();
```

C'est simple comme bonjour. On a une promesse de clic, suivie de l'affichage de la vue et d'une promesse de sortie de la vue. Enfin, quand la sortie est effective, on recommence à prendre en compte les clics sur l'un des items de menu.

J'ai créé [un exemple sur Codepen](http://codepen.io/seraphzz/pen/oHdJD "Voir le concept sur Codepen.io") rapidement qui illustre le concept. Le bouton générant une fenêtre modale avec `alert` recrée une nouvelle promise pour pouvoir générer d'autres alertes alors que le bouton basé sur `prompt` de la vue suivante n'en recrée pas et n'est donc utilisable qu'une seule fois.

L'avantage de re-créer une promise quand elle est réalisée est qu'on peut placer des évènements asynchrones entre deux ce qui fait que le bouton n'est pas actif tant que la promise associée n'est pas entièrement réalisée.

En revanche, je me suis permis un écart avec la version originale des promises. En effet, la méthode Promise.any n'attend la réalisation que d'une des promises. Cela pose un problème évident de fuite de mémoire si l'on ne désenregistre pas les évènements associés aux promises qui ne seront pas réalisées.

Pour ce faire, j'ai créé une méthode dispose pour les promises qui permet de stocker en retour de la [fonction de logique de la promise dans le constructeur Promise](https://gist.github.com/nfroidure/5697689#file-promise-js-L28 "Voir la ligne concernée") une fonction qui permette d'annuler la promise. Par exemple, pour le générateur de promise, la fonction dispose [supprime l'écouteur d'évènement](https://gist.github.com/nfroidure/5697689#file-promise-js-L161 "Voir la ligne"). Pour une requête XHR, on pourrait aussi annuler cette dernière.

De cette façon, dans la méthode `Promise.any`, on [désamorce toutes les promises](https://gist.github.com/nfroidure/5697689#file-promise-js-L101 "Voir la ligne de cette annulation") qui n'on pas pu être complétée avant la réalisation de la première promise avec succès.

Pour info : j'ai finalement créé un [dépôt GitHub](https://github.com/nfroidure/Promise "Voir le dépôt") de l'implémentation de cet article et j'ai commencé un [petit jeu nommé Liar](https://github.com/nfroidure/Liar "Voir le dépôt") qui utilise ces promises afin d'illustrer cet article.
