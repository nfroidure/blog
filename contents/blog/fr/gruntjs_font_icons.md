---
title: Générer des fontes d'icônes avec GruntJS
description: Cette semaine, je me suis penché sur la génération de fontes automatiquement avec GruntJS. Compte rendu de mes découvertes et des développements qui les ont suivies.
leafname: gruntjs_font_icons
link:
  label: "GruntJS : Génération de fontes"
  title: En savoir plus sur la génération de fontes avec GruntJS
date: "2013-11-09T14:25:29.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - NodeJS
  - Grunt
  - Fontes d'icônes
categories:
  - JavaScript
---

# Générer des fontes d'icônes avec GruntJS

---

⚠ Attention: Cet article est ancien et n'est conservé que pour des raisons historiques. Les fontes d'icônes ne sont plus utilisées et les fichiers SVG sont directement intégré dans les sites web. Vous avez été nombreux à utiliser mes plugins et ce fût une belle aventure, cependant, il faut vivre avec son temps ;).

---

Cette semaine, je me suis penché sur la génération de fontes automatiquement avec GruntJS. Compte rendu de mes découvertes et des développements qui les ont suivies.

Il existe de nombreux sites web qui permettent de générer des fontes personnalisées à partir de sets d'icônes prédéfinis ou directement à partir d'icônes uploadées en SVG ([Fontello](http://fontello.com/ "Voir le site de ce générateur d'icône"), [Icomoon](http://icomoon.io/ "Voir cet autre site de génération d'icône") ...). Malheureusement, ces derniers ne facilitent pas la maintenance de votre site car à chaque ajout d'icônes, vous êtes contraint de vous reconnecter sur leur site et de renvoyer toutes vos icônes. De plus, les numéros de caractères Unicode utilisés changent d'une génération de fonte à l'autre. Bref, j'ai décider de me tourner vers GruntJS pour automatiser ces tâches.

## Présentation de GruntJS

GruntJS est un outil d'automatisation de tâches basé sur NodeJS et son gestionnaire de modules NPM. J'ai tout d'abord été un peu sceptique puisque j'utilise d'ordinaire le Shell pour automatiser les actions répétitives. Mais face à l'enthousiasme de l'écosystème JS et grâce à la présentation d'[0gust1](https://github.com/0gust1 "Voir son profil GitHub") au dernier ChtiJS, j'ai décidé de m'y pencher avec pour point d'entrée la génération des fontes.

Finalement, l'atout de GruntJS n'est pas vraiment dans la façon d'automatiser les tâches proposées, mais plutôt dans son intégration avec NodeJS et NPM. En effet, ce que l'on peut faire avec Grunt, on peut bien le faire avec le Shell, mais généralement on ne le fait pas.

Simplement parce qu'avec GruntJS c'est facile d'automatiser ses tâches à partir du moment où l'on utilise déjà NodeJS au quotidien. C'est d'autant plus facile qu'un grand nombre de tâches Grunt existent déjà pour toute sorte de besoin. Bref, si ce n'est pas déjà fait, je vous conseille d'installer Grunt ;).

### Installation

Installer GruntJS est très simple, il suffit d'installer ce dernier via NPM et de manière globale obligatoirement (sinon, cela n'a pas grand intérêt) :

```sh
npm install grunt-cli
```

### Mise en place de Grunt pour un projet

Tout projet, et en particulier, tout projet basé sur NodeJS devrait utiliser Grunt pour automatiser les tâches répétitives auxquelles nous sommes régulièrement confrontés que ce soit au niveau du back-end que du front-end.

Dans le cas d'un projet NodeJS, il suffit de créer un fichier Gruntfile.js à la racine du projet qui contiendra toutes les tâches dont vous pourriez avoir besoin. Nous y reviendrons par la suite. Vous devrez aussi ajouter Grunt aux dépendances de développement de votre projet NodeJS.

### Recherche de plugins

Une fois votre projet enrichi d'un fichier de manifeste GruntJS, il va falloir trouver les plugins existants qui vous permettront d'automatiser vos tâches répétitives. Par exemple, pour trouver des plugins de gestion des fontes, j'ai tapé la commande suivante :

```sh
npm search "gruntplugin font"
```

Une fois que vous avez trouvé des tâches qui vous seront utiles, il vous suffit de les installer comme suit :

```sh
npm install grunt-svgicons2svgfont grunt-svg2ttf grunt-ttf2eot grunt-ttf2woff
```

Cette commande permet, par exemple, d'installer toutes les tâches nécessaires pour créer des fontes custom.

## Génération de fontes

Suite à ce petit intermède, revenons au sujet principal de cette article. Lors de mes recherches, j'ai trouvé trois systèmes de génération de fontes. L'un d'entre eux reposait sur des services web tiers pour générer les fontes, je l'ai donc écarté de facto. Un autre, bien que fonctionnel, se basait sur FontForge et ne proposait pas de garder les mêmes codes de caractères à chaque génération de fonte (une limitation due à Font Forge me semble-t-il.

Le dernier, grunt-fontfactory était uniquement basé sur des modules NodeJS, mais était bogué (les icônes étaient affiché à l'envers). Par contre, bien que la conservation des codes de caractères unicode n'était pas implémentée, à la lecture du code, il semblait possible de le faire. J'ai donc retroussé mes manches et [proposé des modifications](https://github.com/cameronhunter/grunt-fontfactory/pull/2 "Voir le pull request en question"). Malheureusement, le développeur n'est pas très réactif, j'ai donc décidé de créer ma propre librairie de génération de fontes, plus souple.

### svgicons2svgfont

`svgicons2svgfonts` permet de parcourir des icônes SVG et de les inclure dans une fonte SVG. Pour créer cette librairie, j'ai dû créer une librairie de plus bas niveau permettant de manipuler le contenu des chemins SVG (attribut`d` des balises `path` de SVG), je l'ai nommée [SVGPathData](https://github.com/nfroidure/SVGPathData "Voir le dépôt du projet SVGPathData").

Puis, comme les outils de conversion de fontes sont assez rudimentaires, j'ai dû écrire du code qui convertisse chaque forme SVG (balises`circle`, `rect`, `polygon` etc.) en chemins SVG. Il reste encore un peu de travail pour prendre en compte tous les cas possibles, mais la plupart des icônes SVG sont dors et déjà supportées. Je vous encourage d'ailleurs à[me signaler tout problème rencontré](https://github.com/nfroidure/svgicons2svgfont/issues "Signaler un problème avec une icône donnée").

La fonctionnalité la plus importante à mes yeux a bien-sûr été implémentée. Il suffit de préfixer les fichiers SVG des icônes avec le code du caractère souhaité pour que ce dernier conserve toujours le même code pour toutes les générations de fontes ultérieures.

### Retour à nos tâches Grunt

J'ai donc créé le plug-in [grunt-svgicons2svgfont](https://github.com/nfroidure/grunt-svgicons2svgfont "Voir le dépôt de ce projet") et les plug-ins de transformation basés sur les librairies NodeJS de Fontello pour obtenir les fontes dans tous les formats nécessaires au bon fonctionnement de nos icônes sur tous les navigateurs ([grunt-svg2ttf](https://github.com/nfroidure/grunt-svg2ttf "Voir le dépôt du projet grunt-ttf2eot"), [grunt-ttf2eot](https://github.com/nfroidure/grunt-ttf2eot "Voir le dépôt de grunt-ttf2eot"), [grunt-ttf2woff](https://github.com/nfroidure/grunt-ttf2woff "Voir le dépôt de grunt-ttf2woff")).

Il ne nous reste plus qu'à générer nos fontes grâce au fichier manifeste GruntJS suivant que j'ai commenté pour le rendre plus explicite :

```js
// From the Gist: https://gist.github.com/nfroidure/7385942

module.exports = function (grunt) {
  // Chargement des modules Grunt nécessaires
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-svgicons2svgfont");
  grunt.loadNpmTasks("grunt-svg2ttf");
  grunt.loadNpmTasks("grunt-ttf2eot");
  grunt.loadNpmTasks("grunt-ttf2woff");

  grunt.initConfig({
    // Tâche de conversion des icônes en fonts
    svgicons2svgfont: {
      icons: {
        options: {
          // Nom de la fonte
          font: "iconsfont",
          // ajout automatique de codage unicode libres
          // aux noms de fichier des icônes
          appendCodepoints: true,
        },
        // Source des icônes
        src: "documents/icons/*.svg",
        // Destination de la fonte
        dest: "public/fonts",
      },
    },

    // Génération de la fonte TTF
    svg2ttf: {
      icons: {
        src: "public/fonts/*.svg",
        dest: "public/fonts",
      },
    },

    // Génération de la fonte EOT
    ttf2eot: {
      icons: {
        src: "public/fonts/*.ttf",
        dest: "public/fonts",
      },
    },

    // Génération de la fonte WOFF
    ttf2woff: {
      icons: {
        src: "public/fonts/*.ttf",
        dest: "public/fonts",
      },
    },

    // Tâche de surveillance de nouveaux icônes
    // si un icône change on régénère tout
    watch: {
      icons: {
        files: ["documents/icons/*.svg"],
        tasks: ["icons2fonts"],
      },
    },
  });

  // Creation de la tâche icons2fonts qui réuni
  // tout le processus de génération de fonte
  grunt.registerTask("icons2fonts", [
    "svgicons2svgfont:icons",
    "svg2ttf:icons",
    "ttf2eot:icons",
    "ttf2woff:icons",
  ]);

  // Pour le développement on génère les icône une fois
  // et on surveille tout changement des icônes
  grunt.registerTask("dev", ["icons2fonts", "watch"]);

  // Pour la mise en prod on génère les fontes
  grunt.registerTask("dist", ["icons2fonts"]);

  // la tâche par défaut est le développement
  grunt.registerTask("default", ["dev"]);
};
```

Bref, nous avons une tâche Grunt qui régénère nos fontes de manière prédictible à chaque changement, ajout ou suppression d'icône dans le dossier de notre choix. Libre à vous d'adapter cette tâche comme bon vous semble à votre workflow, en espérant que ces plugins vous seront autant utiles qu'à moi ;).

Ajout du 7 décembre 2013 : Finalement je suis allé encore plus loin en créant un [générateur de fontes Front-End](http://nfroidure.github.io/svgiconfont/ "Voir cette application") qui servira à illustrer le partage de code entre le serveur et le navigateur en JavaScript avec NodeJS et Browserify au prochain ChtiJS qui aura lieu le 19 décembre.
