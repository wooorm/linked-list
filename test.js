import assert from 'node:assert/strict'
import test from 'node:test'
import {List, Item} from './index.js'

const own = {}.hasOwnProperty

test('List [List]', async function (t) {
  await t.test('@constructor', function () {
    assert.equal(typeof List.of, 'function', 'should have an `of` method')
    assert.equal(typeof List.from, 'function', 'should have a `from` method')
  })

  await t.test('of [List.of]', async function (t) {
    /**
     * @extends {List<Item>}
     */
    class C extends List {}

    assert.ok(
      List.of() instanceof List,
      'should return an instance of self when *no* arguments are given'
    )

    assert.equal(List.of().size, 0, 'should be empty')

    assert.ok(!own.call(List.of(null), 'head'), 'should ignore `null` values')
    assert.ok(
      !own.call(List.of(undefined), 'head'),
      'should ignore `undefined` values'
    )

    assert.ok(
      List.of(new Item()) instanceof List,
      'should return an instance of self when arguments are given (1)'
    )

    assert.equal(List.of(new Item()).size, 1, 'should have a proper size')

    assert.ok(
      C.of(new Item()) instanceof C,
      'should return an instance of self when arguments are given (2)'
    )

    assert.throws(function () {
      // @ts-expect-error: non-item.
      List.of({})
    }, 'should throw an error when an invalid item is given')

    await t.test(
      'should add (“append”) items in the order they were given',
      function () {
        const item = new Item()
        const item1 = new Item()
        const item2 = new Item()
        const list = List.of(item, item1, item2)

        assert.equal(list.size, 3)

        assert.equal(list.head, item)
        assert.equal(list.head.next, item1)
        assert.equal(list.head.next.next, item2)

        assert.equal(list.tail, item2)
        assert.equal(list.tail.prev, item1)
        assert.equal(list.tail.prev.prev, item)
      }
    )
  })

  await t.test('from [List.from]', async function (t) {
    /**
     * @extends {List<Item>}
     */
    class C extends List {}

    assert.ok(
      List.from() instanceof List,
      'should return an instance of self when *no* arguments are given (1)'
    )

    assert.equal(List.from().size, 0, 'should be empty')

    assert.ok(
      C.from() instanceof C,
      'should return an instance of self when *no* arguments are given (2)'
    )

    assert.ok(
      !own.call(List.from([null]), 'head'),
      'should ignore `null` values'
    )

    assert.ok(
      !own.call(List.from([undefined]), 'head'),
      'should ignore `undefined` values'
    )

    assert.ok(
      List.from([new Item()]) instanceof List,
      'should return an instance of self when items are given (1)'
    )

    assert.equal(List.from([new Item()]).size, 1, 'should have a proper size')

    assert.ok(
      C.from([new Item()]) instanceof C,
      'should return an instance of self when items are given (2)'
    )

    assert.throws(function () {
      // @ts-expect-error: non-item.
      List.from([{}])
    }, 'should throw an error when an invalid item is given')

    await t.test(
      'should add (“append”) items in the order they were given',
      function () {
        const item = new Item()
        const item1 = new Item()
        const item2 = new Item()
        const list = List.from([item, item1, item2])

        assert.equal(list.size, 3)

        assert.equal(list.head, item)
        assert.equal(list.head.next, item1)
        assert.equal(list.head.next.next, item2)

        assert.equal(list.tail, item2)
        assert.equal(list.tail.prev, item1)
        assert.equal(list.tail.prev.prev, item)
      }
    )

    await t.test(
      'should add items from an array with `Symbol.iterator`',
      function () {
        const items = [new Item(), new Item(), null, new Item()]
        // Remove iterator to test array branch.
        // @ts-expect-error: that’s the test.
        items[Symbol.iterator] = undefined
        const list = List.from(items)

        assert.equal(list.size, 3)

        assert(list.head, 'should have a `head`')
        assert.equal(list.head, items[0])
        assert(list.head.next, 'should have a `head.next`')
        assert.equal(list.head.next, items[1])
        assert.equal(list.head.next.next, items[3])

        assert(list.tail, 'should have a `tail`')
        assert.equal(list.tail, items[3])
        assert(list.tail.prev, 'should have a `tail.prev`')
        assert.equal(list.tail.prev, items[1])
        assert.equal(list.tail.prev.prev, items[0])
      }
    )
  })

  await t.test('@instance', async function (t) {
    const list = new List()
    assert.equal(list.head, null, 'should have a `head` property set to `null`')

    assert.equal(
      new List().tail,
      null,
      'should have a `tail` property set to `null`'
    )

    assert.equal(new List().size, 0, 'should be empty')

    assert.equal(
      typeof new List().prepend,
      'function',
      'should have a `prepend` method'
    )

    assert.equal(
      typeof new List().append,
      'function',
      'should have an `append` method'
    )

    assert.equal(
      typeof new List().toArray,
      'function',
      'should have an `toArray` method'
    )

    await t.test('prepend [List#prepend]', function () {
      assert.equal(
        new List().prepend(),
        false,
        'should return false when no item is given'
      )

      let list = new List()
      list.prepend()
      assert.equal(list.size, 0, 'should have 0 size of no item is given')

      let item = new Item()

      assert.equal(
        new List().prepend(item),
        item,
        'should return the given item'
      )

      list = new List()

      assert.throws(function () {
        // @ts-expect-error: non-item.
        list.prepend({})
      }, 'should throw an error when an invalid item is given')

      list = new List()
      item = new Item()
      list.prepend(item)

      assert.equal(list.size, 1, 'should have proper size after prepend')

      assert.equal(list.head, item, 'should set `@head` to the first prependee')

      list = new List()
      item = new Item()
      list.prepend(item)

      assert.equal(
        list.tail,
        null,
        'shouldn’t set `@tail` to the first prependee'
      )

      let other = new Item()
      list.prepend(other)

      assert.equal(
        list.head,
        other,
        'should set `@head` to further prependees (1)'
      )

      assert.equal(list.size, 2, 'should update size after 2nd prepend')

      assert.equal(
        list.tail,
        item,
        'should set `@tail` to the first prependee (1)'
      )

      other = new Item()
      list.prepend(other)

      assert.equal(
        list.head,
        other,
        'should set `@head` to further prependedees (2)'
      )

      assert.equal(
        list.tail,
        item,
        'should set `@tail` to the first prependee (2)'
      )

      assert.equal(list.size, 3, 'should update size after 2nd prepend')

      list = new List()
      const otherList = new List()
      item = new Item()

      list.prepend(item)
      otherList.prepend(item)
      assert.equal(
        list.size,
        0,
        'should update size after item moved to new list'
      )
      assert.equal(
        otherList.size,
        1,
        'should update size after item moved from different list'
      )
      assert.equal(
        list.head,
        null,
        'should detach the previous parent list of a prependee'
      )

      assert.equal(
        otherList.head,
        item,
        'should attach a prependee to a new list'
      )
    })

    await t.test('append [List#append]', function () {
      assert.equal(
        new List().append(),
        false,
        'should return false when no item is given'
      )

      let list = new List()
      list.append()
      assert.equal(list.size, 0, 'should have 0 size of no item is given')

      let item = new Item()

      assert.equal(
        new List().append(item),
        item,
        'should return the given item'
      )

      list = new List()
      list.append(item)

      assert.equal(list.size, 1, 'should have proper size after append')

      list = new List()

      assert.throws(function () {
        // @ts-expect-error: non-item.
        list.append({})
      }, 'should throw an error when an invalid item is given')

      list = new List()
      item = new Item()
      list.append(item)

      assert.equal(list.head, item, 'should set `@head` to the first appendee')

      list = new List()
      item = new Item()
      list.append(item)

      assert.equal(
        list.tail,
        null,
        'shouldn’t set `@tail` to the first appendee'
      )

      let other = new Item()
      list.append(other)

      assert.equal(list.size, 2, 'should update size after 2nd append')

      assert.equal(
        list.tail,
        other,
        'should set `@tail` to further appendedees (1)'
      )

      assert.equal(
        list.head,
        item,
        'should set `@head` to the first appendee (1)'
      )

      other = new Item()
      list.append(other)

      assert.equal(
        list.tail,
        other,
        'should set `@tail` to further appendees (2)'
      )

      assert.equal(
        list.head,
        item,
        'should set `@head` to the first appendee (2)'
      )

      assert.equal(list.size, 3, 'should update size after 2nd append')

      list = new List()
      const otherList = new List()
      item = new Item()

      list.append(item)
      otherList.append(item)

      assert.equal(
        list.size,
        0,
        'should update size after item moved to new list'
      )
      assert.equal(
        otherList.size,
        1,
        'should update size after item moved from different list'
      )

      assert.equal(
        list.head,
        null,
        'should detach the previous parent list of an appendee'
      )

      assert.equal(
        otherList.head,
        item,
        'should attach an appendee to a new list'
      )
    })

    await t.test('toArray [List#toArray]', function () {
      assert.ok(
        Array.isArray(new List(new Item()).toArray()),
        'should return an array'
      )

      assert.ok(
        Array.isArray(new List().toArray()),
        'should return an array, even when ' +
          'the operated on list has no items'
      )

      const list = new List(new Item(), new Item(), new Item())
      const result = list.toArray()

      assert.equal(result[0], list.head, 'should return a sorted array (1)')
      assert.equal(
        result[1],
        // @ts-expect-error: exists.
        list.head.next,
        'should return a sorted array (2)'
      )
      assert.equal(result[2], list.tail, 'should return a sorted array (3)')
    })

    await t.test('@@iterator [List#@@iterator]', function () {
      const list = new List(new Item(), new Item(), new Item())
      const result = Array.from(list)

      assert.equal(result[0], list.head, 'should return a sorted array (1)')
      assert.equal(
        result[1],
        // @ts-expect-error: exists.
        list.head.next,
        'should return a sorted array (2)'
      )
      assert.equal(result[2], list.tail, 'should return a sorted array (3)')
    })

    await t.test('sort [List#sort]', function () {
      const list = new List()
      list.sort((item1, item2) => {
        // @ts-expect-error: exists.
        return item1.exampleVal < item2.exampleVal
      })
      assert.equal(
        list.head,
        null,
        'sorting an empty list should have no effect on head'
      )
      assert.equal(
        list.tail,
        null,
        'sorting an empty list should have no effect on tail'
      )

      const i1 = new Item()
      // @ts-expect-error: exists.
      i1.exampleVal = 1

      list.append(i1)
      list.sort((i1, i2) => {
        // @ts-expect-error: exists.
        return i1.exampleVal < i2.exampleVal
      })

      assert.equal(
        list.head,
        i1,
        'sorting a list with one item should have no effect on head'
      )
      assert.equal(
        list.tail,
        i1,
        'sorting a list with one item should have no effect on tail'
      )
      assert.equal(
        i1.prev,
        null,
        'sorting a list with one item should have no effect on items refs (prev)'
      )
      assert.equal(
        i1.next,
        null,
        'sorting a list with one item should have no effect on items refs (next)'
      )

      const i2 = new Item()
      // @ts-expect-error: exists.
      i2.exampleVal = 2

      list.append(i2)
      list.sort((i1, i2) => {
        // @ts-expect-error: exists.
        return i1.exampleVal > i2.exampleVal
      })

      assert.equal(
        list.head,
        i2,
        'sorting a list with even no. items should properly set the head ref'
      )
      assert.equal(
        list.tail,
        i1,
        'sorting a list with even no. items should properly set the tail ref'
      )

      assert.equal(
        i2.prev,
        null,
        'sorting a list with even no. items should properly set the refs (head.prev)'
      )
      assert.equal(
        i2.next,
        i1,
        'sorting a list with even no. items should properly set the refs (head.next)'
      )

      assert.equal(
        i1.prev,
        i2,
        'sorting a list with even no. items should properly set the refs (tail.prev)'
      )
      assert.equal(
        i1.next,
        null,
        'sorting a list with even no. items should properly set the refs (tail.next)'
      )

      const i3 = new Item()
      // @ts-expect-error: exists.
      i3.exampleVal = 3

      i1.detach()
      i2.detach()

      list.append(i2)
      list.append(i3)
      list.append(i1)

      list.sort((i1, i2) => {
        // @ts-expect-error: exists.
        return i1.exampleVal < i2.exampleVal
      })

      assert.equal(
        list.head,
        i1,
        'sorting a list with odd no. items should properly set the head ref'
      )
      assert.equal(
        list.tail,
        i3,
        'sorting a list with odd no. items should properly set the tail ref'
      )

      assert.equal(
        i1.prev,
        null,
        'sorting a list with odd no. items should properly set the refs (head.prev)'
      )
      assert.equal(
        i1.next,
        i2,
        'sorting a list with odd no. items should properly set the refs (head.next)'
      )

      assert.equal(
        i2.prev,
        i1,
        'sorting a list with odd no. items should properly set the refs (midItem.prev)'
      )
      assert.equal(
        i2.next,
        i3,
        'sorting a list with odd no. items should properly set the refs (midItem.next)'
      )

      assert.equal(
        i3.prev,
        i2,
        'sorting a list with odd no. items should properly set the refs (tail.prev)'
      )
      assert.equal(
        i3.next,
        null,
        'sorting a list with odd no. items should properly set the refs (tail.next)'
      )
    })
  })
})

