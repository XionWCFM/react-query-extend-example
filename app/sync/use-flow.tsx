import { Children, isValidElement, useCallback, useMemo, useReducer } from "react";

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

type FlowStatesType<T extends NonEmptyArray<string>> = {
  stepList: T;
  step: T[number];
  stackCount: number;
  historyStack: T[number][];
};

type FlowOptionsType<T extends NonEmptyArray<string>> = {
  initialStep?: T[number];
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
    };

const flowReducer = <T extends NonEmptyArray<string>>(
  state: FlowStatesType<T>,
  action: Action<T>,
): FlowStatesType<T> => {
  const { type, payload } = action;
  switch (type) {
    case "CLEAR":
      return {
        ...state,
        step: state.stepList[0],
        stackCount: 0,
        historyStack: [],
      };
    case "NEXT_STEP":
      if (state.step === payload) return state;
      return {
        ...state,
        step: payload,
        stackCount: state.stackCount + 1,
        historyStack: [...state.historyStack, state.step],
      };
    case "BACK":
      const backStepNum = payload ?? 1;
      const stackCount = Math.max(state.stackCount - backStepNum, 0);
      return {
        ...state,
        step: state.historyStack[stackCount],
        stackCount,
        historyStack: state.historyStack.slice(0, stackCount),
      };
    case "REMOVE_STEP":
      const stepList = Array.isArray(payload) ? payload : [payload];
      const filteredHistoryStack = state.historyStack.filter((step) => !stepList.includes(step));
      const removedCount = state.historyStack.length - filteredHistoryStack.length;
      return {
        ...state,
        step: state.step,
        stackCount: Math.max(state.stackCount - removedCount, 0),
        historyStack: filteredHistoryStack,
      };
    default:
      throw new Error("Invalid action type");
  }
};

export const useFlow = <T extends NonEmptyArray<string>>(stepList: T, options?: FlowOptionsType<T>) => {
  const initialState = {
    stepList,
    step: options?.initialStep ?? stepList[0],
    stackCount: 0,
    historyStack: [],
  } satisfies FlowStatesType<T>;

  const [state, dispatch] = useReducer(flowReducer<T>, initialState);

  const nextStep = useCallback((step: T[number]) => dispatch({ type: "NEXT_STEP", payload: step }), []);
  const back = useCallback((num?: number) => dispatch({ type: "BACK", payload: num }), []);
  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const removeStep = useCallback(
    (step: T[number] | T[number][]) => dispatch({ type: "REMOVE_STEP", payload: step }),
    [],
  );

  const FunnelComponent = useMemo(() => {
    return Object.assign(
      (props: RouteFunnelProps<T>) => <Funnel<T> step={state.step} steps={state.stepList} {...props} />,
      { Step: (props: StepProps<T>) => <Step {...props} /> },
    );
  }, [state.step, state.stepList]);

  return [FunnelComponent, { ...state, nextStep, back, clear, removeStep }] as const;
};
