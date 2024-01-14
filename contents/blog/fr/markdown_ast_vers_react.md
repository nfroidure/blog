---
title: Rendre votre contenu Markdown avec React via l'AST
description: Où comment ne plus jamais utiliser dangerouslySetInnerHTML.
leafname: markdown_ast_vers_react
link:
  label: AST Markdown et React
  title: Découvrez ma façon de rendre le contenu Markdown en React
date: "2021-12-01T22:00:00.000Z"
lang: fr
location: FR
keywords:
  - JavaScript
  - TypeScript
  - React
  - "Markdown "
  - AST
categories:
  - JavaScript
  - TypeScript
  - React
  - "Markdown "
  - AST
---

# Rendre votre contenu Markdown avec React via l'AST

Si vous avez déjà utilisé Contentful, un head-less CMS, vous avez probablement, comme moi [écrit du code pour transformer vos blocs Contentful vers vos composants React](https://github.com/nfroidure/douaisis-2021/blob/7c154197556fea1a86744c38a730a9cc21f567aa/utils/contentful.tsx#L131-L160).

J'ai trouvé ça très propre, mais pour mon [blog politique](https://nicolasfroidure.fr), je ne voulais pas utiliser Contentful mais simplement commiter mon contenu sur le dépôt idoine en Markdown.

## Du Markdown vers l'arbre AST

J'ai donc commencé à chercher un module qui me permettrait d'obtenir, à partir de mon Markdown, le même genre d'arbre qui sort de l'éditeur de contenu de Contentful.

J'ai trouvé que la combinaison [unified et remark](https://github.com/nfroidure/politics/blob/38c77b03c697dd6d1c6e79eb0bc5751d6629cbb0/src/utils/markdown.tsx#L330-L352) donnait quelque chose de très similaire à ce que propose Contentful.

## Gestion du HTML

La partie complexe a été de gérer les balises HTML présentes dans le markdown. En effet, ce n'était pas parsé en prenant en compte les balises entrantes/fermantes. J'ai dû créer un petit algorithme récursif [pour gérer cette problématique](https://github.com/nfroidure/politics/blob/38c77b03c697dd6d1c6e79eb0bc5751d6629cbb0/src/utils/markdown.tsx#L387-L465). Je dois toujours y gérer les attributs HTML.

## Faire la correspondance avec les composants

Au final, [la fonction qui rend le contenu](https://github.com/nfroidure/politics/blob/38c77b03c697dd6d1c6e79eb0bc5751d6629cbb0/src/utils/markdown.tsx#L353-L368) est quasiment identique à celle de Contentful. Plus question d'utiliser `dangerouslySetInnerHTML` ;).

## Petits plus

En sus, j'ai pris le soin de transformer tous les titres de type `<h2+>` pour créer des ancres automatiquement et pouvoir lier [une section en particulier (comme ici avec le titre "Une fuite en avant sans vision politique")](https://nicolasfroidure.fr/blog/pour-une-region-actrice-d-un-numerique-humain#une-fuite-en-avant-sans-vision-politique).

J'ai simplement dû créer une fonction pour récupérer le texte d'un titre [quel que soit son contenu et la profondeur de ses sous-éléments imbriqués](https://github.com/nfroidure/politics/blob/38c77b03c697dd6d1c6e79eb0bc5751d6629cbb0/src/utils/markdown.tsx#L370-L385) et ajouter mon [composant d'ancrage](https://github.com/nfroidure/politics/blob/main/src/components/anchored.tsx) au [mapper de composant](https://github.com/nfroidure/politics/blob/38c77b03c697dd6d1c6e79eb0bc5751d6629cbb0/src/utils/markdown.tsx#L195-L209).

J'espère que le code vous a plût, n'hésitez pas à le réutiliser. J'en ferais une librairie quand cela deviendra un peu plus stable et facilement réutilisable.
