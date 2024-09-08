export default function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  time: number = 100,
): (...args: TArgs) => void {
  let pending: NodeJS.Timeout | undefined;
  return (...args) => {
    if (pending) {
      clearTimeout(pending);
    }
    pending = setTimeout(() => {
      fn(...args);
    }, time);
  };
}
