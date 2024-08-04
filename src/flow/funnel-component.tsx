import { Children, isValidElement, ReactNode, useEffect, useRef, useState } from "react";
import { Pubsub } from "./pubsub";
import { FunnelEvent } from "./flow";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

export type NonEmptyArray<T> = readonly [T, ...T[]];

export interface FunnelProps<Steps extends NonEmptyArray<string>> {
  steps: Steps;
  step: Steps[number];
  children: Array<React.ReactElement<StepProps<Steps>>> | React.ReactElement<StepProps<Steps>>;
}

export interface StepProps<Steps extends NonEmptyArray<string>> {
  name: Steps[number];
  children: React.ReactNode;
  pubsub?: Pubsub<FunnelEvent>;
  onFunnelRestrictEvent?: () => void;
}

export interface GuardProps {
  pubsub: Pubsub<FunnelEvent>;
  condition: boolean | (() => boolean | Promise<boolean>);
  children?: ReactNode;
  fallback?: ReactNode;
}

export type RouteFunnelProps<Steps extends NonEmptyArray<string>> = Omit<FunnelProps<Steps>, "steps" | "step">;

export const Funnel = <Steps extends NonEmptyArray<string>>({ step, steps, children }: FunnelProps<Steps>) => {
  const validChildren = Children.toArray(children)
    .filter(isValidElement)
    .filter((item) => steps.includes((item.props as Partial<StepProps<Steps>>).name ?? "")) as Array<
    React.ReactElement<StepProps<Steps>>
  >;
  const targetStep = validChildren.find((child) => child.props.name === step);
  return <>{targetStep}</>;
};

export const Step = <Steps extends NonEmptyArray<string>>({
  children,
  pubsub,
  onFunnelRestrictEvent,
}: StepProps<Steps>) => {
  const handler = onFunnelRestrictEvent ?? noop;
  useIsomorphicLayoutEffect(() => {
    const unsubscribe = pubsub?.subscribe("FUNNEL_STOP", handler);
    return () => unsubscribe?.();
  }, []);
  return children;
};

export const Guard = ({ pubsub, condition, children, fallback }: GuardProps) => {
  const [isRender, setIsRender] = useState(false);
  const isOnce = useRef(true);
  const canImmediateRender =
    (typeof condition === "boolean" && condition) ||
    (typeof condition === "function" && typeof condition() === "boolean" && condition());

  useEffect(() => {
    let result: boolean;
    const check = async () => {
      if (canImmediateRender) {
        return () => {};
      }

      if (typeof condition === "function") {
        result = await condition();
        if (result === false) {
          pubsub.publish("FUNNEL_STOP");
        } else {
          setIsRender(true);
        }
      }

      if (typeof condition === "boolean") {
        if (condition === false) {
          console.log("work???");
          pubsub.publish("FUNNEL_STOP");
        } else {
          setIsRender(true);
        }
      }
    };

    if (isOnce.current) {
      check();
      isOnce.current = false;
    }
  }, []);

  return canImmediateRender || isRender ? children : fallback;
};

const noop = () => {};
