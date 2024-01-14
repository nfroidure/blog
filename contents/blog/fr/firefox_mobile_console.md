---
title: "Firefox Mobile Android : Accéder aux consoles d'erreur Javascript / stderr"
description: Pour développer pour Firefox Mobile, mieux vaut avoir la console d'erreur à portée de main. Voici la méthode.
leafname: firefox_mobile_console
link:
  label: Console d'erreur Fennec
  title: Voir la façon d'y accèder
date: "2012-06-18T07:49:47.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - Debug
  - Firefox
categories:
  - JavaScript
---

# Firefox Mobile Android : Accéder aux consoles d'erreur Javascript / stderr

---

⚠ Cet article n'a probablement plus d'intérêt réel aujourd'hui, il reste ici uniquement pour mémoire.

---

Pour développer pour Firefox Mobile, mieux vaut avoir la console d'erreur à portée de main. Voici la méthode.

## Console d'erreur

La console d'erreur générale de Firefox (sorte de flux stderr) est disponible en branchant votre téléphone via USB sur votre PC. Ensuite, il suffit d'utiliser l'outil adb en ligne de commande disponible dans le SDK d'Android. Cet outil permet de récupérer toutes les informations renvoyées par votre appareil Android. Un petit grep permet de nous intéresser plus particulièrement à Gecko.

```sh
nfroidure:~/ adb logcat | grep Gecko
```

Pour les amateurs d'interfaces graphiques, le dossier tools contient un script nommé `ddms` qui permet d'avoir une interface plus intuitive et de filtrer les messages qui sont assez nombreux.

## Console Javascript

Il semble qu'il ne soit pas possible de récupérer les messages d'erreur Javascript avec `adb` comme ça l'est pour le navigateur par défaut des appareils Android. La seule option que j'ai trouvé est de se rendre sur le panneau de gestion des préférences **about:config** et de chercher l'option **devtools.errorconsole.enabled** et de la passer à **true**. Profitez-en pour passer la console en mode strict, ça mange pas de pain (`javascript.options.strict`).

Une fois cette petite manipulation faîte, il suffit de se rendre sur la console en utilisant la sidebar de droite (celle où il y a les boutons suivant, précédent et l'étoile des marques pages), de taper la roue crantée et dans le nouvel écran, choisir l'onglet avec l'insecte bien connu des développeurs.

Dommage que ce soit la seule façon d'accéder aux erreurs car ça fait pas mal de manips pour voir les erreurs alors qu'avec adb, il suffit d'avoir une console ouverte. Vous avez d'autres astuces pour déboguer sous Firefox Mobile / Fennec ?

Petite mise à jour : il semble que les erreurs JavaScript soient bien reportées avec la nouvelle version de Firefox Mobile (14).
