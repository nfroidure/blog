---
title: "Gulp : Retour d'expérience"
description: Comme promis, Gulp revient à l'ordre du jour de ce Blog avec un retour d'expérience sur l'utilisation de Gulp et le développement de plugins.
leafname: retour_experience_gulp
link:
  label: Gulp
  title: En savoir plus sur l'utilisation de Gulp
date: "2014-01-26T08:01:26.000Z"
lang: fr
location: FR
keywords:
  - NodeJS
  - JavaScript
  - Gulp
categories:
  - NodeJS
  - JavaScript
  - Gulp
---

# Gulp : Retour d'expérience

---

⚠ Attention: Cet article est ancien et n'est conservé que pour des raisons historiques. Gulp n'est plus très utilisé de nos jours et je ne conseillerai pas de démarrer un projet avec maintenant.

---

Comme promis, Gulp revient à l'ordre du jour de ce Blog avec un retour d'expérience sur l'utilisation de Gulp et le développement de plugins.

Suite à la [comparaison entre Gulp et Grunt](gulp%5Fvs%5Fgrunt.html "Voir le billet de blog sur les différences entre GulpJS et GruntJS"), vous avez peut-être envie d'aller plus loin dans l'utilisation de Gulp. Dans ce billet, je reviendrais sur les fondamentaux de Gulp, les bonnes pratiques et aussi la création de plugins.

## Installation

Pour commencer à utiliser Gulp, deux petites actions doivent être réalisées. Premièrement, l'installation de Gulp de manière globale :

```sh
npm install -g gulp
```

Ceci nous permettra de démarrer Gulp, quelque soit le dossier dans lequel on se trouve. Ensuite, nous devons installer Gulp localement à chaque projet pour lequel on souhaite l'utiliser.

```sh
cd monprojet && npm install gulp --save-dev
```

Nous sommes prêts à commencer à créer nos tâches Gulp dans le fichier gulpfile.js qui est par convention, le fichier qui doit les contenir :

```sh
touch gulpfile.js && vim gulpfile.js
```

## Principe de Gulp

### Les tâches

Le principe de Gulp est très simple. Le fichier gulpfile.js contient la déclaration de tâches. Ces dernières sont déclarées de la manière suivante :

