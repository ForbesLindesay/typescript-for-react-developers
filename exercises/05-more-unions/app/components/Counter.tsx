import { useState } from "react";
import romanNumerals from "roman-numerals";

type Mode = "arabic" | "roman";

export default function Counter() {
  const [count, setCount] = useState(1);
  const [mode, setMode] = useState<Mode>("arabic");

  return (
    <>
      <div className="flex gap-4 items-center text-4xl">
        <button
          className="block rounded-full bg-blue-900 hover:bg-blue-800 text-blue-50 w-16 h-16"
          onClick={() => setCount((count) => Math.max(1, count - 1))}
        >
          -
        </button>
        <span className="font-serif">{renderNumber(count, mode)}</span>
        <button
          className="block rounded-full bg-blue-900 hover:bg-blue-800 text-blue-50 w-16 h-16"
          onClick={() => setCount((count) => count + 1)}
        >
          +
        </button>
      </div>
      <button
        className="block rounded-md bg-blue-900 hover:bg-blue-800 text-blue-50 text-xl p-4 mt-4"
        onClick={() => setMode(toggleMode)}
      >
        Toggle Mode
      </button>
    </>
  );
}

function toggleMode(mode: Mode): Mode {
  switch (mode) {
    case "arabic":
      return "roman";
    case "roman":
      return "arabic";
    default:
      return mode satisfies never;
  }
}

function renderNumber(count: number, mode: Mode): string {
  switch (mode) {
    case "arabic":
      return count.toString();
    case "roman":
      return romanNumerals.toRoman(count);
    default:
      return mode satisfies never;
  }
}
