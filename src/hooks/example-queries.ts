import { QueriesOptions, queryOptions } from "@tanstack/react-query";
import { exampleOptions } from "./use-example-query";
import { getDehydratedQueries } from "./dehydrated";

const examplesOptions = () => [
  {
    queryKey: ["queries", "1"],
    queryFn: async () => {
      const randomValue = Math.random();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return randomValue as number;
    },
  },
  {
    queryKey: ["queries", "2"],
    queryFn: async () => {
      const randomValue = Math.random();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return randomValue as number;
    },
  },
  {
    queryKey: ["queries", "3"],
    queryFn: async () => {
      const randomValue = Math.random();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return randomValue as number;
    },
  },
];

export const getServerQueries = async () => {
  return getDehydratedQueries(examplesOptions());
};
