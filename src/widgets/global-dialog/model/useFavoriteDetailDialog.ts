"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useFavoriteCompanyDetailQuery,
  useUpdateFavoriteCompany,
} from "@/entities/favorite/queries";
import { DEFAULT_USER_EMAIL } from "@/shared/config/user";

interface FavoriteDetailFormData {
  memo: string;
}

interface UseFavoriteDetailDialogOptions {
  favoriteId?: number | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function useFavoriteDetailDialog({
  favoriteId,
  onClose,
  onSuccess,
}: UseFavoriteDetailDialogOptions) {
  const [isEditMode, setIsEditMode] = useState(false);
  const validFavoriteId =
    typeof favoriteId === "number" && favoriteId > 0 ? favoriteId : null;

  const updateMutation = useUpdateFavoriteCompany();

  const { data, isLoading } = useFavoriteCompanyDetailQuery(
    {
      favorite_id: validFavoriteId ?? 0,
      email: DEFAULT_USER_EMAIL,
    },
    {
      enabled: !!validFavoriteId,
    }
  );

  const form = useForm<FavoriteDetailFormData>({
    defaultValues: {
      memo: data?.memo || "",
    },
  });

  const { handleSubmit, register, reset } = form;

  useEffect(() => {
    if (data) {
      reset({
        memo: data.memo || "",
      });
    }
  }, [data, reset]);

  useEffect(() => {
    if (!validFavoriteId) {
      setIsEditMode(false);
      if (data) {
        reset({
          memo: data.memo || "",
        });
      }
    }
  }, [data, reset, validFavoriteId]);

  const closeAndReset = () => {
    setIsEditMode(false);
    if (data) {
      reset({
        memo: data.memo || "",
      });
    }
  };

  const handleEdit = () => setIsEditMode(true);

  const handleCancel = () => {
    closeAndReset();
    onClose();
  };

  const submit = handleSubmit(async (formData: FavoriteDetailFormData) => {
    if (!validFavoriteId) return;
    try {
      await updateMutation.mutateAsync({
        favorite_id: validFavoriteId,
        email: DEFAULT_USER_EMAIL,
        memo: formData.memo?.trim() || null,
      });
      setIsEditMode(false);
      onSuccess?.();
      onClose();
    } catch {
      // handled by mutation
    }
  });

  return {
    data,
    isLoading,
    form,
    register,
    isEditMode,
    isPending: updateMutation.isPending,
    handleEdit,
    handleCancel,
    handleSubmit: submit,
    hasFavorite: !!validFavoriteId,
  };
}
