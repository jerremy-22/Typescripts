/**
 * Conditional Types in TypeScript
 * Conditional types allow you to select one of two possible types based on a condition,
 * similar to a ternary operator but for types. Syntax: T extends U ? X : Y
 */

// ===== BASIC CONDITIONAL TYPES =====

// Example 1: Simple type checking
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">;
// Result: true

type B = IsString<number>;
// Result: false

// Example 2: Type extraction based on condition
type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>;
// Result: string

type Num = Flatten<number>;
// Result: number

// Example 3: Function type checking
type IsFunction<T> = T extends (...args: any[]) => any ? true : false;

type FuncCheck = IsFunction<(x: number) => string>;
// Result: true

type NotFunc = IsFunction<string>;
// Result: false

// ===== INFERRING TYPES =====

// Example 4: Extract function return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type FunctionReturn = ReturnType<(x: number) => string>;
// Result: string

type NotAFunction = ReturnType<string>;
// Result: never

// Example 5: Extract function parameter types
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

type FuncParams = Parameters<(name: string, age: number) => void>;
// Result: [name: string, age: number]

// Example 6: Extract array element type
type ArrayElement<T> = T extends (infer E)[] ? E : T;

type Element = ArrayElement<string[]>;
// Result: string

type NotArray = ArrayElement<"not an array">;
// Result: "not an array"

// Example 7: Extract promise resolution type
type Awaited<T> = T extends Promise<infer U> ? U : T;

type ResolvedValue = Awaited<Promise<string>>;
// Result: string

type NotPromise = Awaited<string>;
// Result: string

// ===== DISTRIBUTIVE CONDITIONAL TYPES =====

// Conditional types are distributive over unions
// When T is a union, the conditional is applied to each member

// Example 8: Union distribution
type ToArray<T> = T extends any ? T[] : never;

type StrOrNum = ToArray<string | number>;
// Result: string[] | number[]
// Equivalent to: (string extends any ? string[] : never) | (number extends any ? number[] : never)

// Example 9: Filter union types
type Flatten2<T> = T extends Array<infer U> ? U : T;

type Mixed = Flatten2<string | string[] | number[]>;
// Result: string | string | number
// Each member is processed individually

// Example 10: Remove null and undefined from union
type NonNullable<T> = T extends null | undefined ? never : T;

type MaybeString = NonNullable<string | null | undefined>;
// Result: string

// Example 11: Extract function types from union
type FunctionTypes<T> = T extends (...args: any[]) => any ? T : never;

type Mixed2 = FunctionTypes<string | ((x: number) => void) | number>;
// Result: (x: number) => void

// ===== NESTED CONDITIONAL TYPES =====

// Example 12: Chained conditions
type TypeName<T> = 
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends undefined ? "undefined" :
  T extends Function ? "function" :
  "object";

type T1 = TypeName<string>;
// Result: "string"

type T2 = TypeName<string | number>;
// Result: "string" | "number" (distributive)

type T3 = TypeName<{ name: string }>;
// Result: "object"

// Example 13: Deep type inspection
type IsAny<T> = 0 extends (1 & T) ? true : false;

type CheckAny = IsAny<any>;
// Result: true

type CheckString = IsAny<string>;
// Result: false

// Example 14: Check if type is never
type IsNever<T> = [T] extends [never] ? true : false;

type CheckNever = IsNever<never>;
// Result: true

type CheckOther = IsNever<string>;
// Result: false

// ===== PRACTICAL EXAMPLES =====

// Example 15: Extract keys of specific type
interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

type StringPropertiesOf<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type UserStringKeys = StringPropertiesOf<User>;
// Result: "name" | "email"

// Example 16: Extract getter methods
type GettersOf<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

interface Repository {
  id: number;
  getName(): string;
  getEmail(): string;
}

type RepositoryGetters = GettersOf<Repository>;
// Result: "getName" | "getEmail"

// Example 17: Determine if type is readonly
type IsReadonly<T, K extends keyof T> = 
  (<(p: { [Q in K]: T[Q] }) => void) extends 
  (<(p: T) => void) ? false : true;

// Example 18: Pick properties of specific type
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

type UserNumbers = PickByType<User, number>;
// Result: { id: number }

type UserStrings = PickByType<User, string>;
// Result: { name: string; email: string }

// Example 19: Deep readonly check
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object 
    ? DeepReadonly<T[K]> 
    : T[K];
};

interface Address {
  street: string;
  city: string;
}

interface UserWithAddress {
  name: string;
  address: Address;
}

type ReadonlyUser = DeepReadonly<UserWithAddress>;
// Recursively makes all properties readonly

// Example 20: Function overload resolution
type UnionToIntersection<U> = 
  (U extends any ? (k: U) => void : never) extends 
  ((k: infer I) => void) ? I : never;

type FuncsUnion = ((x: number) => void) | ((x: string) => void);
type FuncsIntersection = UnionToIntersection<FuncsUnion>;
// Result: ((x: number) => void) & ((x: string) => void)

// ===== API RESPONSE HANDLING =====

// Example 21: Extract success/error types
type ApiResponse<T> = 
  | { status: "success"; data: T }
  | { status: "error"; error: string };

type SuccessType<T> = T extends ApiResponse<infer U> 
  ? U 
  : never;

type UserResponse = ApiResponse<User>;
type ExtractedUser = SuccessType<UserResponse>;
// Result: User

// Example 22: Promise handling
type UnwrapPromise<T> = T extends Promise<infer U>
  ? UnwrapPromise<U>
  : T;

