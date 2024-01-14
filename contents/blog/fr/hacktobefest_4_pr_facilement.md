---
title: Obtenir 4 PR facilement et utilement pour l'Hacktoberfest
description: Vous voulez participer à l'Hacktoberfest et gagner un t-shirt, voire mieux, planter un arbre ? Suivez le guide !
leafname: hacktobefest_4_pr_facilement
link:
  label: Hacktoberfest facile
  title: Découvrez comment faire l'Hacktoberfest facilement
date: "2021-10-12T09:07:32.000Z"
lang: fr
location: FR
keywords:
  - Hacktoberfest
  - NodeJS
  - NPM
  - Modules
categories:
  - Hacktoberfest
  - NodeJS
  - NPM
  - Modules
---

# Un Hacktoberfest facile, mais utile !

Voilà, j'ai terminé mes 4 PR et cette année, je ne vais pas planter d'arbre comme l'année dernière. J'ai beaucoup regretté de ne pas avoir mon t-shirt et finalement, c'est un geste dérisoire au regard de tout ce que je fais déjà pour l'écologie. Il faut aussi se faire plaisir dans la vie ;).

Mais bon, comme je suis persuadé que vous avez envie de planter des arbres pour l'Hacktoberfest et que pas mal de personnes me demandent des conseils pour trouver des PRs simples à mettre en oeuvre, je me fends de ce petit tutoriel !

Le principe est simple, les modules NPM sont des packages qui, en principe, ne doivent contenir que le code distribué, éventuellement des mappings si ce code est transpilé et le fichier `package.json` qui déclare un peu tout ça.

Le fait est que c'est bien souvent pas le cas, puisque le contenu du paquet est, par défaut, tout ce qui est dans le dossier, à l'exception de ce que votre fichier `.gitignore` ignore. Autant dire, que ça en fait du stockage et du réseau pour des données, bien souvent, inutiles.

Un moyen simple et utile, donc, de participer à l'Hacktoberfest est de réduire la taille des modules NPM que vous utilisez. Pour ce faire, commencez par identifier les marges d'amélioration en allant dans le premier projet NodeJS venu et en exécutant la commande suivante :

```sh
du -ch -d0 node_modules/*
```

Pour vous concentrer sur les modules qui prennent le plus de place (Mo) :

```sh
du -ch -d0 node_modules/* | grep M
```

Du coup, on a une bonne vielle liste de modules bien lourdingues ;). Sur l'API de DiagRAMS Technologies, le plus lourd est `typescript` avec 61Mo.

Pour se rendre sur son dépôt :

```sh
npm repo typescript
```

De là, commence notre investigation. Pourquoi ce module est-il si lourd ? D'expérience, un module comme celui de TypeScript peut-être compliqué à comprendre et, pour le premier, je vous conseille d'être un peu moins ambitieux/ses. La plupart des modules un peu trop lourds, le sont du simple fait qu'ils n'exploitent pas le champ [files](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#files) du fichier `package.json`.

Une fois que vous avez pu identifier avec certitude que le problème est bien un manque de déclaration, il vous suffit de forker puis cloner le repository, de l'installer, d'ajouter les déclarations et de faire une PR :

```sh

# Cloner et installer
git clone git@github.com:{my_username}/{my_fork}.git;
cd module;
npm i;

# Packager le module et mesure sa taille
npm pack;
du -h my_fork-x.x.x.tgz

# Jouter le champs `file`

# Packager le module et vérifier sa taille

npm pack;
du -h my_fork-x.x.x.tgz

# Installer et tester si le module fonctionne toujours

cd my_project;
npm install my_fork-x.x.x.tgz;
npm test;

```

Et voilà ! Vous n'avez plus qu'à soumettre votre pull-request en précisant le poids du module avant et après votre modification ! Simple, écologique et utile, promesse tenue !
