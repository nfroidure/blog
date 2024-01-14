---
title: Print your Markdown content with React through AST
description: A journey to printing my blog Markdown contents with my custom components.
leafname: markdown_ast_to_react
link:
  label: Markdown AST and React
  title: Discover own I render my markdown content
date: "2021-12-01T22:00:00.000Z"
lang: en
location: US
keywords:
  - JavaScript
  - TypeScript
  - React
  - Markdown
  - AST
categories:
  - JavaScript
  - TypeScript
  - React
  - Markdown
  - AST
---

# Print your Markdown content with React through AST

If you ever used Contentful, the head-less CMS, chances are that, like I did, you ended up [creating some code to map your contentful blocks to your React components](https://github.com/nfroidure/douaisis-2021/blob/7c154197556fea1a86744c38a730a9cc21f567aa/utils/contentful.tsx#L131-L160).

I found out this approach really neat, but for my own blog, I didn't want to use anything else then Markdown files committed in my repository.

## Get a tree from your Markdown

The first thing I start looking for is to have a tree from my Markdown files, preferably, something resembling the Contenful block tree.

I found out that by combining the [unified and remark](https://github.com/nfroidure/politics/blob/38c77b03c697dd6d1c6e79eb0bc5751d6629cbb0/src/utils/markdown.tsx#L330-L352) modules, you end up with something that really looks like the Contenful data.

## Dealing with HTML

The hard part were to deal with the HTML markup. Indeed, it wasn't parsed taking in count the start and end of the elements. I had to create a recursive algorithm to [wrap it up altogether](https://github.com/nfroidure/politics/blob/38c77b03c697dd6d1c6e79eb0bc5751d6629cbb0/src/utils/markdown.tsx#L387-L465) in something meaningful. I still have to parse the HTML attributes to have something usable for most use cases.

## Finally, mapping to elements

The [final rendering function](https://github.com/nfroidure/politics/blob/38c77b03c697dd6d1c6e79eb0bc5751d6629cbb0/src/utils/markdown.tsx#L353-L368) is pretty similar to the Contenful one. Never use the `dangerouslySetInnerHTML` method again ;).

## Neat things

Additionally, I managed to make of all my `<h2+>` titles to have anchors automatically generated so that one can link to a [particular section easily (like here with the "Une fuite en avant sans vision politique" title)](https://nicolasfroidure.fr/blog/pour-une-region-actrice-d-un-numerique-humain#une-fuite-en-avant-sans-vision-politique).

I just had to create a function that retrieve the title text [whatever its contents and its depth](https://github.com/nfroidure/politics/blob/38c77b03c697dd6d1c6e79eb0bc5751d6629cbb0/src/utils/markdown.tsx#L370-L385). And add my [anchor](https://github.com/nfroidure/politics/blob/main/src/components/anchored.tsx) component to the [element mapper](https://github.com/nfroidure/politics/blob/38c77b03c697dd6d1c6e79eb0bc5751d6629cbb0/src/utils/markdown.tsx#L195-L209).

I hope you will enjoy the code, feel free to reuse parts of it in your own repos. I'll make a library of it once I get something stable and reusable.
