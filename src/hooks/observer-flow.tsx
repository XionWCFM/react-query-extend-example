"use client";

import { Children, isValidElement, useEffect, useMemo, useState } from "react";
import { usePreservedReference } from "./use-preserved-reference";

type Observer<T> = (data: T) => void;

class Observable<T> {
  private observers: Observer<T>[] = [];

  subscribe(observer: Observer<T>): () => void {
    this.observers.push(observer);
    return () => {
      this.unsubscribe(observer);
    };
  }

  unsubscribe(observer: Observer<T>): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(data: T): void {
    this.observers.forEach((observer) => observer(data));
  }
}

type NonEmptyArray<T> = readonly [T, ...T[]];

interface FunnelProps<Steps extends NonEmptyArray<string>> {
  steps: Steps;
  step: Steps[number];
  children: Array<React.ReactElement<StepProps<Steps>>> | React.ReactElement<StepProps<Steps>>;
}

interface StepProps<Steps extends NonEmptyArray<string>> {
  name: Steps[number];
  onEnter?: () => void;
  children: React.ReactNode;
}
type RouteFunnelProps<Steps extends NonEmptyArray<string>> = Omit<FunnelProps<Steps>, "steps" | "step">;

const Funnel = <Steps extends NonEmptyArray<string>>({ step, steps, children }: FunnelProps<Steps>) => {
  const validChildren = Children.toArray(children)
    .filter(isValidElement)
    .filter((item) => steps.includes((item.props as Partial<StepProps<Steps>>).name ?? "")) as Array<
    React.ReactElement<StepProps<Steps>>
  >;
  const targetStep = validChildren.find((child) => child.props.name === step);
  return <>{targetStep}</>;
};

const Step = <Steps extends NonEmptyArray<string>>({ children }: StepProps<Steps>) => {
  return children;
};

type FlowOptions<T extends NonEmptyArray<string>> = {
  initialStep?: T[number];
  plugin?: FlowPlugin<T>[];
  externalState?: FlowStateType<T>;
  externalSetter?: (snapshot: FlowStateType<T>) => void;
};

type FlowStateType<T extends NonEmptyArray<string>> = {
  stepList: T;
  step: T[number];
  historyStack: T[number][];
};

type Action<T extends NonEmptyArray<string>> =
  | {
      type: "NEXT_STEP";
      payload: T[number];
    }
  | {
      type: "CLEAR";
      payload?: undefined | null | unknown;
    }
  | {
      type: "BACK";
      payload: number | undefined;
    }
  | {
      type: "REMOVE_STEP";
      payload: T[number][] | T[number];
    }
  | {
      type: "REPLACE_STEP";
      payload: T[number];
    };

type FlowPlugin<T extends NonEmptyArray<string>> =
  | {
      type: "storage";
      save(state: FlowStateType<T>): void;
      load(): FlowStateType<T> | null;
    }
  | {
      type: "navigation";
      onNavigate: (prevState: FlowStateType<T>, newState: FlowStateType<T>) => void;
    };

export class Flow<T extends NonEmptyArray<string>> extends Observable<FlowStateType<T>> {
  stepList: T;
  step: T[number];
  historyStack: T[number][];
  private pluginList?: FlowPlugin<T>[];

  constructor(stepList: T, options?: FlowOptions<T>) {
    super();
    this.stepList = stepList;
    this.step = options?.initialStep ?? stepList[0];
    this.historyStack = [];
    this.pluginList = options?.plugin ?? [];

    if (typeof window !== "undefined") {
      this.pluginList.forEach((plugin) => {
        if (plugin.type === "storage") {
          const savedState = plugin.load();
          if (savedState) {
            this.dispatch(savedState);
          }
        }
      });
    }
  }

  clear = () => {
    this.dispatch({
      step: this.stepList[0],
      historyStack: [],
    });
  };

  pushStep = (step: T[number]) => {
    this.dispatch(this.reducer(this.getSnapshot(), { type: "NEXT_STEP", payload: step }));
  };

  back = (num?: number) => {
    this.dispatch(this.reducer(this.getSnapshot(), { type: "BACK", payload: num }));
  };

  replaceStep = (step: T[number]) => {
    this.dispatch(this.reducer(this.getSnapshot(), { type: "REPLACE_STEP", payload: step }));
  };

  filteredStep = (stepList: T[number][]) => {
    this.dispatch(this.reducer(this.getSnapshot(), { type: "REMOVE_STEP", payload: stepList }));
  };

  nextStep = () => {
    const nextIndex = this.stepList.findIndex((item) => item === this.step) + 1;
    if (nextIndex < this.stepList.length) {
      this.pushStep(this.stepList[nextIndex]);
    }
  };

  getPrevStep = (): T[number] | undefined => {
    return this.historyStack[this.historyStack.length - 1];
  };

