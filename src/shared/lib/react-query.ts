import type {
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";

export type QueryOptions<TData, TError = Error> = Omit<
  UseQueryOptions<TData, TError>,
  "queryKey" | "queryFn"
>;

export type MutationOptions<
  TData,
  TError = Error,
  TVariables = void,
  TContext = unknown
> = UseMutationOptions<TData, TError, TVariables, TContext>;

export type QueryKeyFactory<T extends readonly unknown[]> = {
  all: T;
  lists: () => readonly [...T, "list"];
  list: (...args: unknown[]) => readonly [...T, "list", ...unknown[]];
  details: () => readonly [...T, "detail"];
  detail: (...args: unknown[]) => readonly [...T, "detail", ...unknown[]];
};
