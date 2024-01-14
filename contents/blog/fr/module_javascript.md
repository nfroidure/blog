---
title: "Les modules Javascript : Un joyeux B"
description: Dès lors que l'on tente de créer des applications complexes en Javascript, la segmentation du code en divers fichiers devient nécessaire. Cela génère une nouvelle difficulté, la modularisation du Javascript.
leafname: module_javascript
link:
  label: Modules Javascript
  title: En savoir plus sur la création de modules en Javascript
date: "2012-08-17T11:34:48.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - Modules
categories:
  - JavaScript
---

# Les modules Javascript : Un joyeux B

---

⚠ Attention: Cet article est ancien et son contenu n'est plus d'actualité. Les modules JavaScript sont maintenant unifiés et en passe d'être supportés nativement sur toutes les plateformes grâce à l'effort de standardisation réalisé par la communauté.

---

Dès lors que l'on tente de créer des applications complexes en Javascript, la segmentation du code en divers fichiers devient nécessaire. Cela génère une nouvelle difficulté, la modularisation du Javascript.

Il existe deux approches principales pour la création de modules Javascript, [CommonJS](https://fr.wikipedia.org/wiki/CommonJS "Voir la définition Wikipédia"), basé sur une approche synchrone du chargement de module et AMD basé sur le chargement asynchrone des modules. Voici le résultats de mes recherches sur le sujet.

## Principe de base

Que ce soit côté serveur ou côté client, le contenu d'un fichier Javascript s’exécute dans le contexte global. L'objectif des modules est de cloisonner le code dans un contexte restreint (appelé scope), et d'exporter de ce contexte uniquement les informations nécessaires à sa bonne utilisation (closure pattern). Un exemple simple de ce principe :

```js
(function (exports) {
  var a = 1,
    b = 2; // Création de deux variables dans le scope restreint
  exports.a = a; // Variable a exportée dans le scope global
})(window);
```

Ce script est très basique malgré son apparence peu conventionnelle pour un développeur débutant en Javascript. Il crée une fonction anonyme entre parenthèse et l’exécute immédiatement après. L'objet window représentant le contexte global, il est passé en argument à cette fonction.

Ainsi, à l'intérieur de la fonction, le code s'exécute dans un contexte restreint et seules les variables ajoutées à l'objet exports seront disponibles dans le contexte global. A noter que par variable, étant donné la nature de Javascript, il peut s'agir de types natifs ou d'objets (donc aussi de fonctions).

Nous aurions pu passer en paramètre un autre contexte et ainsi permettre l'utilisation du module par un autre module.

## Approche synchrone (CommonJS, NodeJS)

Conscients de la nécessité de modulariser le Javascript, l'initiative CommonJs a proposé une méthode qui est utilisée au sein de NodeJS. Les modules CommonJS proposent deux éléments centraux. La fonction require() qui retourne le contenu exporté au chargement d'un module et l'objet exports qui permet, un peu à la manière de l'exemple précédent, d'exporter certaines valeurs du module.

La [dernière ligne du fichier VarStreamReader](https://github.com/nfroidure/VarStream/blob/ed0b883f15a0ba1e59beebcaf77169adefa4ec53/VarStreamReader.js#L344 "Voir le fichier") de mon projet VarStream montre bien comment exporter un objet (ici l'objet VarStreamReader) :

```js
if (!(typeof module == "undefined")) module.exports = VarStreamReader;
```

La condition sert à pouvoir utiliser le fichier dans un contexte étranger à CommonJS. Pour charger un module, rien de plus simple, il suffit d'utiliser la fonction globale require() comme on peut le voir dans ce fichier qui inclus le module cité précédemment :

```js
var VarStreamReader = require("./VarStreamReader");
```

Cette approche est parfaite pour le Javascript côté serveur puisque le chargement se fait directement à partir du disque dur. Malheureusement, celle-ci est imparfaite pour le chargement de modules côté client, dans un navigateur.

## Approche Asynchrone (AMD)

L'approche synchrone dans le navigateur induit un chargement séquentiel des fichiers Javascript composé d'itérations successives de la séquence téléchargement + interprétation. Ainsi, si un module nécessite le chargement de trois autres modules (concept appelé dépendance), le temps nécessaire pour résoudre ces dépendances sera donc une addition des temps de téléchargement et d'interprétation de chacun des trois fichiers Javascript.

Un autre inconvénient de l'approche synchrone est qu'elle implique le chargement du fichier via la fonction `eval` nécessairement. Or comme le rappelle la célèbre expression eval is evil, cela pose de sérieux problèmes. En effet, la fonction `eval` rend le débogage beaucoup plus compliqué puisque le numéro de la ligne et le nom de fichier ayant provoqué l'erreur ne sont pas connus, de plus, la fonction `eval` n'est pas homogène sur tous les navigateurs posant des problèmes évidents de compatibilité Cross-Browser.

Il a donc fallu trouver une approche permettant de télécharger chaque fichier Javascript de la même manière que le fait le navigateur pour les fichiers Javascript inclus directement dans le HTML. Pour cela, l'initiative AMD implémentée dans la très célèbre librairie [RequireJs](https://requirejs.org/ "En savoir plus sur cette librairie bien pratique") utilise un concept bien connu depuis l'avènement d'Ajax.

En effet, RequireJs [ajoute une balise `<script>`](https://github.com/requirejs/requirejs/blob/master/require.js "Voir le code de RequireJs impliqué") grâce aux fonctions de manipulation du DOM. Grâce à une fonction de callback, le nom, les dépendances et le contenu du module sont déclarés. Les chargements de scripts avec fonctions de callback étaient très utilisées pour charger du JSon depuis un nom de domaine tiers.

Cette approche permet un chargement asynchrone de toutes les ressources qui sont dès lors parallélisées. Le temps de chargement des modules est donc réduit au temps de chargement et d'interprétation du dernier fichier Javascript à être totalement téléchargé.

L'écriture d'un module AMD se présente comme suit :

```js
define("moduleName", ["dep1", "dep2"], function (dep1, dep2) {
  // dep1 et dep2 contiennent les exports réalisés par les modules dont dépend ce même module
  // le contenu du module vient ici
  return function () {}; // Ici, le module exporte via un retour de fonction, les valeurs souhaitées.
});
```

On pourrait croire que tout est bien qui fini bien, mais il nous reste un gros problème à résoudre. Comment utiliser les modules AMD avec NodeJS et vice-versa ? Il [existe plusieurs solutions](http://www.2ality.com/2011/11/module-gap.html "Voir les solutions passe-partout existantes") pour rendre inter-compatibles les différents modules, mais cela reste une sorte de tambouille incompréhensible. D'ailleurs, je serais ravi d'avoir vos bonnes pratiques en la matière.

Edit : On me [souffle dans l'oreille](https://twitter.com/%5FFlorian%5FR/status/236437043004207104 "Voir la conversation") que `require.js` est utilisable avec NodeJs, un petit lot de consolation donc ;).

## ECMAScript 6 : La lumière au bout du tunnel

Grâce à la dernière mouture d'ECMAScript (aussi appelé ECMAScript.next) le standard qui sous tend Javascript, un gestionnaire natif de modules Javascript sera disponible. Malheureusement, on ne peut faire aucune prévision en ce qui concerne le jour où il sera envisageable d'utiliser ce dernier étant donné qu'il faudra que tous les principaux navigateurs du marché l'aient implémenté. En ce qui concerne NodeJs, étant donné qu'il est basé sur le moteur javascript V8 de Google Chrome, son implémentation sera sûrement conditionnée à celle de Google Chrome.

L'approche de la nouvelle version de Javascript est simple, le mot clé export permet de déclarer une fonction comme devant être exportée ou d'énumérer les variables devant être exportée.

```js
var a=1, b=2, c=3;
 export a, b, c;
export function() {};
```

Voilà, vivement que nous puissions enfin utiliser cette version de Javascript et résoudre tous nos problèmes de compatibilité de modules. Vos précisions ou commentaires sont les bienvenus.
