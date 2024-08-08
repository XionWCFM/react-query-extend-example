"use client";

import { queryOptions, } from "@tanstack/react-query";
import { Children, createContext, isValidElement, ReactElement, ReactNode, useContext } from "react";

const ABTestContext = createContext<null | string>(null);

export const ABTestQueryOptions = () =>
  queryOptions({
    queryKey: ["ab"],
    queryFn: async () => {
      return "B" as const;
    },
  });

const useABTest = () => {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error("ABTestContext is not provided");
  }
  return context;
};

const ABTestProvider = <T extends string>({ children, value }: ABProviderProps<T>) => {
  const validChildren = Children.toArray(children)
    .filter(isValidElement)
    .filter((item) => (item.props as CaseProps<T>)?.name === value);

  return <ABTestContext.Provider value={value}>{validChildren}</ABTestContext.Provider>;
};

type ABProviderProps<T extends string> = {
  children: Array<ReactElement<CaseProps<T>>> | ReactElement<CaseProps<T>>;
  value: T;
};

type CaseProps<T extends string> = { children?: ReactNode; name: T };

const Case = <T extends string>(props: CaseProps<T>) => {
  return props.children;
};

export const ABTest = {
  Provider: ABTestProvider,
  Case: Case,
  useABTest: useABTest,
};
