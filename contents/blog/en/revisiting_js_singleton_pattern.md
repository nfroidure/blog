---
title: Revisiting The JavaScript Singleton Pattern
description: JavaScript design patterns are quite good examples to sharp your JavaScript skills. Let's take a look to the singleton pattern.
leafname: revisiting_js_singleton_pattern
link:
  label: JavaScript Singletons
  title: Learn more about this design pattern
date: "2013-05-30T07:38:19.000Z"
lang: en
location: US
keywords:
  - JavaScript
  - Design patterns
categories:
  - JavaScript
  - Design patterns
---

# Revisiting The JavaScript Singleton Pattern

---

**Retrospective note:**

⚠ Beware: This article is outdated. I now think that inherence is often not a good pattern, I'm rarely using POO in JavaScript currently too. I prefer functions composition and singleton factories that I combine thanks to [dependency injection and inversion of control with Knifecycle](https://github.com/nfroidure/knifecycle).

---

JavaScript design patterns are quite good examples to sharpen your JavaScript skills. Let's take a look at the singleton pattern.

I'm currently reading [Addy Osmani’s](https://www.linkedin.com/in/addyosmani/ "Follow him on LinkedIn") [book about JavaScript design patterns](http://shop.oreilly.com/product/0636920025832.do "Buy this book"). It's a very interesting introduction and I strongly recommend you this read. Viewing his Singleton Pattern implementation I had two simple ideas of improvement to get them more powerful. Here is a basic implementation of this pattern:

```js
// From the Gist: https://gist.github.com/nfroidure/5676292
// Singleton pattern
var MySingleton = (function () {
  // creating a variable to contain the instance
  var instance = null;
  // here goes private stuff
  var _myPrivateVar = 1;
  var _myPrivateFunction = function () {
    console.log("In private function.");
  };
  // creating singleton constructor
  function Constructor() {
    // assigning instance to our variable
    instance = this;
  }
  // here goes public method and properties
  Constructor.prototype.publicProperty = 1;
  Constructor.prototype.publicMethod = function () {
    console.log("In public method.");
    _myPrivateFunction();
  };
  // creating a constructor to generate an exception
  var FakeContructor = function () {
    throw SyntaxError("Singleton : Use getInstance instead.");
  };
  // associating him getInstance()
  FakeContructor.getInstance = function () {
    return instance || new Constructor();
  };
  return FakeContructor;
})();

// Usage
var singleton = MySingleton.getInstance();
console.log(
  singleton === MySingleton.getInstance() &&
    singleton === MySingleton.getInstance() &&
    singleton === MySingleton.getInstance(),
);
// true
console.log(singleton.publicProperty);
// 1
singleton.publicMethod();
// In public method.
// In private function.

// Misuse attempts
var singleton = new MySingleton();
// SyntaxError : Singleton : Use getInstance instead.
```

To the Addy's implementation I just added a fake constructor in order to prevent misuses of the singleton pattern. As you can see, the Singleton pattern purpose is to ensure there will always be only one instance of it's "class".

After reading it I wondered if there could be a way to make singletons inherence possible. I finally got it by adding a simple snippet to the previous implementation:

```js
// From the Gist: https://gist.github.com/nfroidure/5676346
// Inherit JavaScript Singleton
function ParentConstructor() {}
ParentConstructor.prototype.publicProperty1 = 1;

var InheritSingleton = (function (parentConstructor) {
  // creating a variable to contain the instance
  var instance = null;
  // creating singleton constructor
  function Constructor() {
    // assigning instance to our variable
    instance = this;
  }
  // adding parent object to the singleton constructor prototype
  function F() {}
  F.prototype = parentConstructor.getInstance
    ? parentConstructor.getInstance()
    : new parentConstructor();
  Constructor.prototype = new F();
  // here goes public method and properties
  Constructor.prototype.publicProperty2 = 2;
  Constructor.prototype.publicMethod2 = function () {
    console.log("In public method 2.");
    _myPrivateFunction();
  };
  // creating a constructor to generate an exception
  var FakeContructor = function () {
    throw SyntaxError("Singleton : Use getInstance instead.");
  };
  // associating him getInstance()
  FakeContructor.getInstance = function () {
    return instance || new Constructor();
  };
  return FakeContructor;
})(ParentConstructor);

// Usage
var singleton = InheritSingleton.getInstance();
console.log(singleton.publicProperty1);
// 1
console.log(singleton.publicProperty2);
// 2
```

As you can see our singleton inherits from the parent constructor we have given it. It also can take a conventional objet constructor or another singleton.

The main use case for it is the ability to extend to another conventional constructor the singleton pattern. It also provide a way to extend existing singletons and change their behavior with no risk to alter them.
