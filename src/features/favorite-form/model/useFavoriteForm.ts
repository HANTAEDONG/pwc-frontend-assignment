"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import type { CompanySearchDropdownRef } from "@/features/company-search";
import {
  useCreateFavoriteCompany,
  useUpdateFavoriteCompany,
  useFavoriteCompaniesQuery,
} from "@/entities/favorite/queries";

export interface FavoriteFormData {
  companyName: string;
  memo: string;
}

export interface UseFavoriteFormOptions {
  email: string;
  favoriteId?: string;
  initialData?: FavoriteFormData;
  onSuccess?: () => void;
}

export interface UseFavoriteFormReturn {
  form: ReturnType<typeof useForm<FavoriteFormData>>;
  dropdownRef: React.RefObject<CompanySearchDropdownRef>;
  isEditMode: boolean;
  isPending: boolean;
  handleCompanySelect: (companyName: string) => void;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function useFavoriteForm({
  email,
  favoriteId,
  initialData,
  onSuccess,
}: UseFavoriteFormOptions): UseFavoriteFormReturn {
  const createMutation = useCreateFavoriteCompany();
  const updateMutation = useUpdateFavoriteCompany();
  const dropdownRef = useRef<CompanySearchDropdownRef>(null);

  const isEditMode = !!favoriteId;

  const { data: favoriteCompaniesData } = useFavoriteCompaniesQuery(
    { email },
    { enabled: !isEditMode }
  );

  const form = useForm<FavoriteFormData>({
    defaultValues: {
      ...initialData,
      memo: initialData?.memo || "",
    },
  });

  const {
    handleSubmit: formHandleSubmit,
    setValue,
    setError,
    clearErrors,
  } = form;

  const onSubmit = async (data: FavoriteFormData) => {
    try {
      const memoValue = data.memo?.trim() || null;
      if (isEditMode) {
        await updateMutation.mutateAsync({
          favorite_id: parseInt(favoriteId!, 10),
          email,
          memo: memoValue,
        });
      } else {
        await createMutation.mutateAsync({
          email,
          company_name: data.companyName,
          memo: memoValue,
        });
      }
      dropdownRef.current?.close();
      onSuccess?.();
    } catch {
      // 에러는 mutation에서 처리됨
    }
  };

  const handleCompanySelect = (companyName: string) => {
    if (!isEditMode && favoriteCompaniesData) {
      const existingCompany = favoriteCompaniesData.items.find(
        (item) => item.company_name === companyName
      );

      if (existingCompany) {
        setError("companyName", {
          type: "manual",
          message: "이미 추가된 기업입니다.",
        });
        return;
      }
    }

    clearErrors("companyName");
    setValue("companyName", companyName, { shouldValidate: true });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return {
    form,
    dropdownRef,
    isEditMode,
    isPending,
    handleCompanySelect,
    handleSubmit: formHandleSubmit(onSubmit),
  };
}
