// generics.ts — examples of Generics & Constraints in TypeScript

// 1) Basic generic function
function identity<T>(value: T): T {
  return value;
}

const num = identity<number>(42);
const str = identity('hello'); // type inferred as string

// 2) Generic with constraint using an interface
interface HasLength {
  length: number;
}

function ensureHasLength<T extends HasLength>(arg: T): T {
  if (arg.length === 0) throw new Error('Empty');
  return arg;
}

ensureHasLength([1, 2, 3]);
ensureHasLength('abc');
// ensureHasLength(123); // Error: number has no "length"

// 3) Generic function with `keyof` constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: 'Alice', active: true };
const userName = getProperty(user, 'name'); // type is string
// getProperty(user, 'missing'); // Error: 'missing' not in keys of user

// 4) Generic class
class Stack<T> {
  private items: T[] = [];
  push(item: T) { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
}

const numberStack = new Stack<number>();
numberStack.push(10);
numberStack.push(20);
console.log(numberStack.pop()); // 20

// 5) Generic with default type and constraints
type ApiResponse<T = unknown> = {
  data: T;
  status: number;
};

const r1: ApiResponse<string> = { data: 'ok', status: 200 };
const r2: ApiResponse = { data: { some: 'thing' }, status: 200 };

// 6) Generic utility: merge two objects into an intersection type
function merge<T, U>(a: T, b: U): T & U {
  return Object.assign({}, a, b) as T & U;
}

const merged = merge({ id: 1 }, { name: 'Bob' });
// merged has type { id: number } & { name: string }

// 7) Constraining generics to unions / literal types
type Allowed = string | number;
function toStringValue<T extends Allowed>(v: T): string {
  return String(v);
}

toStringValue('x');
toStringValue(5);
// toStringValue(true); // Error: boolean not assignable

// 8) Generic mapped type example (simple)
type ReadonlyProps<T> = { readonly [K in keyof T]: T[K] };

type UserReadonly = ReadonlyProps<{ id: number; name: string }>;
const u: UserReadonly = { id: 1, name: 'Eve' };
// u.id = 2; // Error: cannot assign to readonly property

// 9) Useful patterns recap (short):
// - Use `T extends ...` to constrain generics
// - Use `K extends keyof T` to index into generic types safely
// - Use mapped types ` {[K in keyof T]: ...}` to transform shapes
// - Provide defaults `T = DefaultType` for convenience

// 10) Quick usage examples for learners
type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function wrap<T>(v: T): Result<T> { return { ok: true, value: v }; }

console.log(wrap(123));
console.log(getProperty({ a: 1, b: 2 }, 'b'));

// =====================================================
// Using `typeof` (type query) and runtime `typeof` checks
// =====================================================

// Runtime `typeof` (JavaScript) — narrow at runtime
const maybe = Math.random() > 0.5 ? 'hello' : 42;
if (typeof maybe === 'string') {
  console.log('runtime string length:', maybe.length);
} else {
  console.log('runtime number value:', maybe.toFixed(2));
}

// TypeScript `typeof` (type query) — captures the type of a value
const settings = {
  host: 'localhost',
  port: 8080,
} as const;

type Settings = typeof settings; // { readonly host: 'localhost'; readonly port: 8080 }
type SettingKeys = keyof typeof settings; // 'host' | 'port'

function connect(cfg: Settings) {
  console.log('connecting to', cfg.host, cfg.port);
}

connect(settings);

// `typeof` with arrays + `as const` to get literal unions
const roles = ['admin', 'user'] as const;
type Role = typeof roles[number]; // 'admin' | 'user'

// `typeof` with classes — get constructor type and instance type
class Person {
  constructor(public name: string) {}
}

type PersonCtor = typeof Person; // constructor function type
type PersonInstance = InstanceType<typeof Person>; // Person

const person: PersonInstance = new Person('Zoe');
console.log('person:', person.name);

// =====================================================
// Constraints & Multiple Generics — added examples
// =====================================================

// 1) Multiple generic parameters (simple swap)
function swap<T, U>(a: T, b: U): [U, T] {
  return [b, a];
}

const swapped = swap(1, 'one'); // type: [string, number]

// 2) Multiple generics with constraints — merge for objects only
function mergeObjects<T extends object, U extends object>(a: T, b: U): T & U {
  return Object.assign({}, a, b) as T & U;
}

const o = mergeObjects({ id: 1 }, { name: 'Zoe' });

// 3) Generic where a parameter depends on another generic
function pluckKeys<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
  return keys.map(k => obj[k]);
}

const people = { alice: 30, bob: 25 };
const ages = pluckKeys(people, ['alice']); // number[]

// 4) Generic class with two type parameters and constraints
interface HasId<ID = number> { id: ID }

class Repository<T extends HasId<ID>, ID extends string | number = number> {
  private store = new Map<ID, T>();
  save(item: T) { this.store.set(item.id as ID, item); }
  get(id: ID): T | undefined { return this.store.get(id); }
}

type UserWithId = { id: string; name: string };
const repo = new Repository<UserWithId, string>();
repo.save({ id: 'u1', name: 'Nia' });

