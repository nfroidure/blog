---
title: My VSCode Configuration
description: A quick tour of my VSCode configuration.
leafname: my_vscode_configuration
link:
  label: VSCode configuration
  title: Check my VSCode configuration
date: "2019-01-03T20:00:00.000Z"
lang: en
location: FR
keywords:
  - Code
  - Editor
  - VSCode
categories:
  - Code
  - Editor
  - VSCode
---

# My VSCode Configuration

I used a lot of editors for coding, from [Notepad++](https://notepad-plus-plus.org/fr/) to [SublimeText](https://www.sublimetext.com/) and [Atom](https://atom.io/) (GitHub's code editor) to finally adopt VSCode, following the hype.

After using it for almost a year, I'm satisfied by it. VSCode is kinda like Atom but faster (based on my experience of Atom a year ago, things may have change in the meanwhile).

I'm not really a customization aficionado so my configuration won't blow your mind. I consider it as the configuration VSCode should have by default, so that people like me could just download it and avoid spending time on customizing it.

## Preferences

One nice thing with VSCode is that settings are saved as plain JSON, so let's print it rawly:

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

The first parameters are here due to strange zooming default behavior of VSCode. It basically set it like Atom's one.

I didn't add the fourth by hand but VSCode suggestions are a good way to discover new plugins so left it as is. The same goes for imports but it is convenient to avoid spending time on renaming files by hand.

The drag and drop configuration removes the confirmation modal when moving files in the file tree. It could be dangerous but since I use git for everything, it do not care accidentally messing up my folders.

VSCode tends to detect file types correctly out of the box except for my blog's HTML files (yes, I write my blog posts in raw HTML). I don't know why but adding that line fixed the issue.

## Installed extensions

Working with VSCode requires installing a few extensions.

### Languages

Here are the various extensions I had to install to work with the various languages I use:

- **JavaScript:** [Babel ES6/ES7](https://marketplace.visualstudio.com/items?itemName=dzannotti.vscode-babel-coloring) for syntax highlighting [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), by Esben Petersen, for quality checks, [Jest](https://marketplace.visualstudio.com/items?itemName=orta.vscode-jest) for testing and [snapshot-tools](https://marketplace.visualstudio.com/items?itemName=asvetliakov.snapshot-tools) to have nice shortcuts to the snapshots. [JSON Tools](https://marketplace.visualstudio.com/items?itemName=eriklynd.json-tools), by Erik Lynd, is useful to format some JSON right in the editor. [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) is installed but I rarely use it preferring the Chrome console.
- **Rust:**  
  [Rust (rls)](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust) provides great support for the Rust language while [Crates](https://marketplace.visualstudio.com/items?itemName=serayuzgur.crates), by Seray Uzgur, helps managing dependencies.
- **C/C++:**  
  [C/C++](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) is nice for syntax highlighting, debugging, browsing and autocompletion. I used it in association with [Arduino](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.vscode-arduino) for my hardware projects.
- **Go:**  
  [Go](https://marketplace.visualstudio.com/items?itemName=ms-vscode.go) were sufficient for the little use of Go I had.
- **DevOps:**  
  [Docker](https://marketplace.visualstudio.com/items?itemName=peterjausovec.vscode-docker) allows seeing summaries of what docker does right in your editor. Not bad. [Terraform](https://marketplace.visualstudio.com/items?itemName=mauve.terraform), by Mikael Olenfalk, adds Terraform files (.tf) autocompletion and syntax highlighting. [Kubernetes](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools) and [Kubernetes Support](https://marketplace.visualstudio.com/items?itemName=ipedrazas.kubernetes-snippets) are installed but not enough usage currently to give a decent feedback.
- **The \*ML things:**  
  [YAML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) to write YAML despite YAML. [Better TOML](https://marketplace.visualstudio.com/items?itemName=bungcip.better-toml) to write TOML, despite TOML.
- **Blogging:**  
  [Spell Right](https://marketplace.visualstudio.com/items?itemName=ban.spellright) by Bartosz Antosik is nice to avoid typos but you'll probably have to set it up with languages dictionaries of your choice. [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one) by Yu Zhang provides all you need to write Markdown (keyboard shortcuts, table of contents, auto preview and more).

### Others

I had to install [Duplicate action](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-duplicate) to be able to duplicate files/folders in the file tree view...

[Git History](https://marketplace.visualstudio.com/items?itemName=donjayamanne.githistory) add Git views in VSCode. I prefer using CLI most of the time but it is sometimes useful for a clearer view of the repository state.

[VS Live Share](https://marketplace.visualstudio.com/items?itemName=ms-vsliveshare.vsliveshare) is theorically great but in practice we tried it once and reviews finally ends up IRL since way more convenient.

## Shortcuts

Here is the plain list:

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

`ctrl + shift + d` is for duplicating a line like in Atom's (and many other editors) defaults. The same goes for `ctrl + l` to select a line, `ctrl + t` to run tests, `ctrl + down/up` to move selected lines and `ctrl + alt + f` to format the current file. The last shortcut is `ctrl + k` that allows to empty the integrated terminal's buffer to fit the native terminal custom configuration I set up since I'm used to the Mac `cmd + k` shortcut.

That's it! I hope you find this post helpful and feel free to share yours.

**Edit:** Found out that you can [recommend extensions](https://github.com/ChtiJS/chtijs.francejs.org/blob/master/.vscode/extensions.json) directly in your project's repository. This is a really nice way to onboard you teammates to your projects.
