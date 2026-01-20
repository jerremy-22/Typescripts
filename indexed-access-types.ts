/**
 * Indexed Access Types in TypeScript
 * Allows you to access the type of a specific property on another type
 * using indexing syntax similar to accessing object properties
 */

// ===== BASIC INDEXED ACCESS =====

// Example 1: Access property type from an object type
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

// Get the type of a single property
type UserId = User["id"];           // number
type UserName = User["name"];       // string
type UserEmail = User["email"];     // string

// Example 2: Access array element type
type StringArray = string[];
type StringElement = StringArray[number];  // string

type TupleType = [string, number, boolean];
type FirstElement = TupleType[0];   // string
type SecondElement = TupleType[1];  // number
type ThirdElement = TupleType[2];   // boolean

// ===== UNION OF PROPERTIES =====

// Example 3: Get union of all property types
type UserPropertyTypes = User["id" | "name" | "email"];
// Result: number | string

type AllUserProperties = User[keyof User];
// Result: number | string | boolean (union of all property types)

// Example 4: Union from array types
type ArrayUnion = string[] | number[];
type ElementType = ArrayUnion[number];  // string | number

// ===== WITH GENERICS =====

// Example 5: Generic indexed access
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  isActive: true,
};

const userId = getProperty(user, "id");        // type: number
const userName = getProperty(user, "name");    // type: string

// Example 6: Extract property type in generics
type PropertyType<T, K extends keyof T> = T[K];

type UserIdType = PropertyType<User, "id">;        // number
type UserNameType = PropertyType<User, "name">;    // string

// ===== NESTED INDEXED ACCESS =====

// Example 7: Access nested properties
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

type UserAddressType = UserWithAddress["address"];           // Address
type UserAddressCity = UserWithAddress["address"]["city"];   // string

// Example 8: Chained indexed access
type AddressProperties = Address[keyof Address];  // string (all props are strings)

// ===== WITH ARRAYS AND READONLY =====

// Example 9: Readonly indexed access
type ReadonlyUser = Readonly<User>;
type ReadonlyUserId = ReadonlyUser["id"];  // number (type doesn't change, just readonly modifier)

// Example 10: Tuple indexed access with readonly
type ReadonlyTuple = readonly [string, number, boolean];
type ReadonlySecond = ReadonlyTuple[1];  // number

// ===== PRACTICAL EXAMPLES =====

// Example 11: Generic getter function
interface Config {
  apiUrl: string;
  timeout: number;
  retries: number;
  debug: boolean;
}

function getConfig<K extends keyof Config>(key: K): Config[K] {
  const config: Config = {
    apiUrl: "https://api.example.com",
    timeout: 5000,
    retries: 3,
    debug: false,
  };
  return config[key];
}

const apiUrl = getConfig("apiUrl");      // type: string
const timeout = getConfig("timeout");    // type: number

// Example 12: Type-safe object updates
function updateConfig<K extends keyof Config>(
  key: K,
  value: Config[K]
): void {
  // Implementation
  console.log(`Setting ${String(key)} to ${value}`);
}

updateConfig("apiUrl", "https://new-api.example.com");  // ✓ Valid
updateConfig("timeout", 10000);                         // ✓ Valid
// updateConfig("timeout", "invalid");                  // ✗ Error: string is not assignable to number

// Example 13: Extract function parameter type
interface Handlers {
  onClick: (id: number) => void;
  onSubmit: (data: string) => void;
  onDelete: (ids: number[]) => void;
}

type OnClickHandler = Handlers["onClick"];  // (id: number) => void

// Example 14: Extract from function return types
interface ApiEndpoints {
  getUser: () => Promise<User>;
  getUsers: () => Promise<User[]>;
  getConfig: () => Config;
}

type GetUserReturn = Awaited<ReturnType<ApiEndpoints["getUser"]>>;  // User
type GetConfigReturn = ReturnType<ApiEndpoints["getConfig"]>;       // Config

// ===== CONDITIONAL INDEXED ACCESS =====

// Example 15: Conditional types with indexed access
type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>;           // string
type Num = Flatten<number>;             // number

