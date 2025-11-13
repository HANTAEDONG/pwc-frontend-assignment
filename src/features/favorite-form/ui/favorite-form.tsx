"use client";

import { useForm } from "react-hook-form";
import { CompanySearchDropdown } from "@/features/company-search";
import {
  useCreateFavoriteCompany,
  useUpdateFavoriteCompany,
} from "@/entities/favorite/queries";
import { Button } from "@/shared/ui";

export interface FavoriteFormData {
  companyName: string;
}

export interface FavoriteFormProps {
  email: string;
  favoriteId?: string;
  initialData?: FavoriteFormData;
  onSuccess?: () => void;
}

export function FavoriteForm({
  email,
  favoriteId,
  initialData,
  onSuccess,
}: FavoriteFormProps) {
  const createMutation = useCreateFavoriteCompany();
  const updateMutation = useUpdateFavoriteCompany();

  const isEditMode = !!favoriteId;

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm<FavoriteFormData>({
    defaultValues: initialData,
  });

  const onSubmit = async (data: FavoriteFormData) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          favorite_id: parseInt(favoriteId, 10),
          email,
          memo: null,
        });
      } else {
        await createMutation.mutateAsync({
          email,
          company_name: data.companyName,
          memo: null,
        });
      }
      onSuccess?.();
    } catch {}
  };

  const handleCompanySelect = (companyName: string) => {
    setValue("companyName", companyName, { shouldValidate: true });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset>
        <legend>관심 기업 정보</legend>
        <div>
          <label htmlFor="company-search">기업 선택</label>
          <input
            type="hidden"
            {...register("companyName", {
              required: "기업을 선택해주세요",
              disabled: isEditMode,
            })}
          />
          <CompanySearchDropdown
            onSelect={handleCompanySelect}
            disabled={isEditMode}
          />
          {errors.companyName && (
            <div id="company-error" role="alert">
              {errors.companyName.message}
            </div>
          )}
        </div>
        <div>
          <Button type="submit" disabled={isPending}>
            {isEditMode ? "수정" : "등록"}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
