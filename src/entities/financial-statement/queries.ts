import { useQuery } from "@tanstack/react-query";
import { getFinancialStatement, type GetFinancialStatementParams } from "./api";
import type { FinancialStatementResponse } from "./model/types";
import type { QueryOptions, QueryKeyFactory } from "@/shared/lib/react-query";

export const financialStatementQueryKeys = {
  all: ["financial-statement"] as const,
  lists: () => [...financialStatementQueryKeys.all, "list"] as const,
  list: (
    corpCode: string,
    bsnsYear: string,
    reprtCode: string,
    fsDiv: string
  ) =>
    [
      ...financialStatementQueryKeys.lists(),
      corpCode,
      bsnsYear,
      reprtCode,
      fsDiv,
    ] as const,
  details: () => [...financialStatementQueryKeys.all, "detail"] as const,
  detail: () => [...financialStatementQueryKeys.details()] as const,
} as const as QueryKeyFactory<["financial-statement"]>;

export function useFinancialStatementQuery(
  params: GetFinancialStatementParams,
  options?: QueryOptions<FinancialStatementResponse>
) {
  return useQuery({
    queryKey: financialStatementQueryKeys.list(
      params.corp_code,
      params.bsns_year,
      params.reprt_code,
      params.fs_div
    ),
    queryFn: () => getFinancialStatement(params),
    enabled: false,
    ...options,
  });
}
