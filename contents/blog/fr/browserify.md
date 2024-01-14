---
title: "Browserify : Partager le code JavaScript entre front et back end"
description: Exécuter du JavaScript aussi bien côté serveur que dans le navigateur de vos clients devient possible grâce à Browserify.
leafname: browserify
link:
  label: Browserify
  title: En savoir plus sur Browserify
date: "2013-12-16T12:23:52.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - NodeJS
  - Browserify
categories:
  - JavaScript
---

# Browserify : Partager le code JavaScript entre front et back end

---

⚠ Attention: Cet article est ancien et n'est conservé que pour des raisons historiques. L'approche privilégiée aujourd'hui pour builder du code est basée sur les bundlers comme Webpack ou Rollup.

---

Exécuter du JavaScript aussi bien côté serveur que dans le navigateur de vos clients devient possible grâce à Browserify.

## [Browserify](http://browserify.org "Voir le site de Browserify") : Qu'est-ce que c'est ?

Il dors et déjà possible d'exécuter du JavaScript côté client et côté serveur sans utiliser Browserify. Cependant, la grande entrave actuellement est le fait que les frameworks pour le front et le back end sont différents. Ainsi, l'exercice est assez périlleux car on est contraint d'utiliser du JavaScript assez rudimentaire.

De plus, la question des dépendances de votre projet est difficile à résoudre car les systèmes de packets sont nombreux et aucun ne sort vraiment du lot côté front.

Browserify résout tous ces problèmes grâce à une technique radicale : porter la plupart des modules natifs de NodeJS sur le front.

## NPM dans le navigateur

L'idée de browserify est de créer un fichier (bundle) contenant vos fichiers JavaScript, les modules chargés grâce à la fonction require de NodeJS et enfin, les modules natifs susceptibles d'être utiles dans le navigateur.

Il existe déjà un grand nombre de modules JavaScript compatibles avec Browserify publiés sur NPM. Certains exclusivement front, d'autres indépendamment utilisables côté client et côté serveur.

## Les cas d'utilisations

Je vois déjà les sceptiques se demander pourquoi on voudrait partager du code entre serveur et client. Les situations les plus fréquentes sont :

- mutualiser la validation de données côté client et côté serveur. Dans ce cas, il faudra bien veiller à ce que cette validation se fasse en deux temps côté serveur : vérification du format puis vérification des contraintes. En effet, la plupart du temps, les contraintes dues au systèmes se font uniquement côté serveur.
- partage de code de génération du HTML avec un système de template fonctionnant aussi bien en front qu'en back. Avec ce cas d'usage vient aussi le fait de mutualiser le code gérant l'internationalisation.
- soulagement des CPU des serveurs grâce à l'exécution de code back sur les navigateurs récents. Vous générez des données que les utilisateurs peuvent télécharger ? Pourquoi ne pas les générer directement sur le poste du client ?
- prévisualisation côté client. J'ai notamment utilisé cette technique pour mon [générateur de fontes d'icône full front](http://nfroidure.github.io/svgiconfont/ "Voir ce générateur de fontes d'icônes").

Enfin, d'une manière générale, ma maxime est que qui peut le plus, peut le moins, pourquoi se priver de cette possibilité quand elle s'offre à vous ?

## Des gains évidents

En plus de ne pas avoir à écrire deux fois la même chose dans des langages différents, le partage de code entre serveur et navigateur vous permet d'avoir un code plus solide. Le code front et back est le même, il est donc consistant et souffre des mêmes bugs. Un bug résolu sur le navigateur et votre code serveur est amélioré. Pas la peine de vérifier à deux endroits si un changement a lieu dans votre façon de vérifier les données de formulaires.

Browserify étant basé sur NodeJS et NPM, c'est tout l'écosystème de Node qu'il vous apporte (le plus dynamique actuellement). Vous seriez surpris d'apprendre tout ce qu'on peut faire dans le navigateur avec du simple JavaScript. Il suffit de vérifier que le module que vous souhaitez utiliser est bien compatible.

Enfin, grâce à un simple npm install, toutes les dépendances de votre projet, back comme front, sont automatiquement récupérées. Cela rend le déploiement de votre application vraiment simple.

## Trouver/créer des modules Browserify-friendly

Pour qu'un module soit utilisable avec Browserify, il faut qu'il soit pur. Il ne doit pas avoir d'état interne et uniquement exposer des API qui retourneront les mêmes résultats avec les même paramètres en entrées. Cela exclue donc tout usage du système de fichier. D'ailleurs le modules fs de NodeJS n'est pas et ne sera probablement jamais porté sur le navigateur.

Il vaut mieux également éviter les modules qui ont trop de dépendances. L'idéal est d'utiliser des modules qui n'en ont pas du tout. Au minimum, assurez-vous qu'il n'y a pas de dépendances du style lodash ou underscore. En effet, vous auriez vite fait de vous retrouver avec cinq frameworks différents faisant la même chose dans votre code front.

Les streams de Node se prêtent parfaitement à la création de modules pour Browserify puisque leur design favorise la programmation fonctionnelle. De plus, leur nature asynchrone est adaptée au développement dans le navigateur.

La philosophie Unix ; faîtes une seule chose, mais faîtes la bien, s'applique donc encore plus fortement pour Browserify et ce n'est pas un mal.

Bref, Browserify, c'est bon, mangez-en ! Seul revers de la médaille, Browserify ne fonctionne qu'avec les navigateur récents (IE9+), mais je pense qu'avec quelques polyfills, il doit être possible de matcher IE8\. Pour un exemple de projet utilisant Browserify, jetez un œil à[Hexa](http://hexa.insertafter.com/ "Voir cet éditeur héxadécimal").

Pour ma part, j'ai complètement remplacé RequireJS par Browserify pour mes sides projects et je compte bien passer au pro dès que j'aurai résolu tous les petits détails restants.
