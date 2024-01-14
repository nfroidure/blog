---
title: Créer un service REST
description: REST est de plus en plus utilisé pour la création de services web. J'ai moi-même créé un framework basé sur ce principe. Découvrez mes petits plus pour créer un bon service REST !
leafname: creer_un_bon_service_rest
link:
  label: Un bon service REST
  title: En savoir plus sur ma façon de créer un service REST
date: "2012-10-06T13:04:04.000Z"
lang: fr
location: FR
keywords:
  - REST
  - HTTP
  - Services
  - Web
categories:
  - Applications Web
---

# Créer un service REST

---

⚠ Attention: Bien que la plupart des principes décrits dans cet article restent valables, l'implémentation PHP décrite n'est plus utilisée. J'utilise maintenant [Whook](https://github.com/nfroidure/whook) qui améliore ces principes tout en utilisant une stack moderne basée sur NodeJS.

---

REST est de plus en plus utilisé pour la création de services web. J'ai moi-même créé un framework basé sur ce principe. Découvrez mes petits plus pour créer un bon service REST !

En effet, REST est à la mode, mais bien que ce type d'architecture soit le meilleur selon moi, l'implémentation doit être bien cadrée pour arriver à un résultat intéressant. La première condition est de bien connaître les principes fondamentaux de l'architecture orientée ressource.

## Présentation de REST

REST (Representational State Tranfert) est une architecture épousant les principes fondateurs du web et de son protocole originel : HTTP.

Ainsi, chaque donnée exposée par une application web est représentée par une URI (Uniform Ressource Identifier). Cette URI est un identifiant permettant d'effectuer diverses opérations sur la dîte ressource grâce aux verbes HTTP (ou méthodes HTTP).

Le plus connu étant `GET` qui permet de récupérer un état (ou représentation) d'une ressource. Ceux les plus utilisés étant `POST` (peu utilisé dans une approche REST pure), `PUT`, `DELETE`, `OPTIONS`, `HEAD`.

REST peut-être complémenté des principes dits RESTful que l'on retrouvera dans le fameux livre Services Web RESTful de Leonard Richardson et Sam Ruby aux éditions O'Reilly. Voyons les principes que j'ai repris.

### Respect de l'interface uniforme

Chaque verbe HTTP doit être utilisé en connaissance de cause en fonction de ses caractéristiques propres.

**`GET`, `PUT` et `DELETE` doivent être idempotentes.** Cela signifie que répéter plusieurs fois la même requête doit mener au même résultat à chaque fois. Imaginez que vous envoyez une requête `PUT` qui enregistre le contenu d'une entrée de base de donnée. Malheureusement un problème de réseau vous empêche de recevoir la réponse à cette requête.

Vous êtes alors incapable de déterminer si la requête n'a pas du tout été traitée (l'entrée n'a pas été modifiée) ou si elle a été traitée, mais que vous n'avez pas reçu la réponse le confirmant à cause de la coupure. La nature idempotente de `PUT` vous permet de renvoyer la requête en étant certain que celle-ci fonctionnera, que le serveur ait pris en compte la précédente ou non, et que la réponse envoyée sera identique en tout point à celle que vous auriez reçu si il n'y avait pas eu cette déconnexion.

**`GET` et `HEAD` doivent être sûres.** Votre implémentation de `GET` et `HEAD` doit assurer à ses utilisateurs que les requêtes `GET` et `HEAD` ne changent jamais l'état du système. Ils ne doivent entraîner aucun effet de bord qui pourrait rendre leur utilisation non-sûre.

### Respect de la nature sans état de HTTP

Chaque requête doit être complètement indépendante des autres requête. Les sessions et autres cookies doivent être bannis de votre implémentation. Cela devient le rôle du répartiteur de charge de s'en préoccuper en surcouche de votre service. Il en résulte l'utilisation de l'identification HTTP (`Basic`, `Digest`) ou d'un système de token distribué à tous les utilisateurs de votre API REST.

### Une représentation, une ressource

Le mécanisme de négociation de contenu de HTTP est très puissant pour fournir une représentation d'une ressource adaptée à ses préférences utilisateur : langue parlée (entête `Accept-Language`), type de contenu acceptés (entête `Accept`) etc... Cependant, l'implémentation de ce mécanisme doit, par le biais de redirections 301, rediriger vers l'URI qui désigne la représentation adéquate de la ressource. Ainsi, on distingue les ressources négociables (qui mènent toujours à une redirection 301) et les ressources qualifiées (qui pointent vers une représentation donnée d'une ressource). Vous pouvez vous référer à [ce billet qui traite la question des uri](./bien_designer_url_site_applications_web "En savoir plus sur les URI") plus en profondeur.

