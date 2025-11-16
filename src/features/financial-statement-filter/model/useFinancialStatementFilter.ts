"use client";

import { useCallback, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import type { CompanySearchDropdownRef } from "@/features/company-search";
import type { CompanyInfo } from "@/entities/company";

export interface FinancialStatementFilterParams {
  corpCode: string;
  corpName: string;
  bsnsYear: string;
  reprtCode: string;
  fsDiv: string;
}

export interface UseFinancialStatementFilterOptions {
  onSubmit: (params: FinancialStatementFilterParams) => void;
  initialCorpCode?: string;
  initialCorpName?: string;
  disabled?: boolean;
}

export interface UseFinancialStatementFilterReturn {
  form: ReturnType<typeof useForm<FinancialStatementFilterParams>>;
  dropdownRef: React.RefObject<CompanySearchDropdownRef>;
  isBusy: boolean;
  companyNameError?: string;
  corpCodeError?: string;
  handleCompanySelect: (companyName: string) => Promise<void>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

async function loadCorpCodesFromFile(): Promise<CompanyInfo[]> {
  try {
    const res = await fetch("/corp-codes.json");
    if (!res.ok) throw new Error("Failed to load corp-codes.json");
    return (await res.json()) as CompanyInfo[];
  } catch {
    return [];
  }
}

export function useFinancialStatementFilter({
  onSubmit,
  initialCorpCode = "",
  initialCorpName = "",
  disabled = false,
}: UseFinancialStatementFilterOptions): UseFinancialStatementFilterReturn {
  const dropdownRef = useRef<CompanySearchDropdownRef>(null);
  const corpCodesRef = useRef<CompanyInfo[] | null>(null);
  const loadPromiseRef = useRef<Promise<CompanyInfo[]> | null>(null);

  const form = useForm<FinancialStatementFilterParams>({
    defaultValues: {
      corpCode: initialCorpCode,
      corpName: initialCorpName,
      bsnsYear: "",
      reprtCode: "",
      fsDiv: "",
    },
  });

  const {
    formState: { isSubmitting, errors },
  } = form;

  const isBusy = useMemo(
    () => disabled || isSubmitting,
    [disabled, isSubmitting]
  );

  const ensureCorpCodes = useCallback(async () => {
    if (corpCodesRef.current) return corpCodesRef.current;
    if (!loadPromiseRef.current) {
      loadPromiseRef.current = loadCorpCodesFromFile().finally(() => {
        loadPromiseRef.current = null;
      });
    }
    const corpCodes = await loadPromiseRef.current;
    corpCodesRef.current = corpCodes;
    return corpCodes;
  }, []);

  const resolveCorpCode = useCallback(
    async (companyName: string) => {
      const codes = await ensureCorpCodes();
      const exact = codes.find((c) => c.corp_name === companyName);
      if (exact) {
        return exact.corp_code;
      }
      const partial = codes.find((c) => c.corp_name.includes(companyName));
      return partial?.corp_code ?? "";
    },
    [ensureCorpCodes]
  );

  const handleCompanySelect = useCallback(
    async (companyName: string) => {
      const trimmedName = companyName.trim();
      form.setValue("corpName", trimmedName, {
        shouldDirty: true,
        shouldValidate: true,
      });
      dropdownRef.current?.close();

      const corpCode = await resolveCorpCode(trimmedName);
      form.setValue("corpCode", corpCode, {
        shouldDirty: true,
        shouldValidate: true,
      });

      if (trimmedName) {
        form.clearErrors("corpName");
      }
    },
    [form, resolveCorpCode]
  );

  const handleSubmit = form.handleSubmit(onSubmit);

  return {
    form,
    dropdownRef,
    isBusy,
    companyNameError: errors.corpName?.message,
    corpCodeError: errors.corpCode?.message,
    handleCompanySelect,
    handleSubmit,
  };
}
