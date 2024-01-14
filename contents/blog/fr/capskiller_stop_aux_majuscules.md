---
title: "CapsKiller : Stop aux majuscules"
description: Les digital natives supportent mal les majuscules dans les courriels. En effet, cela est assimilé à des cris. Malheureusement, tout le monde n'en fait pas grand cas. CapsKiller pour Thunderbird est là pour vous en protéger.
leafname: capskiller_stop_aux_majuscules
link:
  label: CapsKiller
  title: En savoir plus sur cette extension Thunderbird
date: "2013-02-23T11:05:23.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - Extensions
  - Thunderbird
categories:
  - JavaScript
  - Extensions
---

# CapsKiller : Stop aux majuscules

Les digital natives supportent mal les majuscules dans les courriels. En effet, cela est assimilé à des cris. Malheureusement, tout le monde n'en fait pas grand cas. CapsKiller pour Thunderbird est là pour vous en protéger.

## Les majuscules, ce fléau

Tout le monde ne le sait pas encore, mais il est très impoli d'écrire entièrement en majuscule un message sur Internet. La Nétiquette, charte éthique sur Internet, le rappelle dans ses conseils pour la [mise en forme](https://fr.wikipedia.org/wiki/N%C3%A9tiquette#Mise%5Fen%5Fforme "Lire la partie de la Nétiquette sur ce sujet"). Malheureusement, par ignorance ou par négligence, je reçois encore parfois des e-mails écrits entièrement en capitales. Cela a le don de m'exaspérer, je le vis comme un manque de respect.

Je me suis récemment permis de le préciser à un client. Cela n'a pas plût. Il est vrai que c'est toujours difficile et aventureux de rappeler à quelqu'un les règles de politesse, mais dans le même temps, je ne voulais pas subir 5 e-mails par jour en majuscules.

Bref, il a fallut que j'explique pourquoi des e-mails en majuscules nuisent à mon ambiance de travail, que cela ne coûtait pas grand chose de mettre en forme un e-mail. Je ne suis d'ailleurs pas sûr d'avoir convaincu ce client...

Puis j'ai réfléchi au problème et je me suis dit que je ne pouvais pas passer une demi-heure au téléphone à expliquer des règles qui sont la base du savoir vivre selon moi. Qui écrirai une lettre papier entièrement en majuscules ? Pourquoi serait-ce normal dans un e-mail ? Bref, j'ai finalement trouvé une solution.

## Filtrer les majuscules

C'est tout bête, mais diablement efficace. Pour ne pas subir l'ignorance ou la bêtise, rien de tel que le filtrage. Je me suis donc mis à la recherche d'une extension pour Thunderbird qui filtre les messages pour passer les majuscules en trop en minuscule, mais je n'ai rien trouvé.

Je me suis dit que ça prendrai pas trop de temps de la faire vu que je connais bien l'univers des extensions pour Firefox. Alors je m'y suis mis, et j'ai déjà quelques résultats.

## CapsKiller

![Logo actuel de CapsKiller](/public/illustrations/capskiller.png)Bref, j'ai créé CapsKiller. Comme son nom l'indique, cette extension pour Thunderbird supprime toutes les majuscules utilisées de manière abusive et les remplace par des minuscules. Pour l'instant dans les sujets des e-mails, mais je pense parvenir à filtrer également le contenu des e-mails (edition du 25 février 2013 : c'est maintenant fait !). Vous pouvez [télécharger Caps Killer sur le site des extensions pour Thunderbird](https://addons.mozilla.org/fr/thunderbird/addon/caps-killer/ "Télécharger Caps Killer").

J'ai créé [un dépôt GitHub](https://github.com/nfroidure/CapsKiller "Voir le dépôt GitHub") pour vous permettre de regarder la source, voire de me filer un coup de main. Comme toutes mes extensions, le code est sous licence GNU/GPL donc faîtes vous plaisir.

Si une âme charitable se sent capable de créer un logo mieux que celui que je viens de faire, qu'il se fasse connaître (ça ne devrait pas être trop difficile de faire mieux).

CapsKiller est compatible avec Thunderbird 3 et supérieur. Pour tester cette extension, il vous suffit de cloner le projet et de créer un fichier nommé "capskiller@elitwork.com" contenant le chemin vers le dossier où vous avez cloné la source et de le mettre dans le dossier extensions de votre profil Thunderbird. C'est expliqué plus en détail dans le fichier README.md du dépôt.

Je réfléchis à filtrer tous les autres petits trucs énervants, comme : ??? ou !!! ou ... à la fin d'une phrase ou d'un sujet. Surtout n'hésitez pas à me donner d'autres exemples qu'on se constitue une petite liste des trucs qu'on a pas envie de voir dans un e-mail.

En attendant, j'ai déjà vu passer un ou deux filtrages, les spams sont friands des majuscules, même s'il ne sont pas filtrés par le logiciel anti-spam, au moins, leur majuscules ne me piquent plus les yeux :).
