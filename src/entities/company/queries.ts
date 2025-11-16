import { useQuery } from "@tanstack/react-query";
import { getCompanies, getCompaniesRemote } from "./api";
import type { QueryOptions, QueryKeyFactory } from "@/shared/lib/react-query";

export const companyQueryKeys: QueryKeyFactory<["company"]> = {
  all: ["company"] as const,
  lists: () => [...companyQueryKeys.all, "list"] as const,
  list: () => [...companyQueryKeys.lists()] as const,
  details: () => [...companyQueryKeys.all, "detail"] as const,
  detail: () => [...companyQueryKeys.details()] as const,
} as const;

export function useCompanies(options?: QueryOptions<string[]>) {
  return useQuery({
    queryKey: companyQueryKeys.lists(),
    queryFn: getCompanies,
    ...options,
  });
}

export function useCompaniesRemote(options?: QueryOptions<string[]>) {
  return useQuery({
    queryKey: [...companyQueryKeys.lists(), "remote"],
    queryFn: getCompaniesRemote,
    ...options,
  });
}
