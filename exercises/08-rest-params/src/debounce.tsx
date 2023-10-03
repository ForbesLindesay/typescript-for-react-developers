export default function debounce<TArgs extends unknown[]>(fn: (...args: TArgs) => void, time: number = 100) {
  let pending: NodeJS.Timeout | undefined;
  return (...args: TArgs) => {
    if (pending) {
      clearTimeout(pending);
    }
    pending = setTimeout(() => {
      fn(...args);
    }, time);
  };
}
