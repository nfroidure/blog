---
title: Design de bases de données MongoDB
description: Le design de bases de données MongoDB est une activité complexe qui nécessite d'avoir une profonde connaissance des implications des divers choix possibles.
leafname: design_base_donnee_mongodb
link:
  label: Techniques de conception MongoDB
  title: Découvrez quelques techniques et principes pour la conception de vos collections MongoDB.
date: "2015-03-28T12:40:32.000Z"
lang: fr
location: FR
keywords:
  - MongoDB
  - architecture
categories:
  - MongoDB
  - Base de données
---

# Design de bases de données MongoDB

Comme nous l'avons vu précédemment, la conception de bases de données avec MongoDB est [bien différente](./retour_xp_mongodb) de la conception avec les bases de données relationnelles.

Dans cet article, je vous propose d'aller un peu plus loin dans les techniques de conception de schéma avec MongoDB. Voici quelques conseils et patterns que j'ai eu à utiliser pour le backend de l'application SaaS que nous développons chez SimpliField.

## Collection != Modèle != Ressource

Les documents MongoDB sont stockés dans des collections. Cette appellation n'est pas innocente. Il faut voir une collection comme un amas de documents pas forcément uniformes et sans aucune corrélation avec les concepts que vous manipulez dans vos applications.

Ainsi, il ne faut pas chercher à associer les ressources de votre API REST aux collection MongoDB. Prenons, par exemple, la structure de document suivante :

```
{
  _id: ObjectId,
  user: {
    email: String,
    name: String
  },
  auth: {
    password: String
  },
  preferences: [{
    name: String,
    value: String|Boolean|Number
  }],
  tags: [{
    name: String,
    value: String
  }],
  locations_ids: [ObjectId],
  coworkers_ids: [ObjectId],
  updates: [{
    when: Date,
    by: ObjectId,
    ip: String
  }]
}
```

Pour une telle structure, on pourra trouver des points d'API de ce type :

- `GET /users` - Pour obtenir la liste des utilisateurs ;
- `POST /users` - Pour ajouter un utilisateur ;
- `GET|PUT /users/:id` - Pour lire/écrire un utilisateur ;
- `GET|PUT /users/:id/preferences/:name` - Pour lire/écrire une préférence ;
- `GET|PUT /users/:id/tags` - Pour lire/écrire les tags associés ;
- `GET|PUT /users/:id/locations` - Pour lire/éditer les lieux de l'utilisateur ;
- `GET|PUT /users/:id/coworkers` - Pour lire/éditer les collèges de l'utilisateur ;

On voit donc clairement ici le découplage total entre collections et ressources. Ici, on a une collection qui "contient" plusieurs ressources, mais dans d'autres cas, on peut avoir une ressource dont le contenu est réparti entre plusieurs collections. Ce serait le cas d'une ressource permettant d'accéder aux tags associés à tous les concepts du système (lieux, utilisateurs, produits...).

## Pas d'ODM

Puisqu'il n'y a aucune corrélation entre modèles, ressources et collections, je vous déconseille fortement l'utilisation d'ODM du type Mongoose. Je ne suis clairement pas fan de ce type d'outils pour les bases de données relationnelles mais dans le cas de MongoDB, ceci est d'autant plus vrai.

Pour tout dire, je l'ai appris dans la douleur. Mongoose a retardé ma compréhension de la philosophie de MongoDB. Qu'on adhère ou non à cette dernière, si on utilise MongoDB comme une base de donnée relationnelle, alors, on a le pire des deux mondes (et de gros problèmes de performances).

Si vous me demandez mon avis sur l'API du driver natif de MongoDB, je vous répondrai qu'il y a une bonne marge d'amélioration, mais cette dernière est encore le meilleur moyen de profiter de toutes les fonctionnalités qu'un ORM comme Mongoose vous cache.

Prenons l'exemple précédent, avec Mongoose, pour mettre à jour les lieux de l'utilisateur, vous feriez instinctivement ceci :

```js
// On s'assure que les ids donnés sont corrects
LocationModel.find(
  {
    _id: {
      $in: myNewLocationsIds,
    },
  },
  function (err, locations) {
    if (locations.length != myNewLocationsIds.length) {
      throw new Error("Bad locations ids");
    }
    // On met à jour l'utilisateur
    UserModel.find(
      {
        _id: ObjectId("abbacacaabbacacaabbacaca"),
      },
      function (err, user) {
        user.locations_ids = myNewLocationsIds;
        user.save();
      },
    );
  },
);
```

