---
title: "Jeux HTML5 : Développement d'un casse brique"
description: Créer un jeu en HTML5 est simple. Cependant, il faut respecter quelques bonnes pratiques pour éviter que cela tourne au cauchemar.
leafname: html5_casse_brique
link:
  label: Casse brique HTML5
  title: Voir comment créer un casse brique HTML5
date: "2012-05-11T08:51:19.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - HTML5
  - Jeux
categories:
  - Jeux HTML5
---

# Jeux HTML5 : Développement d'un casse brique

---

⚠ Attention: Cet article est ancien et ne correspond pas à l'état de l'art de la création de casse briques pour le navigateur.

---

Créer un jeu en HTML5 est simple. Cependant, il faut respecter quelques bonnes pratiques pour éviter que cela tourne au cauchemar.

Suite à mon précédent article sur l'amélioration d'un casse brique, j'ai discuté avec Jonathan Kowalski, l'auteur initial des prémices du jeu. Il a très gentiment accepté de passer le jeu sous Licence GNU/GPL de façon à ce que chacun puisse le modifier à sa guise. De cette façon, le jeu que vous allez créer ici sera utilisable comme point de départ d'un véritable jeu avec différents niveaux ou un look à votre guise.

## Diagramme des classes

![Diagramme de classes du Casse Brique](/public/illustrations/classesdiagram-breakit.png)

Notre application sera composée de 4 objets :

- l'objet `Game` qui se chargera de gérer la boucle de jeu, la création du canvas et la génération des murs à détruire,
- l'objet `Ball` qui se chargera de gérer la position de la balle, son dessin sur le Canvas, son rebondissement et son interaction avec les autres éléments du jeu,
- l'objet `Bar` qui permettra le dessin de la barre sur le canvas, la gestion de ses déplacement et la collision avec la balle,
- l'objet `Brick` qui se chargera du dessin des briques et de la collision avec la balle.

Enfin, il y a un dépôt existant, mais je vais le réinitialiser et tout reprendre étape par étape afin que vous puissiez suivre ce tutoriel en suivant les modifications faîtes grâce à Git. Pour obtenir le dépôt tel qu'il est au début du tuto :

```sh
nfroidure:~/ mkdir CasseBrique && cd CasseBrique
nfroidure:~/ git clone git@github.com:nfroidure/CasseBriques.git .
nfroidure:~/ git checkout [84162a4c2fa6ece151e80031c1e76af25e508835](https://github.com/nfroidure/CasseBriques/commit/84162a4c2fa6ece151e80031c1e76af25e508835 "Voir le diff de ce commit")
```

A noter aussi, le casse brique était initialement développé avec l'aide de JQuery, je vais plutôt utiliser Mootools qui est plus adapté à la POO et que je maitrise mieux. De plus, je souhaite intégrer ce petit jeu dans une de mes applications comme "goodies" pour un de mes clients.

