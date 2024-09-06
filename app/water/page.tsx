"use client";

import { Suspense } from "@suspensive/react";
import { queryOptions, useMutation, useQueryClient, useSuspenseQueries } from "@tanstack/react-query";
import { createSafeContext } from "@xionwcfm/react";
import { PropsWithChildren } from "react";
import { http } from "~/src/http/http";

type Type = { message: string };
const exampeFetch = async () => http.get<Type>("api/exam", { cache: "no-cache" });

const exampleQueryOption = () => queryOptions({ queryKey: ["hi"], queryFn: exampeFetch });
const example2QueryOption = () => queryOptions({ queryKey: ["hi2"], queryFn: exampeFetch });

const [Provider1, useContext1] = createSafeContext<Type>(null);
const [Provider2, useContext2] = createSafeContext<Type>(null);

export default function Page() {
  return (
    <Suspense fallback={<>loading..</>}>
      <ContextProvider>
        <Consumer1 />
        <Consume2 />
        <Mutation />
      </ContextProvider>
    </Suspense>
  );
}

const ContextProvider = ({ children }: PropsWithChildren) => {
  const [result1, result2] = useSuspenseQueries({ queries: [exampleQueryOption(), example2QueryOption()] });
  return (
    <Provider1 value={result1.data}>
      <Provider2 value={result2.data}>{children}</Provider2>
    </Provider1>
  );
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
