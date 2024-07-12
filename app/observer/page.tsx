"use client";
import { Dispatch, PropsWithChildren, SetStateAction, useEffect, useState } from "react";
import { usePreservedCallback } from "~/src/packages/use-preserved-callback";

type Observer<T> = (data: T) => void;

class Observable<T> {
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

const ObserverContainer = <T,>(
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

const hello = new Observable<number>();

export default function Page() {
  const [state, setState] = useState(0);

  return (
    <ObserverContainer
      observable={hello}
      observer={(data) => {
        setState(data);
      }}
    >
      <div className="">현재 데이터 {state}</div>
      <Comp />
    </ObserverContainer>
  );
}

const Comp = () => {
  return (
    <button
      onClick={() => {
        hello.notifyObservers(15);
      }}
    >
      클릭
    </button>
  );
};
