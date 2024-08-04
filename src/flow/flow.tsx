import { useState, useMemo, useEffect } from "react";
import { Funnel, Guard, GuardProps, NonEmptyArray, RouteFunnelProps, Step, StepProps } from "./funnel-component";
import { useDraft } from "./use-draft";
import { Pubsub } from "./pubsub";

type RoutesEventType = { type?: "replace" | "push" | "back" };

export type FunnelStepChangeFunction = (step: string, options?: RoutesEventType) => void;

type FlowOptions<T extends NonEmptyArray<string>> = {
  step?: T[number];
  done?: (doneUrl: string) => void;
  initialStep?: T[number];
  funnelId?: string;
  pubsub?: Pubsub;
};

export type FunnelEvent = "FUNNEL_STOP";

export const useFunnelEvent = <T extends NonEmptyArray<string>>(
  pubsub: Pubsub<FunnelEvent>,
  funnelEventType: FunnelEvent,
  handler: (step: T[number]) => void,
) => {
  useEffect(() => {
    const unsubscribe = pubsub.subscribe(funnelEventType, handler);
    return () => {
      unsubscribe();
    };
  }, [handler, pubsub]);
};

export const useFlow = <Steps extends NonEmptyArray<string>>(steps: Steps, options?: FlowOptions<Steps>) => {
  const initialState = options?.initialStep ?? steps[0];
  const [_step, _setStep] = useDraft(initialState);
  const [_pubsub] = useState(() => new Pubsub<FunnelEvent>());
  const step = options?.step ?? _step;
  const funnelId = options?.funnelId ?? "step";
  const pubsub = options?.pubsub ?? _pubsub;
  const _onStepChange = (param: Steps[number]) => {
    _setStep(param);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const FunnelComponent = useMemo(() => {
    // eslint-disable-next-line react/display-name
    return Object.assign(
      (props: RouteFunnelProps<Steps>) => {
        return <Funnel<Steps> step={step} steps={steps} {...props} />;
      },
      {
        Step: (props: Omit<StepProps<Steps>, "pubsub">) => {
          return <Step pubsub={pubsub} {...props} />;
        },
        Guard: (props: Omit<GuardProps, "pubsub">) => {
          return <Guard pubsub={pubsub} {...props} />;
        },
      },
    );
  }, [step, steps]);

  return [FunnelComponent, { funnelId, step, pubsub, onStepChange: _onStepChange }] as const;
};
