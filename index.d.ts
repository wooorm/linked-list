class List <T extends List.Item> {
  static of<T extends List.Item>(...items: T[]): List<T>
  static from<T extends List.Item>(items: T[]): List<T>

  head: T | null
  tail: T | null

  constructor(...items: T[])
  toArray(): T[]
  prepend<T>(item: T): T
  append<T>(item: T): T
}

namespace List {
  export class Item {
    prev: Item
    next: Item
    list: List

    detach(): this
    prepend<T extends Item>(item: T): T
    append<T extends Item>(item: T): T
  }
}

export = List