// 5) Multiple generics with defaults and constraints
function mapArray<T, U = T>(arr: T[], fn: (v: T) => U): U[] {
  return arr.map(fn);
}

const numbersAsStrings = mapArray([1, 2, 3], n => String(n)); // string[]

// 6) Constraining generics to unions or literal types
type AllowedKeys = 'id' | 'name';
function pick<T, K extends AllowedKeys & keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const picked = pick({ id: 1, name: 'Sam' }, 'name');

// Short recap:
// - Use multiple generics when types interact but differ (T, U, ID...)
// - Constrain with `extends` to restrict acceptable types
// - Use `K extends keyof T` when a generic depends on keys of another generic

// =====================================================
// Additional Generic Class Patterns
// =====================================================

// 1) Generic singly-linked list (enhanced)
class LinkedListNode<T> {
  constructor(public value: T, public next?: LinkedListNode<T>) {}
}

class LinkedList<T> implements Iterable<T> {
  private head?: LinkedListNode<T>;
  private _size = 0;

  static fromArray<T>(arr: T[]): LinkedList<T> {
    const l = new LinkedList<T>();
    for (const v of arr) l.add(v);
    return l;
  }

  add(value: T) {
    const node = new LinkedListNode(value);
    if (!this.head) this.head = node;
    else {
      let cur = this.head;
      while (cur.next) cur = cur.next;
      cur.next = node;
    }
    this._size++;
  }

  insertAt(index: number, value: T) {
    if (index < 0 || index > this._size) throw new RangeError('index out of bounds');
    const node = new LinkedListNode(value);
    if (index === 0) {
      node.next = this.head;
      this.head = node;
    } else {
      let cur = this.head!;
      for (let i = 0; i < index - 1; i++) cur = cur.next!;
      node.next = cur.next;
      cur.next = node;
    }
    this._size++;
  }

  removeAt(index: number): T | undefined {
    if (index < 0 || index >= this._size) return undefined;
    let removed: LinkedListNode<T> | undefined;
    if (index === 0) {
      removed = this.head;
      this.head = this.head?.next;
    } else {
      let cur = this.head!;
      for (let i = 0; i < index - 1; i++) cur = cur.next!;
      removed = cur.next;
      cur.next = cur.next?.next;
    }
    if (removed) this._size--;
    return removed?.value;
  }

  find(predicate: (v: T) => boolean): T | undefined {
    let cur = this.head;
    while (cur) {
      if (predicate(cur.value)) return cur.value;
      cur = cur.next;
    }
    return undefined;
  }

  toArray(): T[] {
    const out: T[] = [];
    let cur = this.head;
    while (cur) {
      out.push(cur.value);
      cur = cur.next;
    }
    return out;
  }

  size() {
    return this._size;
  }

  clear() {
    this.head = undefined;
    this._size = 0;
  }

  forEach(fn: (v: T, idx: number) => void) {
    let cur = this.head;
    let i = 0;
    while (cur) {
      fn(cur.value, i++);
      cur = cur.next;
    }
  }

  [Symbol.iterator](): Iterator<T> {
    let cur = this.head;
    return {
      next(): IteratorResult<T> {
        if (!cur) return { done: true, value: undefined as any };
        const v = cur.value;
        cur = cur.next;
        return { done: false, value: v };
      },
    };
  }
}

// Usage examples for `LinkedList`
const ll = LinkedList.fromArray([1, 2, 3]);
ll.add(4);
ll.insertAt(2, 99);
console.log('LinkedList toArray:', ll.toArray());
console.log('size:', ll.size());
console.log('find > 50:', ll.find(v => v > 50));
console.log('removeAt(2):', ll.removeAt(2));
for (const v of ll) console.log('iter:', v);

// 2) Typed event emitter using a generic map of event signatures
class TypedEventEmitter<Events extends Record<string, (...args: any[]) => void>> {
  private listeners = new Map<keyof Events, Set<Function>>();

  on<K extends keyof Events>(event: K, cb: Events[K]) {
    const set = this.listeners.get(event) ?? new Set<Function>();
    set.add(cb as Function);
    this.listeners.set(event, set);
  }

  off<K extends keyof Events>(event: K, cb: Events[K]) {
    const set = this.listeners.get(event);
    set?.delete(cb as Function);
  }

  emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>) {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const cb of set) {
      (cb as Function)(...args);
    }
  }
}

type MyEvents = {
  data: (msg: string) => void;
  error: (err: Error) => void;
};

const emitter = new TypedEventEmitter<MyEvents>();
emitter.on('data', msg => console.log('event data:', msg));
emitter.emit('data', 'hello events');

// 3) Simple generic Pair class with swap
class Pair<T, U> {
  constructor(public first: T, public second: U) {}
  swap(): Pair<U, T> {
    return new Pair(this.second, this.first);
  }
}

const p = new Pair(1, 'one');
const swappedPair = p.swap();
console.log('Pair swapped:', swappedPair.first, swappedPair.second);

export {};
