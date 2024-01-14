---
title: Gérer les monnaies dans un logiciel (CRM,ERP)
description: Je suis actuellement entrain de développer une solution CRM basée sur mon framework Rest PHP. Il faut donc gérer les différentes monnaies.
leafname: gerer_monnaies_logiciel
link:
  label: Les monnaies
  title: En savoir plus sur la gestion des monnaies
date: "2012-11-16T09:24:57.000Z"
lang: fr
location: FR
keywords:
  - SQL
categories:
  - Base de données
  - Applications Web
---

# Gérer les monnaies dans un logiciel (CRM,ERP)

Je suis actuellement entrain de développer une solution CRM basée sur mon framework Rest PHP. Il faut donc gérer les différentes monnaies.

Il existe un standard (ISO 4217) qui répertorie toutes les monnaies utilisées dans le monde. Ce standard assigne 6 éléments à chaque monnaie :

- une valeur numérique (978 pour l'Euro),
- un code composé de trois lettres (EUR pour l'euro, USD pour le dollar américain),
- le nom de la monnaie,
- le symbole de cette monnaie (€, $ ..),
- les pays dans lesquels ces monnaies sont utilisées,
- le nombre de décimales après la virgule.

Bref, tout ce qu'il faut pour se constituer une petite table des monnaies simplement. Ca tombe bien, l'organisme chargé de la maintenance de cette liste propose [une liste de ces dernières](https://www.currency-iso.org/en/home/tables/table-a1.html "Télécharger la liste des codes") au format XML ou Excel que vous n'aurez aucun mal à importer. Il y a aussi la possibilité de s'inscrire à une liste permettant de recevoir un e-mail à chaque mise à jour de la liste afin de garder votre base de donnée propre.

L'intérêt d'utiliser ce standard réside dans le fait que la plupart des acteurs l'utilisent aussi. Par exemple, la majeure partie des solutions de paiement que j'ai eu à intégrer utilisent ces codes.

Voici le format de table que j'ai adopté :

```sql
CREATE TABLE IF NOT EXISTS `currencies` (
  `id` smallint(5) unsigned NOT NULL,
  `label` varchar(150) NOT NULL,
  `code` varchar(3) NOT NULL,
  `symbol` varchar(3) DEFAULT NULL,
  `fraction` tinyint(2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

J'ai utilisé la valeur numérique associée à chaque monnaie comme index primaire. Vous remarquerez que je n'ai pas associé les pays dans la même table car ces derniers peuvent être plusieurs pour la même monnaie. J'ai donc créé une table jointure avec ma table répertoriant les pays.

En ce qui concerne la localisation, certains pays indiquent un montant comme ceci : USD 35 (États-Unis) et d'autres comme cela (30 EUR), j'ai donc ajouté une fonction de formatage selon la locale utilisée.

Et vous comment gérez vous les monnaies ?
