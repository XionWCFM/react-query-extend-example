import { DefaultError, UseMutationOptions, QueryClient, UseMutationResult, useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { SingleFlight } from "./single-flight";
import { DebounceOptions, debounce } from "./debounce";

const withConditinalCall = <T, Args extends any[]>(fn: (...args: Args) => T, flag: boolean) => {
  return (...args: Args) => {
    if (flag) return;
    return fn(...args);
  };
};

type ExtendedMutationType<TData = unknown, TVariables = void> = {
  isPendingRef: { current: boolean };
  mutateAsyncSingleFlight: (args: TVariables) => Promise<TData>;
  withConditinalCall: typeof withConditinalCall;
  debounce: typeof debounce;
};

const singleFlight = new SingleFlight();

export const useExtendedMutation = <TData = unknown, TError = DefaultError, TVariables = void, TContext = unknown>(
  options: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, "mutationFn"> & {
    mutationFn: Exclude<UseMutationOptions<TData, TError, TVariables, TContext>["mutationFn"], undefined>;
  },
  queryClient?: QueryClient,
): UseMutationResult<TData, TError, TVariables, TContext> & ExtendedMutationType<TData, TVariables> => {
  const isPendingRef = useRef(false);
  const mutationByTanstack = useMutation<TData, TError, TVariables, TContext>(options, queryClient);

  const mutate = (...args: Parameters<typeof options.mutationFn>): Promise<TData> => {
    isPendingRef.current = true;
    return mutationByTanstack.mutateAsync(...args).then((res) => {
      isPendingRef.current = false;
      return res;
    });
  };

  const mutateAsync = async (...args: Parameters<typeof options.mutationFn>): Promise<TData> => {
    isPendingRef.current = true;
    const res = await options.mutationFn(...args);
    isPendingRef.current = false;
    return res;
  };

  const mutateAsyncSingleFlight = async (args: TVariables): Promise<TData> => {
    isPendingRef.current = true;
    const singleFlightMutation = singleFlight.execute(mutationByTanstack.mutateAsync);
    const result = await singleFlightMutation(args);
    isPendingRef.current = false;
    return result;
  };

  const mutation = Object.assign(mutationByTanstack, {
    mutate,
    mutateAsync,
    mutateAsyncSingleFlight,
  });

  const mutationOptions = { isPendingRef, withConditinalCall, debounce };
  return Object.assign(mutation, mutationOptions);
};
