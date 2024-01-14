---
title: Considerations for Automatic Generation of API Clients
description: No one should loose time writing code that can be generated automatically. Here are some tips on how I do it.
leafname: considerations_for_generating_api_clients
link:
  label: API Clients Generation
  title: Learn how to generate API clients
date: "2017-02-19T15:00:00.000Z"
lang: en
location: US
keywords:
  - REST
  - Client
  - API
  - Generation
categories:
  - REST
---

# Considerations for Automatic Generation of API Clients

---

**Retrospective note:**

I no longer use the tools cited in this article. It is still relevant for the design decisions described here though. You may want to try my [new SDK generator](https://github.com/nfroidure/openapi-ts-sdk-builder) that implements it but with modern tools like TypeScript and OpenAPI 3.

---

**TL; DR: Generating simple, unopinionated, API clients is the way to go.**

Nowadays, with APIs built on top of HapiJS, ExpressJS, [Whook](https://github.com/nfroidure/whook "Try the framework I work on") (for my own case) or even your custom router, there is no more field for building undocumented APIs. The [OpenAPI](https://www.openapis.org/) initiative (formerly known as Swagger) is now providing a strong and heavily supported API documentation format.

![A meme about push/pull mode for syncing with APIs](/public/illustrations/push_pull_meme.jpeg)

Currently frontend developers expect having a clear and straightforward way to consume your APIs. But providing a documentation is not enough in my opinion. We must take the opportunity of formal API descriptions to also generate client APIs.

In fact, if you look at [Swagger Codegen](https://swagger.io/tools/swagger-codegen/), you'll find there are a lot of clients generators ready to use.

I recently had to generate a client API for that good old AngularJS framework (which is far better than Angular2 in my opinion).

Sadly, the AngularJS client API codegen is generating an API interface leveraging POO (an irrelevant pattern for this case in my opinion) and introducing unnecessary complexities like spawning several files for a single API.

Also, it creates as many function arguments for each endpoint than the possible parameters enforcing us to remember their order and creating function calls with a huge signature. In the context of an ES6 based AngularJS application, I wanted to use ES6 destructuring for a nicer API interface.

I decided to create one that would be aligned with the following architecture requirements for generating a good API client.

## Automatically generated code should never be modified by hands

Indeed, if we can generate some code once, we can do it again forever. So, generating the client API should be part of your frontend build process.

In my case, I quickly created a Webpack loader matching the `*.swagger.json` allowing me to simply import the client API into the AngularJS application with a single line of code `require('./api.swagger.json');`.

The good news with choosing to never change the generated code is that we do not care anymore about generating elegant or readable code. We just want to create an appropriate surface API.

## API surface should hide HTTP details

There is nothing worse than having thousands of line of frontend applications that depends on a particular HTTP implementation. Maintaining HTTP APIs backward compatibility is a real pain (believe me, you do not want to write HTTP proxies for older versions support...).

Until your API is public, you can avoid a lot of work by using a client API that masks HTTP calls by simply providing your functions with a single argument where you can put your parameters as object properties.

For instance, in my API client, `GET /articles/{articleId}?token=x` simply becomes `getArticle({ articleId, token })`. What if the token need to be set in the `Authorization` header instead of in the query string?

It will just be transparent for frontend developers, they will only have to generate the Swagger/OpenAPI definition again, include it in their project and continue using the endpoint as if nothing changed.

I kind of specialized on working on plain old ExpressJS projects and managing to make them RESTful progressively. Having that flexibility to smoothly change endpoints helps a lot. For example, transforming each POST into a PUT with client generated UUIDs becomes really easy.

## API surface should be minimalist

For the AngularJS client API I just export a service called `API` and having as much methods as there are operation ids on the swagger file. No POO, no token management, just map functions to HTTP calls.

Using this client basically means creating another service on top of it that adds custom behaviors for the host application logic.

## Nice side effects

Since I started creating my REST APIs in a Documentation Driven way (I was till doing it [with PHP](https://github.com/Rest4/Rest4-php/blob/master/php/class.RestAuthDigestDriver.php#L7-L30) at that time), I enforce a particular order for query parameters.

It allows to ensure URLs are always unique for the same content. That way various cache layers are optimized (even public proxies that cannot assume the query parameters do not matters). You can read my [post on strict-qs](./toward_stricter_query_string_parser) for more informations about this.

That said, it can be annoying for frontend developers to work with such strict APIs. The benefits of generating the client APIs is that we can take care of it for them so that they never face REST APIs misuse issues anymore.

## Why not having some fun?

Well. Generating code is less boring than writing it but I wanted to test an old idea. Why not making JavaScript templates in a new way? I already leveraged the AST power with [jsub](./lets_subset_javascript) but I wanted to make something I called AST templating.

The idea was to create templates that would be pure syntactically valid JavaScript files. That way, linters, syntax analyzers and all the usual JavaScript tools would just work on it.

This is how I created [astpl](https://github.com/nfroidure/asttpl) and you can see how our API client looks like in its [real world tests](https://github.com/nfroidure/asttpl/blob/master/src/realworld.mocha.js#L82-L131).

Et voilà! I hope you will enjoy creating your own API clients. I plan to create another template for React applications since the raw JavaScript codegen does not looks good either.
