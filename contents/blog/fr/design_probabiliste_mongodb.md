---
title: MongoDB ou la conception probabiliste
description: Concevoir une base de donnée MongoDB c'est composer avec le hasard. Dans ce billet je vous propose de découvrir pourquoi et comment.
leafname: design_probabiliste_mongodb
link:
  label: MongoDB & le hasard
  title: Découvrez la philosophie que je développe sur MongoDB.
date: "2015-04-04T13:29:02.000Z"
lang: fr
location: FR
keywords:
  - MongoDB
  - architecture
categories:
  - MongoDB
  - Base de données
---

# MongoDB ou la conception probabiliste

Comme je ne vous ai pas tout dit dans mon [dernier billet sur le design de base de donnée avec MongoDB](./design_base_donnee_mongodb), je me fends d'un second billet plus généraliste sur la philosophie que je mets en œuvre pour la gestion d'une base de donnée MongoDB.

La majeure partie des décisions en matière d'architecture et de conception de schéma avec MongoDB se résume à un calcul de probabilité (les plus pessimistes diront risque) d'inconsistance des données. Et ça, pour un DBA, c'est plutôt, nouveau.

D'ailleurs, quand on gratte un peu la surface, on se rend compte que ces probabilités sont au cœur de la conception de MongoDB lui même. Pour illustrer ce fait, parlons un peu de l'ObjectId.

## ObjectId, the WTF primary key

Les clés utilisées par MongoDB, les [ObjectIds](https://docs.mongodb.com/manual/reference/method/ObjectId/), sont facilement reconnaissables sous forme de chaîne de caractère. Derrière cette séquence hexadécimale de 24 caractères (ex. : babacafebabacafebabacafebabacafe) se cache bien des concepts.

Contrairement aux clés auto-incrémentées que l'on observe dans la plupart, sinon la totalité, des bases de données relationnelles, les clés de MongoDB sont générées grâce à une combinaison de quatre valeurs (un timestamp représentant le nombre de secondes écoulées depuis l'Epoch Unix, un identifiant "machine", le pid du processus qui a généré l'ObjectId et enfin un compteur incrémenté automatiquement à chaque création d'id avec une valeur aléatoire comme base).

La question légitime que vous êtes probablement entrain de vous poser est pourquoi ? A première vue, c'est bien plus compliqué à retenir qu'un simple identifiant numérique.

La raison est simple : pouvoir créer un identifiant sans avoir besoin de synchroniser toutes les instances de MongoDB.

En effet, il est déjà difficile [d'incrémenter un simple un entier](http://highscalability.com/blog/2015/3/9/the-architecture-of-algolias-distributed-search-network.html "Voir un article sur l'infrastructure d'Algolia traitant de ce sujet") entre les diverses instances d'un cluster alors imaginez si c'était le cas pour toutes les collections de MongoDB. Le parti pris est donc de créer cette clé unique d'une façon telle qu'il devient impossible de créer la même clé sur deux instances différentes.

Ou presque ;). Il existe bel et bien une probabilité que ceci arrive, mais cette dernière est tellement faible qu'elle devient négligeable. En effet, il faudrait que deux machines, ayant chacune un processus avec le même pid (ou [identifiant de processus](https://fr.wikipedia.org/wiki/Identifiant%5Fde%5Fprocessus)) et le même identifiant machine, créent dans la même milliseconde, un ObjectId alors que leur compteur interne a la même valeur.

