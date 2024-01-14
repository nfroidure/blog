---
title: Faire mieux qu'AngularJS avec require()
description: Le système CommonJS-like de NodeJS permet un grand nombre de subtilités. Je vous propose de les découvrir en reproduisant les fonctionnalités du système de modules d'AngularJS.
leafname: faire-mieux-qu-angular-avec-require
link:
  label: Modules AngularJS-like avec require()
  title: Découvrir la puissance de require()
date: "2015-03-12T07:49:00.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - NodeJS
  - NPM
  - Modules
  - AngularJS
categories:
  - JavaScript
---

# Faire mieux qu'AngularJS avec require()

Lors de [ma dernière présentation](https://www.youtube.com/watch?v=n8nvHFfEFC4 "Voir la présentation sur YouTube") pour [#ChtiJS10](http://chtijs.francejs.org/archives/2015-02-05/index.html "Voir le résumé de cette édition"), j'ai cédé au troll à propos du système de modules d'AngularJS. En effet, bien qu'il m'ait paru plutôt smart au début, j'ai vite compris ses limites.

En effet, le fait de devoir wrapper le moindre code JavaScript d'une série de lignes qui peuvent sembler un peu déroutante pour un non initié est particulièrement ennuyeux. De plus, la création de builds pour AngularJS est très fastidieux du fait de l'usage de bower pour les récupérer.

Bref, à côté de la simplicité et de l'efficacité de NPM et des modules CommonJS ce système fait pâle figure. La question est donc, peut-on faire les même choses avec `require()` qu'avec le système de gestion de modules d'Angular ? La réponse est oui et voici comment !

## Service simple

Si vous avez déjà utilisé Angular, vous savez que l'une des bonnes pratiques est de publier votre code sous forme de services. Les services sont une sorte de singleton namespacé et configurables pour votre application :

```js
angular
  .module("my.app.namespace", ["my.dep1.namespace", "my.dep2.namespace"])
  .service("MyService", [
    "dep1",
    "dep2",
    function (dep1, dep2) {
      var _myPrivateVar = "secret";
      var myServiceInstance = {
        getPrivate: function () {
          return _myPrivateVar;
        },
        myPublicVar: "hello!",
        myPublicFunction: function () {},
      };

      return myServiceInstance;
    },
  ]);
```

Cette syntaxe a plusieurs buts avoués :

- cloisonner le code en espace de noms (pour éviter les collisions),
- rendre le code maintenable et réutilisable (grâce à la modularisation),
- rendre le code testable (grâce à l'injection de dépendances).

Cependant, elle est assez verbeuse. Voici son équivalent sous la forme de module CommonJS (pour NodeJS) :

```js
var dep1 = require("dep1");
var dep2 = require("./lib/dep2");

var _myPrivateVar = "secret";
var myServiceInstance = {
  getPrivate: function () {
    return _myPrivateVar;
  },
  myPublicVar: "hello!",
  myPublicFunction: function () {},
};

module.exports = myServiceInstance;
```

Au delà du fait qu'elle est plus concise, cette syntaxe est aussi plus claire. Il n'est pas nécessaire de connaître le fonctionnement de JavaScript pour comprendre ce que fait ce code.

Tout d'abord, il requiert les dépendances dont il a besoin. Ici, les espaces de nom sont gérés d'une façon beaucoup plus intéressante. L'unicité de la dépendance `dep2` est assurée par un dépôt centralisé de modules (ici NPM). Celle de la dépendance `dep1` quand à elle est assurée par l'arborescence du projet.

Enfin, il exporte le contenu de `myServiceInstance` comme étant le "contenu" du module. Bref, le fonctionnement classique des modules CommonJS, jusqu'ici, rien d'insurmontable.

## Service configuré

Mais un habitué d'Angular me rétorquera que les services Angular sont configurables, grâce aux service providers. Ce qui en Angular, donne ça :

```js
// Définition
angular
  .module("my.app.namespace", ["my.dep1.namespace", "my.dep2.namespace"])
  .provider("MyServiceProvider", [
    "dep1",
    "dep2",
    function (dep1, dep2) {
      var _myPrivateVar = "secret";

      this.setSecret = function (newSecret) {
        _myPrivateVar = newSecret;
      };

      this.$get(function () {
        var myServiceInstance = {
          getPrivate: function () {
            return _myPrivateVar;
          },
          myPublicVar: "hello!",
          myPublicFunction: function () {},
        };

        return myServiceInstance;
      });
    },
  ]);

// Configuration
myApp.config("MyServiceProvider", [
  "MyServiceProvider",
  function (MyServiceProvider) {
    MyServiceProvider.setSecret("kikoo");
  },
]);

// Utilisation par injection dans un controller/module...
// à la manière de dep1
```

Ça en fait du code. Je vous laisse voir ça en détail sur la[ documentation d'AngularJS](https://docs.angularjs.org/guide/providers), retenez simplement que l'idée ici est de configurer un singleton global. Chose que l'on réalise comme ceci avec CommonJS :

```js
// Définition getmyservice.js
function getMyServiceInstance(mySecret) {
  var dep1 = require("dep1");
  var dep2 = require("./lib/dep2");

  var _myPrivateVar = "secret";
  var myServiceInstance = {
    getPrivate: function () {
      return _myPrivateVar;
    },
    myPublicVar: "hello!",
    myPublicFunction: function () {},
  };

  return myServiceInstance;
}

module.exports = getMyServiceInstance;

// Configuration myservice.js
module.exports = require("./getmyservice")("secretdefense");

// Utilisation par require dans n'importe quel module
var myService = require("./myservice");

myService.myPublicFunction("hello!");
```

L'idée est de créer un module qui soit simplement le retour d'appel d'une fonction permettant de récupérer une version configurée d'un service donné. De cette façon on peut accéder à celui-ci n'importe où dans le programme par simple appel à require.

Cependant, j'ai rarement recours à cette technique car c'est une sorte de singleton et à vrai dire, ce design pattern est de plus en plus décrié car il fait rarement sens.

## Services "wrappés"

Angular a eu la merveilleuse idée de fournir des services pour les variables globales exposées par le système. Ainsi, pour accéder à `window`, il suffit d'injecter le service `$window`, idem pour `window.location` avec `$location` etc.

Pour le code en lui-même ceci n'a pas d'intérêt, mais pour les tests unitaires cette façon de procéder est essentielle. Ainsi, on peut injecter un service dédié au test mockant les fonctionnalités exposées par le service requis.

Avec `require()`, appliquer ce principe est également possible. Il suffit de créer le module correspondant. Ici, nous créons un "service" fournissant un accès au constructeur `Date` :

```js
// contenu de date.js
module.exports = Date;

// utilisation
var Date = require("./date");
```

Il ne nous reste plus qu'à mocker les dates lors de nos tests unitaires.

## Les tests

Justement, parlons-en ! Angular a la réputation de faciliter les tests unitaires, en est-il de même pour les modules CommonJS.

La réponse est non. Ce n'est pas automatique. Là où Angular vous mâche le travail en vous imposant un cadre, avec CommonJS, nous l'avons vu, créer des modules testables est une démarche consciente et non-obligatoire.

Cela reste cependant possible grâce au module `mockery`. Par exemple, pour tester un module qui reposerait sur notre service wrappant `Date`, il suffirait de procéder ainsi :

```js
var mockery = require("mockery");
var DateMock = require("date-mock");

describe("myModule", function () {
  beforeEach(function () {
    mockery.enable({ useCleanCache: true });
    mockery.registerMock("./date", DateMock);
    DateMock.curTime = 360000;
  });

  afterEach(function () {
    mockery.deregisterMock("./date");
    mockery.disable();
  });

  it("should do stuff", function () {
    // Code des tests
  });
});
```

Ici `mockery` substitue à la volée le module `./date` par du code qui vous permet de simuler le temps. Il est également possible de simplement remplacer la variable globale Date, mais ceci peut avoir d'autres effets par ailleurs, je vous conseille donc plutôt cette technique.

## Quel rapport avec le front ?

À ce stade il se peut que vous vous demandiez comment utiliser des modules CommonJS pour vos projets front. Autrefois on [utilisait RequireJS](./utiliser_requirejs) et on créait ses [modules AMD](./module_javascript) avec ses p'tites mimines (ne faîtes plus ça !).

Avec [browserify](./browserify) ou webpack vous pourrez gérer finement la façon dont vous consommerez vos modules CommonJS sans efforts ;).

## ES6

Les modules ES6 vont bientôt être la règle et vous vous posez sûrement la question. Comment appliquer les préceptes ci-dessus à vos modules ES6 ?

À ce jour, vos modules ES6 sont en fait transformés en modules CommonJS et utilisés via `require()`. La question ne se pose donc pas vraiment.

À l'avenir, en revanche, nos amis d'ECMA ont tout prévu, notamment une façon d'overrider le comportement du loader de module à la volée. Ça devrait se concrétiser via [System](http://babeljs.io/docs/learn-es6/#module-loaders). Cette fonctionnalité devrait pouvoir être utilisée comme `mockery` pour modifier le comportement de l'injection de dépendance d'ES6.

Voilà, j'espère que ce petit article vous a plût. Pour les angulariens, sachez que Angular 2.0 va supprimer son ancien système de module ce qui n'est pas une mauvaise nouvelles ;).

Petite mise à jour pour ajouter qu'il est possible d'appliquer ceci aux applications Angular également pour simplifier les tests et se passer de Karma, [voici un exemple](https://github.com/SimpliField/angular-sf-load/blob/7ae1467c4ce914fdc8fed940d96a39c6b4cce026/src/load.service.specs.js#L8-L18).

Le système d'injection d'Angular reste sympa malgré tout pour gérer les états globaux, mais son principal soucis est d'être trop intrusif sur la façon de gérer le code à mon goût. C'est pourquoi j'ai créé [Knifecycle](https://github.com/nfroidure/knifecycle) qui reprend ses concepts mais de façon moins intrusive et surtout applicable pour le backend (prise en compte du graceful shutdown).

Enfin, le système d'injection d'Angular2 a tiré pas mal de leçons des erreurs précédentes et même si je ne suis pas fan d'Angular2 je reconnais qu'il y a eu des progrès de ce côté.
