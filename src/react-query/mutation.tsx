import { DefaultError, UseMutationOptions, UseMutationResult, useMutation } from "@tanstack/react-query";
import { ReactNode } from "react";

/**
 * @experimental This is experimental feature.
 */
export function Mutation<TData = unknown, TError = DefaultError, TVariables = void, TContext = unknown>({
  children,
  ...options
}: UseMutationOptions<TData, TError, TVariables, TContext> & {
  children: (mutationResult: UseMutationResult<TData, TError, TVariables, TContext>) => ReactNode;
}) {
  return <>{children(useMutation(options))}</>;
}
