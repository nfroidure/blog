---
title: Documentation d'applications en JavaScript
description: Documenter son code est parfois fastidieux. Pourtant, c'est une nécessité. Petit retour d'expérience sur les techniques et outils que j'utilise.
leafname: documentation_du_code
link:
  label: Documenter son code
  title: En savoir plus sur la documentation de code JavaScript
date: "2017-03-11T18:02:27.000Z"
lang: fr
location: FR
keywords:
  - Documentation
  - JavaScript
categories:
  - Documentation
  - JavaScript
---

# Documentation d'applications en JavaScript

Documenter son code est parfois fastidieux mais c'est une étape essentielle pour se faire comprendre de ses pairs. Dans ce billet, je vais faire un tour d'horizon des techniques que j'utilise pour ce faire et des outils que j'ai créé récemment pour compléter mon arsenal.

## La base

### Diviser pour mieux régner

Je ne rate jamais une occasion de créer un nouveau module NPM. En effet, isoler le code générique de son application dans un module open-source avec une API concise et restreinte facilite la documentation de votre application.

De plus, si ce module existe déjà et est lui-même bien documenté le travail est encore moins important. En général, on a même l'embarras du choix. Personnellement, en plus des conseils que j'ai donné dans [ce billet](./choisir_module_nodejs), je privilégie les modules exposant des fonctions pures quand c'est possible. Par exemple, je préfère utiliser un module comme [content-disposition](https://github.com/jshttp/content-disposition) plutôt que d'utiliser un middleware ExpressJS.

### Fichier README

Le fichier README doit être simple et concis. J'ai fait beaucoup de README Driven Development, mais aujourd'hui, je me contente d'y décrire l'intention du module/de l'application et je suis revenu à un mélange entre TDD et le développement dirigé par la documentation. J'y reviendrai, mais globalement, aujourd'hui, mes fichiers README sont générés automatiquement et contiennent titre, description, badges, brief, référence de l'API. Par exemple, celui de [strict-qs](https://github.com/nfroidure/strict-qs). Vous pouvez jeter un œil à [ma recette](https://github.com/nfroidure/metapak-nfroidure/tree/master/src/readme) pour les générer.

### Fichier CHANGELOG

Je ne l'ai que récemment mis en place sur tous mes projets et pourtant c'est clairement nécessaire. Savoir ce qui a changé et quand est très important pour les consommateurs de vos modules, à commencer par vous.

Mettre en place un bon changelog nécessite un peu de travail. Il est, par exemple, préférable d'utiliser une convention de commit. Pour ma part, j'ai choisi [commitizen](https://www.npmjs.com/package/commitizen) qui permet de gérer automatiquement le type de changement et de versionner en conséquence selon les principes de semver.

J'ai mis en place un [petit hook](https://github.com/nfroidure/metapak-nfroidure/blob/master/src/%5Fcommon/hooks.js#L3-L13) pour forcer le commit avec commitizen car après des années de commit via la commande de git, difficile de changer un réflexe bien ancré ;).

Au final, on obtient un [joli changelog](https://github.com/nfroidure/knifecycle/blob/master/CHANGELOG.md) qui permet de ne pas perdre de temps sur des informations qui peuvent être générées automatiquement.

### JSDocs

J'ai beaucoup tergiversé sur JSDoc. Parfois je l'utilisais, d'autre fois non. Aujourd'hui je l'utilise de manière systématique car c'est devenu painless. En effet, grâce aux addons comme [docblockr](https://atom.io/packages/docblockr) pour Atom, l'autocomplétion des définitions JSDoc est une réalité.

Aussi, eslint permet d'éviter que vos définitions JSDoc divergent de votre code. Même si JSDoc n'est pas idéal, c'est mieux que rien ou que de se palucher une documentation à la main. Ça a aussi le mérite de coupler la documentation avec le code. En revanche, utiliser JSDocs ne sert à rien ou presque si vous ne fournissez pas d'exemple d'utilisation comme je l'ai fait par exemple [ici](https://github.com/nfroidure/knifecycle/blob/d78ecd3d58f7b1f1a95cb7e8800d0a06ff657530/src/index.js#L77-L100).

## Ma touche personnelle

Ces pratiques de base sont nécessaires mais j'avais encore quelques points qui me chagrinaient. En effet, pour les modules exposant de simple fonctions pures JSDoc se suffit souvent à lui même, mais pour des applications (web services, SPA ou des programmes en ligne de commande) il manque tout de même une vision macroscopique de l'architecture du code.

### Notes d'architecture avec jsarch

C'est généralement dans le fichier README que l'on met ces informations. Le problème, c'est que souvent, on oublie de mettre à jour ce dernier quand on modifie le code, tout simplement à cause du fait que la documentation et le code se trouvent dans des fichiers différents.

J'ai donc récemment créé [jsarch](https://github.com/nfroidure/jsarch), un module ridiculement simple, qui permet d'ajouter des notes d'architecture directement dans le code. Ces notes sont ensuite regroupées, réordonnées pour créer un fichier décrivant l'architecture et pointant vers les endroits du code où ces choix prennent place.

Rien de tel que [le fichier d'architecture de jsarch](https://github.com/nfroidure/jsarch/blob/master/ARCHITECTURE.md) pour illustrer le type de fichier qu'on obtient en sortie ;).

### Graphe des dépendances

Je n'ai plus l'intention d'utiliser AngularJS et je ne suis pas particulièrement fan d'Angular2\. Cela dit, le système d'injection de dépendances de ce dernier m'a vraiment séduit. À un point tel que j'en ai fait [un clone](https://github.com/nfroidure/knifecycle) que j'utilise pour toutes mes applications (CLI, backend ou frontend).

Cela me permet de séparer le monde des fonctions pures de celui des fonctions qui utilisent des variables globales. C'est pratique pour les tests, pour l'instrumentation du code ou simplement pour facilement remplacer un service par un autre.

Ça fonctionne assez bien avec React ;). Je gère le bootstrap de l'application avec et, par exemple, je peux remplacer des services par d'autres de mock pour mon React storybook.

Grâce à mon ex-collègue et ami [Sébastien Elet](https://twitter.com/SebastienElet), j'ai découvert [mermaid](https://github.com/knsv/mermaid) un outil permettant de générer des graphes. Pour améliorer encore cette vision macroscopique de l'architecture de mes applications, j'ai ajouté à Knifecycle une fonction d'export qui me permet de générer des graphes de dépendances comme celui que vous avez pu apercevoir dans le fichier d'architecture de jsarch ou dans le tweet suivant avec des exemple issus des applications que je crée pour 7Digital.

Voilà ! Si vous avez d'autres astuces pour documenter son code JavaScript comme un as, je suis clairement preneur !
