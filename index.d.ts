export class List<T extends List.Item> implements Iterable<T> {
  static of<T extends List.Item>(...items: Array<T>): List<T>
  static from<T extends List.Item>(items: Iterable<T>): List<T>

  head: T | null
  tail: T | null
  size: number

  constructor(...items: Array<T>)
  toArray(): Array<T>
  prepend<T>(item: T): T
  append<T>(item: T): T
  [Symbol.iterator](): Iterator<T>
}

export class Item {
  prev: this
  next: this
  list: List<this>

  detach(): this
  prepend<T extends this>(item: T): T
  append<T extends this>(item: T): T
}
