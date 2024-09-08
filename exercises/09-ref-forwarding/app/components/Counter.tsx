import { useSyncExternalStore } from "react";
import romanNumerals from "roman-numerals";
import {
  decrement,
  getCounterValue,
  increment,
  subscribeToCounterChanges,
} from "../stores/CounterStore";
import { useNumberMode } from "../hooks/useNumberMode";

export default function Counter() {
  const mode = useNumberMode();

  const count = useSyncExternalStore(
    subscribeToCounterChanges,
    getCounterValue,
    getCounterValue,
  );

  return (
    <>
      <div className="flex gap-4 items-center text-4xl">
        <button
          className="block rounded-full bg-blue-900 hover:bg-blue-800 text-blue-50 w-16 h-16"
          onClick={decrement}
        >
          -
        </button>
        <span className="font-serif">{renderNumber(count, mode)}</span>
        <button
          className="block rounded-full bg-blue-900 hover:bg-blue-800 text-blue-50 w-16 h-16"
          onClick={increment}
        >
          +
        </button>
      </div>
    </>
  );
}

function renderNumber(count: number, mode: "arabic" | "roman"): string {
  switch (mode) {
    case "arabic":
      return count.toString();
    case "roman":
      return romanNumerals.toRoman(count);
    default:
      return mode satisfies never;
  }
}
