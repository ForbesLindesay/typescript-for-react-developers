Context helps structure React apps in a way that creates less boilerplate. They can be useful for:

- Sharing state between lots of components (aka "Stores")
- Modifying the behavior of components depending on the parent context in which they are rendered. e.g. messages in a chat render differently depending on the user that's viewing them.
- Dependency injection. e.g. a shared "Link" component that renders differently in next.js vs. when using react-router.

Open `exercises/08-react-context/app/hooks/useNumberMode.tsx`. You'll need to fix two issues:

### React Context Default Values

First, we haven't provided a default value in our `createContext` call. TypeScript cannot verify that we always have a provider, so we **must** provide a default value:

```tsx
const NumberModeContext = createContext("arabic");
```

If you are certain you will always wrap your components in the appropriate provider, you could "trick" TypeScript into letting you use `undefined` by declaring:

```tsx
// @ts-expect-error
const noDefaultValue: never = undefined;
```

If the value were an object, we could construct a fake value that throws an error when you attempt to read from it. Like:

```tsx
interface StringStateContextType {
  value: string;
  setValue: (newValue: string) => void;
}
const StringStateContext = createContext<StringStateContextType>({
  get value(): never {
    throw new Error("Missing provider for StringStateContext");
  },
  setValue: () => {
    throw new Error("Missing provider for StringStateContext");
  },
});
```

### Generics (yet again)

It interprets:

```tsx
const NumberModeContext = createContext("arabic");
```

as meaning we want a React context containing a `string` but we want to be more specific. You can specify the type that React should use by passing a type parameter as a generic parameter:

```tsx
const NumberModeContext = createContext<"arabic" | "roman">("arabic");
```
