# Linked List

**linked-list** provides minimalistic [linked](http://blog.millermedeiros.com/linked-lists) [lists](http://wikipedia.org/wiki/Linked_list) in JavaScript. No dependencies. NodeJS, AMD, browser. Lots of tests (70+). 653 Bytes minified and gzipped.


## Example

### “Simple”

```js
var item = new LinkedList.Item(),
    item_ = new LinkedList.Item(),
    item__ = new LinkedList.Item(),
    list = new LinkedList(item, item_, item__);

list.head // => item
list.head.next // => item_
list.head.next.next // => item__
list.head.next.prev // => item
list.tail // => item__
list.tail.next // => `null`
```

### Extending (a more usefull example)

```js
var extend = require( 'some-extending-method...' ), // e.g. assimilate.
    List = require( 'linked-list' ),
    Item = List.Item;

function Tokens() {
    List.apply(this, arguments);
};

function Token(value) {
    this.value = value;
};

extend(Tokens.prototype, List.prototype, {
    'join' : function(delimeter){
        return this.toArray().join(delimeter);
    }
});

extend(Token.prototype, Item.prototype, {
    'toString' : function(){
        return this.value;
    }
});

var dogs = new Token('dogs'),
    and = new Token('&'),
    cats = new Token('cats'),
    tokens = new Tokens(dogs, and, cats);

tokens.join(' '); // "dogs & cats"

and.prepend(cats);
and.append(dogs);

tokens.join(' ') + '!'; // "cats & dogs!"

```

## Installation

### With NPM

```sh
$ npm install linked-list
```

### Git

```sh
git clone https://github.com/wooorm/linked-list.git
cd linked-list
npm install
make && make build
```

### With a CommonJS module loader

Download the latest minified CommonJS [release](https://raw.github.com/wooorm/linked-list/master/_destination/linked-list.js) and add it to your project.

[Learn more about CommonJS modules](http://wiki.commonjs.org/wiki/Modules/1.1).


### With an AMD module loader

Download the latest minified AMD [release](https://raw.github.com/wooorm/linked-list/master/_destination/linked-list.amd.js) and add it to your project.

[Learn more about AMD modules](http://requirejs.org/docs/whyamd.html).

### As a standalone library

Download the latest minified standalone [release](https://raw.github.com/wooorm/linked-list/master/_destination/linked-list.globals.js) and add it to your project.

```html
<script src="/your/js/path/linked-list.globals.js"></script>
```

This makes the `LinkedList` module available in the global namespace (`window` in the browser).

## API

### LinkedList([items…])
```js
var list = new LinkedList();
```

Creates a new Linked List.


#### LinkedList.from([items[…]])
```js
var list = LinkedList.from(),
    list_ = LinkedList.from([]),
    list__ = LinkedList.from([new LinkedList.Item()]);
```

Creates a new Linked List* from the given array of items. Ignores `null` or `undefined` values. Throws an error when a given item has no `detach`, `append`, or `prepend` methods.

* Actually, a new instance of this, e.g. when placed on `Token` (`Token.from`), it would create a new instance of Token.

#### LinkedList.of([items…])
```js
var list = LinkedList.of(),
    list_ = LinkedList.of(new LinkedList.Item());
```

Creates a new Linked List from the given arguments. Defers to `LinkedList.from` (see above). As in:

```js
List.of = function (/*items...*/) {
    return List.from.call(this, arguments);
};
```

#### LinkedList#append(item)
```js
var list = new LinkedList(),
    item = new LinkedList.Item();

list.head === null // true
item.list === null // true

list.append(item);

list.head === item // true
item.list === list // true
```

Appends an item to a list. Throws an error when the given item has no `detach`, `append`, or `prepend` methods. Returns the given item.


#### LinkedList#prepend(item)
```js
var list = new LinkedList(),
    item = new LinkedList.Item();

list.prepend(item);
```

Prepends an item to a list. Throws an error when the given item has no `detach`, `append`, or `prepend` methods. Returns the given item.


#### LinkedList#toArray()
```js
var item = new LinkedList.Item(),
    item_ = new LinkedList.Item(),
    list = new LinkedList(item, item_),
    array = list.toArray();

array[0] === item // true
array[1] === item_ // true
array[0].next === item_ // true
array[1].prev === item // true
```

Returns the items in the list in an array.


#### LinkedList#asArray()
```js
var item = new LinkedList.Item(),
    item_ = new LinkedList.Item(),
    list = new LinkedList(item, item_),
    array = list.asArray();

array[0] === item // true
array[1] === item_ // true
array[0].next === null // true
array[1].prev === null // true
array[0].list === null // true
list.head === null // true
```

Empties the list, and returns the detached items as an array.


#### LinkedList#head
```js
var item = new LinkedList.Item(),
    list = new LinkedList(item);

list.head === item; // true
```

The first item in a list, and `null` otherwise.


#### LinkedList#tail
```js
var list = new LinkedList(),
    item = new LinkedList.Item(),
    item_ = new LinkedList.Item();

list.tail === null; // true

list.append(item);
list.tail === null; // true, see note.

list.append(item_);
list.tail === item_; // true
```

The last item in a list, and `null` otherwise. Note that a list with only one item has **no tail**, only a head.


## LinkedList.Item()
```js
var item = new LinkedList.Item();
```

Creates a new Linked List Item.


#### LinkedList.Item#append(item)
```js
var item = new LinkedList.Item(),
    item_ = new LinkedList.Item();

(new LinkedList()).append(item);

item.next === null // true

item.append(item_);
item.next === item_ // true
```

Adds the given item **after** the operated on item in a list. Throws an error when the given item has no `detach`, `append`, or `prepend` methods. Returns false when the operated on item is not attached to a list, otherwise the given item.


#### LinkedList.Item#prepend(item)
```js
var item = new LinkedList.Item(),
    item_ = new LinkedList.Item();

(new LinkedList()).append(item);

item.prev === null // true

item.prepend(item_);
item.prev === item_ // true
```

Adds the given item **before** the operated on item in a list. Throws an error when the given item has no `detach`, `append`, or `prepend` methods. Returns false when the operated on item is not attached to a list, otherwise the given item.


#### LinkedList.Item#detach()
```js
var item = new LinkedList.Item(),
    list = new LinkedList(item);

item.list === list // true

item.detach();
item.list === null // true
```

Removes the operated on item from its parent list. Removes references to it on its parent `list`, and `prev` and `next` items; relinking them when possible.
Returns the operated on item. Even when it was already detached.


#### LinkedList.Item#next
```js
var item = new LinkedList.Item(),
    item_ = new LinkedList.Item();

new LinkedList(item);

item.next === null // true
item_.next === null // true

item.append(item_);

item.next === item_ // true

item.detach();

item.next === null // true
```

The items succeeding item, and `null` otherwise.


#### LinkedList.Item#prev
```js
var item = new LinkedList.Item(),
    item_ = new LinkedList.Item();

new LinkedList(item);

item.prev === null // true
item_.prev === null // true

item.append(item_);

item_.prev === item // true

item_.detach();

item_.prev === null // true
```

The items preceding item, and `null` otherwise.


#### LinkedList.Item#list
```js
var item = new LinkedList.Item(),
    list = new LinkedList();

item.list === null // true

list.append(item);

item.list === list // true

item.detach();

item.list === null // true
```

The items parent list, and `null` otherwise.

## Build

Run Mocha tests and JSHint
```sh
$ make
```

Build files (AMD, globals, and CommonJS)
```sh
$ make build
```

## Licence

(The MIT License)

Copyright (c) 2014 Titus Wormer <tituswormer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
