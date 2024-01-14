---
title: Le système de template idéal
description: L'utilisation d'un système de template est très avantageuse, mais apporte également d'autres problématiques. L'existant ne me satisfait pas vraiment, voyons pourquoi et comment faire mieux.
leafname: systeme_template_ideal
link:
  label: Systèmes de template
  title: En savoir plus sur les systèmes de template
date: "2012-11-30T10:16:24.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - Templates
categories:
  - JavaScript
---

# Le système de template idéal

L'utilisation d'un système de template est très avantageuse, mais apporte également d'autres problématiques. L'existant ne me satisfait pas vraiment, voyons pourquoi et comment faire mieux.

## Les systèmes de template

Il existe de nombreux systèmes de templating pour chaque langage de programmation utilisé pour faire du web. Parmi eux ont peut citer Smarty, Templeet pour PHP, Mustache pour Javascript etc...

### Avantages

Les avantages d'un système de template sont avant tout une bonne séparation du code HTML et du code PHP/Javascript. De cette façon, un intégrateur HTML/CSS peut intervenir sans avoir à toucher au PHP ce qui est un confort pour lui et une sécurité pour le développeur back-end. Certains diront que PHP seul, par exemple, est un moteur de template. C'est vrai. Mais utilisé de manière rigoureuse. Malheureusement, peu de gens sont capable de s'imposer un cadre strict sans que ce dernier ne soit imposé.

Un autre avantage de cette séparation est que si vous mettez en place un cache d'OPCode pour votre PHP sur un serveur avec peu de RAM, vous permettrez une exécution plus rapide de votre PHP car cette RAM ne sera pas encombrée pas du HTML.

### Inconvénients

Parmi les inconvénients, la majeure partie des systèmes de templating (voire tous) fonctionnent de manière bloquante. Ils chargent la totalité du template, utilisent les expressions régulières pour matcher les variables à remplacer et retournent une variable avec le texte issu de ce processus. Ce qui signifie qu'entre le moment où le template est lu et celui où il est retourné, rien n'est envoyé au client.

En faisant du templating avec PHP, le code HTML est envoyé au client au fur et à mesure qu'il est interprété par PHP. Ainsi, Dès le premier octet lu, PHP est susceptible d'envoyer des données au client. De ce fait, la RAM est moins utilisée pour stocker de gros volumes de texte comme pour les systèmes de template. Vu le poids grandissant des pages, on comprend le problème pour des sites à fort trafic.

La lenteur est aussi un problème. En partie à cause de cet aspect bloquant, mais aussi à cause de l'enregistrement des templates sur le disque. Si vous avez beaucoup de RAM, alors, la solution du templating PHP avec le cache d'OPCode devient une feature et booste les performances d'affichage de vos sites. Vous pouvez obtenir le même résultat en cachant vos templates en RAM ou en les mettant sur un RAMDisk, mais c'est une manipulation supplémentaire qui est rarement faîte dans les faits.

Enfin, malheureusement, la plupart des systèmes de template vont trop loin. A mon sens, il ne faut pas remplacer les langages de programmation dans ces systèmes et se contenter de faire du remplacement et non des appels de fonction, des expressions et toutes les autres aberrations qu'on peut trouver dans ces outils. C'est la philosophie que j'ai reprise quand j'ai créé le système de template de XCMS (CMS aujourd'hui éteint).

## Le système de template idéal

Vous l'aurez compris, je trouve qu'un système de template c'est bien, mais que les systèmes existants sont mauvais (y compris le mien, qui date un peu). Mais tout n'est pas perdu, je pense qu'il est possible de créer le système de templating idéal.

### Cross-langage

Un bon système de template n'est pas dépendant d'un langage en particulier (Javascript/PHP) et doit être implémentable et interchangeable de façon neutre dans chaque langage. Ce qui signifie qu'il faut éviter tout référence aux fonctions internes de chaque langage. Cela rejoint le fait que pour moi, un système de template ne doit faire que du remplacement de variables.

De plus, rien ne nous empêche de faire de l'appel de fonction grâce aux setters/getters (binding) et donc d'implémenter des comportements plus fun sans problème et sans complexifier le système de template.

### Aussi bien côté serveur que client

Un système de template doit être utilisable aussi bien côté serveur que côté client. Cela signifie qu'il doit pouvoir être chargé par le parseur HTML du navigateur avant d'être complété grâce au DOM. C'est ce que propose [DOM template](https://github.com/joewalker/domtemplate "Voir le dépôt sur GitHub"), mais je ne suis pas d'accord avec ce dernier sur certains points. Il faut que le HTML du template soit valide en tout point. Or, il utilise des attributs du genre `if="macondition"` qui ne sont pas standards.

A mon sens, le template idéal utilise les attributs `data-*`. On pourrait imaginer des templates du genre :

```html
<div data-tpl-if="articles.length" data-tpl-loop="articles">
  <article>
    <h1 data-tpl-cdata="articles:title"></h1>
    <p data-tpl-cdata="articles:description"></p>
    <p data-tpl-pcdata="articles:content"></p>
    <p>
      <a
        data-tpl-att-href="articles:href"
        data-tpl-att-title="i18n.read_link_title"
        data-tpl-content="i18n.read_link"
      ></a>
    </p>
  </article>
</div>
```

Vous avez compris l'idée si vous êtes familier des systèmes de template. Ce HTML est tout à fait valide et peut tout aussi bien être traité côté client que côté serveur avec une API de type DOM ou en faisant du parsing voire avec des expressions régulières mais nous avons déjà vu que c'était le mal.

Autre avantage, cela rend les templates éditables directement dans un éditeur HTML WYSIWYG ou de code source avec la coloration syntaxique qui va bien sans effort supplémentaire. On pourrait même imaginer ajouter une extension à un éditeur existant pour remplir les données à des fins de test de rendu des templates.

Enfin, il est tout à fait possible de générer le contenu du template côté serveur mais en laissant les attributs data-tpl-\*, puis de mettre à jour ce dernier en Javascript côté client.

### Streamable

Enfin, le contenu généré par le système de template doit être streamé. C'est à dire qu'il doit recevoir en entrée un ou plusieurs input streams et fournir un output stream en sortie afin de pouvoir lire les templates, les compléter et les envoyer au flux.

Pour ce faire, le template doit être parsé avec une API de parsing XML/SGML de type évènementiel ou directement caractères par caractères.

- dans n'importe quel attribut de type data-tpl-\*, si la variable existe, on la traite, sinon, on stoppe la sortie en attendant la lecture de toutes les variables du template et on reprend quand c'est terminé le test d'existence. Pendant ce temps, on continue de lire le template et on indexe les autres appels au système de template demandés par les attributs de type data-tpl-\*.
- pour un simple remplacement de valeur, on n'a qu'a remplacer la valeur.
- pour une condition, si elle est vraie, on continue à traiter et envoyer le template. Si elle est fausse, on stoppe le traitement des attributs data-tpl-\* tant qu'on ne rencontre pas la balise fermante.
- pour une boucle, on stoppe la sortie, on lit la totalité de la boucle jusqu'à la balise fermante. Pour chaque entrée, on remplit le template de la boucle et on le dirige vers la sortie.

De cette façon, on optimise l'utilisation de la mémoire, on envoie ce qui doit l'être sans attendre, bref, le système idéal. C'est un peu ma commande pour Noël, soyez chic, faîtes-le ! Ne m'obligez pas à le faire moi-même en mode bande de nerd à moi tout seul (je m'fend la gueule !).

PS: Si vous créez cela, appelez-le SantaTPL ;-).
