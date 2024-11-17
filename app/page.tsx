"use client";
import { createSafeAtom, createReusableAtom } from "@xionwcfm/jotai";
import { atom, useAtom, useAtomValue } from "jotai";
import { useMemo, useState, type PropsWithChildren } from "react";

const hiStore = createReusableAtom({ hello: "dsa", hi: 0 });

const HiProvider = ({ children }: PropsWithChildren) => {
  return <hiStore.Provider>{children}</hiStore.Provider>;
};

export default function Page() {
  return (
    <HiProvider>
      <Hello />
      <Counter />
    </HiProvider>
  );
}

const Hello = () => {
  const [hello, set] = hiStore.useAtom();
  console.log("헬로 리렌더");
  return (
    <div>
      {hello.hello}
      <button type="button" onClick={() => set((prev) => ({ ...prev, hello: Math.random().toString() }))}>
        클릭
      </button>
    </div>
  );
};

const Counter = () => {
  const value = useAtomValue(hiStore.useDrivedAtom((value) => value.hi));
  const setter = hiStore.useSetAtom();
  console.log("카운터 리렌더");
  return (
    <div>
      {value}
      <button type="button" onClick={() => setter({ hello: "hi", hi: value + 1 })}>
        클릭
      </button>
    </div>
  );
};
