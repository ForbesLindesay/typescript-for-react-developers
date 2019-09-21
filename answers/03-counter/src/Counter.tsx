import React from 'react';
import {toRoman, toArabic} from 'roman-numerals';

export default function Counter() {
  const [count, setCount] = React.useState<string | number>(0);

  return (
    <div>
      <button onClick={() => setCount(mapNumber(count, (c) => Math.max(0, c - 1)))}>-</button>
      <span>{count}</span>
      <button onClick={() => setCount(mapNumber(count, (c) => c + 1))}>+</button>
      <button
        className="toggle-mode"
        onClick={() => {
          if (typeof count === 'string') setCount(toArabic(count));
          else setCount(toRoman(count));
        }}
      >
        Toggle Mode
      </button>
    </div>
  );
}

function mapNumber(number: string | number, fn: (value: number) => number) {
  if (typeof number === 'string') return toRoman(fn(toArabic(number)));
  return fn(number);
}
