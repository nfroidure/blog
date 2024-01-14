---
title: "Jeux HTML5 : Défi Tank Arena"
description: Si vous avez déjà joué à Tank Arena, alors vous savez que c'est un excellent jeu. Malheureusement, il n'existe que pour Windows. Relevons le défi d'en faire un jeu HTML5 !
leafname: tank_arena_html5
link:
  label: Tank Arena HTML5
  title: En savoir plus sur ce projet
date: "2012-06-09T14:20:22.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - Jeux
  - HTML5
categories:
  - Jeux HTML5
---

# Jeux HTML5 : Défi Tank Arena

---

⚠ Attention: Cet article est ancien et son contenu n'est plus d'actualité. Je ne le conserve que pour des raisons historiques.

---

Si vous avez déjà joué à Tank Arena, alors vous savez que c'est un excellent jeu. Malheureusement, il n'existe que pour Windows. Relevons le défi d'en faire un jeu HTML5 !

[Mon expérience du Casse Brique](./html5_casse_brique "Voir le billet sur le Casse brique que j'ai réalisé") a confirmé mon intuition première : développer des jeux HTML5, c'est fun ! Après avoir goûté à [BrowserQuest](http://browserquest.mozilla.org/ "Voir le jeu créé par Mozilla"), je me suis dit que le web était prêt pour embrasser l'univers du jeu et j'ai eu envie de m'y frotter. Malheureusement, créer un jeu de toute pièce plus évolué qu'un simple Casse Brique nécessite de monter une équipe composée de graphistes, de scénaristes et de développeurs.

Je n'ai pas vocation à vendre ces jeux au travers de mon entreprise, mais plutôt à les créer pour le fun, à mon rythme et à les proposer à la communauté. Bref, je ne peux pas embaucher un graphiste pour cela.

C'est alors que j'ai pensé à ce vieux freeware avec lequel j'ai pas mal joué étant plus jeune (alors en shareware) et qui me plaisait beaucoup. J'ai donc contacté les auteurs de Tank Arena, Jorrit Rouwe et Dennis Medema et ils ont gentiment accepté que ce projet démarre avec pour seule condition, une utilisation non-commerciale ce qui me va tout à fait. Jorrit m'a donc transmis les sources du jeu (écrit originellement en C). Un gros travail de conversion des fichiers existants en fichiers utilisables pour le web a donc commencé.

