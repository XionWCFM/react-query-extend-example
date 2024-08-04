"use client";

import { Children, isValidElement } from "react";

export type NonEmptyArray<T> = readonly [T, ...T[]];

interface FunnelProps<Steps extends NonEmptyArray<string>> {
  steps: Steps;
  step: Steps[number];
  children: Array<React.ReactElement<StepProps<Steps>>> | React.ReactElement<StepProps<Steps>>;
}

export interface StepProps<Steps extends NonEmptyArray<string>> {
  name: Steps[number];
  onEnter?: () => void;
  children: React.ReactNode;
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

export const Step = <Steps extends NonEmptyArray<string>>({ children }: StepProps<Steps>) => {
  return children;
};
