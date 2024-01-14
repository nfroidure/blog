---
title: Pourquoi j'ai remplacé JSON par VarStream
description: JSON est très connu et semble bon pour la plupart des utilisations, cependant, par "hasard", j'ai créé un format de données que je trouve supérieur et que j'ai décidé d'appeler VarStream.
leafname: remplacer_json_par_varstream
link:
  label: VarStream vs JSON
  title: En savoir plus sur ce format de donnée que j'ai créé
date: "2012-07-06T08:56:35.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - JSON
  - VarStream
categories:
  - VarStream
---

# Pourquoi j'ai remplacé JSON par VarStream

JSON est très connu et semble bon pour la plupart des utilisations, cependant, par "hasard", j'ai créé un format de données que je trouve supérieur et que j'ai décidé d'appeler VarStream.

Aujourd'hui, de nombreux développeurs ont choisi de privilégier JSON à XML pour de nombreuses raisons. Sa légèreté est mise en avant par rapport à la lourdeur de XML. Mais JSON a lui aussi des défauts finalement peu connus, des défauts qui ont fait que j'ai créé VarStream, un autre format d'échange de donnée. Créé pour mon usage personnel, je vous livre aujourd'hui ses principes et espère que certains d'entre vous en tireront avantage.

## L'histoire

Lorsque j'ai décidé de créer mon propre CMS, JSON n'existait pas ou n'était pas très connu. XML était bien présent, mais je le trouvais un peu compliqué et surtout très lourd. J'avais pourtant besoin d'un format de stockage de valeurs pour deux besoins principalement : la localisation et la configuration.

Influencé par les fichiers de configuration Unix et les fichiers `.properties` utilisés pour la localisation chez Mozilla, j'ai décidé d'utiliser un format simple de type `cle=valeur` suivi d'une nouvelle ligne. Par la suite, j'ai dû ajouter une façon de commenter ces fichiers. Toujours dans le pompage des fichiers de conf Unix, j'ai choisi le `#` en début de ligne.

Enfin, il m'a fallu trouver un moyen d'insérer des nouvelles lignes et de représenter une arborescence de valeurs ou des tableaux. Au fil de mes améliorations, je suis parvenu à un format qui ne m'apporte que des avantages et c'est pour cela que je souhaite aujourd'hui le proposer à la communauté de développeurs.

Pour ce faire, je vais vous le présenter dans sa forme actuelle, mettre en lumière ses forces et partager avec vous les bouts de code qui permettent de l'exploiter en PHP et en Javascript.

## Le format

Afin d'illustrer ce format, je vous livre un petit exemple de fichier de configuration :

```
# Database
database.type=mysql
database.hosts.+.domain=mysql1.example.com
database.hosts._.master=true
database.hosts.+.domain=mysql2.example.com
database.hosts._.master=false
database.hosts.0.master=true
database.user=root
database.base=myapp
database.base=myapp2
".base=myapp
# REST servers
rest.servers.+.domain=api.example.com
rest.servers._.auth=basic
rest.servers._.user=&database.user
```

Et aussi un exemple de fichier de langue dans ce format :

```
# Date
l_timezone=Europe/Paris
l_date_format=l d F Y
l_day_format=d F
l_time_format=l d F Y à H:i:s
l_hour_format=H:i:s
l_days.monday=Lundi
l_days.tuesday=Mardi
l_days.wednesday=Mercredi
l_days.thursday=Jeudi
l_days.friday=Vendredi
l_days.saturday=Samedi
l_days.sunday=Dimanche
l_months.january=Janvier
l_months.february=Février
l_months.march=Mars
l_months.april=Avril
l_months.may=Mai
l_months.june=Juin
l_months.july=Juillet
l_months.august=Août
l_months.september=Septembre
l_months.october=Octobre
l_months.november=Novembre
l_months.december=Decembre
# Numbers
l_number_dec_point=,
l_number_thousands_sep= # Phone numbers
l_phone_local_indicator=33
l_phone_local_format=0
l_phone_indicator_format=+XXXX (0)
l_phone_number_format=X XX XX XX XX

# GPS Locations
l_gps_latitude=N
l_gps_longitude=O

# Multiline
l_multiline=I curently have a
multiline value.
It's great !
```

Un bref coup d'œil permet de comprendre que la partie de gauche du signe `=` représente le nom de la variable, la partie droite sa valeur. Les noms des variables sont séparés par des points délimitant des nœuds permettant de représenter la position de la valeur dans l'arborescence du programme d'une façon linéaire. Un peu comme ce que l'on peut observer dans Javascript.

Les nœuds sont soit des noms de variable (ex:database) soit des caractères spéciaux (`"`, `+`, `*`, `!`). Le nœud le plus à droite est forcément un nom de variable. Les autres nœuds sont soit des objets, soit des tableaux, soit une ligne d'un tableau. Ceci est déterminé par leur format. Si le nœud est composé de caractères alphanumériques uniquement ou des signes `+`, `*`, `!`, c'est une ligne d'un tableau. Automatiquement, le nœud précédent est un tableau. Sinon, il s'agit d'un objet (`Object` en Javascript, `stdClass` en PHP).

