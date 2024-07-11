"use client";
import { Children, isValidElement, useCallback, useMemo, useState } from "react";

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
};

class Flow<T extends NonEmptyArray<string>> {
  stepList: T;
  currentStep: T[number];
  stackCount: number;
  historyStack: T[number][];
  constructor(stepList: T, options?: FlowOptions<T>) {
    this.stepList = stepList;
    this.currentStep = options?.initialStep ?? stepList[0];
    this.stackCount = 0;
    this.historyStack = [];
  }

  clear() {
    this.currentStep = this.stepList[0];
    this.stackCount = 0;
    this.historyStack = [];
  }

  nextStep(step: T[number]) {
    if (this.lastStack() === step) return;
    this.historyStack = [...this.historyStack, this.currentStep];
    this.currentStep = step;
    this.updateCount();
  }

  back(num?: number) {
    const backStepNum = this.isUndefined(num) ? 1 : num;
    this.stackCount = Math.max(this.stackCount - backStepNum, 0);
    this.currentStep = this.historyStack[this.stackCount];
    this.historyStack = this.historyStack.slice(0, this.stackCount);
  }

  filteredStep(stepList: T[number][]) {
    const filteredHistoryStack = this.historyStack.filter((step) => !stepList.includes(step));
    const removedCount = this.historyStack.length - filteredHistoryStack.length;
    this.historyStack = filteredHistoryStack;
    this.stackCount = Math.max(this.stackCount - removedCount, 0);
  }
  private updateCount() {
    this.stackCount = this.historyStack.length;
  }
  private lastStack() {
    return this.historyStack[this.historyStack.length - 1];
  }
  private isUndefined(value: unknown): value is undefined {
    return typeof value === "undefined";
  }
}

export const useFlow = <T extends NonEmptyArray<string>>(stepList: T, options?: FlowOptions<T>) => {
  const [flow] = useState<Flow<T>>(() => new Flow(stepList, options));

  const [state, setState] = useState({
    currentStep: flow.currentStep,
    stackCount: flow.stackCount,
    historyStack: flow.historyStack,
  });
  const currentStep = state.currentStep;
  const stackCount = state.stackCount;
  const historyStack = state.historyStack;

  const sync = useCallback(() => {
    setState((prevState) =>
      prevState.currentStep === flow.currentStep && prevState.stackCount === flow.stackCount
        ? prevState
        : { currentStep: flow.currentStep, stackCount: flow.stackCount, historyStack: flow.historyStack },
    );
  }, [flow.currentStep, flow.historyStack, flow.stackCount]);

  const clear = useCallback(() => {
    flow.clear();
    sync();
  }, [flow, sync]);
  const nextStep = useCallback(
    (step: T[number]) => {
      flow.nextStep(step);
      sync();
    },
    [flow, sync],
  );
  const back = useCallback(
    (num?: number) => {
      flow.back(num);
      sync();
    },
    [flow, sync],
  );
  const filteredStep = useCallback(
    (stepList: T[number][]) => {
      flow.filteredStep(stepList);
      sync();
    },
    [flow, sync],
  );

  const FunnelComponent = useMemo(() => {
    return Object.assign(
      (props: RouteFunnelProps<T>) => <Funnel<T> step={flow.currentStep} steps={flow.stepList} {...props} />,
      { Step: (props: StepProps<T>) => <Step {...props} /> },
    );
  }, [flow.currentStep, flow.stepList]);

  const externalFlow = {
    stepList,
    currentStep,
    stackCount,
    historyStack,
    clear,
    nextStep,
    back,
    filteredStep,
  };
  return [FunnelComponent, externalFlow] as const;
};
