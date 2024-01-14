---
title: "Orange HTML5 Hackathon : Pourquoi j'ai aimé !"
description: Dans le cadre du programme Orange Partner, un hackathon HTML5 de 30h non-stop a été organisé. Avec mon équipe, nous avons remporté le grand prix du jury.
leafname: orange_hackaton
link:
  label: Orange HTML5 Hackathon
  title: Voir mon impression sur ce hackathon
date: "2012-06-13T08:28:45.000Z"
lang: fr
location: FR
keywords:
  - Hackathon
  - Orange
  - HTML5
  - JavaScript
  - NodeJS
categories:
  - Hackathon
---

# Orange HTML5 Hackathon : Pourquoi j'ai aimé !

Dans le cadre du programme Orange Partner, un hackathon HTML5 de 30h non-stop a été organisé. Avec mon équipe, nous avons remporté le grand prix du jury.

Obtenir une application HTML5 innovante et fonctionnelle en 30h est un véritable défi. Orange nous a pourtant permis de le relever dans les meilleures conditions. Petit retour d'expérience sur le Hackathon et l'application créée ces deux derniers jours pour laquelle nous avons obtenu le premier prix.

## Ambiance et fair play

Clairement, je suis vraiment ravi de l'ambiance cosmopolite de ce hackathon qui nous a permis de découvrir de nouveaux visages dans une ambiance très sympa (Espace Cinko à Paris). Malgré une durée honorable, je n'ai pas bu un seul café froid (sauf ceux qui ont été abandonnés lors d'une séance intensive de code). Les serveurs et le staff Orange étaient très prévenants, ça fait toujours plaisir d'être traité avec égard. Je ne savais pas trop à quoi m'attendre en arrivant et j'ai finalement été très agréablement surpris.

Orange a joué le jeu à 100% avec un vrai hackathon, des projets développés from scratch et des équipes formées sur place. Le jury était composé d'acteurs externes (journalistes, représentants de Samsung et Intel...etc.) et malgré la compétition, un très bon esprit régnait. Chacun d'entre nous étant curieux des concepts développés par chaque équipe, des échanges très intéressants trop vite interrompus par la montre qui tournait inexorablement.

Les seuls bémols que je poserais sont les problèmes de connexion parfois rencontrés (rapidement traités) ainsi que le manque de serveur tout prêt ou d'acteur du cloud pour nous proposer des solutions qui nous auraient permis de gagner du temps. Les membres de ma team utilisaient Windows, j'ai donc dû paramétrer un serveur Samba pour leur donner un accès au code source de l'application.

## Ma team et notre App

![Formulaire d'enregistrement](/public/illustrations/helpme3.png) J'ai eu le plaisir de travailler avec Rocky Lal, développeur VB.net intéressé par Javascript/HTML5 et [Julien Picaud](https://twitter.com/#%21/julpics "Voir son profil Twitter"), product manager dans une boîte de développement applicatif. Nous nous sommes tout de suite regroupés et nous avons décidé de développer une application mobile HTML5. Afin de coller aux critères du hackathon, nous avons tenté de trouver une idée au business model réaliste et utilisant un maximum d'API parmi les suivantes (Orange API, HTML5 API, Facebook API).

HelpMe! matche les deux premières. Son concept est simple : fédérer une communauté d'entraide dont chaque membre déclare son n° de GSM, ses compétences et les langues qu'il parle. Les GSM sont géolocalisés régulièrement grâce à l'API Geolocation d'Orange.

L'avantage de cette API est qu'elle ne nécessite pas que les membres de la communauté aient une application qui tourne en continu sur leur mobile consommant de la batterie. Elle triangule la position des mobiles grâce aux antennes relais utilisées par les membres de la communauté.

![Le formulaire de demande](/public/illustrations/helpme1.png) Lorsque le membre s'enregistre, il reçoit un SMS lui demandant d'accepter que nous le géolocalisions.

Nous voilà avec une base de compétences géolocalisées qu'il ne nous reste qu'à mettre à disposition des utilisateurs. C'est le but du petit formulaire disponible en page d'accueil.

Simplissime, il permet de préciser le type de compétences souhaitées et de joindre un message. De manière transparente, la page d'accueil récupère la géolocalisation de l'utilisateur grâce à l'API HTML5 Geolocation. Une fois le formulaire soumis, le système passe en revue les membres de la communauté afin de déterminer ceux qui ont les bonnes compétences et se trouvent à proximité.

Si un membre est sélectionné, un SMS contenant le type de demande, le message et la localisation de la personne lui est transmis.

Nous avons également utilisé un cache manifest (HTML5 AppCache) de manière à ce que l'application soit disponible rapidement même dans le cas où la connexion est très mauvaise. La communauté étant ouverte, il n'est pas nécessaire d'avoir déclaré ses compétences pour obtenir de l'aide.

## Sous le capot

![Ecran de confirmation](/public/illustrations/helpme2.png)

Côté serveur, j'ai utilisé NodeJs que je n'avais jamais utilisé auparavant, une petite difficulté supplémentaire qui fût finalement aisément surmontée par rapport au timing imposé. D'ailleurs la mise en place est assez intuitive et en tant que développeur Javascript expérimenté et avec une bonne expérience en backend, c'est assez simple de se mettre dans le bain.

J'ai vite trouvé quelques exemples de code qui satisfaisaient mes besoins : un serveur de fichiers web, la récupération des contenus des requêtes, l'utilisation d'une API REST pour les accès à l'API Orange...

Le tout a été [pushé sur GitHub.](https://github.com/nfroidure/HelpMe "Voir le dépôt des sources")

## Avenir du bouzin

Je n'ai pas réfléchi à son avenir, je ne sais même pas si il en a car mon emploi du temps est chargé cependant, de nombreux cas d'utilisation sont possibles.

En effet, les propriétaires de magasins etc... pourraient être intéressés par une application qui leur donnerait l'occasion de répondre à des demandes d'aide de leur quartier en temps réel afin de montrer qu'ils sont sympas, d'attirer du monde, d'établir un premier contact et d'espérer doper leurs ventes avec plus de chalands.

Les entreprises également pourraient équiper leur personnel de téléphones de ce type afin que des visiteurs ou des salariés puissent rapidement informer qui de droit lorsqu'un problème survient (trouver le défibrillateur en cas d'arrêt cardiaque par ex.).

Pour les zoos, les grandes zones touristiques (je pense à Center Parcs), cela peut aussi être intéressant de proposer ce type de service aux résidents afin d'offrir une couverture haut de gamme aux clients.

Bref, les idées sont nombreuses, les entreprises intéressées pour développer ce concept peuvent me contacter, notre team peut se reconstituer, on est bien-sûr restés en contact !
