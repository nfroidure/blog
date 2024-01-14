---
title: Match IE8 With Rework And Gulp!
description: Rework is a very powerful tool. It allows working with CSS contents in a friendly manner. Let's improve you IE8 compatibility with it.
leafname: match_ie8_with_gulp_and_rework
link:
  label: Matching IE8 with rework
  title: Learn how to match IE8 with rework
date: "2014-03-15T15:05:01.000Z"
lang: en
location: US
keywords:
  - CSS
  - Gulp
  - Rework
categories:
  - Gulp
---

# Match IE8 With Rework And Gulp!

---

**Retrospective note:**

This article is outdated and here for historical reasons, do not use the tools or approach it describes currently.

---

Rework is a very powerful tool. It allows working with CSS contents in a friendly manner. Let's improve you IE8 compatibility with it.

I discovered [Rework](https://github.com/reworkcss/rework "Visit the rework repository") recently thanks to the [Nicolas Gallagher recent blog post](http://nicolasgallagher.com/custom-css-preprocessing/ "Read his blog post"). It made me think about the recent ChtiJS build migration from Grunt to Gulp. One thing I did with our Grunt build was to [create a IE8 specific CSS file](https://github.com/ChtiJS/chtijs.francejs.org/blob/223ba7bbce89d46ed08dd329dcf520ce92f812d1/grunt-config/website%5Fbuild/build%5Ffront-tasks.js#L3 "See the concerned code") by removing each rem units and replacing them with px units. It worked well but wasn't perfect since it didn't took in count the CSS syntax and could have lead to bugs for complex stylesheets.

On the other hand, give up rem units just for IE8 support is a bad idea. The rem unit system is really [powerful](http://snook.ca/archives/html%5Fand%5Fcss/font-size-with-rem "Look at this excellent article on font sizing with rem") when you want to size your contents. It gives you the em advantages without the well know nested em problems.

So I decided to create a Rework plugin in order to reproduce this behavior more safely. I called it [rework-rem2px](https://github.com/nfroidure/rework-rem2px "See the public repository") and you can already find it on NPM. It works well, but the IE specific stylesheet were still containing some extra code, especially media queries that old IE version doesn't understand.

Thanks to the community, something already exists. [css-queryless](https://github.com/iamdustan/queryless "See the queryless repository") remove media queries from a CSS file and also allows you to specify some expressions for wich you want to keep the media queries content in place that matches.

Ended up with this [Gulp task](https://github.com/ChtiJS/chtijs.francejs.org/blob/09c02aa9ab71fd324c61f917b907aafb706398ff/gulpfile.js#L127 "Look at the ChtiJS gulp build"):

```js
// CSS
gulp.task("build_styles", function (cb) {
  var keepmatches = ["screen and (min-width: 61rem)", "print"];

  gulp
    .src(conf.src.less + "/main.less")
    .pipe(g.less())
    .pipe(g.autoprefixer())
    .pipe(gulp.dest(conf.build.css))
    .pipe(g.rework(queryless(keepmatches), rem2px(16)))
    .pipe(
      g.rename({
        suffix: "-ie",
      }),
    )
    .pipe(gulp.dest(conf.build.css))
    .once("end", cb);
});
```

Let me know you own tips to write modern CSS that work on IE8!
