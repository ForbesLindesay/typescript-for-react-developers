If you have rest params, they can be typed as either an array:

```tsx
function joinStrings(...strs: string[]) {
  return strs.join("");
}
```

or they can be a tuple, where the following two functions are approximately equivalent:

```tsx
function add(...args: [number, number]) {
  return args[0] + args[1];
}
function add(a: number, b: number) {
  return a + b;
}
```

You can also use generic types for the Args, providing the generic is constrained to `extends unknown[]` which means that the TArgs would be assignable to `unknown[]`

```tsx
function call<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
  ...args: TArgs
): TResult {
  return fn(...args);
}
```
