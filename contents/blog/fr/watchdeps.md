---
title: Surveillez les dépendances de vos projets NodeJS
description: Avec watchdeps abonnez-vous automatiquement aux dépendences de vos projets NodeJS sur GitHub.
leafname: watchdeps
link:
  label: Watchdeps
  title: Découvrez comment rester informé de l'évolution des modules tiers
date: "2015-03-08T10:07:32.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - NodeJS
  - NPM
  - Modules
categories:
  - JavaScript
---

# Surveillez les dépendances de vos projets NodeJS

---

⚠ Attention: Cet article est ancien et n'est conservé que pour des raisons historiques. Il est possible dans GitHub de ne souscrire qu'aux versions et ainsi éviter de suivre la totalité du projet. L'approche de watchdeps n'est donc plus valide maintenant.

---

**TL; DR:**

```sh
sudo npm install -g watchdeps
cd myproject && watchdeps -u username
```

Depuis que NPM a rendu la gestion de dépendences simple et pratique, nous avons tendance à utiliser de plus en plus de modules. C'est une bonne chose, ne pas réinventer la roue à chaque fois est une qualité recherchée chez un développeur.

![Avec de grand pouvoirs viennent de grandes responsabilités](/public/illustrations/great_powers-great-responsibility.gif)
[Source MTV](http://www.mtv.com/news/2092125/attractive-things-sober-people/ "Voir la source de l'image")

En revanche, installer des modules signifie, avant tout, embarquer du code tiers. Ce n'est pas si anodin. Une fois [que vous avez choisi un module](./choisir_module_nodejs "Voir mes conseils pour choisir un module"), vous ne pouvez pas en rester là.

Un développeur professionnel s'assurera toujours de rester informé de l'évolution des modules tiers qu'il embarque dans ses projets. Pour cela, un des meilleurs moyens est de s'y abonner sur GitHub pour recevoir des notifications à leur propos.

Mais je ne pouvais me résoudre à faire cela avec une souris ;) :

[ ![Animation montrant l'action de suivre un projet sur GitHub](/public/illustrations/github-watch.gif) ](http://makegif.com/gQ4z "Made with MakeGIF")

J'ai donc créé un petit outil en ligne de commande que j'ai nommé [watchdeps](https://github.com/nfroidure/watchdeps). En l'exécutant, il se connecte directement à GitHub pour vous abonner à tous les modules dont votre projet dépend.

```sh
sudo npm i -g watchdeps
cd myproject/
watchdeps -u nfroidure
```

## Done!

Et voilà ! Vous savez maintenant tout sur les modules que vous embarquez, n'est-ce pas mignon ?
