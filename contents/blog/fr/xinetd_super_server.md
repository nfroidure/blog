---
title: Gestion de flotte X1 Intellitrac avec xinetd sur Debian GNU Linux
description: Le super server xinetd est vraiment très pratique pour des petits projets ne dépassant pas un certain nombre de clients. Voici une petite illustration de son utilité pour la localisation de flotte de véhicules.
leafname: xinetd_super_server
link:
  label: xinetd et X1 Intellitrac
  title: En savoir plus sur ce petit projet
date: "2013-04-01T14:35:58.000Z"
lang: fr
location: FR
keywords:
  - C
  - XInetd
  - Linux
categories:
  - Linux
---

# Gestion de flotte X1 Intellitrac avec xinetd sur Debian GNU Linux

Le super server xinetd est vraiment très pratique pour des petits projets ne dépassant pas un certain nombre de clients. Voici une petite illustration de son utilité pour la localisation de flotte de véhicules.

J'ai récemment dû revenir sur un ancien projet pour lequel j'avais utilisé xinetd et un petit programme C++ de mon cru pour logger une flotte de véhicule.

J'ai dû pratiquer quelques optimisations pour lesquelles un retour s'impose car xinetd est très mal documenté, cela aidera peut-être certains d'entre vous.

## Qu'est-ce qu'xinetd

Xinetd est un super serveur destiné à remplacer inetd qui est peu sécurisé. Un super serveur est une implémentation générique d'un serveur qui se base sur des fichiers de configuration pour fournir des services sans forcément devoir réécrire toute une gestion des sockets et des forks de processus. Une chance étant donné la complexité de la chose.

Pour installer xinetd sur une machine de type Debian, une ligne de commande suffit :

```sh
aptitude install xinetd
```

Ce que fait xinetd est simple, il écoute les connexions entrantes pour le service donné et démarre un nouveau processus avec la ligne de commande fournie avec la directive server. Une fois le processus démarré, il pipe le stream montant du socket vers l'entrée standard et le descendant vers la sortie standard du nouveau processus. Toute la logique du socket est masquée et on se retrouve à travailler, tout bêtement, avec stdin et stdout.

Seul petit bémol, xinetd redirige stderr vers le socket également. Pour cette raison, je vous déconseille d'écrire vers stderr vos erreurs, mais plutôt de les envoyer vers syslog. Ceci est d'ailleurs plus logique puisque votre programme devient un démon dès lors qu'il est lancé par xinetd.

## Création d'un service : cas X1 Intellitrac

Dans mon cas précis, je me suis servi d'xinetd pour gérer une flotte d'une trentaine de véhicules équipés du boitier GPS X1 Intellitrac. Tout d'abord, nous allons créer un utilisateur unix appelé `x1server` :

```
adduser x1server
```

Puis, nous allons ajouter le service xinetd à /`etc/services` en déclarant le port `1337` :

```
echo "
 Local services
x1server 1337/tcp # X1 Intellitrac GPS tracking server" > /etc/services;
```

Créons également le service xinetd. Pour ce faire, il faut créer un fichier de configuration dans le répertoire `/etc/xinetd.d/`. Dans mon cas, le fichier ressemble à cela :

```sh
echo "# default: on
 description: X1 Intellitrac GPS tracking server
service x1server
{
 port= 1337
 socket_type= stream
 wait= no
 user= x1server
 server= /home/x1server/bin/x1server
 server_args /home/x1server/log
 log_on_success+= USERID
 log_on_failure+= USERID
 instances= 30
 disable= no
 flags= NODELAY
 nice= -20
}" >> /etc/xinet.d/x1server
```

Le port utilisé est 1337, nous le précisons avec la directive `port`. La directive `user` permet d'exécuter le processus pour un utilisateur particulier ce qui permet de sandboxer ce dernier et éviter les effets de bord d'un éventuel trou de sécurité. La directive `instances` précise le nombre d'instances maximales pour ce serveur. Elle permet d'éviter les attaques DDoS.

La directive `server` désigne le fichier à exécuter. Dans mon cas, il s'agit du projet [X1 Intellitrac GPS Logger](https://github.com/nfroidure/X1-GPS-Logger "Voir le projet sur GitHub") compilé directement sur la machine hôte avec la commande suivante :

```sh
wget https://github.com/nfroidure/X1-GPS-Logger/archive/master.tar.gz
tar -xzvf master.tar.gz
mkdir /home/x1server/bin
g++ /home/x1server/X1-GPS-Logger-master/main.c -o /home/x1server/bin/x1server
chmod u+x /home/x1server/bin/x1server
rm -rf /home/x1server/X1-GPS-Logger-master /home/x1server/master.tar.gz
```

La directive server_args permet de préciser les arguments à utiliser pour démarrer le serveur. Dans notre cas, l'argument est le dossier de destination des logs. Surtout, il ne faut pas oublier de créer ce dossier :

```sh
mkdir /home/x1server/log
chown x1server:x1server /home/x1server/log
```

## Envoyez le bousin !

Il ne reste plus qu'à redémarrer le serveur xinetd pour démarrer le service correspondant :

```sh
/etc/init.d/xinetd restart
```

## Optimisations

Vous aurez peut-être remarqué la directive `flags = NODELAY`. Cette directive permet d'éviter que les entrées/sorties (notamment stdout dans notre cas) ne soient buffurisées. En effet, le [satané protocole des boitiers X1 Intellitrac](http://www.nomadicsolutions.biz/produit/x1-intellitrac/ "Voir la spécification du protocole") impose de renvoyer intacts les 8 octets de synchronisation reçu par le serveur au boitier. Or, j'ai rencontré un problème de mise en mémoire tampon qui provoquait l'envoi des octets trop tard.

J'ai aussi ajouté par la suite une directive nice pour privilégier ces processus peu gourmands, mais dont la réactivité est essentielle. Toutes les directives d'xinetd sont très bien documentées [sur cette page](http://manpages.ubuntu.com/manpages/cosmic/en/man5/xinetd.conf.5.html "Voir les manpages xinetd").

## Résultat

J'ai couplé ces logs avec un [petit driver](https://github.com/nfroidure/Rest4/blob/master/php/class.RestXgpsPositionDriver.php "Voir un des fichiers PHP qui gèrent ces logs") pour [Rest4](https://github.com/Rest4/Rest4-php "Voir le dépôt de code de Rest4"). Le résultat donne ceci :

![Capture d'écran du logiciel de visualisation](/public/illustrations/capture-vigisystem.png)
