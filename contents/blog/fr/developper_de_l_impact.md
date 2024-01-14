---
title: Développer de l'impact
description: Présentation donnée lors du Club Tech à Euratechnologies.
leafname: developper_de_l_impact
link:
  label: Développer de l'impact
  title: En savoir plus sur cette présentation
  url: https://slides.com/nfroidure/developper-son-impact
date: "2017-10-25T13:00:00.000Z"
lang: fr
location: FR
keywords:
  - Impact
categories:
  - Méthodologie
---

# Développer de l'impact produit

**Où comment travailler moins pour impacter plus.**

Présentation réalisée pour le Club Tech à Euratechnologies le 25 octobre 2017.

[Présentation](https://slides.com/nfroidure/developper-son-impact "🎚")

## Objectifs

Cette présentation a pour objectif de vous proposer une ensemble de bonnes pratiques et de ressources pour donner plus d'impact à votre travail en tant que développeurs/développeuses ou architecte logiciel travaillant sur un produit innovant (logiciel ou impliquant du logiciel).

Je suis spécialisé dans la conception et le développement de plateformes web pour produits innovant. Durant mon parcours et au fil de mes lectures, j'ai pu réunir un ensemble de concepts qui ont du sens lorsque l'on tente d'innover en tant que développeur/développeuse logiciel.

## Contexte produit innovant

Commençons par une petite séquence vocabulaire/méthodologie: Créer un produit innovant, c'est quoi ?

### Vision

Quand on décide de créer un produit innovant, tout part généralement d'une vision. Le sentiment qu'un problème récurrent peut être adressé de façon inédite.

Identifier un problème récurrent n'est pas suffisant. Il faut trouver une solution à ce problème que les utilisateurs et utilisatrices acceptent de payer (product/market fit).

Sur le papier c'est simple, mais en réalité, c'est probablement le plus grand défi de l'innovation: la connecter à la réalité économique. Pour ce faire, il existe une méthode, le Lean Startup.

### Lean Startup

Qui dit produit innovant dit Lean Startup ou autre méthodologie dérivée approchante.

C'est important d'en parler car pour que cette méthode fonctionne, il faut que les développeurses la connaissent et facilitent sa mise en oeuvre.

Dans le Lean Startup, tout est basé sur la feedback loop qui nous permet de tirer des enseignements.

La première itération commence au moment de l'hypothèse. Elle se traduit par une assertion: "Si nous développons la solution X, la métrique Y devrait être impactée". Ensuite, on construit, on mesure et on apprends.

Du point de vue de l'équipe de développement développeur, il est important de saisir que :

- la rigueur du développement est très importante pour que ces enseignements soient valides. Tout bug peut potentiellement fausser la mesure et entraver la démarche complète. Il s'agit de donc bien de présenter un produit fini à l'utilisateur,
- la mesure nécessite un travail en elle même et il faut donc inclure ce dernier dans vos estimations,
- les développements faits pour cette itération peuvent tout simplement finir à la poubelle. Il faut donc veiller à créer des branches et à dissocier le travail de refactoring du développement de features.

### MVP: Most Valuable Product

Au centre de cette boucle d'itération, se trouve le MVP qui nourrit chaque itération. Discrimer les contours du MVP est difficile mais très important. Il doit être suffisamment simple pour permettre de tester une assertion rapidement, mais suffisamment complet pour la tester pleinement.

Discriminer l'assertion testée et le produit qui permet de la tester est la partie la plus risquée. En effet, en général, on a des milliers d'idées et bien plus de variations de ces idées, mais on ne peut en tester qu'une à chaque itération.

### Backlog

Autre outil fondamental pour la conception de produits innovants: le backlog. Personnellement, j'utilise le backlog comme une boîte à tâches qui contient tout ce qui pourrait avoir du sens en terme de fonctionnalité mais aussi d'évolution technique pure ou simplement des tâches courantes.

L'avantage d'un backlog unique est que l'on peut composer les sprints en prenant en compte les tâches courantes et le refactoring. Trop souvent, on planifie uniquement les features et on oublie le reste qui est aussi important, parfois même urgent.

Dès lors, ces tâches courantes ont tendance à s'insinuer dans les sprints et à en perturber le fonctionnement par manque d'anticipation.

Le backlog offre une vision stratégique de ce qui peut être planifié. Qu'est-ce qui peut être fait ? Comment ? Quand ?

### Sprint

Les sprints sont empruntés à la méthode agile cependant dans un contexte produit, les sprints ne sont plus bornés par le temps mais par le périmètre fonctionnel qui doit être complété entièrement pour valider l'assertion testée.

En cas de drifts calendaire trop important on a toujours la possibilité de stopper l'itération et de repartir sur une assertion plus simple à tester.

Notez comme cette personne se déplace vite. On aimerait tous que nos sprints ressemblent à ça, n'est-ce pas ? Pourtant, malgré cette appellation, il ne faut pas oublier que créer un produit innovant reste un marathon, ponctué certes par des sprints mais nécessitant des prises de recul régulières.

## Développement: Quelques spécificités

Une autre mise en contexte est nécessaire pour augmenter son impact en tant que développeur. Il est important de connaître les mécanismes qui sous-tendent notre productivité et la relation qu'ils maintiennent avec notre impact final.

Ces constats son basés uniquement sur mon expérience. Je n'ai pas encore de preuves scientifiques à avancer, mais si vous en détenez qui les invalides ou les valides je suis preneur.

### La productivité

![](/public/illustrations/evolution-productivite-developpeur.svg)

La productivité mesure la quantité de travail que nous sommes capables de fournir. L'évolution de la productivité d'un développeur qui s'inscrit dans une démarche d'amélioration continue reste cependant capée. Du moins, tant qu'on ne devient pas bioniques.

### Entraves à la productivité

Ce plafond est dû à plusieurs facteurs.

La charge cognitive représente notre capacité à comprendre les systèmes que nous créons. Plus ils sont importants, plus ils sont difficiles à saisir.

Il existe des moyens d'amoindrir la charge cognitive de notre code que nous verrons par la suite, mais nous ne faisons que gagner un peu de temps. La tendance reste l'augmentation exponentielle.

![](/public/illustrations/evolution-charge-cognitive-quantite-de-code.svg)

### Concentration

Je pense avoir partagé ce petit dessin des centaine de fois. Il illustre parfaitement ce qu'est la programmation. Les développeurs ont besoin d'une concentration extrême pour résoudre certains problèmes.

C'est pour cela qu'il est important de travailler dans un environnement calme. Le coût du changement de contexte est important, c'est ici que l'organisation en sprint prend tout son sens. On planifie et on exécute.

### L'impact

L'impact est la quantité de travail fournie par vos programmes. On peine à s'en rendre compte, mais celle-ci est potentiellement exponentielle. C'est ce qui fait que notre secteur est destructeur d'emplois.

![](/public/illustrations/evolution-ideale-impact-developpeur.svg)

Cette courbe n'est valable que pour un seul produit. Vous repartez à 0 à chaque changement d'entreprise. En prestation de service, c'est pire, chaque changement de projet réduit à néant vos efforts précédents.

## Améliorer son impact

La question est donc comment puis-je améliorer mon impact ?

### Améliorer sa productivité

Nous ne sommes pas tous des développeurs séniors en quasi-stagnation de productivité. Souvenons-nous que l'impact est proportionnel à la productivité.

Voici quelques pistes qui peuvent vous permettre de développer votre impact de par la productivité.

### Zone d'influence

![](/public/illustrations/Zones-Préoccupations-Influence.svg)

Il est très important d'identifier sa zone de préoccupation qui nous renseigne sur les sujets que l'on doit suivre, mais il est encore plus crucial d'identifier sa zone d'influence afin d'accroître son impact.

Dans un contexte produit, la vision, le problème qu'on a identifié et que l'on essaie de résoudre défini notre zone de préoccupation.

Notre zone d'influence représente notre marge de manoeuvre. Que puis-je faire maintenant pour avoir de l'impact.

Votre produit est encore sur AngularJS alors que React est la nouvelle hype ? Prenez en acte et passez à l'action. Ça ne sert à rien de ressasser continuellement des problèmes qui sont hors de votre zone d'influence.

Cela dit, si votre zone d'influence est si petite que vous ressentez une sensation permanente d'inconfort, c'est probablement le signe qu'il faut envisager de l'agrandir via un changement de poste / d'entreprise.

![](/public/illustrations/Zones-Préoccupations-Influence-Lean.svg)

Il faut également noter la dimension temporelle de la zone d'influence. En effet, durant la boucle de feedback, il existe un temps pour alimenter le backlog, un temps pour le prioriser, un temps pour définir les sprints et enfin un pour leur exécution. Si la méthodologie Lean Startup est réellement appliquée (du moins, si l'intention est réelle) alors vous devriez ressentir ces temps.

