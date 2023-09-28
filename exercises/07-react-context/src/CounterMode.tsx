import React from 'react';

export type CounterMode = 'ROMAN' | 'ARABIC';
const CounterModeContext = React.createContext('ARABIC');

export function CounterModeProvider(props: {
  children: React.ReactNode;
  mode: CounterMode;
}) {
  return (
    <CounterModeContext.Provider value={props.mode}>
      {props.children}
    </CounterModeContext.Provider>
  );
}

export function useCounterMode(): CounterMode {
  return React.useContext(CounterModeContext);
}
