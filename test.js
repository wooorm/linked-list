'use strict';

/**
 * Dependencies.
 */

var LinkedList,
    assert;

LinkedList = require('./');
assert = require('assert');

/**
 * Cache.
 */

var Item;

Item = LinkedList.Item;

/**
 * Utilities.
 */

assert.isArray = function (result) {
    return assert(
        Object.prototype.toString.call(result) === '[object Array]'
    );
};

/**
 * Tests.
 */

describe('LinkedList [LinkedList]', function () {
    describe('@constructor', function () {
        it('should have an `Item` method', function () {
            assert(typeof LinkedList.Item === 'function');
        });

        it('should have an `of` method', function () {
            assert(typeof LinkedList.of === 'function');
        });

        it('should have a `from` method', function () {
            assert(typeof LinkedList.from === 'function');
        });

        describe('of [LinkedList.of]', function () {
            function C() {}
            C.prototype.append = LinkedList.prototype.append;
            C.of = LinkedList.of;

            it('should return an instance of self ' +
                'when *no* arguments are given',
                function () {
                    assert((LinkedList.of()) instanceof LinkedList);
                }
            );

            it('should ignore `null` or `undefined` values', function () {
                assert(!LinkedList.of(null).hasOwnProperty('head'));
                assert(!LinkedList.of(undefined).hasOwnProperty('head'));
            });

            it('should return an instance of self when ' +
                'arguments are given',
                function () {
                    assert((LinkedList.of(new Item())) instanceof LinkedList);
                    assert((C.of(new Item())) instanceof C);
                }
            );

            it('should throw an error when an invalid ' +
                'item is given',
                function () {
                    assert.throws(function () {
                        LinkedList.of({});
                    });
                }
            );

            it('should add ("append") items in the ' +
                'order they were given',
                function () {
                    var item,
                        item1,
                        item2,
                        list;

                    item = new Item();
                    item1 = new Item();
                    item2 = new Item();
                    list = LinkedList.of(item, item1, item2);

                    assert(list.head === item);
                    assert(list.head.next === item1);
                    assert(list.head.next.next === item2);

                    assert(list.tail === item2);
                    assert(list.tail.prev === item1);
                    assert(list.tail.prev.prev === item);
                }
            );
        });

        describe('from [LinkedList.from]', function () {
            function C() {}
            C.prototype.append = LinkedList.prototype.append;
            C.from = LinkedList.from;

            it('should return an instance of self when ' +
                '*no* arguments are given',
                function () {
                    assert((LinkedList.from()) instanceof LinkedList);
                    assert((C.from()) instanceof C);
                }
            );

            it('should ignore `null` or `undefined` values', function () {
                assert(!LinkedList.from([null]).hasOwnProperty('head'));
                assert(!LinkedList.from([undefined]).hasOwnProperty('head'));
            });

            it('should return an instance of ' +
                'self when items are given',
                function () {
                    assert(
                        LinkedList.from([new Item()]) instanceof LinkedList
                    );

                    assert(C.from([new Item()]) instanceof C);
                }
            );

            it('should throw an error when an invalid ' +
                'item is given',
                function () {
                    assert.throws(function () {
                        LinkedList.from([{}]);
                    });
                }
            );

            it('should add ("append") items in the ' +
                'order they were given',
                function () {
                    var item,
                        item1,
                        item2,
                        list;

                    item = new Item();
                    item1 = new Item();
                    item2 = new Item();
                    list = LinkedList.from([item, item1, item2]);

                    assert(list.head === item);
                    assert(list.head.next === item1);
                    assert(list.head.next.next === item2);

                    assert(list.tail === item2);
                    assert(list.tail.prev === item1);
                    assert(list.tail.prev.prev === item);
                }
            );
        });
    });

    describe('@instance', function () {
        it('should have a `head` property set to `null`', function () {
            assert((new LinkedList()).head === null);
        });

        it('should have a `tail` property set to `null`', function () {
            assert((new LinkedList()).tail === null);
        });

        it('should have a `prepend` method', function () {
            assert(typeof (new LinkedList()).prepend === 'function');
        });

        it('should have an `append` method', function () {
            assert(typeof (new LinkedList()).append === 'function');
        });

        it('should have an `toArray` method', function () {
            assert(typeof (new LinkedList()).toArray === 'function');
        });

        describe('prepend [LinkedList#prepend]', function () {
            it('should return false when no item is given', function () {
                assert((new LinkedList()).prepend() === false);
            });

            it('should return the given item', function () {
                var item;

                item = new Item();

                assert(item === (new LinkedList()).prepend(item));
            });

            it('should throw an error when an ' +
                'invalid item is given',
                function () {
                    var list;

                    list = new LinkedList();

                    assert.throws(function () {
                        list.prepend({});
                    });
                }
            );

            it('should set `@head` to the first prependee', function () {
                var list,
                    item;

                list = new LinkedList();
                item = new Item();

                list.prepend(item);

                assert(list.head === item);
            });

            it('shouldn\'t set `@tail` to the first prependee', function () {
                var list,
                    item;

                list = new LinkedList();
                item = new Item();

                list.prepend(item);

                assert(list.tail !== item);
            });

            it('should set `@head` to further prependees', function () {
                var list,
                    item,
                    item1;

                list = new LinkedList();
                item = new Item();
                item1 = new Item();

                list.prepend(new Item());

                list.prepend(item);
                assert(list.head === item);

                list.prepend(item1);
                assert(list.head === item1);
            });

            it('should set `@tail` to the first ' +
                'prependee when further items are ' +
                'prepended',
                function () {
                    var list,
                        item;

                    list = new LinkedList();
                    item = new Item();

                    list.prepend(item);
                    list.prepend(new Item());

                    assert(list.tail === item);
                }
            );

            it('shouldn\'t set `@tail` to further prependees', function () {
                var list,
                    item,
                    item1;

                list = new LinkedList();
                item = new Item();
                item1 = new Item();

                list.prepend(new Item());

                list.prepend(item);
                assert(list.tail !== item);

                list.prepend(item1);
                assert(list.tail !== item1);
            });

            it('should detach the previous parent ' +
                'list of a prependee',
                function () {
                    var list,
                        list1,
                        item;

                    list = new LinkedList();
                    list1 = new LinkedList();
                    item = new Item();

                    list.prepend(item);
                    list1.prepend(item);

                    assert(list.head !== item);
                }
            );

            it('should attach a prependee to a new list', function () {
                var list,
                    list1,
                    item;

                list = new LinkedList();
                list1 = new LinkedList();
                item = new Item();

                list.prepend(item);
                list1.prepend(item);

                assert(list1.head === item);
            });
        });

        describe('append [LinkedList#append]', function () {
            it('should return false when no item is given', function () {
                assert((new LinkedList()).append() === false);
            });

            it('should return the given item', function () {
                var item;

                item = new Item();

                assert(item === (new LinkedList()).append(item));
            });

            it('should throw an error when an ' +
                'invalid item is given',
                function () {
                    var list;

                    list = new LinkedList();

                    assert.throws(function () {
                        list.append({});
                    });
                }
            );

            it('should set `@head` to the first appendee', function () {
                var list,
                    item;

                list = new LinkedList();
                item = new Item();

                list.append(item);

                assert(list.head === item);
            });

            it('shouldn\'t set `@tail` to the first appendee', function () {
                var list,
                    item;

                list = new LinkedList();
                item = new Item();

                list.append(item);

                assert(list.tail !== item);
            });

            it('should set `@tail` to further appendees', function () {
                var list,
                    item,
                    item1;

                list = new LinkedList();
                item = new Item();
                item1 = new Item();

                list.append(new Item());

                list.append(item);
                assert(list.tail === item);

                list.append(item1);
                assert(list.tail === item1);
            });

            it('shouldn\'t set `@head` to further ' +
                'appendees',
                function () {
                    var list,
                        item,
                        item1;

                    list = new LinkedList();
                    item = new Item();
                    item1 = new Item();

                    list.append(new Item());

                    list.append(item);
                    assert(list.head !== item);

                    list.append(item1);
                    assert(list.head !== item1);
                }
            );

            it('should detach the previous parent ' +
                'list of an appendee',
                function () {
                    var list,
                        list1,
                        item;

                    list = new LinkedList();
                    list1 = new LinkedList();
                    item = new Item();

                    list.append(item);
                    list1.append(item);

                    assert(list.head !== item);
                }
            );

            it('should attach an appendee to a new list', function () {
                var list,
                    list1,
                    item;

                list = new LinkedList();
                list1 = new LinkedList();
                item = new Item();

                list.append(item);
                list1.append(item);

                assert(list1.head === item);
            });
        });

        describe('toArray [LinkedList#toArray]', function () {
            it('should return an array, even when ' +
                'the operated on list has no items',
                function () {
                    assert.isArray((new LinkedList()).toArray());
                }
            );

            it('should return an array', function () {
                assert.isArray((new LinkedList(new Item())).toArray());
            });

            it('should return an array sorted in ' +
                'the order of the items',
                function () {
                    var item,
                        item1,
                        item2,
                        array;

                    item = new Item();
                    item1 = new Item();
                    item2 = new Item();
                    array = (new LinkedList(item, item1, item2)).toArray();

                    assert(array[0] === item);
                    assert(array[1] === item1);
                    assert(array[2] === item2);
                }
            );

            it('shouldn\'t detach the returned items', function () {
                var item,
                    item1,
                    item2,
                    list,
                    array;

                item = new Item();
                item1 = new Item();
                item2 = new Item();
                list = new LinkedList(item, item1, item2);
                array = list.toArray();

                assert(array[0].next === item1);
                assert(array[1].next === item2);

                assert(array[1].prev === item);
                assert(array[2].prev === item1);

                assert(array[0].list === list);
                assert(array[1].list === list);
                assert(array[2].list === list);

                assert(list.head === item);
                assert(list.tail === item2);
            });
        });
    });
});

