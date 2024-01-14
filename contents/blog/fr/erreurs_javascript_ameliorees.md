---
title: Améliorer les erreurs JavaScript
description: Pour un meilleur débogage, il faut de meilleures erreurs. C'est pourquoi j'ai mis en place une stratégie pour les rendre plus pertinentes.
leafname: erreurs_javascript_ameliorees
link:
  label: De meilleures erreurs JavaScript
  title: Découvrez comment rendre vos erreurs plus pertinentes.
date: "2015-03-15T11:04:02.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - NodeJS
  - NPM
  - Error
categories:
  - JavaScript
---

# Améliorer les erreurs JavaScript

Chez SimpliField, nous avons une base de code JavaScript très conséquente, de plus, nous avons un cycle de release très court. C'est pourquoi une gestion des erreurs pertinente est une nécessité pour nous.

J'ai déjà parlé de la [gestion des erreurs en JavaScript](./erreurs_javascript) sur ce blog, mais de façon purement théorique et architecturale. Je voudrais parler ici de détails d'implémentation que nous avons mis en pratique avec succès.

## s/message d'erreur/code d'erreur/

La première stratégie que je mets en place sur tous mes développements est de préférer des codes d'erreurs que des messages. Pour comprendre pourquoi, prenons un exemple simple ; la vérification qu'un nombre est dans un intervalle donné.

Un choix de POO classique serait d'utiliser une "classe" d'erreur. En JavaScript, nous en avons même une native :

```js
function checkBounds(n) {
  if (n < 2) {
    throw new RangeError("Out of range (" + n + "<2)");
  }
  if (n > 4) {
    throw new RangeError("Out of range (" + n + ">4)");
  }
}
```

A priori, cette erreur peut sembler tout à fait claire et exploitable. Mais à l'usage, on va rencontrer divers problèmes, dont un majeur, la qualification de cette erreur à un autre niveau du programme.

En effet, comment savoir, quand on l'attrapera par ailleurs dans notre application, ce qu'il faut en faire ? Simple me direz-vous, nous allons utiliser l'opérateur `instanceof` !

```js
try {
  checkBounds(6);
} catch(err) {
  if(err instanceof RangeError) {
    console.log('Erreur d'intervalle');
  }
}
```

Cette approche marche dans une petite application, mais avec des applications de dizaines, voire centaines, de milliers de lignes, elle n'est plus du tout viable.

En effet, ceci nécessiterait d'hériter du constructeur `Error` pour chaque type d'erreur et créerait tout une base de code annexe bien connue des développeurs Java...

Nous devons faire mieux. Une autre stratégie est de se baser sur le message d'erreur :

```js
try {
  checkBounds(6);
} catch (err) {
  if (err.message.startsWith("Out of range")) {
    console.log("Erreur d'intervalle");
  }
}
```

Ici, ce n'est pas très parlant, mais un message d'erreur sous forme de phrase est la porte ouverte à tous les abus :). Si l'auteur du message a tendance à écrire un roman pour chaque erreur, votre code va se détériorer rapidement.

Sans compter qu'au moindre changement de mot ou à la moindre correction de faute d'orthographe, vous pourrez revoir votre logique de différentiation des erreurs. C'est pour ces raisons que je n'utilise plus de messages d'erreur, mais plutôt des codes d'erreur simples et concis.

Autre problème avec cette approche, si vous souhaitez obtenir des informations sur l'erreur (du style n est supérieur ou inférieur à l'intervalle), vous pouvez sortir vos `RegExp` :).

