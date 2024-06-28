import { DefaultError, UseMutationOptions, QueryClient, useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { SingleFlight } from "./single-flight";
import { MutationBuilder } from "./mutation-builder";

const singleFlight = new SingleFlight();

type RequiredMutationFnOptions<TData = unknown, TError = DefaultError, TVariables = void, TContext = unknown> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  "mutationFn"
> & {
  mutationFn: Exclude<UseMutationOptions<TData, TError, TVariables, TContext>["mutationFn"], undefined>;
};

export const useExtendedMutation = <TData = unknown, TError = DefaultError, TVariables = void, TContext = unknown>(
  options: RequiredMutationFnOptions<TData, TError, TVariables, TContext>,
  queryClient?: QueryClient,
) => {
  const isPendingRef = useRef(false);
  const mutationByTanstack = useMutation<TData, TError, TVariables, TContext>(options, queryClient);
  const createMutation = () => new MutationBuilder(mutationByTanstack.mutateAsync, singleFlight, isPendingRef);
  return Object.assign(mutationByTanstack, { createMutation, isPendingRef });
};
