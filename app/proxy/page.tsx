"use client";

import { useCallback, useEffect, useState } from "react";

type NonEmptyArray<T> = readonly [T, ...T[]];
type FlowOption<T extends NonEmptyArray<string>> = {
  initialStep?: T[number];
};
class Flow<StackList extends NonEmptyArray<string>> {
  list: StackList;
  historyStack: string[];
  currentStep: StackList[number] | null;
  constructor(list: StackList, option?: FlowOption<StackList>) {
    this.list = list;
    this.currentStep = this.createInitialCurrentStep(option?.initialStep);
    this.historyStack = [this.currentStep];
  }

  private createInitialCurrentStep(initial?: string) {
    return initial ?? this.list[0];
  }

  private setHistoryStack(callback: (prev: string[]) => string[]) {
    this.historyStack = callback(this.historyStack);
    this.currentStep = this.historyStack[this.historyStack.length - 1] ?? this.list[0];
  }

  get getCurrentStep(): StackList[number] | null {
    return this.currentStep;
  }

  next(path: StackList[number]) {
    this.setHistoryStack((prev) => [...prev, path]);
  }

  back() {
    this.setHistoryStack((prev) => prev.slice(0, 1));
  }

  clearStack() {
    this.setHistoryStack(() => []);
  }

  filterStack(key: string[]) {
    this.setHistoryStack((prev) => prev.filter((item) => !key.includes(item)));
  }
}
const createProxy = <T extends object>(obj: T, onMethodCall: () => void): T => {
  const handler = {
    get(target: T, prop: keyof T) {
      const value = target[prop];
      if (typeof value === "function") {
        return function (...args: any[]) {
          const result = (value as Function).apply(target, args);
          onMethodCall();
          return result;
        };
      }
      return value;
    },
  };

  //@ts-ignore
  return new Proxy(obj, handler);
};

const useFlow = <StackList extends NonEmptyArray<string>>(list: StackList, option?: FlowOption<StackList>) => {
  const [_, setForce] = useState(0);
  const [flow] = useState(() => new Flow(list, option));
  const proxyFlow = createProxy(flow, () => setForce((prev) => prev + 1));
  return proxyFlow;
};

export default function Home() {
  const flow = useFlow(["a", "b", "c", "d"] as const);
  return (
    <div className="">
      <div className="">{flow.historyStack}</div>
      <div className="">{flow.getCurrentStep}</div>
      <div
        className=""
        onClick={() => {
          console.log(flow);
          flow.next("b");
          console.log(flow);
        }}
      >
        클릭
      </div>
    </div>
  );
}
