---
title: Micro-services first avec NodeJS
description: Retour rapide sur ma présentation au ChtiJS 15 sur les microservices et le design d'APIs avec NodeJS.
leafname: presentation_nodejs_rest_microservices
link:
  label: Micro-services first
  title: En savoir plus sur cette technique
date: "2016-02-28T20:32:43.033Z"
lang: fr
location: FR
keywords:
  - NodeJS
  - Micro-service
  - API
  - REST
categories:
  - Applications Web
---

# Micro-services first avec NodeJS

Jeudi dernier j'ai eu l'honneur de faire une présentation à [ChtiJS 15](http://chtijs.francejs.org/archives/2016-02-25/index.html "Voir le résumé de cette édition"). Comme à chaque fois que je fais une présentation, je passe forcément à côté de deux ou trois détails.

C'est donc l'occasion pour moi de proposer un petit billet sur pourquoi et comment il est indispensable de développer votre backend NodeJS avec une vision micro-service dès le départ.

Si vous avez assisté à ma présentation, vous connaissez ma vision de ce qu'est une API REST, mais pour reprendre ma métaphore et pour ceux qui n'ont pas pu venir, c'est un peu comme un distributeur de cacahouètes.

On y met une pièce (l'équivalent d'une requête HTTP) puis quand la transaction est effectuée (pièce bloquée dans le monnayeur, l'équivalent d'un statut 200 OK), alors on reçoit des cacahouètes (une réponse HTTP).

Quand une transaction est validée, on garanti que le système a bien enregistré tout changement d'état et que par ailleurs, toute opération qui peut découler de ce changement sera effectuée.

On peut mettre côté à côte plusieurs distributeurs et pas nécessairement de cacahouètes. C'est un peu l'équivalent des URIs (ou ressources REST).

On peut également déclencher certaines actions de manière différées pour valider une transaction au plus tôt. C'est typiquement le cas de l'envoi de mails ou de la synchronisation à des systèmes distants.

L'approche micro-service telle que je la conçoit est donc répartie comme suit :

- un frontal REST : un ou plusieurs processus qui traitent les requêtes entrantes;
- un queue : dans laquelle on stocke des évènements qui déclencheront des actions différées. Ces évènements sont dépilés par de nombreux processus spécialisés ce qui isole les responsabilités;

Vous avez probablement, comme moi, vu circuler quelques articles vous expliquant pourquoi vous feriez mieux d'apprendre à créer une application avant de penser à faire une architecture scalable.

Au delà de l'aspect péremptoire du conseil, je m'inscrits en faux sur ce point. Il n'est jamais trop tôt pour bien faire. Pour faire mieux, pour faire plus...

En effet, n'importe quel frontal REST doit pouvoir être subdivisé en plusieurs processus, micro-service ou pas, tout simplement car un processus NodeJS ne doit pas garder d'état local. C'est une bonne pratique qui n'a rien à voir avec les microservices, mais plutôt avec la nature même d'une application NodeJS.

Ensuite, pour les traitement différés, pas la peine dans un premier temps de créer des processus spécialisés. Vous pouvez tout à fait créer une application monolithique prévue dès sa conception pour être scindée en plusieurs processus si le besoin de monter en charge se fait sentir.

Pour se faire, rien de plus simple. Au lieu d'utiliser, day one, un message broker style RabbitMQ, vous créez un simple pub/sub qui permet de découpler les actions différées de votre API REST tout en ne gardant qu'un seul processus dans la phase de développement, voire même en production si vous ne prévoyez pas un trafic monumental au démarrage (cas de 95% des apps).

Pour illustrer le principe, dans un backend créé pour un hackathon, j'ai créé [un service](https://github.com/nfroidure/TripStory/blob/cef64f401098809c81ecf8ddf2203eb48628aa46/backend/index.js#L56-L63 "Voir le service") se servant de `process` pour créer un simple pub-sub émulant un message broker.

Ainsi, quand un utilisateur se connecte avec Twitter, on [émet un évènement](https://github.com/nfroidure/TripStory/blob/cef64f401098809c81ecf8ddf2203eb48628aa46/backend/app/authentication/authentication.controller.js#L248-L253) qui est ensuite consommé [dans un simili-worker](https://github.com/nfroidure/TripStory/blob/cef64f401098809c81ecf8ddf2203eb48628aa46/backend/workers/twitter/twitter.bin.js#L7-L18) complètement découplé qui se charge de synchroniser les amis Twitter. Cette action qui pourra se faire dans un worker dédié si cette application montait en charge.

Bref, on a le beurre, l'argent du beurre, voire plus. Moralité: n'attendez jamais pour bien penser votre code, mais restez pragmatiques ;).
