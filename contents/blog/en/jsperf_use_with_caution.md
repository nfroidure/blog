---
title: Detecting Bad JavaScript Performance Tests On JSPerf
description:
  JSPerf gives us a simple way to write JavaScript performance tests.Unfortunately, tests found aren't always well designed. Here's how to detect
  and avoid them.
leafname: jsperf_use_with_caution
link:
  label: JSPerf, the dark side
  title: Learn more about the bad parts of JSPerf
date: "2013-06-06T16:21:50.000Z"
lang: en
location: US
keywords:
  - JavaScript
  - Performances
categories:
  - JavaScript
  - Performances
---

# Detecting Bad JavaScript Performance Tests On JSPerf

JSPerf gives us a simple way to write JavaScript performance tests. Unfortunately, tests found aren't always well designed. Here's how to detect and avoid them.

When I discovered [JSperf.com](https://jsperf.com/ "Create Performance tests"), I was really impressed by its ease of use. Writing JavaScript performance tests just became as simple as writing JavaScript :). Knowing it, i'm often looking for perf tests on it to quickly have an overview of results for a particular case.

Sadly, it rarely fit my needs, whilst it often reflect a poor understanding of what performance testing means. Here is a summary of my experience with those tests, how to detect them and how to impeach them to lead developers to mistakes.

## When tests smell

One particular case you should be aware of is the use of console.\* methods. Thoses methods should never be found in a test since [they are really slow](https://jsperf.com/console-log-performance/6 "Look at a test on console.log speed") and will tend to equalize test results especially for critical performance test. Unfortunately, it's very common to see [tests using console.log](https://www.google.com/search?q=site%3Ajsperf.com++%22console.log%28%22&aq=f&oq=site%3Ajsperf.com++%22console.log%28%22).

By the way, If you test something, test it **only**. The above console.log test's [prior versions](https://jsperf.com/console-log-performance/2 "View one of them") were completely unusefull since they didn't test only console.log. The purpose of a test is to reveal the overhead of the tested feature, so you should find the smallest footprint possible for your wrapping code.

Another problem with previous revisions of this test is usage of a for loop in order to make the test more "massive": JSPerf do it for you, stop wasting your time.

Another common issue is when code is valid, but not well formed. It often lead to strange test results. So, take time to read the test code if you plan to exploit it's results. Common mistakes of that kind are :

- forgetting to execute a function (`myFunction;` instead of`myFunction();`),
- abnormal return or break instruction,
- bad logic,
- undefined identifiers,
- etc...

Those mistakes are leading most of the time to better performances since some parts of the code aren't executed.

Another way to detect bad tests is to look at later revisions, it sometimes add some tests but often fix them. All in all, if you do not want to spend time checking if a test is right, you can look after JavaScript Rockstars tests (Addy Osmani, John Resig, ...).

## Avoid creating bad test

Anyone can create a bad test, but there are some good practices to reduce the risk :

- if you're a noob : **don't write perf tests,**
- read your code many times before submitting,
- test your code in the JavaScript console first,
- if you made shit, mark it as shit (comment with a link to the modified revisions),
- if someone mark it as shit, don't be hurt. Testing is not about you, **it's about truth**.

That's it, this post is over. If you've got some other good practices or another way to detect bad tests let me know!
