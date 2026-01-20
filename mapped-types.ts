/**
 * Mapped Types in TypeScript
 * Mapped types allow you to create new types based on existing types
 * by transforming each property in a predictable way
 */

// ===== BASIC MAPPED TYPES =====

// Example 1: Make all properties optional
interface User {
  id: number;
  name: string;
  email: string;
}

type Optional<T> = {
  [K in keyof T]?: T[K];
};

type OptionalUser = Optional<User>;
// Result: { id?: number; name?: string; email?: string; }

// Example 2: Make all properties readonly
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type ReadonlyUser = Readonly<User>;
// Result: { readonly id: number; readonly name: string; readonly email: string; }

// Example 3: Create getters for all properties
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// Result: { getId: () => number; getName: () => string; getEmail: () => string; }

// ===== UTILITY TYPES BUILT ON MAPPED TYPES =====

// Record: Create an object type with specific keys and value type
type Status = "pending" | "active" | "inactive";
type StatusConfig = Record<Status, string>;
// Result: { pending: string; active: string; inactive: string; }

// Pick: Select specific properties from a type
type UserPreview = Pick<User, "id" | "name">;
// Result: { id: number; name: string; }

// Omit: Exclude specific properties from a type
type UserWithoutEmail = Omit<User, "email">;
// Result: { id: number; name: string; }

// ===== CONDITIONAL MAPPED TYPES =====

// Example 4: Only include string properties
type StringProperties<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

type UserStrings = StringProperties<User>;
// Result: { name: string; email: string; }

// Example 5: Create setters only for non-readonly properties
interface ReadonlyConfig {
  readonly host: string;
  readonly port: number;
  timeout: number;
}

type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

type ConfigSetters = Setters<ReadonlyConfig>;
// Result: { setHost: (value: string) => void; setPort: (value: number) => void; setTimeout: (value: number) => void; }

// ===== KEY REMAPPING =====

// Example 6: Prefix all properties
type Prefixed<T, Prefix extends string> = {
  [K in keyof T as `${Prefix}${string & K}`]: T[K];
};

type PrefixedUser = Prefixed<User, "user_">;
// Result: { user_id: number; user_name: string; user_email: string; }

// Example 7: Create getter methods with "get" prefix
type ApiResponse<T> = {
  [K in keyof T as K extends string ? `get${Capitalize<K>}` : never]: () => T[K];
};

type UserApi = ApiResponse<User>;
// Result: { getId: () => number; getName: () => string; getEmail: () => string; }

// ===== PRACTICAL EXAMPLES =====

// Example 8: Make all properties nullable
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type NullableUser = Nullable<User>;
// Result: { id: number | null; name: string | null; email: string | null; }

// Example 9: Create validators object from type
interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

type Validators<T> = {
  [K in keyof T]: (value: T[K]) => boolean;
};

const productValidators: Validators<Product> = {
  id: (value) => value > 0,
  name: (value) => value.length > 0,
  price: (value) => value > 0,
  inStock: (value) => typeof value === "boolean",
};

// Example 10: Create a form state type
type FormState<T> = {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
};

type UserFormState = FormState<User>;
// Result: {
//   values: User;
//   errors: Partial<{ id?: string; name?: string; email?: string; }>;
//   touched: Partial<{ id?: boolean; name?: boolean; email?: boolean; }>;
// }

// ===== ADVANCED PATTERNS =====

// Example 11: Union type to property mapping
type EventHandlers<Events extends string> = {
  [E in Events as `on${Capitalize<E>}`]: (event: Event) => void;
};

type DialogHandlers = EventHandlers<"open" | "close" | "submit">;
// Result: { onOpen: (event: Event) => void; onClose: (event: Event) => void; onSubmit: (event: Event) => void; }

// Example 12: Function type mapping
interface Functions {
  greet: (name: string) => string;
  add: (a: number, b: number) => number;
}

type AsyncFunctions<T extends Record<string, (...args: any[]) => any>> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => Promise<R>
    : never;
};

type AsyncFunctionsType = AsyncFunctions<Functions>;
// Result: {
//   greet: (name: string) => Promise<string>;
//   add: (a: number, b: number) => Promise<number>;
// }

// Example 13: Deep partial (nested optional)
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

interface Address {
  street: string;
  city: string;
  zipCode: string;
}

interface UserWithAddress {
  id: number;
  name: string;
  address: Address;
}

type PartialUserWithAddress = DeepPartial<UserWithAddress>;
// address and all its properties are optional

// ===== USAGE EXAMPLE =====

class UserRepository {
  create(data: Partial<User>): User {
    // Implementation
    return {} as User;
  }

  update(id: number, data: Partial<User>): User {
    // Implementation
    return {} as User;
  }

  makeReadonly(user: User): Readonly<User> {
    return Object.freeze(user);
  }
}

// ===== KEY CONCEPTS =====

/*
 * 1. Syntax: { [K in keyof T]: T[K] }
 *    - K: iterates over each key in T
 *    - keyof T: all keys of type T
 *    - T[K]: the type of property K
 *
 * 2. Key Remapping (TypeScript 4.4+): as NewKey
 *    - Allows transforming the property names
 *    - Can filter out properties with 'never'
 *
 * 3. Conditional Types: T[K] extends SomeType ? TypeA : TypeB
 *    - Create different property types based on conditions
 *
 * 4. Built-in Mapped Types:
 *    - Record<K, T>: Object with specified keys
 *    - Partial<T>: All properties optional
 *    - Required<T>: All properties required
 *    - Readonly<T>: All properties readonly
 *    - Pick<T, K>: Select specific properties
 *    - Omit<T, K>: Exclude specific properties
 */
