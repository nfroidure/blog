---
title: No more middlewares, please
description: Why I think middlewares are a bad thing, how I am replacing them.
leafname: no_more_middlewares
link:
  label: No more middlewares!
  title: See why I won't use middlewares anymore
date: "2016-11-05T19:50:20.000Z"
lang: en
location: US
keywords:
  - JavaScript
  - Middlewares
categories:
  - JavaScript
  - Middlewares
---

# No more middlewares, please

When it comes to programming, there is a trap on which every programmer fall: elegant code. I'm often surprised to see even experienced developers qualifying a code snippet as elegant or beautiful.

From my point of view, each time I found an API interface allowing me to create some elegant code, it ended up as a nightmare codebase, full of unmaintainable spaghetti code.

Most of those nice, elegant and cool APIs fallen in disgrace in developers minds:

- [Method Chaining](https://www.reddit.com/r/javascript/comments/1sk8vm/method%5Fchaining%5Fgood%5For%5Fbad%5Fthing/cdyebjh/): I think it is the first reason why JQuery will finally died, if not yet done.
- [POO](https://blog.pivotal.io/labs/labs/all-evidence-points-to-oop-being-bullshit): Not that objects and classes are harmful but thinking everything in term of objects/classes is a non-sense. Can't remind the time I find out that a fully OOP application was easily maintainable.
- [ORM/ODM](http://www.yegor256.com/2014/12/01/orm-offensive-anti-pattern.html): Even OOP guys find it harmful. I spent horrible moments using Mongoose. Would not recommend it to my worst enemy.
- [Mixins](https://medium.com/@dan%5Fabramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750#.8k7i3x68a): Everything is in the name. Mixing is the best way to get messy code.

My current statement is: **if you find some code elegant, it has great chances to be the next bullshit you'll step in**.

## Here be middlewares

As a JavaScript developer I heavily used Express with NodeJS. At first, I found its middleware system really elegant. Well, at first.

**When it comes to debugging, it is just a nightmare.** Your **stack traces are unreadable**. When you open a controller, you have to check what happens before it is invoked and what will be done next to fully understand its behavior.

You end up with **lots of a god objects**, `req`, `res` and `app` for instance, that may or may not contain: a query, some cookies, encoded or decoded body, that method or this other one... It not only makes you mad when it comes to work on an Express application but also **makes the code reuse very difficult**.

Indeed, to reuse a controller, you have to find out every middlewares it depends on and set them up in the Express application where you want to reuse it. Problem: There is great chances that the same middleware is already in use but with a different version. And it is not the same shitty property that is set on that shitty god object.

This is why I think **middlewares are an anti-pattern**. Your controller should contain the complete workflow that allows you to get a response from an HTTP request. Transforming the following usual code:

```js
// From the Gist: https://gist.github.com/nfroidure/3c0a5858518663be186a1a64d160ee31

module.exports = (app) => {
  // Where the hell is this config set?
  const config = app.get("config");
  // How can I see what this timer do?
  const timer = app.get("timer");

  app.post((req, res, next) => {
    const data = {};
    // Which middleware set up this query params?
    if (req.query.ms) {
      data.when = timer.now();
    } else {
      data.when = new Date(timer.now()).toISOString();
    }
    // How this body was set, in which middleware?
    if (config.repeatBody) {
      data.body = req.body;
    }
    res.jsonBody = data; // Which consequences setting that jsonBody has?
    next(); // What happens then? New headers? Body transformations?
  });
};
```

Into something way more expressive:

```js
// From the Gist: https://gist.github.com/nfroidure/43a0eeb06549aeb32dd23c91fa5e0f11

// No middleware, just pur functions
import getBodyFromReq from 'pureBodyParser';
import getQueryFromReq from 'pureQueryParser';
import sendToRes from 'pureResponseMaker';

// Use dependency injection for required services
// app/config/timer just come from this function caller
module.exports = ({ app, config, timer}) => {

  app.post((req, res) => {
    // Promise based workflow instead of a middleware chain
    // could have been async/await too
    Promise.all([
      // No surprise, the body comes from the pureBodyParser module
      // But I can already guess it allows JSON or YAML
      getBodyFromReq.bind(null, req, ['json', 'yaml']),
      // And so on for the query
      getQueryFromReq.bind(null, req),
    ])
    .then(_buildResponse.bind(null, {timer, config})
    // No surprise, the response is sent by the pureResponseMaker module
    // But I can already guess it could output JSON or YAML
    .sendToRes(sendToRes.bind(null, req, res, ['json', 'yaml'], 200));
  });

};

// the pure function that process the request
// could be reused in a completly different context
// a frontend service worker or a websocket server
function _buildResponse({timer, config}, [body, query]) => {
  const data = {};

  if(query.ms) {
    data.when = timer.now();
  } else {
    data.when = new Date(timer.now()).toISOString();
  }

  if(config.repeatBody) {
    data.body = req.body;
  }
  return data;
}
```

Since the controller is strongly tied to its dependencies, you could just copy paste it into your other projects and npm install the various modules it actually uses. Magic? No, simple, atomic, reliable code. Nothing elegant, no hype, just stupid code telling what it does.

One could argue that it introduces huge boilerplates. We are switching from a 24 lines controller to a 42 one. My advice is that the glue code that strongly tie the controller with its actual underlying logic can be considered as comments that ends up to be code.

The middleware based code, to be inclusive, should add comments telling where all that magic happens. But the fact is that commenting is a shitty way to help others to grasp your code. I personally use it only to explain something I cannot show with meaningful code. Most of the time, it's all about business constraints or legacy issues.

Also, nothing impeach you to group several stages of your workflow into a single pure function if you figure out that a particular step sequence is used in most controllers. Importing this function will always show the way for readers to find out their content.

Finally, this workflow approach is in my opinion way more adapted to HTTP. Indeed, what is an HTTP endpoint except a function that takes a request and returns a response? Why would we have to deal with something else than functions decomposing it into simple steps?

As a conclusion, I would say that good code is not smart or elegant. It is readable, reliable, naive in a word: simple. And you probably know how hard it is to do simple ;).

**Edit:** I ended up bringing up all those preferences in a JavaScript module intended to help building REst APIs called [Whook](https://github.com/nfroidure/whook).
