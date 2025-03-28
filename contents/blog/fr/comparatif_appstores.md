---
title: Comparatif des webapp stores
description: Une fois qu'une application web est développée, il peut être intéressant de lui donner de la visibilité. Les AppStores sont censés aider les développeurs dans cette tâche.
leafname: comparatif_appstores
link:
  label: Comparatif WebApp Stores
  title: En savoir plus sur les AppStores
date: "2012-07-27T14:28:05.000Z"
lang: fr
location: FR
keywords:
  - Application
  - Web
categories:
  - Applications Web
---

# Comparatif des webapp stores

---

⚠ Attention: Cet article est ancien et son contenu n'est plus d'actualité. Les applications web sont maintenant intégrées simplement grâce au mouvement desPWA et l'installation est directement proposée depuis ces dernières.

---

Une fois qu'une application web est développée, il peut être intéressant de lui donner de la visibilité. Les AppStores sont censés aider les développeurs dans cette tâche.

J'ai soumis le casse brique développé récemment sur le~~Chrome Web Store~~ (plus désormais) et Mozilla Market Place (n'existe plus). Les deux plateformes ont un look complètement différent, mais c'est aussi la façon de mettre en avant qui diffère. Petit résumé de mes pérégrinations.

## Chrome Web Store

J'avais déjà posté une application (extension Firefox KGen) sur le Chrome Web Store, mais cette fois il s'agissait d'une application web. Il y a deux possibilités, créer une application web hébergée ou empaquetée. La première permet de n'avoir à créer qu'un fichier manifest et à packager ce dernier tandis que la seconde nécessite des mises à jour, mais réduit le trafic sur vos serveurs.

Pour ma part, j'ai choisi une version hébergée ce qui me facilite la publication sur diverses places de marchés pour applications web (on va garder WebApp Stores :-x). La présentation est très commerciale, mais laisse peu de place aux petits acteurs.

En effet, actuellement, la seule façon de trouver mon Casse Brique sur ce site est de taper "Break It" dans la barre de recherche. Autant dire que je ne suis pas prêt d'avoir 1000 utilisateurs... J'avais constaté ce même problème pour KGen pour Chrome qui n'a jamais vraiment percé et j'avoue que cela a un peu égratigné ma motivation à continuer son développement.

## Mozilla Marketplace

Les développeurs d'extensions Firefox se sentiront à l'aise sur ce site qui n'est pas encore ouvert au public. Là où Chrome a validé mon app automatiquement sans aucune validation, la soumission sur le site de Mozilla est soumise à une revue complète. Avantage : à priori, pas d'applications borderline dans le store de Mozilla.

Autre bonne surprise, il est possible de trier les applications par date de modification ce qui fait que les petits acteurs peuvent être trouvés plus facilement que sur Chrome Web Store. Même sans être mis en avant, cela permet au moins d'obtenir une masse d'utilisateur qui permettront ou non à votre application de décoller. En effet, si votre application séduit, vous serez aussi dans le tri par popularité augmentant exponentiellement votre visibilité. C'est un gros avantage par rapport à Chrome Web Store dont le tri par "Tendance" est assez flou et peut être facilement manipulé.

En revanche, le look est moins séduisant, moins commercial oserai-je dire. Je comprends aussi mal l'intérêt de n'afficher que 20 applications de la catégorie plutôt que d'afficher la liste complète dès le départ.

Techniquement, il suffit de créer un fichier manifest à placer sur votre domaine et à remplir le formulaire de soumission. Simple, mais pas trop. J'ai dû m'y reprendre à deux fois.

Bref, vous l'aurez compris, bien que la présence d'une application web sur les deux est souhaitable, je pense que le modèle de Mozilla est meilleur pour les développeurs indépendants qui n'ont pas leurs entrées dans la Silicon Valley ;).
