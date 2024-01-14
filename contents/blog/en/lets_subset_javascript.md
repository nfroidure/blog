---
title: Let's Subset JavaScript
description: Currently, it's all about JavaScript and how to compile, transpile and every "ile"y things you could imagine. But what about making JavaScript smaller?
leafname: lets_subset_javascript
link:
  label: JavaScript subset
  title: Why and how to subset JavaScript.
date: "2015-07-10T13:38:03.000Z"
lang: en
location: US
keywords:
  - JavaScript
  - Esprima
categories:
  - JavaScript
  - Esprima
---

# Let's Subset JavaScript

---

**Retrospective note:**

Since the approach is still valid the library is not maintained (and the company I did it for probably don't use it anymore). If I needed to subset JavaScript now I would probably do it with the TypeScript AST/SDK instead.

---

**TL;DR:** Subsetting JavaScript is easy, you can do it with [jsub](https://github.com/SimpliField/jsub).

At [SimpliField](https://www.simplifield.com), we allow users to collect and analyse field data and as part of it, our users can create their own data models.

As a consequence, we needed a solution that allows to define dynamically computed relational constraints. Things like dynamically define a form field as optional based on some conditions/computations.

We ended up with a reliable solution based on a user interface and simple conditions. The problem we faced was that every new feature resulted in new complexity.

We were also defining a new language our API consumers would certainly hate, once publicly available. And friends don't let friends struggling with bad APIs ;).

## A few words about our stack

We're using a full JavaScript stack (we call it MEANI for Mongo Express Angular NodeJS and Ionic). The big win of this kind of stack is not only isomorphism (I had great moments building the [end-to-end user's rights management system](http://slides.com/nfroidure/reaccess) for our apps) but is mainly skill reuse.

As a JavaScript developer, I can make some changes to the back-end and apply the resulting changes in both the front-end and the mobile app. It is really valuable as you don't have to rely on someone else to make a bunch of related changes.

## Subsetting JavaScript

![Always bet in JavaScript](https://brendaneich.com/wp-content/uploads/2011/09/CapitolJS.021-768x576.png)  
[Source: Brendan Eich's blog](https://brendaneich.com/2011/09/capitoljs-rivertrail/)

So we choose to rely on JavaScript for conditionally displayed fields, computed fields, etc... The idea is simple: we need a formula language like those you can find in Open Office Calc or Microsoft Excel but we don't want to reinvent the wheel.

We also want to have the minimal learning curve for developpers that will interact with our API. Since JavaScript was already a first class citizen in our stack, subsetting its syntax was in evidence.

Thanks to the great [Esprima project](http://esprima.org), only a few hours were sufficient to create a first prototype of [jsub](https://github.com/SimpliField/jsub); a tiny project aimed to simply define a custom JavaScript subset.

You basically define a set of conditions that shapes syntactically allowed expressions. Then, you check your script against those conditions and if something is going wrong, errors will simply show up.

```js
var simpleMath = {
  conditions: [
    {
      type: "Program", // allow the root node
    },
    {
      type: "ExpressionStatement", // allow expressions
    },
    {
      type: "BinaryExpression", // allow the + and - operators
      operator: ["+", "-"],
    },
    {
      type: "Literal",
      raw: /^([0-9]{1,5})$/, // allow positive numbers
    },
  ],
};

var errors = jsub("(1 + 2) - 1", simpleMath);
assert.equal(errors.length, 0);
```

## Benefits

Having a custom syntax subsetting JavaScript provides a lot of out of the box advantages:

- Syntax highlighting: you can simply add highlighted syntax to your own API docs
- Hinting: what about a custom JSLint module to help your customers?
- Parsing: syntax errors will be the same than for JavaScript;
- No overhead: Just run it, especially if you are using the MEANI stack ;).

There's probably a lot more things interesting with this approach let me know your thoughts.
