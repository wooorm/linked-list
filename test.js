'use strict'

var test = require('tape')
var LinkedList = require('.')

var own = {}.hasOwnProperty

var Item = LinkedList.Item

test('LinkedList [LinkedList]', function(t) {
  t.test('@constructor', function(st) {
    st.equal(typeof LinkedList.Item, 'function', 'should have an `Item` method')
    st.equal(typeof LinkedList.of, 'function', 'should have an `of` method')
    st.equal(typeof LinkedList.from, 'function', 'should have a `from` method')

    st.end()
  })

  t.test('of [LinkedList.of]', function(st) {
    function C() {}
    C.prototype.append = LinkedList.prototype.append
    C.of = LinkedList.of

    st.ok(
      LinkedList.of() instanceof LinkedList,
      'should return an instance of self when *no* arguments are given'
    )

    st.notOk(
      own.call(LinkedList.of(null), 'head'),
      'should ignore `null` values'
    )
    st.notOk(
      own.call(LinkedList.of(undefined), 'head'),
      'should ignore `undefined` values'
    )

    st.ok(
      LinkedList.of(new Item()) instanceof LinkedList,
      'should return an instance of self when arguments are given (1)'
    )

    st.ok(
      C.of(new Item()) instanceof C,
      'should return an instance of self when arguments are given (2)'
    )

    st.throws(function() {
      LinkedList.of({})
    }, 'should throw an error when an invalid item is given')

    st.test(
      'should add (“append”) items in the order they were given',
      function(sst) {
        var item = new Item()
        var item1 = new Item()
        var item2 = new Item()
        var list = LinkedList.of(item, item1, item2)

        sst.equal(list.head, item)
        sst.equal(list.head.next, item1)
        sst.equal(list.head.next.next, item2)

        sst.equal(list.tail, item2)
        sst.equal(list.tail.prev, item1)
        sst.equal(list.tail.prev.prev, item)

        sst.end()
      }
    )

    st.end()
  })

  t.test('from [LinkedList.from]', function(st) {
    function C() {}
    C.prototype.append = LinkedList.prototype.append
    C.from = LinkedList.from

    st.ok(
      LinkedList.from() instanceof LinkedList,
      'should return an instance of self when *no* arguments are given (1)'
    )

    st.ok(
      C.from() instanceof C,
      'should return an instance of self when *no* arguments are given (2)'
    )

    st.notOk(
      own.call(LinkedList.from([null]), 'head'),
      'should ignore `null` values'
    )

    st.notOk(
      own.call(LinkedList.from([undefined]), 'head'),
      'should ignore `undefined` values'
    )

    st.ok(
      LinkedList.from([new Item()]) instanceof LinkedList,
      'should return an instance of self when items are given (1)'
    )

    st.ok(
      C.from([new Item()]) instanceof C,
      LinkedList.from([new Item()]) instanceof LinkedList,
      'should return an instance of self when items are given (2)'
    )

    st.throws(function() {
      LinkedList.from([{}])
    }, 'should throw an error when an invalid item is given')

    st.test(
      'should add (“append”) items in the order they were given',
      function(sst) {
        var item = new Item()
        var item1 = new Item()
        var item2 = new Item()
        var list = LinkedList.from([item, item1, item2])

        sst.equal(list.head, item)
        sst.equal(list.head.next, item1)
        sst.equal(list.head.next.next, item2)

        sst.equal(list.tail, item2)
        sst.equal(list.tail.prev, item1)
        sst.equal(list.tail.prev.prev, item)

        sst.end()
      }
    )

    st.test('should add items from an array with `Symbol.iterator`', function(
      sst
    ) {
      var items = [new Item(), new Item(), new Item()]
      // Remove iterator to test array branch.
      items[Symbol.iterator] = undefined
      var list = LinkedList.from(items)

      sst.equal(list.head, items[0])
      sst.equal(list.head.next, items[1])
      sst.equal(list.head.next.next, items[2])

      sst.equal(list.tail, items[2])
      sst.equal(list.tail.prev, items[1])
      sst.equal(list.tail.prev.prev, items[0])

      sst.end()
    })

    st.end()
  })

  t.test('@instance', function(st) {
    st.equal(
      new LinkedList().head,
      null,
      'should have a `head` property set to `null`'
    )

    st.equal(
      new LinkedList().tail,
      null,
      'should have a `tail` property set to `null`'
    )

    st.equal(
      typeof new LinkedList().prepend,
      'function',
      'should have a `prepend` method'
    )

    st.equal(
      typeof new LinkedList().append,
      'function',
      'should have an `append` method'
    )

    st.equal(
      typeof new LinkedList().toArray,
      'function',
      'should have an `toArray` method'
    )

    st.test('prepend [LinkedList#prepend]', function(sst) {
      var list
      var item
      var other

      sst.equal(
        new LinkedList().prepend(),
        false,
        'should return false when no item is given'
      )

      item = new Item()

      sst.equal(
        new LinkedList().prepend(item),
        item,
        'should return the given item'
      )

      list = new LinkedList()

      sst.throws(function() {
        list.prepend({})
      }, 'should throw an error when an invalid item is given')

      list = new LinkedList()
      item = new Item()
      list.prepend(item)

      sst.equal(list.head, item, 'should set `@head` to the first prependee')

      list = new LinkedList()
      item = new Item()
      list.prepend(item)

      sst.equal(list.tail, null, 'shouldn’t set `@tail` to the first prependee')

      other = new Item()
      list.prepend(other)

      sst.equal(
        list.head,
        other,
        'should set `@head` to further prependees (1)'
      )

      sst.equal(
        list.tail,
        item,
        'should set `@tail` to the first prependee (1)'
      )

      other = new Item()
      list.prepend(other)

      sst.equal(
        list.head,
        other,
        'should set `@head` to further prependedees (2)'
      )

      sst.equal(
        list.tail,
        item,
        'should set `@tail` to the first prependee (2)'
      )

      list = new LinkedList()
      other = new LinkedList()
      item = new Item()

      list.prepend(item)
      other.prepend(item)

      sst.equal(
        list.head,
        null,
        'should detach the previous parent list of a prependee'
      )

      sst.equal(other.head, item, 'should attach a prependee to a new list')

      sst.end()
    })

    st.test('append [LinkedList#append]', function(sst) {
      var list
      var item
      var other

      sst.equal(
        new LinkedList().append(),
        false,
        'should return false when no item is given'
      )

      item = new Item()

      sst.equal(
        new LinkedList().append(item),
        item,
        'should return the given item'
      )

      list = new LinkedList()

      sst.throws(function() {
        list.append({})
      }, 'should throw an error when an invalid item is given')

      list = new LinkedList()
      item = new Item()
      list.append(item)

      sst.equal(list.head, item, 'should set `@head` to the first appendee')

      list = new LinkedList()
      item = new Item()
      list.append(item)

      sst.equal(list.tail, null, 'shouldn’t set `@tail` to the first appendee')

      other = new Item()
      list.append(other)

      sst.equal(
        list.tail,
        other,
        'should set `@tail` to further appendedees (1)'
      )

      sst.equal(list.head, item, 'should set `@head` to the first appendee (1)')

      other = new Item()
      list.append(other)

      sst.equal(list.tail, other, 'should set `@tail` to further appendees (2)')

      sst.equal(list.head, item, 'should set `@head` to the first appendee (2)')

      list = new LinkedList()
      other = new LinkedList()
      item = new Item()

      list.append(item)
      other.append(item)

      sst.equal(
        list.head,
        null,
        'should detach the previous parent list of an appendee'
      )

      sst.equal(other.head, item, 'should attach an appendee to a new list')

      sst.end()
    })

    st.test('toArray [LinkedList#toArray]', function(sst) {
      var list
      var result

      sst.ok(
        Array.isArray(new LinkedList(new Item()).toArray()),
        'should return an array'
      )

      sst.ok(
        Array.isArray(new LinkedList().toArray()),
        'should return an array, even when ' +
          'the operated on list has no items'
      )

      list = new LinkedList(new Item(), new Item(), new Item())
      result = list.toArray()

      sst.equal(result[0], list.head, 'should return a sorted array (1)')
      sst.equal(result[1], list.head.next, 'should return a sorted array (2)')
      sst.equal(result[2], list.tail, 'should return a sorted array (3)')

      sst.end()
    })

    st.test('@@iterator [LinkedList#@@iterator]', function(sst) {
      var list
      var result

      list = new LinkedList(new Item(), new Item(), new Item())
      result = Array.from(list)

      sst.equal(result[0], list.head, 'should return a sorted array (1)')
      sst.equal(result[1], list.head.next, 'should return a sorted array (2)')
      sst.equal(result[2], list.tail, 'should return a sorted array (3)')

      sst.end()
    })

    st.end()
  })

  t.end()
})

