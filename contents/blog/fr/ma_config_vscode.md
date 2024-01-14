---
title: Ma configuration VSCode
description: Petit tour d'horizon de ma configuration VSCode pour ceux que ça peut intéresser ;).
leafname: ma_config_vscode
link:
  label: Configuration de VSCode
  title: En savoir plus sur ma configuration VSCode
date: "2018-12-30T20:00:00.000Z"
lang: fr
location: FR
keywords:
  - Code
  - Éditeur
  - VSCode
categories:
  - Code
  - Éditeur
  - VSCode
---

# Ma configuration VSCode

Que de chemin parcouru depuis le temps où j'utilisais [Notepad++](https://notepad-plus-plus.org/fr/) au point de faire des [pirouettes inimaginables](./notepad_plus_plus_debian_gnu_linux) pour continuer de l'utiliser après être passé sous GNU/Linux.

Entre temps, j'ai réussi à sortir de Vim, j'ai adopté successivement [SublimeText](https://www.sublimetext.com/), [Atom](https://atom.io/) (l'éditeur de GitHub) pour enfin adopter VSCode suite aux pressions de la hype.

Bref, après presque un an d'utilisation, je pense pouvoir dire que je suis satisfait de cet éditeur qui est peu ou proue semblable à Atom en un peu plus rapide (basé sur mon expérience d'Atom de l'époque ce qui peut ne plus être vrai aujourd'hui).

Je ne suis pas vraiment un aficionado de la personnalisation des éditeurs de code, donc ne vous attendez pas à des trucs de fou. Je pense que ma configuration est plutôt ce que devrait être la configuration de VSCode par défaut pour que les gens comme moi puissent continuer à NE PAS personnaliser leurs éditeurs.

## Mes préférences

Un truc cool avec VSCode, c'est qu'on peut utiliser JSON pour régler ses préférences. Voici donc le mien :

```json
{
  "window.zoomLevel": 0,
  "editor.mouseWheelZoom": true,
  "workbench.colorTheme": "Default High Contrast",
  "extensions.ignoreRecommendations": false,
  "javascript.updateImportsOnFileMove.enabled": "always",
  "explorer.confirmDragAndDrop": false,
  "files.associations": {
    "*.html": "html"
  }
}
```

Les deux premiers paramètres sont dûs à la façon un peu zarbi de gérer le zoom de VSCode. Grosso-modo, ça permet d'avoir le comportement d'Atom.

La troisième ligne est là indépendamment de ma volonté, mais bon, les recommendations sont souvent utiles donc je vais le laisser ;). Pareil pour la ligne des imports, je me souviens plus l'avoir ajoutée, mais elle permet de changer les importations de modules au renommage d'un fichier et c'est cool.

La configuration du drag'n drop me permet de vivre dangereusement, si je drag et drop un fichier par erreur alors je peux tout casser car VSCode ne me demande pas de confirmer ;). Bon, avec Git, rien d'irréversible, donc carpe diem.

