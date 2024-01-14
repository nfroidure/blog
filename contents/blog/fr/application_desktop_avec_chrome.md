---
title: Une application desktop avec Chrome
description: Bien que HTML5 progresse de jour en jour, on aimerait parfois pouvoir accéder à n'importe quoi dans son navigateur. C'est déjà possible, grâce à un nouveau petit projet NodeJS.
leafname: application_desktop_avec_chrome
link:
  label: App desktop avec Chrome
  title: En savoir plus sur cette astuce
date: "2013-02-08T15:54:30.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - NodeJS
  - Chrome
categories:
  - JavaScript
---

# Une application desktop avec Chrome

---

⚠ Attention: Cet article est ancien et le projet qui y est décrit a été supplanté par Electron, le moteur utilise pour Atom.

---

Bien que HTML5 progresse de jour en jour, on aimerait parfois pouvoir accéder à n'importe quoi dans son navigateur. C'est déjà possible, grâce à un nouveau petit projet NodeJS.

Ce projet, c'est [Node-Chrome](https://github.com/hij1nx/node-chrome "Voir le dépôt du projet"). L'idée est toute bête, mais encore fallait-il y penser.

Le navigateur Google Chrome possède pléthore de ligne de commandes, malheureusement peu documentées dans le man correspondant, mais [disponibles ici](https://peter.sh/experiments/chromium-command-line-switches/ "Voir la liste des arguments"). Deux arguments sont assez intéressants :

- **\--app http://localhost :** Celui-ci permet de spécifier une URL à ouvrir
- **\--force-app-mode :** Permet d'ouvrir Chrome sans les boutons de l'interface (sans le Chrome).

Ces options sont utilisées pour créer les raccourcis vers des applications web du Marketplace de Chrome sur le bureau.

Node-Chrome tire parti de ces options en créant un serveur NodeJS et en lançant un processus Google-Chrome. Grâce à cette exécution simultanée, l'instance de NodeJS peut donc donner accès à tous les périphériques du système.

Résultat : promesse tenue ! Une application desktop grâce à Google Chrome et NodeJS qui n'aura aucune limite (à part celles de l'utilisateur via lequel le processus a été lancé).

Comme Chrome et Node sont multi-plateformes, cela donne donc une configuration tout à fait portable sur n'importe quel OS.

On pourrait tout à fait imaginer la même chose avec Firefox en lieu et place de Chrome.

Bref, une question reste en suspens, combien de temps Java va mettre pour mourir ?
