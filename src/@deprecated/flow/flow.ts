import { flowReducer } from "./flow-reducer";
import { FlowStateType, FlowPlugin, FlowOptions, FlowAction } from "./flow-type";
import { NonEmptyArray } from "./funnel-and-step";
import { Observable } from "./observable";

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

    this.pluginList.forEach((plugin) => {
      if (plugin.type === "storage") {
        const savedState = plugin.load();
        if (savedState) {
          this.setter(savedState);
        }
      }
    });
  }

  clear = () => {
    this.setter({
      step: this.stepList[0],
      historyStack: [],
    });
  };

  pushStep = (step: T[number]) => {
    this.dispatch({ type: "NEXT_STEP", payload: step });
  };

  back = (num?: number) => {
    this.dispatch({ type: "BACK", payload: num });
  };

  replaceStep = (step: T[number]) => {
    this.dispatch({ type: "REPLACE_STEP", payload: step });
  };

  filteredStep = (stepList: T[number][]) => {
    this.dispatch({ type: "REMOVE_STEP", payload: stepList });
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

  private dispatch = (action: FlowAction<T>) => {
    this.setter(flowReducer(this.getSnapshot(), action));
  };

  private setter = (newState: Partial<FlowStateType<T>>) => {
    const prevState = this.getSnapshot();
    this.stepList = newState.stepList ?? this.stepList;
    this.step = newState.step ?? this.step;
    this.historyStack = newState.historyStack ?? this.historyStack;
    this.notify(this.getSnapshot());

    this.pluginList?.forEach((plugin) => {
      if (plugin.type === "storage") {
        plugin.save(this.getSnapshot());
      }
      if (plugin.type === "navigation") {
        plugin.onNavigate(prevState, this.getSnapshot());
      }
    });
  };
}
