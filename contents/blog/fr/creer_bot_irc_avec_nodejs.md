---
title: Créer un bot IRC avec NodeJS
description: J'ai récemment pu tester la création d'un bot NodeJS grâce à la mise en place de Marionnette, le bot IRC de FranceJS.
leafname: creer_bot_irc_avec_nodejs
link:
  label: Bot IRC NodeJS
  title: En savoir plus sur les bots IRC avec NodeJS
date: "2013-05-05T08:04:57.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - NodeJS
  - IRC
categories:
  - JavaScript
---

# Créer un bot IRC avec NodeJS

J'ai récemment pu tester la création d'un bot NodeJS grâce à la mise en place de Marionnette, le bot IRC de FranceJS.

Il est très intéressant de voir à quel point NodeJS simplifie la vie des développeurs. Grâce à son système de gestion de paquets très performant et son écosystème grandissant, NodeJS permet de développer des applications en un éclair.

Le dernier exemple en date est le Robot IRC que j'ai développé pour la canal IRC de [FranceJS](http://francejs.org/ "En savoir plus sur FranceJS") qui a été baptisé Marionette. Un simple `npm install irc` et nous voilà capables de créer un [client JavaScript pour IRC](https://node-irc.readthedocs.org/en/latest/API.html "Voir la doc du packet IRC") prenant en charge la majorité des évènements qui peuvent avoir lieu lorsque l'on est connecté sur IRC.

## Création du client

Pour créer le client, rien de plus simple, il suffit d'utiliser le constructeur `irc.Client` après avoir inclus la librairie :

```js
var irc = require("irc");
var client = new irc.Client(server, botName, options);
```

## Écoute des évènements

Une fois le client créé, il suffit d'écouter les évènements qui nous intéressent. Par exemple, pour que le bot puisse traiter les messages privés :

```js
client.addListener("pm", function (nick, message) {
  executeCommand(message, nick, IRC_DEST_NICK);
});
```

Ce code est directement extrait du code de Marionnette, la fonction `executeCommand` prend en argument le message à analyser, l'utilisateur à son origine et la voie par laquelle le bot IRC doit répondre (sauf mention contraire).

## Traitement des commandes

Comme attendu, il se déroule au sein de la fonction [executeCommand](https://github.com/nfroidure/irc-bot/blob/master/bot.js#L123 "Voir la fonction"). Son objet est de déterminer si le premier mot du message reçu est une commande qu'il peut interpréter. Si une commande valide est trouvée, alors le code afférant est exécuté.

L'exécution d'une commande vise à déterminer deux variables : la variable `messages` qui contiendra le tableau de messages à afficher en retour de la commande et la variable `dest` qui pourra être modifiée pour changer l'endroit où le message sera affiché.

La variable `dest` peut prendre trois valeurs différentes pour le moment :

- `IRC_DEST_CHAN` : les messages seront affichés sur le canal #FranceJS
- `IRC_DEST_NICK` : les messages seront envoyés en message privé à l'initiateur de la commande
- `IRC_DEST_SELECT` : les messages seront envoyés à l'endroit où la commande a été envoyée.

Cela permet à des commandes comme say de fonctionner. Celle-ci permet de faire parler Marionnette en lui envoyant ce qu'elle doit dire par message privé, assez fun :).

## Archivage des messages

L'une des premières fonctions du bot était de pouvoir [archiver les messages](https://github.com/nfroidure/irc-bot/tree/master/logs "Voir les archives") du canal FranceJS pour l'Histoire avec un grand H :). C'est l'objet de la fonction [logMessage](https://github.com/nfroidure/irc-bot/blob/master/bot.js#L100 "Voir cette fonction").

Celle-ci prend en argument le type de message (qui peut être multiple grâce au BitBashing, j'en reparlerai ici) et les champs à ajouter au fichier journal (qui est au formatCSV).

Cette fonction n'écrit pas directement les messages dans le log, mais les stocke dans un tampon. L'écriture n'est déclenchée qu'au delà d'une certaine durée (fixée par BUFFER_TIMEOUT) ou d'un certain nombre de lignes (BUFFER_SIZE). Cela évite de trop solliciter le disque dur pour de petites écritures.

## Interaction avec Twitter

Pour interagir avec twitter, il suffit d'installer le [package twitter](https://npmjs.org/package/twitter "Voir la fiche du package twitter sur npm") (`npm install twitter`).

### Récupération des tweets

Afin d'être au courant de ce qu'il se passe sur Twitter à propos de FranceJS, j'ai créé la fonction `[getTwitts](https://github.com/nfroidure/irc-bot/blob/master/bot.js#L42 "Voir la fonction")` qui récupère la liste des twitts avec le hashtag #FranceJS, vérifie leur fraîcheur et les envoie sur le canal le cas échéant.

Celle-ci est appelée tous les `TWITTER_TIMEOUT` secondes pour vérifier les nouveaux tweets.

### Envoie de tweets

[La commande tweet](https://github.com/nfroidure/irc-bot/blob/master/bot.js#L213 "Voir le code de la commande") permet de twitter directement avec le compte FranceJS pour peu que l'on soit administrateur.

## Exécution de code JavaScript sandboxé

Il peut être intéressant de pouvoir exécuter des petits bouts de code JavaScript sur un canal IRC pour pouvoir illustrer ses propos. Une petite recherche m'a permis de découvrir sandbox, un package node qui permet d'exécuter du code tiers (npm install sandbox).

J'ai donc créé la commande eval qui permet d'exécuter des petits snippets de code. J'ai jeté un œil à la source de ce paquet et il semble qu'il crée directement un autre processus pour exécuter le code JavaScript. Un timeout est également de la partie. Si le code JavaScript est toujours en cours d'exécution après n millisecondes, le processus est tué. Ce modèle me semble assez sécurisé pour être utilisé dès maintenant.

## Conclusion

Je ne sais pas comment on faisait avant pour créer des bots IRC (à vrai dire, je m'en moque). Ce que je sais, c'est qu'aujourd'hui, grâce à node, il est possible de créer simplement un bot IRC fonctionnel en quelques heures de code. Mais finalement, nous pouvons élargir ce principe à un grand nombre de serveurs ou clients.

Node est vraiment l'ami du développeur, il le rend agile et productif. Il y a forcément un paquet qui fait ce que vous cherchez à faire, ce dernier est forcément documenté et il a également de grande chance d'être publié sur GitHub vous permettant d'y apporter votre contribution ou de résoudre vous même les bugs qui vous bloquent.

Bref, merci JavaScript, merci NodeJS !

PS : Vous êtes les bienvenus pour améliorer le bot et pour venir nous dire bonjour sur le [canal IRC de FranceJS](irc://irc.freenode.net/francejs "Aller sur le canal IRC").