Deux jours plus tard, me voici donc avec une [collection de sprites](https://github.com/nfroidure/TankArena/tree/master/www/sprites "Voir la liste") sous licence Creative Common Non-Commercial Attribution. Il ne me reste plus qu'à coder :D.

## Plantons le décor

[Tank Arena](http://www.jrouwe.nl/tank/ "Voir le site officiel") est un jeu aux graphismes 2D vus de dessus. Le joueur incarne un tank, un bateau ou un avion et évolue en 3D (les avions surtout). En mode solo (ou en coopération), il accomplit des missions contre l'ordinateur, en mode multijoueur, il propose des battles ou des courses. Afin de bien comprendre tout l'article, je vous conseille d'y jouer un peu, de cette façon vous aurez une bonne vision des raisons qui expliquent les choix que j'expose ci-dessous.

Je ne sais pas encore ce que ma version proposera, mais j'aimerai bien proposer un mode mission et un mode multijoueur (avec les web sockets). Dans tous les cas, les premiers prototypes que je vais réaliser vont surtout consister à trouver la meilleure solution technique pour afficher le monde et ce qu'il contient.

## Mon plan d'action

J'ai contacté le [développeur de Browser Quest](http://twitter.com/whatthefranck "Voir son profil Twitter") et lui ai posé quelques questions à propos de la façon dont il avait travaillé sur le projet. Je voulais surtout savoir si ils avaient rencontré des problèmes de performance. Je ne veux surtout pas me retrouver avec un jeu injouable à cause d'une architecture mal pensée. En effet, là ou le code natif permet quelques écarts, la programmation d'un jeu avec HTML5 / Javascript nécessite de bien penser aux performances.

Finalement, un jeu de ce type se compose d'un plan (avec étages dans notre cas) sur lequel se trouvent des objets dont un certain nombre sont animés ou se déplacent contrôlés par le joueur ou par l'ordinateur. Chaque objet est donc affiché en fonction d'une part de son état (position, orientation, niveau z etc..) et/ou du temps. Le jeu se résumera donc à une boucle qui parcourra successivement tous les objets se trouvant sur le plan pour les modifier en fonction du temps pour les éléments dynamiques et pour les dessiner en fonction du point de vue actuel sur ce plan.

### Le plan

Le plan peut être subdivisé en cases dont chacune contient une texture. Ces textures sont le plus souvent figées, il n'est donc pas nécessaire d'imprimer ces dernières dans un Canvas à chaque fois. Par exemple, dans Browser Quest, la map n'est imprimée qu'un fois dans un Canvas et n'est réimprimée que lorsque le personnage change de vue. Dans mon cas, le problème est que la carte doit défiler en même temps que le tank, cependant, afin d'économiser du CPU, je vais partir sur une solution un peu spéciale, j'espère que ça marchera.

L'idée est d'imprimer tous les éléments statiques dans un Canvas de la taille de la carte (donc trop grand pour être affiché en entier. Ensuite, je vais choisir entre deux solutions : la première, utiliser la propriété background dans une élément `<div>` grâce à l'export sous forme de `dataUri` de l'image composée par le Canvas, la seconde, est de mettre le Canvas dans un div et de scroller le `div` en même temps que le personnage évolue. J'espère que l'une des deux solutions sera concluante.

Actuellement, je penche plutôt pour la seconde car elle me permettrait d'animer certaines textures (vagues dans l'eau, vent dans les arbres ou autre), je me vois mal récupérer une `dataURI` a chaque frame d'une animation pour l'injecter dans le background d'une div.

### Les tanks, bâtiments et autres objets

Ensuite, sur la carte, il y a des bâtiments qui eux aussi sont statiques, mais qui peuvent changer d'état et donc d'apparence. De plus, les tanks peuvent, en fonction de leur position en `z` apparaitre au dessus ou en dessous du bâtiment.

Deux solutions se présentent à moi. La première est de décider de tout redessiner à chaque boucle de jeu dans un unique canvas, la seconde est de superposer plusieurs éléments `<canvas>`. La deuxième solution me parait plus souhaitable, mais je dois déterminer combien d'éléments `<canvas>` je dois superposer.

Les tanks terrestres ou maritimes sont au niveau 0 (sol), les bâtiments sont au niveau 0 pour ceux en dessous desquels on ne peut passer ou au niveau 1 pour les autres, sachant que pour les bâtiments sous lesquels on peut passer, bien qu'il ne sont représentés graphiquement qu'au niveau 1, il ont une présence physique au niveau 0 qui sera à prendre en compte pour les collisions.

Je serais bien tenté par la disposition suivante :

- canvas de fond statique (Niveau 0) : les éléments sont imprimés une fois en debut de jeu, ceux dont l'état change sont ré-imprimé à ce moment là et uniquement la zone concernée. On y imprimerai les textures de fond et les bâtiments pleins (on ne peut pas passer en dessous),
- canvas dynamique (Niveau 0) : on y imprimera les animations des textures puis les tanks terrestres et maritimes y seront imprimés à chaque boucle du jeu, mais uniquement pour la zone de la carte affichée à l'écran,
- canvas aérien statique : on y imprimera les bâtiment en dessous desquels un tank peut passer avec une gestion du même type que le canvas de fond,
- canvas aérien multi-niveaux : on y imprimera tous les autres niveaux en parcourant récursivement le tableau des objets dynamiques pour chaque étage de jeu. En effet, pour tous les autres étages de jeu, il n'y a plus que des éléments dynamiques et il ne serait donc pas opportun de créer d'autres éléments Canvas.

J'oubliais, dans le Tank Arena original, il existe des "trous" dans lesquels on peut tomber. Le niveau z peut donc être négatif. Pour autant, on ne le prévoit pas dans la superposition des éléments `<canvas>` car les trous ne sont pas recouverts et il nous suffira d'imprimer les sprites qui vont bien pour donner l'impression que le Tank est entrain de tomber.

### Les sprites

Lors de la refonte des graphismes, je ne savais pas trop comment organiser les sprites pour optimiser la gestion des images dans le jeu. J'ai pris le parti de réunir les sprites relatif à un même tank au sein d'un seul fichier. De réunir les structures ensemble, tout comme les bâtiments, les murs, les arbres etc... De cette façon, les sprites du jeu sont réunis dans un total de 36 fichiers ce qui me parait pas mal en terme d'organisation.

J'imagine que je devrais les charger dynamiquement au chargement du jeu afin de les avoir sous la main. A savoir, le jeu original utilisait des sprites de 33x33pixels, je vais donc rester sur ça, mais je m'appliquerait pour que cela soit modifiable afin que je puisse réutiliser une bonne part du code dans d'autres jeux sans forcément rester sur ce choix là.

### Types d'objets

Finalement, on distingue peu de types d'objets différents :

- le terrain : chaque subdivision du plan de 33x33 pixels contient une image représentant le terrain. Je ne créerai pas d'objets pour ceux-ci, mais simplement un tableau indiquant quelle texture doit y être insérée. Ce tableau servira aussi à contenir les éléments se trouvant dans chacune de ces subdivisions,
- les objets statiques : il peuvent être de niveau 0 et/ou 1. Ils ont des bords physiques avec lesquels des objets mobiles peuvent entrer en collision,
- les objets dynamiques : il peuvent être de niveau n (entier) et peuvent entrer en collision avec des autres objets du même type ou des objets statiques.

En revanche, chaque objet a des types de collision différents. En fonction des formes, on aura divers choix :

- un objet suffisamment petit pourra être considéré comme un point. Je pense à un tir principalement,
- un objet suffisamment rond pourra être considéré comme un rond (tank ou bâtiment plutôt rond, plot),
- un objet suffisamment carré pourra être considéré comme une carré (bâtiment plein) ou un ensemble de carrés (bâtiments sous lequel on peut passer).

Chaque objet du monde devra donc avoir une propriété contenant un tableau de ses contours physiques et de leur type. Ajoutons enfin le fait qu'il nous faudra toujours vérifier que les objets mobiles soient bien à l'intérieur des limites du jeu.

On distinguera les objets qui devront être repositionnés (tanks) des objets qui seront détruits (tirs) à la collision.

Par convention, on délèguera aux objets mobiles la gestion de leur collision avec les objets statiques et mobiles qui les entourent. En cas de collision entre deux objets mobiles, chacun de ces objets aura la responsabilité de calculer sa propre réaction. Les tirs sont des objets mobiles particuliers, les autres objets mobiles ne s'en préoccuperons pas, c'est le tir lui même qui infligera ses dégâts aux objets qu'il atteindra.

Les objets auront également sous leur responsabilité de déclarer leur propre occupation de l'espace. En effet, afin d'affiner la gestion des collisions, chaque objet devra déclarer quelles subdivisions de 33x33 pixels du plan ils occupent afin de permettre de mieux cibler les tests à effectuer pour calculer les collisions. Un objet mobile calculera donc sa collision avec les objets déclarés dans les subdivisions du plan qu'il occupe (1 à 4 dans la majorité des cas). Cela permettra de réduire les calculs de collision à effectuer.

Chaque objet mobile/animé a la responsabilité d'exposer une méthode fonction du temps que la boucle de jeu se chargera d'appeler afin de procéder à un changement d'état/de position/de direction etc...

Enfin, chaque objet fournit une méthode permettant d'imprimer sa propre représentation graphique et ce pour chaque canvas concerné. Pour les objets statiques cette méthode sera appelée au démarrage et à chaque changement d'état, pour les objets mobiles à chaque boucle si il se trouve dans la vue actuelle du jeu.

## Où , quand et comment ?

[Ce projet se trouve sur GitHub](https://github.com/nfroidure/TankArena "Voir la page" du projet"), il sera développé pendant mon temps libre, sous licence GNU/GPL. Vous pouvez participer si vous le souhaitez en le forkant et en me proposant un pull request. De mon côté, je tenterai de prendre le temps d'expliquer son code sur ce blog pour vous mettre le pied à l'étrier.

A vos éditeurs de code :).

Edit : Le jeu est déjà bien avancé, j'ai créé un petit [article sur les collisions 2D](./gestion_collisions_html5_canvas.md "Lire cet article") que j'ai dû fouillé pour coder les premières versions.