// Example 16: Extract property if it exists
type SafePropertyAccess<T, K extends PropertyKey> = K extends keyof T
  ? T[K]
  : undefined;

type MaybeEmail = SafePropertyAccess<User, "email">;      // string
type MaybeAge = SafePropertyAccess<User, "age">;          // undefined

// ===== ADVANCED PATTERNS =====

// Example 17: Build value type from key literals
type ApiResponse<E extends keyof typeof endpoints> = Awaited<
  ReturnType<(typeof endpoints)[E]["handler"]>
>;

const endpoints = {
  user: { handler: async () => ({ id: 1, name: "Alice" } as User) },
  config: { handler: async () => ({ apiUrl: "https://api.example.com" } as Config) },
};

type UserEndpointResponse = ApiResponse<"user">;    // User
type ConfigEndpointResponse = ApiResponse<"config">; // Config

// Example 18: Generic repository with indexed access
class Repository<T extends Record<string, any>> {
  private data: T[] = [];

  findByProperty<K extends keyof T>(
    key: K,
    value: T[K]
  ): T | undefined {
    return this.data.find((item) => item[key] === value);
  }

  filterByProperty<K extends keyof T>(
    key: K,
    value: T[K]
  ): T[] {
    return this.data.filter((item) => item[key] === value);
  }

  updateProperty<K extends keyof T>(
    id: number,
    key: K,
    value: T[K]
  ): void {
    const item = this.data.find((item) => item.id === id);
    if (item) {
      item[key] = value;
    }
  }
}

// Usage
const userRepo = new Repository<User>();
const activeUsers = userRepo.filterByProperty("isActive", true);
userRepo.updateProperty(1, "email", "newemail@example.com");

// Example 19: Type-safe form field helper
interface FormFields {
  username: string;
  password: string;
  email: string;
  age: number;
}

type FieldValidator<F extends keyof FormFields> = (
  value: FormFields[F]
) => boolean;

const validators: Record<keyof FormFields, FieldValidator<any>> = {
  username: (value: FormFields["username"]) => value.length > 0,
  password: (value: FormFields["password"]) => value.length >= 8,
  email: (value: FormFields["email"]) => value.includes("@"),
  age: (value: FormFields["age"]) => value >= 18,
};

// Example 20: Extract specific method return types
interface Logger {
  info(msg: string): void;
  error(msg: string): Error;
  warn(msg: string): string;
  debug(msg: string): boolean;
}

type LoggerInfoReturn = Logger["info"];      // (msg: string) => void
type LoggerErrorReturn = Logger["error"];    // (msg: string) => Error

// ===== COMBINING WITH OTHER TYPE OPERATIONS =====

// Example 21: Indexed access with mapped types
type GettersFromType<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = GettersFromType<User>;
// { getId: () => number; getName: () => string; ... }

// Example 22: Pick and indexed access together
type UserPreview = Pick<User, "id" | "name">;
type PreviewName = UserPreview["name"];  // string

// Example 23: Using typeof with indexed access
const config = {
  apiUrl: "https://api.example.com",
  port: 3000,
  ssl: true,
};

type ConfigType = typeof config;
type ConfigApiUrl = ConfigType["apiUrl"];  // string
type ConfigPort = ConfigType["port"];      // number

// ===== KEY CONCEPTS =====

/*
 * 1. Basic Syntax: Type[Property]
 *    - Accesses the type of a specific property
 *    - Works with object types, tuples, arrays
 *
 * 2. Union Keys: Type[Key1 | Key2 | Key3]
 *    - Returns union of property types
 *    - Useful with keyof to get all property types
 *
 * 3. Chaining: Type[Key1][Key2]
 *    - Can access nested properties
 *
 * 4. With Generics: T[K extends keyof T]
 *    - Creates type-safe generic functions
 *    - Ensures key exists on type
 *
 * 5. Common Use Cases:
 *    - Type-safe property access in functions
 *    - Extracting return types from function signatures
 *    - Building generic repositories and utilities
 *    - Creating form validators and handlers
 *
 * 6. Can be combined with:
 *    - keyof: iterate over properties
 *    - typeof: get type of values
 *    - Conditional types: narrow types based on conditions
 *    - Mapped types: transform properties
 */
