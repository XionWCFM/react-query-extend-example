"use client";
import { Dispatch, PropsWithChildren, SetStateAction, useEffect, useState } from "react";
import { usePreservedCallback } from "~/src/packages/use-preserved-callback";

type Observer<T> = (data: T) => void;

class Observable<T> {
  private observers: Observer<T>[] = [];

  subscribe(observer: Observer<T>): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer<T>): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(data: T): void {
    this.observers.forEach((observer) => observer(data));
  }
}

class Counter extends Observable<number> {
  count: number;
  constructor() {
    super();
    this.count = 0;
  }
  increment() {
    this.dispatch((prev) => prev + 1);
  }

  decrement() {
    this.dispatch((prev) => prev - 1);
  }

  getSnapshot() {
    return this.count;
  }

  private dispatch(fn: (num: number) => number) {
    this.count = fn(this.count);
    this.notify(this.count);
  }
}

const counter = new Counter();

const handleClick = () => {
  counter.increment()
}
const NotWorkingComponent = () => {
  const [count, setCount] = useState(() => counter.getSnapshot());
  useEffect(() => {
    counter.subscribe(setCount);
    return () => {
      counter.unsubscribe(setCount);
    };
  }, []);

  return (
    <div>
      <div>{counter.count}</div>
      <div>{count}</div>
      <button onClick={handleClick}>increment</button>
    </div>
  );
};

export default function Page() {
  return <NotWorkingComponent />;
}
