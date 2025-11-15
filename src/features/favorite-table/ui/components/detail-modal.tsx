"use client";

import { useState, useEffect } from "react";
import { X, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button, Modal } from "@/shared/ui";
import {
  useFavoriteCompanyDetailQuery,
  useUpdateFavoriteCompany,
} from "@/entities/favorite/queries";

interface DetailModalProps {
  isOpen: boolean;
  favoriteId: number | null;
  onClose: () => void;
  onSuccess?: () => void;
}

interface EditFormData {
  memo: string;
}

export function DetailModal({
  isOpen,
  favoriteId,
  onClose,
  onSuccess,
}: DetailModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const updateMutation = useUpdateFavoriteCompany();

  const { data, isLoading } = useFavoriteCompanyDetailQuery(
    {
      favorite_id: favoriteId!,
      email: "htd0913@gmail.com",
    },
    {
      enabled: isOpen && !!favoriteId,
    }
  );

  const { handleSubmit, register, reset } = useForm<EditFormData>({
    defaultValues: {
      memo: data?.memo || "",
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        memo: data.memo || "",
      });
    }
  }, [data, reset]);

  // 모달이 닫힐 때 편집 모드 초기화
  useEffect(() => {
    if (!isOpen) {
      setIsEditMode(false);
      if (data) {
        reset({
          memo: data.memo || "",
        });
      }
    }
  }, [isOpen, data, reset]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    if (data) {
      reset({
        memo: data.memo || "",
      });
    }
  };

  const onSubmit = async (formData: EditFormData) => {
    try {
      await updateMutation.mutateAsync({
        favorite_id: favoriteId!,
        email: "htd0913@gmail.com",
        memo: formData.memo?.trim() || null,
      });
      setIsEditMode(false);
      onSuccess?.();
      onClose();
    } catch {}
  };

  const handleClose = () => {
    setIsEditMode(false);
    if (data) {
      reset({
        memo: data.memo || "",
      });
    }
    onClose();
  };

  if (!isOpen || !favoriteId) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="2xl"
      contentClassName="max-h-[90vh] overflow-y-auto"
    >
      <div className="p-6">
        {/* 닫기 버튼 */}
        <div className="flex justify-end mb-4">
          <Button
            onClick={handleClose}
            variant="ghost"
            className="h-auto w-auto p-0 text-gray-400 hover:text-gray-600"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {isEditMode ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {data?.company_name || ""}
            </h2>
            <div className="mb-6">
              <textarea
                {...register("memo")}
                rows={8}
                className="w-full resize-none rounded-md border border-gray-border px-3 py-2 text-gray-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="기업에 대한 메모를 입력하세요"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                disabled={updateMutation.isPending}
              >
                취소하기
              </Button>
              <Button
                type="submit"
                variant="secondary"
                disabled={updateMutation.isPending}
              >
                저장하기
              </Button>
            </div>
          </form>
        ) : (
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">로딩 중...</div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {data?.company_name || ""}
                </h2>
                <div className="mb-6">
                  <div className="min-h-[200px] rounded-lg border border-gray-border p-4">
                    <p className="whitespace-pre-wrap text-sm text-gray-text">
                      {data?.memo || "메모가 없습니다."}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleEdit}
                    variant="secondary"
                    leftIcon={<Pencil className="h-4 w-4" />}
                  >
                    수정하기
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
