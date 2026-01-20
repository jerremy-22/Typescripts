/**
 * Template Literal Types in TypeScript
 * Template literal types allow you to manipulate string types with template literals,
 * enabling powerful string-based type transformations and validations
 */

// ===== BASIC TEMPLATE LITERAL TYPES =====

// Example 1: Simple template literal type
type Greeting = `Hello, ${"World" | "TypeScript"}!`;
// Result: "Hello, World!" | "Hello, TypeScript!"

// Example 2: Union expansion
type Color = "red" | "green" | "blue";
type Size = "small" | "medium" | "large";
type ColoredSize = `${Color}-${Size}`;
// Result: "red-small" | "red-medium" | "red-large" | "green-small" | ...

// Example 3: Template literal with generic types
type EventName = `on${Capitalize<"click" | "change" | "submit">}`;
// Result: "onClick" | "onChange" | "onSubmit"

// ===== INTRINSIC STRING MANIPULATION TYPES =====

// TypeScript provides built-in string manipulation utility types:

// Uppercase: Convert string to uppercase
type ScreamingMessage = Uppercase<"hello world">;
// Result: "HELLO WORLD"

type ApiEndpoint = `${Uppercase<"get">}_USERS`;
// Result: "GET_USERS"

// Lowercase: Convert string to lowercase
type QuietMessage = Lowercase<"HELLO">;
// Result: "hello"

type NormalUrl = `https://${string}/${Lowercase<"API">}/users`;
// Result: `https://${string}/api/users`

// Capitalize: Capitalize first character
type CapitalizedGreeting = Capitalize<"hello">;
// Result: "Hello"

type MethodName = `${Capitalize<"getName" | "setName">}`;
// Result: "GetName" | "SetName"

// Uncapitalize: Remove capitalization from first character
type UncapitalizedEvent = Uncapitalize<"onClick">;
// Result: "onClick"

// ===== COMBINING TEMPLATE LITERALS WITH UNIONS =====

// Example 4: Event handler creation
type EventType = "click" | "change" | "focus" | "blur";
type EventHandlerName = `on${Capitalize<EventType>}`;
// Result: "onClick" | "onChange" | "onFocus" | "onBlur"

type EventHandlers = {
  [K in EventHandlerName]: (event: Event) => void;
};
// Result: {
//   onClick: (event: Event) => void;
//   onChange: (event: Event) => void;
//   onFocus: (event: Event) => void;
//   onBlur: (event: Event) => void;
// }

// Example 5: HTTP method combinations
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ResourceName = "users" | "posts" | "comments";
type ApiRoute = `/${Lowercase<ResourceName>}`;
type ApiEndpointType = `${HttpMethod} ${ApiRoute}`;
// Result: "GET /users" | "GET /posts" | ... | "DELETE /comments"

// ===== TEMPLATE LITERALS WITH CONDITIONAL TYPES =====

// Example 6: Extract prefix from event name
type ExtractEventType<T extends string> = T extends `on${infer E}` ? E : never;

type ClickEvent = ExtractEventType<"onClick">;
// Result: "Click"

type ChangeEvent = ExtractEventType<"onChange">;
// Result: "Change"

// Example 7: Parse query parameters
type ParseQuery<T extends string> = T extends `${infer Key}=${infer Value}` 
  ? { key: Key; value: Value }
  : never;

type Query1 = ParseQuery<"name=John">;
// Result: { key: "name"; value: "John" }

// ===== PRACTICAL EXAMPLES =====

// Example 8: CSS class name generator
type CSSUnit = "px" | "em" | "rem" | "%";
type CSSValue<Unit extends CSSUnit = "px"> = `${number}${Unit}`;

type Spacing = `${CSSValue<"px">}` | `${CSSValue<"rem">}`;
// Result allows various combinations like "10px", "2rem", etc.

// Example 9: Database column naming conventions
type TableName = "users" | "products" | "orders";
type ColumnAction = "get" | "set" | "validate";
type DatabaseMethod<T extends TableName = TableName> = 
  `${ColumnAction}${Capitalize<T>}`;
// Result: "getUsers" | "setUsers" | "validateUsers" | ...

// Example 10: Type-safe API response keys
type EndpointMethod = "GET" | "POST" | "PUT" | "DELETE";
type EndpointPath = "/users" | "/posts" | "/comments";
type ApiKey = `${EndpointMethod}:${EndpointPath}`;
// Result: "GET:/users" | "POST:/users" | ... | "DELETE:/comments"

const apiCache: Partial<Record<ApiKey, unknown>> = {
  "GET:/users": [{ id: 1, name: "John" }],
  "POST:/posts": { id: 1, title: "Hello" },
};

// Example 11: Form field naming pattern
type FormFieldType = "text" | "email" | "password" | "checkbox";
type FormField = `field_${FormFieldType}_${"input" | "label" | "error"}`;
// Result: "field_text_input" | "field_text_label" | ... | "field_checkbox_error"

// Example 12: Redux action type constants
type Feature = "auth" | "user" | "settings";
type Action = "LOAD" | "SUCCESS" | "FAILURE";
type ReduxActionType = `${Feature}/${Action}`;
// Result: "auth/LOAD" | "auth/SUCCESS" | "auth/FAILURE" | ...

// ===== EXTRACTING TYPES FROM STRINGS =====

// Example 13: Parse path parameters
type Route = "/users/:id" | "/posts/:id/comments/:commentId" | "/settings";

