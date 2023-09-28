import React from 'react';

interface ICounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
}
const CounterStore = React.createContext<ICounterStore>({
  count: 0,
  increment: () => {
    throw new Error('Missing <CounterProvider>');
  },
  decrement: () => {
    throw new Error('Missing <CounterProvider>');
  },
});

export function CounterProvider(props: {
  children: React.ReactNode;
  initialCount: number;
}) {
  const [count, setCount] = React.useState(props.initialCount);
  const increment = React.useCallback(() => setCount((c) => c + 1), []);
  const decrement = React.useCallback(
    () => setCount((c) => Math.max(0, c - 1)),
    [],
  );
  const value = React.useMemo(
    () => ({count, increment, decrement}),
    [count, increment, decrement],
  );
  return (
    <CounterStore.Provider value={value}>
      {props.children}
    </CounterStore.Provider>
  );
}

export function useCounter() {
  return React.useContext(CounterStore);
}
