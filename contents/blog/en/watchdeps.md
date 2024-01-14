---
title: Watching Your NodeJS Projects's Dependencies The Easy Way
description: Using watchdeps to automagically watch your project's dependencies.
leafname: watchdeps
link:
  label: Meet watchdeps
  title: Learn more about how to keep in touch with the NPM modules you use.
date: "2015-03-08T10:07:32.000Z"
lang: en
location: US
keywords:
  - JavaScript
  - NodeJS
  - NPM
  - Modules
categories:
  - JavaScript
  - NodeJS
  - NPM
  - Modules
---

# Watching Your NodeJS Projects's Dependencies The Easy Way

---

⚠ Beware: This article is outdated. The watchdep approach is not relevant anymore since you can subscribe to versions only reducing noises of listening to the entire project's activity.

---

```sh
# TL; DR:
npm install -g watchdeps
cd myproject && watchdeps -u username
```

Since NPM made easy the dependency management, we tend to use a lot of third party code. That's a good thing. Keep not repeating yourself.

![With great powers comes great responsibility](/public/illustrations/great_powers-great-responsibility.gif)
[Source MTV](http://www.mtv.com/news/2092125/attractive-things-sober-people/ "View the image source")

That said, embedding third party code is not just about npm installing modules.

As developers, we're responsible of listening to new versions, changes, issues etc. of that code.

Since I couldn't accept spending my lifetime doing the following:

![Animation showing the GitHub watch action](/public/illustrations/github-watch.gif)

I created a simple CLI utility called [watchdeps](https://github.com/nfroidure/watchdeps). It just watch every dependencies of a Node project for you by simply running one command.

```sh
sudo npm i -g watchdeps
cd myproject/
watchdeps -u nfroidure
```

# Done!

That's it! All your dependencies with a GitHub repository associated are now watched and you'll know everything about its evolution. Simple enough?
