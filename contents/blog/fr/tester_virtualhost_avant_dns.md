---
title: Tester un virtualhost avant de changer les DNS
description: Quand on migre un site vers un nouveau serveur, on a besoin de tester le bon fonctionnement de ce dernier avant de mettre à jour les DNS. Petite astuce à base de telnet et openssl.
leafname: tester_virtualhost_avant_dns
link:
  label: Migrer un virtualhost
  title: En savoir plus sur le migration d'un hôte virtuel
date: "2012-10-18T08:29:18.000Z"
lang: fr
location: FR
keywords:
  - Linux
  - DNS
categories:
  - Administration Système
---

# Tester un virtualhost avant de changer les DNS

Quand on migre un site vers un nouveau serveur, on a besoin de tester le bon fonctionnement de ce dernier avant de mettre à jour les DNS. Petite astuce à base de Telnet et OpenSSL.

## Changement des DNS

Changer les DNS est simple. On fait pointer l'enregistrement `A` et l'enregistrement `WWW` vers la nouvelle IP. Malheureusement, ceci est long.

En effet, la propagation des nouveaux DNS à travers les divers cache prends de 24 à 48 heures.

Du coup, l'opération est irréversible. Si vous vous rendez compte d'une erreur sur le nouveau serveur, les personnes qui ont accédé à votre site avec les nouveaux DNS sont condamnées à rester sur le nouveau serveur jusqu'à la prochaine interrogation des serveurs DNS et cela peut prendre 24 heures !

## Comment tester ?

Bref, il nous faut un moyen de tester le nouveau serveur avant de changer les DNS.

L'idée est de faire une requête HTTP vers le nouveau serveur en simulant le fait qu'on y accède à travers le nouveau domaine (ex: `mondomaine.com`)

Cela se fait avec `telnet` ou `netcat`. On crée une connexion TCP sur le serveur HTTP vie le port `80` :

```sh
nc ip.ip.ip.ip 80
```

On fait une requête HTTP en mettant bien l'hôte dans les entêtes :

```
GET / HTTP/1.1
Host: mondomaine.com

HTTP/1.1 200 Ok
```

Ne pas oublier de faire deux retours à la ligne. Le code de réponse donne une indication sur le succès ou non de la requête.

Pour tester le `virtualhost` en SSL, seule la ligne de création du socket change :

```sh
openssl s_client -connect ip.ip.ip.ip:443
```
