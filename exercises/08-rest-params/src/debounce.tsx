export default function debounce(fn, time: number = 100) {
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
