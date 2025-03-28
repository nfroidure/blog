---
title: Comment bien designer les url de son site ou application web
description: Les URL ou URI d'une application ou d'un site Internet nécessitent de prendre un moment pour réfléchir à leur schema. Voici quelques bonnes pratiques issues de mon expérience REST.
leafname: bien_designer_url_site_applications_web
link:
  label: Design des URI
  title: En savoir plus sur la façon de schématiser les URL
date: "2012-06-30T10:02:27.000Z"
lang: fr
location: FR
keywords:
  - Applications
  - HTTP
  - REST
  - Services
  - Web
categories:
  - Applications Web
---

# Comment bien designer les url de son site ou application web

Les URL ou URI d'une application ou d'un site Internet nécessitent de prendre un moment pour réfléchir à leur schema. Voici quelques bonnes pratiques issues de mon expérience REST.

Suite à une question de [Nicolas Hoizey](https://github.com/nhoizey "Voir son profil") sur Twitter, j'ai décidé de parler un peu desURI,URL ou plus communément des adresses des pages web des sites Internet ou applications web. On pourrait croire que ces dernières ne nécessitent pas de se creuser la tête plus que cela, mais en fait elle sont fondamentales et nécessitent une réflexion de fond ainsi qu'une bonne compréhension des concepts sous-jacents.

## Tout est hyper-texte

L'origine des URI ou URL vient de la nature hypertexte du web. Lorsqu'il l'inventa, Tim Berners Lee voulu que le web soit hypertexte. Cela signifie, qu'il voulait que toutes les pages web puissent pointer vers n'importe quelle autre page web via un mécanisme qu'il appela hyperlien (ou tout simplement lien).

Pour cela, il fallu permettre de schématiser l'adresse d'une page web à l'aide d'une convention de nommage. C'est ici qu'interviennent les URIs et plus précisément leurs presque sous ensemble; les URL. Les URL donnent la possibilité de pointer vers une ressource (qui peut être une page web) grâce à un schema donnant le protocol à utiliser (HTTP, FTP, IRC etc...), le domaine et accessoirement une clé permettant de pointer vers une ressource particulière du serveur incriminé.

Nous voilà donc avec un serveur web à créer, qui doit exposer plusieurs ressources que nous pouvons indexer avec des clés que nous sommes dans l'absolu libres d'implémenter comme bon nous semble.

Seulement voilà, un serveur web doit se fondre dans la masse qu'est Internet et nous devons créer nos URL de la meilleure manière qui soit afin d'offrir un contexte d'utilisation optimal à nos clients (robots ou internautes).

## Un format compréhensible et prédictible

Selon les principes de REST, un bon format d'URL doit être compréhensible par un humain. Par exemple, l'URL `http://world.com/fr-FR/persons/nfroidure.html` est facilement apprehensible, même par une personne peu férue d'informatique. On comprend facilement qu'il s'agit de la représentation HTML de la personne `nfroidure` dans la langue française.

Elle est également prédictible car je peux en conclure qu'en remplaçant fr-FR par en-US, j'aurai la représentation en anglais si elle est prise en charge. Si je sais que `nhoizey` est une personne qui existe sur ce site, alors, en remplaçant `nfroidure`, je devrais accéder à son profil en HTML. Si le format JSON est pris en charge, je devrais pouvoir y accéder également en remplaçant html par json.

La hiérarchie est aussi importante.en supprimant /`nfroidure`, je peux faire le pari que la liste des personnes du site me sera présentée. Et si c'est le cas, je peux conclure que si je supprime la ressource `nfroidure`, alors, la ressource parente sera elle aussi différente lors de mon prochain accès. Cela est très important pour que les robots clients de votre API puissent mettre à jour leur cache de manière optimale.

## Ajoutons un peu de HTTP

Pour HTTP tout est ressource. Un peu à la manière de la POO, une personne est une ressource et la page HTML qui correspond à son profil est une représentation de cette personne.

Grâce à un mécanisme appelé négociation de contenu, un client, lorsqu'il effectue une requête HTTP vers une URL particulière transmet en entête une série d'information sur les types de représentation qu'il peut traiter.

L'entête Accept détermine quel format de représentation un client peut lire. `Accept-Language` détermine les langues que le client (ou plutôt que l'utilisateur du navigateur) peut lire. L'entête `Accept-Charset` donne les types de jeux de caractères autorisés par le système du client.

Si on reprend l'exemple précédent, une requête `GET` vers une URL du type `http://world.com/persons/nfroidure` est sensée vous fournir une représentation que votre navigateur peut interpréter en fonction des entêtes fournies par votre requête. Cela peut être du HTML, mais aussi un fichier MP3 dans le cas où l'accès se ferait via un hypothétique navigateur vocal n'acceptant que des fichiers audio.

Cependant, ces URL particulières que je nommerai URL abstractives ne sont pas des représentations. Elles sont des ressources qui peuvent potentiellement être servies sous différentes représentations possibles.

Grâce au mécanisme des redirections, le serveur redirige le client vers la bonne représentation. Pourquoi ne pas servir directement la représentation, sans redirection ? Pour des raisons pratiques. Un proxy HTTP public pourrait stocker une représentation et servir cette même représentation à des clients qui ne pourraient pas les interpréter et pour lesquels une autre représentation serait plus adéquat.

De plus, cela laisse la possibilité à l'utilisateur de pointer une ressource ou une représentation particulière d'une ressource. Imaginons que notre serveur web d'exemple propose une version JPG d'une personne. Je peut ainsi afficher une image dans une page web en allemand qui affiche cette ressource et j'ai l'URL vers la représentation exacte que je souhaite (ici: http://world.com/de-DE/persons/nfroidure.jpg).

## Merveilleux ! Sauf que.

Malheureusement, les navigateurs affichent toujours l'URL finale d'une redirection ce qui fait qu'un utilisateur peu averti, même s'il est aisé de le deviner, fera rarement un lien vers l'URL abstractive d'une ressource. La faute à qui ? Aux navigateurs ? Peut-être devraient-il proposer le choix entre les deux type d'URL afin d'éduquer les utilisateurs. Aux webmasters ? Peut-être aussi, les bonnes pratiques citées ici sont rarement respectées, même par les plus grands. Les utilisateurs n'ont donc pas l'habitude de considérer le format d'une URL comme représentatif du contenu qu'elle permet de consulter.

N'empêche que, ces bonnes pratiques sont géniales, si vous créez une API REST en respectant ces principes, ce sera un régal de l'utiliser et ce sera performant grâce à des caches bien rencardés. Et si vous créez juste un site web et que `DELETE` et `PUT` sont des gros mots pour vous, dîtes vous bien que quand vous déciderez de partir sur du REST, votre vie en sera facilitée.
