"use client";

import { useMutation, useIsMutating, MutationFilters, MutationOptions, queryOptions } from "@tanstack/react-query";
import { once } from "es-toolkit";
import { PropsWithChildren, Suspense } from "react";
import { batchRequestsOf } from "~/src/@deprecated/packages/batch-request-of";
import { type DefaultError, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Mutation } from "~/src/@deprecated/react-query/mutation";
import { SuspenseQuery } from "~/src/@deprecated/react-query/suspense-query";

const mutationFn = once(async () => {
  await new Promise((res) => setTimeout(res, 5000));
  return "he";
});

const exampleMutationOptions = () => {
  return {
    mutationKey: ["hello"],
    mutationFn,
  };
};

const exampleQueryOptions = () => {
  return queryOptions({
    queryKey: ["hel"],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 5000));
      return "he";
    },
  });
};

export default function Page() {
  return (
    <div>
      <Suspense fallback={<div>loading</div>}>
        <SuspenseQuery {...exampleQueryOptions()}>{({ data }) => <div className="">{data}</div>}</SuspenseQuery>
      </Suspense>

      <MutationSuspense mutationKey={exampleMutationOptions().mutationKey} fallback={<>loading</>}>
        <div>hello</div>
      </MutationSuspense>
      <Mutation {...exampleMutationOptions()}>
        {({ mutateAsync }) => <button onClick={() => mutateAsync()}>clear</button>}
      </Mutation>
    </div>
  );
}

type MutationBoundaryProps = MutationFilters &
  PropsWithChildren & {
    fallback?: React.ReactNode;
  };

const MutationSuspense = (props: MutationBoundaryProps) => {
  const { children, mutationKey, exact, predicate, status, fallback } = props;
  const isMutate = useIsMutating({ mutationKey, exact, predicate, status });
  if (fallback && isMutate !== 0) return fallback;
  return <>{children}</>;
};
