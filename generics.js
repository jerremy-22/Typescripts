// generics.ts — examples of Generics & Constraints in TypeScript
// 1) Basic generic function
function identity(value) {
    return value;
}
const num = identity(42);
const str = identity('hello'); // type inferred as string
function ensureHasLength(arg) {
    if (arg.length === 0)
        throw new Error('Empty');
    return arg;
}
ensureHasLength([1, 2, 3]);
ensureHasLength('abc');
// ensureHasLength(123); // Error: number has no "length"
// 3) Generic function with `keyof` constraint
function getProperty(obj, key) {
    return obj[key];
}
const user = { id: 1, name: 'Alice', active: true };
const userName = getProperty(user, 'name'); // type is string
// getProperty(user, 'missing'); // Error: 'missing' not in keys of user
// 4) Generic class
class Stack {
    constructor() {
        this.items = [];
    }
    push(item) { this.items.push(item); }
    pop() { return this.items.pop(); }
    peek() { return this.items[this.items.length - 1]; }
}
const numberStack = new Stack();
numberStack.push(10);
numberStack.push(20);
console.log(numberStack.pop()); // 20
const r1 = { data: 'ok', status: 200 };
const r2 = { data: { some: 'thing' }, status: 200 };
// 6) Generic utility: merge two objects into an intersection type
function merge(a, b) {
    return Object.assign({}, a, b);
}
const merged = merge({ id: 1 }, { name: 'Bob' });
function toStringValue(v) {
    return String(v);
}
toStringValue('x');
toStringValue(5);
const u = { id: 1, name: 'Eve' };
function wrap(v) { return { ok: true, value: v }; }
console.log(wrap(123));
console.log(getProperty({ a: 1, b: 2 }, 'b'));
// =====================================================
// Using `typeof` (type query) and runtime `typeof` checks
// =====================================================
// Runtime `typeof` (JavaScript) — narrow at runtime
const maybe = Math.random() > 0.5 ? 'hello' : 42;
if (typeof maybe === 'string') {
    console.log('runtime string length:', maybe.length);
}
else {
    console.log('runtime number value:', maybe.toFixed(2));
}
// TypeScript `typeof` (type query) — captures the type of a value
const settings = {
    host: 'localhost',
    port: 8080,
};
function connect(cfg) {
    console.log('connecting to', cfg.host, cfg.port);
}
connect(settings);
// `typeof` with arrays + `as const` to get literal unions
const roles = ['admin', 'user'];
// `typeof` with classes — get constructor type and instance type
class Person {
    constructor(name) {
        this.name = name;
    }
}
const person = new Person('Zoe');
console.log('person:', person.name);
// =====================================================
// Constraints & Multiple Generics — added examples
// =====================================================
// 1) Multiple generic parameters (simple swap)
function swap(a, b) {
    return [b, a];
}
const swapped = swap(1, 'one'); // type: [string, number]
// 2) Multiple generics with constraints — merge for objects only
function mergeObjects(a, b) {
    return Object.assign({}, a, b);
}
const o = mergeObjects({ id: 1 }, { name: 'Zoe' });
// 3) Generic where a parameter depends on another generic
function pluckKeys(obj, keys) {
    return keys.map(k => obj[k]);
}
const people = { alice: 30, bob: 25 };
const ages = pluckKeys(people, ['alice']); // number[]
class Repository {
    constructor() {
        this.store = new Map();
    }
    save(item) { this.store.set(item.id, item); }
    get(id) { return this.store.get(id); }
}
const repo = new Repository();
repo.save({ id: 'u1', name: 'Nia' });
// 5) Multiple generics with defaults and constraints
function mapArray(arr, fn) {
    return arr.map(fn);
}
const numbersAsStrings = mapArray([1, 2, 3], n => String(n)); // string[]
function pick(obj, key) {
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
class LinkedListNode {
    constructor(value, next) {
        this.value = value;
        this.next = next;
    }
}
class LinkedList {
    constructor() {
        this._size = 0;
    }
    static fromArray(arr) {
        const l = new LinkedList();
        for (const v of arr)
            l.add(v);
        return l;
    }
    add(value) {
        const node = new LinkedListNode(value);
        if (!this.head)
            this.head = node;
        else {
            let cur = this.head;
            while (cur.next)
                cur = cur.next;
            cur.next = node;
        }
        this._size++;
    }
    insertAt(index, value) {
        if (index < 0 || index > this._size)
            throw new RangeError('index out of bounds');
        const node = new LinkedListNode(value);
        if (index === 0) {
            node.next = this.head;
            this.head = node;
        }
        else {
            let cur = this.head;
            for (let i = 0; i < index - 1; i++)
                cur = cur.next;
            node.next = cur.next;
            cur.next = node;
        }
        this._size++;
    }
    removeAt(index) {
        var _a, _b;
        if (index < 0 || index >= this._size)
            return undefined;
        let removed;
        if (index === 0) {
            removed = this.head;
            this.head = (_a = this.head) === null || _a === void 0 ? void 0 : _a.next;
        }
        else {
            let cur = this.head;
            for (let i = 0; i < index - 1; i++)
                cur = cur.next;
            removed = cur.next;
            cur.next = (_b = cur.next) === null || _b === void 0 ? void 0 : _b.next;
        }
        if (removed)
            this._size--;
        return removed === null || removed === void 0 ? void 0 : removed.value;
    }
    find(predicate) {
        let cur = this.head;
        while (cur) {
            if (predicate(cur.value))
                return cur.value;
            cur = cur.next;
        }
        return undefined;
    }
    toArray() {
        const out = [];
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
    forEach(fn) {
        let cur = this.head;
        let i = 0;
        while (cur) {
            fn(cur.value, i++);
            cur = cur.next;
        }
    }
    [Symbol.iterator]() {
        let cur = this.head;
        return {
            next() {
                if (!cur)
                    return { done: true, value: undefined };
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
for (const v of ll)
    console.log('iter:', v);
// 2) Typed event emitter using a generic map of event signatures
class TypedEventEmitter {
    constructor() {
        this.listeners = new Map();
    }
    on(event, cb) {
        var _a;
        const set = (_a = this.listeners.get(event)) !== null && _a !== void 0 ? _a : new Set();
        set.add(cb);
        this.listeners.set(event, set);
    }
    off(event, cb) {
        const set = this.listeners.get(event);
        set === null || set === void 0 ? void 0 : set.delete(cb);
    }
    emit(event, ...args) {
        const set = this.listeners.get(event);
        if (!set)
            return;
        for (const cb of set) {
            cb(...args);
        }
    }
}
const emitter = new TypedEventEmitter();
emitter.on('data', msg => console.log('event data:', msg));
emitter.emit('data', 'hello events');
// 3) Simple generic Pair class with swap
class Pair {
    constructor(first, second) {
        this.first = first;
        this.second = second;
    }
    swap() {
        return new Pair(this.second, this.first);
    }
}
const p = new Pair(1, 'one');
const swappedPair = p.swap();
console.log('Pair swapped:', swappedPair.first, swappedPair.second);
export {};
