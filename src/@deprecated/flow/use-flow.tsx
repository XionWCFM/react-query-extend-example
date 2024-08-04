import { useState, useEffect, useMemo } from "react";
import { usePreservedReference } from "../hooks/use-preserved-reference";
import { Flow } from "./flow";
import { FlowOptions, FlowStateType } from "./flow-type";
import { NonEmptyArray, RouteFunnelProps, Funnel, Step, StepProps } from "./funnel-and-step";

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
