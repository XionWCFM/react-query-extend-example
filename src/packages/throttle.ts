export function throttle<F extends (...args: any[]) => void>(func: F, throttleMs: number): F {
  let lastCallTime: number | null;

  const throttledFunction = function (...args: Parameters<F>) {
    const now = Date.now();

    if (lastCallTime == null || now - lastCallTime >= throttleMs) {
      lastCallTime = now;
      func(...args);
    }
  } as F;

  return throttledFunction;
}