Typiquement, pendant un sprint, votre zone d'influence est très réduite. Il s'agit d'exécuter les plans.

Même s'il reste possible, voire parfois souhaitable, de changer ou remettre en cause un sprint en cours de route, cela reste l'exception. Le sprint doit suivre son cours sauf situation de crise réelle.

En revanche, pendant la définition du sprint, votre zone d'influence est plus large. C'est à ce moment que votre valeur ajoutée technique peut s'exprimer pleinement.

Pendant le temps de la mesure elle se contracte à nouveau car c'est la mesure qui donne la direction et l'objectif est de laisser le moins de place possible à l'interprétation. Votre zone d'influence ici se dessine surtout autour de la vérification de la qualité de la donnée (détection de biais statistiques, découverte de bugs impactant la mesure).

Enfin, et c'est tout l'intérêt du backlog, votre zone d'influence au niveau du backlog est totale. Il n'y a pas de mauvais item dans un backlog. Tout ce qui a du sens pour vous peut y être inscrit. Avec le backlog on cherche des directions possibles et tout ce qui peut aller dans ce sens est bon à prendre.

Enfin, gardez à l'esprit qu'une zone d'influence, ça se travaille. Aussi, certains choix techniques peuvent créer une inertie telle qu'elle réduira à terme la zone d'influence de toute l'équipe. À l'inverse de bonnes bases peuvent nous fournir une latitude plus large pour l'évolution de notre produit. C'est ici que l'expérience joue un rôle prépondérant.

