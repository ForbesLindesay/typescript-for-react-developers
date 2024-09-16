export default function debounce(fn: () => void, durationMilliseconds: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, durationMilliseconds);
  };
}
