---
title: Devenez un homme, streamez vos données !
description: Peut-être ne le saviez-vous pas, mais XMLHttpRequest Level 2 permet d'accéder vos données avant leur chargement complet grâce à l'écouteur d'évènement onProgress. Il est temps de grandir et de l'utiliser.
leafname: streamer_donnees
link:
  label: Streamer vos données
  title: En savoir plus sur le streaming de données.
date: "2012-11-23T10:11:41.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - Streams
  - VarStream
  - HTTP
categories:
  - VarStream
---

# Devenez un homme, streamez vos données !

Peut-être ne le saviez-vous pas, mais XMLHttpRequest Level 2 permet d'accéder vos données avant leur chargement complet grâce à l'écouteur d'évènement onProgress. Il est temps de grandir et de l'utiliser.

Dans le cadre de mes applications web pour entreprise, j'utilise le streaming qui propose de nombreux avantages en terme de performance ressentie et de réactivité des interfaces. Et pourtant, ce concept est très peu utilisé, même par les plus grands. Voyons pourquoi !

## JSON, ce traître !

JSON est le format le plus utilisé pour charger des données dynamiquement (ce fameux Ajax qu'on ne présente plus). Malgré sa popularité, JSON possède un sérieux désavantage qui conduit les développeurs dans un impasse. En effet, il est impossible de déterminer, tant qu'il n'est pas entièrement chargé, si le JSON reçu est valide ou non.

La seule solution qui se présente aux développeurs est donc d'attendre sagement le chargement complet de la ressource afin de pouvoir la parser grâce à la bien connue méthode `JSON.parse(data)`.

Bref, JSON n'est pas streamable, du moins, pas facilement puisqu'il faudrait recréer un parseur qui serait probablement peu performant étant donnée la complexité de JSON.

## Les formats streamables

J'ai déjà parlé ici de [VarStream](./remplacer_json_par_varstream "En savoir plus sur les VarStreams"), mais vous seriez surpris de savoir combien d'autres formats son supérieurs sur ce point à JSON. Parlons par exemple de CSV. La plupart des données JSON sont finalement des données tabulaires qui pourraient tout aussi bien être représentées en CSV sans perte de sens, mais avec une taille réduite, et surtout, un format streamable. Mais on peut aussi parler de ce fameux HTML ou du simple texte qui sont également streamables facilement.

## Pourquoi streamer ?

C'est une question légitime qui m'est régulièrement posée quand je parle de streamer des données via XHR. Comparons les deux approches.

L'approche classique est la suivante, j'envoie une requête XHR, j'affiche un loader pour faire patienter le visiteur, puis, une fois toutes mes données chargées, j'ajoute le contenu à la page via le DOM. Si la requête prend une ou deux secondes à se télécharger, alors le visiteur attendra autant de temps sans que rien ne se passe à part une animation sans intérêt.

L'approche streamée est bien plus dynamique. J'envoie une requête XHR mais qui cette fois renvoie un format streamable. Dès le premier chunk de donnée reçu, le contenu commence à se mettre à jour au fur et à mesure que ces derniers nous parviennent. Notre loader est avantageusement remplacé par nos données elles-mêmes. Là où le visiteur aurait attendu une seconde, ce dernier attend plutôt 1/4 de seconde pour que quelque chose se passe.

## La preuve par l'exemple

J'ai créé un petit comparatif pour appuyer mes propos. Chez moi en 512k, l'exemple est très parlant. Voici les résultats dans différentes situations :

- sur mon réseau local : VarStream (affichages : 6, 20ms, chargement complet: 20ms), JSON (affichages : 18ms, chargement complet: 18ms).
- sur mon serveur distant : VarStream (affichages : 110,171,212,263,267,268ms, chargement complet: 268ms), JSON (affichages : 267ms, chargement complet: 267ms).
- sur le distant avec une vidéo YouTube en route : VarStream (affichages : 856, 916,958,2130,2175ms, chargement complet: 2175ms), JSON (affichages : 1915ms, chargement complet: 1515ms).

Les résultats en réseau local montrent que dans des conditions idéales en terme de bande passante, les reflows sont plus limités puisque l'information arrive plus vite. On peut également dire que le fait de streamer les données a un faible impact dans de bonnes conditions.

Sur le serveur distant, on se rend compte que le fait de streamer les données réduit par deux le temps de disponibilité des données. L'utilisateur peut commencer à lire avant le chargement complet.

Il est intéressant de noter qu'en cas de surcharge de la bande passante, les résultats sont encore meilleurs ce qui rend la démarche encore plus intéressante dans le contexte de la mobilité, du téléchargement de mises à jour, de connexions partagées etc... A savoir que c'est très variable dans le cas de la vidéo YouTube et qu'il faudrait probablement faire un moyenne sur de multiples tests.

Enfin, les données utilisées sont un peu banales, mais dans des cas concrets, on peut espérer des gains encore plus important :

- l'affichage de graphiques en streaming à partir de données CSV présente un intérêt plus que certain. On verrait le graph se dessiner au fur et à mesure de l'arrivée des données. J'ai essayé de trouver un librairie de dessins de graphiques qui soit compatible avec cette approche, mais malheureusement, toutes les librairies n'acceptent que des données complètes ce qui dénote bien le problème qu'a posé la popularisation de JSON,
- si l'on prend l'exemple de Twitter et Facebook avec leur infinite scroll à la mode, on voit tout de suite l'intérêt d'afficher les données au flux,
- les systèmes de template Javascript pourraient remplir le DOM au fur et à mesure de l'arrivée des templates avec l'arrivée des données XHR. Rien n'empêche de mettre du HTML pas complètement chargé dans un DocumentFragment, de l'ajouter au DOM et de le remplacer par des données plus fraîches par la suite,
- enfin avec le texte brut, c'est encore plus simple. Le visiteur verrai son div se remplir au fur et à mesure de son chargement.

## Une norme oubliée

Je n'ai rien inventé, le streaming, c'est la norme. Il suffit de regarder comment fonctionne le chargement d'une page HTML pour se rendre compte que c'est le comportement de base des navigateurs.

Nous avons simplement oublié cela avec le passage à Ajax. Peut-être à cause de JSON, peut-être par ignorance. Bref, il est temps de grandir, et la soupe qui le permettra, c'est le streaming !

Petit ajout : Suite au commentaire de Pablo, j'ai fait la même expérience mais avec des graphiques. Le résultat est intéressant également.