  getStackCount = (): number => {
    return this.historyStack.length;
  };

  getSnapshot = (): FlowStateType<T> => {
    return {
      stepList: this.stepList,
      step: this.step,
      historyStack: this.historyStack,
    };
  };

  private dispatch(newState: Partial<FlowStateType<T>>) {
    const prevState = this.getSnapshot();
    this.stepList = newState.stepList ?? this.stepList;
    this.step = newState.step ?? this.step;
    this.historyStack = newState.historyStack ?? this.historyStack;
    this.notify(this.getSnapshot());

    if (typeof window !== "undefined") {
      this.pluginList?.forEach((plugin) => {
        if (plugin.type === "storage") {
          plugin.save(this.getSnapshot());
        }
        if (plugin.type === "navigation") {
          plugin.onNavigate(prevState, this.getSnapshot());
        }
      });
    }
  }

  private reducer(state: FlowStateType<T>, action: Action<T>): FlowStateType<T> {
    const { type, payload } = action;
    switch (type) {
      case "CLEAR": {
        return {
          ...state,
          step: state.stepList[0],
          historyStack: [],
        };
      }
      case "NEXT_STEP": {
        if (state.step === payload) return state;
        return {
          ...state,
          step: payload,
          historyStack: [...state.historyStack, state.step],
        };
      }

      case "BACK": {
        const historyStack = state.historyStack.slice();
        const num = payload ?? 1;
        let pop: T[number] = this.stepList[0];
        for (let i = 0; i < num; i++) {
          const popResult = historyStack.pop();
          if (popResult) {
            pop = popResult;
          } else {
            break;
          }
        }
        return { ...state, historyStack: historyStack, step: pop ?? state.stepList[0] };
      }

      case "REMOVE_STEP": {
        const stepList = Array.isArray(payload) ? payload : [payload];
        const filteredHistoryStack = state.historyStack.filter((step) => !stepList.includes(step));
        return {
          ...state,
          step: state.step,
          historyStack: filteredHistoryStack,
        };
      }
      case "REPLACE_STEP": {
        if (state.step === payload) return state;
        return {
          ...state,
          step: payload,
        };
      }

      default:
        throw new Error("Invalid action type");
    }
  }

  static createLocalStoragePlugin = <T extends NonEmptyArray<string>>(key: string): FlowPlugin<T> => {
    return {
      type: "storage",
      save(state: FlowStateType<T>) {
        if (typeof window !== "undefined") {
          localStorage.setItem(key, JSON.stringify(state));
        }
      },
      load() {
        if (typeof window !== "undefined") {
          const savedState = localStorage.getItem(key);
          if (savedState) {
            try {
              return JSON.parse(savedState) as FlowStateType<T>;
            } catch (error) {
              console.error("Failed to parse flow state from local storage:", error);
            }
          }
        }
        return null;
      },
    };
  };

  static createNavigationPlugin = <T extends NonEmptyArray<string>>(): FlowPlugin<T> => {
    return {
      type: "navigation",
      onNavigate(prevState, newState) {
        if (typeof window === "undefined") return;
        const stackCount = newState.historyStack.length;
        if (stackCount > prevState.historyStack.length) {
          window.history.pushState({ stackCount }, "", "");
        } else if (stackCount < prevState.historyStack.length) {
          window.history.replaceState({ stackCount }, "", "");
        }
      },
    };
  };
}

type FlowReturnType<T extends NonEmptyArray<string>> = ((props: RouteFunnelProps<T>) => JSX.Element) & {
  Step: (props: StepProps<T>) => JSX.Element;
};

type FlowTupleReturnType<T extends NonEmptyArray<string>> = [FlowReturnType<T>, Flow<T>];

type UseFlowStructureType<T extends NonEmptyArray<string>> =
  | ((flow: Flow<T>) => FlowTupleReturnType<T>)
  | ((list: T, options?: FlowOptions<T>) => FlowTupleReturnType<T>);

export function useFlow<T extends NonEmptyArray<string>>(
  ...args: Parameters<UseFlowStructureType<T>>
): FlowTupleReturnType<T> {
  const [flowOrList, options] = args;
  const flow = usePreservedReference(flowOrList instanceof Flow ? flowOrList : new Flow(flowOrList, options));
  const [state, setState] = useState<FlowStateType<T>>(() => flow.getSnapshot());
  useEffect(() => {
    flow.subscribe(setState);
    return () => {
      flow.unsubscribe(setState);
    };
  }, [flow]);

  const FunnelComponent = useMemo(() => {
    return Object.assign(
      (props: RouteFunnelProps<T>) => <Funnel<T> step={state.step} steps={state.stepList} {...props} />,
      { Step: (props: StepProps<T>) => <Step {...props} /> },
    );
  }, [state.step, state.stepList]);

  return [FunnelComponent, flow] as const;
}
