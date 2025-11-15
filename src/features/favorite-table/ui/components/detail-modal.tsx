"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
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
      email: "test@example.com",
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
        email: "test@example.com",
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
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-0 focus:border-[#FF8700]"
                  placeholder="기업에 대한 메모를 입력하세요"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  className="border-gray-300 text-gray-700"
                  disabled={updateMutation.isPending}
                >
                  취소하기
                </Button>
                <Button
                  type="submit"
                  variant="fill"
                  className="bg-black hover:bg-gray-800 text-white"
                  disabled={updateMutation.isPending}
                >
                  저장하기
                </Button>
              </div>
            </form>
          ) : (
            /* 조회 모드 */
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
                    <div className="border border-gray-200 rounded-lg p-4 min-h-[200px]">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {data?.memo || "메모가 없습니다."}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleEdit}
                      variant="fill"
                      className="bg-black hover:bg-gray-800 text-white gap-2"
                      leftIcon={
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      }
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
