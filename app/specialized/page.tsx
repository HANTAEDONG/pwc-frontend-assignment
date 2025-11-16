"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const FinancialStatementViewer = dynamic(
  () =>
    import("@/widgets/financial-statement-viewer").then(
      (mod) => mod.FinancialStatementViewer
    ),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    ),
    ssr: false,
  }
);

export default function SpecializedPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-[28px] font-semibold text-gray-900 mb-2">
            기업 재무제표 조회
          </h1>
          <p className="text-sm font-normal text-[#7F7F82]">
            기업명과 보고서 옵션을 선택하여 재무제표를 조회해보세요.
          </p>
        </div>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-gray-500">로딩 중...</div>
            </div>
          }
        >
          <FinancialStatementViewer />
        </Suspense>
      </div>
    </main>
  );
}
