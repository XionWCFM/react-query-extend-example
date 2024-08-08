"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ABTest, ABTestQueryOptions } from "~/src/ab-test";

export default function Page() {
  const { data: ab } = useSuspenseQuery(ABTestQueryOptions());
  return (
    <ABTest.Provider<"A" | "B"> value={ab}>
      <ABTest.Case name="A">
        <HelloWorld />
      </ABTest.Case>
      <ABTest.Case name="B">
        <HelloWorld />
      </ABTest.Case>
    </ABTest.Provider>
  );
}

const HelloWorld = () => {
  const ab = ABTest.useABTest();

  return <div>{ab}hello</div>;
};
