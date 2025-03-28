---
title: L'enseignement dirigé par les tests
description: Les tests unitaires et fonctionnels ont véritablement révolutionné le développement professionnel, pourquoi pas également celui de l'enseignement et de la formation ?
leafname: enseignement_dirige_par_tests
link:
  label: Apprendre en testant
  title: En savoir plus sur cette conception de l'apprentissage de la programmation
date: "2013-09-04T09:22:53.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - Tests
  - Enseignement
categories:
  - JavaScript
---

# L'enseignement dirigé par les tests

Les tests unitaires et fonctionnels ont véritablement révolutionné le développement professionnel, pourquoi pas également celui de l'enseignement et de la formation ?

Remi Grumeau, un développeur lillois, m'a récemment sollicité sur l'idée d'un DevCamp spécial mobile dont le but serait de créer et publier sur GitHub des modules open-source. J'ai aussi été sollicité pour être jury aux [OpenDuWeb](http://www.open-du-web.fr/ "Voir le site de ce concours"). À première vue, rien à voir avec le titre de ce post.

Je me suis donc mis à imaginer comment de tels évènements devraient être organisés et j'ai donc pensé aux exigences que nous devrions avoir sur la qualité des modules ainsi créés de manière à pouvoir rendre ces derniers utiles.

J'ai donc pensé qu'il serait intéressant de faire un travail en amont afin de déterminer quels modules il manque dans le paysage open-source voire consulter la communauté JavaScript.

J'ai donc commencé ma petite liste ; module UMD, philosophie Unix (faire une chose mais la faire bien), tests unitaires ou fonctionnels. Problème : faire cela en deux jours, ça m'a paru un peu compliqué surtout que la plupart des gens qui viennent dans un DevCamp veulent avant tout apprendre.

## Paver la voie vers l'apprentissage de la programmation

Rapidement, je me suis dit, que l'idéal serait de mettre à profit les techniques de développement dirigées par les tests. Au lieu de rédiger des spécifications, autant créer directement les tests qui permettent de vérifier le résultat qu'on attend.

Du coup, le processus devient : on crée un projet GitHub avec un README documentant l'API souhaitée et le workflow, on crée des stubs pour chaque fonction et les tests unitaires sensés checker le bon fonctionnement de l'API. Le but du concours ou DevCamp étant de développer le module correspondant aux tests fournis.

Lors de l'évènement, si certains mauvais tests sont détectés, on alloue un point au développeur qui a relevé le problème via la soumission d'une issue, on crée un pull request et on informe tous les participants de la mise à jour des tests. Si le développeur révèle l'issue et envoi un pull request associé et valide, on lui attribue deux points.

Le premier qui passe tous les tests se voit allouer un certain nombre de points. Idem pour les suivants mais de manière dégressive. Pour vérifier le fonctionnement du module, pas la peine d'utiliser ses mimines, il suffit d'intégrer Travis au projet GitHub (j'en ai parlé dans [mon post précédent sur les tests front](tester%5Fjavascript%5Ffrontend.html "Voir le billet en question")) et les PR seront automatiquement testés.

Le processus de détermination du vainqueur ne peut être contesté puisque transparent, les développeurs sont mis à l'épreuve dans un contexte professionnel et pas seulement dans le contexte d'un hackathon où chacun fait sa popote dans son coin.

Quand le temps imparti est terminé, on fait un JSPerf avec les versions de chacun et on attribue des points à ceux qui font les meilleures performances. Le calcul du résultat peut d'ailleurs être automatisé par la même occasion.

Je pense que dans ce cadre, les concours du genre, le [meilleur développeur de France](http://lemeilleurdevdefrance.com/ "Voir le site de cet autre concours") ou les Open du Web pourraient se faire sans forcément se déplacer, avec une véritable légitimité et une utilité avérée.

## Joindre l'utile à l'agréable

En effet, c'est une question que je me suis toujours posé, particulièrement au niveau de l'enseignement. Pourquoi les travaux qui sont demandés aux élèves ne sont pas (toujours) utiles, publiés et utilisables ?

Je ne pense pas que ça soit un problèmes de compétence des enseignants ou des élèves. C'est avant tout un problème de méthode. L'open-source gagnerait à ce que chaque étudiant puisse dans le cadre de son apprentissage apporter sa pierre à l'édifice.

D'où cette idée d'enseignement de la programmation dirigé par les tests. Le contenu d'un cours deviendrait :

- explication théorique des concepts associés au sujet étudié (ex.: protocole POP3) ;
- création d'un ou plusieurs modules sur ce même sujet selon les tests créés par l'enseignant (ex: client, serveur, proxy ... POP3) ;
- mise en commun des modules, tests de performance et briefing sur les erreurs rencontrées et les solutions les plus performantes.

Cela demande un important travail de préparation au départ, mais rien n'empêche de mutualiser les travaux ou de réutiliser ces derniers d'une année sur l'autre. La création de contenus pour des concours de programmation peut aussi être publiée de manière réutilisable par les enseignants. Un enseignant peut aussi utiliser les tests d'un projet open-source existant, de cette manière si un étudiant trouve une façon très élégante de s'y conformer, cela peut bénéficier à ce projet open-source via un pull request.

Bref, que pensez-vous de cette approche ? Suis-je le seul geek Bisounours ? Votre avis m’intéresse !

PS : Du même tonneau, retrouvez les [défis JavaScript de FranceJS](http://francejs.org/concours.html "Voir les défis de FranceJS").
