---
title: "MongoDB : Retour d'expérience"
description: Je travaille avec MongoDB depuis maintenant presque un an, il est temps pour moi de faire un petit retour sur cette base de données et sur le NoSQL de manière générale.
leafname: retour_xp_mongodb
link:
  label: Services web RESTFul
  title: En savoir plus sur ce livre sur REST
date: "2014-12-04T19:44:40.000Z"
lang: fr
location: FR
keywords:
  - NoSQL
  - MongoDB
categories:
  - Base de données
  - MongoDB
---

# MongoDB: Retour d'expérience

**Comme avec toute technologie « nouvelle », j'étais extrêmement réservé quand à l'essor du NoSQL et son intérêt dans le cadre de mon quotidien de développeur full-stack. J'ai fini par m'y mettre par obligation professionnelle. Je ne pense pas en avoir fait le tour pour le moment, mon avis est donc à prendre avec précaution, mais je le livre comme un point de départ d'un débat qui sera je l'espère constructif.**

## MongoDB vs MySQL

La grande partie de mon expérience avec les bases de données s'est construite autour de MySQL. Je pense ne pas être le seul dans ce cas. C'est donc via le prisme d'un utilisateur avancé de MySQL que j'orienterai ce billet.

Pour illustrer les différences entre bases de données relationnelles et MongoDB, je vais partir d'un schéma de base de données simple et montrer comment selon moi, il faudrait le modéliser dans chacune d'entre elles.

## Cas concret: Un marketplace

J'ai choisi le cas concret d'une place de marché car c'est selon moi celui qui mettra le plus en exergue les différences de conception SQL et NoSQL.

Une place de marché est finalement assez simple. Nous avons des concepts que l'on retrouve dans à peu près toutes les applications :

- des utilisateurs (employés des clients ou vendeurs de la place de marché),
- des organisations (entreprises ou autres formes juridiques),

On retrouve également des concepts propres aux places de marché :

- des produits (à divers prix selon les pays),
- des commandes,
- des factures,
- des livraisons,
- des commentaires sur les produits.

Je simplifie, ici, volontairement la chose pour complexifier par itérations successives.

## Modèle pour bases de données relationnelles

Typiquement, ce type d'architecture sera modélisée comme suit :

```
User(id, name, organisations[]:Organisation, home:Place, phone:Contact, mail:Contact, country:<Country>)
Organisation(id, name, owner:User.id, place:Place, country:<Country>)
Place(id, address, lat, lng)
Contact(id, type, value)
Country(id, name)

Product(id, reference, name, organisation:Organisation)
Price(id, amount, product:Product, country:Country)
Comment(id, content, parent:Comment, author:User, product:Product)
Delivery(id, date, place:Place, recipient:User, bill:Bill)
DeliveryRow(id, quantity, product:Product)
Bill(id, date, seller:Organisation, buyer:Organisation)
BillRow(id, quantity, product:Product, price)
```

Comme vous pouvez le constater, nous avons créé bien plus de concepts que ceux énumérés au départ. La raison est simple : la dé-duplication et la linéarisation. Quand on modélise une base de données relationnelle, on met un point d'honneur à éviter les doublons. On essaie également de faire entrer une structure de donnée arborescente dans un ensemble de tables interconnectées entre elles.

On essaie donc d'isoler un maximum de concepts enfants et on crée autant de cases que nécessaire pour les englober tout en décrivant leurs relations à l'aide de clés étrangères.

Autre avantage des bases de données relationnelles, les clés étrangères et le typage fort des divers champs de la base. La déclaration explicite des relations et des types permet à la base de données d'assurer un forte intégrité des données qu'elle stocke. Les transactions permettent également d'effectuer plusieurs opérations jusqu'à l'obtention d'une état intègre. Ceci permet de conserver encore une fois l'intégrité des données en cas d'échec d'une de ces modifications.

