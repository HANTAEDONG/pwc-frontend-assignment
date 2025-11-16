"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/shared/ui";
import type { UiDialogPayload } from "@/entities/ui";
import { useFavoriteDetailDialog } from "../../model/useFavoriteDetailDialog";

interface FavoriteDetailDialogContentProps {
  payload: UiDialogPayload | null;
  onClose: () => void;
}

export function FavoriteDetailDialogContent({
  payload,
  onClose,
}: FavoriteDetailDialogContentProps) {
  const {
    data,
    isLoading,
    register,
    handleSubmit,
    handleEdit,
    handleCancel,
    isEditMode,
    isPending,
    hasFavorite,
  } = useFavoriteDetailDialog({
    favoriteId: payload?.favoriteId ?? null,
    onClose,
    onSuccess: payload?.onSuccess,
  });

  if (!hasFavorite) return null;

  return (
    <div>
      <div className="flex items-center justify-center gap-2.5 border-b border-gray-border px-5 py-2">
        <h2 className="text-2xl font-bold text-gray-900 leading-[1.4166666666666667em] whitespace-nowrap flex-shrink-0">
          {data?.company_name || ""}
        </h2>
      </div>

      {isEditMode ? (
        <form onSubmit={handleSubmit}>
          <div className="px-5 py-4">
            <div className="mb-6">
              <textarea
                {...register("memo")}
                className="h-[280px] w-full resize-none rounded-md border border-gray-border px-4 py-4 text-base leading-relaxed text-gray-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="기업에 대한 메모를 입력하세요"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 px-5 py-5">
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              disabled={isPending}
            >
              취소하기
            </Button>
            <Button type="submit" variant="secondary" disabled={isPending}>
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
              <div className="px-5 py-4">
                <div className="mb-6">
                  <div className="min-h-[200px] rounded-md border border-gray-border p-4">
                    <p className="text-base leading-relaxed text-gray-text whitespace-pre-wrap">
                      {data?.memo || "메모가 없습니다."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-5 py-5">
                <Button
                  onClick={handleEdit}
                  variant="secondary"
                  leftIcon={<Pencil className="h-5 w-5" />}
                >
                  수정하기
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