Dans la conception d'API REST, cette caractéristique devient même un précieux avantage puisqu'elle permet de générer l'ObjectId de cette ressource directement sur le client qui consomme cette même API. Ainsi, tirer avantage des requêtes créationnelles idempotentes du type PUT et PATCH devient un jeu d'enfant. En embarquant une bibliothèque permettant de [générer des ObjectIds](https://github.com/justaprogrammer/ObjectId.js) on peu s'assurer de l'unicité des ressources créées côté mobile malgré les très probables coupures intempestives typiques des connexions itinérantes.

## Transactions optimistes

MongoDB ne propose pas de système de transaction. C'est d'ailleurs ce qui m'a rebuté de prime abord quand j'ai découvert MongoDB. Les données étant le cœur de tout système, ne pouvoir garantir l'état de ces dernières et risquer de les voir lentement se dégrader est inenvisageable pour un concepteur de service web qui se respecte.

Alors que faire ? Faîtes comme dans la vraie vie. Quand vous prenez votre voiture pour aller chercher du pain, vous savez que ce n'est pas sans risque. Vous pourriez crever un pneu, avoir un accident etc... Malheureusement, vous ne pouvez pas réduire le risque à néant.

En sortant quand même de chez vous, vous arbitrez sur le fait que ces risques sont somme toute négligeables et que la seule façon d'arriver à vos fins efficacement est de prendre ce risque. Vous le prenez cependant de manière intelligente.

Vous avez un véhicule contrôlé techniquement tous les deux ans, vos pneus sont vérifiés régulièrement. Vous avez mis en place toute une batterie de mesures pour réduire ce risque.

Vous avez également une roue de secours, une trousse de premier soins, un chasuble peut-être même une couverture au cas où vous seriez bloqué par la neige. Vous avez pris des mesures pour anticiper ce risque, pour être prêt si par malchance il se réalisait.

Bref, vous faîtes une transaction optimiste. Selon toute vraisemblance dans 20 minutes vous serez de retour chez vous avec du pain. Et vous pourrez passer à l'opération suivante, préparer le petit déjeuner.

Là où les bases relationnelles sont basées sur le fait qu'avec les transactions, théoriquement, il n'y a aucun risque, les bases de données NoSQL se basent sur le fait que généralement, tout se passe bien.

C'est pourquoi la conception avec MongoDB est plus complexe. Elle demande une bonne réflexion et une bonne capacité à mesurer et anticiper les risques là où une conception relationnelle demande simplement du formalisme.

Reprenons mon exemple du billet précédent dans lequel on met à jour les lieux associés à un utilisateur :

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

Quels sont les risques ? La majorité des risques se situent souvent entre deux requêtes (d'où l'intérêt des techniques présentées dans l'article précédent pour les limiter). Le risque se situe donc entre la vérification de l'existence des lieux liés et la liaison effective des lieux dans le document correspondant à l'utilisateur.

Pour que ce risque se réalise, il faudrait que l'un de ces lieux soit supprimé entre la requête de vérification et celle de modification. Soyons clairs, ce risque bien qu'existant est infime. Il est si infime, qu'on ne peut pas vraiment le réduire. On peut, par contre, très certainement l'augmenter en utilisant Mongoose ;) (voir billet précédent).

En revanche, puisque le risque existe, il s'agit de ne pas l'ignorer. Accepter la probabilité qu'un accident survienne en allant chercher du pain ne signifie pas mettre des œillères et se retrouver dépourvu face à sa réalisation.

Plusieurs stratégies peuvent être mises en œuvre pour pallier à ces risques, parfois conjointement.

#### Résilience face à l'inconsistance

La première stratégie qui, selon moi, se doit d'être automatique. Votre plateforme se doit de continuer de fonctionner en cas d'inconsistance. Dans le cas de l'exemple ci-dessus, si il s'avère qu'un lieu n'existe plus quand vous cherchez à obtenir la liste des lieux d'un utilisateur, vous devez donc silencieusement l'invalider et non renvoyer une erreur aux consommateurs de votre API. Vous devez aussi logger cette erreur avec une flag reconnaissable pour votre supervision.

Typiquement, l'architecte logiciel se chargera d'ajouter des tests à la base de code pour les risques d'inconsistance identifiés et acceptés par sa conception de façon à alerter les développeurs de ces derniers. Au niveau code, ceci donnerait :

```js
// Récupération des identifiants des lieux de l'utilisateur
db.users.find(
  {
    query: {
      _id: ObjectId("abbacacaabbacacaabbacacaabbacaca"),
    },
    fields: ["locations_ids"],
  },
  function (err, results) {
    // Récupération des lieux
    db.locations.find(
      {
        query: {
          _id: {
            $in: results[0].locations_ids,
          },
        },
        fields: ["location"],
      },
      function (err, results) {
        // On a uniquement les lieux trouvé donc, si un identifiant était
        // mauvais, osef
        var locations = results.map(function (result) {
          return result.location;
        });
      },
    );
  },
);
```

Ici, le système de querying de MongoDB nous épargne la peine de prendre le cas en charge dans le code.**Il doit cependant, je le répète, être pris en charge par les tests.**

#### Contrôle d'intégrité périodique

Votre base de donnée peu devenir inconsistante. Donc, créez des scripts ! Ça peut paraître bête, mais créer des scripts pour contrôler et réparer les possibles inconsistances de votre base MongoDB est un excellent moyen de lutter contre elles. Ces scripts peuvent également servir de reminder de toutes les inconsistances possibles.

Vous serez également bien contents de les avoir sous la main dans la cas où une inconsistance surviendrait plus souvent que prévu. Afin de pouvoir les utiliser comme palliatif le temps de réduire la probabilité de leur survenance grâce aux techniques que je vous ai présenté.

#### Contrôle et traitement opportuniste d'intégrité

Mais il y a mieux :). Dans notre exemple de code tolérant à l'inconsistance, je vois une belle opportunité de gérer à posteriori les inconsistances. En effet, puisque nous avons fait les requêtes permettant de voir l'inconsistance, pourquoi ne pas la corriger ?