Ces avantages ont cependant un coût. En effet, il est nécessaire de maintenir un état global et de le propager entre toutes les instances du serveur de base de données. C'est pourquoi les bases de données relationnelles fonctionnent sur un schéma maître/esclave.

Ainsi, dès lors que l'on est confronté à une utilisation intense de la base de données, on constate une dégradation des performances et la nécessité de faire appel à un DBA et/ou à un Administrateur Système pour maintenir tant bien que mal ces performances et la disponibilité du système.

En revanche, un atout fort de la modélisation relationnelle est qu'une modélisation bien réalisée n'est pas censée évoluer au cours du temps sauf élargissement du domaine de l'application. Avec les bases de données relationnelles, on décrit une structure représentant l'essence même des données et on l'exploite ensuite sans même se soucier (ou presque) de son intégrité.

Ceci rend l'évolution du produit simple et fluide puisqu'à chaque nouvelle demande de fonctionnalité, on n'intervient que très peu sur le schéma de la base de données. Ceci, au prix d'une concession assumée : l'over-head des calculs et vérifications qui permettent à la base de données de préserver son intégrité et de la difficulté de rendre une telle architecture scalable.

## Modélisation NoSQL avec MongoDB

C'est justement pour répondre à ces problèmes de scalabilité que MongoDB a été conçu. En effet, pour permettre une scalabilité horizontale, de nombreux principes propres aux bases de données relationnelles ont été volontairement écartés, nous y reviendrons.

Les transactions, les clés étrangères, les clés uniques auto-incrémentées sont donc absentes. En sus, le mode de stockage des données est également revu. Là où les bases de données relationnelles utilisent un mode de stockage par lignes et colonnes de taille généralement fixe, les bases de données telles que MongoDB proposent un stockage dans un document sans contraintes (sauf sa taille, nous le verrons après) bien souvent au format JSON autorisant un contenu arborescent (avec en théorie avec une infinité de niveaux).

L'utilisation d'une base de donnée NoSQL mène généralement à une conception bien différente :

```
Organisation {
  name: String,
  place: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  users: [{
    id: ObjectId,
    name: String,
    home: {
      address: String,
      latitude: Number,
      longitude: Number
    },
    phone: String,
    mail: String,
    country: String,
    owner: Boolean
  }]
}

Product {
  id: ObjectId,
  reference: String,
  name: String,
  organisation_id: ObjectId,
  prices: [{
    id: ObjectId,
    amount: Number,
    country: String
  }],
  comments: [{
    id: ObjectId,
    content: String,
    author: ObjectId,
    parents_ids: [ObjectId]
  }]
}

Trade {
  id: ObjectId,
  buyer_id: ObjectId,
  buyer_name: String,
  seller_id: ObjectId,
  seller_name: String,
  items: {
    product_id: ObjectId,
    product_name: String,
    product_price: Number,
    product_reference: String,
    quantity: Number
  },
  deliveries: [{
    id: ObjectId,
    date: Date,
    place: {
      address: String,
      lat: Number,
      lng: Number
    }
  }]
}
```

Comme vous pouvez le voir, notre schéma est complètement différent. En effet, bien que la plupart de nos concepts aient été conservés, nous n'avons plus que trois collections au lieu d'une dizaine de tables.

Plusieurs choses peuvent choquer les aficionados des bases de données relationnelles :

- duplication de certaines informations,
- mélange des genres,
- éclatement de certains concepts.

### Duplication

On peut remarquer que les informations sur un produit sont dupliquées au sein de la collection `Trade`, il en va de même pour le nom de l'entreprise. Dans le cadre d'une base de donnée NoSQL, ce n'est pas une erreur de conception, mais bien une feature. Certes, si le nom de l'entreprise ou le libellé d'un produit change, le nom de l'entreprise et du produit deviendra caduque dans la facture.

