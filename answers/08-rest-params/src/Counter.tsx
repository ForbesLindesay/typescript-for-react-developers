import React from 'react';
import {toRoman, toArabic} from 'roman-numerals';

interface State {
  count: number | string;
}
export default class Counter extends React.Component<{}, State> {
  state = {
    count: 0,
  };
  private readonly _decrement = () => {
    this.setState(({count}) => ({
      count: mapNumber(count, (c) => Math.max(0, c - 1)),
    }));
  };
  private readonly _increment = () => {
    this.setState(({count}) => ({
      count: mapNumber(count, (c) => c + 1),
    }));
  };
  private readonly _toggleMode = () => {
    this.setState(({count}) => ({
      count: typeof count === 'string' ? toArabic(count) : toRoman(count),
    }));
  };
  render() {
    return (
      <div>
        <button onClick={this._decrement}>-</button>
        <span>{this.state.count}</span>
        <button onClick={this._increment}>+</button>
        <button className="toggle-mode" onClick={this._toggleMode}>
          Toggle Mode
        </button>
      </div>
    );
  }
}

function mapNumber<T extends string | number>(
  number: T,
  fn: (value: number) => number,
): T extends number ? number : T extends string ? string : (number | string) {
  const n: string | number = number;
  if (typeof n === 'string') return toRoman(fn(toArabic(n))) as any;
  else return fn(n) as any;
}
