"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import type { CompanySearchDropdownRef } from "@/features/company-search";
import {
  useCreateFavoriteCompany,
  useUpdateFavoriteCompany,
  useFavoriteCompaniesQuery,
  favoriteQueryKeys,
} from "@/entities/favorite/queries";
import type { PaginatedFavoriteCompanyResponse } from "@/entities/favorite/api";
import { getFavoriteCompanies } from "@/entities/favorite/api";

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
  const queryClient = useQueryClient();

  const isEditMode = !!favoriteId;

  const { data: firstPageData } = useFavoriteCompaniesQuery(
    { email, page: 1 },
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
      console.error("Favorite form submission error");
    }
  };

  const handleCompanySelect = async (companyName: string) => {
    if (!isEditMode) {
      if (firstPageData && firstPageData.total_pages > 1) {
        const missingPages: Promise<PaginatedFavoriteCompanyResponse>[] = [];

        for (let page = 2; page <= firstPageData.total_pages; page++) {
          const cachedData =
            queryClient.getQueryData<PaginatedFavoriteCompanyResponse>(
              favoriteQueryKeys.list(email, page)
            );

          if (!cachedData) {
            missingPages.push(
              queryClient.fetchQuery({
                queryKey: favoriteQueryKeys.list(email, page),
                queryFn: () => getFavoriteCompanies({ email, page }),
              })
            );
          }
        }

        if (missingPages.length > 0) {
          await Promise.all(missingPages);
        }
      }

      if (!firstPageData) {
        clearErrors("companyName");
        setValue("companyName", companyName, { shouldValidate: true });
        return;
      }

      const allPages: PaginatedFavoriteCompanyResponse[] = [firstPageData];
      const totalPages = firstPageData.total_pages;

      for (let page = 2; page <= totalPages; page++) {
        const cachedData =
          queryClient.getQueryData<PaginatedFavoriteCompanyResponse>(
            favoriteQueryKeys.list(email, page)
          );
        if (cachedData) {
          allPages.push(cachedData);
        }
      }

      const allItems = allPages.flatMap((pageData) => pageData.items);
      const existingCompany = allItems.find(
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