type ExtractParams<T extends string> = 
  T extends `${infer Start}:${infer Param}/${infer Rest}` 
    ? { param: Param } & ExtractParams<`/${Rest}`>
    : T extends `${infer Start}:${infer Param}`
    ? { param: Param }
    : {};

type UserRoute = ExtractParams<"/users/:id">;
// Result: { param: "id" }

// Example 14: Parse version strings
type Version = `${number}.${number}.${number}`;
type ValidVersions = "1.0.0" | "2.5.3" | "0.1.2";

// Example 15: URL scheme validation
type URLScheme = "http" | "https" | "ftp";
type Domain = string;
type ValidURL = `${URLScheme}://${Domain}`;

const myUrl: ValidURL = "https://example.com";
// const badUrl: ValidURL = "example.com"; // Error!

// ===== COMBINING WITH MAPPED TYPES =====

// Example 16: Create getter/setter pairs
type Properties = "name" | "age" | "email";

type Getters = {
  [P in Properties as `get${Capitalize<P>}`]: () => string;
};

type Setters = {
  [P in Properties as `set${Capitalize<P>}`]: (value: string) => void;
};

type Accessors = Getters & Setters;
// Result: {
//   getName: () => string;
//   setName: (value: string) => void;
//   getAge: () => string;
//   setAge: (value: string) => void;
//   getEmail: () => string;
//   setEmail: (value: string) => void;
// }

// Example 17: Data loader pattern
type DataType = "user" | "post" | "comment";
type LoaderFunctions = {
  [T in DataType as `load${Capitalize<T>}`]: () => Promise<any>;
};

// Example 18: Event emitter pattern
type Events = "login" | "logout" | "signup";
type EventEmitterMethods = {
  [E in Events as `on${Capitalize<E>}`]: (callback: () => void) => void;
} & {
  [E in Events as `emit${Capitalize<E>}`]: () => void;
};

// ===== ADVANCED PATTERNS =====

// Example 19: Recursive path building
type PathSegment = string;
type BuildPath<T extends PathSegment[]> = 
  T extends [infer First extends string, ...infer Rest extends PathSegment[]]
    ? `/${First}${BuildPath<Rest> extends `/${string}` ? BuildPath<Rest> : ""}`
    : "";

type MyPath = BuildPath<["api", "users", "123"]>;
// Result: "/api/users/123"

// Example 20: Key transformation with patterns
interface Config {
  apiUrl: string;
  apiKey: string;
  debugMode: boolean;
}

type ConfigEnvVars = {
  [K in keyof Config as `APP_${Uppercase<string & K>}`]: Config[K];
};

const envConfig: ConfigEnvVars = {
  APP_APIURL: "https://api.example.com",
  APP_APIKEY: "secret-key",
  APP_DEBUGMODE: true,
};

// Example 21: Narrow string literals with patterns
type HTMLElement = 
  | "div"
  | "span"
  | "p"
  | "button"
  | "input"
  | "form";

type HTMLTag<T extends HTMLElement = HTMLElement> = `<${T}>`;
type HTMLTagWithAttribute<T extends HTMLElement = HTMLElement> = `<${T} class="${string}">`;

// Example 22: State machine event types
type State = "idle" | "loading" | "error" | "success";
type EventPrefix = `${State}:`;
type StateEvent = EventPrefix;

// ===== PRACTICAL USE CASE: VALIDATION =====

// Example 23: Email validation
type EmailDomain = string;
type Email = `${string}@${EmailDomain}`;

function validateEmail(email: Email): boolean {
  return true;
}

const validEmail: Email = "user@example.com";
// const invalidEmail: Email = "userexample.com"; // Error!

// Example 24: Hex color validation
type HexDigit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "A" | "B" | "C" | "D" | "E" | "F";
type HexColor = `#${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}${HexDigit}`;

const myColor: HexColor = "#FF5733";
// const badColor: HexColor = "#FFF"; // Error!

// Example 25: Semantic versioning
type Major = string; // Should be digit(s)
type Minor = string;
type Patch = string;
type SemanticVersion = `${Major}.${Minor}.${Patch}`;

const version: SemanticVersion = "1.2.3";

// ===== KEY CONCEPTS =====

/*
 * 1. Basic Syntax: `prefix-${UnionType}-suffix`
 *    - Creates a union of all combinations
 *    - Works with mapped types for powerful transformations
 *
 * 2. Intrinsic String Manipulation Types (TypeScript 4.4+):
 *    - Uppercase<T>: Convert to uppercase
 *    - Lowercase<T>: Convert to lowercase
 *    - Capitalize<T>: Capitalize first letter
 *    - Uncapitalize<T>: Remove first letter capitalization
 *
 * 3. Template Literal Inference: infer keyword
 *    - Extract parts of string literals
 *    - Use in conditional types for parsing
 *
 * 4. Common Use Cases:
 *    - Event handler naming (onClick, onChange, etc.)
 *    - API route definitions
 *    - Environment variable naming
 *    - String pattern validation
 *    - Dynamic property generation
 *
 * 5. Limitations:
 *    - Cannot use arbitrary functions (only Uppercase, Lowercase, etc.)
 *    - Union expansion can create large types
 *    - Performance can degrade with complex unions
 *
 * 6. Best Practices:
 *    - Use for type-safe string patterns
 *    - Combine with mapped types for API generation
 *    - Keep unions reasonably sized
 *    - Use conditional types for parsing
 */
