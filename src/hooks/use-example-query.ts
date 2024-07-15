import { queryOptions, useQuery, useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";
import { getDehydratedQuery } from "./dehydrated";

export const exampleOptions = () =>
  queryOptions({
    queryKey: ["hello"],
    queryFn: async () => {
      const randomValue = Math.random();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return randomValue as number;
    },
  });

export const getServerQuery = async () => {
  return getDehydratedQuery(exampleOptions());
};

export const useServerQuery = () => {
  return useQuery(exampleOptions());
};
