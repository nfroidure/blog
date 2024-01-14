---
title: Conventions de nommage des bases de données
description: Depuis que j'ai découvert les bases de données avec MySQL, je n'ai pas cessé de m'en servir, tant et si bien que j'ai fini par définir une convention de nommage.
leafname: nommenclature_table_sql_base
link:
  label: Convention de nommage SQL
  title: En savoir plus sur la convention de nommage que j'utilise
date: "2012-07-18T14:34:39.000Z"
lang: fr
location: FR
keywords:
  - MySQL
  - SQL
categories:
  - Bases de données
---

# Conventions de nommage des bases de données

Depuis que j'ai découvert les bases de données avec MySQL, je n'ai pas cessé de m'en servir, tant et si bien que j'ai fini par définir une convention de nommage.

Je suis actuellement en pleine lecture du livre Bases de données :Concepts, utilisation et développement de Jean-Luc Hainaut. J'en ferai la critique sur ce même blog, pour l'instant mon impression est plutôt bonne.

En revanche, il y a une chose qui m'exaspère au plus haut point dans ce livre : le manque d'uniformité et de clarté dans les appellations des bases et des champs. Tout est en majuscule (argh !), en français (ouch !) et les clés primaires auto incrémentées sont nommées comme suit : NCOM, NCLI, NPRO. Ce n'est pas vraiment l'idéal.

Au fil de mon utilisation des bases de données, j'ai normalisé ma façon de les nommer de manière à ce que l'on puisse facilement comprendre les requêtes que je rédige. Je vous livre donc ma méthode afin que les plus fainéants d'entre vous n'aient pas à y réfléchir, mais simplement à l'appliquer.

## Règles de base

English everywhere. Quel est le sens de nommer ses bases, tables ou champs en français alors que :

- la langue des programmeurs est l'anglais;
- rien ne dit qu'un projet ne s'internationalisera pas durant son cycle de vie ou que l'entreprise ne devienne pas une multinationale entre temps;
- l'anglais est simple, n'a pas d'accents donc pas de source d'erreurs du genre : comment savoir si la table `colles` fait référence aux collés du collège du coin ou aux tubes de colle en réserve ?
- Le langage `SQL` est en anglais, nommer ses tables en français est un curieux mélange des genres, nécessitant de switcher de français à anglais en permanence.

Utilisation du `snake_case` (ndr: et non `camelCase` comme initialement recommandé ici, MySQL est sensible à la casse, mais ce n'est pas le cas de PostgreSQL, le snake case est donc plus largement utilisable partout).

Le snake case (ex: `an_example_snake_case`) rend plus lisible les noms des tables en marquant les différents mots qui composent le nom d'une table apportant une visibilité qui n'est pas de trop pour les requêtes les plus complexes. De plus cette syntaxe est assez naturelle à tout programmeur initié à la programmation en C ou en Rust.

Ces deux règles suffisent à savoir comment nommer une base de donnée, pour les tables, c'est un peu plus complexe.

## Nomenclature des tables

Je nomme toutes les tables au pluriel selon un postulat simple : les tables sont une liste de lignes. C'est aussi une façon de bien distinguer une table d'une table liée. Par exemple, grâce à l'utilisation du pluriel, on ne peut pas confondre la table `products` avec la table `product_categories` ou le champ `bill_rows.product`.

Seules les tables de jointures peuvent contenir (elles le doivent) deux tirets à la suite. Plus précisément l'underscore (tiret sous le 8 sur votre clavier). Une table qui associerai des utilisateurs à leurs produits préférés se nommerai `products__users`.

C'est une convention personnelle mais qui peut avoir de l'importance : le nom de la table `products__users` doit être composée des deux tables qu'elle référence par ordre alphabétique croissant. Cela permet de pouvoir prédire leur nom sans avoir besoin de consulter le schéma de la table.

## Nomenclature des champs

Les champs sont le plus souvent au singulier lorsqu'il ne peuvent contenir qu'une valeur. Une exception cependant, les champs de type `SET` qui contiennent un sous ensemble du set de valeurs qu'il peuvent contenir (avec PostgreSQL, ce sont les champs de type `Array`).

Cela permet aussi de se poser une question sur le contenu de votre table. Si l'un des champs est au pluriel et n'est pas de type `SET`, il y a de fortes présomptions sur le fait que le schéma de votre table n'est pas optimal conceptuellement.

Bien entendu, un champs avec une clé étrangère référençant la table `products` sera nommé `product` si possible.

Enfin, l'identifiant unique quand il se résume à une seule valeur auto-incrémentée (90% des cas) sera nommé simplement `id`.

## Et au niveau des requêtes ?

En revanche, pour mes requêtes, j'utilise les majuscules, distinguant ainsi les parties propres au language des noms des tables et champs. Voici une requête créée récemment pour l'exportCSV d'un client:

```sql
SELECT
  equipments.id AS Id,
  organizations.label AS Client,
  installations.label AS Aire,
  CONCAT_WS(
    ' ',
    equipment_models.model,
    equipments.precision
  ) AS Jeu
FROM equipments
LEFT JOIN equipment_models
  ON equipments.model = equipment_models.id
LEFT JOIN installations
  ON equipments.installation = installations.id
LEFT JOIN organizations
  ON installations.organization = organizations.id
WHERE equipment_models.model LIKE '%sans réf%'
```

Voilà pour mes petites règles de bonne conduite SQL ! Et vous, comment nommez-vous vos tables ? Que pensez-vous de ces principes ?
