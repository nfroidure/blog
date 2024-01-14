---
title: Les animations sur les sites web en 2013
description: On a d'abord connu les animations avec Flash, puis les animations sans Flash grâce aux frameworks JavaScript. Aujourd'hui, ce sont les animations CSS3 qui occupent le devant de la scène et, a priori, ça va durer.
leafname: animations_css3
link:
  label: Les animations CSS3
  title: En savoir plus sur les bonnes pratiques pour les animations CSS3
date: "2013-04-03T16:02:18.000Z"
lang: fr
location: FR
keywords:
  - CSS3
categories:
  - CSS
---

# Les animations sur les sites web en 2013

On a d'abord connu les animations avec Flash, puis les animations sans Flash grâce aux frameworks JavaScript. Aujourd'hui, ce sont les animations CSS3 qui occupent le devant de la scène et, a priori, ça va durer.

Ce billet est la filiation directe de mon article sur [les polyfills et leur utilisation](./polyfill_or_not "Lire ce billet sur les polyfills"). Dans ce dernier, j'explique pourquoi je ne suis pas passé au doctype HTML5 pour les sites web classiques comme les sites vitrines ou les sites web e-commerce. Pour résumer : parce que je n'en ai pas besoin pour faire ce type de sites. Pourquoi alourdir mes pages et impacter leurs performances pour des balises qui ne sont pas essentielles pour le business de mes clients ?

## Avec CSS pas de problème !

En revanche, si il y a bien des nouveautés que j'utilise dès leur parution, ce sont les CSS. En effet, la façon dont fonctionnent les CSS depuis leur création permet d'utiliser des fonctionnalités supplémentaires sans casser le site sur les anciens navigateurs (petit bémol pour le layout, on aimerait tous dès maintenant travailler avec le modèle de boîte flexbox :D). Aujourd'hui, j'ai envie de vous parler de mon approche des animations CSS3 par la construction d'une librairie d'affichage animé polyvalente.

## Animations CSS3 ou animations Javascript ?

Mon approche est la suivante : un affichage animé n'est utile que s'il est fluide. Or, la fluidité d'une animation est fonction de l'ordinateur utilisé :

- si l'utilisateur a navigateur moderne, l'animation sera fluide car les animations CSS3 sont performantes,
- si l'utilisateur a navigateur ancien (Internet Explorer), il aura un PC ancien. Proposer des animations JavaScript sera très certainement lent car son PC est vieux et sont navigateur peu performant (pas d’accélération matérielle, moteur JavaScript à la ramasse).

Conclusion : les animations Javascript sont une mauvaise chose puisqu'en l'état actuel des choses, elle ne font que dégrader l'expérience des utilisateurs :

- ceux de navigateurs modernes car elles sous-performent les animations CSS3,
- ceux des anciens navigateurs car elles ne sont pas adaptées à ses conditions de navigation.

## Implémentation de notre affichage polyvalent

L'idée est de pouvoir faire aussi bien un carousel, qu'un système d'onglet, qu'une pagination simple ou un simple affichage tournant. Il y a beaucoup de similarités entre ces quatre types d'affichage que nous allons factoriser. Par la suite, je parlerai de carousel pour simplifier.

### Le choix des armes

Nous sommes partis pour créer un carousel avec les animations CSS3\. De quoi avons nous besoin ?

- d'un peu d'HTML : nous avons besoin de définir un certain markup que nous allons utiliser pour délimiter notre carousel,
- d'un peu de Javascript : nous ne pouvons pas encore faire de carousel vraiment propre et accessible avec CSS uniquement, il va nous falloir un peu de JavaScript.
- de CSS3 pour faire nos animations.

### Balisage HTML

Notre carousel sera composé de :

- pages composant le contenu du carousel
- boutons suivant et précédent
- boutons vers chaque partie du carousel

Comme dit précédemment, ce balisage ressemble fortement au balisage :

- d'un système d'onglet comme on en voit beaucoup sur les fiches de produits e-commerce, il nous suffit de retirer les boutons suivant et précédent,
- d'une galerie d'image avec les boutons suivants et précédent (le menu pouvant être des miniatures ou simplement supprimé),
- d'un simple affichage tournant (une liste de photos apparaissant à intervalle régulier).

Si je résume, seules les pages de contenu de notre carousel seront vraiment nécessaires, le reste des balises dépendra de l'utilisation que nous ferons de notre carousel devenu une sorte de couteau suisse de l'affichage web. Voici le HTML que je vous propose :

```html
<div class="carbox">
  <ul class="carnav">
    <li><a href="#paneln" title="Voir le panel précédent">Précédent</a></li>
    <li class="selected">
      <a href="#panel1" title="Voir le panel 1">Panel 1</a>
    </li>
    <li><a href="#panel1" title="Voir le panel 2">Panel 2</a></li>
    <li><a href="#paneln" title="Voir le panel n">Panel n</a></li>
    <li><a href="#panel2" title="Voir le panel suivant">Suivant</a></li>
  </ul>
  <div class="carpanel selected" id="carpanel1">Panel 1</div>
  <div class="carpanel" id="carpanel1">Panel 2</div>
  <div class="carpanel" id="carpaneln">Panel n</div>
</div>
```

