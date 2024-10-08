import type { ReactNode } from "react";
import type { FunnelPubsub } from "./funnel-pubsub";

export type NonEmptyArray<T> = readonly [T, ...T[]];

export type RoutesEventType = "replace" | "push" | "pop";

export type FunnelStepChangeFunction = (
  step: string,
  options?: RoutesEventType
) => void;

export type RouteFunnelProps<Steps extends NonEmptyArray<string>> = Omit<
  FunnelProps<Steps>,
  "steps" | "step"
>;

export type FlowOptions<T extends NonEmptyArray<string>> = {
  step?: T[number];
  done?: (doneUrl: string) => void;
  initialStep?: T[number];
  funnelId?: string;
  pubsub?: FunnelPubsub;
};

export type FunnelEvent = "FUNNEL_RESTRICT_EVENT";

export interface FunnelProps<Steps extends NonEmptyArray<string>> {
  steps: Steps;
  step: Steps[number];
  children:
    | Array<React.ReactElement<StepProps<Steps>>>
    | React.ReactElement<StepProps<Steps>>;
}

export interface StepProps<Steps extends NonEmptyArray<string>> {
  name: Steps[number];
  children: React.ReactNode;
  pubsub?: FunnelPubsub;
  onFunnelRestrictEvent?: () => void;
}

export interface GuardProps {
  pubsub: FunnelPubsub;
  condition: boolean | (() => boolean | Promise<boolean>);
  children?: ReactNode;
  fallback?: ReactNode;
}
