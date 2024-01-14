---
title: Create Native NodeJS Modules Fallbacking To Emscripten Ones
description: Suprisingly, creating a native module is not that hard. Making it compile on any platform and gracefully handle compilation fails is a bit more tricky.
leafname: native-node-module
link:
  label: Native NodeJS module
  title: Learn how to creative native modules surviving compilation failures.
date: "2015-06-26T15:50:23.000Z"
lang: en
location: US
keywords:
  - JavaScript
  - NodeJS
  - NPM
  - Modules
  - C++
  - Emscripten
categories:
  - JavaScript
---

# Create Native NodeJS Modules Fallbacking To Emscripten Ones

---

**Retrospective note:**

This article is outdated and here for historical reasons. It was an interesting journey but you will probably find better tools to do the same thing now.

---

If you're a frontend developer, you probably already heard about icon fonts. If you use the Gulp build tool, you maybe already used [gulp-iconfont](https://www.npmjs.com/package/gulp-iconfont). As its maintainer, when I heard about the WOFF2 font format, I really wanted to get it in output of my gulp plugin.

Sadly, there were no JavaScript implementation of it. It was the time for me to dive deeper into NodeJS C++ add-ons and the Emscripten project.

## NodeJS C++ add-on: easy!

Creating a NodeJS add-on was blazing fast. The build system is incredibly well documented and works like a charm.

Typically when creating a native add-on you need to create a wrapper written in C++ that glue the library you want to use to the V8 engine. Mine is [pretty simple](https://github.com/nfroidure/ttf2woff2/blob/8060224462994f283842c7ff5dec13cb0914376c/csrc/addon.cc). It indeed wraps the Google's [woff2 project](https://github.com/google/woff2/blob/09c4eba0f679640ddddfd5315edbb72e4d7d8447/src/woff2%5Fenc.cc#L175) encoding function. This C++ function signature:

```cpp
bool ConvertTTFToWOFF2(
  const uint8_t *data, size_t length,
  uint8_t *result, size_t *result_length
);
```

becomes this NodeJS one:

output:Buffer function ttf2woff2(input:Buffer);

The most complex work was to figure out how to create a NodeJS Buffer from a C one. Indeed, I had to create a new JavaScript Buffer instance by invoking its global constructor from the C++ code. That way, when no more references to the Buffer will be set in the JS user land, then, it will automatically be garbage collected per the V8 engine avoiding the need to free it manually via another function call.

Once the wrapper is made, you just have to create a file named [binding.gyp](https://github.com/nfroidure/ttf2woff2/blob/8060224462994f283842c7ff5dec13cb0914376c/binding.gyp) that allows you to specify building instruction for the various compilers. We had to struggle a bit with the MacOSX one since I couldn't test by myself.

And that's it! Your module gets compiled at `npm install`. In fact, I had to test a few time and correct compilation errors progressively but it was suprisingly fast to get it up and running. For that testing matter I set up a [few commands](https://github.com/nfroidure/ttf2woff2/blob/8060224462994f283842c7ff5dec13cb0914376c/package.json#L14-L15) to my `package.json`.

But what about users whose OS can't build it? How to not let them down?

## Emscripten for the win!

The Emscripten project allows you to compile C/C++ projects to JavaScript. It was a great chance for me to improve my module quality by fallbacking to such a build.

It was a bit harder to get it running. First the Emscripten documentation is really light especially on how to interface your build with your other JavaScript code.

I finally managed to [create a wrapper](https://github.com/nfroidure/ttf2woff2/blob/8060224462994f283842c7ff5dec13cb0914376c/jssrc/index.js) for it. As you can see, I had to manually manage the allocated memory in the JS wrapper except for the output buffer that I had to free on the C side with a second function call (strange errors happens when trying to free C side allocated memory from the JavaScript module).

Once again, I made [some scripts](https://github.com/nfroidure/ttf2woff2/blob/8060224462994f283842c7ff5dec13cb0914376c/package.json#L16-L17) to simplify the build. Basically, it query the `binding.gyp` file with [miniquery](https://github.com/SimpliField/miniquery) for the C/C++ files to build, remove the `addon.cc` one that we do not want and then set it as args to the [emcc](http://kripken.github.io/emscripten-site/docs/tools%5Freference/emcc.html) compiler.

The output file is basically a JavaScript module that can either be used with NodeJS or in the browser.

## Gracefully fail compilation

So, now we have our Emscripten build, let's fallback to him when the native NodeJS add-on compilation goes wrong. First, we must ensure that any failure won't impeach the module to install. We're basically doing this by [overriding](https://github.com/nfroidure/ttf2woff2/blob/8060224462994f283842c7ff5dec13cb0914376c/package.json#L18) the default installation script to exit with a 0 code whatever result the compiler gives.

Then, as a main JavaScript file we will ensure failing to bind to the native add-on will result in requiring the Emscripten fallback. It is simply done by [catching exceptions](https://github.com/nfroidure/ttf2woff2/blob/8060224462994f283842c7ff5dec13cb0914376c/src/index.js) when requiring the bindings.

It works! But what about browserifying it?

## Browserify

In order to allow `gulp-iconfont` users to preview and download the resulting fonts made with it (and to see if it was feasible :p), I made a [full frontend font builder](http://nfroidure.github.io/svgiconfont/). So, I immediately tried to use my shinny new module to also output WOFF2 files.

The fact is that it doesn't work out of the box. Browserify try to add every NodeJS dependencies that appears to be useless when using the Emscripten module on the front-end side.

Chances are that Browserify allows to skip the parsing for some files. Plus [a simple trick](https://github.com/nfroidure/ttf2woff2/blob/master/jssrc/post.js) to fix the Emscripten require, I've finally been able to make the magic happen.

I'm really impressed by how a C/C++ noob like me have been able to do this in the free time of a few days. If you didn't already, you really should have a look at NodeJS native bindings!
