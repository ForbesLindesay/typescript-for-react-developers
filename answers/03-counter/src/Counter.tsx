import React from 'react';
import {toRoman, toArabic} from 'roman-numerals';

export default function Counter() {
  const [count, setCount] = React.useState<string | number>(0);

  const value: number = mapNumber(42, (c) => c + 1);
  const romanValue: string = mapNumber('XLII', (c) => c + 1);

  return (
    <div>
      <button
        onClick={() => setCount(mapNumber(count, (c) => Math.max(0, c - 1)))}
      >
        -
      </button>
      <span>{count}</span>
      <button onClick={() => setCount(mapNumber(count, (c) => c + 1))}>
        +
      </button>
      <button
        className="toggle-mode"
        onClick={() => {
          if (typeof count === 'string') setCount(toArabic(count));
          else setCount(toRoman(count));
        }}
      >
        Toggle Mode
      </button>
      <p>
        {value} = {romanValue}
      </p>
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
