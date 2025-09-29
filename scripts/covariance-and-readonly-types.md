### Covariance & Read Only Types

One of the big differences between TypeScript and Flow is how they handle variance. The following is allowed by TypeScript, but rejected by Flow:

```tsx
function logNumbers(values: Array<number | null>) {
  for (const n of numbers) {
    if (n) console.log(n);
  }
}
const numbers: Array<number> = [1, 2, 3];
logNumbers(numbers);
```

To see why Flow rejects this, consider code like:

```tsx
function logNumbers(values: Array<number | null>) {
  values.push(null);
}
const numbers: Array<number> = [1, 2, 3];
logNumbers(numbers);
console.log(numbers);
```

My implementation of `logNumbers` may be a little bit nonsensical, but it does still match the original type signature. The issue is that subsequent use of `numbers` will assume that it is of type `Array<number>` but it actually contains a `null` value. TypeScript is intentionally being a bit loose here, because it's so common for a function to take an array and not mutate it's inputs. If we want to absolutely prevent this error though, the best thing we can do is be explicit about the fact that arrays are read only.

```tsx
function logNumbers(values: ReadonlyArray<number | null>) {
  for (const n of numbers) {
    if (n) console.log(n);
  }
}
const numbers: Array<number> = [1, 2, 3];
logNumbers(numbers);
```

This code is much safer, and is accepted by both Flow and TypeScript. It's ok to pass an `Array<number>` to a function that expects a `ReadonlyArray<number | null>` because neither function will violate the expectations of the other.

Just like with the `Array<T>` type, there is a shorthand for `ReadonlyArray<T>` so you can write the example above with the shorthand as:

```tsx
function logNumbers(values: readonly (number | null)[]) {
  for (const n of numbers) {
    if (n) console.log(n);
  }
}
const numbers: Array<number> = [1, 2, 3];
logNumbers(numbers);
```

> It is normally best to always use `readonly` for arrays, properties and state in React code, but I haven't done so consistently in these exercises due to it requiring extra typing for every property.
