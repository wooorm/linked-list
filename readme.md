# linked-list [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Small double [linked list][wiki].

## Installation

[npm][]:

```bash
npm install linked-list
```

## Usage

```javascript
var LinkedList = require('linked-list')

var item1 = new LinkedList.Item()
var item2 = new LinkedList.Item()
var item3 = new LinkedList.Item()
var list = new LinkedList(item1, item2, item3)

list.head // => item1
list.head.next // => item2
list.head.next.next // => item3
list.head.next.prev // => item1
list.tail // => item3
list.tail.next // => `null`
```

Subclassing:

```javascript
var inherits = require('inherits')
var List = require('linked-list')

Tokens.prototype.join = join
Token.prototype.toString = toString

inherits(Tokens, List)
inherits(Token, List.Item)

var dogs = new Token('dogs')
var and = new Token('&')
var cats = new Token('cats')
var tokens = new Tokens(dogs, and, cats)

tokens.join(' ') // => 'dogs & cats'

and.prepend(cats)
and.append(dogs)

tokens.join(' ') + '!' // => 'cats & dogs!'

function Tokens() {
  List.apply(this, arguments)
}

function Token(value) {
  this.value = value
  List.Item.apply(this, arguments)
}

function join(delimiter) {
  return this.toArray().join(delimiter)
}

function toString() {
  return this.value
}
```

## API

### `LinkedList([items…])`

```javascript
new LinkedList()
new LinkedList(new LinkedList.Item(), new LinkedList.Item())
```

Create a new Linked List.

#### `LinkedList.from([items])`

```javascript
LinkedList.from()
LinkedList.from([])
LinkedList.from([new LinkedList.Item(), new LinkedList.Item()])
```

Create a new `this` and adds the given array of items.  Ignores `null`
or `undefined` values.  Throws an error when a given item has no `detach`,
`append`, or `prepend` methods.

#### `LinkedList.of([items…])`

```javascript
LinkedList.of()
LinkedList.of(new LinkedList.Item(), new LinkedList.Item())
```

Creates a new Linked List from the given arguments.  Defers to
`LinkedList.from`.

#### `LinkedList#append(item)`

```javascript
var list = new LinkedList()
var item = new LinkedList.Item()

list.head === null // => true
item.list === null // => true

list.append(item)

list.head === item // => true
item.list === list // => true
```

Appends an item to a list.  Throws an error when the given item has no
`detach`, `append`, or `prepend` methods.  Returns the given item.

#### `LinkedList#prepend(item)`

```javascript
var list = new LinkedList()
var item = new LinkedList.Item()

list.prepend(item)
```

Prepends an item to a list.  Throws an error when the given item has
no `detach`, `append`, or `prepend` methods.  Returns the given item.

#### `LinkedList#toArray()`

```javascript
var item1 = new LinkedList.Item()
var item2 = new LinkedList.Item()
var list = new LinkedList(item1, item2)
var array = list.toArray()

array[0] === item1 // => true
array[1] === item2 // => true
array[0].next === item2 // => true
array[1].prev === item1 // => true
```

Returns the items in the list in an array.

#### `LinkedList#head`

```javascript
var item = new LinkedList.Item()
var list = new LinkedList(item)

list.head === item // => true
```

The first item in a list, and `null` otherwise.

#### `LinkedList#tail`

```javascript
var list = new LinkedList()
var item1 = new LinkedList.Item()
var item2 = new LinkedList.Item()

list.tail === null // => true

list.append(item1)
list.tail === null // => true, see note.

list.append(item2)
list.tail === item2 // => true
```

The last item in a list, and `null` otherwise.  Note that a list with only
one item has **no tail**, only a head.

## `LinkedList.Item()`

```javascript
var item = new LinkedList.Item()
```

Creates a new Linked List Item.

#### `LinkedList.Item#append(item)`

```javascript
var item1 = new LinkedList.Item()
var item2 = new LinkedList.Item()

new LinkedList().append(item1)

item1.next === null // => true

item1.append(item2)
item1.next === item2 // => true
```

Adds the given item **after** the operated on item in a list.  Throws
an error when the given item has no `detach`, `append`, or `prepend`
methods.  Returns false when the operated on item is not attached to
a list, otherwise the given item.

#### `LinkedList.Item#prepend(item)`

```javascript
var item1 = new LinkedList.Item()
var item2 = new LinkedList.Item()

new LinkedList().append(item1)

item1.prev === null // => true

item1.prepend(item2)
item1.prev === item2 // => true
```

Adds the given item **before** the operated on item in a list.  Throws an
error when the given item has no `detach`, `append`, or `prepend` methods.
Returns false when the operated on item is not attached to a list, otherwise
the given item.

#### `LinkedList.Item#detach()`

```javascript
var item = new LinkedList.Item()
var list = new LinkedList(item)

item.list === list // => true

item.detach()
item.list === null // => true
```

Removes the operated on item from its parent list.  Removes references to
it on its parent `list`, and `prev` and `next` items; relinking them when
possible.  Returns the operated on item.  Even when it was already detached.

#### `LinkedList.Item#next`

```javascript
var item1 = new LinkedList.Item()
var item2 = new LinkedList.Item()

new LinkedList(item1)

item1.next === null // => true
item2.next === null // => true

item1.append(item2)

item1.next === item2 // => true

item1.detach()

item1.next === null // => true
```

The items succeeding item, and `null` otherwise.

#### `LinkedList.Item#prev`

```javascript
var item1 = new LinkedList.Item()
var item2 = new LinkedList.Item()

new LinkedList(item)

item1.prev === null // => true
item2.prev === null // => true

item1.append(item2)

item1.prev === item1 // => true

item2.detach()

item2.prev === null // => true
```

The items preceding item, and `null` otherwise.

#### `LinkedList.Item#list`

```javascript
var item = new LinkedList.Item()
var list = new LinkedList()

item.list === null // => true

list.append(item)

item.list === list // => true

item.detach()

item.list === null // => true
```

The items parent list, and `null` otherwise.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/wooorm/linked-list.svg

[travis]: https://travis-ci.org/wooorm/linked-list

[codecov-badge]: https://img.shields.io/codecov/c/github/wooorm/linked-list.svg

[codecov]: https://codecov.io/github/wooorm/linked-list

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: http://wooorm.com

[wiki]: http://wikipedia.org/wiki/Linked_list
