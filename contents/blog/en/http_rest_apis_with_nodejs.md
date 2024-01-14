---
title: Designing HTTP REST APIs with NodeJS
description: Designing good HTTP services is still a hard thing despite the many tools you can find to make them with NodeJS. I'm trying to define a formal approach to architecture them by embracing the HTTP protocol nature and the RESTful principles.
leafname: http_rest_apis_with_nodejs
link:
  label: HTTP API Design
  title: See how I design HTTP APIs with NodeJS
date: 2016-11-12T09:50:52.000Z
lang: en
location: US
keywords:
  - API
  - REST
  - HTTP
categories:
  - Web Services
---

# Designing HTTP REST APIs

---

**Retrospective note:**

While this article contents remains useful, I finally managed to build a Framework with a scope thin enough to avoid additional complexity, it's name is [Whook](https://github.com/nfroidure/whook "See the GitHub repository").

---

You may have read my [no more middlewares](./no_more_middlewares) blog post and wonder what led me to this mindset about middlewares. I would like to explain here why I think that Express (but also its challengers like Hapi or Restify Or NestJS) are not that good when it comes to build REST APIs by explaining the challenges of designing a HTTP REST API and how I'm solving it.

**TL.DR.** HTTP/REST API complexity does not worth creating a complex framework.

## Design considerations

### The server: A state dealer

**An HTTP server is a gateway allowing to read/write states**. Those states may sit in a database or a file storage system. An HTTP transaction allows you to retrieve those states (with the OPTIONS/GET verbs) and to change them (with POST/PUT/PATCH/DELETE ones). The states are located with the help of URIs, behind an URI one or more states can be involved.

Building an HTTP server mainly consist in defining the states you want to keep and where you want to store them. Once defined, you'll have to define the rules determining what happens when a state changes.

#### Retrieving states

