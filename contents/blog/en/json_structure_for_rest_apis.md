---
title: Normalizing JSON Data from REST APIs
description: Very few developer takes the time to think about how they structure their JSON at the very beginning of the project, it is the best moment to do so though.
leafname: json_structure_for_rest_apis
link:
  label: JSON Normalization
  title: See how to create rocking JSONs
date: "2017-03-03T10:07:32.000Z"
lang: en
location: US
keywords:
  - JSON
  - REST
  - Architecture
categories:
  - JSON
  - REST
  - Architecture
---

# Normalizing JSON Data from REST APIs

**TL; DR:**

```
{
  items: [1, 2, ...otherUsersIds],
  users: {
    '1' : {
      content: {
        id: 1,
        name: 'Popol',
        organization_id: 1
      },
      avatarURL: '//img.ur/trololol.png'
    },
    ...otherUsers
  },
  organisations: {
    '1': {
      content: {
        id: 1,
        name: 'Popol inc.',
        owner_id: 1
      }
    }
  }
}
```

I always wanted to write down this post on how I design JSON data on the REST APIs I build. At least for a reference to give to people that ask me why I'm doing it that way.

If you didn't rage quit right after reading the TL;DR, then here is everything you have to know to understand the reasons behind those choices.

## Normalization

It is not about structuring or standardization, but really normalization like you would apply it to relational databases. Except that here, we are normalizing a single JSON.

As you may know, in a lot of APIs, some additional resources are embedded with a given resource representation. Mainly, those have relations with it. For instance, a `GET /users/:userId` endpoint could embed the user's organization representation.

One could say that it is a sign you need to use GraphQL. I wont be that categoric. I think it is convenient to add some related data in your JSON representations. In fact, RESTful principles allows several representations of the same resource.

But a common mistake when doing so is to add the linked resource to the originating one as a property of it. It leads to content duplication. Indeed, if 2 users have the same organization, it will be embedded twice.

You should now better understand this post's TL;DR. The JSON structure I use is avoiding duplication for linked resources.

You'll also notice the collection items aren't directly put in the corresponding array. Only identifiers are there. The reason behind that is to allow having repeating collections. For instance, a `GET /usersQueue` endpoint could have the same user two times in the queue. The JSON format I use allows that without duplicating it. Finally, if a user owns the organization of the above example, then, you can easily find him from the organization owner identifier.

You may wonder why I did not use [JSON reference](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03). The are 3 reasons for it:

- first of all, I really want to use the native JSON deserializer on every browsers. For performance reasons of course. A browser is constantly parsing JSON data so I do not want to use a polyfill and do it with JS. With my way to set JSON data, resources are directly addressable though a hash, not more computing needed after parsing the JSON;
- also, having directly usable hashes, allows to combine them in order to optimize the front-end memory consumption. By maintaining objects stores, I can ensure the uniqueness of a single object across the whole application. With a simple`Object.assign` in my [API wrapper](./considerations_for_generating_api_clients) or the use of weak sets where possible there are huge performance gains;
- finally, I do not want to pollute objects with their related resources which leads us to segregation.

## Segregation

Most resource representations contains two kinds of data. Normalized data are the ones you would store in a relational database. It is the source of truth, basically, the data CRUD operates on. In other words, the data PUT calls send to change a resource.

This is why I put it in a `content` property. It is a convention to point out the data you could modify in your front-ends forms. It simplifies front-end development since they do not have to filter data. They just pick-up the content and build their forms around it.

The other data are calculated ones. Those are only useful for display concerns. This is the case for the above avatar URL or for example for database modification/creation timestamps.

## JSON schemas composition

I really like JSON schema. That said, I do not like to write them down ;). My JSON format allows to reuse definitions to avoid writing specific JSON schemas for each resource. Here is how I would define the above data format as a JSON Schema:

```js
const userSchema = require("user");
const organizationSchema = require("organization");
const { idSchema, idPattern } = require("utils");

module.exports = {
  title: "Users collection",
  type: "object",
  additionalProperties: false,
  properties: {
    items: {
      title: "User's identifiers for the queried collection.",
      type: "array",
      items: idSchema,
    },
    users: {
      title: "Users hash",
      description: "A hash containing users in the items collection.",
      type: "object",
      patternProperties: {
        idPattern: userSchema,
      },
    },
    organizations: {
      title: "Organizations hash",
      description:
        "A hash containing organizations linked to users in the collection.",
      type: "object",
      patternProperties: {
        idPattern: organizationSchema,
      },
    },
  },
};
```

That's it! I hope you find that way of designing JSON data useful. Feel free to comment with your own tips!

**Last minute addition :**  
 Kévin Dunglas, a compatriot strongly involved in PHP/REST communities, cited the following standards as a replacement for the structure I showed here:

- [JSON-LD :](http://json-ld.org/) an alternative to using JSON Reference. What make me discarding it is the fact it nests actual data with its definition. It adds an overhead when serializing/deserializing and transporting the data.
- [Hydra :](http://www.hydra-cg.com/spec/latest/core/) it is a layer over JSON-LD, discarding it per the above facts. It goes forward in a direction I do not approve.
- [HAL :](http://stateless.co/hal%5Fspecification.html) I didn't know it but just follow the link and scroll to the first JSON. Do you enjoy reading it? I do not write APIs for bots, but rather for humans. That said, bots can have a look to my Swagger definition.

I did not mention Hypermedia APIs for brevity but of course we should all use it. That said, nowadays, any JSON browser can detect an URI without having to explicitly define it in the JSON. Anyway, bots can again read the Swagger definition if they are not smart enough to detect an URL.

Swagger/OpenAPI are open standards allowing a lot of benefits from generating client to generating documentation. They benefit from a large set of tools built specifically for it. It is my standard of choice since it allows a clean separation between data and schemas while allowing developers to add their own value over it.

I have a lot of respect for people involved in standardization. Any standard should, at least, be considered when designing systems. But I keep for myself the right to choose the one fitting my needs/wills. I wouldn't use XML again, neither [JSONX](https://www.ibm.com/support/knowledgecenter/SS9H2Y%5F7.1.0/com.ibm.dp.doc/json%5Fjsonx.html) ;). Do not blindly follow standards but choose the one empowering you.

I like Swagger because it is clear and light. It is like JavaScript: it helps reaching your goal without creating barriers. To be honest, I'm not that optimist about the OpenAPI initiative. I fear it takes a direction that is not compatible anymore with my concerns. But, maybe, another standard will come to rule all of them.

![An XKCD comic on competing standards](https://imgs.xkcd.com/comics/standards.png)  
[Source: XKCD](https://xkcd.com/927/)

Finally, keep in mind that using standards is not the only way to go. Innovating often means the opposite. There are plenty of examples out there but let me cite the last one that just blown my mind and led me to reconsider, once again, a rock solid certitude:

> So much devs refers to practices as ugly or conceptually weird when real measurement of systems is efficiency on the short and long run.
> [source](https://fosstodon.org/@whook/111708620880514272 "🐘")
