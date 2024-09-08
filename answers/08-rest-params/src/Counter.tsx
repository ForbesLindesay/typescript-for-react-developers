import React from 'react';
import {toRoman, toArabic} from 'roman-numerals';
import debounce from './debounce';

export default function Counter() {
  const [count, setCount] = React.useState<number | string>(0);
  const setCountDebounced = React.useMemo(() => debounce(setCount, 500), []);

  const decrement = () =>
    setCountDebounced((count) => mapNumber(count, (c) => Math.max(0, c - 1)));
  const increment = () =>
    setCountDebounced((count) => mapNumber(count, (c) => c + 1));
  const toggleMode = () =>
    setCountDebounced((count) =>
      typeof count === 'string' ? toArabic(count) : toRoman(count),
    );

  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button className="toggle-mode" onClick={toggleMode}>
        Toggle Mode
      </button>
    </div>
  );
}

function mapNumber<T extends string | number>(
  number: T,
  fn: (value: number) => number,
): T extends number ? number : T extends string ? string : number | string {
  const n: string | number = number;
  if (typeof n === 'string') return toRoman(fn(toArabic(n))) as any;
  else return fn(n) as any;
}