Voilà, vous êtes prêt. Je vais détailler la programmation de chaque ligne de code, mais avant de commencer, petit retour sur `canvas``, l’élément qui permet le dessin de formes et autres graphismes.

## Canvas : L'élément central

Créer un jeu vidéo en HTML5 commence souvent par la création d'un élément Canvas. En effet, cet élément permet d'afficher des graphismes grâce à l'utilisation de fonctions de l'API Javascript qui lui sont associées. Les fonctions diffèrent en fonction du contexte, puisque notre casse brique est en 2D, ce sera donc le paradigme de la 2D que nous utiliserons. Vous trouverez un tutorial complet sur le [fonctionnement de Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas%5FAPI/Tutorial "Lire la suite") sur le Mozilla Developer Network. Il est très important de comprendre le fonctionnement de Canvas pour bien comprendre ce tutoriel.

## L'objet Game : Création

Le premier objet qu'il faut créer est l'objet Game, c'est lui qui sera instancié pour commencer une partie de casse brique. Afin de rendre le jeu le plus souple possible, nous allons nous imposer une contrainte : il doit être possible de créer un jeu casse brique en fournissant uniquement à Game l'élément HTML chargé de recueillir le jeu. D'ailleurs, nous allons nous arranger pour que dans l'absolu, il soit possible de créer plusieurs instances du casse brique dans la même page web.

De cette contrainte, on peut tout de suite déduire quel sera le constructeur de l'objet Game :

```sh
nfroidure:~/ git checkout [07e4ed976eba295c8bd0e6d9032c1ca6474717c6](https://github.com/nfroidure/CasseBriques/commit/07e4ed976eba295c8bd0e6d9032c1ca6474717c6 "Voir le diff de ce commit")
```

Dans le fichier `index.html`, ajoutons un code de détection des éléments ayant la classe `CasseBrique` et passons le premier trouvé à un object Game nouvellement créé :

```sh
nfroidure:~/ git checkout [fbd961660abf136103d84a93aacbeb4d7d734795](https://github.com/nfroidure/CasseBriques/commit/fbd961660abf136103d84a93aacbeb4d7d734795 "Voir le diff de ce commit")
```

[La détection se fait bien](http://htmlpreview.github.io/?https://github.com/nfroidure/CasseBriques/07e4ed976eba295c8bd0e6d9032c1ca6474717c6/index.html "Voir le résultat du commit"), nous allons pouvoir créer un élément `canvas` et l'insérer dans l'élément détecté. Pour ce faire, on récupère la taille de l'élément reçu et on l'assigne au canvas. Ensuite, on détecte si l'API de Canvas est bien présente et on ajoute l'élément, sinon, on affiche un message d'erreur.

```sh
nfroidure:~/ git checkout [fbd961660abf136103d84a93aacbeb4d7d734795b](https://github.com/nfroidure/CasseBriques/commit/fbd961660abf136103d84a93aacbeb4d7d734795 "Voir le diff de ce commit")
```

On a donc maintenant un canvas en état de marche. Vous remarquerez la présence d'une propriété nommée `aspectRatio`. Cette dernière va nous servir pour déterminer la taille des différents objets du Canvas pour qu'elle soit adaptée à la place disponible dans l'élément transmis.

## Création de la barre et de la balle

Commençons par dessiner la balle et la barre. Pour chacun d'eux, nous allons créer une classe avec comme propriétés la position et les dimensions de l'objet et deux méthodes, une pour dessiner l'objet à sa position actuelle (`draw`), une autre pour l'effacer (`clear`). Nous allons passer à chaque objet du canvas une référence à l'objet game afin que ces objets puissent s'y référer.

Pour la barre, nous souhaitons dessiner un rectangle. Heureusement, l'élément Canvas dispose de la fonction `fillRect`. Au début du jeu, nous positionnerons la barre au centre.

```sh
nfroidure:~/ git checkout [dbea5701e152b7ac36cae867735568d5ae0c6261](https://github.com/nfroidure/CasseBriques/commit/dbea5701e152b7ac36cae867735568d5ae0c6261 "Voir le diff de ce commit")
```

En ce qui concerne la balle, la classe est similaire à ceci près que nous n'avons pas une largeur et une longueur, mais un rayon. La fonction de dessin est également différente puisqu'ici nous utilisons les fonctions de dessin pour obtenir un cercle. La fonction de positionnement est également différente puisque la position de la balle est relative à celle de la barre.

```sh
nfroidure:~/ git checkout [8ffcdb2815fc23fcc0fdfcb98a1a589be02af8bf](https://github.com/nfroidure/CasseBriques/commit/8ffcdb2815fc23fcc0fdfcb98a1a589be02af8bf "Voir le diff de ce commit")
```

## Déplacement de la balle et création de la boucle de jeu

Nous avons déjà [deux éléments affichés](http://htmlpreview.github.io/?https://github.com/CasseBriques/8ffcdb2815fc23fcc0fdfcb98a1a589be02af8bf/index.html "Voir le résultats des commits précédents"), maintenant, nous allons animer un peu tout ça. La première chose à faire est de créer une boucle de jeu. Certains utilisent la fonction setInterval à cette fin, je lui préfère la fonction setTimeout. En effet, setTimeout répété plusieurs fois permet de ne pas demander le re-dessin des objets sur le canvas tant que le dessin précédent n'a pas été fait.

De ce fait, si l'on utilise le jeu sur de petits appareils peu performants, on aura moins de difficultés à jouer, le jeu sera juste un peu ralenti. Ca tombe bien, mon objectif est que ce jeu marche aussi sur les mobiles. MooTools utilise la fonction `delay` pour effectuer une action après `n` millisecondes d'attente. Garder une référence à ce délai dans la propriété timer nous permettra de mettre fin à la boucle principale en temps voulu.

```sh
nfroidure:~/ git checkout [efd8c071e8fc6f552640befb2ee12cca8a3d7492](https://github.com/nfroidure/CasseBriques/commit/efd8c071e8fc6f552640befb2ee12cca8a3d7492 "Voir le diff de ce commit")
```

On a donc notre balle qui est dessinée toutes les 5 millisecondes. Pour la faire bouger, nous allons lui donner une vitesse (`speed`), une direction (`angle`) et ajouter une méthode (`move`) permettant de lui demander de bouger. Notre boucle principale n'aura alors qu'à appeler la fonction move pour permettre à la balle de s'afficher à chaque fois à une position différente.

Vous remarquerez que nous avons adapté la vitesse à la taille du canvas grâce à la propriété aspect ratio. La vitesse de la balle sera ainsi constante quelle que soit la taille de l'élément dans lequel se déroule le jeu.

```sh
nfroidure:~/ git checkout [2f6e0b5ace29711707c58c601fbc6cfcfb362a17](https://github.com/nfroidure/CasseBriques/commit/2f6e0b5ace29711707c58c601fbc6cfcfb362a17 "Voir le diff de ce commit")
```

Maintenant, nous devons nous assurer que la balle ne sortira pas du canvas. Pour cela, nous avons déjà préparé le terrain. En effet, dans la fonction move, deux variables sont créées pour stocker temporairement les nouvelles coordonnées. Nous allons donc procéder à divers tests et dévier la balle si les nouvelles coordonnées sont en dehors des limites du jeu, de cette façon, au prochain calcul, la balle [n'ira plus hors des limites du jeu](http://htmlpreview.github.io/?https://github.com/CasseBriques/b738ec5d0167afc29caaf07ca9ec3e71296fe5f3/index.html "Voir le commit en action").

```sh
nfroidure:~/ git checkout [b738ec5d0167afc29caaf07ca9ec3e71296fe5f3](https://github.com/nfroidure/CasseBriques/commit/b738ec5d0167afc29caaf07ca9ec3e71296fe5f3 "Voir le diff de ce commit")
```

## Mouvement de la barre et collision

Il faut maintenant permettre à l'utilisateur de faire se déplacer la barre. Pour cela, nous allons suivre le mouvement de la souris. Puisque la barre n'est amenée à être dessinée que quand la souris est bougée, nous allons directement gérer l'évènement et le dessin de la barre au sein de l'objet lui même.

```sh
nfroidure:~/ git checkout [52e2f453b89e928b13416744a109edb1ce93b25e](https://github.com/nfroidure/CasseBriques/commit/52e2f453b89e928b13416744a109edb1ce93b25e "Voir le diff de ce commit")
```

Enfin, nous allons gérer la collision de la balle avec la barre. Nous allons faire ceci au sein de l'objet ball puisque la fonction move s'y prête parfaitement. En plus de la collision, nous allons dévier l'angle du rebond en fonction de la position sur la barre.

```sh
nfroidure:~/ git checkout [5f9309603275df07c3214a97c870ecfa40510f7c](https://github.com/nfroidure/CasseBriques/commit/5f9309603275df07c3214a97c870ecfa40510f7c "Voir le diff de ce commit")
```

Enfin, nous allons permettre à la barre d'[emmener la balle dans son sillon](http://htmlpreview.github.io/?https://github.com/CasseBriques/fcf6249a93119e4de4b4b38d774fbbd9ed54c5e7/index.html "Voir le commit") quand sa vitesse est nulle, c'est à dire, au début du jeu.

## Génération des briques et collision

Nous allons créer un objet brique permettant de dessiner et gérer les collisions avec une brique. Le dessin reprend simplement ce que nous avons vu pour la barre. La fonction de collision (`hit`) permet, en passant en paramètre des coordonnées et un rayon de retourner une valeur permettant de savoir si il y a eu collision et de quels côtés de la brique. Cette valeur de retour utilise une technique de [bit bashing](https://fr.wikipedia.org/wiki/Manipulation%5Fde%5Fbit "En savoir plus") très connue dans le monde Unix. Ici, grâce à un seul entier, on symbolise un nombre importants de combinaisons de valeurs différentes.

```sh
nfroidure:~/ git checkout [5336331b048af72cdd1ee3e84afa0bbbdda0a207](https://github.com/nfroidure/CasseBriques/commit/5336331b048af72cdd1ee3e84afa0bbbdda0a207 "Voir le diff de ce commit")
```

Maintenant que l'objet brique est créé, nous allons créer une fonction pour les générer au sein de l'objet Game (`populate`) afin de [former le mur](http://htmlpreview.github.io/?https://github.com/nfroidure/CasseBriques/7f3ed8d067d53fe39816c74aabc66621bee5276d/index.html "Voir le commit de la création du mur").

```sh
nfroidure:~/ git checkout [7f3ed8d067d53fe39816c74aabc66621bee5276d](https://github.com/nfroidure/CasseBriques/commit/7f3ed8d067d53fe39816c74aabc66621bee5276d "Voir le diff de ce commit")
```

Intéressons nous aux collisions balle briques. Notre fonction `Brick.hit` retourne un entier indiquant les côtés de la brique ayant subis la collision. Nous allons donc executer cette fonction pour toutes les briques successivement, supprimer les briques et agglomérer les résultats de toutes les collisions grâce à l'opérateur binaire `|` (ou inclusif). Cela se passe toujours dans l'objet `ball` et sa fonction `move` qui s'y prête bien. Enfin, grâce à l'opérateur binaire `&`, nous sommes en mesure de déterminer quel est le résultat de cette agglomération et changer l'angle de la balle en conséquence. Nous allons aussi ajouter à la fonction `remove` de l'objet `Brick` une ligne pour retirer une brique détruite du tableau bricks de l'objet `Game`.

```sh
nfroidure:~/ git checkout [b3ed8c550a2cf8948c838b09aa62c772e34e9381](https://github.com/nfroidure/CasseBriques/commit/b3ed8c550a2cf8948c838b09aa62c772e34e9381 "Voir le diff de ce commit")
```

## Bouclage du jeu

Voilà, nous y sommes quasiment, il reste à permettre de continuer de jouer lorsque la balle est tombée puis à régénérer le mur lorsque ce dernier est complètement détruit.

```sh
nfroidure:~/ git checkout [9f6794c154cabc0d9f03ca0e4349027f21c79b81](https://github.com/nfroidure/CasseBriques/commit/9f6794c154cabc0d9f03ca0e4349027f21c79b81 "Voir le diff de ce commit")
```

Et voilà, nous avons [un jeu sommaire](http://breakit.insertafter.com/index.html "Voir le jeu dans sa version actuelle") mais très facilement personnalisable ou augmentable le tout sous licence GNU/GPL. Les collisions mériteraient d'être améliorées pour être plus naturelles, mais pour cela, il faudrait que je me penche plus sérieusement dessus, peut-être que ce sera le sujet d'un autre billet. Y'a plus qu'à continuer le projet pour les plus braves :d.

PS : L'aventure continue avec l'ajout du [support de `requestAnimationFrame`](./request_animation_frame "Voir le billet sur le support de requestAnimationFrame").
