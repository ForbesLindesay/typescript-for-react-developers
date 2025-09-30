let currentValue = 1;
const listeners = new Set<() => void>();

export function increment() {
  currentValue++;
  for (const listener of listeners) {
    listener();
  }
}
export function decrement() {
  if (currentValue > 1) {
    currentValue--;
    for (const listener of listeners) {
      listener();
    }
  }
}

export function getCounterValue(): number {
  return currentValue;
}
export function subscribeToCounterChanges(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