En développement produit, par exemple, on peut choisir de ne pas utiliser de framework pour augmenter sa zone d'influence car on sait qu'on ne sera pas capé par les possibilités du dit framework, ni freiné par des mises à jour non rétro-compatibles.

Le secret pour élargir notre zone d'influence se trouve en aval dans les choix architecturaux que nous faisons. C'est pourquoi nous devons nous concentrer sur l'important plutôt que l'urgent.

### Urgent ou important ?

![](/public/illustrations/Urgent-vs-Important.svg)

Ceux d'entre vous qui se sont intéressés à la gestion du temps connaissent sûrement la matrice d'Eisenhower illustrée ici.

De nos jours, l'urgence est partout. Toutes les demandes semblent appeler une réponse instantanée.

Or, bon nombre des demandes urgentes sont en réalité non-importantes. Pour moi, aucune demande ne doit être traitée dans l'immédiat sauf cas de force majeure.

Comme l'a souligné Stephen R Covey, si nous traitons toutes les demandes dans l'immédiat, nous nous privons de toute planification et vivons alors dans la réaction pure aux stimuli qui nous entourent.

En général, quand vous passez beaucoup de temps dans le cadre de l'urgent mais non important, c'est le signe que des tâches importantes mais non-urgentes ont été négligées.

Pour citer quelques exemples, si vous ne prenez pas le temps de tester votre code alors vous alimenterez le flot des bugs et le support client.

Si vous ne prenez pas le temps de tester vos features et de vérifier leur sens pour le produit, il deviendra urgent de recruter pour maintenir une plateforme dont les features ne seront pas utilisées.

