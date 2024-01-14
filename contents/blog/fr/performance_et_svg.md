---
title: Performance des sites web avec SVG
description: SVG est de plus en plus supporté par les navigateurs. Cela peut nous amener à reconsidérer nos choix en ce qui concerne la performance du front-end. Petit tour d'horizon des plus de ce format.
leafname: performance_et_svg
link:
  label: Performance et SVG
  title: En savoir plus sur les avantages de SVG pour la performance
date: "2013-01-13T21:09:05.000Z"
lang: fr
location: FR
keywords:
  - SVG
  - Performances
categories:
  - SVG
---

# Performance des sites web avec SVG

SVG est de plus en plus supporté par les navigateurs. Cela peut nous amener à reconsidérer nos choix en ce qui concerne la performance du front-end. Petit tour d'horizon des plus de ce format.

J'utilise SVG depuis assez longtemps grâce à l'[éditeur libre Inkscape](https://inkscape.org "Télécharger Inkscape"). Ce dernier me permet de créer de petites icônes, les logos de mes projets et le design de mes sites web persos (comme ce blog). Je suis l'adoption de SVG par les navigateurs de loin grâce à un petit test simple, je fais un glisser-déposer de mes designs SVG dans le navigateur et je regarde si c'est tout cassé ou pas.

Force est de constater que ça ne l'est plus et que SVG devient de plus en plus crédible pour la création d'illustrations pour les sites web. Voici quelques retours d'expérience et quelques trucs pour exploiter SVG à fond.

## SVG : Qu'est-ce que c'est ?

SVG, Scalable Vector Graphics est un format de dessin vectoriel. Tout est dans le mot vectoriel. En définissant les images par leurs formes plutôt que par une succession de pixels, SVG permet de rendre une image adaptable à toutes les définitions. En effet, là où une image JPG ou PNG n'est adaptée qu'à une seule taille d'affichage, une image SVG peut être redimensionnée sans perte de qualité.

C'est pour cette raison que j'utilise ce format depuis longtemps, il permet de créer des images qui puissent être réutilisées dans d'autres contextes, tailles ou formats. Par exemple, pour la création de maquettes de sites responsive, c'est une très bonne option.

## SVG améliore la qualité des sites

Un des premiers arguments en faveur de SVG est qu'il permet d'améliorer significativement la qualité des illustrations. On parle beaucoup des écrans Rétina, l'avantage de SVG est qu'il n'est pas nécessaire d'agir pour exploiter au maximum ces derniers.

De plus, la propriété vectorielle de SVG fait que les nouvelles possibilités de CSS3 peuvent être exploitées au maximum. Un exemple simple, la propriété [background-size](https://developer.mozilla.org/fr/docs/CSS/background-size "En savoir plus sur cette propriété"). Celle-ci permet de spécifier la taille du fond. Permettant de redimensionner l'image de fond selon vos souhaits. Et qui dit redimensionnement, dit SVG !

En particulier pour la valeur cover de cette propriété qui permet de d'adapter la taille du fond à la taille de l'élément. Par exemple, dans le cas de mon dernier petit jeu, [Sumuraÿ](http://sumuray.insertafter.com/ "Visiter le site de Sumuraÿ"), j'ai utilisé cette propriété pour avoir un fond qui soit complètement recouvert par cette [petite image SVG](http://sumuray.insertafter.com/www/images/samurai.svg "Voir l'image en question"). Si j'avais utilisé un image JPEG à la place, cette dernière aurait dû être suffisamment grande pour pouvoir couvrir le fond de la page sans que l'on puisse percevoir les pixels de cette dernière. De plus, utiliser le format PNG aurait été trop lourd, l'usage de JPG, format destructif se serait imposé. Cette image SVG au format JPEG a un poids de 160.3ko. Au format SVG, cette dernière ne fait que 45.9ko.

## Et les sprites ?

A terme il semble qu'il sera possible de créer des feuilles de sprite en SVG grâce à un hash déterminant une vue sur le SVG. Par exemple, avec l'[image précédente](http://sumuray.insertafter.com/images/samurai.svg#svgView%28viewBox%28600,800,200,250%29%29 "Voir un vue de l'image"). Bon, pour être tout à fait honnête, à l'heure actuelle le support de cette astuce est un peu bancal et j'ai renoncé à le faire avec Sumuraÿ, mais cela promet. N'hésitez pas à laisser un commentaire si vous avez mis cette astuce en oeuvre avec succès.

[@\_kud](https://twitter.com/%5Fkud "Voir son profil Twitter") me souffle sur Twitter que les sprites SVG via les polices perso, c'est bien aussi (même si c'est pas encore top sur certains navigateurs).

## A savoir

A première vue, la performance n'était pas au rendez-vous. Mon fichier `sumuray.svg` faisait 1.7Mo ! En effet, j'avais dupliqué les feuilles et les arbres avec `Ctrl + D` plutôt que d'utiliser la fonction de clonage (qui n'est pas mise en avant dans le menu contextuel d'Inkscape) `Alt + D`, qui elle permet de faire une nouvelle référence à un groupe d'objet.

Un détail qui change tout pour une image qui réutilise plusieurs fois la même forme dans des orientations ou dimensions différentes. D'après mes comparatifs, il semble que le clonage n'apporte pas de gain dans l'affichage des SVG, mais cela pourrait être le cas par la suite.

## SVG est du texte

Un autre avantage de SVG est que c'est du texte et qu'il est donc possible d'utiliser gzip pour compresser les ressources avant de les envoyer aux clients ce qui peut représenter un gain significatif de performances.

## SVG est rendu à la volée

Petit édition du lendemain pour mentionner un oubli. Les images SVG ont la même nature que le HTML et comme ce dernier, les images SVG sont rendues par le navigateur parallèlement à leur téléchargement. Cela signifie qu'une image de grande taille peut se dessiner progressivement et commencer à être consultée avant la fin de son chargement.

Cela peut-être très utile pour les comics SVG par exemple, on peut commencer à lire une planche avant son chargement complet. Il suffit juste de s'assurer que la source XML contient bien les vignettes de la planche dans leur ordre naturel.

## Can I use SVG ?

La question fatidique est : [puis-je utiliser SVG ?](http://caniuse.com/svg "Voir les navigateurs qui supportent SVG") Seul, non. En effet, IE 7 et 8 ne le supportent pas. Pour Sumuraÿ, je n'ai pas cherché la compatibilité IE 7, 8 et 9\. Mais dans la vraie vie, pour des sites web, c'est rarement possible. En revanche, rien ne vous interdit de balancer du SVG pour les navigateurs qui le supportent et d'utiliser des JPG/PNG pour les vieux navigateurs.

De toute façon, utiliser SVG pour créer vos images est une bonne pratique. C'est un format libre qui sera sûrement de plus en plus populaire et utilisable tel quel sur les sites web. Pourquoi s'en priver ?

Si vous êtes intéressé par le format SVG, je vous propose d'aller faire un petit tour sur le [blog de Jéremie Patonnier](http://jeremie.patonnier.net/tag/SVG "Voir ses articles à propos de SVG sur son blog") qui est l'une des personnes les plus calées sur le domaine en France.