Cette tâche est nommée `clean` et équivaut à une commande `rm -rf` (d'où le nom du module). Une fois déclarée, notre tâche pourra être appelée à tout moment depuis la console grâce à la commande suivante :

```sh
gulp clean
```

Il est aussi possible de l'appeler directement dans une autre tâche avec la méthode `gulp.run` :

```sh
gulp.run('clean', function() { console.log('Terminé') };
```

Cependant, je ne vous conseille pas l'utilisation de cette méthode car elle est encore un peu boguée et [ne fonctionne pas comme on pourrait s'y attendre](https://github.com/robrich/orchestrator/issues/15 "Voir l'issue concernant ce souci").

En réalité, il est préférable d'utiliser les dépendances qui peuvent être déclarées au niveau de la déclaration d'une tâche comme [ici pour le gulpfile de ChtiJS](https://github.com/ChtiJS/chtijs.francejs.org/blob/baf3a4d690fa99a5b2e2be7143864f38adda9cef/gulpfile.js#L160 "Voir le gulpfile de ChtiJS").

### Les streams

Passons maintenant à la véritable particularité de Gulp. La plupart des tâches dont on a besoin pour un projet sont en réalité des tâches qui sont appliquées sur un ensemble de fichiers contenus dans une répertoire donné.

L'idée de Gulp est de créer un stream d'objets représentant chacun de ces fichiers (avec `gulp.src`) que l'on pourra modifier au travers de divers plugins. Ces plugins sont en fait des streams d'objets de type `Stream.Transform`.

Les plugins opèrent des modifications sur le contenu des fichiers et/ou sur leur propriétés (chemin, nom de fichier et/ou extension).

À l'autre bout de la chaîne, on peut utiliser `gulp.dest` pour sauvegarder les modifications effectuées. Un "pipeline" typique avec Gulp donne ceci :

Il est possible de subordonner un plugin à une condition particulière avec `gulp.env` et `gulp-if`. Ici, selon la valeur de `gulp.env.prod`, on minifie ou non les CSS et on utilise Livereload ou non.

Via la ligne de commande, il nous suffira d'ajouter le paramètre suivant pour que `gulp.env.prod` soit vrai :

```sh
gulp css --prod
```

### Contenu : Buffer ou streams ?

Il existe deux modes différents pour le contenu des fichiers. Le mode buffer comme son nom l'indique traite le contenu du fichier comme un unique buffer (c'est à dire, une zone contigüe de la mémoire virtuelle, ou encore, un objet contenu dans la zone Heap du processus).

En mode buffer, la plupart des transformations sur le contenu des fichiers sont réalisées de manière synchrone et on ne peut pas traiter des fichiers trop volumineux sans une dégradation très importante des performances.

Je ne suis personnellement pas fan du mode buffer, bien qu'il soit activé par défaut. À vrai dire, pour ma part, j'aurais préféré que les objets passés aux plugins soient en réalité directement des streams qui, par convention, auraient une propriété réservée aux méta-données (chemin, nom de fichier, répertoire courant etc.).

Ce qui nous amène au mode stream, celui que j'affectionne le plus. Le contenu des fichiers y est traité cette fois de manière plus fluide, par morceaux. L'avantage de ce mode est qu'il est entièrement asynchrone. Les données sont traitées au fur et à mesure des retours des appels système de lecture et d'écriture sur le disque.

Grâce à la nouvelle API des streams de Node (parfois appelée Streams2, dont je parlerais en détail dans un futur billet), les traitements sont ordonnancés selon la disponibilité des ressources (concept de backpressure). Ainsi, théoriquement, il n'y a aucune limite dans la taille des fichiers traités ou dans leur nombre.

Malheureusement, il y a une certaine incompréhension/difficulté avec l'utilisation des streams. Ainsi, peu de développeurs de plugins implémentent le support de ces derniers. De plus, l'utilisation de `event-stream` est conseillée malgré l'utilisation de l'évènement `data` qui dans la nouvelle version de Node n'est pas conseillée.

Le choix du mode buffer ou stream se fait au niveau de `gulp.src` ou tout autre plugin devant générer de nouveaux fichiers sans qu'il soit possible de détecter le mode courant. Pour utiliser les streams avec `gulp.src`, il suffit de passer en deuxième paramètre un objet d'options contenant une propriété `buffer` valant `false`.

### Quelques plugins utiles

Voici une petite liste de plugins qui vous seront bien utile :

- `gulp-if` : conditionner l'utilisation d'un plugin
- `gulp-rename` : Permet de renommer les fichier en tout point d'un pipeline de fichier
- `gulp-stream` : Permet de transformer en stream le contenu des fichiers en entrée. Pratique quand un plugin accepte les streams en entrée, mais retourne un buffer (ce qui est le cas de gulp-browserify, j'ai une [PR en attente](https://github.com/deepak1556/gulp-browserify/pull/10 "Voir la PR") à ce sujet).
- `gulp-streamify` : Un plugin que j'ai créé pour wrapper un plugin qui ne supporte pas les streams afin qu'il ne casse pas le pipeline et que le mode stream soit donc quand même utilisable.

## Créer un plug-in Gulp

Étant donné le faible nombre de plugins Gulp, il est fort probable que vous souhaitiez en créer un. Voici donc quelques conseils que je vais illustrer avec le code de `gulp-cat` et `gulp-svg2ttf`.

Tout d'abord, un plugin est un [module NPM qui exporte une fonction](https://github.com/ben-eb/gulp-cat/blob/6479a502f42f76e8378ce3bd5c2b2165990f2b8b/index.js#L7 "Voir la ligne concernée") qui [retourne](https://github.com/ben-eb/gulp-cat/blob/6479a502f42f76e8378ce3bd5c2b2165990f2b8b/index.js#L27 "Voir la ligne") un [stream d'objets](https://github.com/ben-eb/gulp-cat/blob/6479a502f42f76e8378ce3bd5c2b2165990f2b8b/index.js#L8 "Voir la ligne"). Idéalement, cette fonction [doit être nommée](https://github.com/nfroidure/gulp-svg2ttf/blob/bc06b3dd0a91f6442a64256105dfed37e9c9a327/src/index.js#L32 "Voir la ligne") pour faciliter le débogage.

Selon moi, il très important d'hériter des interface `Stream.*` de NodeJS plutôt que d'utiliser des modules comme `event-stream` ou `event-map`. C'est certes, un peu plus verbeux, mais ces interfaces ont été pensées pour conserver les bénéfices de l'usage des streams. La plupart du temps, vous utiliserez une instance de l'interface `Stream.Transform` qui doit être augmentée d'une [méthode \_transform](https://github.com/nfroidure/gulp-svg2ttf/blob/bc06b3dd0a91f6442a64256105dfed37e9c9a327/src/index.js#L40 "Voir la ligne") qui comme son nom l'indique gère la transformation du contenu du stream (ici, les fichiers) et d'une méthode `_flush`, optionnelle, dans le cas où vous souhaiteriez faire une action particulière à la fin du flux d'objets.

Au sein de la méthode de transformation des fichiers, dans la plupart des cas, les fichier dont le contenu est nul [seront ignorés](https://github.com/nfroidure/gulp-svg2ttf/blob/bc06b3dd0a91f6442a64256105dfed37e9c9a327/src/index.js#L42 "Voir la ligne"). Puis, selon que le contenu du fichier est [un buffer](https://github.com/nfroidure/gulp-svg2ttf/blob/bc06b3dd0a91f6442a64256105dfed37e9c9a327/src/index.js#L60 "Voir la ligne") ou [un stream](https://github.com/nfroidure/gulp-svg2ttf/blob/bc06b3dd0a91f6442a64256105dfed37e9c9a327/src/index.js#L68 "Voir la ligne"), on [modifiera le buffer](https://github.com/nfroidure/gulp-svg2ttf/blob/bc06b3dd0a91f6442a64256105dfed37e9c9a327/src/index.js#L62 "Voir la ligne") ou, on [pipera le stream dans un nouveau stream de transformation](https://github.com/nfroidure/gulp-svg2ttf/blob/bc06b3dd0a91f6442a64256105dfed37e9c9a327/src/index.js#L70 "Voir la ligne").

Si l'on souhaite uniquement lire les données, pour le buffer, il suffit d'accéder à la [propriété contents](https://github.com/ben-eb/gulp-cat/blob/6479a502f42f76e8378ce3bd5c2b2165990f2b8b/index.js#L18 "Voir la ligne") pour en lire le contenu. Pour un stream, il faudra [le dédoubler](https://github.com/ben-eb/gulp-cat/blob/6479a502f42f76e8378ce3bd5c2b2165990f2b8b/index.js#L20 "Voir la ligne") via une instance de `Stream.PassThrough` afin de garantir aux autre plugins un accès à toute les données du stream.

Enfin, une fois le buffer transformé ou le stream du contenu du fichier "pipé", on [passe l'objet représentant le fichier](https://github.com/ben-eb/gulp-cat/blob/6479a502f42f76e8378ce3bd5c2b2165990f2b8b/index.js#L24 "Voir la ligne") au plugin suivant et on [appelle le callback](https://github.com/ben-eb/gulp-cat/blob/6479a502f42f76e8378ce3bd5c2b2165990f2b8b/index.js#L25 "Voir la ligne") reçu en argument de la méthode `_transform`.

Si durant ce processus, vous ne traitez que les fichiers d'un genre particulier, il peut-être utile de [tester l'extension du fichier](https://github.com/nfroidure/gulp-svg2ttf/blob/bc06b3dd0a91f6442a64256105dfed37e9c9a327/src/index.js#L48 "Voir la ligne") et de passer directement au plugin suivant tout fichier ne correspondant pas aux critères souhaités.

De la même façon, une option permettant de [cloner les fichiers](https://github.com/nfroidure/gulp-svg2ttf/blob/bc06b3dd0a91f6442a64256105dfed37e9c9a327/src/index.js#L53 "Voir la ligne") avant de les transformer peut être très utile pour [faciliter l'usage d'un plugin](https://github.com/nfroidure/gulp-iconfont/commit/58f0f61c1a829eb316759b5bf26a3423e8795404 "Voir un commit illustrant cette facilité d'usage").

Bien-sûr, si une transformation d'un fichier, implique le changement de type de ce dernier, il est de votre responsabilité de [changer l'extension de ce dernier](https://github.com/nfroidure/gulp-svg2ttf/blob/bc06b3dd0a91f6442a64256105dfed37e9c9a327/src/index.js#L57 "Voir la ligne").

Enfin, toute erreur doit être signalée par l'[émission d'un évènement](https://github.com/nfroidure/gulp-svg2ttf/blob/bc06b3dd0a91f6442a64256105dfed37e9c9a327/src/index.js#L64 "Voir la ligne").

### Supportez les streams !

Bien-sûr, créer une API streamable n'est pas la solution de facilité. Mais je vous encourage grandement à le faire. Qui peut le plus, peut le moins. J'ai bien écris trois fois cette maxime sur ce blog, mais en la matière mieux vaut trop que pas assez.

Si vous pensez que votre API ne peut pas utiliser les streams, je vous enjoint à regarder le code de Browserify. Si ils ont réussi à tirer parti des streams pour un module aussi complexe, il y a fort à parier que votre format XML peut le faire également.

Si cependant, vous n'avez pas la main sur la bibliothèque wrappée par votre plugin, utilisez [BufferStreams](https://npmjs.org/package/bufferstreams "Voir le module") en attendant et créer une issue, ou mieux, faîtes une PR !

Voilà, c'est tout pour aujourd'hui ! Vos retours ou questions sont les bienvenues :).