On peut multiplier les exemples d'urgences générées par un manque d'anticipation et de priorisation de l'important. C'est pourquoi nous devons consacrer une portion non négligeable de notre temps à préparer l'avenir en menant des actions de long terme.

Le côté pernicieux de l'urgence est qu'elle donne un sentiment immédiat de productivité et d'utilité. Quand se consacrer au long terme peut donner un sentiment d'inertie sur le court voire moyen terme.

Malheureusement, trop de managers se concentrent sur la productivité et non l'impact. Ils se satisfont de voir leurs équipes gérer l'urgence jusqu'à des heures impossibles et ne voient pas l'incroyable gâchis de ressources que cela représente. Menant à des situations de burnout dont ils se [félicitent même parfois](https://medium.com/@deusexmachina667/you-fired-your-top-talent-i-hope-youre-happy-cf57c41183dd)...

Ce genre d'organisation demande une force de conviction solide pour ne pas entrer dans ce jeu là. Nous verrons comment on peut à son niveau impulser de nouveaux paradigmes dans l'équipe.

### Revenir aux objectifs

Sans cesse se référer à la vision produit. En tant que développeurses, on se perd facilement dans des considérations purement techniques et on s'écarte du but premier. Prendre le temps de revenir aux fondamentaux permet souvent de trouver le chemin le plus court.

Prendre du recul, de la hauteur vis à vis de ce que l'on code permet souvent de mieux coder. Le papier et le crayon sont le meilleur ami des développeurses.

### S'outiller

Les mauvais développeurses mettent en cause leurs outils, les meilleurs trouvent les bons outils.

Certains outils sont indispensables pour gérer au mieux le développement de produit innovant. Votre backlog ne peut pas être une feuille Excel, il demande de l'interactivité, de l'immédiateté et de la disponibilité.

Il n'y a rien de pire que l'email pour gérer les demandes/tâches. Il vous faut un logiciel pour mettre les demandes/tâches dans une todo et un pipe qui l'alimente. Quand on est obligé de se souvenir de ce que l'on a à faire, on est moins concentré sur sa tâche. Lire le livre «The Effective Engineer» peut suffire à vous en convaincre.

### Aiguiser la hache

Donnez-moi six heures pour abattre un arbre et je passerai les premières quatre heures à aiguiser la hache. Abraham Lincoln

Affuter ses connaissances et ses outils est un prérequis essentiel pour bien utiliser son temps.

Vous vous souvenez probablement de cette personne qui a illustré le concept de sprint dans le slide dédié.

Elle est vraiment impressionnante. Si on y prête attention, on peut presque ressentir à quel point sa posture est millimétrée à force de répétition des mêmes gestes.

Elle a préparé ce sprint pendant des mois pour au final donner tout ce qu'elle a sur une période définie.

Les mots ont un sens. Un sprint est un sprint, nous devons consacrer un temps non négligeable pour préparer nos sprints. Aucun sprinter ne s'entraîne en sprintant. Enchaîner les sprints sans temps de repos, sans préparer le suivant, sans prendre de hauteur sur les précédents n'est pas efficace.

Pour les développeurses, aiguiser sa hache, c'est prendre le temps d'apprendre à utiliser une base de donnée ou un framework, lire toute leur documentation, comprendre les patterns qu'ils implémentent, le besoin qu'ils adressent, avant de l'utiliser.

Trop de développeurses commencent à coder au dessus du tutoriel d'un blog en recherche de visibilité sans même se poser la question de la viabilité de cette démarche.

## Biais cognitifs

Un développeur est avant tout un humain et en tant qu'humain, il est victime de biais cognitifs. Ce codex regroupe et catégorise les [biais cognitifs dont nous sommes tous victimes](https://upload.wikimedia.org/wikipedia/commons/1/16/The%5FCognitive%5FBias%5FCodex%5F%28French%29%5F-%5FJohn%5FManoogian%5FIII%5F%28jm3%29.svg). Cela incite à l'humilité et plaide pour la méthode scientifique.

Les développeurses ayant une culture scientifique ont tendance à croire qu'iels sont objectifs par nature. Alors que ce sont plutôt les biais cognitifs qui sont naturels. Soyons humbles, reconnaissons que nous ne sommes pas toujours objectifs et évaluons notre impact à partir de critères mesurables.

### Prendre soin de soi

![](/public/illustrations/CNV-Developpement-personnel-durable-complet.svg)

Enfin en tant que développeurses, nous sommes parfois omnibulés par notre approche scientifique et nous laissons souvent l'humain de côté.

Il existe un grand nombre de compétences strictement humaines qui peuvent nous permettre d'augmenter significativement notre impact en tant que développeurses.

Prendre soin de votre capital humain est vital. Respectez vos horaires. Même si un projet contient des sprints, n'oubliez pas que c'est surtout un marathon. Vous connaissez probablement la citation «Mens Sana In Corpore Sano», elle nous apprend que dès l'Antiquité, les grands esprits savaient que tout est question d'équilibre quand il s'agit de développement personnel.

Pour éviter l'essouflement et le manque de discernement qui finit toujours par l'accompagner accordez vous l'usage divertissant de votre temps. C'est la partie non-urgente et non-importante de notre matrice d'Eisenhower. Si ce n'est ni urgent, ni important pour l'entreprise mais que cela recharge vos batteries, alors c'est important pour vous.

Accordez-vous également du temps pour être à l'écoute de vos besoins, de les différentier de vos stratégies. Déconstruisez vos carcans mentaux pour vous approcher de votre vérité.

J'aime beaucoup ce schéma tiré du livre «Découvrir la Communication Non Violente» de Françoise Keller. Il propose de maintenir un équilibre entre nos ressources intérieures (notre énergie disponible, notre satisfaction), notre mission personnelle (ce que l'on accomplit) et les interactions sociales.

