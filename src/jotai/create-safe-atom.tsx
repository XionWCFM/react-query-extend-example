import { createContext, PropsWithChildren, useContext } from "react";
import { useAtom, useAtomValue, useSetAtom, WritableAtom } from "jotai";

export const createSafeAtom = <Value, Args extends unknown[] = unknown[], Result = any>(
  initialvalue: WritableAtom<Value, Args, Result>,
) => {
  const Context = createContext<WritableAtom<Value, Args, Result> | null>(null);
  const useSafeContext = () => {
    const value = useContext(Context);
    if (!value) {
      throw new Error("should provide context");
    }
    return value;
  };
  const Provider = ({ children }: PropsWithChildren) => {
    return <Context.Provider value={initialvalue}>{children}</Context.Provider>;
  };

  const useSetContextAtom = () => {
    return useSetAtom(useSafeContext());
  };
  const useContextAtomValue = () => {
    return useAtomValue(useSafeContext());
  };
  const useContextAtom = () => {
    return useAtom(useSafeContext());
  };

  const hooks = {
    useAtom: useContextAtom,
    useAtomValue: useContextAtomValue,
    useSetAtom: useSetContextAtom,
  };

  return [Provider, hooks] as const;
};
