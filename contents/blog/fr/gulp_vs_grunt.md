---
title: Gulp remplacera-t-il Grunt ?
description: Gulp est un concurrent de Grunt qui se targue d'exploiter les capacités des streams NodeJS. Petit passage en revue de cet outil.
leafname: gulp_vs_grunt
link:
  label: Gulp vs Grunt
  title: En savoir plus sur Gulp
date: "2013-12-23T22:25:29.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - NodeJS
  - Grunt
  - Gulp
categories:
  - JavaScript
  - Gulp
---

# Gulp remplacera-t-il Grunt ?

---

⚠ Attention: Cet article est ancien et n'est conservé que pour des raisons historiques. Gulp a bien remplacé Grunt, mais ce fût de courte durée ;).

---

Gulp est un concurrent de Grunt qui se targue d'exploiter les capacités des streams NodeJS. Petit passage en revue de cet outil.

Si vous ne l'avez pas déjà lu, mon billet sur la génération de fontes vous permettra de [découvrir GruntJS](gruntjs%5Ffont%5Ficons.html "Lire ce billet"). Pour résumer, GruntJS permet d'exécuter des tâches diverses et variées grâce à un nombre impressionnant de plug-ins publiés sur NPM. Bref, un outil intéressant mais souffrant de quelques lacunes.

## Les défauts de GruntJS

L'un des reproches les plus importants que j'ai à formuler vis à vis de GruntJS est très certainement l'absence d'exploitation des streams. En effet, chaque tâche Grunt lis un fichier et écrit dans le suivant de telle manière que les performances en sont affectées, surtout pour les développeurs qui ont des disques durs classiques.

On se retrouve avec des tâches "silos" qui ne peuvent s'exécuter que l'une après l'autre alors que bien souvent, il serait techniquement possible d'effectuer ces tâches de manière plus fluide grâce aux streams.

Une conséquence de ce problème est qu'il y a énormément de répétitions dans la configuration des tâches car on doit les configurer indépendamment plutôt que de montrer leurs relations.

## L'apport de Gulp

