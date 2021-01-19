'use strict'

var test = require('tape')
var LinkedList = require('.')

var own = {}.hasOwnProperty

var Item = LinkedList.Item

test('LinkedList [LinkedList]', function (t) {
  t.test('@constructor', function (t) {
    t.equal(typeof LinkedList.Item, 'function', 'should have an `Item` method')
    t.equal(typeof LinkedList.of, 'function', 'should have an `of` method')
    t.equal(typeof LinkedList.from, 'function', 'should have a `from` method')

    t.end()
  })

  t.test('of [LinkedList.of]', function (t) {
    function C() {}
    C.prototype.append = LinkedList.prototype.append
    C.of = LinkedList.of

    t.ok(
      LinkedList.of() instanceof LinkedList,
      'should return an instance of self when *no* arguments are given'
    )

    t.equal(LinkedList.of().size, 0, 'should be empty')

    t.notOk(
      own.call(LinkedList.of(null), 'head'),
      'should ignore `null` values'
    )
    t.notOk(
      own.call(LinkedList.of(undefined), 'head'),
      'should ignore `undefined` values'
    )

    t.ok(
      LinkedList.of(new Item()) instanceof LinkedList,
      'should return an instance of self when arguments are given (1)'
    )

    t.equal(LinkedList.of(new Item()).size, 1, 'should have a proper size')

    t.ok(
      C.of(new Item()) instanceof C,
      'should return an instance of self when arguments are given (2)'
    )

    t.throws(function () {
      LinkedList.of({})
    }, 'should throw an error when an invalid item is given')

    t.test(
      'should add (“append”) items in the order they were given',
      function (t) {
        var item = new Item()
        var item1 = new Item()
        var item2 = new Item()
        var list = LinkedList.of(item, item1, item2)

        t.equal(list.size, 3)

        t.equal(list.head, item)
        t.equal(list.head.next, item1)
        t.equal(list.head.next.next, item2)

        t.equal(list.tail, item2)
        t.equal(list.tail.prev, item1)
        t.equal(list.tail.prev.prev, item)

        t.end()
      }
    )

    t.end()
  })

  t.test('from [LinkedList.from]', function (t) {
    function C() {}
    C.prototype.append = LinkedList.prototype.append
    C.from = LinkedList.from

    t.ok(
      LinkedList.from() instanceof LinkedList,
      'should return an instance of self when *no* arguments are given (1)'
    )

    t.equal(LinkedList.from().size, 0, 'should be empty')

    t.ok(
      C.from() instanceof C,
      'should return an instance of self when *no* arguments are given (2)'
    )

    t.notOk(
      own.call(LinkedList.from([null]), 'head'),
      'should ignore `null` values'
    )

    t.notOk(
      own.call(LinkedList.from([undefined]), 'head'),
      'should ignore `undefined` values'
    )

    t.ok(
      LinkedList.from([new Item()]) instanceof LinkedList,
      'should return an instance of self when items are given (1)'
    )

    t.equal(LinkedList.from([new Item()]).size, 1, 'should have a proper size')

    t.ok(
      C.from([new Item()]) instanceof C,
      LinkedList.from([new Item()]) instanceof LinkedList,
      'should return an instance of self when items are given (2)'
    )

    t.throws(function () {
      LinkedList.from([{}])
    }, 'should throw an error when an invalid item is given')

    t.test(
      'should add (“append”) items in the order they were given',
      function (t) {
        var item = new Item()
        var item1 = new Item()
        var item2 = new Item()
        var list = LinkedList.from([item, item1, item2])

        t.equal(list.size, 3)

        t.equal(list.head, item)
        t.equal(list.head.next, item1)
        t.equal(list.head.next.next, item2)

        t.equal(list.tail, item2)
        t.equal(list.tail.prev, item1)
        t.equal(list.tail.prev.prev, item)

        t.end()
      }
    )

    t.test(
      'should add items from an array with `Symbol.iterator`',
      function (t) {
        var items = [new Item(), new Item(), new Item()]
        // Remove iterator to test array branch.
        items[Symbol.iterator] = undefined
        var list = LinkedList.from(items)

        t.equal(list.size, 3)

        t.equal(list.head, items[0])
        t.equal(list.head.next, items[1])
        t.equal(list.head.next.next, items[2])

        t.equal(list.tail, items[2])
        t.equal(list.tail.prev, items[1])
        t.equal(list.tail.prev.prev, items[0])

        t.end()
      }
    )

    t.end()
  })

  t.test('@instance', function (t) {
    t.equal(
      new LinkedList().head,
      null,
      'should have a `head` property set to `null`'
    )

    t.equal(
      new LinkedList().tail,
      null,
      'should have a `tail` property set to `null`'
    )

    t.equal(new LinkedList().size, 0, 'should be empty')

    t.equal(
      typeof new LinkedList().prepend,
      'function',
      'should have a `prepend` method'
    )

    t.equal(
      typeof new LinkedList().append,
      'function',
      'should have an `append` method'
    )

    t.equal(
      typeof new LinkedList().toArray,
      'function',
      'should have an `toArray` method'
    )

    t.test('prepend [LinkedList#prepend]', function (t) {
      var list
      var item
      var other

      t.equal(
        new LinkedList().prepend(),
        false,
        'should return false when no item is given'
      )

      list = new LinkedList()
      list.prepend()
      t.equal(list.size, 0, 'should have 0 size of no item is given')

      item = new Item()

      t.equal(
        new LinkedList().prepend(item),
        item,
        'should return the given item'
      )

      list = new LinkedList()

      t.throws(function () {
        list.prepend({})
      }, 'should throw an error when an invalid item is given')

      list = new LinkedList()
      item = new Item()
      list.prepend(item)

      t.equal(list.size, 1, 'should have proper size after prepend')

      t.equal(list.head, item, 'should set `@head` to the first prependee')

      list = new LinkedList()
      item = new Item()
      list.prepend(item)

      t.equal(list.tail, null, 'shouldn’t set `@tail` to the first prependee')

      other = new Item()
      list.prepend(other)

      t.equal(list.head, other, 'should set `@head` to further prependees (1)')

      t.equal(list.size, 2, 'should update size after 2nd prepend')

      t.equal(list.tail, item, 'should set `@tail` to the first prependee (1)')

      other = new Item()
      list.prepend(other)

      t.equal(
        list.head,
        other,
        'should set `@head` to further prependedees (2)'
      )

      t.equal(list.tail, item, 'should set `@tail` to the first prependee (2)')

      t.equal(list.size, 3, 'should update size after 2nd prepend')

      list = new LinkedList()
      other = new LinkedList()
      item = new Item()

      list.prepend(item)
      other.prepend(item)
      t.equal(list.size, 0, 'should update size after item moved to new list')
      t.equal(
        other.size,
        1,
        'should update size after item moved from different list'
      )
      t.equal(
        list.head,
        null,
        'should detach the previous parent list of a prependee'
      )

      t.equal(other.head, item, 'should attach a prependee to a new list')

      t.end()
    })

    t.test('append [LinkedList#append]', function (t) {
      var list
      var item
      var other

      t.equal(
        new LinkedList().append(),
        false,
        'should return false when no item is given'
      )

      list = new LinkedList()
      list.append()
      t.equal(list.size, 0, 'should have 0 size of no item is given')

      item = new Item()

      t.equal(
        new LinkedList().append(item),
        item,
        'should return the given item'
      )

      list = new LinkedList()
      list.append(item)

      t.equal(list.size, 1, 'should have proper size after append')

      list = new LinkedList()

      t.throws(function () {
        list.append({})
      }, 'should throw an error when an invalid item is given')

      list = new LinkedList()
      item = new Item()
      list.append(item)

      t.equal(list.head, item, 'should set `@head` to the first appendee')

      list = new LinkedList()
      item = new Item()
      list.append(item)

      t.equal(list.tail, null, 'shouldn’t set `@tail` to the first appendee')

      other = new Item()
      list.append(other)

      t.equal(list.size, 2, 'should update size after 2nd append')

      t.equal(list.tail, other, 'should set `@tail` to further appendedees (1)')

      t.equal(list.head, item, 'should set `@head` to the first appendee (1)')

      other = new Item()
      list.append(other)

      t.equal(list.tail, other, 'should set `@tail` to further appendees (2)')

      t.equal(list.head, item, 'should set `@head` to the first appendee (2)')

      t.equal(list.size, 3, 'should update size after 2nd append')

      list = new LinkedList()
      other = new LinkedList()
      item = new Item()

      list.append(item)
      other.append(item)

      t.equal(list.size, 0, 'should update size after item moved to new list')
      t.equal(
        other.size,
        1,
        'should update size after item moved from different list'
      )

      t.equal(
        list.head,
        null,
        'should detach the previous parent list of an appendee'
      )

      t.equal(other.head, item, 'should attach an appendee to a new list')

      t.end()
    })

    t.test('toArray [LinkedList#toArray]', function (t) {
      var list
      var result

      t.ok(
        Array.isArray(new LinkedList(new Item()).toArray()),
        'should return an array'
      )

      t.ok(
        Array.isArray(new LinkedList().toArray()),
        'should return an array, even when ' +
          'the operated on list has no items'
      )

      list = new LinkedList(new Item(), new Item(), new Item())
      result = list.toArray()

      t.equal(result[0], list.head, 'should return a sorted array (1)')
      t.equal(result[1], list.head.next, 'should return a sorted array (2)')
      t.equal(result[2], list.tail, 'should return a sorted array (3)')

      t.end()
    })

    t.test('@@iterator [LinkedList#@@iterator]', function (t) {
      var list
      var result

      list = new LinkedList(new Item(), new Item(), new Item())
      result = Array.from(list)

      t.equal(result[0], list.head, 'should return a sorted array (1)')
      t.equal(result[1], list.head.next, 'should return a sorted array (2)')
      t.equal(result[2], list.tail, 'should return a sorted array (3)')

      t.end()
    })

    t.end()
  })

  t.end()
})

