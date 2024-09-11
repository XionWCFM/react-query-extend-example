"use client";

import { ErrorBoundary, Suspense } from "@suspensive/react";
import {
  QueryErrorResetBoundary,
  queryOptions,
  useIsFetching,
  useMutation,
  usePrefetchQuery,
  useQueries,
  useQueryClient,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createSafeContext } from "@xionwcfm/react";
import { PropsWithChildren, useEffect } from "react";
import { QueryErrorBoundary, SuspenseQueries } from "@suspensive/react-query";
import { http } from "~/src/http/http";

type Type = { message: string };
const exampeFetch = async () => {
  if (Math.random() > 0.5) {
    throw new Error("hello");
  }
  return { message: "hello" };
};

const exampleQueryOption = () => queryOptions({ queryKey: ["hi"], queryFn: exampeFetch, retry: 0 });
const example2QueryOption = () => queryOptions({ queryKey: ["hi2"], queryFn: () => ({ message: "hello" }) });

export const [Provider1, useContext1] = createSafeContext<Type>(null);
export const [Provider2, useContext2] = createSafeContext<Type>(null);

export default function Page() {
  return (
    <>
      <Prefetcher />
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallback={({ reset }) => (
              <div>
                <button onClick={reset}>리셋하기</button>
              </div>
            )}
          >
            <Suspense fallback={<div>consumer 2 loading</div>}>
              <SuspenseQueries queries={[exampleQueryOption(), example2QueryOption()]}>
                {([{ data: one }, { data: two }]) => {
                  return (
                    <Provider1 value={one}>
                      <Provider2 value={two}>
                        <div>
                          <Consumer1 />
                        </div>
                      </Provider2>
                    </Provider1>
                  );
                }}
              </SuspenseQueries>
              <Mutation />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </>
  );
}

const Provider12 = ({ children }: PropsWithChildren) => {
  usePrefetchQuery(example2QueryOption());
  const { data: one } = useSuspenseQuery(exampleQueryOption());
  return <Provider1 value={one}>{children}</Provider1>;
};

const Prefetcher = () => {
  useQueries({ queries: [exampleQueryOption(), example2QueryOption()] });
  return null;
};

const Consumer1 = () => {
  const data = useContext1();
  console.log(`consumer1 rerender`);
  return <div>{data?.message}</div>;
};

const Consume2 = () => {
  const data = useContext2();
  console.log(`consumer2 rerender`);
  return <div>{data?.message}</div>;
};

const Mutation = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async () => {
      return await http.post("api/exam");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hi"] });
    },
  });
  return <button onClick={() => mutate()}>뮤테이션 1</button>;
};
