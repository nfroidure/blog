---
title: Génération automatique de clients d'APIs
description: Personne de devrait perdre du temps à écrire du code qui peut être généré automatiquement. Voici comment je m'y prends pour les clients d'APIs.
leafname: generation_api_cliente
link:
  label: Génération d'API clientes
  title: Apprenez comment générer vos clients d'API
date: "2017-02-19T15:00:00.000Z"
lang: fr
location: FR
keywords:
  - REST
  - Client
  - API
  - Génération
categories:
  - JavaScript
---

# Génération automatique de clients d'APIs

**TL; DR:** Générez du code simple et allez à l'essentiel.

Il paraîtrait fou de nos jours avec des outils Comme HapiJS, ExpressJS ou même avec un routeur perso comme le mien de créer des APIs non-documentées. L'initiative [OpenAPI](https://www.openapis.org/) (anciennement la spécification Swagger) nous offre aujourd'hui une façon formelle et largement supportée de définir des APIs.

Les développeurs frontends ont besoin de prendre connaissance des APIs qu'ils utilisent mais nous devons aller encore plus loin en leur proposant une API cliente générée automatiquement.

Le projet [Swagger Codegen](https://swagger.io/tools/swagger-codegen/), propose de nombreux générateurs prêts à l'usage pour de nombreux environnements et languages cibles.

J'ai dû récemment générer un client d'API pour AngularJS (qu'au passage je trouve meilleur qu'Angular2).

Malheureusement, les générateurs existant ne me satisfaisaient pas. Ils proposent une interface en POO (patron de conception inadapté selon moi) et ajoutent un niveau de complexité inutile en éclatant l'API dans plusieurs fichiers.

Ils créent des fonctions ayant un paramètre pour chaque valeur déclarée dans le swagger créant des signatures de fonctions à rallonge dont il faut se souvenir l'ordre des arguments. Comme notre application utilisait ES6, je voulais également tirer parti du destructuring pour avoir un interface plus moderne pour notre client d'API.

J'ai donc décidé de créer notre propre générateur en prenant en compte ce qui fait d'un client d'API un bon client :

## Du code généré ne doit pas être modifié à la main

En effet, si l'on peut générer du code une fois, on peut le faire mille fois. Pour moi, générer le client d'API devrait être fait à chaque build.

Dans mon cas, j'ai créé rapidement un chargeur Webpack pour les fichiers `*.swagger.json` me permettant d'importer notre client d'API dans Angular grâce à une simple ligne de code comme suit `require('./api.swagger.json');`.

L'avantage de ne pas avoir à changer le code à la main est que de ce fait on se fiche totalement que le code ne soit pas élégant ou que les fichiers générés soient trop long ou mal indentés. Seule la surface de l'API a une vraie importance.

## L'API doit masquer les détails HTTP

Rien n'est pire que d'avoir des dizaines de milliers de lignes de code qui dépendent de vos appels HTTP. D'expérience, maintenir une API REST retro-compatible est un véritable cauchemar pour la productivité, surtout quand on part d'un existant peu structuré.

Sauf si votre API est publique, vous pouvez vous épargner de nombreuses peines en masquant les détails de vos appels HTTP et en les englobant dans une simple fonction dont l'unique argument est un objet dont les propriétés sont les paramètres acceptés par votre appel HTTP.

Par exemple, dans mon client HTTP, `GET /articles/{articleId}?token=x` devient simplement `getArticle({ articleId, token })`. Si demain, le paramètre `token` devait être ajouté dans le header `Authorization` au lieu des paramètres de requête, ce serait transparent pour les frontends.

Ils n'auraient qu'à réimporter le fichier OpenAPI et à simplement builder le projet de nouveau sans rien avoir à faire de plus.

Je suis, en quelques sorte, pompier de vielle application Express depuis quelques années. Je transforme des APIs réalisées à la hâte en API RESTful progressivement en essayant de ne rien casser. Bénéficier de ce type de flexibilité est du pain béni. Par exemple, transformer les appels POST en appels PUT avec un UUID généré via le client devient simple comme bonjour.

## Une surface d'API minimaliste

Je n'ai fait qu'exporter un service Angular nommé `API`. C'est un simple objet ayant une méthode pour chaque id d'opération du fichier Swagger. Pas de POO, pas de gestion de l'authentification, simplement un gros mapping des appels HTTP possibles en fonctions.

Utiliser ce client dans l'application hôte revient donc à créer un autre service par dessus ajoutant la logique d'accès spécifique à l'application.

## Effets de bord sympas

Depuis que je fais du développement d'API Rest dirigé par la documentation (depuis [assez longtemps](https://github.com/Rest4/Rest4-php/blob/master/php/class.RestAuthDigestDriver.php#L7-L30) en fait), je prend soin de forcer un order précis pour les paramètres de requête (query parameters).

Ceci me permet d'optimiser le cache en assurant l'unicité des URLs pour une même ressource. Cependant, cela peut ennuyer les développeurs fronts qui n'aiment pas les APIs strictes. Pour plus d'info, vous pouvez jeter un œil à [strict-qs](https://github.com/nfroidure/strict-qs).

L'avantage de générer soit même le code du client d'API front est que l'on peut gérer tout cela de manière transparente pour les développeurs front qui ne sont plus confrontés à des erreurs dues à leur utilisation de l'API Rest.

## Et si on s'amusait un peu?

Bon, générer du code c'est plus cool que de l'écrire. Mais pourquoi ne pas saisir l'occasion pour recycler une vielle idée ? Pourquoi ne pas créer un nouveau genre de template ? J'ai déjà exploré la puissance des arbres AST avec [jsub](/en/blog/lets_subset_javascript) mais je voulais expérimenter un autre concept basé là dessus que j'ai nommé template AST.

L'idée est de créer des templates pour générer des fichiers JavaScript mais qui sont eux-même des fichiers JavaScript valides. De cette façon, les outils de linting, d'analyse de syntaxe et tous ceux qui sont habituellement compatibles avec du bon vieux JS fonctionnent.

J'ai donc créé [astpl](https://github.com/nfroidure/asttpl) et je vous laisse voir le template de notre client d'API AngularJS avec cet [exemple](https://github.com/nfroidure/asttpl/blob/master/src/realworld.mocha.js#L82-L131).

Et voilà ! J'espère que je vous ai donné envie de générer vos client d'APIs et que mes quelques conseils vous éviteront certains déboires ;).
