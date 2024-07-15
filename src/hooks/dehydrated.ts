import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
  QueryKey,
  UseQueryOptions,
  DehydratedState,
  QueryState,
} from "@tanstack/react-query";
import { cache } from "react";

const isEqual = (value: unknown, other: unknown): boolean => {
  if (value === other) {
    return true;
  }

  if (typeof value !== typeof other) {
    return false;
  }

  if (Array.isArray(value) && Array.isArray(other)) {
    if (value.length !== other.length) {
      return false;
    }
    for (let i = 0; i < value.length; i++) {
      if (!isEqual(value[i], other[i])) {
        return false;
      }
    }
    return true;
  }

  if (typeof value === "object" && typeof other === "object" && value !== null && other !== null) {
    const valueObj = value as Record<string, unknown>;
    const otherObj = other as Record<string, unknown>;
    const valueKeys = Object.keys(valueObj);
    const otherKeys = Object.keys(otherObj);

    if (valueKeys.length !== otherKeys.length) {
      return false;
    }

    return valueKeys.every(
      (key) => Object.prototype.hasOwnProperty.call(otherObj, key) && isEqual(valueObj[key], otherObj[key]),
    );
  }

  return value === other;
};

export const getQueryClient = cache(() => new QueryClient());

export const Hydrate = HydrationBoundary;

export const getDehydratedQuery = async <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
) => {
  const { queryKey, queryFn } = options;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({ queryKey, queryFn });
  const { queries } = dehydrate(queryClient);
  const [dehydratedQuery] = queries.filter((query) => isEqual(query.queryKey, queryKey));
  return dehydratedQuery as DehydratedState["queries"][0];
};

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export interface QueryProps<ResponseType = unknown> {
  queryKey: QueryKey;
  queryFn: () => Promise<ResponseType>;
}

interface DehydratedQueryExtended<TData = unknown, TError = unknown> {
  state: QueryState<TData, TError>;
}

export async function getDehydratedQueries<Q extends QueryProps[]>(queries: Q) {
  const queryClient = getQueryClient();
  await Promise.all(queries.map(({ queryKey, queryFn }) => queryClient.prefetchQuery({ queryKey, queryFn })));

  return dehydrate(queryClient).queries as DehydratedQueryExtended<UnwrapPromise<ReturnType<Q[number]["queryFn"]>>>[];
}
