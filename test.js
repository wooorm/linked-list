
var List = require('./'),
    Item = List.Item,
    assert = require('assert');

assert.isArray = function (result) {
    return assert(Object.prototype.toString.call(result) === '[object Array]');
};

describe('List [List]', function () {
    
    describe('@constructor', function () {
        it('should have an `Item` method', function () {
            assert(typeof List.Item === 'function');
        });
        
        it('should have an `of` method', function () {
            assert(typeof List.of === 'function');
        });
        
        it('should have a `from` method', function () {
            assert(typeof List.from === 'function');
        });
        
        describe('of [List.of]', function () {
            
            var C = function () {};
            C.prototype.append = List.prototype.append;
            C.of = List.of;
            
            it('should return an instance of self when *no* arguments are given', function () {
                assert((List.of()) instanceof List);
            });
            
            it('should ignore `null` or `undefined` values', function () {
                assert(!List.of(null).hasOwnProperty('head'));
                assert(!List.of(undefined).hasOwnProperty('head'));
            });
            
            it('should return an instance of self when arguments are given', function () {
                assert((List.of(new Item())) instanceof List);
                assert((C.of(new Item())) instanceof C);
            });
            
            it('should throw an error when an invalid item is given', function () {
                assert.throws(function () { List.of({}); });
            });
            
            it('should add ("append") items in the order they were given', function () {
                var item = new Item(),
                    item_ = new Item(),
                    item__ = new Item(),
                    list = List.of(item, item_, item__);
                
                assert(list.head === item);
                assert(list.head.next === item_);
                assert(list.head.next.next === item__);
                
                assert(list.tail === item__);
                assert(list.tail.prev === item_);
                assert(list.tail.prev.prev === item);
            });
        });
        
        describe('from [List.from]', function () {
            
            var C = function () {};
            C.prototype.append = List.prototype.append;
            C.from = List.from;
            
            it('should return an instance of self when *no* arguments are given', function () {
                assert((List.from()) instanceof List);
                assert((C.from()) instanceof C);
            });
            
            it('should ignore `null` or `undefined` values', function () {
                assert(!List.from([null]).hasOwnProperty('head'));
                assert(!List.from([undefined]).hasOwnProperty('head'));
            });
            
            it('should return an instance of self when items are given', function () {
                assert((List.from([new Item()])) instanceof List);
                assert((C.from([new Item()])) instanceof C);
            });
            
            it('should throw an error when an invalid item is given', function () {
                assert.throws(function () { List.from([{}]); });
            });
            
            it('should add ("append") items in the order they were given', function () {
                var item = new Item(),
                    item_ = new Item(),
                    item__ = new Item(),
                    list = List.from([item, item_, item__]);
                
                assert(list.head === item);
                assert(list.head.next === item_);
                assert(list.head.next.next === item__);
                
                assert(list.tail === item__);
                assert(list.tail.prev === item_);
                assert(list.tail.prev.prev === item);
            });
        });
        
    });
    
    describe('@instance', function () {
        it('should have a `head` property set to `null`', function () {
            assert((new List()).head === null);
        });
        
        it('should have a `tail` property set to `null`', function () {
            assert((new List()).tail === null);
        });
        
        it('should have a `prepend` method', function () {
            assert(typeof (new List()).prepend === 'function');
        });
        
        it('should have an `append` method', function () {
            assert(typeof (new List()).append === 'function');
        });
        
        it('should have an `toArray` method', function () {
            assert(typeof (new List()).toArray === 'function');
        });
        
        describe('prepend [List#prepend]', function () {
            
            it('should return false when no item is given', function () {
                assert(false === (new List()).prepend());
            });
            
            it('should return the given item', function () {
                var item = new Item();
                
                assert(item === (new List()).prepend(item));
            });
            
            it('should throw an error when an invalid item is given', function () {
                var list = new List();
                
                assert.throws(function () {
                    list.prepend({});
                });
            });
            
            it('should set `@head` to the first prependee', function () {
                var list = new List(),
                    item = new Item();
                
                list.prepend(item);
                
                assert(list.head === item);
            });
            
            it('shouldn\'t set `@tail` to the first prependee', function () {
                var list = new List(),
                    item = new Item();
                
                list.prepend(item);
                
                assert(list.tail !== item);
            });
            
            it('should set `@head` to further prependees', function () {
                var list = new List(),
                    item = new Item(),
                    item_ = new Item();
                
                list.prepend(new Item());
                
                list.prepend(item);
                assert(list.head === item);
                
                list.prepend(item_);
                assert(list.head === item_);
            });
            
            it('should set `@tail` to the first prependee when further items are prepended', function () {
                var list = new List(),
                    item = new Item();
                
                list.prepend(item);
                list.prepend(new Item());
                
                assert(list.tail === item);
            });
            
            it('shouldn\'t set `@tail` to further prependees', function () {
                var list = new List(),
                    item = new Item(),
                    item_ = new Item();
                
                list.prepend(new Item());
                
                list.prepend(item);
                assert(list.tail !== item);
                
                list.prepend(item_);
                assert(list.tail !== item_);
            });
            
            it('should detach the previous parent list of a prependee', function () {
                var list = new List(),
                    list_ = new List(),
                    item = new Item();
                
                list.prepend(item);
                list_.prepend(item);
                
                assert(list.head !== item);
            });
            
            it('should attach a prependee to a new list', function () {
                var list = new List(),
                    list_ = new List(),
                    item = new Item();
                
                list.prepend(item);
                list_.prepend(item);
                
                assert(list_.head === item);
            });
        });
        
        describe('append [List#append]', function () {
            
            it('should return false when no item is given', function () {
                assert(false === (new List()).append());
            });
            
            it('should return the given item', function () {
                var item = new Item();
                
                assert(item === (new List()).append(item));
            });
            
            it('should throw an error when an invalid item is given', function () {
                var list = new List();
                
                assert.throws(function () {
                    list.append({});
                });
            });
            
            it('should set `@head` to the first appendee', function () {
                var list = new List(),
                    item = new Item();
                
                list.append(item);
                
                assert(list.head === item);
            });
            
            it('shouldn\'t set `@tail` to the first appendee', function () {
                var list = new List(),
                    item = new Item();
                
                list.append(item);
                
                assert(list.tail !== item);
            });
            
            it('should set `@tail` to further appendees', function () {
                var list = new List(),
                    item = new Item(),
                    item_ = new Item();
                
                list.append(new Item());
                
                list.append(item);
                assert(list.tail === item);
                
                list.append(item_);
                assert(list.tail === item_);
            });
            
            it('shouldn\'t set `@head` to further appendees', function () {
                var list = new List(),
                    item = new Item(),
                    item_ = new Item();
                
                list.append(new Item());
                
                list.append(item);
                assert(list.head !== item);
                
                list.append(item_);
                assert(list.head !== item_);
            });
            
            it('should detach the previous parent list of an appendee', function () {
                var list = new List(),
                    list_ = new List(),
                    item = new Item();
                
                list.append(item);
                list_.append(item);
                
                assert(list.head !== item);
            });
            
            it('should attach an appendee to a new list', function () {
                var list = new List(),
                    list_ = new List(),
                    item = new Item();
                
                list.append(item);
                list_.append(item);
                
                assert(list_.head === item);
            });
        });
        
        describe('toArray [List#toArray]', function () {
            
            it('should return an array, even when the operated on list has no items', function () {
                assert.isArray((new List()).toArray());
            });
            
            it('should return an array', function () {
                assert.isArray((new List(new Item())).toArray());
            });
            
            it('should return an array sorted in the order of the items', function () {
                var item = new Item(),
                    item_ = new Item(),
                    item__ = new Item(),
                    array = (new List(item, item_, item__)).toArray();
                
                assert(array[0] === item);
                assert(array[1] === item_);
                assert(array[2] === item__);
            });
            
            it('shouldn\'t detach the returned items', function () {
                var item = new Item(),
                    item_ = new Item(),
                    item__ = new Item(),
                    list = new List(item, item_, item__),
                    array = list.toArray();
                
                assert(array[0].next === item_);
                assert(array[1].next === item__);
                
                assert(array[1].prev === item);
                assert(array[2].prev === item_);
                
                assert(array[0].list === list);
                assert(array[1].list === list);
                assert(array[2].list === list);
                
                assert(list.head === item);
                assert(list.tail === item__);
            });
        });
        
    });
});

