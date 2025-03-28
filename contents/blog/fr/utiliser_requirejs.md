---
title: Astuces pour utiliser pleinement RequireJS
description: Pour un projet dont je vous reparlerai bientôt, j'ai utilisé RequireJS pour la première fois en production. J'en profite pour vous faire un petit retour d'expérience avec quelques astuces de mon cru ;).
leafname: utiliser_requirejs
link:
  label: RequireJS
  title: En savoir plus pour bien utiliser RequireJS
date: "2013-07-11T09:57:45.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - RequireJS
categories:
  - JavaScript
---

# Astuces pour utiliser pleinement RequireJS

---

⚠ Attention: Cet article est ancien et n'est conservé que pour des raisons historiques. Les modules JavaScript sont maintenant unifiés et largement disponibles invalidant les solutions décrites dans cet article.

---

Pour un projet dont je vous reparlerai bientôt, j'ai utilisé RequireJS pour la première fois en production. J'en profite pour vous faire un petit retour d'expérience avec quelques astuces de mon cru ;).

## Présentation

Je vous ai parlé récemment des modules JavaScript (n'hésites pas à lire ou relire mon [billet sur les modules JavaScript](module%5Fjavascript.html "En savoir plus sur les modules JS") pour bien comprendre ce billet). [RequireJS](http://requirejs.org "Voir le site officiel de RequireJS") est un gestionnaire de modules asynchrone. Il permet de charger les modules JavaScript par l'analyse des dépendances de ces derniers puis les exécute dans le bon ordre.

Bien que RequireJS gère les modules synchrone du type CommonJS, il est plutôt recommandé d'utiliser les modulesAMD (Asynchronous Module Definition) qui peuvent ainsi être chargés en parallèle par RequireJS.

Pour rendre notre code compatible avec AMD, il suffit d'utiliser l'un des patterns proposés par James Burke (le créateur de RequireJS), [sur le dépôt](https://github.com/umdjs/umd "Voir le dépôt en question") du projet UMD (Unified Module Definition) visant à unifier la définition de modules.

La seule chose qui peut paraître déroutante (et qui à mon avis est un défaut de conception originel) est que les identifiants de modules sont des identifiants et non des chemins de fichiers. Le fait que l'on puisse utiliser des chemins de fichiers n'est qu'un effet de bord puisque les slashs sont permis dans les noms de modules et réutilisés tels quels lors de la création de l'URL correspondante au script.

Cela amène à quelques soucis quand on souhaite importer un projet composé de plusieurs modules au sein de notre propre projet.

## Utilisation

Pour utiliser RequireJS, rien de plus simple, il suffit de télécharger l'unique fichier `require.js` (soit minifié, soit en clair pour développer). Puis, d'ajouter la balise suivante dans votre HTML (la section `<head>` de préférence) :

```html
<script
  data-main="javascript/Application"
  src="javascript/libs/requirejs/require.js"
  type="text/javascript"
></script>
```

Ce bout de code a deux effets, d'une part, charger RequireJS, d'autre part, indiquer le fichier principal de votre application. C'est à partir de ce fichier (ici,`javascript/Application.js`) que RequireJS va déduire tous les fichiers nécessaires pour votre application (appelés dépendances).

Comme vous pouvez le voir sur la capture d'écran de [mon dernier projet](http://memory.insertafter.com/ "Jouer à mon Memory"), le chargement de RequireJS et son exécution provoque bien le chargement de `Application.js` puis de [ses trois dépendances](https://github.com/nfroidure/Memory/blob/3f5cb8e52ec84ff8e7567588a9180dfb098ba50c/www/javascript/Application.js#L6 "Voir l'endroit où ces dépendances sont définies") `Sounds.js`, `Commandor.js` et `View.js`. On peut remarquer que ces trois dernières sont chargées en paralèlle.

![Capture d'écran du chargement du Memory](/public/illustrations/capture-memory1.png)

RequireJS est particulièrement utile pour le développement. Il permet de ne pas avoir à constamment ajouter/retirer des balises `<script>` à chaque nouveau module ajouté au projet. On peut également l'utiliser pour charger des scripts à la volée uniquement lorsque c'est nécessaire. Par exemple, dans mon Memory, je ne charge le code spécifique à chaque vue que lorsqu'elle est affichée. Par exemple, ci dessous avec la vue `VueOptions.js`.

![Capture d'écran de l'affichage de la vue des options du jeu](/public/illustrations/capture-memory2.png)

## r.js et mise en production

Bien que RequireJS soit intéressant, ce n'est bien souvent pas la solution pour une application en production. En effet, même asynchrone, le chargement reste bien plus lent que si l'on regroupait tous les fichiers au sein d'un seul et même fichier et que, par la même occasion, on en profitait pour le minifier.

C'est l'objet de r.js du même auteur. Il permet en une ligne de commande de réunir et minifier toutes les dépendances de votre application. Pour l'installer, rien de plus simple grâce à NodeJS :

```sh
npm install -g requirejs
```

Pour grouper et minifier tous les fichiers de mon application, cela donne :

```sh
r.js -o baseUrl=./javascript/ name=Application out=javascript/production.js
```

Tous ? Non ! Un certains nombre de fichiers résistent au minifieur. Les fichiers chargé dynamiquement. En effet, r.js se base sur une analyse statique du code source (il n'est pas exécuté). Il n'a donc aucun moyen de deviner si un fichier est chargé dynamiquement durant le cycle de vie de l'application.

Cela peut-être laissé en l'état sciemment. En effet, si la taille des fichiers chargés dynamiquement est très importante, on préfèrera continuer de les charger dynamiquement. Sinon, on peut facilement forcer l'ajout de ces dépendances en [ajoutant une fonction](https://github.com/nfroidure/Memory/blob/3f5cb8e52ec84ff8e7567588a9180dfb098ba50c/www/javascript/Application.js#L3 "Voir le code concerné") faisant un appel à la fonction `require` contenant toutes les dépendances. Cette fonction n'est à aucun moment exécutée, mais ça, r.js ne le sait pas puisqu'il se base sur une analyse statique.

Nous voilà donc avec un fichier production.js contenant toutes nos dépendances. On pourrait penser que nous touchons au but. Mais pour un perfectionniste, ce n'est que le début ;).

## Supprimer RequireJS

r.js ne supprime pas la dépendance à RequireJS. Ainsi, pour que votre projet continue de fonctionner, vous devez absolument le conserver. Et ça, c'est pas cool ;). Pour éviter ce problème, il existe cependant une voie à emprunter. Les modules UMD. En effet, un module UMD peut être créé pour fonctionner avec RequireJS et dans le contexte global (c'est le cas du module [Commandor.js](https://github.com/nfroidure/Commandor/blob/master/src/Commandor.js "Voir le module en question") par exemple). Certains fonctionnent même avec Node, comme le module [Promise](https://github.com/nfroidure/Promise/blob/master/src/Promise.js "Voir le module Promise").

Ainsi, si l'on a utilisé les modules UMD et non seulement AMD, alors on peut retirer RequireJS et nos modules continueront de fonctionner. Le seul souci est qu'ils seront exécutés dans le contexte global ce qui n'est pas recommandé à cause des collisions qu'il peut y avoir entre les différents scripts tiers présents dans votre page.

L'idée est alors de modifier une dernière fois votre fichier JavaScript de production en l'englobant dans une focntion anonyme immédiatemment exécutée en lui fournissant un contexte vierge. Voici un extrait de mon script de mise en production ([build.sh](https://github.com/nfroidure/Memory/blob/f57c64ac9301aaf412f2969ddf9db96c5047cb5a/build.sh "Voir le script entier")) :

```sh
# Adding a simple closure
prodContent=$(cat javascript/production.js)
echo "(function() { $prodContent }).call({})" > javascript/production.js
```

Et voilà, tout est prêt, il ne nous reste plus qu'à supprimer la balise de RequireJS et ajouter une balise pour notre script de production, de préférence cette fois ci à la fin de notre document HTML. J'ai aussi automatisé ça grâce aux commentaires HTML :

```sh
# Comment RequireJS script tag
sed -i "s/DEV-->/DEV--/g" index.html

# Uncomment production script tag
sed -i "s/PROD--/PROD-->/g" index.html
```

Vos commentaires, avis, améliorations éventuelles sont les bienvenues ;).

Ajout de dernière minute : on m'a appris sur Twitter l'existence du [projet almond](https://github.com/jrburke/almond "Voir le dépôt du projet") (tjrs du même auteur), visant à réduire au maximum l'empreinte de RequireJS. Une bonne alternative à ma méthode si vous décidez de conserver le chargement asynchrone.