describe('Item [LinkedList.Item]', function () {
    describe('@instance', function () {
        it('should have a `list` property set to `null`', function () {
            assert((new Item()).list === null);
        });

        it('should have a `prev` property set to `null`', function () {
            assert((new Item()).prev === null);
        });

        it('should have a `next` property set to `null`', function () {
            assert((new Item()).next === null);
        });

        it('should have a `prepend` method', function () {
            assert(typeof (new Item()).prepend === 'function');
        });

        it('should have an `append` method', function () {
            assert(typeof (new Item()).append === 'function');
        });

        it('should have a `detach` method', function () {
            assert(typeof (new Item()).detach === 'function');
        });

        describe('prepend [LinkedList.Item#prepend]', function () {
            it('should throw an error when an ' +
                'invalid item is given',
                function () {
                    var item,
                        list;

                    item = new Item();
                    list = new LinkedList(item);

                    assert(item.list === list);

                    assert.throws(function () {
                        item.prepend(null);
                    });

                    assert.throws(function () {
                        item.prepend({});
                    });
                }
            );

            it('should return false when the operated ' +
                'on instance is not attached',
                function () {
                    var item,
                        item1;

                    item = new Item();
                    item1 = new Item();

                    assert(item.prepend(item1) === false);
                }
            );

            it('should return the given item when ' +
                'the operated on instance is ' +
                'attached',
                function () {
                    var item,
                        item1;

                    item = new Item();
                    item1 = new Item();

                    (new LinkedList()).append(item);

                    assert(item1 === item.prepend(item1));
                }
            );

            it('should detach the previous ' +
                'parent list of a given item',
                function () {
                    var item,
                        item1,
                        list,
                        list1;

                    item = new Item();
                    item1 = new Item();

                    list = new LinkedList();
                    list1 = new LinkedList();

                    list.append(item);
                    list1.append(item1);

                    item.prepend(item1);
                    assert(item1.list !== list1);
                }
            );

            it('should attach the given item to the ' +
                'operated on item\'s list',
                function () {
                    var item,
                        item1,
                        list,
                        list1;

                    item = new Item();
                    item1 = new Item();

                    list = new LinkedList();
                    list1 = new LinkedList();

                    list.append(item);
                    list1.append(item1);

                    item.prepend(item1);
                    assert(item1.list === list);
                }
            );

            it('should set the given item as the ' +
                'parent list\'s `head` when the ' +
                'operated on item is the current ' +
                '`head`',
                function () {
                    var item,
                        item1,
                        list;

                    item = new Item();
                    item1 = new Item();

                    list = new LinkedList();

                    list.append(item);

                    item.prepend(item1);
                    assert(item1 === list.head);
                }
            );

            it('should set the operated on item as ' +
                'the parent list\'s `tail` when the ' +
                'operated on item is the current ' +
                '`head`',
                function () {
                    var item,
                        item1,
                        list;

                    item = new Item();
                    item1 = new Item();

                    list = new LinkedList();

                    list.append(item);

                    item.prepend(item1);
                    assert(item === list.tail);
                }
            );

            it('should set the operated on item\'s ' +
                '`prev` property to the given item',
                function () {
                    var item,
                        item1,
                        list;

                    item = new Item();
                    item1 = new Item();

                    list = new LinkedList();

                    list.append(item);
                    item.prepend(item1);

                    assert(item.prev === item1);
                }
            );

            it('should set the given item\'s `next` ' +
                'property to the operated on item',
                function () {
                    var item,
                        item1,
                        list;

                    item = new Item();
                    item1 = new Item();

                    list = new LinkedList();

                    list.append(item);
                    item.prepend(item1);

                    assert(item1.next === item);
                }
            );
        });

        describe('append [LinkedList.Item#append]', function () {
            it('should throw an error when an invalid ' +
                'item is given',
                function () {
                    var item,
                        list;

                    item = new Item();
                    list = new LinkedList(item);

                    assert(item.list === list);

                    assert.throws(function () {
                        item.append(null);
                    });

                    assert.throws(function () {
                        item.append({});
                    });
                }
            );

            it('should return false when the operated' +
                'on instance is not attached',
                function () {
                    var item,
                        item1;

                    item = new Item();
                    item1 = new Item();

                    assert(item.append(item1) === false);
                }
            );

            it('should return the given item when ' +
                'the operated on instance is attached',
                function () {
                    var item,
                        item1;

                    item = new Item();
                    item1 = new Item();

                    (new LinkedList()).append(item);

                    assert(item1 === item.append(item1));
                }
            );

            it('should detach the previous parent ' +
                'list of a given item',
                function () {
                    var item,
                        item1,
                        list,
                        list1;

                    item = new Item();
                    item1 = new Item();

                    list = new LinkedList();
                    list1 = new LinkedList();

                    list.append(item);
                    list1.append(item1);

                    item.append(item1);
                    assert(item1.list !== list1);
                }
            );

            it('should attach the given item to ' +
                'the operated on item\'s list',
                function () {
                    var item,
                        item1,
                        list,
                        list1;

                    item = new Item();
                    item1 = new Item();

                    list = new LinkedList();
                    list1 = new LinkedList();

                    list.append(item);
                    list1.append(item1);

                    item.append(item1);
                    assert(item1.list === list);
                }
            );

            it('should set the given item as the ' +
                'parent list\'s `tail`',
                function () {
                    var item,
                        item1,
                        list;

                    item = new Item();
                    item1 = new Item();

                    list = new LinkedList();

                    list.append(new Item());
                    list.append(item);

                    item.append(item1);
                    assert(item1 === list.tail);
                }
            );

            it('should set the given item as the ' +
                'parent list\'s `tail` when the ' +
                'operated on item is the current ' +
                '`head`',
                function () {
                    var item,
                        item1,
                        list;

                    item = new Item();
                    item1 = new Item();

                    list = new LinkedList();

                    list.append(item);

                    item.append(item1);
                    assert(item1 === list.tail);
                }
            );

            it('should set the operated on item\'s ' +
                '`next` property to the given item',
                function () {
                    var item,
                        item1,
                        list;

                    item = new Item();
                    item1 = new Item();

                    list = new LinkedList();

                    list.append(item);
                    item.append(item1);

                    assert(item.next === item1);
                }
            );

            it('should set the given item\'s `prev` ' +
                'property to the operated on item',
                function () {
                    var item,
                        item1,
                        list;

                    item = new Item();
                    item1 = new Item();

                    list = new LinkedList();

                    list.append(item);
                    item.append(item1);

                    assert(item1.prev === item);
                }
            );
        });

        describe('detach [LinkedList.Item#detach]', function () {
            it('should return self', function () {
                var item,
                    list;

                item = new Item();
                list = new LinkedList();

                list.append(item);

                assert(item === item.detach());
            });

            it('should return self, even when the item ' +
                'is not attached',
                function () {
                    var item;

                    item = new Item();

                    assert(item === item.detach());
                }
            );

            it('should set the item\'s `next` property ' +
                'to the parent list\'s `head` when the ' +
                'item is its current `head`',
                function () {
                    var item,
                        item1,
                        list;

                    item = new Item();
                    item1 = new Item();

                    list = new LinkedList();

                    list.append(item);
                    list.append(item1);

                    item.detach();

                    assert(item1 === list.head);
                }
            );

            it('should set the item\'s `prev` property ' +
                'to the parent list\'s `tail` when the ' +
                'item is its current `tail`',
                function () {
                    var item,
                        item1,
                        item2,
                        list;

                    item = new Item();
                    item1 = new Item();
                    item2 = new Item();

                    list = new LinkedList();

                    list.append(item);
                    list.append(item1);
                    list.append(item2);

                    item2.detach();

                    assert(item1 === list.tail);
                }
            );

            it('should set the parent list\'s `tail` to ' +
                '`null` when the item is its current ' +
                '`tail` and its `prev` property is the ' +
                'current `tail`',
                function () {
                    var item,
                        item1,
                        list;

                    item = new Item();
                    item1 = new Item();

                    list = new LinkedList();

                    list.append(item);
                    list.append(item1);

                    item1.detach();

                    assert(list.tail === null);
                }
            );

            it('should set the previous item\'s `next` ' +
                'property to the current item\'s `next` ' +
                    'property', function () {
                        var item,
                            item1,
                            item2,
                            list;

                        item = new Item();
                        item1 = new Item();
                        item2 = new Item();

                        list = new LinkedList();

                    list.append(item);
                    list.append(item1);
                    list.append(item2);

                    item1.detach();

                    assert(item.next === item2);
                }
            );

            it('should set the next item\'s `prev` property to ' +
                'the current item\'s `prev` property',
                function () {
                    var item,
                        item1,
                        item2,
                        list;

                    item = new Item();
                    item1 = new Item();
                    item2 = new Item();

                    list = new LinkedList();

                    list.append(item);
                    list.append(item1);
                    list.append(item2);

                    item1.detach();

                    assert(item2.prev === item);
                }
            );

            it('should set the item\'s `list` property to `null`',
                function () {
                    var item,
                        list;

                    item = new Item();
                    list = new LinkedList();

                    list.append(item);
                    item.detach();

                    assert(item.list === null);
                }
            );

            it('should set the item\'s `prev` property to `null`',
                function () {
                    var item,
                        item1,
                        list;

                    item = new Item();
                    item1 = new Item();

                    list = new LinkedList();

                    list.append(item1);
                    list.append(item);
                    item.detach();

                    assert(item.prev === null);
                }
            );

            it('should set the item\'s `next` property to `null`',
                function () {
                    var item,
                        item1,
                        list;

                    item = new Item();
                    item1 = new Item();

                    list = new LinkedList();

                    list.append(item);
                    list.append(item1);
                    item.detach();

                    assert(item.next === null);
                }
            );
        });
    });
});
