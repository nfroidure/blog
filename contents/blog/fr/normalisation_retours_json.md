---
title: Normalisation des retours JSON
description: Peu de gens pensent à normaliser les JSON en début de projet. C'est dommage car c'est le meilleur moment pour.
leafname: normalisation_retours_json
link:
  label: Normalisation JSON
  title: Voir comment créer des JSON qui roxxent
date: "2017-03-03T10:07:32.000Z"
lang: fr
location: FR
keywords:
  - JSON
  - REST
  - Architecture
categories:
  - Applications Web
---

# Normalisation des retours JSON

**TL; DR:**

```
{
  items: [1, 2, ...otherUsersIds],
  users: {
    '1' : {
      content: {
        id: 1,
        name: 'Popol',
        organization_id: 1
      },
      avatarURL: '//img.ur/trololol.png'
    },
    ...otherUsers
  },
  organisations: {
    '1': {
      content: {
        id: 1,
        name: 'Popol inc.',
        owner_id: 1
      }
    }
  }
}
```

Cela fait un moment que je souhaite écrire ce billet, notamment à l'usage de référence pour les personnes à qui je parle de ma façon de designer les retours de mes APIs.

Si vous n'avez pas ragequit ce blog à la suite de son TL;DR, laissez moi vous expliquer pourquoi j'ai fini par utiliser cette structure pour mes retours JSON.

## Normalisation

À ne pas confondre avec standardisation ou structuration. Ici, j'entends le terme normalisation comme on l'entendrait dans une base de donnée relationnelle mais pour un seul retour JSON.

Souvent, dans de nombreuses API, la décision est prise d'embarquer des ressources relatives à une ressource retournée par un point d'API. Par exemple, un `GET /users/:userId` pourrait retourner aussi l'organisation ou les organisations de ce dernier.

Certains diront que c'est le moment où il faut envisager d'utiliser GraphQL. Je ne serais pas aussi catégorique. Je ne vois pas de souci majeur à ajuster légèrement un retour pour apporter des informations supplémentaires. Après tout les principes RESTful autorisent plusieurs représentations d'une même ressource donc pourquoi s'en priver ?

En revanche, l'erreur à ne pas commettre est d'embarquer les ressources liées directement comme propriété de ce dernier. En effet, ceci a pour effet que si deux utilisateurs ont la même organisation, celle-ci se retrouve en double dans le retour JSON.

Vous comprenez donc certainement mieux le TL;DR de ce billet. La structure que j'utilise dans mes JSON permet d'éviter ce problème.

Vous remarquerez également que la liste des items d'une collection n'est pas directement dans la collection, mais seuls leurs identifiants apparaissent. La raison est que cela permet d'avoir des collections qui se répètent. Par exemple, un point d'API `GET /usersQueue` pourrait lister plusieurs fois le même utilisateur car ce dernier aurait réservé plusieurs slots dans une file d'attente. Autre avantage, le user propriétaire de l'organisation de mon exemple peut être retrouvé facilement dans le JSON.

Vous pourriez me rétorquer “Et pourquoi pas JSON Reference ?”. Pour rappel, [JSON reference](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03) est une spécification qui vise à pouvoir utiliser des références à d'autres valeurs du JSON lui-même afin de pouvoir créer des références circulaires.

Trois raisons m'en empêchent :

- la première est que je souhaite pouvoir désérialiser mes JSON avec le parseur natif sur tous les navigateurs. Cela, bien entendu, pour des raisons de performances. Un navigateur passe son temps à désérialiser du JSON, il est donc hors de question de faire cela en JS avec un polyfill de JSON reference;
- la seconde est que je veux également pouvoir croiser mes objets de façon transversale. En maintenant des stores d'objets je peux dupliquer les références sur toute mon application et ainsi optimiser la consommation mémoire de l'application entière. Avec ce format, un simple `Object.assign` dans mon [wrapper d'API](./generation%5Fapi%5Fcliente.html) suffit;
- la dernière est que je ne veux pas polluer mes objets, ce qui me permet de transitionner en douceur sur le point suivant.

## Ségrégation

En général, la représentation d'une ressource contient deux sortes d'informations. Les données normalisées (encore ;)) sont souvent stockées dans la base de données. Il s'agit de l'essence de la ressource. C'est souvent sur ces données que votre CRUD va agir dans une application. C'est également celle-là que vos appels PUT enverront.

C'est pour cela que je les ségrègue dans une propriété `content`. La convention est que son contenu est ce qui peut-être modifié directement par les utilisateurs. Ainsi, pas de filtre à appliquer, dans le front pour extraire les données modifiables.

Le second type de données sont ce que j'appelle les données calculées. Ces dernières sont utiles uniquement pour l'affichage de la ressource et ne peuvent être modifiées directement. C'est le cas du lien d'avatar dans mon exemple, mais c'est aussi le cas des dates d'enregistrement dans les bases de données.

