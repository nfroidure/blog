---
title: Et si HTML5 accédait à mon véhicule ?
description: Citroën vient de lancer un petit concours tout simple auquel je vais proposer une idée. Découvrez là, mais aussi, comment elle pourrait être mise en oeuvre.
leafname: applications_vehicules
link:
  label: Véhicule HTML5
  title: En savoir plus sur cette idée
date: "2013-01-09T08:54:05.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - HTML5
  - Applications Web
categories:
  - JavaScript
  - HTML5
  - Applications Web
---

# Et si HTML5 accédait à mon véhicule ?

Citroën vient de lancer un petit concours tout simple auquel je vais proposer une idée. Découvrez-la, mais aussi, voyez comment elle pourrait être mise en œuvre.

## Contexte

Je viens de voir passer un tweet dans ma timeline, Citroën organise un concours pour imaginer une application pour smartphones qui pourrait révolutionner l'usage des véhicules. L'idée est d'imaginer qu'il soit possible à partir de son smartphone d'accéder aux données du véhicule. J'imagine qu'ils souhaitent mettre en place une API et qu'ils voudraient des idées d'applications à mettre en œuvre, mais aussi savoir quel genre d'informations exposer via cette API. Je me suis pris au jeu avec une petite idée assez amusante :).

## SweetDriver

![Illustration de ce que pourrait être SweetDriver](/public/illustrations/sweetdriver.png)

Je sais pas si ça vous arrive, mais même en essayant d'être un bon conducteur, il arrive toujours un moment ou je ne mets pas mon clignotant, où je dépasse la limite de vitesse autorisée etc. etc. Je pense que c'est à cause du fait que conduire est ennuyeux. Le permis juste en poche, on apprécie de se déplacer librement, mais les années passant on se lasse et les comportements deviennent plus relâchés.

C'est là qu'intervient Sweet Driver ! Le but de cette application est de récompenser les conducteurs lorsqu'il se comportent bien. Basiquement, il s’agirait d'un compteur de points incitatif qui s’incrémenterait à chaque fois que le conducteur fait une bonne action. Voici quelques bonnes actions que j'ai imaginées :

- je mets mon clignotant : 5 points
- je respecte les limitations de vitesse : 2 points/minute
- je me rabats après dépassement : 10 points
- je regarde bien la route (détection visage) : 2 points/minute
- je met mes warnings pour indiquer un ralentissement : 15 points
- je me déporte sur le bas-côté pour laisser passer les pompiers, une ambulance (détectés grâce au micro) : 20 points
- je mets ma ceinture avant toute accélération : 15 points
- je ralentis avant une priorité à droite : 5 points
- etc.

Je pense que l'on peut compléter cette liste indéfiniment. L'idée est de rendre amusant le respect des règles de bonne conduite. On peut aussi créer des badges que l'on peut obtenir en remplissant certains critères :

- Bodyguard : tout le monde a mis sa ceinture avant tout démarrage.
- GreenMan : je consomme peu d'essence, j'économise mes freinages.
- SocialDriver : j'informe les autres conducteurs (warning, accidents, bouchons).

Enfin, comme pour tout jeu, le plus important, la possibilité de partager ses exploits sur les réseaux sociaux et pourquoi pas un classement national avec une récompense pour le meilleur conducteur.

## Les applications

Outre les particuliers, on pourrait tout à fait imaginer intégrer ce logiciel pour les véhicules d'auto-école, mais aussi pour les sociétés afin de créer des challenges internes. Il pourrait même être utilisé par les compagnies d'assurance pour proposer des réductions en fonction de la conduite.

## Et HTML5 ?

La question qui reste en suspens est comment utiliser cela grâce à HTML5 ? Je ne pense pas que c'est le choix que Citroën va faire, mais sait-on jamais, je le propose tout de même ! Pour moi, obtenir les données du véhicule doit se faire via un protocole standardisé et adapté à Internet et plus particulièrement au Web.

Il faut que le véhicule dispose d'un serveur web local (pourquoi pas en NodeJS) qui expose une API REST. De cette manière, le Smartphone, connecté en Wifi au réseau local pourrait interroger ce serveur à partir d'une application native, mais aussi et surtout à partir d'une application HTML5.

Bien-sûr, il faut un accès en lecture uniquement bien qu'une authentification et un cryptage SSL seraient à priori sans risques. L'avantage de cette vision est qu'on peut tout à fait ajouter de nouvelles fonctionnalités au protocole sans le changer, voire, installer des applications tierces dans le serveur du véhicule qui permette d'accéder à de nouvelles données.

On peut par exemple imaginer un media center qui remplace l'autoradio et que chaque Smartphone du véhicule puisse lire la chanson qui lui plaît. Les possibilités sont infinies c'est ça qui est excitant avec les systèmes ouverts.

Bref, espérons que Citroën jouera le jeu des protocoles standards pour le plus grand bonheur des développeurs d'application ! En attendant, je vais proposer mon app, souhaitez moi bonne chance :).
