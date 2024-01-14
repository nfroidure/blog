---
title: Les champs SET et les requêtes GROUP BY
description: J'adore utiliser les champs de type SET pour leur souplesse et leur nature multivaluées, mais quand GROUP BY entre dans la place, attention les dégâts !
leafname: champs_set_et_group_by
link:
  label: A propos de SET & GROUP BY
  title: En savoir plus sur SET & GROUP BY utilisés conjointement
date: "2012-08-28T07:34:25.000Z"
lang: fr
location: FR
keywords:
  - MySQL
categories:
  - Base de données
---

# Les champs `SET` et les requêtes `GROUP BY`

J'adore utiliser les champs de type `SET` pour leur souplesse et leur nature multivaluées, mais quand `GROUP BY` entre dans la place, attention les dégâts !

## Petit rappel sur les champs `SET` dans MySQL

Si j'aime tant utiliser les champs `SET` dans mes tables, c'est que contrairement aux champs à première vue similaires de type `ENUM`, ces derniers peuvent être multivalués. Imaginons la table suivante permettant de stocker des documents techniques, relatifs à des modèles d'équipements, qui peuvent être de plusieurs types prédéfinis :

```sql
CREATE TABLE `documents` (
 `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
 `label` varchar(75) NOT NULL DEFAULT '',
 `model` mediumint(8) unsigned DEFAULT NULL COMMENT 'link:equipmentModels',
 `type` **set('standard','law','rule','assemblynotice','washnotice','usenotice','certificate','testreport','implant')** NOT NULL DEFAULT 'law',
 `description` text,
 `applicationDate` date NOT NULL DEFAULT '0000-00-00',
 PRIMARY KEY (`id`),
 KEY `model` (`model`),
 KEY `applicationDate` (`applicationDate`),
 KEY `type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1175 ;
```

L'avantage du champs `SET` est que pour un set prédéfini de valeurs qui n'est pas amené à évoluer, on fait l'économie d'une table de jointure qui rendrait plus complexe notre schema. Mais ce n'est pas le seul avantage de ce type de champs. En effet, les valeurs ne sont pas stockées sous une forme textuelle dans la base de donnée, mais sous la forme d'un entier particulier.

Un peu comme pour les droits UNIX, chaque valeurs du champs `SET` se voit assigner en correspondance un entier dont le bit de poids faible indique la [position dans la liste des valeurs](https://dev.mysql.com/doc/refman/8.0/en/set.html "Voir la documentation de SET") acceptées par le champs de type `SET`. Pour notre table, on a donc `standard=1`, `law=2`, `rule=4`, `assemblynotice=8`, `washnotice=16`, `usenotice=32`, `certificate=64`, `testreport=128`, `implant=256`. Un champs `SET` ne peut avoir que 64 valeurs ce qui correspond à la valeur maximale d'un entier non signé sur un système 64bits.

Ainsi, si je souhaite obtenir la liste des documents contenant une notice d'utilisation, je peux indifféremment utiliser les deux requêtes suivantes :

```sql
/* ici type est converti en chaîne */
SELECT _ FROM `documents` WHERE `type` LIKE '%usenotice%';

/* ici type est converti en entier  */
SELECT _ FROM `documents` WHERE `type`&32;

/* ici une fonction spécifique aux champs SET est utilisé */
SELECT \* FROM `documents` WHERE FIND_IN_SET(`type`,'usenotice')>0
```

Idéalement, il vaut mieux utiliser la fonction dédiée ou la conversion en chaîne car elles sont indépendantes de l'ordre des valeurs dans le champs `SET` contrairement à la technique de l'opérateur binaire `&`. Mais il existe un cas où cela peut sauver la vie, c'est ce qui vient de m'arriver pour cette table.

## Et un jour `GROUP BY` arriva

Le problème vient quand votre client vous demande si il serait possible de sortir une liste des modèles d'équipement pour lesquels certains documents ne sont pas présents. La difficulté ici est qu'à un modèle d'équipement peuvent correspondre plusieurs lignes de la table `documents`. Nous avons donc besoin de réunir toutes les lignes correspondant au modèle associé et de "merger" les valeurs du champs type pour pouvoir y rechercher les valeurs supposées absentes.

Ce fût alors le moment d'utiliser la valeur numérique des champs `SET`. Mon premier réflexe fût d'essayer de coupler la fonction SUM avec l'opérateur binaire au sein d'une seule et même requête, mais MySQL n'accepte pas cette forme, j'ai donc dû utiliser les requêtes imbriquées, voilà le résultat :

```sql
SELECT * FROM (
  SELECT
    organizations.label AS organization,
    equipmentModels.model AS eqtModel,
    equipmentModels.reference AS eqtRef,
    equipmentModels.description AS eqtDesc,
    SUM(documents.type) AS docTypesInt,
    GROUP_CONCAT(documents.type) AS docTypesString
  FROM `equipmentModels`
  LEFT JOIN documents
    ON documents.model = equipmentModels.id
  LEFT JOIN organizations
    ON organizations.id = equipmentModels.builder
  GROUP BY equipmentModels.id
  ORDER BY equipmentModels.builder
) AS temp
WHERE docTypesInt IS NULL
  OR NOT docTypesInt&1 /* standard */
  OR NOT docTypesInt&2 /* law */
  OR NOT docTypesInt&4 /* rule */
  OR NOT docTypesInt&8 /* assemblynotice */
  OR NOT docTypesInt&16 /* washnotice */
  OR NOT docTypesInt&32 /* usernotice */
  OR NOT docTypesInt&64 /* certificate */
  OR NOT docTypesInt&128 /* testreport */
  OR NOT docTypesInt&256 /* implant */
```

Le principe est simple, on fait la somme des valeurs du champs `type` pour toutes les lignes concernant le même équipement (grâce à la clause `GROUP BY`). Cette somme obtenue, on peut utiliser l'opérateur binaire afin de vérifier la présence d'une ou plusieurs valeurs au sein de ces champs. la ligne `docTypeInt IS NULL` sert à prendre également en compte le cas où il n'y a aucune valeur de type correspondant au modèle.

Le lecteur averti aura remarqué une vaine tentative d'utilisation de la fonction `GROUP_CONCAT` qui aurait peut-être pu servir à continuer d'utiliser une comparaison à partir de chaînes, mais le problème est qu'il n'y aura pas de virgule insérée entre chaque valeurs du champs `type`. J'ai cherché après la fonction `GROUP_CONCAT_WS`, mais elle n'existe pas encore.

Bref, les champs SET c'est pratique, mais il faut bien connaître leur nature pour pouvoir en profiter pleinement. Et vous, que faîtes vous avec vosSET ?
