---
title: Gestion des erreurs en JavaScript
description: Gérer les erreurs en JavaScript peut paraître simple, mais il n'est pas toujours évident de choisir entre exceptions, retours d'erreurs et callbacks d'erreurs.
leafname: erreurs_javascript
link:
  label: Les erreurs JS
  title: En savoir plus sur la gestion des erreurs en JavaScript
date: "2013-07-30T13:18:42.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - Gestion des erreurs
categories:
  - JavaScript
  - Gestion des erreurs
---

# Gestion des erreurs en JavaScript

Gérer les erreurs en JavaScript peut paraître simple, mais il n'est pas toujours évident de choisir entre exceptions, retours d'erreurs et callbacks d'erreurs.

Le dernier Ch'tiJS a décidément été la source de nombreuses réflexions. L'une d'entre elle concernait les erreurs. Tout est parti d'une assertion simple : les promises doivent-elles attraper les exceptions et les transformer en erreurs récupérables dans un then ou les laisser remonter la pile d'exécution ?

C'est que fait, par exemple, RSVP.js. La logique du resolver est englobée dans [un bloc try...catch](https://github.com/tildeio/rsvp.js/blob/277eb5eab912a9c3df8228a2647fcab84374615a/lib/rsvp/promise.js#L47 "Voir le code en question") qui transforme toute exception en erreur qui fait échouer la promise. Dans [mon implémentation des promises](promises%5Fjavascript%5Fouvrons%5Fcapot.html "Voir l'article concernant cette implémentation"), j'ai choisi de ne pas utiliser cette approche afin de pouvoir décider, au cas par cas, d'attraper ou non une exception envoyée par le resolver d'une promise.

## Typologie des erreurs

Avant d'aller plus loin, je voudrais revenir sur la typologie des erreurs que l'on peut rencontrer au cours de l'exécution d'un programme. Pour moi, il existe trois classes d'erreurs :

- les erreurs fatales : ce sont des erreurs qui résultent d'une erreur de programmation. Ces dernières ont la particularité de ne pas avoir été prévues par le développeur puisqu'elles résultent d'un bug. Elles laissent donc le programme dans un état indéterminé. On pourrait comparer cette erreur aux erreurs HTTP 500+ ;
- les erreurs d'utilisation : elles sont causées par une mauvaise utilisation du programme (mauvaise saisies de l'utilisateur principalement) ;
- les erreurs d'interaction : un programme interagit fréquemment avec d'autres composants (le réseau, le matériel etc...). Il arrive qu'une interaction se termine de façon imprévue ou incohérente. Un programme se doit d'anticiper ces erreurs et de les gérer au mieux.

Attention, certaines erreurs d'interaction peuvent être dues à une erreur fatale dans un programme avec lequel votre code interagit. C'est le cas quand une requête XHR renvoie une erreur 500\. Il faut donc veiller à ne pas confondre erreurs d'interactions et erreurs fatales. Pour ce faire, il faut bien délimiter les erreurs qui sont dues à votre code.

On pourrait considérer que les erreurs d'utilisation sont des erreurs d'interaction avec l'utilisateur. D'ailleurs, dans l'absolu, l'interaction avec des système tiers peut aussi induire des entrées qui nécessitent d'être filtrées de la même façon que les entrées utilisateur. Je fais néanmoins la différence ici car la réponse à ces erreurs sera légèrement différente.

## La gestion d'erreur

J'imagine que ces types vous évoquent certaines stratégies pour leur gestion. En JavaScript, on compte divers type de gestion d'erreur :

