import { Atom, PrimitiveAtom, WritableAtom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { FunctionComponent, PropsWithChildren, createContext, useContext, useEffect, useRef } from "react";

type AtomOptionsType<AtomeValue extends ComprehensiveAtomType> = PropsWithChildren<{
  value?: AtomeValue;
}>;

type DefaultWritableAtomType<Values = any, Args extends unknown[] = unknown[], Result = any> =
  | WritableAtom<Values, Args, Result>
  | PrimitiveAtom<Values>;
type ComprehensiveAtomType<Values = any, Args extends unknown[] = unknown[], Result = any> =
  | Atom<Values>
  | DefaultWritableAtomType<Values, Args, Result>;

type ReadonlyAtomResultType<TAtom extends ComprehensiveAtomType> = {
  Provider: FunctionComponent<AtomOptionsType<TAtom>>;
  with: <Props extends Record<string, any>>(
    Component: FunctionComponent<Props>,
    options?: AtomOptionsType<TAtom>,
  ) => (props: Props) => JSX.Element;
  useAtomValue: () => TAtom extends Atom<infer AtomValue> ? Awaited<AtomValue> : never;
};

type WritableAtomResultType<TAtom extends DefaultWritableAtomType> = ReadonlyAtomResultType<TAtom> & {
  useAtom: () => TAtom extends WritableAtom<infer V, infer Args, infer Result>
    ? [Awaited<V>, (...args: Args) => Result]
    : never;
  useSetAtom: () => TAtom extends WritableAtom<any, infer Args, infer Result> ? (...args: Args) => Result : never;
};

type CreateSafeAtomReturnType<TAtom extends ComprehensiveAtomType> = TAtom extends DefaultWritableAtomType
  ? WritableAtomResultType<TAtom>
  : ReadonlyAtomResultType<TAtom>;

const ERROR_MESSAGE_PROVIDER_NOT_PROVIDED =
  "@xionwcfm/jotai: Context not provided. Make sure to wrap your component with the appropriate Provider from createSafeAtom.";

const atomWeakMap = new WeakMap<object, ComprehensiveAtomType>();

export function createSafeAtom<TAtom extends ComprehensiveAtomType>(
  initialValue: TAtom,
): CreateSafeAtomReturnType<TAtom> {
  const Context = createContext<TAtom | null>(null);

  const useSafeContext = (): TAtom => {
    const value = useContext(Context);
    if (!value) {
      throw new Error(ERROR_MESSAGE_PROVIDER_NOT_PROVIDED);
    }
    return value;
  };

  const Provider: FunctionComponent<AtomOptionsType<TAtom>> = ({ children, value }) => {
    const atomRef = useRef<TAtom>(value ?? initialValue);

    useEffect(() => {
      const key = {};
      atomWeakMap.set(key, atomRef.current);

      return () => {
        atomWeakMap.delete(key);
      };
    }, []);

    return <Context.Provider value={atomRef.current}>{children}</Context.Provider>;
  };

  const ProviderWith =
    <T extends Record<string, any>>(
      Component: FunctionComponent<T>,
      options?: AtomOptionsType<TAtom>,
    ): ((props: T) => JSX.Element) =>
    // eslint-disable-next-line react/display-name
    (props: T) => {
      return (
        <Provider value={options?.value ?? initialValue}>
          <Component {...props} />
        </Provider>
      );
    };

  const useContextAtomValue = () => {
    return useAtomValue(useSafeContext());
  };

  const result: ReadonlyAtomResultType<TAtom> = {
    Provider,
    with: ProviderWith,
    useAtomValue: useContextAtomValue,
  };

  if ("write" in initialValue || "init" in initialValue) {
    const useContextAtom = () => {
      return useAtom(useSafeContext() as DefaultWritableAtomType);
    };

    const useSetContextAtom = () => {
      return useSetAtom(useSafeContext() as DefaultWritableAtomType);
    };

    return {
      ...result,
      useAtom: useContextAtom,
      useSetAtom: useSetContextAtom,
    } as CreateSafeAtomReturnType<TAtom>;
  }

  return result as CreateSafeAtomReturnType<TAtom>;
}
