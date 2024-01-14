---
title: Exemple de mise en oeuvre des VarStreams avec WebSockIPC et NodeJS
description: Afin de mieux mettre en exergue l'intérêt des VarStreams, j'ai créé une petite application NodeJS mettant en oeuvre une communication inter processus avec les WebSockets.
leafname: application_des_varstreams_avec_websockipc
link:
  label: WebSockIPC pour NodeJS
  title: Voir l'article sur ce sujet
date: "2012-07-09T11:57:39.000Z"
lang: fr
location: FR
keywords:
  - VarStream
  - WebSockets
  - NodeJS
categories:
  - VarStream
---

# Exemple de mise en oeuvre des VarStreams avec WebSockIPC et NodeJS

Afin de mieux mettre en exergue l'intérêt des VarStreams, j'ai créé une petite application NodeJS mettant en oeuvre une communication inter processus avec les WebSockets.

L'idée derrière WebSockIPC est de maintenir, pour chaque client, un arbre de données synchronisé. Cela permet de simplifier la communication entre le client et le serveur en introduisant une couche d'abstraction.

Afin de l'utiliser, il faut d'abord installer ses dépendances :

```sh
nfroidure:~# npm install varstream
nfroidure:~# npm install websocket
```

[WebSockIPC](https://github.com/nfroidure/WebSockIPC "Voir le fichier Javascript du serveur") est un simple fichier Javascript qu'il suffit d'executer avec NodeJS après avoir cloné le dépôt :

```sh
nfroidure:~# node websockipc.js
```

Ou encore plus simple, en live depuis la branche master :

```sh
nfroidure:~# curl https://raw.github.com/nfroidure/WebSockIPC/master/src/backend.js | node
```

Ce dernier se met alors à l'écoute de nouveaux clients. Il garde en mémoire une copie de l'arbre de données à synchroniser et reçoit les demandes de synchronisation des clients qu'il s'empresse de dispatcher à chacun d'entre eux pour maintenir continuellement le même état.

A titre d'exemple, [un programme client est livré](https://github.com/nfroidure/WebSockIPC/blob/master/www/index.html "Voir le fichier en question") avec le serveur. Ce dernier utilise avantageusement les setters/getters Javascript pour binder des éléments d'interface à l'arbre de donnée. Au final, nous avons un formulaire éditable collaborativement entre les divers clients de l'application grâce à 50 malheureuses lignes de Javascript. Elle est pas belle la vie ?

A vous d'innover avec les [VarStreams](https://github.com/nfroidure/VarStream "Voir le dépôt des VarStreams") et [WebSocketIPC](https://github.com/nfroidure/WebSockIPC "Voir le dépôt de WebSocketIPC"), rendez-vous sur leurs dépôts Git respectifs !
