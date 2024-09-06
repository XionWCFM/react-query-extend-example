"use client";

import { createSafeContext } from "@xionwcfm/react";
import { delay } from "es-toolkit";
import { PropsWithChildren, useEffect } from "react";
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
  UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { Suspense } from "@suspensive/react";

let noconsumerRedered = 0;
let consumerRedered = 0;
let childrenRedered = 0;
let triggeredRender = 0;

type Data = {
  id: string;
  value: boolean;
};

let data: Data = { id: "hello", value: false };
const exampleQueryOption = () =>
  queryOptions({
    queryKey: ["hi"],
    queryFn: async () => {
      await delay(500);
      return data;
    },
  });

const [DataContextProvider, useDataContext] = createSafeContext<UseSuspenseQueryResult<Data>>(null);

const ContextProvider = ({ children }: PropsWithChildren) => {
  const result = useSuspenseQuery(exampleQueryOption());
  return <DataContextProvider value={result}>{children}</DataContextProvider>;
};

export default function Page() {
  return (
    <Suspense>
      <ContextProvider>
        <NoConsumer />
        <Consumer>
          <ConsumerChildren />
        </Consumer>
        <RefetchTrigger />
      </ContextProvider>
    </Suspense>
  );
}

const RefetchTrigger = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      data = { id: "hello", value: !data.value };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hi"] });
    },
  });
  useEffect(() => {
    ++triggeredRender;
    console.log(`triggered ${triggeredRender}`);
  });
  return <button onClick={() => mutation.mutate()}>refetch</button>;
};

const NoConsumer = () => {
  useEffect(() => {
    noconsumerRedered++;
    console.log(`nocousumer rendered ${noconsumerRedered}`);
  });
  return <div className=" bg-danger-50">no render</div>;
};

const Consumer = ({ children }: PropsWithChildren) => {
  const data = useDataContext();
  useEffect(() => {
    consumerRedered++;
    console.log(`cousumer rendered ${consumerRedered}`);
  });
  return (
    <div>
      {data.data.id}
      {children}
    </div>
  );
};

const ConsumerChildren = () => {
  useEffect(() => {
    childrenRedered++;
    console.log(`children rendered ${childrenRedered}`);
  });
  return <div>consumer children</div>;
};
