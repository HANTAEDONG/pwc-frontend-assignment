import { useQuery } from "@tanstack/react-query";
import { getCompanies, getCompaniesFromDart, type CompanyInfo } from "./api";
import type { QueryOptions, QueryKeyFactory } from "@/shared/lib/react-query";

export const companyQueryKeys: QueryKeyFactory<["company"]> = {
  all: ["company"] as const,
  lists: () => [...companyQueryKeys.all, "list"] as const,
  list: () => [...companyQueryKeys.lists()] as const,
  details: () => [...companyQueryKeys.all, "detail"] as const,
  detail: () => [...companyQueryKeys.details()] as const,
} as const;

export const dartCompanyQueryKeys = {
  all: ["dart-company"] as const,
  lists: () => [...dartCompanyQueryKeys.all, "list"] as const,
  list: (search?: string) =>
    search
      ? ([...dartCompanyQueryKeys.lists(), "search", search] as const)
      : ([...dartCompanyQueryKeys.lists()] as const),
  details: () => [...dartCompanyQueryKeys.all, "detail"] as const,
  detail: () => [...dartCompanyQueryKeys.details()] as const,
} as const;

export function useCompanies(options?: QueryOptions<string[]>) {
  return useQuery({
    queryKey: companyQueryKeys.lists(),
    queryFn: getCompanies,
    ...options,
  });
}

export function useDartCompanies(
  search?: string,
  options?: QueryOptions<CompanyInfo[]>
) {
  return useQuery({
    queryKey: dartCompanyQueryKeys.list(search),
    queryFn: () => getCompaniesFromDart(search),
    ...options,
  });
}
