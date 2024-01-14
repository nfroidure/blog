---
title: Comment devenir un meilleur père grâce à Cron
description: Décrocher de l'écran en plein milieu d'une session de code est difficile. Mais arriver en retard à la garderie, c'est pas cool. Heureusement cron et Patrick Sébastien sont là !
leafname: meilleur_pere_grace_a_cron
link:
  label: Meilleur père avec Cron
  title: En savoir plus sur cette petite bidouille
date: "2012-05-12T10:24:25.000Z"
lang: fr
location: FR
keywords:
  - Linux
  - Administration Système
categories:
  - Linux
  - Administration Système
---

## Comment devenir un meilleur père grâce à Cron

Décrocher de l'écran en plein milieu d'une session de code est difficile. Mais arriver en retard à la garderie, c'est pas cool. Heureusement cron et Patrick Sébastien sont là !

Ma femme le sait bien, c'est difficile de communiquer avec moi quand je code. Le problème, c'est que je dois conduire mes deux petites filles à la garderie et surtout aller les chercher.

Après plusieurs remontrances suites à quelques retards, j'ai décidé de devenir un meilleur père en tirant avantage de ma machine de développement. Tout d'abord, j'ai cherché un moyen de faire sonner mon PC sous Debian GNU/Linux en ligne de commande.

La commande echo couplée à quelques options permet d'émettre un bip, mais cela ne marche pas toujours. Les bips peuvent être désactivés et il y a tout un tas de conditions obscures pour que ça fonctionne ou pas.

```sh
root@server:~# echo -en "a" > /dev/tty5
```

Bref, j'ai opté pour la solution "beep" qui est un petit binaire permettant de créer de véritables compositions de bips. La première chose à faire est donc de l'installer.

```sh
root@server:~# aptitude install beep
```

Enfin, j'ai trouvé [sur ce forum](http://forum.ubuntu-fr.org/viewtopic.php?id=47239 "Voir le forum"), une ligne de commande toute prête qui joue l'air du petit bonhomme en mousse (on fait avec ce qu'on a :D).

```sh
root@server:~# beep -f 1150 -n -f 1450 -n -f 1300 -l 300 -n -f 1150 -l 300 -n -f 1100 -l 300 -n -f 1150 -l 300 -n -f 850 -l 300
```

Il ne reste plus qu'à éditer le fichier /etc/crontab pour lui ajouter quelques règles permettant de déclencher notre petit air de rassemblement pour un gros câlin famille comme dirait mon aînée. La garderie est ouverte le matin de 9h à 12h du lundi au vendredi et l'après midi de 13h45 à 17h00 les lundi, mardi et vendredi. Je vous laisse deviner le sens des règles ci-dessous.

```sh
root@server:~# echo "

# Garderie ZAZA & EMMA

45 8 \* _ 1-5 root beep -f 1150 -n -f 1450 -n -f 1300 -l 300 -n -f 1150 -l 300 -n -f 1100 -l 300 -n -f 1150 -l 300 -n -f 850 -l 300
45 11 _ _ 1-5 root beep -f 1150 -n -f 1450 -n -f 1300 -l 300 -n -f 1150 -l 300 -n -f 1100 -l 300 -n -f 1150 -l 300 -n -f 850 -l 300
35 13 _ _ 1,2,5 root beep -f 1150 -n -f 1450 -n -f 1300 -l 300 -n -f 1150 -l 300 -n -f 1100 -l 300 -n -f 1150 -l 300 -n -f 850 -l 300
45 16 _ \* 1,2,5 root beep -f 1150 -n -f 1450 -n -f 1300 -l 300 -n -f 1150 -l 300 -n -f 1100 -l 300 -n -f 1150 -l 300 -n -f 850 -l 300
#" >> /etc/crontab
```

On redémarre le démon `crond` :

```sh
root@server:~# /etc/init.d/cron restart
```

Et voilà, plus de soucis à se faire pour la garderie, à condition de ne pas être en rendez-vous clientèle !
