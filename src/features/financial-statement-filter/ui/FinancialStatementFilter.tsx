"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Select } from "@/shared/ui";
import { FileScan, Loader2 } from "lucide-react";
import { CompanySearchDropdown } from "@/features/company-search";
import type { CompanySearchDropdownRef } from "@/features/company-search";
import {
  BUSINESS_YEAR_OPTIONS,
  REPORT_NAME_OPTIONS,
  FS_DIV_OPTIONS,
} from "@/entities/financial-statement";
import type { CompanyInfo } from "@/entities/company";

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
  const dropdownRef = useRef<CompanySearchDropdownRef>(null);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    clearErrors,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FinancialStatementFilterParams>({
    defaultValues: {
      corpCode: initialCorpCode,
      corpName: initialCorpName,
      bsnsYear: "",
      reprtCode: "",
      fsDiv: "",
    },
  });
  const isBusy = disabled || isSubmitting;

  const [corpCodeCache, setCorpCodeCache] = useState<CompanyInfo[] | null>(
    null
  );

  const loadCorpCodes = async (): Promise<CompanyInfo[]> => {
    if (corpCodeCache) return corpCodeCache;
    try {
      const res = await fetch("/corp-codes.json");
      if (!res.ok) throw new Error("Failed to load corp-codes.json");
      const data = (await res.json()) as CompanyInfo[];
      setCorpCodeCache(data);
      return data;
    } catch {
      setCorpCodeCache([]);
      return [];
    }
  };

  const handleCompanySelect = async (companyName: string) => {
    setValue("corpName", companyName, {
      shouldValidate: true,
      shouldDirty: true,
    });
    dropdownRef.current?.close();
    // 하드코딩된 corp-codes.json에서 corp_code 매핑
    const codes = await loadCorpCodes();
    const matched =
      codes.find((c) => c.corp_name === companyName) ||
      codes.find((c) => c.corp_name.includes(companyName));
    setValue("corpCode", matched?.corp_code ?? "", {
      shouldValidate: true,
      shouldDirty: true,
    });
    if (companyName) {
      clearErrors("corpName");
    }
  };

  const onValidSubmit = (values: FinancialStatementFilterParams) => {
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <label
            htmlFor="corp-name"
            className="text-base font-semibold text-gray-700 whitespace-nowrap w-[80px]"
          >
            <span className="text-red-500">*</span> 기업명
          </label>
          <div className="flex-1">
            <input
              type="hidden"
              {...register("corpName", { required: "기업명을 입력해주세요" })}
            />
            <input
              type="hidden"
              {...register("corpCode", {
                validate: (value) => {
                  const name = getValues("corpName");
                  if (!name) return true;
                  return value ? true : "기업 코드가 유효하지 않습니다";
                },
              })}
            />
            <CompanySearchDropdown
              ref={dropdownRef}
              onSelect={handleCompanySelect}
              placeholder="기업명을 입력해주세요"
              debounceMs={0}
              hasError={false}
              disabled={isBusy}
            />
            {errors.corpName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.corpName.message}
              </p>
            )}
            {errors.corpCode && (
              <p className="mt-1 text-sm text-red-500">
                {errors.corpCode.message}
              </p>
            )}
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
            <Controller
              name="bsnsYear"
              control={control}
              rules={{ required: "사업연도를 선택해주세요" }}
              render={({ field: { value, onChange } }) => (
                <Select
                  id="bsns-year"
                  options={BUSINESS_YEAR_OPTIONS}
                  value={value}
                  onChange={onChange}
                  placeholder="사업연도를 선택해주세요"
                  disabled={isBusy}
                />
              )}
            />
            {errors.bsnsYear && (
              <p className="mt-1 text-sm text-red-500">
                {errors.bsnsYear.message}
              </p>
            )}
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
            <Controller
              name="reprtCode"
              control={control}
              rules={{ required: "보고서명을 선택해주세요" }}
              render={({ field: { value, onChange } }) => (
                <Select
                  id="reprt-code"
                  options={REPORT_NAME_OPTIONS}
                  value={value}
                  onChange={onChange}
                  placeholder="보고서명을 선택해주세요"
                  disabled={isBusy}
                />
              )}
            />
            {errors.reprtCode && (
              <p className="mt-1 text-sm text-red-500">
                {errors.reprtCode.message}
              </p>
            )}
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
            <Controller
              name="fsDiv"
              control={control}
              rules={{ required: "재무제표 유형을 선택해주세요" }}
              render={({ field: { value, onChange } }) => (
                <Select
                  id="fs-div"
                  options={FS_DIV_OPTIONS}
                  value={value}
                  onChange={onChange}
                  placeholder="재무제표 유형을 선택해주세요"
                  disabled={isBusy}
                />
              )}
            />
            {errors.fsDiv && (
              <p className="mt-1 text-sm text-red-500">
                {errors.fsDiv.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={isBusy}
          className={`w-[176px] h-[38px] px-4 py-2 gap-2 rounded text-base font-medium ${
            !isBusy
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-[#C4C4C4] text-[#3E3E3E] disabled:opacity-30 hover:bg-[#C4C4C4]"
          }`}
          leftIcon={
            isBusy ? (
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
