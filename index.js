'use strict';

/* Expose. */
module.exports = List;

List.Item = ListItem;

var ListPrototype = List.prototype;
var ListItemPrototype = ListItem.prototype;

ListPrototype.tail = ListPrototype.head = null;

List.of = of;
List.from = from;

ListPrototype.toArray = toArray;
ListPrototype.prepend = prepend;
ListPrototype.append = append;

ListItemPrototype.next = ListItemPrototype.prev = ListItemPrototype.list = null;

ListItemPrototype.prepend = prependItem;
ListItemPrototype.append = appendItem;
ListItemPrototype.detach = detach;

/* Constants. */
var errorMessage = 'An argument without append, prepend, ' +
  'or detach methods was given to `List';

/* Creates a new List: A linked list is a bit like an Array,
 * but knows nothing about how many items are in it, and
 * knows only about its first (`head`) and last (`tail`)
 * items.  Each item (e.g. `head`, `tail`, &c.) knows which
 * item comes before or after it (its more like the
 * implementation of the DOM in JavaScript). */
function List(/* items... */) {
  if (arguments.length !== 0) {
    return List.from(arguments);
  }
}

/* Creates a new list from the arguments (each a list item)
 * passed in. */
function of(/* items... */) {
  return List.from.call(this, arguments);
}

/* Creates a new list from the given array-like object
 * (each a list item) passed in. */
function from(items) {
  var list = new this();
  var length = items && items.length;
  var index = -1;
  var item;

  while (++index < length) {
    item = items[index];

    if (item !== null && item !== undefined) {
      list.append(item);
    }
  }

  return list;
}

/* Returns the list’s items as an array. This does *not* detach the items. */
function toArray() {
  var item = this.head;
  var result = [];

  while (item) {
    result.push(item);
    item = item.next;
  }

  return result;
}

/* Prepends the given item to the list: Item will be the
 * new first item (`head`). */
function prepend(item) {
  var self = this;
  var head = self.head;

  if (!item) {
    return false;
  }

  if (!item.append || !item.prepend || !item.detach) {
    throw new Error(errorMessage + '#prepend`.');
  }

  if (head) {
    return head.prepend(item);
  }

  item.detach();

  item.list = self;
  self.head = item;

  return item;
}

/* Appends the given item to the list: Item will be the new
 * last item (`tail`) if the list had a first item, and its
 * first item (`head`) otherwise. */
function append(item) {
  if (!item) {
    return false;
  }

  if (!item.append || !item.prepend || !item.detach) {
    throw new Error(errorMessage + '#append`.');
  }

  var self = this;
  var head = self.head;
  var tail = self.tail;

  /* If self has a last item, defer appending to the last items append
   * method, and return the result. */
  if (tail) {
    return tail.append(item);
  }

  /* If self has a first item, defer appending to the first items append
   * method, and return the result. */
  if (head) {
    return head.append(item);
  }

  /* ...otherwise, there is no `tail` or `head` item yet. */

  item.detach();

  item.list = self;
  self.head = item;

  return item;
}

/* Creates a new ListItem: A linked list item is a bit like
 * DOM node: It knows only about its "parent" (`list`), the
 * item before it (`prev`), and the item after it (`next`). */
function ListItem() {}

/* Detaches the item operated on from its parent list. */
function detach() {
  var self = this;
  var list = self.list;
  var prev = self.prev;
  var next = self.next;

  if (!list) {
    return self;
  }

  /* If self is the last item in the parent list, link the
   * lists last item to the previous item. */
  if (list.tail === self) {
    list.tail = prev;
  }

  /* If self is the first item in the parent list, link
   * the lists first item to the next item. */
  if (list.head === self) {
    list.head = next;
  }

  /* If both the last and first items in the parent list
   * are the same, remove the link to the last item. */
  if (list.tail === list.head) {
    list.tail = null;
  }

  /* If a previous item exists, link its next item to selfs
   * next item. */
  if (prev) {
    prev.next = next;
  }

  /* If a next item exists, link its previous item to selfs
   * previous item. */
  if (next) {
    next.prev = prev;
  }

  /* Remove links from self to both the next and previous
   * items, and to the parent list. */
  self.prev = self.next = self.list = null;

  return self;
}

/* Prepends the given item *before* the item operated on. */
function prependItem(item) {
  if (!item || !item.append || !item.prepend || !item.detach) {
    throw new Error(errorMessage + 'Item#prepend`.');
  }

  var self = this;
  var list = self.list;
  var prev = self.prev;

  /* If self is detached, return false. */
  if (!list) {
    return false;
  }

  /* Detach the prependee. */
  item.detach();

  /* If self has a previous item... */
  if (prev) {
    item.prev = prev;
    prev.next = item;
  }

  /* Connect the prependee. */
  item.next = self;
  item.list = list;

  /* Set the previous item of self to the prependee. */
  self.prev = item;

  /* If self is the first item in the parent list, link the
   * lists first item to the prependee. */
  if (self === list.head) {
    list.head = item;
  }

  /* If the the parent list has no last item, link the lists
   * last item to self. */
  if (!list.tail) {
    list.tail = self;
  }

  return item;
}

/* Appends the given item *after* the item operated on. */
function appendItem(item) {
  if (!item || !item.append || !item.prepend || !item.detach) {
    throw new Error(errorMessage + 'Item#append`.');
  }

  var self = this;
  var list = self.list;
  var next = self.next;

  if (!list) {
    return false;
  }

  /* Detach the appendee. */
  item.detach();

  /* If self has a next item... */
  if (next) {
    item.next = next;
    next.prev = item;
  }

  /* Connect the appendee. */
  item.prev = self;
  item.list = list;

  /* Set the next item of self to the appendee. */
  self.next = item;

  /* If the the parent list has no last item or if self is
   * the parent lists last item, link the lists last item
   * to the appendee. */
  if (self === list.tail || !list.tail) {
    list.tail = item;
  }

  return item;
}
