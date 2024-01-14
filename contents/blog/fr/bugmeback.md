---
title: "BugMeBack : La solution pour venir à bout de vos bugs ?"
description: Le problème avec les bugs, c'est qu'ils ont la fâcheuse tendance à être détectés par des novices. C'est alors le parcours du combattant pour se les faire expliquer. BugMeBack va vous aider !
leafname: bugmeback
link:
  label: BugMeBack
  title: En savoir plus sur BugMeBack
date: "2012-10-27T21:53:43.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - Extensions
  - Chrome
  - Opera
categories:
  - JavaScript
  - Extensions
---

# BugMeBack : La solution pour venir à bout de vos bugs ?

---

⚠ Attention: Cet article est ancien et l'extension qui y est décrite est abandonnée. J'aime toujours autant le principe et j'aurais aimé qu'il rencontre plus de traction, cependant, impossible de faire bouger les lignes quand on ne s'appelle pas Google ou Facebook ;).

---

Le problème avec les bugs, c'est qu'ils ont la fâcheuse tendance à être détectés par des novices. C'est alors le parcours du combattant pour se les faire expliquer. BugMeBack va vous aider !

Décidément, ParisWeb 2012 aura généré son lot de réflexions. Suite à la conférence "Freelance, tu aurais besoin d'un petit recadrage", j'ai repensé à cette discussion que nous avions eu sur la difficulté qu'ont les développeurs web à se faire rapporter des bugs qui soient de véritables bugs. C'est à dire :

- reproductibles : si on ne peut pas le reproduire, alors il n'y a pas de bug.
- détaillés : combien d'entre nous ont eu le droit à des "ça marche pas" sans autre explication. On est alors obligés de creuser avec parfois plusieurs échanges de mails.
- etc...

Bref, les bugs reportés par madame Michu, c'est un peu la foire à la saucisse.

## La solution : BugMeBack

C'est pourquoi j'ai passé cette après-midi à concocter une petite extension pour Google Chrome (et peut-être pour Firefox plus tard). L'idée est de demander à nos utilisateurs toutes les petites informations qui vont bien afin de nous permettre de répondre au mieux à leur demande de correction de bogue.

Pour ce faire, un petit bouton permet d'ouvrir un formulaire qui permet de soumettre un bug sans oublier toutes les informations nécessaires pour le résoudre. J'ai triché de manière éhontée sur le formulaire de soumission de bug de Bugzilla comme vous pouvez vous en rendre compte sur la capture d'écran qui suit.

![Capture d'écran de BugMeBack](/public/illustrations/bugmeback.png)

Petit bonus, l'url, la taille de la fenêtre et une capture d'écran du contenu de celle-ci sont attachés au bug. J'ai encore un peu de bidouille à faire avec les API expérimentales de Google Chrome pour récupérer également le contenu de la console d'erreur automatiquement.

## Automatisation

Par défaut, un résumé du bug sera proposé en copier/coller, mais pour les plus braves d'entre vous, je vous propose d'ajouter une balise link à vos sites web qui vous permettra de récupérer le contenu du bug via une requête REST. Voici le format de la balise link que je vous propose :

```html
<link
  rel="bugreport"
  type="application/json"
  href="https://example.com/bug.json"
/>
```

Avec cette balise présente dans vos pages, BugMeBack fera une requête de type POST avec pour contenu le rapport de bug. Il me reste encore à créer le driver Rest qui permettra cette interaction et je la mettrai sur tous mes sites web. N'hésitez pas à me proposer vos idées ou propositions d'amélioration puisque pour le moment, rien n'est écrit dans le marbre.

Vous pouvez installer cette extension [depuis le Chrome Web Store](https://chrome.google.com/webstore/detail/bugmeback/hgmagcomobmjhaomdoihiggpdekaehmg "Visiter le store"). [Le projet est bien-sûr sur GitHub](https://github.com/nfroidure/BugMeBack "Voir le dépôt GitHub"), tous les codeurs sont invités à la fête !

**Edition du billet le 31 octobre 2012 :** suite à une [proposition au WhatWG](http://lists.whatwg.org/htdig.cgi/whatwg-whatwg.org/2012-October/037745.html "Lire la discussion"), on m'a suggéré d'utiliser la balise link plutôt qu'une balise meta ce qui se justifie, j'ai donc changé cet article en conséquence ainsi que l'extension BugMeBack.

**Edition du 12 novembre 2012 :** l'extension a été [portée sur Opéra](https://addons.opera.com/en/extensions/details/bugmeback/?display=fr "Télécharger BugMeBack pour Opéra"), il ne reste plus que Firefox, à moins qu'un volontaire ne se déclare pour Internet Explorer également.
