import {toRoman} from 'roman-numerals';

export default function objectMap(obj, fn): TODO {
  const result = Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn(value, key)]),
  );
  // @ts-expect-error
  return result;
}

export const mappedObject = objectMap(
  {
    one: 1,
    two: 2,
  },
  toRoman,
);