This is the easy part. Retrieving states is done with simple GET requests (you may also have heard about the [SEARCH method](https://datatracker.ietf.org/doc/rfc5323/)).

States are rarely provided as is from their storage. They are often transformed into a representation, this is known as [representational state transfer (REST)](https://fr.wikipedia.org/wiki/Representational%5Fstate%5Ftransfer).

It is worth noting a resource representation can be seen as a pure function:

```
response = f(request, ...states)
```

Answering a GET HTTP request is as simple as decoding the request, retrieve the involved states and build a representation of the actual resource.

The beauty of an HTTP server is that states are more concepts than real data. The state of an unexisting resource is that it doesn't exists.

#### Changing states

When using the PUT/POST/PATCH methods in an HTTP request, we typically provide some content with our HTTP request that describes the changes we want to perform.

For DELETE ones, it is a bit simpler. We are only providing the name (its URI for instance) of the resource we want to delete.

Handling state changes is a bit harder. Indeed, I usually split it into two phases.

### Acknowledgment

This is when the status code and the HTTP headers are sent to the client. When a server acknowledge a resource change, the implicit contract is that any other request involving its underlying states will take those changes in count.

If someone upload a file by performing a `PUT /fs/myfile` request, you can send response headers only when it is guaranteed that a `GET /fs/myfile` will successfully complete. This is the transactional part of an HTTP server.

This might not be true for large systems on short time frames or for two clients based on two very distant regions but those trade offs doesn't affect an API design in most cases.

The new states of the resource can be expressed as a pure function of the HTTP request:

```
states = f(request)
```

### Contractual computations

Then, you will probably need to perform some computations based on those changes. Things like sending an email, processing an image, syncing with third parties etc...

Those post HTTP transaction computes shouldn't change the server state. But since you already answered to the HTTP client everything went fine, you should guarantee those computes will always happen.

The best way to handle this is using a message queueing system like RabbitMQ and having some workers computing those post changes triggers. Once your state change event is in the queue, you can acknowledge the request and be sure expected computations will be done.

The big part in designing those triggers is to ensure the acknowledged data is valid and won't suffer of a lack of information. Content validation is a major concern here.

You also have to deal with the possible outage of the various systems your triggers rely on. This is why I mostly try to handle it with idempotent calls. That way, workers can retry computing an event until it eventually works. This is not always possible though, by example for sending e-mails.

### A stateless protocol

Despite the fact an HTTP server is full of states, the interesting thing to notice about HTTP is that it is a stateless protocol. HTTP transactions are fully independent from each others.

Since a resource representation is a pure function returning a response from a request and its involved states. You can see the HTTP GET request/response relation as a pure function until its underlying states change:

```
response = f(request)
```

This is where the stateless nature of HTTP helps designing APIs in a simple manner. For the same state and the same request, you'll always get the same response (it is slightly different for POST calls, this is why I avoid using it in most cases).

Indeed, OPTIONS, GET, PUT and DELETE requests are known as idempotent. PATCH and POST ones are not. I avoid using POST but I often create PATCH endpoints while ensuring mines are idempotent (this is why I strongly discourage the use of [JSON patch](http://jsonpatch.com/) since its current implementation forbids doing idempotent patches).

Another interesting property of HTTP is that since a PUT/PATCH and DELETE request contains the full recipe to build the final state of the resource its changing, even if the initial resource state is different, the final state will be the same for two identical requests.

So we end up with a crystal clear vision of modificative and idempotent HTTP requests

```
states = f(request) response = f(request, ...states)
```

All in all, designing a REST API is mainly about describing very simple asynchronous workflows into a few key steps were simple function composition can easily do the job.

### Keeping states consistent

This is impossible. At least with high performances and availability. Indeed, to ensure a coherent global state, you have to queue state changes (at least those depending on other states). This is typically the relational databases strategy.

Subscribing to this strategy involves accepting to refuse some state changes. Indeed, imagine that a user wants to change the price of a product. The web application would first retrieve it and prompt a form allowing him to make that change.

Another user could have deleted this product so that when the user will validate the form, the product will no longer exists. Most server side implementation will simply return an error saying the product no longer exists and the user will simply loose its changes. But another implementation could simply "revive" the product or change the archived product price.

But what about two users changing the product price at the same time? Should we refuse edition and warn the user? Should we compute the difference between the two concurrent changes? Or maybe prompt the user to solve the conflict (like git do for developers patches).

The final choice strongly depends on a lot of factors and, in fact, the only thing I'm sure about is that you **can't fully automate those choices**.

Each server endpoint has its own constraint, its own reason to exist and needs you to implement its own, original workflow based on your business constraints.

## Coding REST APIs with NodeJS

So, given all those interesting aspects of designing a REST API, why would we use things like [middlewares](https://en.wikipedia.org/wiki/Middleware), [ORM](https://en.wikipedia.org/wiki/Object-relational%5Fmapping) or that shinny new framework plugin system?

In my quest to find the holy grail of the REST API frameworks, I ended up building my own.

Guess what, I **failed** the first implementation. I thought **existing framework were bad while the framework idea itself was bad**. Don't get me wrong, I don't say that all HTTP frameworks you can find out on NPM should not be used.

In fact, I managed to use ExpressJS successfully many times and I think it can still be useful for quickly prototyping NodeJS backends. But the truth is that I spent most of my time reducing the Express features I used overtime.

Currently, I'm leaving behind the last Express pieces by using simple libraries providing pure functions most of the time.

In my quest to design great REST APIs with NodeJS, I finally ended up with a few simple patterns and principles I want to share with you.

## Process lifetime

As we saw above, an HTTP server is constantly dealing with external states. Those states can be database servers, key/value stores, other REST APIs, the current time etc...

This has a lot to do with the process lifetime. Indeed, before accepting connections we must ensure the database connection is correctly set. Also, when shutting down a server, we must ensure that every requests were fulfilled.

For those concerns, I created [Knifecyle](https://github.com/nfroidure/knifecycle), a dependency injection system inspired by the Angular one. It is pretty simple but allows me maintaining states services decoupled from the actual server endpoints code.

It also allow me to tie an endpoint with its required services and only those ones. That way I can easily reuse an endpoint in another project while being sure all its needed services are available.

Since it injects services thanks to a simple object, it has no footprint on the endpoint handlers. That way I can reuse it in any other application.

## Documentation driven API

There is nothing worse than having no documentation. The first building block of an endpoint should be its documentation.

When creating endpoints, I begin by writing a module describing its inputs and outputs. It is not necessarily a Swagger definition but an [intermediate description that could produce a Swagger definition file](https://github.com/nfroidure/TripStory/blob/master/backend/app/trips/trips.metadata.js).

That way we avoid documentation drifting. Never rely on a human when it comes to documenting anything.

## Single endpoint routing

Since an HTTP endpoint is a unique and original workflow you have to implement, I prefer using only one handler per endpoint and use async functions composition in a single file that describes this workflow.

I recently released [Siso](https://github.com/nfroidure/siso) that allows to create a simple routing function without having to rely on a complete framework.

## Workflow based endpoint handlers

For each endpoints, I create an unique workflow based on a promise chain whose stages basically are:

- decode/transform/validate the request with function composition;
- perform state changes with the help of injected services;
- acknowledge changes;
- build the response.

In consequence, my code is organized in a simple manner that map the above workflow structure:

- metadata: configuration describing routes, their input/ouput and any other information allowing to generate a documentation;
- validators: pure functions that validate datas or throw errors. I like using JSONSchema to create them since it can be used to produce a Swagger file;
- transformers: pure re-entrant functions that transform states to representations and representations to states;
- services: injected code to deal with application states;
- helpers: pure functions that factorize redundant workflow stages (parsing payloads according to the content type header, rights management etc...).

I take care to avoid coupling endpoint workflows with route declaration in order to keep my workflows the purest possible. You can see those principles in action into the [Trip Story](https://github.com/nfroidure/TripStory) project we made for an hackathon (worth nothing it still uses Express 😉). It is a step backward though but I promise I'll soon release a new side project with all those principles in action.

## As a conclusion

I'd like to end this post by a call to the JavaScript community: please, release purely functional modules whenever possible. Projects like [jshttp](https://github.com/jshttp) are nice and allows a shift to a more functional approach.

We should stop assuming a `req`, `res` or `app` object and instead create pure function that manipulate headers, query strings or contents directly.

## A step toward universal APIs

With the raise of service workers, the need to reuse backend code in the browser will be crucial. Adopting a more functional approach will allow to take best advantages of the existing codebase.

It will be very hard, maybe impossible, to reuse your ORM code into the browser, neither to make predictive HTTP responses in a service worker with a codebase relying on middlewares or your preferred framework plugin system.

I hope you find this post more clear and wish it will help improve the way we are creating REST web services with NodeJS.
