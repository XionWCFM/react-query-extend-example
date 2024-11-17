"use client";

import { useParams } from "next/navigation";

export function useIntParams<T extends string = string>(): Record<T, number> {
  const params = useParams();

  return new Proxy(params, {
    get(target, prop: string) {
      const value = target[prop];

      if (Array.isArray(value)) {
        throw new Error(`Parameter ${prop} should be a single value, but received an array.`);
      }

      const parsedValue = Number.parseInt(value, 10);

      if (Number.isNaN(parsedValue)) {
        throw new Error(`Parameter ${prop} is not a valid number.`);
      }

      return parsedValue;
    },
  }) as unknown as Record<T, number>;
}
