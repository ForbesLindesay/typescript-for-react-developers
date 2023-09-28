import {toRoman} from 'roman-numerals';

export default function objectMap<TObj extends {}, TResult>(
  obj: TObj,
  fn: (value: TObj[keyof TObj], key: keyof TObj) => TResult,
): {[key in keyof TObj]: TResult} {
  const result = Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      fn(value as TObj[keyof TObj], key as keyof TObj),
    ]),
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