La bonne idée de ce schéma est qu'en regardant à l'exact opposé des divers symptômes, on trouve immédiatement la sphère que l'on a négligé et vers laquelle nous devrions de nouveau tendre.

Tout est question d'équilibre, nous ne sommes jamais parfaitement dans le développement personnel, nous tentons de nous approcher comme d'un idéal et ce schéma est une bonne bousole dans cette quête.

## Améliorer l'impact de l'équipe

### Prendre soin des autres

Le facteur humain est une étape obligée. Si on y prend pas garde, tôt ou tard, il refait surface.

Faire preuve d'humanité et d'empathie est un prérequis pour garder un impact durable au sein de l'équipe. Créer la synergie décuple l'impact de chacun et l'impact de l'équipe dépasse alors la somme des individualités.

Travailler uniquement son propre impact en laissant les autres derrière soi peut nous couper de l'équipe, parfois définitivement. Il faut alors accepter d'avancer moins vite au début dans l'amélioration de son propre impact pour emmener avec soi l'équipe et parvenir à un résultat plus fort.

### Apprendre à communiquer

Disons-le, nous partons souvent de loin quand on parle de communication chez les développeurses. Nos compétences en la matière sont rarement exceptionnelles.

Mais les timides contrariés sont souvent les meilleurs orateurices car iels utilisent consciemment des techniques avancées pour se faire comprendre. Iels ne sont pas dans l'instinctif, mais dans la démarche consciente et volontaire.

Nous avons l'opportunité de devenir de meilleurs communiquants en nous formant tout simplement à des techniques telles que la Communication Non Violente.

Communiquer c'est d'abord écouter et comprendre. Ce dessin illustre parfaitement les travers dont nous sommes souvent victimes.

### Reconnaître la compétence

