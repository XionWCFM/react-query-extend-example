"use client";
import { useSyncExternalStore } from "react";

type StoreType<T> = {
  getSnapshot: () => T;
  subscribe: (callback: () => void) => () => void;
  update: (value: T) => void;
};

const createStore = <T extends unknown>(initialValue: T): StoreType<T> => {
  let currentValue = initialValue;
  const listeners: Set<() => void> = new Set();
  const subscribe = (callback: () => void) => {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  };

  const getSnapshot = () => currentValue;

  const update = (value: T) => {
    currentValue = value;
    listeners.forEach((listener) => listener());
  };

  return {
    getSnapshot,
    subscribe,
    update,
  };
};

export const createExternalStore = <T extends unknown>(initialValue: T) => {
  const store = createStore(initialValue);
  const useStore = () => {
    return useSyncExternalStore(store.subscribe, store.getSnapshot);
  };
  const update = store.update;
  return [useStore, update] as const;
};
