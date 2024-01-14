---
title: Amélioration d'un casse brique
description: J'ai cliqué via Twitter sur un lien vers un casse brique en développement. Il avait des problèmes de performance étonnants. J'y ai mis mon grain de sel.
leafname: ameliration_casse_brique
link:
  label: Amélioration d'un casse brique
  title: En savoir plus sur ces modifications.
date: "2012-05-08T18:09:31.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - HTML5
  - Jeux
categories:
  - Jeux HTML5
---

# Amélioration d'un casse-brique

---

⚠ Attention : Cet article est ancien et ne correspond pas à l'état de l'art de la création d'un casse brique pour le navigateur.

---

J'ai cliqué via Twitter sur un lien vers un casse-brique en développement. Il avait des problèmes de performance étonnants. J'y ai mis mon grain de sel.

Un [casse-brique en création](https://github.com/jonathankowalski/CasseBriques "Voir le dépôt") a donné du fil à retordre à mon CPU. Cela était assez étrange car pour l'instant, il n'y avait que la barre et une balle qui se baladait. Rien ne justifiant ce problème de perf.

![Casse brique](/public/illustrations/breakit.png)

Après un petit coup d'œil sur la source, je me suis rendu compte qu'il y avait plusieurs problèmes de conception. Le premier était évident. À chaque boucle de jeu, le canvas était entièrement redessiné ce qui provoquait un écriture régulière de nombreux pixels blancs.

Pour pallier ce problème, j'ai renforcé le modèle objet du petit jeu en déléguant à chaque objet la responsabilité d'effacer sa précédente impression avant de s'imprimer de nouveau.

Pour la gestion de la barre, le précédent programme écoutait l'évènement `onmousemove`, mettait à jour les coordonnées et la barre s'affichait perpétuellement dans la boucle principale du jeu. J'ai connecté directement le gestionnaire d'évènement à la méthode d'impression de la barre permettant un affichage uniquement en cas de changement de coordonnées.

Le jeu est maintenant très fluide et j'espère que son créateur sera content de mes petites modifications. C'est la magie de GitHub, on peut participer à des projets de manière épisodique et faire avancer le schmilbick ! Cela m'a pris une heure ou deux et j'imagine que ça peut relancer le projet de ce développeur. J'ai bien sûr fait un [pull request](https://github.com/jonathankowalski/CasseBriques/pull/1 "Voir le pull request").

J'ai aussi rendu le jeu flexible, il suffit d'instancier un object Game en passant un élément HTML à son constructeur pour que le jeu s'affiche dedans et s'adapte à la taille que cet élément permet d'exploiter.

Il reste à créer une méthode de génération de briques s'adaptant à la taille et à gérer les collisions pour avoir un jeu jouable (j'ai aussi implémenté le rebond sur la barre). Je n'en ai pas le temps maintenant, mais pourquoi pas plus tard. À moins que vous ne le fassiez avant moi !

**Information :** Finalement, j'ai directement créé un [tutoriel complet pour la création d'un casse-brique](./html5_casse_brique "Voir le tutoriel").