type DoubleWrapped = UnwrapPromise<Promise<Promise<string>>>;
// Result: string

// Example 23: Recursive array flattening
type Flatten3<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First extends any[]
    ? [...Flatten3<First>, ...Flatten3<Rest>]
    : [First, ...Flatten3<Rest>]
  : T;

type Nested = Flatten3<[1, [2, 3], [4, [5, 6]]]>;
// Result: [1, 2, 3, 4, 5, 6]

// ===== OBJECT MANIPULATION =====

// Example 24: Make properties optional conditionally
type OptionalIfEmpty<T> = [keyof T] extends [never]
  ? undefined
  : T;

type Empty = OptionalIfEmpty<{}>;
// Result: undefined

type NonEmpty = OptionalIfEmpty<{ name: string }>;
// Result: { name: string }

// Example 25: Exclude properties by type
type ExcludeByType<T, ExcludeType> = {
  [K in keyof T as T[K] extends ExcludeType ? never : K]: T[K];
};

type UserWithoutNumbers = ExcludeByType<User, number>;
// Result: { name: string; email: string; active: boolean }

// Example 26: Create opposite types
type Opposite<T extends "yes" | "no"> = T extends "yes" ? "no" : "yes";

type YesOpposite = Opposite<"yes">;
// Result: "no"

// ===== STATE MACHINE PATTERNS =====

// Example 27: State transition validation
type ValidTransitions = {
  idle: "loading" | "error";
  loading: "success" | "error";
  success: "idle";
  error: "idle" | "loading";
};

type CanTransition<From extends keyof ValidTransitions, To extends string> =
  To extends ValidTransitions[From] ? true : false;

type IdleToLoading = CanTransition<"idle", "loading">;
// Result: true

type IdleToSuccess = CanTransition<"idle", "success">;
// Result: false

// Example 28: Action handler resolution
type Action = 
  | { type: "FETCH"; payload: string }
  | { type: "SAVE"; payload: User }
  | { type: "DELETE"; payload: number };

type ActionPayload<T extends Action> = T extends { type: infer Type; payload: infer P }
  ? Type extends "FETCH" ? string
  : Type extends "SAVE" ? User
  : Type extends "DELETE" ? number
  : never
  : never;

type FetchPayload = ActionPayload<{ type: "FETCH"; payload: "test" }>;
// Result: string

// ===== TYPE GUARDS =====

// Example 29: Narrow with conditional type
type IsNullable<T> = T extends null | undefined ? true : false;

type MaybeString = string | null;
type IsNullableCheck = IsNullable<MaybeString>;
// Result: boolean (true | false in union)

// Example 30: Extract union members
type UnionMember<T> = T extends any ? T : never;

type Members = UnionMember<"a" | "b" | "c">;
// Result: "a" | "b" | "c"

// Example 31: Check if type is union
type IsUnion<T> = [T] extends [infer U]
  ? [U] extends [T]
    ? false
    : true
  : false;

type StringOrNumber = IsUnion<string | number>;
// Result: true

type JustString = IsUnion<string>;
// Result: false

// ===== ADVANCED PATTERNS =====

// Example 32: Recursive type traversal
type JsonValue = 
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type IsValidJson<T> = T extends JsonValue ? true : false;

type ValidJson = IsValidJson<{ name: string; age: number; active: boolean }>;
// Result: true

// Example 33: Convert object to getters
type ObjectToGetters<T extends Record<string, any>> = {
  [K in keyof T]: () => T[K];
};

type UserGetters = ObjectToGetters<User>;
// Result: { id: () => number; name: () => string; email: () => string; active: () => boolean }

// Example 34: Tuple length checking
type Length<T extends any[]> = T["length"];

type MyTuple = [1, 2, 3, 4, 5];
type TupleLength = Length<MyTuple>;
// Result: 5

// Example 35: Conditional type with mapped types
type ReadonlyRecords<T extends Record<string, any>> = {
  readonly [K in keyof T]: T[K] extends Record<string, any>
    ? ReadonlyRecords<T[K]>
    : T[K];
};

type ReadonlyUser = ReadonlyRecords<User>;
// All properties become readonly recursively

// ===== KEY CONCEPTS =====

/*
 * 1. Basic Syntax: T extends U ? X : Y
 *    - If T is assignable to U, type is X
 *    - Otherwise, type is Y
 *
 * 2. Distributive Conditional Types:
 *    - Applied automatically to union types
 *    - (A | B) extends U ? X : Y evaluates to (A extends U ? X : Y) | (B extends U ? X : Y)
 *    - Wrap in arrays to prevent distribution: [T] extends [U]
 *
 * 3. Type Inference with infer keyword:
 *    - Extract types from complex structures
 *    - T extends (infer U)[] ? U : T extracts array element type
 *    - Can be used multiple times in one conditional
 *
 * 4. Common Use Cases:
 *    - Type narrowing and refinement
 *    - Extracting types from complex structures
 *    - Validating type relationships
 *    - Building type-safe APIs
 *    - Creating type predicates
 *
 * 5. Performance Considerations:
 *    - Deeply nested conditionals can impact type checking
 *    - Avoid circular type dependencies
 *    - Use conditional types judiciously
 *
 * 6. Best Practices:
 *    - Keep conditional types readable
 *    - Document complex conditions
 *    - Use infer for flexible extraction
 *    - Test with various type inputs
 *    - Combine with mapped types for powerful transformations
 */
