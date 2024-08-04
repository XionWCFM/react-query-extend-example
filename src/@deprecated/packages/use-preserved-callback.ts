import { useRef, useEffect, useCallback } from "react";

export function usePreservedCallback<Callback extends (...args: any[]) => any>(callback: Callback) {
  const callbackRef = useRef<Callback>(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, []) as Callback;
}