## Mes principes complémentaires

REST est une très bonne base, mais pour plusieurs raisons techniques, j'ai dégagé des principes complémentaires qui gagnent à être exploités dans votre implémentation.

### Unicité stricte des URI

Deux URI ne peuvent exposer une représentation de ressource identique. Il faut donc s'assurer de l'unicité des URI par divers moyens : ordre stricte des paramètres de requête (query params), et même de leur valeurs lorsqu'elles peuvent provoquer un doublon.

Par exemple, dans mon implémentation, cette uri est valide : `/db/mabase/matable/list.dat?limit=20&orderby=title`, mais pas celle-ci : `/db/mabase/matable/list.dat?orderby=title&limit=20`. Cette dernière retournera une erreur `HTTP 400 Bad Request`. En effet, si la deuxième version était permise, alors ces deux URIs exposeraient exactement la même chose. On pourrait alors se retrouver avec un cache qui contiendrait deux fois la même chose ce qui serait inefficient.

Il en est de même pour l'URI `/test.dat?param=a¶m=b` qui est valide et `/test.dat?param=b¶m=a` qui ne l'est pas. Ici, le principe est que les valeurs soient classées dans l'ordre alphabétique.

Le résultat de ceci fait que le tableau PHP `$_GET` devient inutilisable. J'ai donc réécrit un parser respectant la précédence des paramètres et des valeurs.

### Ressources composites

Le concept de ressource composite repose sur la formule suivante avec A et B étant des ressources :

Si **A ∩ B ≠ 0** alors **A c B || B c A** (si l'intersection entre les ressources A et B n'est pas nulle, alors A inclus B ou B inclus A).

Par exemple, si la génération d'une représentation nécessite l'accès à une autre ressource, cet accès doit être effectué via l'interface uniforme. De cette façon, si la ressource qui entre dans sa composition est déjà présente dans le cache, cette dernière ne sera pas à nouveau régénérée.

Le respect de cette règle n'est pas stricte et dépend des considérations en matière de performance et admet quelques exceptions. Par exemple, il faut éviter d'appliquer ce principe lorsque l'accès à deux ressources interrogeant le serveur SQL diviserait en deux une récupération d'informations qui auraient pu être obtenues en une seule requête SQL.

### POO au service de REST

Les concepts de la Programmation Orientée Objet se subliment avec l'utilisation de REST, comme la surcharge des exceptions pour les rendre compatibles avec REST. L'idée est qu'au sein d'une architecture REST, les exceptions sont des codes d'erreurs HTTP directement transmissibles aux clients.

J'ai également utilisé le chargement de classe dynamique pour ne charger que ce qui est nécessaire à la fourniture d'une ressource. L'héritage est également une bonne façon de déclarer les filiations entre les divers ressources.

## Détails de mon implémentation

### Interface uniforme pour toutes les ressources

REST est un goulot d'étranglement grâce auquel on va pouvoir agir de manière standardisée sur toutes les ressources exposées. La première étape a été l'exposition des principales ressources nécessaires à une application/un site sous forme de drivers REST dont voici les plus remarquables :

- Db : ce driver permet d'accéder à tous les niveaux d'un base de donnée (liste des bases, liste des table, liste des entrées, entrées). C'est une sorte d'ORM fournie au format REST. Par exemple, `GET /db/matable.dat` expose le schema de la table `matable`.
- Fs : ce driver permet d'accéder au système de fichier (contenu des fichiers et des répertoires). Il possède plusieurs variantes : `fsi` pour la récupération des informations, `mpfs` qui est un clone de `fs` mais en environnement multipath (cf `ini_path` de `php.ini`).
- Http : fait office de proxy http.
- Feed : met à disposition un ou plusieurs flux RSS/Atom.
- App : simple moteur de template/localisation pour applications web.
- Site : driver servant à la mise en place de sites web.
- Cache : Le cache lui même est une ressource, on peut donc agir sur ce dernier via l'interface uniforme.
- Auth : L'authentification et les droits qu'elle concède est encapsulée dans un driver REST permettant une mise en cache de celle ci par exemple.

On peut imaginer des tas d'autres drivers comme pour la minification des fichiers (minfs?), le redimensionnement à la volée d'images/vidéos etc...

L'utilisation de cette interface uniforme pour toutes les ressources exploitables permet d'agir sur toutes ces ressources de manière macroscopique grâce à différents systèmes listés ci dessous.

### Mis en cache des ressources

