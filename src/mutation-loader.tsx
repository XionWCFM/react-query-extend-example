"use client";

import { Mutation, MutationState, UseMutationOptions, useMutationState } from "@tanstack/react-query";
import { ReactNode, useEffect, useRef, useState } from "react";
import { usePreservedCallback } from "./@deprecated/packages/use-preserved-callback";

type MutationLoaderProps<TData, TError, TVariables = void, TContext = unknown> = {
  children?: ReactNode;
  filters?: {
    exact?: boolean;
    predicate?: (mutation: Mutation<any, any, any>) => boolean;
  };
  delay?: number;
  onSuccess?: (state: MutationState<TData, TError, TVariables, TContext>) => void;
  onError?: (state: MutationState<TData, TError, TVariables, TContext>) => void;
} & UseMutationOptions<TData, TError, TVariables, TContext>;

export const MutationLoader = <TData, TError, TVariables = void, TContext = unknown>(
  props: MutationLoaderProps<TData, TError, TVariables, TContext>,
) => {
  const { children, filters, mutationKey, delay = 0 } = props;
  const exact = typeof filters?.exact === "undefined" ? true : filters?.exact;

  const mutations = useMutationState({
    filters: { mutationKey, exact, predicate: filters?.predicate },
  }) as MutationState<TData, TError, TVariables, TContext>[];

  const [isReady, setIsReady] = useState(delay === 0);

  const currentMutation = mutations[mutations.length - 1];

  const isSuccess = currentMutation?.status === "success";
  const isError = currentMutation?.status === "error";

  const successTriggered = useRef(false);
  const errorTriggered = useRef(false);

  const onSuccess = usePreservedCallback(props.onSuccess ?? (() => {}));
  const onError = usePreservedCallback(props.onError ?? (() => {}));

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsReady(true);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [delay]);

  useEffect(() => {
    if (isReady && isSuccess && !successTriggered.current) {
      successTriggered.current = true;
      onSuccess(currentMutation);
    }
  }, [isSuccess, onSuccess, currentMutation, isReady]);

  useEffect(() => {
    if (isReady && isError && !errorTriggered.current) {
      errorTriggered.current = true;
      onError(currentMutation);
    }
  }, [isError, onError, currentMutation, isReady]);

  return children;
};
