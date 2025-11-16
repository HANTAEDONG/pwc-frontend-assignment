"use client";

import { Controller } from "react-hook-form";
import { Button, Select } from "@/shared/ui";
import { FileScan, Loader2 } from "lucide-react";
import { CompanySearchDropdown } from "@/features/company-search";
import {
  BUSINESS_YEAR_OPTIONS,
  REPORT_NAME_OPTIONS,
  FS_DIV_OPTIONS,
} from "@/entities/financial-statement";
import {
  useFinancialStatementFilter,
  type FinancialStatementFilterParams,
} from "../model/useFinancialStatementFilter";

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
  const {
    form,
    dropdownRef,
    isBusy,
    companyNameError,
    corpCodeError,
    handleCompanySelect,
    handleSubmit,
  } = useFinancialStatementFilter({
    onSubmit,
    initialCorpCode,
    initialCorpName,
    disabled,
  });

  const {
    register,
    control,
    getValues,
    formState: { errors },
  } = form;

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
              hasError={!!companyNameError || !!corpCodeError}
              disabled={isBusy}
            />
            {companyNameError && (
              <p className="mt-1 text-sm text-red-500">{companyNameError}</p>
            )}
            {corpCodeError && (
              <p className="mt-1 text-sm text-red-500">{corpCodeError}</p>
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
