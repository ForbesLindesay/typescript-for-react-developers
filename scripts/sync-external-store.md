## Exercise 7 - Sync External Store

Getting state that's managed outside of React into a React component is easy to get wrong. Trying to use `useState` and `useEffect` to track the state and subscribe to changes will inevitably lead to occasional edge cases/bugs. The correct way to do this is using `useSyncExternalStore`. This hook has a type of:

```tsx
function useSyncExternalStore<TSnapshot>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => TSnapshot,
  getServerSnapshot?: () => TSnapshot,
): TSnapshot;
```

TypeScript will almost always correctly infer the type for `TSnapshot` from the `getSnapshot` function you pass in.