test('Item [List.Item]', async function (t) {
  assert.equal(
    new Item().list,
    null,
    'should have a `list` property set to `null`'
  )
  assert.equal(
    new Item().prev,
    null,
    'should have a `prev` property set to `null`'
  )
  assert.equal(
    new Item().next,
    null,
    'should have a `next` property set to `null`'
  )
  assert.equal(
    typeof new Item().prepend,
    'function',
    'should have a `prepend` method'
  )
  assert.equal(
    typeof new Item().append,
    'function',
    'should have a `append` method'
  )
  assert.equal(
    typeof new Item().detach,
    'function',
    'should have a `detach` method'
  )

  await t.test('prepend [List.Item#prepend]', function () {
    let item = new Item()
    let other = new Item()

    assert.equal(
      item.prepend(other),
      false,
      'should return false when the operated on instance is not attached'
    )

    assert.equal(item.prev, null, 'should do nothing if `item` is detached (1)')
    assert.equal(
      other.next,
      null,
      'should do nothing if `item` is detached (2)'
    )

    assert.throws(function () {
      // @ts-expect-error: invalid value.
      item.prepend(null)
    }, 'should throw an error when an invalid item is given (1)')

    assert.throws(function () {
      // @ts-expect-error: invalid value.
      item.prepend({})
    }, 'should throw an error when an invalid item is given (2)')

    item = new Item()
    other = new Item()
    let list = new List()
    list.append(item)

    assert.equal(
      item.prepend(item),
      false,
      'should return false when the item tries to prepend itself'
    )

    assert.equal(item.prev, null, 'should do nothing if single `item` (1)')
    assert.equal(item.next, null, 'should do nothing if single `item` (2)')

    assert.equal(
      item.prepend(other),
      other,
      'should return the given item when ' +
        'the operated on instance is ' +
        'attached'
    )

    assert.equal(list.size, 2, 'should update size after prepend on item')

    item = new Item()
    const otherList = new List(item)
    list = new List(new Item())

    assert(list.head, 'should attach given item')
    list.head.prepend(item)

    assert.equal(
      otherList.size,
      0,
      'should update size after prepend on item to a different list'
    )

    assert.equal(
      otherList.head,
      null,
      'should detach the previous parent list of a given item'
    )

    assert.equal(
      item.list,
      list,
      'should attach the given item to the operated on item’s list'
    )

    assert.equal(
      list.head,
      item,
      'should set the given item as the parent list’s `head` when the operated on item is the current `head`'
    )

    assert(list.tail, 'should attach given item')
    assert.equal(
      list.tail,
      list.head.next,
      'should set the operated on item as the parent list’s `tail` when the operated on item is the current `head`'
    )

    assert.equal(
      list.tail.prev,
      item,
      'should set the operated on item’s `prev` property to the given item'
    )

    assert.equal(
      list.head.next,
      list.tail,
      'should set the given item’s `next` property to the operated on item'
    )

    const otherItem = list.tail
    item = new Item()
    otherItem.prepend(item)

    assert.equal(list.tail, otherItem, 'should not remove the tail')

    assert.equal(item.next, otherItem, 'should set `next` on the prependee')

    assert.equal(otherItem.prev, item, 'should set `prev` on the context')
  })

  await t.test('append [List.Item#append]', function () {
    let item = new Item()
    let other = new Item()

    assert.equal(
      item.append(other),
      false,
      'should return false when the operated on instance is not attached'
    )

    assert.equal(item.prev, null, 'should do nothing if `item` is detached (1)')
    assert.equal(
      other.next,
      null,
      'should do nothing if `item` is detached (2)'
    )

    assert.throws(function () {
      // @ts-expect-error: invalid value.
      item.append(null)
    }, 'should throw an error when an invalid item is given (1)')

    assert.throws(function () {
      // @ts-expect-error: invalid value.
      item.append({})
    }, 'should throw an error when an invalid item is given (2)')

    item = new Item()
    other = new Item()
    let list = new List()
    list.append(item)

    assert.equal(
      item.append(item),
      false,
      'should return false when the item tries to append itself'
    )

    assert.equal(item.prev, null, 'should do nothing if single `item` (1)')
    assert.equal(item.next, null, 'should do nothing if single `item` (2)')

    assert.equal(
      item.append(other),
      other,
      'should return the given item when ' +
        'the operated on instance is ' +
        'attached'
    )

    assert.equal(list.size, 2, 'should update size after append on item')

    item = new Item()
    const otherList = new List(item)
    list = new List(new Item())

    assert(list.head, 'should attach given item')
    list.head.append(item)

    assert.equal(
      otherList.size,
      0,
      'should update size after append on item to a different list'
    )

    assert.equal(
      otherList.head,
      null,
      'should detach the previous parent list of a given item'
    )

    assert.equal(
      item.list,
      list,
      'should attach the given item to the operated on item’s list'
    )

    assert.equal(
      list.tail,
      item,
      'should set the given item as the parent list’s `tail` when the operated on item is the current `tail`'
    )

    assert.equal(
      list.tail.prev,
      list.head,
      'should keep the operated on item as the parent list’s `head` when the operated on item is the current `head`'
    )

    const otherItem = list.head
    item = new Item()
    otherItem.append(item)

    assert.equal(list.head, otherItem, 'should not remove the head')

    assert.equal(otherItem.next, item, 'should set `next` on the context')

    assert.equal(item.prev, otherItem, 'should set `prev` on the appendee')
  })

  await t.test('detach [List.Item#detach]', function () {
    let item = new Item()
    let list = new List()

    list.append(item)

    assert.equal(item.detach(), item, 'should return self')

    assert.equal(list.size, 0, 'should update size after detached item')

    assert.equal(
      item.detach(),
      item,
      'should return self, even when the item is not attached'
    )

    assert.equal(
      list.size,
      0,
      'should not update size after detaching already detached item'
    )

    item = new Item()
    let other = new Item()
    list = new List()

    list.append(item)
    list.append(other)

    item.detach()

    assert.equal(list.size, 1, 'should update size after detached item')

    assert.equal(
      list.head,
      other,
      'should set the item’s `next` property to the parent list’s `head` when the item is its current `head`'
    )

    item = new Item()
    other = new Item()
    let other2 = new Item()
    list = new List()

    list.append(item)
    list.append(other)
    list.append(other2)

    other2.detach()

    assert.equal(list.size, 2, 'should update size after detached item')

    assert.equal(
      list.tail,
      other,
      'should set the item’s `prev` property to the parent list’s `tail` when the item is its current `tail`'
    )

    item = new Item()
    other = new Item()
    list = new List()

    list.append(item)
    list.append(other)

    other.detach()

    assert.equal(list.size, 1, 'should update size after detached item')

    assert.equal(
      list.tail,
      null,
      'should set the parent list’s `tail` to `null` when the item is its current `tail` and its `prev` property is the current `tail`'
    )

    item = new Item()
    other = new Item()
    other2 = new Item()
    list = new List()

    list.append(item)
    list.append(other)
    list.append(other2)

    other.detach()

    assert.equal(list.size, 2, 'should update size after detached item')

    assert.equal(
      item.next,
      other2,
      'should set the previous item’s `next` ' +
        'property to the current item’s `next` ' +
        'property'
    )

    item = new Item()
    other = new Item()
    other2 = new Item()
    list = new List()

    list.append(item)
    list.append(other)
    list.append(other2)

    other.detach()

    assert.equal(list.size, 2, 'should update size after detached item')

    assert.equal(
      other2.prev,
      item,
      'should set the next item’s `prev` property to ' +
        'the current item’s `prev` property'
    )

    item = new Item()
    list = new List()

    list.append(item)
    item.detach()

    assert.equal(
      item.list,
      null,
      'should set the item’s `list` property to `null`'
    )

    item = new Item()
    other = new Item()
    list = new List()

    list.append(other)
    list.append(item)
    item.detach()

    assert.equal(
      item.prev,
      null,
      'should set the item’s `prev` property to `null`'
    )

    item = new Item()
    other = new Item()
    list = new List()

    list.append(item)
    list.append(other)
    item.detach()

    assert.equal(
      item.next,
      null,
      'should set the item’s `next` property to `null`'
    )
  })
})
