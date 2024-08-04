import { NonEmptyArray } from "./funnel-and-step";
export type FlowRouterType = {
  push: (path: string) => void;
  replace: (path: string) => void;
  back: (num: number) => void;
};

export type FlowOptions<T extends NonEmptyArray<string>> = {
  initialStep?: T[number];
  plugin?: FlowPlugin<T>[];
  externalState?: FlowStateType<T>;
  externalSetter?: (snapshot: FlowStateType<T>) => void;
  router?: FlowRouterType;
};

export type FlowStateType<T extends NonEmptyArray<string>> = {
  stepList: T;
  step: T[number];
  historyStack: T[number][];
};

export type FlowAction<T extends NonEmptyArray<string>> =
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

export type FlowPlugin<T extends NonEmptyArray<string>> =
  | {
      type: "storage";
      save(state: FlowStateType<T>): void;
      load(): FlowStateType<T> | null;
    }
  | {
      type: "navigation";
      onNavigate: (prevState: FlowStateType<T>, newState: FlowStateType<T>) => void;
    };