Les tableaux sont initialisés par un nœud numérique, un signe `+`, un signe `*` ou un signe `!`. Le signe `+` quand un tableau existe précise que la variable qui suit doit être ajoutée dans une nouvelle ligne du tableau. Le caractère `*` fait référence à la ligne courante du tableau. Le caractère `!` signifie que quoiqu'il y ait eu auparavant dans le tableau, il faut le réinitialiser. Enfin, un nœud alphanumérique fait référence au n° de ligne (un `table[n]` dans la plupart des langages).

Les objets sont initialisés lors de la première référence à ces derniers et on y fait référence par leur nom simplement. On peut ajouter une propriété à un objet sans répéter sa position dans l'arborescence en utilisant le signe `"` qui représente alors le chemin de la ligne précédente comme on le ferait naturellement quand on écrit plusieurs lignes à la suite avec un début identique. C'est le cas dans notre fichier de configuration ou j'assigne la valeur `myapp` à `database.base` pour ensuite y mettre la valeur `myapp2` et enfin y remettre la valeur `myapp`. Cela n'a aucun autre intérêt que d'illustrer le concept mais vous comprendrez par la suite.

Les valeurs sont soit du texte, soit des valeurs numériques, soit une valeur booléenne (`true` ou `false`).

On peut faire référence à une autre variable dans la partie droite de la ligne plutôt que d'y mettre la valeur une seconde fois grâce au signe esperluette (`&`) comme vous pouvez le voir pour la variable rest.`servers.*.user`. Si la valeur est une variable, la valeur est copié, si c'est un objet, il est référencé.

Enfin, pour insérer une valeur contenant plusieurs lignes dans une variable, on termine chaque nouvelle ligne par un backslash (`\\`).

Vous êtes sûrement entrain de vous dire que c'est bien compliqué, mais en fait, ces règles sont aisément déductibles à la vue d'un fichier de configuration ou de langue dans ce format. Maintenant, laissez-moi vous expliquer pourquoi j'ai fini par utiliser ce format en lieu et place de JSON pour de la communication client-server.

## Avantages

Ce format de fichier présente de nombreux avantages dans le contexte d'une application web, voici les principaux :

### Streamable

Un atout majeur. Là où JSON nécessite la lecture complète du contenu pour assurer le fait que le fichier est bien formé, les VarStreams permettent de récupérer les différentes valeurs au flux optimisant ainsi l'espace mémoire utilisé et vidant les tampons au fur et à mesure du traitement.

Cette nature streamable permet également de récupérer des données qui seraient fragmentées dans différents fichiers chargés successivement. Par exemple, je m'en sert pour charger différents fichiers de configurations. Le fichier générique utilisé pour toutes les apps. Puis un fichier spécifique à l'application web qui surcharge certaines valeurs. Cela rend les VarStreams mergeable par simple concaténation des fichiers ce qui ne peut être fait aisément avec JSON.

Cela peut-être très intéressant dans l'utilisation des web sockets pour mettre à jour un tableau de valeur facilement, ce dernier est synchronisé au flux et la communication est fluide et transparente. On pourrait même imaginer de modifier l'interface au flux grâce à du binding sur certaines valeurs.

### Human readable / writeable

Ceux qui ont déjà eu besoin d'écrire ou de lire du JSON le savent bien, avoir un format d'échange facile à lire est important pour le débogage. Dans ce domaine, les VarStreams sont champions.

De plus, mon expérience prouve que les traducteurs sont à l'aise avec ce type de fichiers, il n'ont pas de caractères spéciaux à échapper, pas de guillemets à ajouter etc... Il n'ont qu'à ajouter un backslash à la fin d'une ligne si la ligne suivante contient la suite de la valeur.

### Auto-Référençable

Dans un fichier JSON, vous ne pouvez pas faire référence à une valeur déjà présente car le contenu du fichier ne sera interprété qu'à la fin du fichier. C'est une grosse limitation que les VarStreams outrepassent.

## Utilisation

Pour l'instant, j'ai mis le parseur Javascript sur GitHub, mon parseur PHP nécessite d'être revu pour ne plus être dépendant de mon Framework. Utiliser les VarStreams est simple. Il suffit de passer en paramètre d'une fonction, les données puis le contexte. Le contexte doit être un objet. Retrouvez [tout le matériel nécessaire à son utilisation](https://github.com/nfroidure/VarStream "Voir le dépôt GitHub") sur GitHub. Petit exemple :

```js
var myScope = {};
var myStream = new VarStreamReader(myScope, true);
myStream.read("");
myStream.read("#comment");
myStream.read(
  "# Database" +
    "database.type=mysql\n" +
    "database.hosts.+.domain=mysql1.example.com\n" +
    "database.hosts._.master=true\n" +
    "database.hosts.+.domain=mysql2.example.com\n" +
    "database.hosts._.master=false\n",
);
console.log(myScope.hosts[[0]].domain);
```

On peut bien-sûr imaginer utiliser la fonction read comme callback d'une requête Ajax ou d'un WebSocket. Avec NodeJs on peut l'utiliser pour charger dynamiquement un fichier de variables ligne par ligne. A vous d'inventer vos propres cas d'utilisation ;).

Dès que j'en aurai le temps et l'utilité, j'écrirai la fonction d'export correspondante (pour finir je l'ai faîte dans la foulée) que je n'utilise qu'en PHP actuellement.

## Conclusion

J'espère que cet article vous a intéressé, n'hésitez pas à me faire des remarques, à donner vos critiques/avis, cela faisait trop longtemps que j’utilisais ce format dans mon coin sans en faire profiter personne !
