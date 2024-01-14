---
title: "Injection de dépendances avec NodeJS "
description: Présentation donnée lors du ChtiJS 21 à propos de l'injection de dépendances en JavaScript.
leafname: injection_de_dependance_nodejs
link:
  label: Injection de dépendances
  title: En savoir plus sur ma présentation
  url: https://slides.com/nfroidure/javascript_dependency_injection
date: "2019-02-02T07:00:00.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - NodeJS
  - Injection de dépendances
categories:
  - JavaScript
  - NodeJS
  - Injection de dépendances
---

# Injection de dépendances sans gorille

![Knifecycle logo](https://raw.githubusercontent.com/nfroidure/knifecycle/main/knifecycle.svg)

[Vidéo de la présentation](https://www.youtube.com/watch?v=qTtwn1J9IXk "📺")

Retranscription de ma présentation au dernier ChtiJS sur l'injection de dépendances avec NodeJS mais plus généralement en JavaScript !

[Slides](https://slides.com/nfroidure/javascript_dependency_injection "🎚 Voir les diapositives de la présentation")

Aujourd'hui, je vais vous parlais d'injection de dépendances en JavaScript. J'ai fait les slides en anglais car je vais les mettre sur mon blog après mais n'hésitez pas à me demander de traduire si vous en ressentez le besoin.

J'ai précisé unobtrusive car l'objectif est que cette dernière n'interfère pas avec votre code. L'idée c'est d'avoir un minimum de code qui qui gère ça puisque finalement vous allez voir que ce n'est pas nécessaire.

## A propos de moi

Faisons d'abord les présentations, je travaille pour Sencrop, vous l'avez vu tout à l'heure. Je fais du logiciel pour les startups depuis que JavaScript est un sujet brûlant. Et une fois j'ai fait un code qui a failli compiler avec Rust. Vous pouvez me retrouver sur mon blog ou via Twitter.

## Sencrop recrute

Vous avez peut-être entendu parler de la levée de fond récente de Sencrop. Du coup, on va pouvoir augmenter nos ambitions et pour ce faire on recrute des développeurs back-end, front-end (mais si vous êtes full-stack c'est bien aussi, des data scientists et des ingénieurs pour le développement embarqué car on a une problématique hardware également.

## Définition

Qui connaît l'injection de dépendances ? Une bonne partie de la salle lève la main. Qui l'utilise au quotidien ? Quelques mains se lèvent. Une personne: "C'est un peu la même chose que Spring Boot en Java ?" Alors, oui, c'est design pattern donc tu l'implémentes comme tu veux, tu peux l'implémenter en POO ou pas.

L'idée, en gros, de l'injection de dépendance, c'est que votre code a besoin de faire appel à des états externes, donc typiquement ça va être les IOs (lire un fichier, enregistrer dans une base de données, faire un appel à un service REST, peu importe...).On va donc chercher à exprimer ces dépendances de manière déclarative pour que le code métier ne soit pas impacté par toute la tuyauterie.

Finalement, on cherche que l'implémentation soit complètement découplée des dépendances et de leur initialisation.

### En JavaScript

Donc, en JS, qu'est ce que ça peut donner ? En fait c'est très simple, si vous êtes un fan de la POO, vous avez une classe et cette classe finalement vous allez lui injecter les services dont elle a besoin de manière à ce qu'en son sein, vous puissiez utiliser ces services sans vous soucier de leurs initialisation.

Avec les fonctions, c'est un peu plus simple, vous allez utiliser le passage d'arguments à vos fonctions et vous allez utiliser, tout bêtement, les services que vous avez passé en argument de vos fonctions.

C'est assez simple, en fait, c'est un mot compliqué pour nommer quelque chose de très simple.

### Cycle de vie d'une application

Pourquoi c'est utile ? (Toute la salle penche la tête pour lire les annotations du schéma projeté). Oui, je vous vois tourner la tête, mais j'avais pas de place pour mettre les écriteaux horizontalement.

Je vous mets au défi de trouver une application qui n'a pas une phase de démarrage et une phase d'arrêt, à part le front-end, encore que, parfois, vous pouvez vouloir qu'il y ait des comportements au sortir de la page qui soient déclenchés.

Du coup c'est un truc qui est super récurrent et c'est ce que l'injection dépendance adresse. C'est donc très commun de l'utiliser.

### Les phases de l'injection de dépendances

Alors, à quoi ça ressemble finalement. Vous avez toutes vos dépendances (la flèche, ici, elle veut dire "dépend de", donc ce rond là dépend de cet autre là). Chaque nœud est donc un service et les feuilles c'est le code métier, celui qui exploite vos services.

Les dépenses de votre application, c'est un graphe orienté et l'idée, en fait, c'est finalement qu'on peut les initialiser d'une manière optimale. C'est pas compliqué, vous commencez par instancier les services qui n'ont pas de dépendance, puis les services qui dépendent des services que vous avez initialisés à la première itération lors de la seconde itération et à la troisième itération les services qui vous n'avez pu créer à la seconde, etc jusqu'à ce que toute votre application soit initialisée.

Pour l'extinction, c'est pareil sauf que là vos services, ils sont tous up et vous allez les stopper de manière inversée afin que tous les services soient proprement arrêtés. C'est le "graceful shutdown" pour ceux qui ne connaissent pas. C'est un problématique plutôt back-end mais pourquoi pas en front.

### Opinion

L'opinion que j'ai essayer de développer ce soir est que c'est le seul design pattern que vous ne regretterez jamais d'avoir implémenter. Pourquoi ? Parce que comme je l'ai annoncé tout à l'heure, c'est récurrent, c'est à dire que ça adresse un problème qui existe dans toutes les applications et donc c'est dommage de ne pas l'utiliser surtout quand on le connaît.

La deuxième opinion que je vais essayer de développer est que si vous utilisez de la programmation orientée objet ne blâmez pas l'injection de dépendances parce que c'est pas de sa faute si vous avez l'impression que c'est n'importe quoi, mais celle de la POO.

## Pourquoi ?

Au delà du fait que c'est un pattern récurrent et que ça adresse un problème qui est commun (n'hésitez pas à proposer lors des questions des applications qui n'auraient pas besoin de l'injection de dépendances).

### Testable

Parce que ça rend votre code testable, tout simplement. C'est beaucoup plus facile de le tester du code qui utilise l'injection de dépendances.

Je ne sais pas qui utilise mockery, pour mocker des modules, mais enfin c'est un peu l'horreur.

### Configurable

C'est aussi configurable car comme vous mettez les dépendances en paramètre, finalement, vous mettez ce que vous voulez en paramètre, il suffit que vous respectiez l'interface de vos services pour pouvoir les réutiliser avec d'autres services qui seraient conceptuellement la même chose.

### Manageable

J'ai mis ça parce que on en parlait tout à l'heure mais en fait le développement principalement c'est de la charge mentale, de la charge mentale a accumuler. Il faut être capable d'avoir en tête tous les effets de bords possibles que le code vous êtes en train d'écrire peut générer et le fait de raisonner justement de manière isolée, ça aide à comprendre plus de code puisqu'on a moins de charge mentale.

### Ré-utilisable

Car, de ce fait, vous pouvez facilement réutiliser des morceaux de code. C'est plus que la modularisation du code, c'est aussi, réutiliser l'initialisation et l'arrêt de vos services dans toutes vos applications.

### Optimal

Optimal parce que, en fait, le code que vous auriez écrit pour initialiser vos services et pour les dés-initialiser que vous auriez fait à la mano, ici vous avez la garantie que c'est optimal car vous utilisez une librairie qui adresse vraiment ce problème et qui essaie de le résoudre de manière optimale donc, a priori, vous avez le meilleur code qui soit pour pouvoir utiliser vos dépenses.

### Instrumentable

Instrumentable, parce que, du coup ça fait que votre code devient plus un ensemble sur lequel vous pouvez raisonner plutôt que juste du code impératif qui ferait les choses séquentiellement. Mais on va voir cela plus en détail tout à l'heure.

## Inconvénients

Alors, est ce qu'il ya des inconvénients ? Oui il y en a.

### Débogage

l'inconvénient c'est le débogage parce qu'effectivement l'initialisation des services, si jamais ça marche pas, va falloir mettre les mains dans le cambouis. C'est plus simple de déboguer du code qu'on voit que du code qui fonctionne de manière magique, entre guillemets.

### Typage statique

Le typage statique, forcément, comme tous les services sont initialisés de manière dynamique, on perd un peu de l' avantage de la vérification du code typé par le compilateur.

## Démonstration

J'ai créé une petite application, plutôt, un outil en ligne de commande qui ne fait pas grand chose. Il y a trois ou quatre commandes. Une commande qui montre le temps Unix, une qui envoies un fichier dans un serveur FTP (on voit ici un service docker que j'ai lancé), il y a une commande qui insère des données dans une base de données et, normalement, il y a une commande qui les affiches.

Voilà c'est vraiment tout simple. Je l'ai fait en TypeScript car je voulais montrer quelque chose qui ne fonctionne que TypeScript mais ça peut fonctionner en JS normal.

Donc, qu'est ce qui se passe ? Par exemple, ici, j'ai ma commande qui insère des des lignes dans la base de données. Alors j'initialise, je fais ça bêtement, j'initialise la base de données, le serveur FTP (le serveur FTP, au début je voulais aller chercher le fichier sur le serveur FTP mais j'ai pas eu le temps, donc je l'initialise pour rien, je crois). J'initialise aussi le système de journalisation et j'initialise le petit service qui va chercher les arguments.

Enfin, j'ai le code qui, finalement, est tout simple, j'ai même directement supprimé la base de données à chaque fois que j'insère des lignes parce que c'est vraiment que pour l'exemple. Ici, je prends chaque fichier que j'ai passé en argument et je lis leur contenu. Il y a un petit parseur CSV des familles et puis, ici, je mets chaque ligne une par une dans la base. J'ai pas pris le temps de séparer en sous-fonctions proprement mais j'espère que vous ne m'en tiendrez pas rigueur.

### Les problèmes

Du coup, les problèmes qui sont posés de part par le fait de procéder comme ça : on peut pas utiliser le serveur FTP et la base de données plusieurs fois parce que, tout simplement, la base de données, quand elle s'initialise (j'ai vraiment pas utilisé l'injection de dépendances), en fait, ce qui se passe c'est qu'elle va aller chercher sa configuration et que la configuration, finalement, elle est fixée en dur.

C'est à dire qu'elle va automatiquement aller chercher la configuration qui a été demandée ici dans ma configuration et, du coup, si j'ai besoin d'accéder à deux bases de données différentes, je peux pas. Si je veux pouvoir instancier deux fois le service base de donnée avec deux serveurs différents, je suis bloqué.

Pareil pour les tests, mais on en a déjà parlé. Ce serait super chiant de tester ce code, il faudra utiliser mockery et tout ré-implémenter from scratch mais avec des stubs. On peut pas remplacer le FTP par S3 facilement et, en plus, c'est un choix binaire. C'est à dire que si demain je veux remplacer FTP par S3 seulement dans un environnement, je ne peux pas, je suis obligé d'utiliser S3 dans tous les environnements.

Si jamais j'ai un service qui demande un refacto ou si je change l'ordre d'initialisation des services, il va falloir que change le code un petit peu partout dans l'application. En fait, c'est assez compliqué d'agir sur une telle base de code.

### Knifecycle

Du coup, je vais vous présenter un petit module j'ai réalisé et dont je me sers souvent. Je sais, ça fait genre, la personne qui vient présenter son module mais ça m'aurait embêté d'illustrer l'injection de dépendance avec un autre module ;). Le module que j'utilise c'est Knifecycle.

Alors qu'est-ce que ca veut dire "l'injection dépendance avec la banane mais sans le gorille et sans la jungle" ? Je sais pas si vous connaissez la citation mais en gros, le petit lol sur la POO est que quand vous voulez une banane vous êtes obligé de prendre le gorille et la jungle avec la la banane. Vous n'avez pas trop le choix.

Donc là l'idée c'est justement de ne pas ouvrir la boîte de pandore avec la POO à l inverse de ce qui se fait en fait beaucoup dans la plupart des frameworks qui utilisent l'injection de dépendances.

### Refactoring

Donc du coup je vais faire un petit refacto. Il va être très simple. Je vais reprendre chacun des services un par un et je vais les déclarer comme étant des initializer avec Knifecycle.

En fait, c'est relativement simple pour déclarer un initializer, j'ai juste à faire appel aux fonctions utilitaires prévues à cet effet. Par exemple, le service args est est un simple service qui expose les arguments fournis en ligne de commande donc j'utilise la function service pour la déclarer. Je lui donne un nom et c'est tout car il n'a pas de dépendances. On fera peut-être du débogage, j'espère que non, mais c'est le risque.

La configuration, c'est pareil, c'est un service qui va juste charger la configuration dans un fichier en fonction de l'environnement donc j'utilise aussi la fonction service. D'ailleurs, ici, je vais utiliser une petite astuce, la fonction `autoName` qui va induire le nom du service du nom de la fonction. Quelqu'un dans la salle: C'est un peu magique ! Oui, il y a une partie de magie effectivement.

Ici pour la base de données, pareil, c'est un service. Ou plutôt, un provider, car non seulement, il fourni le service, mais il gère aussi le shutdown du service. C'est le seul moment où ça devient intrusif dans le code mais en même temps ça apporte une fonctionnalité (un problème de type avec TypeScript est arrivé durant le refactoring live, le fix a été publié ensuite sur GitHub). Je vais renoncer, vous aurez pas la démo avec provider sinon, ça va me prendre trop de temps

Pour le ftp, c'est pareil, c'est un service. Knifecycle propose tout un tas de fonctions utilitaires, mais ici, je vais réutiliser la fonction `service`. D'ailleurs, je suis en train de faire l'impasse sur l'injection de dépendance, mais je vais y revenir après.

Ici, de même, pour le logger, c'est un service, tout comme le timer. Vous avez pu voir que j'ai mis des interfaces, ce n'est pas innocent, c'est parce que je vais en avoir besoin après et puis je voulais pas que ça prenne trop de temps. Du coup, maintenant tous mes services sont bien configurés. Passons aux dépendances.

Le serveur FTP dépend de la configuration donc là ce que je vais faire c'est que je vais injecter la configuration dedans et je vais lui rajouter un type. Pourquoi je précise le type ? Parce que, justement, c'est là l'inconvénient dont je parlais tout à l'heure. Le compilateur, ici, n'a aucune idée de ce que je vais mettre là-dedans. On est obligés de déclarer une interface, c'est un inconvénient sans vraiment l'être car finalement le fait que je lui dise, la config que je vais te passer va être de ce type là, permet d'avoir une couche d'abstraction. C'est cette couche là, aussi, qui fait que je vais pouvoir avoir des interfaces identique pour des services différents et c'est aussi cette couche là qui va nous permettre de raisonner d'une manière un petit peu plus intelligente que de juste dire, je veux récupérer une librairie.

Par exemple, si comme nous vous utilisez S3, nous, en fait, on ne l'utilise pas directement, on a un service de stockage avec des méthodes get et put et on peut le substituer et par n'importe quoi. Demain, on décide de plus passer par S3 mais le service concurrent développé par OVH, on peut. Simplement car on a raisonné en terme de briques fonctionnelles et non en terme de technologies.

Même opération pour le service de DB. Normalement ça devrait vous rappeler un truc, pour ceux qui ont fait du AngularJS. C'est vraiment du copier/collé pour le coup, j'ai vraiment copié son usage.

Maintenant je vais regarder dans mes commandes, du coup, ça va être le même délire. Mais Je vais utiliser la fonction `autoService` qui infère le nom du service et de ses dépendances automatiquement.

Une personne dans la salle: Comment tu détecte ces valeurs ?

Sur la signature, en fait, tout simplement, ça fait un `toString` sur la fonction avec une petite expression régulière qui récupère les bons arguments c'est ce que faisait AngularJS à l'époque, j'ai vraiment pas innové.

Voir toutes les modifications sur le [dépot GitHub](https://github.com/nfroidure/di-test).

## Aller plus loin

### Le chargement automatique

Comme on l'a vu dans la démo, il est possible de charger automatiquement les dépendances pour un peu plus de magie, je ne vais pas revenir dessus.

### Génération de graphes

On peut générer des graphes, ici par exemple, c'est mon petit module jsarch que j'utilise pour documenter l'architecture directement dans mes fichiers JS. Pour le créer, j'ai utilisé Knifecycle est grâce à cela, j'ai pu générer un graphe qui résume sa structure.

### Le build statique

Knifecycle propose aussi de créer un build statique. Cela évite d'embarquer la librairie dans vos projets, il suffit de générer un fichier qui crée pour vous, statiquement, le fichier JS qui va bien pour initialiser vos services.

Chez nous, on utilise cela pour builder nos lambdas fonctions chez AWS. Cela permet d'avoir un build léger car on embarque que ce dont on a besoin. Clairement il faut mettre les mains dans le cambouis mais c'était pour montrer que c'est possible.

### Créer des serveurs HTTP

Nous on utilise Knifecycle principalement pour le back-end. Je vous laisse jeter un œil à Whook, le module que nous utilisons conjointement à Knifecycle.

### Services commun

Voici une petite liste de services qu'on a open-sourcé et qui peuvent être utilisés clé en main avec Knifecycle.

### Créé avec Knifecycle

Voici une petite liste de projets qui utilisent Knifecycle.

## Questions

Voilà, si vous avez des questions :).
