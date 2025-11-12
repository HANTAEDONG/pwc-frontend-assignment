import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  searchCompanies,
  CompanySearchParams,
  CompanySearchResponse,
} from "./api";

export const companyQueryKeys = {
  all: ["company"] as const,
  search: (keyword: string) => ["company", "search", keyword] as const,
};

export function useCompanySearch(
  params: CompanySearchParams,
  options?: Omit<
    UseQueryOptions<CompanySearchResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: companyQueryKeys.search(params.keyword),
    queryFn: () => searchCompanies(params),
    ...options,
  });
}
