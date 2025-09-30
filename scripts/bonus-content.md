## Escape Hatches

It's often not possible to make everything perfectly type safe, so you may need to use one of the escape hatches.

You can tell TypeScript to expect (and ignore) an error on the next line using a special comment:

```ts
// @ts-expect-error
const x: string = 42;
```

You can also use `// @ts-ignore-error` but I always recommend you prefer `// @ts-expect-error` as that way TypeScript will force you to remove the escape hatch when it's no longer needed. Since this ignores any errors on that line, it's good practice to keep as little code as possible on the line where you've expected an error.

You can also perform an unsafe cast using `as`:

```ts
function unsafeAsNotNull<T>(value: T | null): T {
  return value as T;
}
```

The downside here is that TypeScript will not automatically warn you when the `as` is not needed, but the upside is that it's more specific about exactly what unsafe thing you are doing, while `// @ts-expect-error` will ignore absolutely any errors on the following line.

## Bonus Exercise - Rewrite exercise 4 to store numbers roman numerals

We used a simple `count: number` to track the current count and a separate `mode: "arabic" | "roman"` state to track which mode to render in. Try converting this component to store the `count` as a `string` when in roman numeral mode and as a number when in arabic mode. You can use `fromRoman` and `toRoman` to create an `increment` and `decrement` function that handles roman numerals as well as normal numbers. As a starting point, `toggleMode` might look like:

```tsx
import { toRoman, toArabic } from "roman-numerals";

function toggleMode(value: string | number): string | number {
  if (typeof value === "string") return toArabic(value);
  else return toRoman(value);
}
```

## Bonus Content

### Overloaded Functions

One of the interesting thing about the `toggleMode` function is that we loose some information in the types. You might like to try out the following code:

```tsx
const value: number = toggleMode("XLII");
const romanValue: string = toggleMode(42);

// ...
<p>
  {value} = {romanValue}
</p>;
```

TypeScript will complain that you cannot assign `toggleMode(42)` to `value: string` because the type returned by `toggleMode` is `number | string`. It sees the `number` and thinks "what if it's a number, you can't assign a number to a string". We know better though, if you pass `toggleMode` a `number` it always returns a `string`.

We can solve this with overloading:

```tsx
function toggleMode(value: number): string;
function toggleMode(value: string): number;
function toggleMode(value: string | number): string | number;
function toggleMode(value: string | number): string | number {
  if (typeof value === "string") return toArabic(value);
  else return toRoman(value);
}
```

Here, we have 3 versions of the function:

1. If passed a number, we return a string
2. If passed a string, we return a number
3. If we are passed a value that could be a string or a number, we might return a string, or we might return a number.

> N.B. overloading is dangerous. TypeScript doesn't check that your overloads are actually valid. If you swap the return types of your overloads, TypeScript would be none the wiser. Only use overloading when absolutely necessary.

### Conditional Types

