---
title: Les subtilités de RegExp en Javascript
description: Les expressions régulières sont très peu populaires, elles sont pourtant surpuissantes. Néanmoins, il y a quelques subtilités à connaître, dont une que j'ai récemment apprise.
leafname: subtilites_de_regexp
link:
  label: Subtil RegExp
  title: En savoir plus sur les subtilités de RegExp
date: "2013-02-02T09:41:13.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - RegExp
categories:
  - JavaScript
  - RegExp
---

# Les subtilités de RegExp en Javascript

Les expressions régulières sont très peu populaires, elles sont pourtant surpuissantes. Néanmoins, il y a quelques subtilités à connaître, dont une que j'ai récemment apprise.

J'ai une très forte expérience dans l'utilisation des expressions régulières notamment grâce à BBComposer et les [différents parseurs](https://github.com/nfroidure/BBComposer/tree/master/chrome/bbcomposer/content/languages "Voir le code de ces parseurs") que j'ai créé pour convertir différents langages vers et depuis l'éditeur. Mais les différentes subtilités des expressions régulières m'ont souvent amené à coder les parseurs à la main.

Un exemple épique, le [parsing de tableaux avec la typographie Spip](https://github.com/nfroidure/BBComposer/blob/master/chrome/bbcomposer/content/languages/spip.js#L163 "Voir le code concerné"). A ma connaissance, les développeurs de Spip ont fait ça à base d'expressions régulières, mais je doute vraiment que la tâche ait été plus aisé que d'écrire le parseur from scratch. Bon, à leur avantage, ils ont pu utiliser PCRE qui est somme toute un peu plus avancé que ce qu'offre Javascript.

Ce qui m'amène au sujet de ce billet. Une des choses les plus courantes que l'on souhaite faire avec les expressions régulières, est de trouver une expression et de la remplacer par une autre. Imaginons que nous souhaitions supprimer tous les guillemets d'un snippet HTML se trouvant à l'intérieur des balises.

## Création de l'expression régulière

```js
var regExp = new RegExp('<([^>]+)"([[^>]]*)>');
var str =
  '<h2>Blahblah</h2><p style="text-align: center;"> <img alt="Blahblah" src="http://www.example.com/images/blah.jpg" /></p>';
var pattern = "<$1$2>";
str = str.replace(regExp, pattern);
console.log(str);
```

L'expression régulière `<(\[\[^>\]\]+)"(\[\[^>\]\]\*)>` cible toute sous-chaîne commençant par un `<` et se terminant par un `>` dont le contenu est composé d'une chaîne contenant tout caractère sauf `>`, suivie d'un guillemet et éventuellement d'une autre chaîne de caractère contenant tout sauf `>`.

## Pourquoi ça marche pas ?

Le problème est que ça ne fonctionne pas. Sous cette forme, le code ne remplace que la première occurrence, de plus, si une telle chaîne se trouve sur plusieurs lignes, cela ne fonctionnera pas non-plus. Naturellement, on aurait tendance à ajouter les flags m pour multiligne et g pour global qui respectivement permettent de trouver les expressions se trouvant sur plusieurs lignes et de trouver toutes les occurrences de cette dernière.

```js
var regExp = new RegExp('<([[^>]]+)"([[^>]]\*)>'**,'mg'**);
var str = '<h2>Blahblah</h2><p style="text-align: center;"> <img alt="Blahblah" src="http://www.example.com/images/blah.jpg" /></p>';
var pattern='<$1$2>';
str=str.replace(regExp,pattern);
console.log(str);
```

Oui, mais non :). la recherche globale trouve toutes les occurrences dans la chaîne d'origine. Cela signifie que si les modifications apportées à la chaîne créent de nouvelles occurrences du masque recherché, **celles-cis ne seront pas remplacées**. Le piège naïf dans lequel je suis alors tombé, fût de tester la présence du masque sur la nouvelle chaîne afin de vérifier qu'il n'y a plus d’occurrences de ce dernier.

```js
var regExp = new RegExp('<([[^>]]+)"([[^>]]\*)>'**,'mg'**);
var str = '<h2>Blahblah</h2><p style="text-align: center;"> <img alt="Blahblah" src="http://www.example.com/images/blah.jpg" /></p>';
var pattern='<$1$2>';
while(regExp.test(str))
 str=str.replace(regExp,pattern);
console.log(str);
```

Mais ça ne fonctionne pas non-plus :). En effet, contrairement à ce que l'on pourrait penser RegExp.test et String.replace n'ont pas le même comportement. Quand un masque est recherché, il complète une référence interne à la dernière occurrence trouvée, le fameux [RegExp.lastIndex](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global%5FObjects/RegExp/lastIndex "En savoir plus sur ce petit farceur"). Ainsi, quand le remplacement a été effectué, cet index est mis à jour à l'endroit du dernier remplacement, tant et si bien que la prochaine recherche (ici regExp.test(str))**commence à partir de cet index**.

Deux solutions se présente alors à nous. La première est de retirer le flag global, ce qui améliore la lisibilité du code. La seconde, celle que j'ai retenu, est de réinitialiser ce fameux lastIndex après chaque remplacement au sein de la boucle.

```js
var regExp = new RegExp('<([[^>]]+)"([[^>]]\*)>'**,'mg'**);
var str = '<h2>Blahblah</h2><p style="text-align: center;"> <img alt="Blahblah" src="http://www.example.com/images/blah.jpg" /></p>';
var pattern='<$1$2>';
while(regExp.test(str))
 {
 str=str.replace(regExp,pattern);
 regExp.lastIndex=0;
 }
console.log(str);
```

Cette solution est moins compréhensible de prime abord, mais elle à le mérite de montrer que ce fameux lastIndex existe et d'éviter que quelqu'un passe derrière et rajoute un g qu'il sera particulièrement difficile de déboguer. Elle est aussi plus performante puisque l'expression régulière n'est ré-exécutée que si, précisément, le cas de la création d'une nouvelle occurrence après remplacement se présente plutôt que pour chaque occurrence de la chaîne originale.

## Moralité

Vous pensiez que les expressions régulières étaient l'enfer des développeurs ? Vous étiez loin de la réalité, c'est pire :). J'ai perdu une journée sur ce problème, et c'est finalement un [rapport de bug](https://bugzilla.mozilla.org/show%5Fbug.cgi?id=837154 "Voir ce rapport de bug") qui m'a permis de connaître la solution ce matin au réveil (merci Sean Stangl). Mon conseil est de tout de même vous mettre aux expressions régulières car elles sont vraiment puissantes, le tout est de bien les comprendre.
