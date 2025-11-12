'use client';

import { useForm } from 'react-hook-form';
import { CompanySearchDropdown } from '@/features/company-search';
import { useCreateFavorite, useUpdateFavorite } from '@/entities/favorite';
import { Button, Input } from '@/shared/ui';

export interface FavoriteFormData {
  companyId: string;
  companyName: string;
}

export interface FavoriteFormProps {
  initialData?: FavoriteFormData;
  favoriteId?: string;
  onSuccess?: () => void;
}

export function FavoriteForm({
  initialData,
  favoriteId,
  onSuccess,
}: FavoriteFormProps) {
  const createMutation = useCreateFavorite();
  const updateMutation = useUpdateFavorite();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FavoriteFormData>({
    defaultValues: initialData,
  });

  const onSubmit = async (data: FavoriteFormData) => {
    try {
      if (favoriteId) {
        await updateMutation.mutateAsync({
          id: favoriteId,
        });
      } else {
        await createMutation.mutateAsync({
          companyId: data.companyId,
          companyName: data.companyName,
        });
      }
      onSuccess?.();
    } catch (error) {
    }
  };

  const handleCompanySelect = (companyId: string, companyName: string) => {
    setValue('companyId', companyId);
    setValue('companyName', companyName);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset>
        <legend>관심 기업 정보</legend>
        <div>
          <label htmlFor="company-search-field">기업 선택</label>
          <CompanySearchDropdown onSelect={handleCompanySelect} />
          {errors.companyId && (
            <div id="company-error" role="alert">
              {errors.companyId.message}
            </div>
          )}
        </div>
        <div>
          <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
            {favoriteId ? '수정' : '등록'}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
