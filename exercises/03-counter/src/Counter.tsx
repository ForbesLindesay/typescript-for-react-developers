import React from 'react';
// import {toRoman, toArabic} from 'roman-numerals';

export default function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <button onClick={() => setCount(count - 1)}>-</button>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>+</button>
      {/* <button
        className="toggle-mode"
        onClick={() => {
          if (typeof count === 'string') setCount(toArabic(count));
          else setCount(toRoman(count));
        }}
      >
        Toggle Mode
      </button> */}
    </div>
  );
}
