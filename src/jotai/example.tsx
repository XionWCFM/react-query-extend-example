import { createSafeAtom } from "@xionwcfm/jotai";
import { atom } from "jotai";
import { PropsWithChildren, useState } from "react";

export const reusableStore = createSafeAtom(atom(""));

export const ReusableContextProvider = ({ children, initial }: PropsWithChildren<{ initial: string }>) => {
  const [value] = useState(() => atom(initial));

  return <reusableStore.Provider value={value}>{children}</reusableStore.Provider>;
};

export const ReusableConsumer = ({ children }: PropsWithChildren) => {
  const state = reusableStore.useAtomValue();
  return (
    <div>
      {state}
      {children}
    </div>
  );
};
