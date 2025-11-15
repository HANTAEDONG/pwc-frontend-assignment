"use client";

import { useState, useRef } from "react";
import { Button, Select } from "@/shared/ui";
import { FileScan, Loader2 } from "lucide-react";
import { CompanySearchDropdown } from "@/features/company-search";
import type { CompanySearchDropdownRef } from "@/features/company-search";
import type { CompanyInfo } from "@/entities/company/api";
import {
  BUSINESS_YEAR_OPTIONS,
  REPORT_NAME_OPTIONS,
  FS_DIV_OPTIONS,
} from "@/entities/financial-statement";

export interface FinancialStatementFilterParams {
  corpCode: string;
  corpName: string;
  bsnsYear: string;
  reprtCode: string;
  fsDiv: string;
}

interface FinancialStatementFilterProps {
  onSubmit: (params: FinancialStatementFilterParams) => void;
  initialCorpCode?: string;
  initialCorpName?: string;
  disabled?: boolean;
}

export function FinancialStatementFilter({
  onSubmit,
  initialCorpCode = "",
  initialCorpName = "",
  disabled = false,
}: FinancialStatementFilterProps) {
  const [corpCode, setCorpCode] = useState(initialCorpCode);
  const [corpName, setCorpName] = useState(initialCorpName);
  const [bsnsYear, setBsnsYear] = useState("");
  const [reprtCode, setReprtCode] = useState("");
  const [fsDiv, setFsDiv] = useState("");
  const dropdownRef = useRef<CompanySearchDropdownRef>(null);

  const isFormValid = corpName && bsnsYear && reprtCode && fsDiv;

  const handleCompanySelect = (company: string | CompanyInfo) => {
    // DART API를 사용하므로 CompanyInfo 타입만 전달됨
    if (typeof company === "string") return;
    setCorpName(company.corp_name);
    setCorpCode(company.corp_code);
    dropdownRef.current?.close();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    onSubmit({
      corpCode,
      corpName,
      bsnsYear,
      reprtCode,
      fsDiv,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <label
            htmlFor="corp-name"
            className="text-base font-semibold text-gray-700 whitespace-nowrap w-[80px]"
          >
            <span className="text-red-500">*</span> 기업명
          </label>
          <div className="flex-1">
            <CompanySearchDropdown
              ref={dropdownRef}
              onSelect={handleCompanySelect}
              placeholder="기업명을 입력해주세요"
              hasError={false}
              useDartApi={true}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label
            htmlFor="bsns-year"
            className="text-base font-semibold text-gray-700 whitespace-nowrap w-[80px]"
          >
            <span className="text-red-500">*</span> 사업연도
          </label>
          <div className="flex-1">
            <Select
              id="bsns-year"
              options={BUSINESS_YEAR_OPTIONS}
              value={bsnsYear}
              onChange={setBsnsYear}
              placeholder="사업연도를 선택해주세요"
              disabled={disabled}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label
            htmlFor="reprt-code"
            className="text-base font-semibold text-gray-700 whitespace-nowrap w-[80px]"
          >
            <span className="text-red-500">*</span> 보고서명
          </label>
          <div className="flex-1">
            <Select
              id="reprt-code"
              options={REPORT_NAME_OPTIONS}
              value={reprtCode}
              onChange={setReprtCode}
              placeholder="보고서명을 선택해주세요"
              disabled={disabled}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label
            htmlFor="fs-div"
            className="text-base font-semibold text-gray-700 whitespace-nowrap w-[80px]"
          >
            <span className="text-red-500">*</span> 재무제표
          </label>
          <div className="flex-1">
            <Select
              id="fs-div"
              options={FS_DIV_OPTIONS}
              value={fsDiv}
              onChange={setFsDiv}
              placeholder="재무제표 유형을 선택해주세요"
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={!isFormValid || disabled}
          className={`w-[176px] h-[38px] px-4 py-2 gap-2 rounded text-base font-medium ${
            isFormValid && !disabled
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-[#C4C4C4] text-[#3E3E3E] disabled:opacity-30 hover:bg-[#C4C4C4]"
          }`}
          leftIcon={
            disabled ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileScan className="w-4 h-4" />
            )
          }
        >
          검색
        </Button>
      </div>
    </form>
  );
}