Dans ce cas précis, cependant, nous pouvons considérer cette duplication comme une feature. En effet, le changement de dénomination d'une société ou le changement de prix d'un produit ne doit pas être répercuté sur les factures antérieures si l'on souhaite garder la cohérence du document.

### Mélange des genres

L'organisation d'un schéma de base de donnée NoSQL peut paraître désordonnée. En effet, on a de multiples concepts englobés au sein d'une unique structure, ce qui peut paraître aberrant.

Il faut bien saisir le fait que l'organisation en document autorise, voire favorise, ce mélange. En effet, MongoDB ne possède pas de mécanisme de jointure comme on peut le retrouver dans MySQL. Si vous souhaitez obtenir des informations sur une entreprise **et** ses utilisateurs et que ces concepts sont disséminés à travers plusieurs collections, vous n'aurez d'autre choix que de faire plusieurs appels à la base de données. Au-delà du problème évident de performances, il existe des chances pour qu'entre le moment où vous récupérez l'organisation et celui où vous récupérez ses utilisateurs, l'organisation soit supprimée. Comme vous n'avez aucun moyen de garantir l'intégrité des données, c'est un effet de bord inédit avec lequel vous devrez apprendre à composer.

À ce titre, la conception de votre base de données doit être guidée par l'utilisation de vos données afin de limiter au maximum ces risques d'inconsistance. Par exemple, quand vous récupérez un utilisateur (qu'il s'agisse de son authentification ou de l'affichage de sa fiche personnelle), vous aurez probablement besoin d'informations sur son organisation. Si vous savez que même pour une entreprise de 100 000 salariés, vous n'aurez jamais plus de 50 utilisateurs pour une même organisation, alors les intégrer dans le document organisation est l'idéal.

L'intégrité des données est assurée par l'unicité du document et les performances également.

Vous aurez probablement noté le maximum de 50, énoncé ci-dessus. Il est déduit à la louche d'une autre contrainte imposée par MongoDB, la taille maximale d'un document. Avec le modèle proposé ci-dessus, il est impossible d'ajouter des utilisateurs indéfiniment sans mettre en place des astuces comme le [bucketting](http://docs.mongodb.org/ecosystem/use-cases/storing-comments/#hybrid-schema-design "En savoir plus sur cette technique").

### Éclatement des concepts

On peut aussi remarquer que le concept de lieu est éclaté dans divers documents de types différents. C'est clairement un renoncement de notre part. Avec ce schéma, ce n'est pas simple de lister tous les lieux de l'application (bien que cela reste possible).

Clairement, ceci ne présente que peu d'intérêt dans une application de ce type car les lieux sont des informations qui n'ont d'intérêt que dans le contexte d'autres concepts.

En conclusion, on retiendra que le NoSQL bouscule nos habitudes. Là où avec une base de données relationnelle on cherche à comprendre l'essence des données, avec une base de données NoSQL, on recherche plutôt le meilleur moyen d'organiser nos données pour répondre au mieux aux besoins de notre application.

## Impacts sur le projet

Étant donné que la conception d'une base de donnée NoSQL est directement induite par l'utilisation qui en est faîte, chaque modification apportée à l'application implique potentiellement une adaptation de la conception de celle-ci.

Ceci a un impact majeur sur l'évolution du projet. Certaines modifications triviales avec l'utilisation d'une base relationnelle peuvent devenir un vrai cauchemar avec une base MongoDB. Prenons par exemple les lieux. Si demain, le succès de notre place de marché nous permet de proposer un service de livraison avec des lieux prédéterminés, il est probable que nous devions renoncer à garder les lieux dans nos documents de type Trade pour créer une collection à part.

Là où notre schéma relationnel n'aurait nécessité aucune modification, nous allons devoir modifier notre schéma, modifier le code en conséquence, écrire et lancer des scripts de migration. Là où d'un côté, nous avions un DBA qui gérait les données, leur stockage et leur structure, nous avons un développeur qui doit sans cesse repenser la façon dont les données sont stockées et utilisées.

Il faut donc former des développeurs qui prennent la cohérence des données comme acquise à leurs nouvelles responsabilités. Ou l'inverse d'ailleurs, éviter que ces même développeurs cherchent à retrouver leur zone de confort en développant une surcouche qui leur garantirait cette intégrité.

Au final, penser qu'utiliser MongoDB permet à votre application de scaler est comme penser que perdu en plein désert, vous débarrasser de vos vivres vous permettra d'en sortir plus vite. Choisir MongoDB, surtout c'est choisir d'être confronté aux problèmes de scalabilité dés les premiers jours du développement de votre application afin de faire dès aujourd'hui les arbitrages qui vous permettront d'assumer une forte montée en charge plus facilement.

## Comment choisir ?

De nombreux facteurs entrent en jeu pour choisir la base de données à utiliser qui sied le mieux à votre projet. Cependant, je peux vous donner les critères que j'appliquerai personnellement.

Dans quel cas ne pas utiliser MongoDB :

- c'est hype, ça output du JSON : c'est probablement la pire raison qui puisse vous faire choisir MongoDB. JSON n'est qu'un format et n'a rien à voir avec le cœur du problème posé pour le choix d'une base de données. C'est malheureusement trop souvent le cas et je pense que ceci sera la source de nombreuses accumulations de dette technique.
- pas besoin de scaler : si scaler n'est pas votre priorité, n'utilisez pas MongoDB. En effet, MongoDB pose plus de problèmes qu'il n'en résout uniquement pour scaler. Si ce n'est pas une nécessité, préférez une base de données relationnelle qui simplifiera vos développements.
- je suis un n00b en SQL, Mongo est plus simple : si après cet article vous n'êtes pas convaincu, je ne peux pas faire grand-chose de plus. Mais pour forcer le trait, je pense que le meilleur moyen de bien utiliser MongoDB est justement d'avoir une bonne expérience des bases de données relationnelles.
- features fortement changeantes : typiquement, si vous faîtes de la prestation de services, MongoDB est un mauvais choix. Surtout si vous travaillez au forfait. Votre client ne comprendra pas pourquoi la moindre de ses requêtes vous demande des efforts de conception. Si votre client est plutôt du genre girouette, je vous garantis des nœuds au cerveau.
- nombreux contextes d'utilisation : si la base de données est appelée à être utilisée par de nombreux logiciels différents par des équipes différentes, MongoDB ne sera pas utilisable. En effet, puisque la conception est dirigée par l'utilisation, de nombreuses utilisations différentes vont mécaniquement augmenter la complexité de celle-ci de manière exponentielle.

Dans quels cas, éventuellement, utiliser MongoDB :

- besoin de scaler : si vous pensez que votre concept peut attirer un trafic très important, très rapidement (typiquement, si vous travaillez pour une startup prometteuse), alors, MongoDB est l'un des choix qui s'offrent à vous.

Une approche hybride peut également être intéressante, utiliser MongoDB pour les concepts se rapprochant des documents et une base de données relationnelle pour les données fortement relationnelles peut faire l'affaire.

De plus, il est plus simple de migrer depuis une base de données relationnelle que vers une base de donnée NoSQL. C'est pourquoi j'aurais plutôt tendance à utiliser une base relationnelle puis à switcher si le besoin s'en fait ressentir pour une partie des données de l'application.

Enfin, il faut prendre la scalabilité supposée de MongoDB avec des pincettes. D'une part, cette base de donnée reste jeune et les utilisations de grands groupes référencées sur leur site restent limitées des parties mineures des infrastructures qui l'intègrent. Et d'autre part, les fournisseurs de type PaaS réduisent considérablement les problèmes dus à la scalabilité des bases de données relationnelles, notamment les coûts en administration système.

Je me suis fendu d'un nouveau billet, mais cette fois [sur le design de base de données avec MongoDB](./design_base_donnee_mongodb.md).
