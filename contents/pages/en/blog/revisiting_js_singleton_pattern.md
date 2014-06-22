<!--VarStream
title=Revisiting The JavaScript Singleton Pattern
description=JavaScript design patterns are quite good examples to sharp your\
 JavaScript skills. Let's take a look to the singleton pattern.
shortTitle=JavaScript Singletons
shortDesc=Learn more about this design pattern
keywords.+=JavaScript
categories+=keywords.*
keywords.+=singleton
keywords.+=inherit
published=2013-04-30T09:38:19.000Z
lang=en
location=US
-->

## Revisiting The JavaScript Singleton Pattern

I'm currently reading the [Addy Osmani](https://twitter.com/addyosmani "Follow him on Twitter")
 [book about JavaScript design patterns](href=http://shop.oreilly.com/product/0636920025832.do "Buy this book").
 It's a very interesting introduction and i strongly recommend you this read.
 Viewing his Singleton Pattern implementation i had two simple ideas of
 improvement to get them more powerfull. Here is a basic implementation of
 this pattern:
<script type="text/javascript" src="https://gist.github.com/nfroidure/5676292.js"></script>
<noscript><pre>
// Singleton pattern
var MySingleton=(function() {
	// creating a variable to contain the instance
	var instance=null;
	// here goes private stuff
	var _myPrivateVar=1;
	var _myPrivateFunction=function(){
		console.log('In private function.');
	};
	// creating singleton constructor
	function Constructor() {
		// assigning instance to our variable
		instance=this;
	}
	// here goes public method and properties
	Constructor.prototype.publicProperty=1;
	Constructor.prototype.publicMethod=function() {
		console.log('In public method.');
		_myPrivateFunction();
	};
	// creating a constructor to generate an exception
	var FakeContructor=function() {
		throw SyntaxError('Singleton : Use getInstance instead.');
	}
	// associating him getInstance()
	FakeContructor.getInstance=function(){
			return instance || new Constructor();
		};
	return FakeContructor;
})();

// Usage
var singleton=MySingleton.getInstance();
console.log(singleton===MySingleton.getInstance()
	&&singleton===MySingleton.getInstance()
	&&singleton===MySingleton.getInstance());
// true
console.log(singleton.publicProperty);
// 1
singleton.publicMethod();
// In public method.
// In private function.


// Misuse attempts
var singleton=new MySingleton();
// SyntaxError : Singleton : Use getInstance instead.
</pre></noscript>

To the Addy's implementation i just added a fake constructor in order to
 prevent misuses of the singleton pattern. As you can see, the Singleton
 pattern purpose is to ensure there will always only one instance of it's
 "class".

After reading it i wondered if there could be a way to make singletons
 inherance possible. I finally got it by adding a simple snippet to the
 previous implementation:

<script type="text/javascript" src="https://gist.github.com/nfroidure/5676346.js"></script>
<noscript><pre>
// Inherit JavaScript Singleton
function ParentConstructor() {}
ParentConstructor.prototype.publicProperty1=1;

var InheritSingleton=(function(parentConstructor) {
	// creating a variable to contain the instance
	var instance=null;
	// creating singleton constructor
	function Constructor() {
		// assigning instance to our variable
		instance=this;
	}
	// adding parent object to the singleton constructor prototype
	function F() {}
	F.prototype = (parentConstructor.getInstance?
		parentConstructor.getInstance():
		new parentConstructor()); 
	Constructor.prototype=new F();
	// here goes public method and properties
	Constructor.prototype.publicProperty2=2;
	Constructor.prototype.publicMethod2=function() {
		console.log('In public method 2.');
		_myPrivateFunction();
	};
	// creating a constructor to generate an exception
	var FakeContructor=function() {
		throw SyntaxError('Singleton : Use getInstance instead.');
	}
	// associating him getInstance()
	FakeContructor.getInstance=function(){
			return instance || new Constructor();
		};
	return FakeContructor;
})(ParentConstructor);

// Usage
var singleton=InheritSingleton.getInstance();
console.log(singleton.publicProperty1);
// 1
console.log(singleton.publicProperty2);
// 2
</pre></noscript>

As you can see our singleton inherit from the parent constructor we given him.
 It also can take a conventionnal objet constructor or another singleton.

The main use case for it is the ability to extend to another conventional
 constructor the singleton pattern. It also provide a way to extend existing
 singletons and change their behavior with no risk to alter them.
