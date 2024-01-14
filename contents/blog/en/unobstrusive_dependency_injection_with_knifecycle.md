---
title: Unobtrusive Dependency Injection with Knifecycle
description: Knifecycle is a NodeJS module aimed to provide DI power without the headaches.
leafname: toward_stricter_query_string_parserunobstrusive_dependency_injection_with_knifecycle
link:
  label: DI with Knifecycle
  title: Learn more about this module
  url: https://slides.com/nfroidure/javascript_dependency_injection
date: "2019-01-26T12:00:00.000Z"
lang: en
location: FR
keywords:
  - Dependency Injection
  - NodeJS
  - JavaScript
  - Knifecycle
  - NPM
categories:
  - Dependency Injection
  - NodeJS
  - JavaScript
  - Knifecycle
  - NPM
---

# Unobtrusive Dependency Injection with Knifecycle

![Knifecycle logo](https://raw.githubusercontent.com/nfroidure/knifecycle/main/knifecycle.svg)

[Slides](https://slides.com/nfroidure/javascript_dependency_injection "🎚 See the presentation slides")

I first used the dependency injection (DI) pattern with the AngularJS framework a few years ago. Since then, I am convinced it is one of the best design pattern out there, when used with caution. Here's why and how I finally bundled my own dependency injection library for JavaScript and NodeJS.

## What is Dependency Injection?

The [dependency injection pattern](https://en.wikipedia.org/wiki/Dependency%5Finjection "Check the full definition on Wikipedia") aims to provide the states some code depends on. That way, the actual code is completely decoupled from its own dependencies implementation / initialization.

People rarely have no advice on it, they often hate or love it, no mitigation there. I think it comes from the fact it really brings great powers but sadly it often forces you to respect a few annoying conventions on how you write and split your code.

## Definition

First of all, let's briefly recall you the DI advantages. The DI comes with the idea that the applications life cycle usually is about initializing things, use it and finally free it.

![Application Lifecycle Timeline](https://raw.githubusercontent.com/nfroidure/knifecycle/main/dependency-injection.svg)

It may be databases, external APIs, RPC calls, anything implying IOs with the rest of the world. They are a bit special and this is why DI threat it differently than simple code libraries.

Those dependencies are linked to each other so that we finally have an oriented dependency graph. The initialization and shutdown sequences are then resolving the graph in an optimized way with the best parallelism possible. This is the injector role to take care of it.

![Dependencies graph initialization and shutdown sequence](https://raw.githubusercontent.com/nfroidure/knifecycle/main/dependencies-graph-sequences.svg)

Basically, in JavaScript, DI looks like this:

```js
// With Classes
class User {
  constructor(db, log) {
    this.db = db;
    this.log = log;
  }
  async delete() {
    const result = await this.db.query("DELETE FROM users WHERE id = $id", {
      id,
    });

    if (result.deletedRows) {
      this.log(`User ${id} has been deleted!`);
    }
  }
}

// With functions
async function deleteUser({ db, log, id }) {
  const result = await db.query("DELETE FROM users WHERE id = $id", { id });

  if (result.deletedRows) {
    log(`User ${id} has been deleted!`);
  }
}
```

### The DI goodness

Using DI allows you to just declare your services dependencies and delegate the startup and shutdown process to the injector. It saves you a lot of time and allows to focus on your actual business code.

It also make your code more testable since you can easily replace a dependency per another (mocks, stubs).

Making dependencies easy to substitute also leads to a more configurable code base. Your code base pieces are also more reusable.

Finally, splitting your code into more specialized modules helps reducing the cognitive load of reasoning on its parts.

### The DI downsides

Usually, dependency injection with the help of an injector comes with downsides. First, it makes debugging harder since the code only express dependencies in a declarative way. That said, usually, injectors are bullet proof and some have a limited set of features reducing the bug risks.

Also, when using types, since DI is dynamically done, you may loose some advantages of strong typing and static code analysis.

Those downsides can be mitigated as we'll see later.

## Introducing Knifecycle

When it comes to DI, most tools are levering OOP and decorators. While it may fit the needs of OOP lovers, I prefer using the function based approach where a service is simply initialized by an asynchronous function taking the service's dependencies in argument and returning the initialized service.

Using functions also makes the code independent of the actual DI library since, you know, it's just functions and function can be called without any framework. One could just use those functions and initialize the process dependencies with actual code.

In fact, I used to create my services that way and to create the initialization code by hand for years. The thing is that it is repetitive, error prone and create boilerplate that adds no value.

I finally decided to automatize it but I didn't found a tool allowing DI usage without having to embrace a whole opinionated framework. I just wanted to use simple functions so I created one. Here comes, [Knifecycle](https://github.com/nfroidure/knifecycle).

I like to refer to Knifecycle as the DI banana without the [Gorilla](https://en.wikipedia.org/wiki/Object-oriented%5Fprogramming#cite%5Fref-armstrongjoe%5F39-1) since most DI libraries are using OOP and I am really convinced it is a mistake.

### Using Knifecycle

Declaring a service is pretty simple actually, you just have to use the various functions that allows tagging initialization functions (called initializers) with the dependencies they actually need, the name and the kind of service it provides.

```js
// From the Gist: https://gist.github.com/nfroidure/d9fb9d2d40f0614ca9f31a75a3c5201d
```

The reason why the autoService and autoProvider are prefixed by auto is that they infer from the function shape the names of the services and the dependencies they need from the functions signature. One could use the service and provider functions that basically do the same but in a more verbose manner. They can be useful to have more control on them though. That said, you can use the automatic versions and transpile it to the explicit ones by using the [`babel-plugin-knifecycle`](https://github.com/nfroidure/babel-plugin-knifecycle) module in your project's build.

Knifecycle provides a lot of helpers you can find on the [documentation](https://github.com/nfroidure/knifecycle#api). Since services initializer are simple functions, there is a lot of functional programming concepts that applies to them (wrappers, compositions, piping...). Each decorators create a newly bound function so you can reuse an initialization function with different names and dependencies as many times as you need. For instance, in the previous example, if you needed to use the FTP service several times with different options you would just have to do the following:

```js
// From the Gist: https://gist.github.com/nfroidure/c4889b121a3a0146f2af4a7d99cd4a02
```

## Addressing DI common downsides

Sometime, using DI makes hard to figure out the final dependency graph since you just declare each piece of code's dependencies separately. Knifecycle provides a way to build graphs from your code for that purpose. You can see an example of those graph in the [jsarch architecture notes](https://github.com/nfroidure/jsarch/blob/master/ARCHITECTURE.md). It is built using [mermaid](https://github.com/nfroidure/jsarch/blob/master/package.json#L38).

Another downside is the dynamic code that implies DI. Knifecycle allows you to build the [injector code statically](https://github.com/nfroidure/knifecycle/blob/master/src/build.mocha.js#L72-L133) so that you no longer need to embed Knifecycle in your final build. This is how I build the AWS Lambda functions of the Sencrop's backend. That way, the lambdas only contains the code they need to rely on. This is a nice side effect of limiting the DI influence on your own code.

You can see a [full repository](https://github.com/nfroidure/di-test) with Knifecycle usage example for a TypeScript project. It starts with no DI and then implement it with Knifecycle. In this post example, I declared the services manually but the injector can load the services automatically. This concept is [also illustrated](https://github.com/nfroidure/di-test/blob/master/src/services/_autoload.ts) in the above TypeScript project.

I hope you'll find your own usage of [Knifecycle](https://github.com/nfroidure/knifecycle), I use it happily since 2 years now. If you want to try, feel free to reach me for help whenever you need some ;).

**Edit:** Knifecycle is at the core of the [Whook framework](https://github.com/nfroidure/whook) and a lot of [NPM modules using it](https://www.npmjs.com/search?q=keywords:knifecycle) are available in NPM.
