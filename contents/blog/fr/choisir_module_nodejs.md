---
title: "Bien choisir ses modules NodeJS : ma méthode"
description: Hier à la troisième édition de ChtiJS, un question a été soulevée sur la confiance que l'on pouvait avoir dans les modules NodeJS. Je vous dévoile donc ma méthode pour trancher entre npm install et npm remove ;).
leafname: choisir_module_nodejs
link:
  label: Choisir les modules NodeJS
  title: En savoir plus sur ma méthode pour choisir des modules pour NodeJS
date: "2013-07-26T14:04:25.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - NodeJS
  - Modules
categories:
  - JavaScript
  - Modules
---

# Bien choisir ses modules NodeJS : ma méthode

Hier à la troisième édition de ChtiJS, un question a été soulevée sur la confiance que l'on pouvait avoir dans les modules NodeJS. Je vous dévoile donc ma méthode pour trancher entre npm install et npm remove ;).

Il existe deux types de modules. Les natifs que l'on retrouve à l'installation de NodeJS et qui peuvent être utilisés via un simple require. Et les modules NPM (Node Package Manager) que l'on télécharge grâce à la commande `npm install` et que l'on peut consulter sur le [site dédié aux modules NodeJS](http://npmjs.org "Voir le site des modules NodeJS").

## Les modules natifs

Pour avoir créé des applications node assez tôt, je peux affirmer que même les modules instables cassent rarement la compatibilité. Si ils le font, c'est rarement brutal. On observe un message indiquant que telle ou telle méthode est dépréciée plusieurs versions avant le retrait définitif. En général, on observe plutôt un ajout de fonctionnalités plutôt qu'une refonte des API.

Cependant, un excellent moyen d'être informé des problèmes éventuels est de suivre le flux RSS du [blog du projet](http://blog.nodejs.org/ "Se rednre sur le blog de NodeJS") qui pour chque nouvelle version indique les ajout et modifications réalisés ainsi que les problèmes qui peuvent en résulter.

## Les modules tiers

N'importe qui peut soumettre un module NodeJS avec NPM. C'est pour cette raison qu'il est nécessaire d'être attentif à la sélection de ces derniers. L'un des premiers discriminants est l'absence de tests.

### Choisir des modules testés

Les chiffres mis en avant par un projet d'examem des modules NPM sont sur ce point peu rassurant. Seuls 50% des modules possèderaient des tests. Parmi eux, seul 50% passeraient leurs propres tests.

Un projet qui ne passe pas tous les tests n'est pas forcément mauvais. Il peut s'agir d'un module réalisé en TDD et ainsi, les fonctionnalités futures dont les tests sont déjà écrits mais pas encore implémentés ne passent logiquement pas.

### Choisir des modules open-source/collaboratifs

Un autre point fondamental est la manière dont le développement est réalisé. Si le projet est sur GitHub et possède une licence libre, c'est déjà un bon point. Si en plus il est vivant (mis en favoris, commit réguliers de diverses personnes, issues rapidement résolues etc...), alors vous pouvez avoir confiance dans ce module.

La documentation doit également être bonne. Le fameux "Get started" dans le fichier README est un must-have. Un documentation plus complète est un gros plus. On peut prendre l'exemple de RequireJS qui pousse le bouchon jusqu'à insérer les URL du manuel pertinentes dans le texte de ses exceptions (vous n'avez plus qu'à cliquer :p).

### Inspecter le code source

Rien de mieux pour juger de la qualité d'un module que d'inspecter son code. Ma méthode pour ce faire est très simple :

- consultation du fichier `package.json` : on peut ainsi y trouver la dépendance à d'autres modules. En effet, un module basé sur un mauvais est forcément mauvais, qu'importe la qualité de ce dernier. Autre info utile, on y retrouve le fichier principal (propriété `main`). Cela va vous servir de point de départ pour la lectuire de la source. Enfin, la propriété `scripts.test` permet de savoir si des tests sont présents ou non et l'endroit où ils se trouvent.
- lecture du dichier principal : il ne nous reste plus qu'à examiner le code. Les appels à la fonction `require` nous permettent d'accèder aux autres fichiers du module pour inspecter plus profondément ce dernier.

Voilà, j'espère vous avoir aidé à choisir vos modules, n'hésitez pas à me proposer vos méthodes en commentaire, je serai ravi d'enrichir celle-ci avec vos idées.

Maintenant que vous savez comment choisir vos modules NodeJS, découvrez[ comment les tenir à l'œil](./watchdeps.md "En savoir plus à propos de watchdeps") !