test('Item [LinkedList.Item]', function(t) {
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

  t.test('prepend [LinkedList.Item#prepend]', function(st) {
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

    t.throws(function() {
      item.prepend(null)
    }, 'should throw an error when an invalid item is given (1)')

    t.throws(function() {
      item.prepend({})
    }, 'should throw an error when an invalid item is given (2)')

    item = new Item()
    other = new Item()
    new LinkedList().append(item)

    t.equal(
      item.prepend(other),
      other,
      'should return the given item when ' +
        'the operated on instance is ' +
        'attached'
    )

    item = new Item()
    other = new LinkedList(item)
    list = new LinkedList(new Item())

    list.head.prepend(item)

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

    st.end()
  })

  t.test('append [LinkedList.Item#append]', function(st) {
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

    t.throws(function() {
      item.append(null)
    }, 'should throw an error when an invalid item is given (1)')

    t.throws(function() {
      item.append({})
    }, 'should throw an error when an invalid item is given (2)')

    item = new Item()
    other = new Item()
    new LinkedList().append(item)

    t.equal(
      item.append(other),
      other,
      'should return the given item when ' +
        'the operated on instance is ' +
        'attached'
    )

    item = new Item()
    other = new LinkedList(item)
    list = new LinkedList(new Item())

    list.head.append(item)

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

    st.end()
  })

  t.test('detach [LinkedList.Item#detach]', function(st) {
    var item = new Item()
    var list = new LinkedList()
    var other
    var other2

    list.append(item)

    st.equal(item.detach(), item, 'should return self')

    st.equal(
      item.detach(),
      item,
      'should return self, even when the item is not attached'
    )

    item = new Item()
    other = new Item()
    list = new LinkedList()

    list.append(item)
    list.append(other)

    item.detach()

    st.equal(
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

    st.equal(
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

    st.equal(
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

    st.equal(
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

    st.equal(
      other2.prev,
      item,
      'should set the next item’s `prev` property to ' +
        'the current item’s `prev` property'
    )

    item = new Item()
    list = new LinkedList()

    list.append(item)
    item.detach()

    st.equal(item.list, null, 'should set the item’s `list` property to `null`')

    item = new Item()
    other = new Item()
    list = new LinkedList()

    list.append(other)
    list.append(item)
    item.detach()

    st.equal(item.prev, null, 'should set the item’s `prev` property to `null`')

    item = new Item()
    other = new Item()
    list = new LinkedList()

    list.append(item)
    list.append(other)
    item.detach()

    st.equal(item.next, null, 'should set the item’s `next` property to `null`')

    st.end()
  })

  t.end()
})