Sauf qu'ici, vous récupérez toutes les données des documents pour simplement modifier une propriété de celle-ci. Ce n'est pas très optimal et même contraire à l'esprit de MongoDB. Avec le driver natif, vous écririez simplement :

```js
// On s'assure que les ids donnés sont corrects
db.collection("location").count(
  {
    _id: {
      $in: myNewLocationsIds,
    },
  },
  function (err, count) {
    if (count != myNewLocationsIds.length) {
      throw new Error("Bad locations ids");
    }
    // On met à jour l'utilisateur
    UserModel.update(
      {
        _id: ObjectId("abbacacaabbacacaabbacaca"),
      },
      {
        $set: {
          locations_ids: myNewLocationsIds,
        },
      },
      { multi: true },
    );
  },
);
```

Certains argumenteront que Mongoose permet tout de même d'utiliser le driver natif, mais c'est moins visible et difficile de réexploiter la validation de Mongoose pour ces modifications en dehors de l'API Mongoose.

Si vous avez lu mon précédent article sur MongoDB, vous savez que la conception d'une base de donnée nécessite une réflexion au moment de l'implémentation et fonction des principes de MongoDB. Utiliser le driver natif vous garanti de ne pas y échapper.

## Découpler données et logique

Surtout, une fois débarrassé de Mongoose, ne vous précipitez pas pour créer votre propre ODM. Il faut considérer le contenu de vos collections comme des données que vous filtrerez en entrée comme en sortie avec des fonctions pures.

De cette façon, vous avez toute liberté pour utiliser vos fonctions de validation/transformation où bon vous semble, quand bon vous semble sans utiliser ces horribles choses que sont l'héritage et les mixins.

## Documents != Représentations JSON

Une autre erreur à ne pas commettre est de penser que la structure des documents de votre collection doit être la même que celle des représentations JSON de votre API REST.

En pratique, c'est souvent le contraire. Par exemple, dans la collection utilisateurs ci-dessus, on peut vouloir créer un point d'API qui expose l'utilisateur **et** ses préférences. On a donc une décorrélation entre la représentation d'un utilisateur au niveau de l'API REST et au niveau des documents de la collection MongoDB.

## Rien à la racine des documents

Une autre bonne pratique est d'éviter de stocker des propriétés d'un même concept à la racine des documents d'une collection. Par exemple, vous pourriez vous demander pourquoi j'ai créé une propriété `user` dans laquelle j'ai mis les informations concernant l'utilisateur plutôt que de simplement mettre ces propriétés à la racine.

La raison à cela est simple. Si un consommateur de l'API fait une requête `PUT` vers le point d'API `/users/:id`, alors, je vais modifier toutes les informations concernant l'utilisateur. Il sera bien plus simple de faire une requête de type `update` comme ceci :

```js
db.collection("users").update(
  {
    _id: userId,
  },
  {
    $set: {
      user: {
        name: "new name",
        email: "new@email.net",
      },
    },
  },
  { multi: true },
);
```

Comme vous pouvez le voir une fois encore, nos collections sont taillées selon l'usage que nous en faisons.

## Linéarisation de l'appartenance

On pourrait être tenté de donner à nos documents une structure qui reflète les relations d'appartenance entre les divers concepts qu'elles rassemblent. Par exemple, les préférences appartenant à l'utilisateur seraient peut-être mieux dans l'objet utilisateur.

C'est clairement une mauvaise idée. Toujours pour pouvoir modifier ces concepts simplement, il est généralement préférable de linéariser les concepts au sein des documents.

De la même façon, il est préférable d'aplatir les structures arborescentes dans un unique tableau quitte à la reconstituer en entrée et en sortie de votre API REST.

En effet, pour tirer parti des performances des pipes d'agrégation, c'est une véritable nécessité.

## Lazy embedding

Comme nous l'avions vu dans mon billet précédent, le point de compression des performances dans une application MongoDB est la gestion des relations inter collections. Puisqu'il n'existe pas de jointure, on fait parfois ce qui s'apparente au désormais bien connu `SELECT` dans une boucle honni des DBA.

