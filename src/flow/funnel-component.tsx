import {
  Children,
  cloneElement,
  isValidElement,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Pubsub } from "./pubsub";
import { FunnelEvent } from "./flow";
import { useTimeout } from "./use-timeout";

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
  onNeedMore?: () => void;
}

export interface GuardProps {
  pubsub: Pubsub<FunnelEvent>;
  condition: boolean | (() => boolean | Promise<boolean>);
  children?: ReactNode;
  fallback?: ReactNode;
  delay?: number;
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

export const Step = <Steps extends NonEmptyArray<string>>({ children, pubsub, onNeedMore }: StepProps<Steps>) => {
  const handler = onNeedMore ?? noop;
  useEffect(() => {
    const unsubscribe = pubsub?.subscribe("FUNNEL_STOP", handler);
    return () => unsubscribe?.();
  }, []);
  return children;
};

export const Guard = ({ pubsub, condition, children, fallback, delay }: GuardProps) => {
  const show = useTimeout(delay ?? 0);
  const [isRender, setIsRender] = useState(false);
  const isOnce = useRef(true);

  const isConditionBoolean = typeof condition === "boolean" && condition;
  const conditionResult = typeof condition === "function" && condition();
  const isSyncResult = typeof condition === "function" && !(conditionResult instanceof Promise) && conditionResult;

  const canImediatelyRender = isConditionBoolean || isSyncResult;

  useEffect(() => {
    let result: boolean;
    const check = async () => {
      if (typeof condition === "function") {
        result = await condition();
        setIsRender(result);
      } else {
        setIsRender(condition);
        result = condition;
      }
      if (result === false) {
        pubsub.publish("FUNNEL_STOP");
      }
    };
    if (isOnce.current) {
      check();
      isOnce.current = false;
    }
  }, []);
  console.log("canImediatelyRender", canImediatelyRender);
  console.log("isSyncresult", isSyncResult);

  return canImediatelyRender || isRender ? children : show ? fallback : null;
};

const noop = () => {};