Le [modèle d'acquisition de compétences de Dreyfus](https://en.wikipedia.org/wiki/Dreyfus%5Fmodel%5Fof%5Fskill%5Facquisition) nous en apprend beaucoup sur la nature de la compétence. Pour avoir un impact fort, il est important de connaître les compétences de chacun afin de s'addresser à la personne la plus appropriée pour résoudre un blocage que vous rencontrez.

Reconnaître la compétence repose principalement sur la mesure des résultats obtenus. Même si vous n'appréciez pas une personne, vous devez la remercier quand elle vous fait profiter de son expertise.

Reconnaître la compétence, c'est aussi reconnaître l'incompétence. La sienne et celle des autres. Un des grands enseignements du Lean Startup est qu'il n'existe pas de vision/d'idée parfaite qu'il suffirait d'appliquer. Une démarche saine consiste à reconnaître notre incompétence à prédir l'avenir du produit et à baser toute projection sur la mesure.

Il n'y a rien de pire que de demander l'avis de quelqu'un et de ne pas l'appliquer. C'est pourquoi il faut choisir les mots lorsqu'on demande un avis sur un sujet pour lequel personne ne peut être compétent. Demander quelle est son intuition à la personne plutôt que quelle est sa recommandation peut être une piste.

### Télétravailler

Surtout pendant les sprints car cela permet de rester focus.

### Culture de l'écrit

Pour pouvoir prioriser des tâches concrètes, mais aussi garder des traces des décisions et des raisons qui y ont mené.

### Sens du collectif

Une fois mergé, le code devient la responsabilité de tous. Il n'y a rien de plus toxique qu'une équipe qui fonctionne en modeblame and shame.

Rendre l'équipe responsable de tous les choix permet de pacifier les rapports et encourager la communication.

Le pendant est l'écoute réelle. Si la concertation ne va pas dans votre sens, n'imposez pas votre vision au risque de casser la confiance durement acquise.

### Valoriser son impact

C'est la partie que je maîtrise peut être encore le moins. Pour tout dire, appliquer les méthodes dont je viens de parler en entreprise relève du défi intégral.

Ce n'est pas dans les moeurs de tout faire pour ne pas travailler trop. Aujourd'hui, les managers mesurent encore trop la productivité et non l'impact des employés.

Comme le dit ce proverbe auvergnat plein de bon sens que ma moitié m'a fait découvrir:un morceau avalé n'a plus de goût.

En cherchant l'impact dans une entreprise qui est dans la pure réactivité aux stimulis extérieurs, vous vous confronterez à de nombreuses résistances. Vous serez même souvent perçu comme moins productif que les autres (ce qui sera objectivement vrai).

C'est pourquoi, pour ne pas passer pour le fainéant de service, vous devrez communiquer sur l'impact que vous générez, la différence entre impact et productivité et comment la bonne séparation entre votre travail et votre vie privée, le respect de vos horaires ou les petits arrangements négociés avec votre employeur (télétravail) vous permettent de produire cet impact.

C'est important de le faire car il y a un vrai risque que vos conditions de travail se dégradent pour des raisons d'incompréhension de la part de vos collègues/managers.

Vous devez leur fournir des clés pour comprendre votre hauteur de vue. Ils doivent comprendre que vous êtes fainéant par conviction !

Cela demande un effort de votre part car si vous agissez pour développer votre impact, mais reportez votre travail en terme de productivité vous créez vous même les conditions de votre échec. Vous direz: «J'ai réduis la facture Cloud de 5%» et non, «J'ai réécris 10% du framework». Ce n'est pas si simple que ça en a l'air et demande un effort conscient pour en faire une habitude.

Parfois, malheureusement, la différence culturelle sera trop forte et vous ne parviendrez pas à changer la situation. J'ai rencontré ce cas et, à contre-coeur, j'ai accepté ma défaite et changé d'emploi.

## L'impact en actions

Pour terminer cette présentation, je vais mettre en lumière quelques actions concrètes permettant d'améliorer l'impact de votre travail de développeur de produit innovant sans plus tarder.

### Le cloud (ou Paas)

Serverless, RDS, CloudAMQP... Aujourd'hui, il est difficile de justifier le bare metal quand l'écosystème du cloud nous propose une variété d'outil avec très peu de maintenance.

Autant, en mode prestation de service, on peut justifier de ne pas l'utiliser pour des questions de rentabilité, autant en mode produit, nous devons nous concentrer sur l'essentiel: notre produit.

Tout ce qui est de nature à nous libérer l'esprit est bon à prendre. Le cloud est une composante essentielle de cette stratégie.

En revanche, tout n'est pas bon à prendre dans le cloud. Personellement, je pratique du cloud «défensif». J'évite comme la peste les fonctionnalités visant à me vendor locker et me concentre sur des outils génériques ou duPaaS de briques open-source.

### Le SaaS

Typeform, Asana, CircleCI, Mailgun, MailChimp, LogMatic, Google Analytics, Slack... Si ce n'est pas votre métier, trouvez quelqu'un pour qui ça l'est et payez le pour ça !

Vous n'avez pas le temps de faire moins bien que l'état de l'art. La plupart des SaaS ont des plans gratuits / startup, profitez-en !

Il faut simplement être attentif aux possibilités d'interfaçage (ie l'API). Les webhooks et une API REST étant le minimum vital.

