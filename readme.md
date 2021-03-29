# linked-list

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

Small double [linked list][wiki].

## Install

This package is ESM only: Node 12+ is needed to use it and it must be `import`ed
instead of `require`d.

[npm][]:

```sh
npm install linked-list
```

## Use

```js
import {List, Item} from 'linked-list'

var item1 = new Item()
var item2 = new Item()
var item3 = new Item()
var list = new List(item1, item2, item3)

list.head // => item1
list.head.next // => item2
list.head.next.next // => item3
list.head.next.prev // => item1
list.tail // => item3
list.tail.next // => `null`
```

Subclassing:

```js
import {List, Item} from 'linked-list'

class Tokens extends List {
  join(delimiter) {
    return this.toArray().join(delimiter)
  }
}

class Token extends Item {
  constructor(value) {
    super()
    this.value = value
  }

  toString() {
    return this.value
  }
}

var dogs = new Token('dogs')
var and = new Token('&')
var cats = new Token('cats')
var tokens = new Tokens(dogs, and, cats)

console.log(tokens.join(' ')) // => 'dogs & cats'

and.prepend(cats)
and.append(dogs)

console.log(tokens.join(' ') + '!') // => 'cats & dogs!'
```

## API

This package exports the following identifiers: `List`, `Item`.
There is no default export.

### `List([items…])`

```js
new List()
new List(new Item(), new Item())
```

Create a new linked list.

#### `List.from([items])`

```js
List.from()
List.from([])
List.from([new Item(), new Item()])
```

Create a new `this` and adds the given array of items.
Ignores `null` or `undefined` values.
Throws an error when a given item has no `detach`, `append`, or `prepend`
methods.

#### `List.of([items…])`

```js
List.of()
List.of(new Item(), new Item())
```

Creates a new linked list from the given arguments.
Defers to `List.from`.

#### `List#append(item)`

```js
var list = new List()
var item = new Item()

list.head === null // => true
item.list === null // => true

list.append(item)

list.head === item // => true
item.list === list // => true
```

Appends an item to a list.
Throws an error when the given item has no `detach`, `append`, or `prepend`
methods.
Returns the given item.

#### `List#prepend(item)`

```js
var list = new List()
var item = new Item()

list.prepend(item)
```

Prepends an item to a list.
Throws an error when the given item has no `detach`, `append`, or `prepend`
methods.
Returns the given item.

#### `List#toArray()`

```js
var item1 = new Item()
var item2 = new Item()
var list = new List(item1, item2)
var array = list.toArray()

array[0] === item1 // => true
array[1] === item2 // => true
array[0].next === item2 // => true
array[1].prev === item1 // => true
```

Returns the items in the list in an array.

#### `List#head`

```js
var item = new Item()
var list = new List(item)

list.head === item // => true
```

The first item in a list, and `null` otherwise.

#### `List#tail`

```js
var list = new List()
var item1 = new Item()
var item2 = new Item()

list.tail === null // => true

list.append(item1)
list.tail === null // => true, see note.

list.append(item2)
list.tail === item2 // => true
```

The last item in a list, and `null` otherwise.
Note that a list with only one item has **no tail**, only a head.

#### `List#size`

```js
var list = new List()
var item1 = new Item()
var item2 = new Item()

list.size === 0 // => true

list.append(item1)
list.size === 1 // => true

list.append(item2)
list.size === 2 // => true
```

The number of items in the list.

### `Item()`

```js
var item = new Item()
```

Creates a new linked list Item.

#### `Item#append(item)`

```js
var item1 = new Item()
var item2 = new Item()

new List().append(item1)

item1.next === null // => true

item1.append(item2)
item1.next === item2 // => true
```

Adds the given item **after** the operated on item in a list.
Throws an error when the given item has no `detach`, `append`, or `prepend`
methods.
Returns false when the operated on item is not attached to a list, otherwise the
given item.

#### `Item#prepend(item)`

```js
var item1 = new Item()
var item2 = new Item()

new List().append(item1)

item1.prev === null // => true

item1.prepend(item2)
item1.prev === item2 // => true
```

Adds the given item **before** the operated on item in a list.
Throws an error when the given item has no `detach`, `append`, or `prepend`
methods.
Returns false when the operated on item is not attached to a list, otherwise
the given item.

#### `Item#detach()`

```js
var item = new Item()
var list = new List(item)

item.list === list // => true

item.detach()
item.list === null // => true
```

Removes the operated on item from its parent list.
Removes references to it on its parent `list`, and `prev` and `next` items;
relinking them when possible.
Returns the operated on item.
Even when it was already detached.

#### `Item#next`

```js
var item1 = new Item()
var item2 = new Item()

new List(item1)

item1.next === null // => true
item2.next === null // => true

item1.append(item2)

item1.next === item2 // => true

item1.detach()

item1.next === null // => true
```

The items succeeding item, and `null` otherwise.

#### `Item#prev`

```js
var item1 = new Item()
var item2 = new Item()

new List(item)

item1.prev === null // => true
item2.prev === null // => true

item1.append(item2)

item1.prev === item1 // => true

item2.detach()

item2.prev === null // => true
```

The items preceding item, and `null` otherwise.

#### `Item#list`

```js
var item = new Item()
var list = new List()

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

[build-badge]: https://github.com/wooorm/linked-list/workflows/main/badge.svg

[build]: https://github.com/wooorm/linked-list/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/linked-list.svg

[coverage]: https://codecov.io/github/wooorm/linked-list

[downloads-badge]: https://img.shields.io/npm/dm/linked-list.svg

[downloads]: https://www.npmjs.com/package/linked-list

[size-badge]: https://img.shields.io/bundlephobia/minzip/linked-list.svg

[size]: https://bundlephobia.com/result?p=linked-list

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[wiki]: https://wikipedia.org/wiki/Linked_list