test('Item [LinkedList.Item]', function (t) {
  t.equal(new Item().list, null, 'should have a `list` property set to `null`')
  t.equal(new Item().prev, null, 'should have a `prev` property set to `null`')
  t.equal(new Item().next, null, 'should have a `next` property set to `null`')
  t.equal(
    typeof new Item().prepend,
    'function',
    'should have a `prepend` method'
  )
  t.equal(typeof new Item().append, 'function', 'should have a `append` method')
  t.equal(typeof new Item().detach, 'function', 'should have a `detach` method')

  t.test('prepend [LinkedList.Item#prepend]', function (t) {
    var item = new Item()
    var other = new Item()
    var list

    t.equal(
      item.prepend(other),
      false,
      'should return false when the operated on instance is not attached'
    )

    t.equal(item.prev, null, 'should do nothing if `item` is detached (1)')
    t.equal(other.next, null, 'should do nothing if `item` is detached (2)')

    t.throws(function () {
      item.prepend(null)
    }, 'should throw an error when an invalid item is given (1)')

    t.throws(function () {
      item.prepend({})
    }, 'should throw an error when an invalid item is given (2)')

    item = new Item()
    other = new Item()
    list = new LinkedList()
    list.append(item)

    t.equal(
      item.prepend(other),
      other,
      'should return the given item when ' +
        'the operated on instance is ' +
        'attached'
    )

    t.equal(list.size, 2, 'should update size after prepend on item')

    item = new Item()
    other = new LinkedList(item)
    list = new LinkedList(new Item())

    list.head.prepend(item)

    t.equal(
      other.size,
      0,
      'should update size after prepend on item to a different list'
    )

    t.equal(
      other.head,
      null,
      'should detach the previous parent list of a given item'
    )

    t.equal(
      item.list,
      list,
      'should attach the given item to the operated on item’s list'
    )

    t.equal(
      list.head,
      item,
      'should set the given item as the parent list’s `head` when the operated on item is the current `head`'
    )

    t.equal(
      list.tail,
      list.head.next,
      'should set the operated on item as the parent list’s `tail` when the operated on item is the current `head`'
    )

    t.equal(
      list.tail.prev,
      item,
      'should set the operated on item’s `prev` property to the given item'
    )

    t.equal(
      list.head.next,
      list.tail,
      'should set the given item’s `next` property to the operated on item'
    )

    other = list.tail
    item = new Item()
    other.prepend(item)

    t.equal(list.tail, other, 'should not remove the tail')

    t.equal(item.next, other, 'should set `next` on the prependee')

    t.equal(other.prev, item, 'should set `prev` on the context')

    t.end()
  })

  t.test('append [LinkedList.Item#append]', function (t) {
    var item = new Item()
    var other = new Item()
    var list

    t.equal(
      item.append(other),
      false,
      'should return false when the operated on instance is not attached'
    )

    t.equal(item.prev, null, 'should do nothing if `item` is detached (1)')
    t.equal(other.next, null, 'should do nothing if `item` is detached (2)')

    t.throws(function () {
      item.append(null)
    }, 'should throw an error when an invalid item is given (1)')

    t.throws(function () {
      item.append({})
    }, 'should throw an error when an invalid item is given (2)')

    item = new Item()
    other = new Item()
    list = new LinkedList()
    list.append(item)

    t.equal(
      item.append(other),
      other,
      'should return the given item when ' +
        'the operated on instance is ' +
        'attached'
    )

    t.equal(list.size, 2, 'should update size after append on item')

    item = new Item()
    other = new LinkedList(item)
    list = new LinkedList(new Item())

    list.head.append(item)

    t.equal(
      other.size,
      0,
      'should update size after append on item to a different list'
    )

    t.equal(
      other.head,
      null,
      'should detach the previous parent list of a given item'
    )

    t.equal(
      item.list,
      list,
      'should attach the given item to the operated on item’s list'
    )

    t.equal(
      list.tail,
      item,
      'should set the given item as the parent list’s `tail` when the operated on item is the current `tail`'
    )

    t.equal(
      list.tail.prev,
      list.head,
      'should keep the operated on item as the parent list’s `head` when the operated on item is the current `head`'
    )

    other = list.head
    item = new Item()
    other.append(item)

    t.equal(list.head, other, 'should not remove the head')

    t.equal(other.next, item, 'should set `next` on the context')

    t.equal(item.prev, other, 'should set `prev` on the appendee')

    t.end()
  })

  t.test('detach [LinkedList.Item#detach]', function (t) {
    var item = new Item()
    var list = new LinkedList()
    var other
    var other2

    list.append(item)

    t.equal(item.detach(), item, 'should return self')

    t.equal(list.size, 0, 'should update size after detached item')

    t.equal(
      item.detach(),
      item,
      'should return self, even when the item is not attached'
    )

    t.equal(
      list.size,
      0,
      'should not update size after detaching already detached item'
    )

    item = new Item()
    other = new Item()
    list = new LinkedList()

    list.append(item)
    list.append(other)

    item.detach()

    t.equal(list.size, 1, 'should update size after detached item')

    t.equal(
      list.head,
      other,
      'should set the item’s `next` property to the parent list’s `head` when the item is its current `head`'
    )

    item = new Item()
    other = new Item()
    other2 = new Item()
    list = new LinkedList()

    list.append(item)
    list.append(other)
    list.append(other2)

    other2.detach()

    t.equal(list.size, 2, 'should update size after detached item')

    t.equal(
      list.tail,
      other,
      'should set the item’s `prev` property to the parent list’s `tail` when the item is its current `tail`'
    )

    item = new Item()
    other = new Item()
    list = new LinkedList()

    list.append(item)
    list.append(other)

    other.detach()

    t.equal(list.size, 1, 'should update size after detached item')

    t.equal(
      list.tail,
      null,
      'should set the parent list’s `tail` to `null` when the item is its current `tail` and its `prev` property is the current `tail`'
    )

    item = new Item()
    other = new Item()
    other2 = new Item()
    list = new LinkedList()

    list.append(item)
    list.append(other)
    list.append(other2)

    other.detach()

    t.equal(list.size, 2, 'should update size after detached item')

    t.equal(
      item.next,
      other2,
      'should set the previous item’s `next` ' +
        'property to the current item’s `next` ' +
        'property'
    )

    item = new Item()
    other = new Item()
    other2 = new Item()
    list = new LinkedList()

    list.append(item)
    list.append(other)
    list.append(other2)

    other.detach()

    t.equal(list.size, 2, 'should update size after detached item')

    t.equal(
      other2.prev,
      item,
      'should set the next item’s `prev` property to ' +
        'the current item’s `prev` property'
    )

    item = new Item()
    list = new LinkedList()

    list.append(item)
    item.detach()

    t.equal(item.list, null, 'should set the item’s `list` property to `null`')

    item = new Item()
    other = new Item()
    list = new LinkedList()

    list.append(other)
    list.append(item)
    item.detach()

    t.equal(item.prev, null, 'should set the item’s `prev` property to `null`')

    item = new Item()
    other = new Item()
    list = new LinkedList()

    list.append(item)
    list.append(other)
    item.detach()

    t.equal(item.next, null, 'should set the item’s `next` property to `null`')

    t.end()
  })

  t.end()
})
