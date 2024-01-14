---
title: Récupérer les privilèges de l'utilisateur root de MySQL
description: En administration système, tout arrive, même les cas les plus désespérés. Perdre le mot de passe ou les privilèges de root de MySQL en fait partie. Voici comment s'en sortir.
leafname: recuperer_privilege_root_mysql
link:
  label: Privilèges root perdus ?
  title: Voir la méthode
date: "2012-05-19T13:02:39.000Z"
lang: fr
location: FR
keywords:
  - MySQL
  - Linux
categories:
  - Administration système
---

# Récupérer les privilèges de l'utilisateur root de MySQL

En administration système, tout arrive, même les cas les plus désespérés. Perdre le mot de passe ou les privilèges de root de MySQL en fait partie. Voici comment s'en sortir.

Perdre les privilèges et/ou le mot de passe de l'utilisateur root de MySQL est plutôt ennuyeux. Pour résoudre ce problème, il va falloir utiliser la ligne de commande. Sous Debian GNU/Linux, la méthode est la suivante.

Tout d'abord, il faut arrêter le serveur MySQL :

```sh
root@server:~# /etc/init.d/mysql stop
```

Si le serveur ne s'arrête pas, il faut alors trouver le numéro de processus du démon MySQL (PID) :

```sh
root@server:~# ps aux | grep mysqld
mysql 27257 0.0 7.0 136720 17824 pts/1 Sl 15:30 0:00 /usr/sbin/mysqld --basedir=/usr --datadir=/var/lib/mysql --user=mysql --pid-file=/var/run/mysqld/mysqld.pid --socket=/var/run/mysqld/mysqld.sock --port=3306
root 27341 0.0 0.3 3320 804 pts/1 S+ 15:37 0:00 grep mysqld
```

Puis, l'arrêter manuellement (ici, il s'agit du PID `27257`) :

```sh
root@server:~# kill 27257
```

Maintenant, nous allons démarrer le démon MySQL en ligne de commande en lui ajoutant des options bien pratiques. Tout d'abord l'option `--skip-grant-tables` qui permet d'enlever les vérifications de privilège et d'accéder sans authentification au serveur MySQL. Ensuite, l'option `--skip-networking` afin d'éviter d'exposer le serveur au réseau ce qui pourrait laisser la porte ouverte au hacker avisé qui passerai par là.

```sh
root@server:~# mysqld --skip-grant-tables --skip-networking &
```

L'esperluette permet de récupérer la ligne de commande après le démarrage du démon car nous allons en avoir besoin.

Connectons-nous à MySQL grâce à son client en ligne de commande :

```sh
root@server:~# mysql

Welcome to the MySQL monitor. Commands end with ; or g.

Server version: 5.1.49-3 (Debian)

Copyright (c) 2000, 2010, Oracle and/or its affiliates. All rights reserved.
This software comes with ABSOLUTELY NO WARRANTY. This is free software,
and you are welcome to modify and redistribute it under the GPL v2 license
Type 'help;' or 'h' for help. Type 'c' to clear the current input statement.
mysql>
```

Nous avons maintenant la possibilité d'entrer des requêtes SQL sans vérification de droits quelconques. A savoir, l'option `--skip-grant-tables` ne nous permet pas d'utiliser les requêtes de type `GRANT`. Nous allons donc devoir agir directement sur les tables virtuelles de MySQL. Pour changer le mot de passe :

```sh
mysql> UPDATE mysql.user SET password=PASSWORD('nouveaumdp') WHERE User="root";
```

Pour récupérer tous les privilèges :

```sh
mysql> UPDATE mysql.user SET Grant_priv = 'Y', Super_priv = 'Y' WHERE User = 'root';
```

On peut maintenant fermer le client MySQL.

```sh
mysql> exit
Bye
```

Pour mettre fin au processus et redémarrer MySQL dans des conditions normales de production, il faut à nouveau tuer le processus mysqld grâce aux commandes utilisées plus haut et redémarrer le serveur :

```sh
root@server:~# /etc/init.d/mysql restart
```

Voilà. N'hésitez pas à donner vos trucs perso en commentaire.