Évitez aussi comme la peste les SaaS qui font tout. En effet, si une seule évolution vous déplaît, vous voilà obliger de jeter le bébé avec l'eau du bain. De plus, ce genre de Saas tombe dans le travers dans lequel vous souhaitez éviter de tomber en passant par eux.

### Documentation first

On l'a vu tout au long de cette présentation. Nous avons tendance à oublier ce qui est important au profit de ce qui est urgent. C'est une tendance naturelle chez l'être humain en général.

J'en suis la première victime et c'est pour cela que je mets en place un véritable forçage partout où c'est possible de la documentation. Par exemple, dans [le backend de Sencrop](https://developer.sencrop.com/), il est impossible de [créer une route sans la documenter](https://github.com/nfroidure/swagger-http-router "Découvrir l'outil que j'utilise pour cela").

Quand il n'est pas possible ou simple de forcer la documentation, je me repose sur des workflows. Par exemple, le Readme Driven Design permet de créer des modules JavaScript en commençant par réfléchir à l'interface d'API finale fournie aux utilisateurs.

J'ai également créé [JSArch](https://github.com/nfroidure/jsarch) qui me sert d'on-boarding sur mes modules JavaScript et mes applications métier. Savoir si les commentaires sont utiles ou pas fait encore débat. Pour ma part j'ai tranché en partant du principe que les commentaires les plus utiles portent sur les choix architecturaux car ils ne sont pas aisément compréhensibles sur la seule base du code.

Enfin, dès que vous faîtes du code que vous réprouvez, c'est le signe que vous devez mettre un commentaire pour expliquer quelles contraintes (temps, bug...) vous ont obligées à agir ainsi.

### Générer le code bateau

Ce n'est pas parce que c'est du code que c'est bien. Quand du code est trop répétitif, générez-le. Par exemple, le [SDK JS de Sencrop](https://github.com/sencrop/sencrop-js-api-client) est entièrement automatisé.

### Ne pas coder

Le code qu'on n'écrit pas est maintenable et testé ;). Il ne contient aucun bug, ne crée pas de charge cognitive. C'est le meilleur code possible.

Vous ne devez pas écrire de code sans chercher s'il n'existe pas d'équivalent satisfaisant.

Même en n'écrivant que du code métier, toujours s'interroger sur la complexité résiduelle que l'on crée, ce qu'elle nous apporte et si cela en vaut vraiment la peine.

## Liens utiles

Voici quelques liens qui peuvent vous aider à pousser la réflexion plus loin.

## Bibliographie

C'est toujours très difficile de dire quel cheminement nous a amener à avoir une façon de penser donnée. Mais je me plie à l'exercice en vous proposant cet ensemble de livres hétérogènes:

Les 7 habitudes des gens efficaces - Stephen R Covey Cessez d'être gentil, soyez vrai - Thomas D'Ansembourg Le management bienveillant - Philippe Rodet et Yves Desjacques The Effective Engineer - Edmond Lau Découvrir la Communication Non Violente - Françoise Keller Lean Startup - Eric Ries Running Lean - Ash Maurya Clean Code - Robert Cecil Martin Ranger: L'étincelle du bonheur - Marie Kondō La magie du "J'en ai rien à foutre" - Sarah Knight