One of the most powerful features that TypeScript has (and flow doesn't) is conditional types. This lets you take a type (usually from a generic) and then make another type that depends on it. For example:

```tsx
import { toRoman, toArabic } from "roman-numerals";

function toggle<T extends string | number>(
  value: T,
): T extends string ? number : string {
  if (typeof value === "string") return toArabic(value);
  else return toRoman(value);
}
```

You can also infer parts of the value. For example, the following makes `X` an alias for the `string` type.

```tsx
type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;

function foo(): string {
  return "Hello World";
}
type X = ReturnTypeOf<typeof foo>;
```

### Template Literal Types

`string` isn't a very good type. If you know more about the string, you can use template literal types to be more specific. For example, here are a couple of types that can be frequently useful:

```tsx
type AbsoluteUrl = `https://${string}`;
type Email = `${string}@${string}`;
```

You will need to do an unsafe cast to convert a `string` to one of these types, but that can still be very useful as you can do an unsafe cast in a validation function and then guarantee that you don't forget validation anywhere else in your application. e.g.

```tsx
function asAbsoluteUrl(urlString: string): AbsoluteUrl | null {
  try {
    const url = new URL(urlString);
    if (url.protocol === "https:") {
      return url.href as any;
    } else {
      return null;
    }
  } catch (ex) {
    return null;
  }
}
```

### Named Types

Sometimes there's nothing special about the text in a string, but you still want to ensure it's used for a specific semantic purpose. You also might have IDs that you want to declare a special type for. There's a little trick you can use to create named types:

```tsx
type UserId = number & { __type: "UserId" };
type PostId = string & { __type: "PostId" };
```

You'll then need an unsafe cast to convert a regular `number` or `string` into one of these types, but it can be helpful to avoid mixing various similar ID types.

### Type Guards

When we render posts, we have to figure out which version of the union we are in, this is called a type guard. TypeScript can infer a lot of kinds of type guards automatically. e.g.

```tsx
function maybeParse(value: number | string): number {
  if (typeof value === "number") {
    // TypeScript knows that the value is of type `number` here
    return value;
  }
  // TypeScript knows the value is of type `string` here
  return parseInt(value, 10);
}
```

Sometimes we might have more complicated logic to figure out what type something is. In these cases, TypeScript can't always figure out the type for us. In these situations, there are two options.

You can do an unsafe cast:

```tsx
// TypeScript doesn't know `isNumber` acts as a type guard
// because we just list it as returning `boolean`
function isNumber(value: unknown): boolean {
  return typeof value === "number";
}
function maybeParse(value: number | string): number {
  if (isNumber(value)) {
    // TypeScript doesn't know `value` is a `number`
    return value as number;
  }
  // TypeScript doesn't know `value` is a `string`
  return parseInt(value as string, 10);
}
```

Alternatively, you can mark your function as a type guard

```tsx
function isNumber(value: unknown): value is number {
  return typeof value === "number";
}
function maybeParse(value: number | string): number {
  if (isNumber(value)) {
    // TypeScript knows that the value is of type `number` here
    return value;
  }
  // TypeScript knows the value is of type `string` here
  return parseInt(value, 10);
}
```

In this case, it's still unsafe because TypeScript doesn't actually check that your type guard is valid. It only checks that the function returns a boolean, not what value that boolean has.

An alternative that **is** type safe, is to rely on TypeScript to infer the type guards. This has only been added to TypeScript in 2024, and it simplifies a lot of previously complex/unsafe code. For this example, we can use:

```tsx
function isNumber(value: unknown) {
  return typeof value === "number";
}
function maybeParse(value: number | string): number {
  if (isNumber(value)) {
    // TypeScript knows that the value is of type `number` here
    return value;
  }
  // TypeScript knows the value is of type `string` here
  return parseInt(value, 10);
}
```

### Index Types and "keyof"

Sometimes you may want to use generics to manipulate objects, using things like `Object.keys`, `Object.fromEntries` and `Object.entries`. Although you will probably end up needing escape hatches within functions, you can still produce well defined types outside of the functions. For example, `Object.keys(obj)` always returns `string[]` but in most cases it would be fairly safe to say that it returns only the keys of `obj`. So you could write:

```ts
function objectKeys<T>(obj: T): (keyof T)[] {
  const result = Object.keys(obj);
  // @ts-expect-error
  return result;
}

const x = objectKeys({ a: 10, b: 20 });
// x has type ('a' | 'b')[]
```

You can also create mapped types/indexed types, for example:

```ts
function mirrorKeys<T>(obj: T): { [TKey in keyof T]: TKey } {
  const result = Object.fromEntries(Object.keys(obj).map((k) => [k, k]));
  // @ts-expect-error
  return result;
}

const x = mirrorKeys({ a: 10, b: 20 });
// x has type: {a: 'a', b: 'b'}
```

### Enums

It's common in JavaScript to have values used to distinguish between a set of states or objects of differing structures that appear in the same list (e.g. the posts from our earlier example).

You can represent this in TypeScript using literal types and unions:

```tsx
type State = "state1" | "state2";
```

Sometimes though, you may want the states to be represented as integers, for performance, and to still give them friendly names in the code. This is where enums are most useful:

```tsx
enum State {
  state1,
  state2,
}
```

Is equivalent to:

```tsx
enum State {
  state1 = 0,
  state2 = 1,
}
```

You can also use string literals if you prefer:

```tsx
enum State {
  state1 = "state1",
  state2 = "state2",
}
```

Defining an enum creates the type `State`, a type for each value in the enum (`State.state1` and `State.state2`), and a runtime object that maps the keys onto the values. This also allows you do enumerate the possible keys & values.

In `exercises/05-more-unions-answer`, convert our Post types to use a `PostKind` enum. You can try either integers or strings as values.

Although using numbers as values does offer a small performance improvement, especially if you're sending a lot of enum values over a network connection, they make debugging significantly more difficult. At runtime you'll just see the numbers, and it will be up to you to look up what that number means in that context.

> Enums are generally discouraged in modern TypeScript code because they do not exist as part of the underlying JavaScript ecosystem and can have some unfortunate quirks.

## Other Possible Topics for Discussion

- Structural type compatibility - different from traditional OOP
- How does type inference work?
- ESLint Rules
- GraphQL Types
- Database Types
