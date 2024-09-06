"use client";

import { atom } from "jotai";
import { createSafeAtom } from "./jotai/create-safe-atom";

export const [HomeContextProvider, homeStore] = createSafeAtom(atom("hello"));

export const Hi = HomeContextProvider.with(() => {
  return <He />;
});

const He = () => {
  const [state] = homeStore.useAtom();
  return <div>{state}</div>;
};
