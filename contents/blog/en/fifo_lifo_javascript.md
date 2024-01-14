---
title: Easily Implement Stacks (Fifo) And Queues (Lifo) With JavaScript
description: I'm currently reviewing Javascript basis for a personnal project and it appears I often use stacks and queues implicitly. Let's make it explicit and easyer to debug/use.
leafname: fifo_lifo_javascript
link:
  label: Stacks and queues
  title: Discover my tips to use stacks and queues well.
date: 2013-04-09T09:50:52.000Z
lang: en
location: US
keywords:
  - JavaScript
  - Design patterns
categories:
  - JavaScript
  - Design patterns
---

# Easily Implement Stacks (Fifo) And Queues (Lifo) With JavaScript

I'm currently reviewing Javascript basis for a personal project and it appears I often use stacks and queues implicitly. Let's make it explicit and easier to debug/use.

It's really easy to create queues (FIFO) by simply creating an Array and only use push and shift methods. The same for stacks (LIFO) with push and pop. But when coming back to the code or working together it can lead to hardly detectable bugs or unexpected behaviors. That's why I decided to implement them seriously with the help of the closure pattern. Let's dive in the code.

## Queues : First In Firt Out

Here is the code:

```js
// From the Gist: https://gist.github.com/nfroidure/5472445
class Queue {
  constructor(...elements) {
    // Initializing the queue with given arguments
    this.elements = [...elements];
  }
  // Proxying the push/shift methods
  push(...args) {
    return this.elements.push(...args);
  }
  shift(...args) {
    return this.elements.shift(...args);
  }
  // Add some length utility methods
  getLength(...args) {
    return this.elements.length;
  }
  setLength(length) {
    return (this.elements.length = length);
  }
}

// Usage
const q = new Queue(0, 1);

q.push(2);

console.log(q.getLength()); // 3

while (q.getLength()) console.log(q.shift()); // 0, 1, 2
```

The tip is deadly simple, we're keeping a reference to the elements in the scope of our set of functions and the Queue instances expose only those functions as methods. So, we're sure our queues will be used properly.

If you're coding in a modern JavaScript engine you'll probably want to access the queue length as a property like it's done with arrays or strings. Here is the way to:

```js
// From the Gist: https://gist.github.com/nfroidure/5472480
class Queue {
  constructor(...elements) {
    // Initializing the queue with given arguments
    this.elements = [...elements];
  }
  // Proxying the push/shift methods
  push(...args) {
    return this.elements.push(...args);
  }
  shift(...args) {
    return this.elements.shift(...args);
  }
  // Add some length utility methods
  get length() {
    return this.elements.length;
  }
  set length(length) {
    return (this.elements.length = length);
  }
}

// Usage
const q = new Queue(0, 1);

q.push(2);

console.log(q.length); // 3

while (q.length) console.log(q.shift()); // 0, 1, 2
```

## Stacks (Last In First Out)

Now we can simply modify the above code to also manage stacks:

```js
// From the Gist: https://gist.github.com/nfroidure/5472493
class Stack {
  constructor(...elements) {
    // Initializing the stack with given arguments
    this.elements = [...elements];
  }
  // Proxying the push/shift methods
  push(...args) {
    return this.elements.push(...args);
  }
  pop(...args) {
    return this.elements.pop(...args);
  }
  // Add some length utility methods
  getLength(...args) {
    return this.elements.length;
  }
  setLength(length) {
    return (this.elements.length = length);
  }
}

const s = new Stack(0, 1);
s.push(2);

console.log(s.getLength()); // 3

while (s.getLength()) console.log(s.pop()); // 2, 1, 0
```

As you can see JavaScript closures allows you to easily create constructors using only a subset of an existing data type. Feel free to use or patch it!