## Composition des JSON Schemas

J'aime beaucoup JSON Schema mais il faut bien l'avouer : rien n'est plus saoulant que de les définir. Cette façon de faire permet de réutiliser les définitions simplement afin de construire sa définition Swagger de façon la moins répétitive possible. Voici comment je définirai le JSON Schema de la représentation utilisée en fil rouge de ce billet :

```js
const userSchema = require("user");
const organizationSchema = require("organization");
const { idSchema, idPattern } = require("utils");

module.exports = {
  title: "Users collection",
  type: "object",
  additionalProperties: false,
  properties: {
    items: {
      title: "User's identifiers for the queried collection.",
      type: "array",
      items: idSchema,
    },
    users: {
      title: "Users hash",
      description: "A hash containing users in the items collection.",
      type: "object",
      patternProperties: {
        idPattern: userSchema,
      },
    },
    organizations: {
      title: "Organizations hash",
      description:
        "A hash containing organizations linked to users in the collection.",
      type: "object",
      patternProperties: {
        idPattern: organizationSchema,
      },
    },
  },
};
```

Et voilà ;). Vous savez tout ! N'hésitez pas à me fournir vos astuces personnelles pour structurer et normaliser vos retours JSON !

**Ajout de dernière minute :**  
 Kévin Dunglas, un nordiste très actif dans les communautés PHP/REST a cité sur Twitter les standards suivants comme substitutifs à la structure présentée dans cet article :

- [JSON-LD :](http://json-ld.org/) une alternative à l'utilisation de JSON Reference cité ci-dessus. Je n'ai pas choisi ce format car pour moi il mélange définition des données avec les données elle-mêmes. Au delà de l'overhead en taille causé par l'utilisation des URIs en lieu et place des identifiants ainsi que celui causé par l'ajout d'informations de typage, je le trouve moins lisible. De plus, il rend moins efficace la désérialisation du JSON car on compare des chaînes de caractères bien plus longues et l'on doit constituer les hashs après la désérialisation.
- [Hydra :](http://www.hydra-cg.com/spec/latest/core/) permet d'ajouter plus d'informations de "type" par dessus JSON-LD comme les opérations que l'on peut réaliser sur la ressource. Le fait d'étendre JSON-LD l'écarte de fait dans mon cas, il va plus loin, mais dans la mauvaise direction selon moi.
- [HAL :](http://stateless.co/hal%5Fspecification.html) je ne connaissais pas. Allez sur le site scrollez sur le premier JSON et voyez si vous avez envie de lire ce dernier. Je ne crée pas les APIs pour les robots, mais pour les humains. Pour les robots, une fois encore, il y a le fichier Swagger.

Je n'ai pas parlé de l'hypermédia, mais cela va de soi. Les JSON doivent être hypermédia et la concision les a exclu de cet article. Cependant, aujourd'hui, n'importe quel explorateur de JSON sait afficher les URL où qu'elles se trouvent et le fichier Swagger saura spécifier aux robots les URLs qu'ils peuvent explorer.

Swagger/OpenAPI sont des standards ouverts et permettent un grand nombre de choses : génération de l'API cliente pour tout un tas de cibles, tooling et génération de documentation. C'est le standard ouvert que j'ai décidé d'utiliser car il apporte une bonne séparation entre définition et données tout en laissant toute latitude au développeurs pour apporter leur propre valeur ajoutée.

J'ai beaucoup de respect pour ceux qui créent les standards et je pense que tous les standards valent la peine d'être considérés. Je me réserve en revanche le choix des armes. N'oublions pas qu'XML est un standard, tout comme [JSONX](https://www.ibm.com/support/knowledgecenter/SS9H2Y%5F7.1.0/com.ibm.dp.doc/json%5Fjsonx.html) ;). Il ne faut pas suivre bêtement un standard, mais choisir celui qui nous convient, celui qui nous permet d'être productif. Swagger est clairement mon choix de prédilection. Il est à l'image de JavaScript. Il va droit au but et reste suffisamment simple à l'usage. D'ailleurs, je suis réservé sur les évolutions apportées par OpenAPI, j'ai peur que cela ne soit plus le cas. Mais bon, d'ici là, peut-être qu'un nouveau standard pointera le bout de son nez ;).

![Dessin hunoristique XKCD sur les compétition entre standards](https://imgs.xkcd.com/comics/standards.png)  
[Source: XKCD](https://xkcd.com/927/)

Enfin, utiliser un standard n'est même pas une obligation. Innover c'est souvent tout l'inverse. Les exemples ne manquent pas, mais voici le dernier en date qui m'a complètement scié et m'a pousser une fois encore à remettre en question mes idées reçues :
