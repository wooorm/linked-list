'use strict'

// Expose.
module.exports = List

var ListPrototype = List.prototype
var ListItemPrototype = ListItem.prototype
var IterPrototype = Iter.prototype

/* istanbul ignore next */
var $iterator = typeof Symbol === 'undefined' ? undefined : Symbol.iterator

List.Item = ListItem
List.of = of
List.from = from

ListPrototype.tail = ListPrototype.head = null
ListPrototype.toArray = toArray
ListPrototype.prepend = prepend
ListPrototype.append = append
/* istanbul ignore else */
if ($iterator !== undefined) ListPrototype[$iterator] = iterator

ListItemPrototype.next = ListItemPrototype.prev = ListItemPrototype.list = null
ListItemPrototype.prepend = prependItem
ListItemPrototype.append = appendItem
ListItemPrototype.detach = detach

IterPrototype.next = next

// Creates a new List: A linked list is a bit like an Array, but knows nothing
// about how many items are in it, and knows only about its first (`head`) and
// last (`tail`) items.
// Each item (e.g. `head`, `tail`, &c.) knows which item comes before or after
// it (its more like the implementation of the DOM in JavaScript).
function List(/* items... */) {
  this.size = 0

  if (arguments.length) {
    appendAll(this, arguments)
  }
}

// Creates a new list from the arguments (each a list item) passed in.
function appendAll(list, items) {
  var index
  var item
  var iter

  if (!items) {
    return list
  }

  if ($iterator !== undefined && items[$iterator]) {
    iter = items[$iterator]()
    item = {}

    while (!item.done) {
      item = iter.next()
      list.append(item && item.value)
    }
  } else {
    index = -1

    while (++index < items.length) {
      list.append(items[index])
    }
  }

  return list
}

// Creates a new list from the arguments (each a list item) passed in.
function of(/* items... */) {
  return appendAll(new this(), arguments)
}

// Creates a new list from the given array-like object (each a list item) passed
// in.
function from(items) {
  return appendAll(new this(), items)
}

// Returns the list’s items as an array.
// This does *not* detach the items.
function toArray() {
  var item = this.head
  var result = []

  while (item) {
    result.push(item)
    item = item.next
  }

  return result
}

// Prepends the given item to the list.
// `item` will be the new first item (`head`).
function prepend(item) {
  if (!item) {
    return false
  }

  if (!item.append || !item.prepend || !item.detach) {
    throw new Error(
      'An argument without append, prepend, or detach methods was given to `List#prepend`.'
    )
  }

  if (this.head) {
    return this.head.prepend(item)
  }

  item.detach()
  item.list = this
  this.head = item
  this.size++

  return item
}

// Appends the given item to the list.
// `item` will be the new last item (`tail`) if the list had a first item, and
// its first item (`head`) otherwise.
function append(item) {
  if (!item) {
    return false
  }

  if (!item.append || !item.prepend || !item.detach) {
    throw new Error(
      'An argument without append, prepend, or detach methods was given to `List#append`.'
    )
  }

  // If self has a last item, defer appending to the last items append method,
  // and return the result.
  if (this.tail) {
    return this.tail.append(item)
  }

  // If self has a first item, defer appending to the first items append method,
  // and return the result.
  if (this.head) {
    return this.head.append(item)
  }

  // …otherwise, there is no `tail` or `head` item yet.
  item.detach()
  item.list = this
  this.head = item
  this.size++

  return item
}

// Creates an iterator from the list.
function iterator() {
  return new Iter(this.head)
}

// Creates a new ListItem:
// An item is a bit like DOM node: It knows only about its "parent" (`list`),
// the item before it (`prev`), and the item after it (`next`).
function ListItem() {}

// Detaches the item operated on from its parent list.
function detach() {
  var list = this.list

  if (!list) {
    return this
  }

  // If self is the last item in the parent list, link the lists last item to
  // the previous item.
  if (list.tail === this) {
    list.tail = this.prev
  }

  // If self is the first item in the parent list, link the lists first item to
  // the next item.
  if (list.head === this) {
    list.head = this.next
  }

  // If both the last and first items in the parent list are the same, remove
  // the link to the last item.
  if (list.tail === list.head) {
    list.tail = null
  }

  // If a previous item exists, link its next item to selfs next item.
  if (this.prev) {
    this.prev.next = this.next
  }

  // If a next item exists, link its previous item to selfs previous item.
  if (this.next) {
    this.next.prev = this.prev
  }

  // Remove links from self to both the next and previous items, and to the
  // parent list.
  this.prev = this.next = this.list = null

  list.size--

  return this
}

// Prepends the given item *before* the item operated on.
function prependItem(item) {
  var list = this.list

  if (!item || !item.append || !item.prepend || !item.detach) {
    throw new Error(
      'An argument without append, prepend, or detach methods was given to `ListItem#prepend`.'
    )
  }

  // If self is detached, return false.
  if (!list) {
    return false
  }

  // Detach the prependee.
  item.detach()

  // If self has a previous item...
  if (this.prev) {
    item.prev = this.prev
    this.prev.next = item
  }

  // Connect the prependee.
  item.next = this
  item.list = list

  // Set the previous item of self to the prependee.
  this.prev = item

  // If self is the first item in the parent list, link the lists first item to
  // the prependee.
  if (this === list.head) {
    list.head = item
  }

  // If the the parent list has no last item, link the lists last item to self.
  if (!list.tail) {
    list.tail = this
  }

  list.size++

  return item
}

// Appends the given item *after* the item operated on.
function appendItem(item) {
  var list = this.list

  if (!item || !item.append || !item.prepend || !item.detach) {
    throw new Error(
      'An argument without append, prepend, or detach methods was given to `ListItem#append`.'
    )
  }

  if (!list) {
    return false
  }

  // Detach the appendee.
  item.detach()

  // If self has a next item…
  if (this.next) {
    item.next = this.next
    this.next.prev = item
  }

  // Connect the appendee.
  item.prev = this
  item.list = list

  // Set the next item of self to the appendee.
  this.next = item

  // If the the parent list has no last item or if self is the parent lists last
  // item, link the lists last item to the appendee.
  if (this === list.tail || !list.tail) {
    list.tail = item
  }

  list.size++

  return item
}

// Creates a new `Iter` for looping over the `LinkedList`.
function Iter(item) {
  this.item = item
}

// Move the `Iter` to the next item.
function next() {
  this.value = this.item
  this.done = !this.item
  this.item = this.item ? this.item.next : undefined
  return this
}
