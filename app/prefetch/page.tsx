"use client";

import { Suspense } from "@suspensive/react";
import {
  queryOptions,
  useIsFetching,
  useMutation,
  useQueries,
  useQueryClient,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createSafeContext } from "@xionwcfm/react";
import { PropsWithChildren, useEffect } from "react";
import { http } from "~/src/http/http";

type Type = { message: string };
const exampeFetch = async () => http.get<Type>("api/exam", { cache: "no-cache" });

const exampleQueryOption = () => queryOptions({ queryKey: ["hi"], queryFn: exampeFetch });
const example2QueryOption = () => queryOptions({ queryKey: ["hi2"], queryFn: exampeFetch });

const [Provider1, useContext1] = createSafeContext<Type>(null);
const [Provider2, useContext2] = createSafeContext<Type>(null);

export default function Page() {
  return (
    <>
      <Prefetcher />

      <Suspense fallback={<>loading..</>}>
        <SuperContext>
          <Consumer1 />

          <Consume2 />
        </SuperContext>

        <Mutation />
      </Suspense>
    </>
  );
}

const SuperContext = ({ children }: PropsWithChildren) => {
  useSuspenseQueries({ queries: [exampleQueryOption(), example2QueryOption()] });
  return (
    <Context1Provider>
      <Context2Provider>{children}</Context2Provider>
    </Context1Provider>
  );
};

const Context1Provider = ({ children }: PropsWithChildren) => {
  const query = useSuspenseQuery(exampleQueryOption());
  return <Provider1 value={query.data}>{children}</Provider1>;
};
const Context2Provider = ({ children }: PropsWithChildren) => {
  const query = useSuspenseQuery(example2QueryOption());
  return <Provider2 value={query.data}>{children}</Provider2>;
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