[Gulp](http://gulpjs.com/ "Voir le site officiel") propose une toute autre vision en considérant une tâche comme une sorte de middleware, à l'image de ce que l'on trouve pour Connect/Express. La description d'une tâche Gulp devient donc une succession d'opérations spécifiques sur des fichiers. Gulp tire donc parti des streams NodeJS à plusieurs niveaux.

Tout d'abord, au niveau des tâches, Gulp utilise les streams de NodeJS et plus particulièrement leur mode "objet" ([objectMode](http://nodejs.org/api/stream.html#stream%5Fobject%5Fmode "Voir la documentation")). La physionomie d'une tâche Gulp est la suivante :

1. création d'un flux d'objets représentants les fichiers obtenus à partir d'un pattern donné (via la méthode `gulp.src` qui utilise [glob-stream](https://github.com/gulpjs/gulp/blob/96d6596bf313489afa2a967487f74c5f8d2e7f06/lib/createInputStream/index.js#L2 "Voir la ligne")) ;
2. branchement de ce flux sur une ou plusieurs tâches (via la méthode `pipe`) ;
3. enregistrement du résultat dans un ou plusieurs fichiers (respectivement via la méthode gulp.dest ou via une tâche).

Chaque objet est donc passé de manière asynchrone dans l'enchaînement de tâches configuré pour l'occasion. Chaque [objet File](https://npmjs.org/package/vinyl "Voir le package utilis") passé contient les informations suivantes :

- le chemin du fichier ;
- le répertoire courant ;
- le contenu du fichier ;

Le contenu du fichier peut être nul, être un [Buffer](http://nodejs.org/api/buffer.html "Voir la documentation de NodeJS pour les buffers") de son contenu ou un [ReadableStream](http://nodejs.org/api/stream.html#stream%5Fclass%5Fstream%5Freadable "Voir la documentation de NodeJS pour les streams"). Par défaut, Gulp fournit un Buffer, c'est peut-être d'ailleurs son plus grand défaut.

En effet, les streams sont dans la plupart des cas une suite de Buffers. Utiliser les streams permet donc également d'utiliser un unique buffer au sein d'un stream. Bref, utiliser les streams uniquement aurait pu simplifier la création de plug-ins.

Si on résume, Gulp propose d'agir sur des flux de fichiers qui peuvent eux-même proposer leur contenu sous forme de Buffer ou un flux de leur propres données.

## À quoi ça sert ?

Les streams permettent d'optimiser l'utilisation des ressources systèmes et offrent une plus grande souplesse. Imaginons la combinaison de tâches suivante à appliquer à des fichiers :

- remplacer "foo" par "bar" ;
- ajouter une phrase au début du fichier ;
- tronquer le fichier à partir de 10000 lignes.

Le design de GruntJS fera qu'il y aura autant de fichiers écrits sur le disque qu'il y a d'étapes. De plus, chacune de ces étapes se fera sur la totalité des fichiers séquentiellement.

Avec Gulp, chaque fichier sera passé aux tâches de manière totalement asynchrone. Théoriquement, il est possible que le premier fichier envoyé aux tâches soit écrit sur disque alors que tous les fichiers concernés par le pattern fournit à `gulp.src` n'ont pas encore été totalement listés.

Mais en plus de cela pour les fichiers eux-mêmes, en utilisant le mode stream, une tâche effectuée en dernier (ici, tronquer le fichier à 10000 lignes) peut influer sur les tâches précédentes.

En effet, puisque l'on ne souhaite prendre en compte que les 10000 premières lignes, pourquoi remplacer "foo" par "bar" dans les lignes suivantes ? En fermant le flux après les 10000 lignes, l'évènement sera transmis aux flux parents. Théoriquement, il est possible que la lecture des données s'interrompe également permettant ainsi d'économiser des ressources.

Puisque les streams sont asynchrones, on peut utiliser les différentes ressources système simultanément. Écrire sur le disque ne demande pas beaucoup de CPU ou de mémoire, a contrario, opérer sur les données ne sollicite pas les disques (sauf cas extrême). Avec GruntJS, ces étapes ont lieu séquentiellement ce qui crée des goulets d'étranglement. Avec Gulp ces dernières sont simultanées, menant à une utilisation plus intelligente du système.

## Et dans la pratique ?

Dans la pratique, ce n'est pas si simple. Tout d'abord car les créateurs de Gulp indiquent clairement que les créateurs de plug-in peuvent ne supporter que les buffers ce qui réduit quelque peu l'intérêt de Gulp. Les streams au niveau des fichiers sont cachés derrière une option que peu activeront.

Un autre problème qui est posé par cette façon de faire est comment opérer sur les fichiers en cours de traitement (renommer/supprimer) sans être sûr qu'il n'y aura pas d'effets de bord imprédictibles. Le fonctionnement de Grunt est sur ce point plus "rassurant".

Étant donné le manque de maturité de Gulp et le succès de GruntJS, je pense rester sur GruntJS au moins dans un premier temps. Ce qui ne m'empêchera pas de rester attentif. Je suis entrain de porter [grunt-svgicons2svgfont](https://github.com/nfroidure/grunt-svgicons2svgfont "Voir le dépôt du plug-in") vers Gulp, je vous en donne des nouvelles bientôt ;).

Edit du 16/12/2013 : Finalement, le fait de supporter les buffers est moins handicapant que prévu puisque le module vinyl permet de faire abstraction du fait que le fichier soit un Buffer ou un Stream. A un petit détail près. En effet, piper un stream est susceptible d'émettre un évènement `end` pour indiquer la fin du stream, mais piper un buffer n'émet pas cet évènement. Je viens de soumettre une [pull request à ce sujet](https://github.com/wearefractal/vinyl/pull/2 "Voir son contenu"), j'espère qu'elle sera rapidement acceptée.

Malheureusement, cette abstraction ne semble exister qu'en entrée mais pas en sortie. Je continue d'investiguer en même temps que j'adapte mon plug-in Grunt. Je rééditerai sûrement ce billet avec d'autres informations pratiques.

Enfin, je ne l'ai pas précisé, mais les plug-in Gulp sont plus facile à tester puisqu'il ne nécessitent pas d'écrire sur un fichier ce qui est le cas avec GruntJS.
