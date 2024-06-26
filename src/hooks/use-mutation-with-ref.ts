import { DefaultError, UseMutationOptions, QueryClient, UseMutationResult, useMutation } from "@tanstack/react-query";
import { useRef } from "react";

export const useMutationWithRef = <TData = unknown, TError = DefaultError, TVariables = void, TContext = unknown>(
  options: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, "mutationFn"> & {
    mutationFn: Exclude<UseMutationOptions<TData, TError, TVariables, TContext>["mutationFn"], undefined>;
  },
  queryClient?: QueryClient,
): UseMutationResult<TData, TError, TVariables, TContext> & {
  isPendingRef: { current: boolean };
} => {
  const isPendingRef = useRef(false);
  const result = useMutation<TData, TError, TVariables, TContext>(options, queryClient);

  const mutate = (...args: Parameters<typeof options.mutationFn>): Promise<TData> => {
    isPendingRef.current = true;
    return result.mutateAsync(...args).then((res) => {
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

  const mutation = Object.assign(result, { mutate, mutateAsync });

  return Object.assign(mutation, { isPendingRef });
};
