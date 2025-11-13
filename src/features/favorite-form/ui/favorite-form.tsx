"use client";

import { useForm } from "react-hook-form";
import { CompanySearchDropdown } from "@/features/company-search";
import { useCreateFavoriteCompany } from "@/entities/favorite/queries";
import { Button } from "@/shared/ui";

export interface FavoriteFormData {
  companyName: string;
}

export interface FavoriteFormProps {
  email: string;
  initialData?: FavoriteFormData;
  onSuccess?: () => void;
}

export function FavoriteForm({
  email,
  initialData,
  onSuccess,
}: FavoriteFormProps) {
  const createMutation = useCreateFavoriteCompany();

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
      await createMutation.mutateAsync({
        email,
        company_name: data.companyName,
        memo: null,
      });
      onSuccess?.();
    } catch {}
  };

  const handleCompanySelect = (companyName: string) => {
    setValue("companyName", companyName, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset>
        <legend>관심 기업 정보</legend>
        <div>
          <label htmlFor="company-search">기업 선택</label>
          <input
            type="hidden"
            {...register("companyName", { required: "기업을 선택해주세요" })}
          />
          <CompanySearchDropdown onSelect={handleCompanySelect} />
          {errors.companyName && (
            <div id="company-error" role="alert">
              {errors.companyName.message}
            </div>
          )}
        </div>
        <div>
          <Button type="submit" disabled={createMutation.isPending}>
            등록
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
