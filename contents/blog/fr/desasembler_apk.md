---
title: Décompiler/désassembler un paquet Android (.apk)
description: Grâce à la combinaison de deux outils simples et pratiques, il est possible d'obtenir un code source assez fidèle à celui d'origine pour un paquet Android.
leafname: desasembler_apk
link:
  label: Décompiler les APK
  title: Voir l'astuce pour faire cette décompilation
date: "2012-01-19T12:11:27.000Z"
lang: fr
location: FR
keywords:
  - Java
  - Android
categories:
  - Java
  - Android
---

# Décompiler/désassembler un paquet Android (.apk)

Grâce à la combinaison de deux outils simples et pratiques, il est possible d'obtenir un code source assez fidèle à celui d'origine pour un paquet Android.

Les applications Android sont packagées sous la forme d'une archive compressée `.apk`. A l'intérieur, le bytecode des fichiers Java sous la forme de fichiers d'extension `.dex` (bytecode généré pour Dalvik, la machine virtuelle Java utilisée par Android). Premier problème, les fichiers XML de description de l'interface et des ressources ne sont pas lisible à l'œil nu puisque compilés eux aussi.

La première chose à faire est donc de les passer à la moulinette de Android [APK Tool](http://ibotpeaches.github.io/Apktool/ "Télécharger l'outil") qui va gentiment vous restituer les fichiers XML sous un format texte.

Maintenant passons aux fichiers Dex. Sous cette forme, il n'existe pas encore d'outils permettant de décompiler ces fichiers. Il va donc falloir passer par un intermédiaire pour obtenir du bytecode compatible avec la machine virtuelle Java habituelle.

Cet outil, c'est [`dex2jar`](http://code.google.com/p/dex2jar/ "Télécharger dex2jar"). Grâce à ce dernier, vous serez en mesure de récupérer un code source Java relativement fidèle à l'original en utilisant [`jd-gui`](http://jd.benow.ca/ "Télécharger cet outil").

Le proof of concept de cet article est ce petit [client REST](https://github.com/nfroidure/SimpleRestAndroidClient "Voir ce client") que j'ai eu le malheur de développer sur un coin de table tant et si bien que je n'avais plus que le fichier `apk`.
