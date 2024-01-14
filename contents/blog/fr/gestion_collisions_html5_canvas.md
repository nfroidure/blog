---
title: Gestion des collisions 2D dans un jeu HTML5 / Javascript
description: L'expérience du développement de Tank Arena m'amène à faire un petit point sur la gestion des collisions dans un jeu 2D écrit avec Javascript/HTML5.
leafname: gestion_collisions_html5_canvas
link:
  label: Collisions 2D
  title: En savoir plus sur la gestion des collisions dans un jeu HTML5
date: "2012-09-23T10:29:46.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - Jeux
  - HTML5
categories:
  - Jeux HTML5
---

# Gestion des collisions 2D dans un jeu HTML5 / Javascript

---

⚠ Attention: Cet article est ancien et son contenu n'est plus d'actualité. Une approche orientée aspect serait préférée à une approche objet de nos jours. Ce travail m'a permis d'affiner mes compétences mais il ne peut servir de base pour implémenter un jeu, autant repartir de zéro.

---

L'expérience du développement de Tank Arena m'amène à faire un petit point sur la gestion des collisions dans un jeu 2D écrit avec Javascript/HTML5.

Ce n'est pas un sujet trivial et les choix sont très larges. En effet, on peut s'appuyer sur un moteur physique 2D existant, plus complet mais plus lourd, ou gérer uniquement les collisions dont on a besoin. Pour ma part, j'ai décidé de m'appuyer sur les nombreuses ressources existantes écrites en C pour implémenter ma propre gestion des collisions adaptée aux jeux HTML5 et dans le cas présent au jeu Tank Arena que je développe durant mon temps libre et dont [je vous ai déjà parlé](./tank_arena_html5 "Voir l'article de présentation de Web Tank Arena").

## Diagramme des classes UML

[ ![Diagramme des classes UML](/public/illustrations/classesdiagram-breakit2.png) ](https://raw.githubusercontent.com/nfroidure/TankArena/master/uml/ClassesDiagram.png "Zoomer le diagramme")

Tous les fichiers Javascript implémentant ce modèle se trouvent sur le [dépôt GitHub de Tank Arena](https://github.com/nfroidure/TankArena "Voir le code de Tank Arena") sous licence GNU/GPL donc n'hésitez pas à ajouter votre touche et à me proposer des commits ! J'ai mis la [première version](http://tank.elitwork.com "Voir la première version") en ligne pour éclairer la suite de cette article.

## Des sprites sur une carte

Comme vous pouvez le voir, l'idée est d'avoir un plan (classe `Map`) dans lequel se trouvent des sprites (classe `Sprite`). La classe `Sprite` sert de base à tous les types d'objets évoluant sur la carte du jeu. La classe `Movable` la surcharge pour ajouter les propriétés d'un objet se mouvant sur la carte et la classe `Controlable` indique des objets qui peuvent être contrôlés par un humain ou par l'ordinateur.

Par exemple, les bâtiments (classe `Building`), sont fixes et sont donc directement dérivés de la classe `Sprite`. Au contraire, les tirs (classe `Shot`) héritent de la classe `Movable` et les tanks de la classe `Controlable`. Pour ajouter de nouveaux types d'objet, il suffit d'étendre une de ces trois classes abstraites et de surcharger les méthodes dont on veut corriger le comportement.

Enfin, la carte étant à plusieurs niveaux (avion, hélicoptère), chaque sprite à une propriété `z` indiquant à quel niveau ce dernier se trouve.

## Des sprites composés de formes géométriques

Afin de pouvoir calculer les collisions entre chaque objet de la carte chaque sprite peut être composé de formes indiquant ses parties solides (`Shapes`). Pour l'instant, je n'ai implémenté que les formes de type cercle, rectangle (non orientable) et point. Cela est suffisant pour obtenir un résultat satisfaisant. J'aurai cependant pu également implémenter un rectangle orientable, et une droite, mais je les ai substitué respectivement par un cercle et par un rectangle d'un pixel de largeur.

L'avantage de pouvoir associer plusieurs formes positionnables à un même sprite est qu'il est possible de composer des formes plus complexes afin d'obtenir des collisions plus fidèles à la réalité.

## Dessinons et animons nos sprites sur la carte

Chaque sprite possède une méthode `draw` permettant de dessiner ce dernier à la position à laquelle il se trouve sur l'élément `<canvas>` correspondant à sa position `z`. De même, les sprites qui peuvent bouger possèdent une méthode `move` qui leur permet de se déplacer en fonction de leur vitesse, leur accélération etc... La boucle principale de jeu appelle successivement les méthodes `move` et `draw` de chaque objet de la scène et c'est ainsi que les sprites commencent à s'animer.

## Calcul des collisions

Nous y sommes, c'est le moment de calculer les collisions de chaque objet avec ceux qui l'entourent. Le principe du calcul des collisions est simple : il s'agit d'enregistrer la position actuelle du sprite, de la faire bouger avec la fonction `move`, puis de calculer si ce dernier entre en collision ou non dans la nouvelle position calculée. Si non, on finalise le mouvement par le dessin du sprite, si oui, on replace l'objet entré en collision dans sa position antérieure avant de le redessiner.

C'est grâce à la méthode `hits` de la classe `Sprite` que nous y parvenons. Cette dernière récupère les sprites proches de notre sprite (grâce à un tableau mis à jour à chaque cycle du jeu avec la méthode `declarePositions`), et confronte chaque forme dont ils sont composés pour déduire s'il y a bien collision ou non.

Dans notre implémentation, lorsque le tank entre en collision, on simule le recul de ce dernier en changeant sa direction et son accélération. Lorsqu'un tir atteint une cible, on inflige des dégâts à cette dernière en appelant la méthode `damage`. Tous ces comportements sont implémentés en surchargeant la méthode de calcul des collisions.

Vous pouvez voir tous les détails du calcul des collisions entre chaque forme dans la classe `Shape` et ses sous-classes qui déterminent quels types de formes sont comparées et déduisent ainsi quelle fonction utiliser pour calculer leur collision.

Le calcul des collisions est largement inspiré de ces deux tutoriels : Théorie des collisions (il a disparu avec le Site du Zéro) et [Conception d'un moteur physique](http://gregorycorgie.developpez.com/tutoriels/physic/ "Voir ce tutoriel").

## Conclusion

La gestion des collisions en Javascript est assez rapide, j'ai essayé cet ébauche de Tank Arena sur mobile et franchement, je ne constate pas de ralentissements. La prochaine étape sera certainement d'isoler le moteur physique du moteur de rendu graphique afin que l'on puisse calculer les mouvements physiques sur un serveur NodeJS et ainsi permettre un mode multijoueur qui sera bien plus fun que le mode contre l'ordinateur qui est un peu simple à mon goût.

Sinon, pour parler du projet Tank Arena en général, il me reste à trouver le meilleur moyen de tester la réussite d'une mission et à trouver un format le plus léger possible pour la création de cartes. J'ai créé un éditeur de sprites, il me reste à créer un éditeur pour associer les formes à ces derniers puis un outil pour "compiler" les cartes.

Bref, de quoi s'amuser un peu en attendant le prochain article !