```js
// Récupération des identifiants des lieux de l'utilisateur
db.users.find(
  {
    query: {
      _id: ObjectId("abbacacaabbacacaabbacacaabbacaca"),
    },
    fields: ["locations_ids"],
  },
  function (err, results) {
    var locationsIds = results[0].locations_ids;
    // Récupération des lieux
    db.locations.find(
      {
        query: {
          _id: {
            $in: locationsIds,
          },
        },
        fields: ["location"],
      },
      function (err, results) {
        // On a uniquement les lieux trouvé donc, si un identifiant était
        // mauvais, osef
        var locations = results.map(function (result) {
          return result.location;
        });
        // Petit ajout pour traiter les inconsistances
        var badLocationsIds = locationsIds.filter(function (locationId) {
          return locations.every(function (location) {
            return location._id.toString() !== locationId.toString();
          });
        });
        // Si on en a, on fait la requête qui va bien
        if (badLocationsIds.length) {
          db.users.update(
            {
              _id: ObjectId("abbacacaabbacacaabbacacaabbacaca"),
            },
            {
              $pullAll: {
                locations_ids: badLocationsIds,
              },
            },
          );
        }
      },
    );
  },
);
```

On peut s'inquiéter de l'empreinte de cette correction d'inconsistance sur les performances du système. Il faut cependant tempérer cette crainte par le fait que les inconsistances dans un système bien conçu sont rares.

De plus, il est possible d'utiliser la fonction `setTimeout()` de JavaScript pour découpler ces vérifications du reste du code pour ne pas nuire aux performances si cela s'avérait nécessaire.

#### Isolation

Vous avez probablement remarqué que les risques d'inconsistances sont souvent dûs à la concurrence possible sur les même données de deux utilisateurs différents de votre API.

La résultante de ceci est bien sûr que le trafic sur votre plateforme change totalement les probabilités d'inconsistance. Ainsi, si vous avez un seul utilisateur elles sont quasi nulles, en revanche, si des millions d'utilisateurs l'utilisent, elles deviennent plus probables.

Un bon moyen de limiter les inconsistances est donc la création de silos artificiels. Par exemple, si votre plateforme contient des organisations différentes et qu'aucun document n'est partagé entre deux organisations à aucun moment, félicitations, vous avez divisé le risque d'inconsistance dû au trafic par le nombre d'organisations existantes.

#### Supervision

Traiter silencieusement les inconsistances n'est pas suffisant. Vous devez recueillir du feedback sur ces dernières de manière à pouvoir faire évoluer votre système en connaissance de causes.

La supervision et l'analyse des logs doit être une priorité. Par chance, les inconsistances sont sensées être rares. C'est pourquoi, ceci ne devrait pas être trop compliqué à gérer. Je suis pour ma part, partisan de l'envoi de mail à chaque inconsistance tant que c'est soutenable (l'idée est de tout faire pour que ça le reste ;) ).

Toutes ces stratégies permettent de gérer l'incertitude pour obtenir un système scalable. Ce qui est clair, c'est que cette nouvelle façon d'appréhender la gestion des données m'a clairement fait sortir de ma zone de confort, mais l'essentiel est d'avoir retrouvé un niveau de confiance presque équivalent à celui induit par l'utilisation d'une base de données relationnelle.

## Inception

On pourrait ébrécher cette confiance en réfléchissant à toutes les stratégies mises en œuvre ci-dessus. Puisqu'elles-mêmes agissent sur les données, elles peuvent donc également générer des inconsistances.

Il est possible que la suppression d'un identifiant de lieu dans la liste des lieux d'un utilisateur supprime en fait une association parfaitement légitime.

En effet, on a vu qu'il était possible que deux identifiants MongoDB soient créés en même temps et soient identiques. Il est donc possible qu'un lieu soit créé avec l'un de ces identifiants et associé à l'utilisateur alors même qu'on est entrain de supprimer cet identifiant par ailleurs pour rétablir une intégrité supposée :).

## Conception organique

J'aime bien le terme de conception organique. Là où les bases de données relationnelles sont comme une négation de la nature imprévisible de l'univers, MongoDB impose une conception qui rejoint l'approche naturelle. Une conception organique.

J'aime cette vision philosophique de l'état d'un système qui jongle avec les probabilité et compose avec l'infini. MongoDB, c'est aussi une conception optimiste, car oui, dans la nature, les choses se passent plus souvent bien que mal.

J'aime ces points de jonction entre la science et la vie. N'est-ce pas ainsi qu'on explique désormais la plupart des mystères de l'univers ?

Toutes les bonnes choses ont une fin, je pense que je reparlerai de MongoDB sur ce blog, en attendant, n'hésitez pas à donner votre avis. Désolé pour les gifs :p.
