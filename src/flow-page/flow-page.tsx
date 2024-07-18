import { useRouter } from "next/navigation";
import { flowReducer } from "../flow/flow-reducer";
import { FlowStateType, FlowOptions, FlowAction, FlowRouterType } from "../flow/flow-type";
import { NonEmptyArray } from "../flow/funnel-and-step";
import { Observable } from "../flow/observable";
import { useEffect } from "react";

const defaultRouter: FlowRouterType = {
  push: function (path: string): void {},
  replace: function (path: string): void {},
  back: function (): void {},
};

export class Flow<T extends NonEmptyArray<string>> extends Observable<FlowStateType<T>> {
  stepList: T;
  step: T[number];
  historyStack: T[number][];
  router: FlowRouterType;
  constructor(stepList: T, options?: FlowOptions<T>) {
    super();
    this.stepList = stepList;
    this.step = options?.initialStep ?? stepList[0];
    this.historyStack = [];
    this.router = options?.router ?? defaultRouter;
  }

  clear = () => {
    this.setter({ step: this.stepList[0], historyStack: [] });
  };

  push = (step: T[number]) => {
    this.dispatch({ type: "NEXT_STEP", payload: step });
  };

  back = (num?: number) => {
    this.dispatch({ type: "BACK", payload: num });
  };

  replace = (step: T[number]) => {
    this.dispatch({ type: "REPLACE_STEP", payload: step });
  };

  filteredStep = (stepList: T[number][]) => {
    this.dispatch({ type: "REMOVE_STEP", payload: stepList });
  };

  addRouter = (router: FlowRouterType) => {
    this.router = router;
  };

  next = () => {
    const nextIndex = this.stepList.findIndex((item) => item === this.step) + 1;
    if (nextIndex < this.stepList.length) {
      this.push(this.stepList[nextIndex]);
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

  private dispatch = (action: FlowAction<T>) => {
    this.setter(flowReducer(this.getSnapshot(), action));
  };

  private setter = (newState: Partial<FlowStateType<T>>) => {
    this.stepList = newState.stepList ?? this.stepList;
    this.step = newState.step ?? this.step;
    this.historyStack = newState.historyStack ?? this.historyStack;
    this.notify(this.getSnapshot());
  };
}

const flow = new Flow(["ah"] as const);
const Hi = () => {
  const router = useRouter();
  useEffect(() => {
    flow.addRouter(router);
  }, []);
};