describe('Item [List.Item]', function () {
    
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
        
        describe('prepend [List.Item#prepend]', function () {
            
            it('should throw an error when an invalid item is given', function () {
                var item = new Item(),
                    list = new List(item);
                
                assert.throws(function () {
                    item.prepend(null);
                });
                
                assert.throws(function () {
                    item.prepend({});
                });
            });
            
            it('should return false when the operated on instance is not attached', function () {
                var item = new Item(),
                    item_ = new Item();
                
                assert(false === item.prepend(item_));
            });
            
            it('should return the given item when the operated on instance is attached', function () {
                var item = new Item(),
                    item_ = new Item();
                
                (new List()).append(item);
                
                assert(item_ === item.prepend(item_));
            });
            
            it('should detach the previous parent list of a given item', function () {
                var list = new List(),
                    list_ = new List(),
                    item = new Item(),
                    item_ = new Item();
                
                list.append(item);
                list_.append(item_);
                
                item.prepend(item_);
                assert(item_.list !== list_);
            });
            
            it('should attach the given item to the operated on item\'s list', function () {
                var list = new List(),
                    list_ = new List(),
                    item = new Item(),
                    item_ = new Item();
                
                list.append(item);
                list_.append(item_);
                
                item.prepend(item_);
                assert(item_.list === list);
            });
            
            it('should set the given item as the parent list\'s `head` when the operated on item is the current `head`', function () {
                var list = new List(),
                    item = new Item(),
                    item_ = new Item();
                
                list.append(item);
                
                item.prepend(item_);
                assert(item_ === list.head);
            });
            
            it('should set the operated on item as the parent list\'s `tail` when the operated on item is the current `head`', function () {
                var list = new List(),
                    item = new Item(),
                    item_ = new Item();
                
                list.append(item);
                
                item.prepend(item_);
                assert(item === list.tail);
            });
            
            it('should set the operated on item\'s `prev` property to the given item', function () {
                var list = new List(),
                    item = new Item(),
                    item_ = new Item();
                
                list.append(item);
                item.prepend(item_);
                
                assert(item.prev === item_);
            });
            
            it('should set the given item\'s `next` property to the operated on item', function () {
                var list = new List(),
                    item = new Item(),
                    item_ = new Item();
                
                list.append(item);
                item.prepend(item_);
                
                assert(item_.next === item);
            });
        });
        
        describe('append [List.Item#append]', function () {
            
            it('should throw an error when an invalid item is given', function () {
                var item = new Item(),
                    list = new List(item);
                
                assert.throws(function () {
                    item.append(null);
                });
                
                assert.throws(function () {
                    item.append({});
                });
            });
            
            it('should return false when the operated on instance is not attached', function () {
                var item = new Item(),
                    item_ = new Item();
                
                assert(false === item.append(item_));
            });
            
            it('should return the given item when the operated on instance is attached', function () {
                var item = new Item(),
                    item_ = new Item();
                
                (new List()).append(item);
                
                assert(item_ === item.append(item_));
            });
            
            it('should detach the previous parent list of a given item', function () {
                var list = new List(),
                    list_ = new List(),
                    item = new Item(),
                    item_ = new Item();
                
                list.append(item);
                list_.append(item_);
                
                item.append(item_);
                assert(item_.list !== list_);
            });
            
            it('should attach the given item to the operated on item\'s list', function () {
                var list = new List(),
                    list_ = new List(),
                    item = new Item(),
                    item_ = new Item();
                
                list.append(item);
                list_.append(item_);
                
                item.append(item_);
                assert(item_.list === list);
            });
            
            it('should set the given item as the parent list\'s `tail`', function () {
                var list = new List(),
                    item = new Item(),
                    item_ = new Item();
                
                list.append(new Item());
                list.append(item);
                
                item.append(item_);
                assert(item_ === list.tail);
            });
            
            it('should set the given item as the parent list\'s `tail` when the operated on item is the current `head`', function () {
                var list = new List(),
                    item = new Item(),
                    item_ = new Item();
                
                list.append(item);
                
                item.append(item_);
                assert(item_ === list.tail);
            });
            
            it('should set the operated on item\'s `next` property to the given item', function () {
                var list = new List(),
                    item = new Item(),
                    item_ = new Item();
                
                list.append(item);
                item.append(item_);
                
                assert(item.next === item_);
            });
            
            it('should set the given item\'s `prev` property to the operated on item', function () {
                var list = new List(),
                    item = new Item(),
                    item_ = new Item();
                
                list.append(item);
                item.append(item_);
                
                assert(item_.prev === item);
            });
            
        });
        
        describe('detach [List.Item#detach]', function () {
            
            it('should return self', function () {
                var list = new List(),
                    item = new Item();
                
                list.append(item);
                
                assert(item === item.detach());
            });
            
            it('should return self, even when the item is not attached', function () {
                var item = new Item();
                assert(item === item.detach());
            });
            
            it('should set the item\'s `next` property to the parent list\'s `head` when the item is its current `head`', function () {
                var list = new List(),
                    item = new Item(),
                    item_ = new Item();
                
                list.append(item);
                list.append(item_);
                
                item.detach();
                
                assert(item_ === list.head);
            });
            
            it('should set the item\'s `prev` property to the parent list\'s `tail` when the item is its current `tail`', function () {
                var list = new List(),
                    item = new Item(),
                    item_ = new Item(),
                    item__ = new Item();
                
                list.append(item);
                list.append(item_);
                list.append(item__);
                
                item__.detach();
                
                assert(item_ === list.tail);
            });
            
            it('should set the parent list\'s `tail` to `null` when the item is its current `tail` and its `prev` property is the current `tail`', function () {
                var list = new List(),
                    item = new Item(),
                    item_ = new Item();
                
                list.append(item);
                list.append(item_);
                
                item_.detach();
                
                assert(null === list.tail);
            });
            
            it('should set the previous item\'s `next` property to the current item\'s `next` property', function () {
                var list = new List(),
                    item = new Item(),
                    item_ = new Item(),
                    item__ = new Item();
                
                list.append(item);
                list.append(item_);
                list.append(item__);
                
                item_.detach();
                
                assert(item.next === item__);
            });
            
            it('should set the next item\'s `prev` property to the current item\'s `prev` property', function () {
                var list = new List(),
                    item = new Item(),
                    item_ = new Item(),
                    item__ = new Item();
                
                list.append(item);
                list.append(item_);
                list.append(item__);
                
                item_.detach();
                
                assert(item__.prev === item);
            });
            
            it('should set the item\'s `list` property to `null`', function () {
                var list = new List(),
                    item = new Item();
                
                list.append(item);
                item.detach();
                
                assert(null === item.list);
            });
            
            it('should set the item\'s `prev` property to `null`', function () {
                var list = new List(),
                    item = new Item(),
                    item_ = new Item();
                
                list.append(item_);
                list.append(item);
                item.detach();
                
                assert(null === item.prev);
            });
            
            it('should set the item\'s `next` property to `null`', function () {
                var list = new List(),
                    item = new Item(),
                    item_ = new Item();
                
                list.append(item);
                list.append(item_);
                item.detach();
                
                assert(null === item.next);
            });
            
        });
        
    });
});
