"use client";

import { useExtendedMutation } from "~/src/hooks/builder";
import { MutationBuilder } from "~/src/hooks/mutation-builder";
import { SingleFlight } from "~/src/hooks/single-flight";
import { atom, useAtom } from "jotai";
import { flushSync } from "react-dom";
import { useState } from "react";

const exampleAtom = atom<number>(0);
const useExample = () => {
  return useAtom(exampleAtom);
};
export default function Home() {
  const [atom, setAtom] = useExample();
  const [state, setState] = useState(0);
  return (
    <div className="">
      {atom}
      <button
        onClick={() => {
          flushSync(() => {
            setAtom((prev) => prev + 1);
            setState((prev) => prev + 1);
          });
          console.log("atom", atom);
          console.log("state", state);
        }}
      >
        클릭
      </button>
    </div>
  );
}