Sinon, VSCode est une grande personne et détecte bien les types de fichiers, sauf pour les fichiers HTML de mon blog (oui, j'écris mes billets en HTML, à la main). En effet, il les reconnaît comme des fichiers Django HTML, allez savoir pourquoi&! Bref, j'ai dû placer la dernière ligne pour y remédier.

## Mes extensions

Bon, il faut quand même installer quelques extensions pour bosser avec VSCode.

### Langages

Pour travailler avec les divers languages que je rencontre, j'ai installé:

- **JavaScript :** [Babel ES6/ES7](https://marketplace.visualstudio.com/items?itemName=dzannotti.vscode-babel-coloring) pour la coloration syntaxique, [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) et [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) pour la qualité, [Jest](https://marketplace.visualstudio.com/items?itemName=orta.vscode-jest) pour les tests et [snapshot-tools](https://marketplace.visualstudio.com/items?itemName=asvetliakov.snapshot-tools) pour des petits raccourcis sympas vers les snapshots. [JSON Tools](https://marketplace.visualstudio.com/items?itemName=eriklynd.json-tools) est fort utile pour formatter du JSON sélectionné dans l'éditeur. [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) est installé mais je l'ai quasiment pas utilisé.
- **Rust :**  
  [Rust (rls)](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust) propose le support complet de Rust.
- **C/C++ :**  
  [C/C++](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) propose l'autocomplétion le debug et la navigation dans les sources, je l'ai utilisé avec [Arduino](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.vscode-arduino) pour mes projets Arduino.
- **Go :**  
  [Go](https://marketplace.visualstudio.com/items?itemName=ms-vscode.go) a suffi pour le peu de Go que j'ai fait à ce jour.
- **DevOps :**  
  [Docker](https://marketplace.visualstudio.com/items?itemName=peterjausovec.vscode-docker) permet de voir quels containers tournent en un clin d'œil. Not bad. [Terraform](https://marketplace.visualstudio.com/items?itemName=mauve.terraform) permet d'avoir l'autocomplétion de vos fichiers Terraform et la coloration syntaxique. [Kubernetes](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools) et [Kubernetes Support](https://marketplace.visualstudio.com/items?itemName=ipedrazas.kubernetes-snippets) sont installés mais peu de recul dessus.
- **Les \*ML :**  
  [YAML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) pour faire du YAML quand y'a pas le choix. [Better TOML](https://marketplace.visualstudio.com/items?itemName=bungcip.better-toml) pour faire du TOML, à l'insu de mon plein gré.

### Autres extensions

J'ai dû installer [Duplicate action](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-duplicate) pour pouvoir dupliquer des fichiers/dossiers dans l'arborescence de fichiers au clic droit...

[Git History](https://marketplace.visualstudio.com/items?itemName=donjayamanne.githistory) permet de gérer un peu vos dépôts dans VSCode directement. Je suis plutôt CLI, mais je dois avouer que parfois la vue dans VSCode peut être pratique.

[VS Live Share](https://marketplace.visualstudio.com/items?itemName=ms-vsliveshare.vsliveshare) est cool sur le papier, dans la pratique on a fait un screen share une fois chez Sencrop pour voir... La review et le pair programming ça reste donc IRL dans le canapé de la salle de pause.

## Raccourcis clavier

Sans fard, mes raccourcis clavier.

```json
[
  {
    "key": "ctrl+shift+d",
    "command": "editor.action.copyLinesDownAction",
    "when": "editorTextFocus && !editorReadonly"
  },
  {
    "key": "ctrl+shift+alt+down",
    "command": "-editor.action.copyLinesDownAction",
    "when": "editorTextFocus && !editorReadonly"
  },
  {
    "key": "ctrl+shift+t",
    "command": "workbench.action.tasks.test"
  },
  {
    "key": "ctrl+l",
    "command": "expandLineSelection",
    "when": "textInputFocus"
  },
  {
    "key": "ctrl+i",
    "command": "-expandLineSelection",
    "when": "textInputFocus"
  },
  {
    "key": "ctrl+down",
    "command": "editor.action.moveLinesDownAction",
    "when": "editorTextFocus && !editorReadonly"
  },
  {
    "key": "alt+down",
    "command": "-editor.action.moveLinesDownAction",
    "when": "editorTextFocus && !editorReadonly"
  },
  {
    "key": "ctrl+up",
    "command": "editor.action.moveLinesUpAction",
    "when": "editorTextFocus && !editorReadonly"
  },
  {
    "key": "alt+up",
    "command": "-editor.action.moveLinesUpAction",
    "when": "editorTextFocus && !editorReadonly"
  },
  {
    "key": "ctrl+alt+f",
    "command": "editor.action.formatDocument",
    "when": "editorTextFocus && !editorReadonly"
  },
  {
    "key": "ctrl+shift+i",
    "command": "-editor.action.formatDocument",
    "when": "editorTextFocus && !editorReadonly"
  },
  {
    "key": "ctrl+alt+f",
    "command": "editor.action.formatSelection",
    "when": "editorHasSelection && editorTextFocus && !editorReadonly"
  },
  {
    "key": "ctrl+k ctrl+f",
    "command": "-editor.action.formatSelection",
    "when": "editorHasSelection && editorTextFocus && !editorReadonly"
  },
  {
    "key": "ctrl+k",
    "command": "workbench.action.terminal.clear"
  }
]
```

Le `ctrl + shift + d` pour dupliquer une ligne colle à la configuration par défaut d'Atom à laquelle je me suis habitué. Idem pour `ctrl + l` pour sélectionner la ligne, le `ctrl + t` pour runner les test, les `ctrl + down/up` pour déplacer les lignes et enfin le `ctrl + alt + f` pour formater le fichier courant. Le dernier raccourcis est le `ctrl + k` qui permet de vider le buffer dans le terminal pour être consistant avec le terminal natif lui même paramétré ainsi à cause du fait que je me suis habitué pendant mon année sur un Mac au `cmd + k`.

Voilà, pour ma configuration, n'hésitez pas à proposer la votre en commentaire !
