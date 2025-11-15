"use client";

import { useState } from "react";
import { FinancialStatementFilter } from "@/features/financial-statement-filter";
import type { FinancialStatementFilterParams } from "@/features/financial-statement-filter";
import { useFinancialStatementQuery } from "@/entities/financial-statement";
import { FinancialStatementTable } from "./components/financial-statement-table";
import { LoadingState, ErrorState, EmptyState } from "./components/result-states";

export function FinancialStatementViewer() {
  const [searchParams, setSearchParams] =
    useState<FinancialStatementFilterParams | null>(null);

  const queryParams = searchParams
    ? {
        corp_code: searchParams.corpCode,
        bsns_year: searchParams.bsnsYear,
        reprt_code: searchParams.reprtCode,
        fs_div: searchParams.fsDiv,
      }
    : null;

  const { data, isLoading, error, refetch } = useFinancialStatementQuery(
    queryParams || {
      corp_code: "",
      bsns_year: "",
      reprt_code: "",
      fs_div: "",
    },
    {
      enabled: !!queryParams,
    }
  );

  const handleSearch = (params: FinancialStatementFilterParams) => {
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      <FinancialStatementFilter onSubmit={handleSearch} disabled={isLoading} />

      <section className="bg-white rounded-lg border border-gray-200 p-6 min-h-[400px]">
        {!searchParams && <EmptyState />}
        {searchParams && isLoading && <LoadingState />}
        {searchParams && error && (
          <ErrorState
            message={
              error instanceof Error
                ? error.message
                : "재무제표 조회 중 오류가 발생했습니다."
            }
            onRetry={() => refetch()}
          />
        )}
        {searchParams && data && !isLoading && !error && (
          <FinancialStatementTable
            rows={data.rows}
            sjDiv={searchParams.sjDiv}
          />
        )}
      </section>
    </div>
  );
}