![A propos des personnes qui font leur RegExp elles même, transcription sur le site de la source.](https://www.commitstrip.com/wp-content/uploads/2013/03/Strips-Expressions-r%C3%A9guli%C3%A8res-550-final.jpg)
[Source: Commit Strip](https://www.commitstrip.com/fr/2013/03/06/quelquun-sy-connait-en-expressions-regulieres/ "Voir la planche sur le site des auteurs")

Chez moi, la fonction de vérification d'intervalle ressemble plutôt à ça :

```js
var YError = require("yerror");
function checkBounds(n) {
  if (n < 2) {
    throw new YError("E_RANGE", "2", n);
  }
  if (n > 4) {
    throw new YError("E_RANGE", 4, n);
  }
}
```

Et son utilisation, à ça :

```js
try {
  checkBounds(6);
} catch (err) {
  if ("E_RANGE" === err.code) {
    console.log("Erreur d'intervalle, n=" + err.params[1] + ".");
  }
}
```

Plusieurs avantages :

- le code d'erreur se suffit à lui-même, pas besoin d'une phrase pour le comprendre.
- les paramètres de l'erreur permettent de comprendre ce qui l'a générée et même de l'analyser programmatiquement de façon simple.
- si cette erreur vient à faire planter le serveur de production, j'ai déjà des informations pour comprendre pourquoi sans avoir à revenir dans le même état.
- si je souhaite afficher cette erreur à l'utilisateur, la gestion de l'internationalisation sera plus facile (le code étant la clé du message et les paramètres permettant de le compléter de façon internationalisée, par exemple, en affichant les nombres au format local).

## Erreurs asynchrones et trace d'erreur

Le principal problème des erreurs asynchrones est qu'elles ne permettent pas toujours de comprendre l'origine du problème et le parcours de l'erreur dans votre code asynchrone.

Certaines librairies vous proposent des fonctionnalités pour gérer ceci comme la méthode[ Promise.longStackTrace()](https://github.com/petkaantonov/bluebird/blob/master/API.md#promiselongstacktraces---void) de BlueBird. Mais il est assez laborieux de faire cohabiter les différentes librairies entre elles. De plus, les traces produites sont souvent très verbeuses car pas du tout sélectives.

À cette fin, je préfère gérer cette long stack trace manuellement en identifiant les secteurs importants de l'application qui nécessitent que je récupère la trace en cours. Prenons la chaîne de promise suivante :

```js
function updatePassword(id, passwd) {
  return getUser(id)
    .then(checkPassword(passwd))
    .then(changePassword(passwd))
    .then(sendWarningEMail)
    .catch(function (err) {
      return YError.bump(err);
    });
}
```

Dans cette chaîne de promise, ce qui m'intéresse, c'est d'avoir la stack initiale de l'erreur et de savoir qu'elle a eu lieu dans cette chaîne de promise. Le reste n'est que du bruit. C'est pourquoi j'utilise explicitement la fonction `YError.bump()`.

## Requalification

Bien souvent, quand on attrape une erreur, c'est que l'on souhaite la requalifier. En effet, une erreur de type `'undefined' is not a function` n'a aucun sens pour les utilisateurs. C'est également généralement le cas des erreurs de bas niveau que vos librairies remontent.

Malheureusement, cette requalification génère souvent une perte d'information si on se contente naïvement de créer une autre erreur parallèlement. Mon approche dans ce cas est d'utiliser la méthode `YError.wrap()`.

```js
function updatePassword(id, passwd) {
  return getUser(id)
    .then(checkPassword(passwd))
    .catch(function(err) {
      return YError.wrap(err, 'E_USER_ERROR', id);
    });
    .then(changePassword(passwd))
    .then(sendWarningEMail)
    .catch(function(err) {
      return YError.wrap(err, 'E_UNEXPECTED', id);
    });
}
```

Ici, je requalifie un échec à la récupération de l'utilisateur ou à la vérification du nouveau mot de passe pour qualifier l'erreur comme étant due à l'utilisateur. Dans le cadre d'une API rest, cela permettra de renvoyer une erreur 400\. Les autres erreurs seront quand à elles classifiées comme bug et une erreur 500 sera retournée dans ce cas.

Mais le véritable avantage de cette méthode est que la trace de l'erreur contiendra non-seulement ces nouvelles informations, mais aussi les précédentes, donnant quelque chose de cet ordre :

```
  E_BAD_PWD_LENGTH (5)
    at line XXX
    at (...)
  E_USER_ERROR (abbacacaabbacacaabbacaca)
    at line XXX
    at (...)
```

En réalité, nous avons un constructeur d'erreur dérivé de YError et basé sur le même principe créé spécifiquement pour les erreurs HTTP. Je pense que nous allons l'open-sourcer dès que nous aurons quelques minutes.

N'hésitez pas à partager vos recettes ! Le code de YError est, bien-sûr, [disponible sur GitHub](https://github.com/SimpliField/yerror) .
