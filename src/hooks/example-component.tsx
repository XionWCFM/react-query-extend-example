"use client";
import { ReactNode } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { exampleOptions } from "./use-example-query";

type ExampleComponentProps = {
  children?: ReactNode;
};

export const ExampleComponent = (props: ExampleComponentProps) => {
  const query = useSuspenseQuery(exampleOptions());
  return <div>result : {query.data}</div>;
};
