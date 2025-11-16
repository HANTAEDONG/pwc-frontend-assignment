"use client";

import { useState, lazy, Suspense } from "react";
import { FinancialStatementFilter } from "@/features/financial-statement-filter";
import type { FinancialStatementFilterParams } from "@/features/financial-statement-filter";
import { useFinancialStatementQuery } from "@/entities/financial-statement";
import {
  LoadingState,
  ErrorState,
  EmptyState,
  mapErrorToUiMessage,
} from "./components/result-states";

const FinancialStatementTable = lazy(() =>
  import("./components/financial-statement-table").then((mod) => ({
    default: mod.FinancialStatementTable,
  }))
);

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
            message={mapErrorToUiMessage(error)}
            onRetry={() => refetch()}
          />
        )}
        {searchParams && data && !isLoading && !error && (
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-500">테이블 로딩 중...</div>
              </div>
            }
          >
            <FinancialStatementTable
              rows={data.rows}
              reprtCode={searchParams.reprtCode}
              bsnsYear={searchParams.bsnsYear}
            />
          </Suspense>
        )}
      </section>
    </div>
  );
}
