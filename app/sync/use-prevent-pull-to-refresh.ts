"use client";
import { useEffect, useRef, useState } from "react";

function throttle<F extends (...args: any[]) => void>(func: F, throttleMs: number): F & { reset: () => void } {
  let lastCallTime: number | null;
  let timeoutId: NodeJS.Timeout | null = null;

  const throttledFunction = (...args: Parameters<F>) => {
    const now = Date.now();

    if (lastCallTime == null || now - lastCallTime >= throttleMs) {
      lastCallTime = now;
      func(...args);
    }
  };

  throttledFunction.reset = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastCallTime = null;
  };

  return throttledFunction as F & { reset: () => void };
}

export const usePreventPullToRefresh = () => {
  const startY = useRef<number | null>(null);
  useEffect(() => {
    const touchStartHandler = (e: TouchEvent) => {
      startY.current = e.touches[0].clientY;
      console.log("터치스타트이벤트");
    };

    const touchMoveHandler = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      console.log("터치무브 이벤트", currentY);
      if (e.cancelable && startY.current !== null && window.scrollY === 0 && currentY > startY.current) {
        // Prevent pull-to-refresh if at the top and pulling down
        e.preventDefault();
      }
    };
    window.addEventListener("touchstart", touchStartHandler, { passive: true });
    window.addEventListener("touchmove", touchMoveHandler, { passive: false });

    return () => {
      window.removeEventListener("touchstart", touchStartHandler);
      window.removeEventListener("touchmove", touchMoveHandler);
    };
  }, []);
  return startY;
};