Vous remarquez que le balisage est basé sur les classes. J'ai souhaité avoir un modèle le plus souple possible de manière à pouvoir simplement mettre des classes sur du contenu existant. Vous avez peut-être aussi remarqué que les boutons suivant et précédent son dans la même liste que les boutons correspondant à chaque item. Ils pourront en réalité être indifféremment regroupés ou séparés, mais pour ce billet, j'ai simplifié. Le carousel est initialisé à un état initial donné.

### Code JavaScript

Venons-en au JavaScript. Si je fais la liste de ce dont nous avons besoin :

- ajouter des évènements sur les liens pour afficher les panels sélectionnés.
- manipuler le DOM (insérer des éléments, ajouter des classes).
- changer l'affichage automatiquement au delà d'un certain délai.

Les seuls problèmes de compatibilité que je vois (même pour IE6 et 7) sont : l'ajout d'évènements (IE<8 utilise attachEvent) et un petit getElementsByClassName. Autant dire que ça ne sert pas à grand chose de s’embarrasser de ko de librairies superflues. Je vais donc m'orienter vers MooTools qui propose de [télécharger uniquement ce dont on a besoin](https://mootools.net/core "Télécharger ce qu'il vous faut"). J'ai donc fait mes emplettes en sélectionnant DomReady (avec toutes ses dépendances, notamment les events et les sélecteurs) et les classes (j'aime bien le confort qu'elles apportent par rapport à l'héritage et notre code sera donc extensible plus facilement).

Il y a quelques petites choses vraiment importantes quand on implémente un carousel :

- il faut arrêter le carousel quand la souris est au dessus de lui : pour cela nous avons créé des fonctions resumer/pause qui permettrons d'obtenir ce comportement. MooTools propose des évènements personnalisés appelés mouseenter et `mouseleave` qui permettent d'[obtenir exactement ce comportement](https://github.com/nfroidure/KissIsKool/blob/master/webdisplay.js#L21 "Voir le code concerné").
- il faut arrêter le carousel aussi quand un des éléments de ce dernier obtient le focus, pour ce faire, nous devons ajouter un écouteur d'évènement en prenant bien garde de [mettre true pour le troisième argument](https://github.com/nfroidure/KissIsKool/blob/master/webdisplay.js#L23 "Voir la ligne concernée") (mode capture) qui permet de capturer l'évènement pour les nœuds enfants.
- il faut prendre en compte les hashs de manière à ce que si une personne visitant le site décide de transmettre le lien à une autre personnes, celle-ci puisse se retrouver sur le même contenu que lui.

Le script que je propose gère tous ces aspects plus un directement lié aux animations. En effet, nous allons avoir besoin de savoir quel est l'onglet sélectionné grâce à une classe selected, mais aussi, celui qui vient juste d'être déselectionné, grâce à une classe unselected. Ainsi, nous pourrons animer respectivement l'apparition et la disparition de ces deux éléments.

### Animations CSS3

Nous voilà maintenant sur le terrain des animations. J'ai fait [une page d'exemple](http://htmlpreview.github.io/?https://github.com/nfroidure/KissIsKool/blob/master/webdisplay.html "Voir la page d'exemple") pour vous montrer quelques possibilités d'animation. La principale difficulté est que l'on a deux contenus qui cohabitent dans la même zone : l'onglet sélectionné et celui qui vient de disparaître. Il faut donc les superposer pour que le visiteur puisse voir au même endroit la disparition et l'apparition.

J'ai choisi pour cela de jouer avec position:absolute; et les z-index. De cette manière, j'ai pu créer des animations de plusieurs genre sans problème. La contrainte est que la hauteur et la largeur doivent être fixes. Comme ce sont des exemples, je n'en ai pas fait cas, mais une solution semble plus appropriée avec l'inconvénient d'alourdir le balisage : inclure les onglets dans un wrapper en position relative de hauteur égale à 0 et avec l'overflow visible. Comme les éléments en position relative gardent la largeur de leur parent, on pourra ainsi créer un carousel à taille variable. Pour que le parent prenne tout de même la hauteur de ses enfants, une solution est de ne pas mettre de hauteur égale à 0 uniquement pour l'onglet actuellement sélectionné.

## Conclusion

A mon sens, l'ère du Javascript d'animation est bel et bien révolue, du moins, pour des éléments HTML sur des sites vitrine, d'information ou e-commerce. CSS3 nous offre une alternative bien plus efficace. Je vais donc petit à petit convertir mes scripts MooTools pour ne plus manipuler que des classes et en finir avec les classes de type Fx qui pour moi devraient même être retirées de MooTools Core.

Ces derniers seront ajoutés au fur et à mesure sur le [dépôt créé pour l'occasion](https://github.com/nfroidure/KissIsKool "Voir le dépôt sur GitHub") et appelé KissIsKool. Vos commentaires et pull request sont les bienvenus.