Plus la peine de gérer de nombreux caches compliqués pour chaque source de données, le cache est implémenté directement au nouveau de REST. Il se compose de trois niveaux. L'un côté client/proxy, habituel, mais ici bien plus puissant car le respect de la nature de HTTP permet son fonctionnement optimal. Les deux autres côté serveur. Un « compteur » de ressource interne à chaque instance de PHP garde une référence à chaque objet accédé afin d'éviter deux accès pour une même ressource (important pour les ressources composites complexes). Un système de cache (XCache, APC, ou Fs) stocke le résultat des ressources pouvant être cachées et réutilisées par d'autres instances de PHP.

Pour ce dernier un système de Callback garanti qu'une ressource composite sera bien supprimée dans le cas où une des ressources la composant serait modifiée. Plus généralement, un `GET` permet la mise en cache alors que les requêtes de type `POST`, `DELETE` et `PUT` génèrent un nettoyage a postériori des ressources liées.

Le cache est optimisé car une application web est susceptible d'accéder aux mêmes ressources que le site web réduisant ainsi les redondances au sein du cache. En effet, si j'accède à la ressource `/db/mabase/users/1.dat` dans une page du site générée côté serveur ou si j'y accède directement via HTTP depuis un javascript utilisant `XMLHttpRequest`, je suis sûr qu'au moins une des deux requêtes sera servie à partir du cache.

### Gestion des droits

Les droits son gérés à l'aide de masques sur les URI permettant une gestion très fine des autorisations des différents utilisateurs. Ces droits peuvent être associés directement à l'utilisateur ou via les groupes auxquels il appartient. De plus, les différents verbes HTTP (`GET`, `PUT`, `DELETE`, `POST`) représentent divers niveau d'accès aux ressources qui peuvent également être accordé ou non en fonction des utilisateurs.

### Gestion des connections instables

L'avantage de l'idempotence des requêtes est qu'on peut tout à fait faire plusieurs requêtes `GET`, `DELETE` ou `PUT` plusieurs fois sans qu'il y ait d'effet de bord. Par exemple, dans une application HTML5, on peut tout à fait créer un mécanisme générique de rétention des requêtes HTTP idempotentes tant qu'aucune réponse n'est reçue. Dans mon cas, cela a été implémenté grâce à localStorage (avec une limite néanmoins dans la taille du stockage).

Ainsi, si une requête est exécutée deux fois, cela est sans incidence sur l'intégrité dus systèmes et des données. Dans une certaine mesure, on peut « enrober » une requête `POST` pour obtenir un comportement équivalent.

### Tests unitaires

L'uniformité des ressources REST permet d'implémenter un système simple de tests unitaires, soit en ligne de commande avec curl, soit comme dans notre cas en créant une ressource dédiée. L'avantage est que l'on écrit moins de tests tout en garantissant le bon fonctionnement de l'application. On crée plusieurs scénarios d'utilisation composé d'une suite de diverses requêtes et on compare les résultats (entêtes, code HTTP, contenu) à ceux attendus.

### Répartition de charge

On peut tout à fait tirer parti de cette interface uniforme pour répartir la charge sur différents serveurs (serveur de ressources SQL séparé par exemple) grâce à un routage fin en amont (proxy ou server apache avec rewrite rules).

## Bientôt chez vous

Cette implémentation PHP est déjà utilisée chez un client et au sein de mon entreprise pour la gestion des relations client et la comptabilité. Je dois encore lui trouver un nom et supprimer quelques dépendances vis à vis du CMS interne de la boîte et son code sera disponible sous double licence : GNU/GPL + Licence commerciale pour ceux qui voudraient pouvoir garder leurs modifications secrètes.

Je compte offrir des licences commerciales aux contributeurs les plus fréquents. L'objectif de cette double licence étant que les amateurs du gratuit qui ne contribuent jamais supportent les contraintes de la licence GNU/GPL.

En attendant, je cherche des développeurs PHP intéressés par ce projet, prêts à m'aider à le finaliser, à l'utiliser et à me faire des premiers retours afin de mettre en ligne une version plus stable, plus universelle et surtout avec déjà une petite communauté capable de réagir en cas de bug ou de faille de sécurité.

Les manques actuels sont : une installation facilitée grâce à des tutos/scripts, plusieurs contextes d'utilisation afin de valider la pluralité des champs d'application et le support de la plateforme Windows voire de plateformes plus hétérogènes que mon Debian Squeeze + MPM Prefork + MySQL.

Bref, toutes les bonnes volonté peuvent [me contacter](/contact "Me contacter") à ce sujet. De mon côté, je prépare une démo en ligne pour tester le framework à sa guise. Vous serez tenus au courant sur ce blog de la suite des évènements.
