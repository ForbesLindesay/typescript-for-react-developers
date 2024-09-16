export default function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  durationMilliseconds: number,
) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args: TArgs) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, durationMilliseconds);
  };
}
