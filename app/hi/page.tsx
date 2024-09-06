"use client";

import { useState } from "react";
import { ReusableConsumer, ReusableContextProvider } from "~/src/jotai/example";

export default function Page() {
  const [state, setState] = useState<string[]>([]);
  const createId = () => {
    return `${new Date().toISOString()}${Math.random().toString(36).substr(2, 9)}`;
  };
  return (
    <div>
      <button
        onClick={() => {
          setState((prev) => [
            ...prev,
            createId(),
            createId(),
            createId(),
            createId(),
            createId(),
            createId(),
            createId(),
            createId(),
            createId(),
            createId(),
            createId(),
          ]);
        }}
      >
        추가
      </button>
      <button
        onClick={() => {
          setState([]);
        }}
      >
        리셋
      </button>
      {state.map((item) => (
        <ReusableContextProvider key={item} initial={item}>
          <ReusableConsumer key={item}></ReusableConsumer>
        </ReusableContextProvider>
      ))}
    </div>
  );
}
