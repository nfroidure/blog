---
title: Toward a stricter query string parser
description: With most query string parsers, a lot of URIs can point to the same content. It not only mess you cache system but make your logs less expressive. To avoid those problems I just wrote a stricter query string parser.
leafname: toward_stricter_query_string_parser
link:
  label: A stricter query string parser
  title: Find a better way to deal with query strings
date: "2016-12-12T19:50:52.000Z"
lang: en
location: US
keywords:
  - API
  - query string
  - HTTP
categories:
  - API
  - query string
  - HTTP
---

# Toward a stricter query string parser

**TL.DR.** Having a stricter query string policy adds value to APIs. Checkout [strict-qs](https://github.com/nfroidure/strict-qs).

I my journey to the NodeJS HTTP server of my choice, I just reached a new milestone. Indeed, in the ancient ages, when PHP was my language of choice, I made a simple framework called [Rest4](https://github.com/Rest4).

One of its features was to strictly check for query params types, order and existence. I felt a bit disarmed when I figured out that most NodeJS frameworks follow a non restrictive path when it comes to parse query strings.

When no checks are done on query strings, you can end up with a lot of URIs pointing to the same resource. By example, in most applications the following URIs would serve the same resource:

- `/articles?q=test`,
- `/articles?q=test&page=1`,
- `/articles?page=1&q=test`,
- `/articles?q=test&page=invalid`,
- `/articles?q=test&page`,
- `/articles?q=test&page=1&dummy=lol`.

This has a lot of undesired effects.

## Content duplication

If you are serving webpages you may want to avoid being downgraded in [search engines](https://support.google.com/webmasters/answer/66359?hl=en). There are other ways to prevent this but with a strict query string policy it comes out of the box.

## Harder caching

If you want to use the resource URI as a key in a Redis cache to speed up your API, you won't be able to use the URI as is, without being vulnerable to cache flooding.

You'll first have to create a canonical URI to store your contents and this extra compute will be done every time you will access your cache. Also public proxies often have their own interpretation of HTTP caching specs, providing unique URIs ensure you a better handling of your HTTP requests by them.

## Messy logs

Logs get harder to reduce/compare/read until you reorder query strings yourself before logging. Even if you do that, your upstream tools (say NGinX, HAProxy, Fastly...) won't take advantage of it.

## Defensive programming

Consider the following URI: `/articles?q=test&page=1&page=1&page=1&page=1`.

With a simple query parser, it will lead to an array of pages which is probably not what you want. It leads to unexpected behavior and lots of attacks are based on it.

Just created [strict-qs](https://github.com/nfroidure/strict-qs) to match those issues. It simply builds an object whose properties are query parameters of the types you would expect. If you try it, let me know ;).

You'll still have to validate it with a JSONSchema validator since I wanted it to do one thing and do it well. There is plenty of JSONSchema validators, I currently use [AJV](https://github.com/epoberezkin/ajv).

Finally, there is still some work to achieve in order to ensure unicity of paths too. The following URIs would also lead to the same resource: `/articles/1`, `/articles/0001`, `/articles/1/`.

I updated [siso](https://github.com/nfroidure/siso) to handle this problem too.