- les exceptions : elles permettent à une erreur de remonter la pile d'exécution. On peut les attraper à tout moment à l'aide d'un bloc `try...catch`. Si elles ne sont pas attrapées, les exceptions finissent par interrompre l'execution de votre JavaScript (plus précisément de la pile d'exécution JavaScript).
- les retours d'erreur : il s'agit d'exploiter le retour de fonction pour indiquer qu'une erreur a eu lieu. On peut considérer que si `parseInt` retourne `NaN` alors on a affaire à une erreur. Cette approche est très utilisée en C pour les appels systèmes.
- l'approche via une variable globale : très présente en C également avec la variable `errno`. En JavaScript, on évite les variables globales, on utilisera donc pas cette approche.
- l'approche via callback d'erreur : ils sont principalement utilisés pour les opérations asynchrones, bien que rien n'empêche leur utilisation dans du code synchrone. C'est aussi l'approche qui est utilisée pour les promises. On passe un callback d'erreur à la méthode then. La différence est que l'on passe autant de callbacks d'erreur qu'on le souhaite.

## Comment gérer chaque type d'erreur ?

### Les erreurs fatales

Les exceptions sont l'arme ultime pour gérer les erreurs fatales. En effet, puisque les erreurs fatales sont des erreurs de programmation, continuer l'exécution du programme est risqué. Cela pourrait avoir des répercussions désastreuses.

JavaScript utilise intensivement les exceptions. Les erreurs de syntaxe, les mauvaises utilisations de son API native sont signalées dans la grande majorité des cas par des exceptions. C'est pourquoi je vous enjoins à fait de même.

La plupart du temps, il s'agit de lever une exception si l'une de vos fonctions/l'un de vos constructeurs reçoit en paramètre des arguments erronés :

```js
function repeat(n) {
  if (n < 0) throw new Error("Bad n value.");
  //...
}
```

Demander une répétition d'une opération avec une nombre négatif de répétition n'a pas de sens. Lancer une exception permet d'interrompre l'exécution et de permettre de déboguer facilement l'erreur dans le contexte où celle-ci est apparue.

En effet, tous les outils pour développeurs permettent de placer un point d'arrêt à la levée d'une exception afin de permettre de visualiser les variables à portées, la pile d'exécution et bien d'autres informations très utiles.

### Les erreurs d'utilisation

Les erreurs d'utilisation sont dues à l'utilisateur. La logique veut donc que l'on traite ces erreurs en signalant celles-cis à l'utilisateur. C'est donc une réponse par le biais de l'interface utilisateur qui sera privilégiée.

Cependant, pour activer cette réponse, il faut en premier lieu la détecter. Cette détection se fait indifféremment par retour de fonction ou par callback d'erreur. D'ailleurs il est très possible que vous deviez mixer ces deux techniques pour bâtir une propagation d'erreur dans la pile d'exécution et annuler certaines actions suite à une erreur.

L'idée à retenir est d'éviter à tout prix de gérer les erreurs des utilisateurs à l'aide d'exceptions. En effet, vous prenez le risque de mettre fin à l'exécution pour une erreur normale dans le cycle de vie d'une application. Les utilisateurs se trompent souvent.

On prendra donc soin de filtrer un entier obtenu grâce à une saisie de l'utilisateur avant de l'utiliser comme argument de la fonction `repeat` définie ci-dessus.

### Les erreurs d'interaction

Lorsque votre code interagit avec des éléments extérieurs, qu'il s'agisse de serveurs distant ou du hardware, le bon sens veut que cela se fasse de manière asynchrone. Les callbacks d'erreur sont donc indiqués pour remplir le job. C'est d'ailleurs de cette façon que l'API JavaScript vous informe sur le succès ou l'échec d'une opération asynchrone.

Ce n'est malheureusement pas toujours le cas. Par exemple, une requête XHR synchrone qui échoue à cause d'un problème réseau lance une exception. Dans ce cas précis, mieux vaut être au courant afin de placer le bloc `try...catch` qui vous permettra de gérer ce cas sans mettre en péril l'exécution de votre JavaScript.

Vous vous dîtes peut-être qu'il peut arriver qu'une erreur de programmation mène à la mauvaise utilisation d'une API asynchrone et que dans ce cas, un callback d'erreur sera appelé pour une erreur fatale. Ce que j'ai totalement contre indiqué tout à l'heure.

Pour le cas d'une API bien pensée, cela ne devrait pas être le cas. Une API asynchrone doit détecter toute mauvaise utilisation et lancer une exception au moment de son lancement. Par exemple, si vous lancez une requête XHR vers une origine différente de votre site, c'est une erreur de programmation. Une exception doit être lancée immédiatement.

L'astuce pour éviter tout effet de bord est de lancer l'opération asynchrone avant d'assigner les callbacks ou écouteurs d'évènements. De cette façon vous êtes certains que ces derniers ne seront jamais appelés en cas de levée d'une exception.

## Retour sur les promises

Avec cette toile de fond en tête, il apparaît donc évident que les exceptions ne doivent pas être attrapées au sein des promises. En effet, au delà de l'avantage d'une gestion au cas par cas, on voit aussi que cela pourrait compromettre la détection d'une erreur fatale causant la continuation de l'exécution à partir d'un état non-prévu donc indéterminé.

On pourrait penser épargner l'utilisateur d'erreurs fatales qui en définitive mettent fin à l'exécution, mais au final, on rend les erreurs de programmation plus difficiles à détecter et les bugs plus sournois.

Il faut comprendre que les erreurs fatales doivent être exceptionnelles. Un programme qui arrive en production doit être dénué d'erreurs fatales dans l'absolu. Malheureusement, dans le monde réel, ces erreurs peuvent survenir en production.

Devons nous laisser les utilisateurs face à une application qui ne fonctionne plus ? Sûrement pas. L'approche correcte pour gérer les erreurs fatales est finalement assez simple. Il suffit d'utiliser un callback d'erreur générique, d'informer l'utilisateur d'une erreur anormale et de redémarrer l'application. On peut aussi imaginer récupérer ces erreurs fatales grâce à une requête XHR et de créer directement une issue sur GitHub. Un simple exemple :

```js
window.onerror = function (msg, url, line) {
  //demande de détails
  var details = prompt(
    "Une erreur fatale a eu lieu, vous pouvez donner quelques détails pour aider le webmaster :",
  );
  // envoi des détails via XHR puis rafraîchissement de la page
  document.location.refresh();
};
```

Ici, j'ai volontairement simplifié. Dans la pratique, on placera un timeout pour laisser le temps à toutes les erreurs consécutives d'être levées avant de demander du feedback et de redémarrer l'application. On peut aussi donner le temps à l'utilisateur de récupérer certains contenus (un formulaire à moitié rempli, par exemple) avant le rafraîchissement.

L'avantage de cette approche est qu'on informe l'utilisateur d'un problème plutôt que vouloir le lui cacher quitte à ce que ce dernier provoque un effet papillon plus difficile à détecter.

Voilà, j'espère que cet article vous a donné envie de gérer les erreurs de vos applications. Je vous propose de lire ce billet sur l'[extension BugMeBack](bugmeback.html "Voir le billet sur BugMeBack") qui propose une gestion intéressante des erreurs pour vos applications.

Petit ajout : J'ai écrit [un autre article sur les erreurs en JS](erreurs%5Fjavascript%5Fameliorees.html "Lire l'article") mais cette fois avec des exemples concrets.
