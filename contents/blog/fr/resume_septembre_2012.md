---
title: Mes trouvailles de septembre 2012
description: Ce mois-ci, j'ai vu passer assez de petites choses pour faire un point rapide sur les dernières nouveautés et actualités du développement web.
leafname: resume_septembre_2012
link:
  label: Trouvailles 09/2012
  title: Voir les trouvailles de ce mois de septembre 2012
date: "2012-09-29T10:54:05.000Z"
lang: fr
location: FR
keywords:
  - HTML5
categories:
  - Trouvailles
---

# Mes trouvailles de septembre 2012

Ce mois-ci, j'ai vu passer assez de petites choses pour faire un point rapide sur les dernières nouveautés et actualités du développement web.

Tout d'abord, parlons un peu des exploits de bidouilleurs de l'extrême :

- Les WebSockets, vous utilisez ? Vous aimez ? Eh bien, c'était possible quasiment depuis la création du web ! La preuve par l'[exemple avec GifSockets](https://github.com/videlalvaro/gifsockets "Voir le projet sur GitHub").

Quelques infos sur l'état d'HTML5 :

- le flexible box model a changé. Difficile de trouver des ressources à jour sur ce thème, [voici donc un lien qui l'explique comme il faut](http://www.the-haystack.com/2012/01/04/learn-you-a-flexbox/ "Voir le billet de blog sur le flexible box model") en anglais. Je ferai peut-être un article si j'ai le temps car je l'utilise quasiment depuis sa création et c'est vraiment l'avenir de l'intégration web à mon sens. D'ailleurs, il serait temps qu'Opera se bouge le ...
- plus récent, une fontaine dont chaque jet est animé par un WebWorker (sorte de thread Javascript) puis dessiné dans le thread principal via l'élément Canvas à chaque évènement. L'animation en elle-même n'a pas grand intérêt, mais le principe est très prometteur. En effet, il a un double avantage : exploiter tous les cœurs de la machine, dissocier le calcul des coordonnées de l'affichage. Je pense à Tank Arena et je me dit que je pourrai utiliser un WebWorker pour calculer les déplacements et cela serait une première isolation me permettant de déplacer au besoin ces calculs sur un serveur avec les WebSocket ou chez un joueur hôte via WebRTC. Je ne sais pas si cette approche existe dans les moteurs de jeu actuellement disponibles.
- mon avis sur le [troll de Zuckerberg](http://techcrunch.com/2012/09/11/mark-zuckerberg-our-biggest-mistake-with-mobile-was-betting-too-much-on-html5/ "Voir le troll pourri") à propos de HTML5\. Premièrement, ce qu'il a dit semble plus mitigé que ce que les anti-HTML5 ont relevé, mais de plus, pour utiliser l'application Facebook, je peux vous assurer que la merde, c'est pas HTML5, mais les serveurs de Facebook et probablement leur façon d'échanger entre client et serveur. Pour avoir moi-même développé un client HTML5, je peux vous assurer que c'est plus le serveur qui nuit à l'expérience utilisateur. Il faut alors optimiser le format d'échange de données (BisonJS pour les fans de JSON ou pourquoi pas les [VarStreams](https://npmjs.org/package/varstream "Voir le module NPM") pour un chargement progressif de la timeline) et surtout bien coder côté serveur et bien optimiser l'infra. Pour moi sur un seul serveur avec une charge de PMI-PME, c'est plus simple, mais je pense que Facebook a surtout un gros problème d'infrastructure qui a du mal à affronter la charge en restant réactive. C'est un peu normal vu leur traffic, par contre, c'est pas sympa de s'en prendre à HTML5 et d'en faire un bouc émissaire.
- j'ai testé pour vous : Windows 8 est effectivement prêt pour HTML5. Microsoft semble en revanche moins prêt pour le défi business qui l'attend avec l'explosion du mobile. Bon, par contre, ça ne signifie pas qu'il sont devenus meilleurs, ils restent sur ce point alignés avec les autres grand du logiciel que sont Apple et iOS. Il est temps que Mozilla entre dans la danse avec Firefox OS pour amener un peu de liberté dans le mobile. A ce sujet, je me demande si les distributions Linux aussi ne vont pas devoir s'adapter.
- j'ai fait une présentation sur HTML5 versus les applications natives à la CCI d'Arras,
- vous vous posez des questions sur ce qu'il y a sous le capot des moteurs Js ? Cet article sur le [Javascript dans Firefox](http://linuxfr.org/users/enjolras/journaux/javascript-performances-et-firefox "Voir le journal") est fait pour vous !
- [API PointerLock](http://www.pcinpact.com/news/74100-chrome-22-google-ajoute-pointer-lock-et-souvre-voie-fps.htm "Voir l'article") : Contrôlez la souris !

Un peu de programmation :

- [@naholyr](https://bsky.app/profile/naholyr.fr "Voir son profil Bluesky") a fait un excellent article sur le [profilage d'applications NodeJS](http://naholyr.fr/2012/09/profiler-son-application-nodejs/ "Voir son article"). Je vous recommande d'ailleurs chaudement le blog et le personnage qui sont intéressants et très au fait de NodeJs en général.
- Mettre une [application NodeJs en production](http://www.armetiz.info/node-js-mise-production-simple/ "Lire ce billet") rapidement.
- [Comprendre le C en apprenant l'assembleur](https://www.hackerschool.com/blog/7-understanding-c-by-learning-assembly "Lire ce billet fort intéressant"), rien que ça !
- Comment stocker et représenter des prix en Javascript ? Pour moi, l'objet Number est approprié, Il suffit de les formater avant de les afficher.[Voici une méthode](https://gist.github.com/3608274 "Voir la méthode Javascript créée par mes soins") faîte spécialement pour répondre à cette question de [Fabien Canu](http://fabiencanu.fr "Voir son blog") que certains d'entre vous doivent connaître. Cette méthode est perfectible notamment pour représenter les grand nombres et pour être facilement localisable.
- Sympa : gérer ses [VirtualHosts LightHTTPD](http://www.howtoforge.com/creating-advanced-mysql-based-virtual-hosts-on-lighttpd-debian-squeeze "Voir le tutoriel") dans une base de donnée MySQL.
- Merci MooTools ! [Composez un MooTools](https://mootools.net/blog/2012/08/13/optimizing-mootools-builds-sans-internet-explorer "Voir le billet expliquant tout ça") sans tout le code spécifique à IE.

Du fun :

- un [Doodle Jump](http://cssdeck.com/labs/html5-milo-jump-game "Voir le jeu") en Javascript.
- un jeu 3D réalisé avec WebGL nommé [HexGL](http://hexgl.bkcore.com/ "Voir le site du jeu").
- un [émulateur Nintendo 64](http://hulkholden.github.com/n64js/ "Voir l'émulateur") en Javascript :D

Un peu d'humour pour finir :  
! [Un homme qui mange un ver vivant](/public/illustrations/omfg-man-vs-wild.gif)  
Quand je dois faire du sysadmin sur Windows Server ! via [@Karlesnine](https://github.com/karlesnine "Voir son profil GitHub")
