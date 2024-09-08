export default function debounce(fn: () => void, durationMilliseconds: number) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, durationMilliseconds);
  };
}
