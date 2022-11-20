# linked-list

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

Small double [linked list][wiki].

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`List([items…])`](#listitems)
    *   [`Item()`](#item)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a small double linked list.
Items in linked lists know about their next sibling (the item after them).
In double linked lists, items also know about their previous sibling (the item
before them).

## When should I use this?

You can use this project as a reference for how to implement a linked list but
it’s also definitely possible to use it, directly or by subclassing its lists
and items.

## Install

This package is [ESM only][esm].
In Node.js (version 14.14+, 16.0+), install with [npm][]:

```sh
npm install linked-list
```

In Deno with [`esm.sh`][esmsh]:

```js
import {List, Item} from 'https://esm.sh/linked-list@3'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {List, Item} from 'https://esm.sh/linked-list@3?bundle'
</script>
```

## Use

```js
import {List, Item} from 'linked-list'

const item1 = new Item()
const item2 = new Item()
const item3 = new Item()
const list = new List(item1, item2, item3)

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
  /** @param {string} delimiter */
  join(delimiter) {
    return this.toArray().join(delimiter)
  }
}

class Token extends Item {
  /** @param {string} value */
  constructor(value) {
    super()
    this.value = value
  }

  toString() {
    return this.value
  }
}

const dogs = new Token('dogs')
const and = new Token('&')
const cats = new Token('cats')
const tokens = new Tokens(dogs, and, cats)

console.log(tokens.join(' ')) // => 'dogs & cats'

and.prepend(cats)
and.append(dogs)

console.log(tokens.join(' ') + '!') // => 'cats & dogs!'
```

## API

This package exports the identifiers `List` and `Item`.
There is no default export.

### `List([items…])`

```js
new List()
new List(new Item(), new Item())
```

Create a new list from the given items.

Ignores `null` or `undefined` values.
Throws an error when a given item has no `detach`, `append`, or `prepend`
methods.

#### `List.from([items])`

```js
List.from()
List.from([])
List.from([new Item(), new Item()])
```

Create a new `this` from the given array of items.

Ignores `null` or `undefined` values.
Throws an error when a given item has no `detach`, `append`, or `prepend`
methods.

#### `List.of([items…])`

```js
List.of()
List.of(new Item(), new Item())
```

Create a new `this` from the given arguments.

Ignores `null` or `undefined` values.
Throws an error when a given item has no `detach`, `append`, or `prepend`
methods.

#### `List#append(item)`

```js
const list = new List()
const item = new Item()

console.log(list.head === null) // => true
console.log(item.list === null) // => true

list.append(item)

console.log(list.head === item) // => true
console.log(item.list === list) // => true
```

Append an item to a list.

Throws an error when the given item has no `detach`, `append`, or `prepend`
methods.
Returns the given item.

#### `List#prepend(item)`

```js
const list = new List()
const item = new Item()

list.prepend(item)
```

Prepend an item to a list.

Throws an error when the given item has no `detach`, `append`, or `prepend`
methods.
Returns the given item.

#### `List#toArray()`

```js
const item1 = new Item()
const item2 = new Item()
const list = new List(item1, item2)
const array = list.toArray()

console.log(array[0] === item1) // => true
console.log(array[1] === item2) // => true
console.log(array[0].next === item2) // => true
console.log(array[1].prev === item1) // => true
```

Returns the items of the list as an array.

This does *not* detach the items.

> **Note**: `List` also implements an iterator.
> That means you can also do `[...list]` to get an array.

#### `List#head`

```js
const item = new Item()
const list = new List(item)

console.log(list.head === item) // => true
```

The first item in a list or `null` otherwise.

#### `List#tail`

```js
const list = new List()
const item1 = new Item()
const item2 = new Item()

console.log(list.tail === null) // => true

list.append(item1)
console.log(list.tail === null) // => true, see note.

list.append(item2)
console.log(list.tail === item2) // => true
```

The last item in a list and `null` otherwise.

> 👉 **Note**: a list with only one item has **no tail**, only a head.

#### `List#size`

```js
const list = new List()
const item1 = new Item()
const item2 = new Item()

console.log(list.size === 0) // => true

list.append(item1)
console.log(list.size === 1) // => true

list.append(item2)
console.log(list.size === 2) // => true
```

The number of items in the list.

### `Item()`

```js
const item = new Item()
```

Create a new linked list item.

#### `Item#append(item)`

```js
const item1 = new Item()
const item2 = new Item()

new List().append(item1)

console.log(item1.next === null) // => true

item1.append(item2)
console.log(item1.next === item2) // => true
```

Add the given item **after** the operated on item in a list.

Throws an error when the given item has no `detach`, `append`, or `prepend`
methods.
Returns `false` when the operated on item is not attached to a list, otherwise
the given item.

#### `Item#prepend(item)`

```js
const item1 = new Item()
const item2 = new Item()

new List().append(item1)

console.log(item1.prev === null) // => true

item1.prepend(item2)
console.log(item1.prev === item2) // => true
```

Add the given item **before** the operated on item in a list.

Throws an error when the given item has no `detach`, `append`, or `prepend`
methods.
Returns `false` when the operated on item is not attached to a list, otherwise
the given item.

#### `Item#detach()`

```js
const item = new Item()
const list = new List(item)

console.log(item.list === list) // => true

item.detach()
console.log(item.list === null) // => true
```

Remove the operated on item from its parent list.

Removes references to it on its parent `list`, and `prev` and `next` items.
Relinks all references.
Returns the operated on item.
Even when it was already detached.

#### `Item#next`

```js
const item1 = new Item()
const item2 = new Item()

const list = new List(item1)

console.log(item1.next === null) // => true
console.log(item2.next === null) // => true

item1.append(item2)

console.log(item1.next === item2) // => true

item1.detach()

console.log(item1.next === null) // => true
```

The following item or `null` otherwise.

#### `Item#prev`

```js
const item1 = new Item()
const item2 = new Item()

const list = new List(item1)

console.log(item1.prev === null) // => true
console.log(item2.prev === null) // => true

item1.append(item2)

console.log(item2.prev === item1) // => true

item2.detach()

console.log(item2.prev === null) // => true
```

The preceding item or `null` otherwise.

#### `Item#list`

```js
const item = new Item()
const list = new List()

console.log(item.list === null) // => true

list.append(item)

console.log(item.list === list) // => true

item.detach()

console.log(item.list === null) // => true
```

The list this item belongs to or `null` otherwise.

## Types

This package is fully typed with [TypeScript][].
It exports no additional types.

## Compatibility

This package is at least compatible with all maintained versions of Node.js.
As of now, that is Node.js 14.14+ and 16.0+.
It also works in Deno and modern browsers.

## Security

This package is safe.

## Contribute

Yes please!
See [How to Contribute to Open Source][contribute].

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

[esmsh]: https://esm.sh

[license]: license

[author]: https://wooorm.com

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[typescript]: https://www.typescriptlang.org

[contribute]: https://opensource.guide/how-to-contribute/

[wiki]: https://wikipedia.org/wiki/Linked_list
