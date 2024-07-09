"use client";

import { ReactNode } from "react";

class Observable {
  observers: ((...args: any[]) => void)[];
  constructor() {
    this.observers = [];
  }

  subscribe(func: (...args: any[]) => void) {
    this.observers.push(func);
  }

  unsubscribe(func: (...args: any[]) => void) {
    this.observers = this.observers.filter((observer) => observer !== func);
  }

  notify(data: any) {
    this.observers.forEach((observer) => observer(data));
  }
}

const observable = new Observable();

const logger = (data: any) => {
  console.log(`${Date.now()} ${data}`);
};

observable.subscribe(logger);

export default function Home() {
  const handleClick = () => {
    observable.notify("click");
  };
  return (
    <div className="">
      <button onClick={handleClick}>클릭</button>
    </div>
  );
}
