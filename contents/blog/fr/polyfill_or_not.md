---
title: Faut-il utiliser les polyfills ?
description: Tout à chacun est tenté d'utiliser HTML5 pour créer des applications sympa expérimentant le champs des possibles. Malheureusement, HTML5 n'est pas supporté par tous les navigateurs. C'est alors que se pose la question des polyfills.
leafname: polyfill_or_not
link:
  label: Polyfills HTML5
  title: En savoir plus sur l'intérêt des polyfills
date: "2012-10-21T07:23:29.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - HTML5
  - Polyfills
categories:
  - JavaScript
---

# Faut-il utiliser les polyfills ?

---

⚠ Bien-sûr aujourd'hui, la question ne se pose plus et la réponse est non.

---

Tout à chacun est tenté d'utiliser HTML5 pour créer des applications sympa expérimentant le champs des possibles. Malheureusement, HTML5 n'est pas supporté par tous les navigateurs. C'est alors que se pose la question des polyfills.

Ce billet est basé sur une réflexion de fond qui a été réactivée hier à ParisWeb lors de l'atelier de Corinne Schillinger et Jérémie Patonnier intitulé [HTML5 / CSS3 et l'effet "Waouh !" : les dessous de la magie](http://www.paris-web.fr/2012/ateliers/html5css3-et-leffet-waouh-les-dessous-de-la-magie.php "Voir la fiche de l'atelier"). Commençons par présenter les polyfills.

## Polyfills : HTML5 where you want

L'idée qui se cache derrière les polyfills est de combler un manque dans un navigateur : un élément (`audio`, `video`), une API (`websockets`) ou encore, des fonctionnalitésCSS3. Techniquement, cela passe par l'insertion d'un script Javascript qui se charge de détecter la ou les fonctionnalités manquantes. [Un bon site](http://html5please.com/ "Visiter HTML5Please.com") donné par les intervenants lors de l'atelier permet de savoir ce qui peut être utilisé et où.

Ainsi grâce aux polyfills, en théorie, l'expérienceHTML5 peut être délivrée à tous les utilisateurs Internet Explorer 7 et 8 compris. Mais vous vous en doutez, tout n'est pas si rose.

## Dans polyfill, il y a fill

C'est le principal reproche que je fais aux polyfills. En effet, ce sont des fichiers javascript et leur multiplication peut-être extrêmement couteuse en terme de bande passante, mais également en terme de temps d'exécution. Or, la multiplication de ces derniers est en totale contradiction avec les principaux concepts de performance web. D'autant plus que la plupart des polyfills ont des dépendances avec des frameworks Javascript qui eux-mêmes représentent un coût important.

Le type de matériel utilisé par les utilisateurs d'IE7 (PC vieillissant) et la mauvaise qualité du moteur Javascript font que ces derniers ont une expérience peut-être identique visuellement, mais fortement dégradée et ralentie. Le résultat est qu'on se retrouve avec une expérience utilisateur complètement bancale et les utilisateurs d'IE7 qu'on souhaite récupérer bouderont purement et simplement l'application sans savoir que c'est à cause de leur navigateur que l'application est trop lente.

Bref, les polyfills peuvent nuire à leur propres objectifs surtout lorsqu'on les multiplie.

## Que faire ?

### Pour les applications web

Je fais parti de ceux qui pensent qu'utiliser les polyfills pour la création d'applications web est un non-sens. En effet, on récupère plus de la moitié des utilisateurs potentiels sur desktop et la majorité des utilisateurs sur mobile sans les utiliser. De plus, c'est dans le cadre d'une application web que les polyfills se multiplient car ces dernières utilisent souvent de nombreuses fonctionnalités différentes.

Je crée des applications web pour des entreprises et dire que HTML5 sur IE7 n'est pas vraiment HTML5 est parfaitement compris surtout lorsqu'on expose les faits. Attendre 5 minutes qu'une application se charge, quand 100 employés l'utilisent 5 fois par jour, c'est 100 x 5 / 60= 8 heures par jour d'attente soit, en fonction du type d'utilisateur, un SMIC ou plus (voire bien plus pour des cadres sup) jeté par les fenêtres par jour. Dans quelle boîte on paie une personne pour attendre ?

A cela on ajoute le coût d'une adaptation à IE7, variable mais non négligeable, on se retrouve au final avec deux choix : télécharger un nouveau navigateur gratuitement ou alors garder un navigateur qui va induire des coûts insoupçonnablement élevés.

### Pour les sites web

Clairement, je fais des sites web en XHTML 1.1 Strict. Je n'ai pas cédé aux appels du pied d'HTML5 pour une raison simple : aujourd'hui, dans le cadre d'un site vitrine ou e-commerce classique, HTML5 (au sens balises et API) ne m'apporterai pas grand chose de plus. Si je décidai d'utiliser les balises sémantiques, ce serait une catastrophe pour les utilisateurs d'IE7 à moins d'utiliser des polyfills qui dégraderaient les performances et donc l'efficacité de mes sites.

Ce n'est pas le cas de CSS3 qui peut arrondir les angles (au sens propre comme au sens figuré ;-D ), mais la dégradation gracieuse est mon amie. Si les utilisateurs d'IE7 n'ont pas de coins arrondis, d'ombres ou d'animations, ce n'est pas un drame.

D'ailleurs je fais parti de ceux qui pensent que les animations, c'est en CSS3 ou rien. En effet, les animations JQuery ou Mootools sur IE7, c'est juste inefficace. Cela entrave l'accès à l'information, les animations sont généralement saccadées, bref, ne vous prenez pas la tête à vouloir faire sur un vieux navigateur tournant sur un vieux PC ce que vous faîtes bien sur un navigateur moderne tournant sur un PC moderne.

Faire cela reviendrait à installer Window 7 sur un Pentium des années 90\. D'ailleurs, je voudrais tordre le coup à l'idée reçue que la seule façon de tester sur IE7 est de le faire dans uneVM : faux ! Et c'est peut-être de là que viens le problème.

Une VM sans programmes pourris installés (anti-virus, malwares), sans programme en cours d’exécution (client mail, office, etc) et tournant sur une bête de compétition avec processeur multi-cœurs et disque SSD n'est pas représentatif. La seule bonne façon de tester sur IE7, c'est de tester sur une machine qui correspond à l'époque où les utilisateurs avaient IE7 quand ils achetaient leur ordinateur et une machine qui est vraiment utilisée par des vrais gens. C'est bien-sûr pas souvent possible facilement, mais il faut bien en avoir conscience.

Bref, je pense que les polyfills peuvent et doivent être utilisés dans certains cas particuliers, mais ils ne sont pas la solution miracle, loin de là et il faut faire preuve de discernement dans leur utilisation.
