import React from 'react';
import {toRoman} from 'roman-numerals';
import {useCounter} from './CounterStore';
import {CounterMode, useCounterMode} from './CounterMode';

const NUMBER_FORMATTER: Record<CounterMode, (v: number) => string> = {
  ARABIC: (v) => v.toString(),
  ROMAN: toRoman,
};

export default function Counter() {
  const {count, increment, decrement} = useCounter();
  const mode = useCounterMode();
  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{NUMBER_FORMATTER[mode](count)}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}
