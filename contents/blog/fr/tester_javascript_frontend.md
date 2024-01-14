---
title: Tester son JavaScript front end
description: Depuis que j'ai découvert Karma, je ne me lasse plus de convertir mes projets pour lancer les tests grâce à cet outil. Retour d'expérience et conseils pour une utilisation pleine et entière.
leafname: tester_javascript_frontend
link:
  label: Test JavaScript front
  title: En savoir plus sur Karma et les tests automatisés
date: "2013-08-25T13:24:22.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - Tests
categories:
  - JavaScript
  - Tests
---

# Tester son JavaScript front end

Depuis que j'ai découvert Karma, je ne me lasse plus de convertir mes projets pour lancer les tests grâce à cet outil. Retour d'expérience et conseils pour une utilisation pleine et entière.

[Karma Runner](https://github.com/karma-runner/ "Voir le dépôt de Karma") est un lanceur de tests automatisés. Sa particularité est qu'il gère tous les navigateurs de Firefox à Internet Explorer 6\. Ce projet est issu et utilisé par l'équipe de développement d'AngularJS (un projet créé et soutenu par Google donc).

## Installer Karma

Karma est un module pour NodeJS, il vous faudra donc installer Node en premier lieu. Une fois cela fait, il suffit d'installer le module NPM de karma pour pouvoir commencer :

```sh
npm install -g karma
```

Il vous faudra les droits administrateur pour exécuter cette commande car elle installe Karma de manière globale ce qui est recommandé pour l'utiliser sur tous vos projets sans réinstaller Karma à chaque fois.

L'installation de base de Karma est volontairement minimaliste. Vous devrez sûrement installer des modules complémentaires (plug-ins), comme les divers frameworks de tests et de chargement de modules AMD. Pour ma part, je vais tester la librairie Commandor qui se présente sous la forme d'un module UMD, je vais donc avoir besoin du plugin RequireJS :

```sh
npm install -g karma-requirejs
```

J'utilise le framework de test Mocha, il me faut donc aussi installer le plug-in correspondant :

```sh
npm install -g karma-mocha
```

Enfin, pour chaque navigateur que nous souhaitons tester, nous devons installer les lanceurs correspondants :

```sh
# Mozilla Firefox
npm install karma-firefox-launcher
# Google Chrome
npm install karma-chrome-launcher
# Internet Explorer
npm install karma-ie-launcher
# SlimerJS
npm install karma-slimerjs-launcher
# Pour voir la liste des lanceurs disponibles
npm search karma-launcher
```

Nous voilà donc avec une installation complète de Karma Runner, il ne reste plus qu'à tester nos projets.

## Configurer les tests

Pour configurer les tests d'un projet, vous avez deux solutions, utiliser l'initieur de projets qui vous pose toutes les questions nécessaires à la création de votre fichier karma.conf.json :

```sh
karma init
```

Ou alors, simplement, copier/coller le [fichier d'un projet existant](https://github.com/nfroidure/Commandor/blob/master/karma.conf.js "Voir le fichier de configuration de Commandor"). Typiquement, le fichier de configuration Karma est une simple déclaration des navigateurs que vous souhaitez tester et des plug-ins que vous souhaitez utiliser.

Les informations les plus importantes sont les fichiers que vous voulez servir et de quelle façon. En effet, lorsque vous lancez les tests, Karma lance un serveur Web/WebSocket et démarre vos divers navigateurs en leur indiquant l'adresse à charger.

## Lancer les tests

Pour lancer les tests, il suffit de taper la commande suivante :

```
karma start karma.conf.js
INFO [karma]: Karma v0.10.1 server started at http://localhost:9876/
INFO [[launcher]]: Starting browser Chrome
INFO [[launcher]]: Starting browser PhantomJS
INFO [[launcher]]: Starting browser SlimerJS
INFO [[launcher]]: Starting browser Firefox
INFO [[launcher]]: Starting browser Opera
INFO [[PhantomJS 1.9.1 (Linux)]]: Connected on socket id wNBBZ8YKbSMaZ0ZUhsKy
INFO [[Chrome 26.0.1410 (Linux)]]: Connected on socket id \_CpwDOdv2x4SdfuRhsKz
INFO [[Other 0.0.0 (Linux)]]: Connected on socket id ik-BRxveU9jkhpzShsK0
INFO [[Opera 12.16.0 (Linux)]]: Connected on socket id NTmgHieffSR3ZXBshsK1
INFO [[Firefox 23.0.0 (Linux)]]: Connected on socket id \_p-fNdQpNOLdeJClhsK2
```

Dès lors, pour connecter un nouveau navigateur sans utiliser de lanceur, il suffit d'ouvrir l'adresse donnée par Karma dans ce dernier. Un exemple avec mon téléphone Android :

```
INFO [[Chrome Mobile 28.0.1500 (Android 4.1.2)]]: Connected on socket id Iyi7l8bgnvIh1mjyhsK
```

Pour chaque navigateur, un compte rendu des tests vous est alors présenté, si des tests échouent, alors les exceptions lancées sont affichées dans la console. C'est un peu le paradis des développeurs front-end :

```
PhantomJS 1.9.1 (Linux): Executed 0 of 0 ERROR (0.025 secs / 0 secs)
Chrome 26.0.1410 (Linux): Executed 11 of 11 SUCCESS (0.078 secs / 0.017 secs)
Other 0.0.0 (Linux): Executed 11 of 11 SUCCESS (0.155 secs / 0.024 secs)
Opera 12.16.0 (Linux): Executed 11 of 11 (5 FAILED) (0.104 secs / NaN secs)
Firefox 23.0.0 (Linux): Executed 11 of 11 SUCCESS (0.135 secs / 0.015 secs)
Firefox Mobile 23.0.0 (Android): Executed 14 of 14 (3 FAILED) (1.042 secs / NaN secs)
```

Vous pouvez voir qu'il me reste encore un peu de boulot à ce stade ;).

## Automatiser les tests avec Travis

Mais ce n'est pas tout. Peut-être que vous connaissez Travis, un hook pour GitHub qui permet de lancer les tests à chaque commit dans une machine virtuelle. Les machines virtuelles de Travis embarquent PhantomJS et Firefox par défaut. Nous allons donc utiliser Firefox pour afficher un joli logo indiquant que les tests passent bien depuis le dernier commit.

Pour ce faire, il suffit de créer un fichier au format Travis nommé [.travis.yml](https://github.com/nfroidure/Commandor/blob/master/.travis.yml "Voir le fichier Travis de Commandor") et de l'ajouter à la racine de votre projet. Vous devrez aussi autoriser travis à accéder à votre gitHub. Voilà la petite image qui indique si Commandor passe les tests depuis le dernier commit :

![Image indiquant le statut des tests](https://travis-ci.org/nfroidure/Commandor.png?branch=master)

Je l'ai ajoutée au README du projet pour monter le sérieux de ce dernier. Et voilà, Travis vous enverra un mail dès que vos tests échouent pour vous avertir. Si quelqu'un fait un pull request, Travis testera pour vous si ce PR passe bien les tests. Elle est pas belle la vie ?

## Aller plus loin

Sur le [salon IRC de FranceJS](irc://irc.freenode.org#francejs "Se rednre sur le salon IRC de FranceJS") on est euphoriques avec Karma et chacun partage ses expériences et astuces pour l'utiliser. Erwan Mest a même promis qu'il ferait un billet sur le lancement de VM IE avec Travis (:p). N'hésitez donc pas à nous rejoindre !

De mon côté, j'ai bien envie de créer un lanceur pour FirefoxOS ce qui devrait être assez simple. J'ai créé un [lanceur](https://github.com/nfroidure/karma-slimerjs-launcher "Voir le projet du lanceur") pour [SlimerJS](http://slimerjs.org "Voir le site de SlimerJS") (un [PhantomJS](http://phantomjs.org "Voir le site de PhantomJS") basé sur Gecko), mais je n'ai pas réussi à l'utiliser avec Travis.

Enfin, je suis en pleine réflexion sur la création d'un lanceur pour Android. J'ai trouvé quelques pistes comme l'outil de lancement de VM en ligne de commande ([emulator](http://developer.android.com/tools/help/emulator.html "Voir l'outil")) et l'outil de manipulation d'instances de l'émulateur ([monkey-runner](http://developer.android.com/tools/help/monkeyrunner%5Fconcepts.html "Voir l'outil")). Je pense qu'avec tout cela, il y a moyen de faire quelque chose, n'hésitez pas à me bipper si vous connaissez déjà un outil permettant de le faire.
