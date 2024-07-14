"use client";
import { PropsWithChildren, useEffect } from "react";
import { usePreservedCallback } from "../packages/use-preserved-callback";

export type Observer<T> = (data: T) => void;

export class Observable<T> {
  private observers: Observer<T>[] = [];

  addObserver(observer: Observer<T>): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer<T>): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notifyObservers(data: T): void {
    this.observers.forEach((observer) => observer(data));
  }
}

const noop = () => {};

export const ObserverContainer = <T,>(
  props: PropsWithChildren & { observable: Observable<T>; observers?: Observer<T>[]; observer?: Observer<T> },
) => {
  const { observable, observers, observer, children } = props;
  const callback = usePreservedCallback(observer ?? noop);
  useEffect(() => {
    observers?.forEach((observer) => observable.addObserver(observer));
    observable.addObserver(callback);
    return () => {
      observers?.forEach((observer) => observable.removeObserver(observer));
      observable.removeObserver(callback);
    };
  }, [observable, observers, callback]);

  return children;
};