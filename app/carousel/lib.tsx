import { usePreservedCallback } from "@xionwcfm/react";
import type { EmblaCarouselType, EmblaEventType } from "embla-carousel";
import { useEffect, useRef, useState } from "react";
export const decrementWithLoop = (current: number, max: number): number => {
  if (current <= 0) {
    return max - 1;
  }
  return current - 1;
};

export const incrementWithLoop = (current: number, max: number): number => {
  if (current >= max - 1) {
    return 0;
  }
  return current + 1;
};

export const difference = (a: number, b: number): number => {
  return Math.abs(a - b);
};

export const getWindowedIndices = (currentIndex: number, buffer: number, totalSize: number): number[] => {
  if (totalSize <= 0 || buffer < 0) {
    throw new Error("totalSize must be greater than 0 and buffer must be non-negative");
  }

  const maxIndex = totalSize - 1;

  const forward = Array.from({ length: buffer }, (_, i) => (currentIndex + i + 1) % totalSize);
  const backward = Array.from({ length: buffer }, (_, i) => (currentIndex - i - 1 + totalSize) % totalSize);

  return [currentIndex, ...forward, ...backward.map((val) => (val === maxIndex + 1 ? -1 : val))];
};

export const useVirtualizedCarousel = (
  emblaApi: EmblaCarouselType | undefined,
  option: {
    initialIndex?: number;
    buffer?: number;
    total: unknown[] | number;
  },
) => {
  const [currentIndex, setCurrentIndex] = useState(() => option?.initialIndex ?? 0);
  const previus = useRef(option.initialIndex ?? 0);

  const total = Array.isArray(option.total) ? option.total.length : option.total;
  useEmblaEventListeners(emblaApi, "select", (api) => {
    const isLoop = difference(previus.current, currentIndex) > 1;
    console.log(currentIndex, total, incrementWithLoop(currentIndex, total));
    setCurrentIndex((prev) => incrementWithLoop(prev, total));

    previus.current = currentIndex;
  });

  const virtualizedIndices = getWindowedIndices(currentIndex, option.buffer ?? 1, total);

  return { currentIndex, virtualizedIndices };
};

export const useEmblaEventListeners = (
  emblaApi: EmblaCarouselType | undefined,
  type: EmblaEventType,
  callback: (e: EmblaCarouselType) => void,
) => {
  const preserved = usePreservedCallback(callback);

  useEffect(() => {
    if (!emblaApi) {
      return () => {};
    }
    emblaApi.on(type, preserved);
    return () => emblaApi.off(type, preserved);
  }, [preserved, emblaApi, type]);
};