Bien qu'il y aura toujours des cas où ce ne sera pas possible de faire autrement, toutes les stratégies sont bonnes pour les éviter. Parmi elles, la technique que j'appelle le lazy embedding permet de stocker ces relations dans les collections afin d'éviter de les requêter à chaque accès.

Imaginons que nous voulions donner le nom des lieux d'un utilisateur dans la ressource du même nom. Nous devrions effectuer une requête pour aller chercher l'utilisateur, puis, une autre pour aller chercher les noms de ses lieux :

```js
db.collection("user").find(
  {
    _id: ObjectId("abbacacaabbacacaabbacaca"),
  },
  function (err, user) {
    db.collection("locations").update(
      {
        query: {
          _id: {
            $in: user.locations_ids,
          },
        },
        fields: ["_id", "location.name"],
      },
      function (err, locations) {
        user.locations = locations;
      },
      { multi: true },
    );
  },
);
```

L'idée du lazy embedding est de faire cette requête à la première demande, d'envoyer le résultat à l'utilisateur puis de la stocker pour les prochains appels, ce qui donne :

```js
db.collection("user").find(
  {
    _id: ObjectId("abbacacaabbacacaabbacaca"),
  },
  function (err, user) {
    if (!user.locations) {
      db.collection("locations").find(
        {
          query: {
            _id: {
              $in: user.locations_ids,
            },
          },
          fields: ["_id", "location.name"],
        },
        function (err, locations) {
          user.locations = locations;
          db.collection("user").update(
            {
              _id: ObjectId("abbacacaabbacacaabbacaca"),
            },
            {
              $set: {
                _locations: locations,
              },
            },
            { multi: true },
          );
        },
      );
    }
  },
);
```

Bien entendu, dans les triggers de modification d'un lieu, nous devrons maintenant invalider les utilisateurs concernés par ce dernier :

```js
db.collection("user").update(
  {
    locations_ids: {
      $elemMatch: modifiedLocationId,
    },
  },
  {
    $unset: {
      _locations: "",
    },
  },
  { multi: true },
);
```

Forcément, ceci présuppose que vos utilisateurs sont bien plus souvent consultés que vos lieux ne sont modifiés ce qui est généralement le cas dans la plupart des applications.

Dans le cas contraire, grâce à la linéarisation, il reste possible d'utiliser cette stratégie. Par exemple, imaginons que les tags des lieux changent très souvent, si les documents de la collection lieux sont structurés comme nos documents utilisateurs, nous n'aurons pas de problème.

## Listes capées

Vous avez peut-être remarqué la propriété `updates` dans la structure des documents utilisateurs. C'est un tableau dans lequel on stocke les divers updates de l'objet à des fins de débogage a posteriori.

Cependant, il nous faut bien caper ce tableau pour éviter qu'il ne sature nos documents. On trouve dans les divers opérateurs une possibilité de réaliser ce type d'opération en une seule requête. Ainsi, la modification d'un utilisateur devient :

```js
db.collection('users').update({
  _id: userId
}, {
  $set: {
    'user': {
      name: 'new name',
      email: 'new@email.net'
    }
  }, {
    $push : {
      updates: {
        $each: [{
          when: new Date(),
          by: connectedUserId,
          ip: connectedUserIp
        }],
        $slice: -10
      }
    }
  }
}, {multi: true});
```

Cet exemple montre encore une fois l'intérêt du driver MongoDB natif. Comme il n'existe pas de notion de transaction en Mongo, nous devons tout faire pour limiter la concurrence des requêtes et quoi de mieux pour ce faire que de limiter leur nombre ?

Il y a encore tellement de techniques dont je n'ai pas parlé, mais cet article étant déjà très long, je vous dévoilerai certainement ces dernières dans d'autres billets.

En attendant, n'hésitez pas à me livrer les vôtres en commentaire ou à donner des alternatives aux techniques que je vous ai présenté.

Petite précision, j'ai du faire une modification des sources présentées dans cet article pour ajouter les options `{multi: true}` qui permettent aux requêtes de mise à jour de fonctionner sur plusieurs entrées. C'est un peu bizarre, mais c'est comme ça, par défaut les requêtes de mise à jour ne modifient que la première entrée.

Je vous propose de monter en abstraction en vous proposant [ma vision probabiliste de l'utilisation de MongoDB](./design_probabiliste_mongodb).
