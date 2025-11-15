"use client";

import { useState, useEffect } from "react";
import { X, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useUiDialog } from "@/entities/ui";
import type { UiDialogPayload } from "@/entities/ui";
import { Button } from "@/shared/ui";
import { FavoriteForm } from "@/features/favorite-form/ui/favorite-form";
import {
  useFavoriteCompanyDetailQuery,
  useUpdateFavoriteCompany,
} from "@/entities/favorite/queries";
import { cn } from "@/shared/lib/utils";

interface DialogContentProps {
  payload: UiDialogPayload | null;
  onClose: () => void;
}

const DEFAULT_EMAIL = "test@example.com";

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "640px": "max-w-[640px]",
};

function DeleteFavoriteDialogContent({ onClose }: DialogContentProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">관심 기업 삭제</h3>
        <p className="mt-2 text-sm text-gray-600">
          이 관심 기업을 삭제하시겠습니까?
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
        >
          삭제
        </button>
      </div>
    </div>
  );
}

function DeleteFavoriteConfirmDialogContent({
  payload,
  onClose,
}: DialogContentProps) {
  const handleConfirm = async () => {
    if (payload?.onConfirm) {
      await payload.onConfirm();
    }
    onClose();
  };

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-pink-100  flex items-center justify-center mb-4">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          총 {payload?.count ?? 0}개 삭제하시겠습니까?
        </h3>
        <p className="text-sm text-gray-600 mb-1">
          관심기업 삭제시 복구할 수 없습니다.
        </p>
        <p className="text-sm text-gray-600">정말 삭제하시겠습니까?</p>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleConfirm}
          variant="fill"
          className="bg-gray-800 hover:bg-gray-900 text-white w-full"
        >
          삭제
        </Button>
        <Button
          onClick={onClose}
          variant="outline"
          className="w-full border-gray-300 text-gray-700"
        >
          취소
        </Button>
      </div>
    </div>
  );
}

interface EditFormData {
  memo: string;
}

function FavoriteDetailDialogContent({ payload, onClose }: DialogContentProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const updateMutation = useUpdateFavoriteCompany();

  const favoriteId = payload?.favoriteId;
  const { data, isLoading } = useFavoriteCompanyDetailQuery(
    {
      favorite_id: favoriteId ?? 0,
      email: DEFAULT_EMAIL,
    },
    {
      enabled: !!favoriteId,
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

  useEffect(() => {
    if (!payload?.favoriteId) {
      setIsEditMode(false);
      if (data) {
        reset({
          memo: data.memo || "",
        });
      }
    }
  }, [payload?.favoriteId, data, reset]);

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
    if (!favoriteId) return;
    try {
      await updateMutation.mutateAsync({
        favorite_id: favoriteId,
        email: DEFAULT_EMAIL,
        memo: formData.memo?.trim() || null,
      });
      setIsEditMode(false);
      payload?.onSuccess?.();
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

  if (!payload?.favoriteId) return null;

  return (
    <div className="p-6">
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
  );
}

function FavoriteFormDialogContent({ payload, onClose }: DialogContentProps) {
  const handleSuccess = () => {
    onClose();
  };

  return (
    <div>
      <div className="flex items-center justify-between h-14 border-b border-gray-200 px-6 py-[5px] gap-[10px]">
        <h2 className="text-2xl font-bold text-gray-900">
          {payload?.editingId ? "관심기업 수정" : "관심기업 생성"}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-900 hover:text-gray-700 transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="px-6 pt-4 pb-6">
        <FavoriteForm
          email={DEFAULT_EMAIL}
          favoriteId={payload?.editingId}
          initialData={
            payload?.initialCompanyName
              ? { companyName: payload.initialCompanyName, memo: "" }
              : undefined
          }
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}

function LogoutDialogContent({ onClose }: DialogContentProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">로그아웃</h3>
        <p className="mt-2 text-sm text-gray-600">정말 로그아웃하시겠습니까?</p>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}

function GlobalErrorDialogContent({ payload, onClose }: DialogContentProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">
          {payload?.title ?? "오류가 발생했습니다"}
        </h3>
        <p className="mt-2 whitespace-pre-line text-sm text-gray-600">
          {payload?.message ??
            "잠시 후 다시 시도해 주세요. 문제가 계속되면 관리자에게 문의해 주세요."}
        </p>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
        >
          확인
        </button>
      </div>
    </div>
  );
}

export function GlobalDialog() {
  const { activeDialog, dialogPayload, closeDialog } = useUiDialog();

  useEffect(() => {
    if (activeDialog !== "none") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeDialog]);

  if (activeDialog === "none") {
    return null;
  }

  const handleOverlayClick = () => {
    closeDialog();
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const getMaxWidth = (): keyof typeof maxWidthClasses => {
    switch (activeDialog) {
      case "deleteFavoriteConfirm":
        return "md";
      case "favoriteDetail":
        return "2xl";
      case "favoriteForm":
        return "640px";
      default:
        return "sm";
    }
  };

  const renderContent = () => {
    switch (activeDialog) {
      case "deleteFavorite":
        return (
          <DeleteFavoriteDialogContent
            payload={dialogPayload}
            onClose={closeDialog}
          />
        );
      case "deleteFavoriteConfirm":
        return (
          <DeleteFavoriteConfirmDialogContent
            payload={dialogPayload}
            onClose={closeDialog}
          />
        );
      case "favoriteDetail":
        return (
          <FavoriteDetailDialogContent
            payload={dialogPayload}
            onClose={closeDialog}
          />
        );
      case "favoriteForm":
        return (
          <FavoriteFormDialogContent
            payload={dialogPayload}
            onClose={closeDialog}
          />
        );
      case "logout":
        return (
          <LogoutDialogContent payload={dialogPayload} onClose={closeDialog} />
        );
      case "globalError":
        return (
          <GlobalErrorDialogContent
            payload={dialogPayload}
            onClose={closeDialog}
          />
        );
      default:
        return null;
    }
  };

  const maxWidth = getMaxWidth();
  const contentClassName =
    activeDialog === "favoriteDetail" ? "max-h-[90vh] overflow-y-auto" : "";

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-[#5F5F62]/50 backdrop-blur-sm shadow-[inset_0px_4px_16.8px_0px_rgba(0,0,0,0.25)]"
      )}
      onClick={handleOverlayClick}
    >
      <div
        className={cn(
          "bg-white rounded-lg w-full",
          maxWidthClasses[maxWidth],
          contentClassName
        )}
        style={{
          boxShadow: `
            0px 16px 32px 0px rgba(29, 33, 45, 0.1),
            0px 1px 4px 0px rgba(29, 33, 45, 0.15),
            0px 0px 1px 0px rgba(29, 33, 45, 0.2)
          `.trim(),
        }}
        onClick={handleContentClick}
      >
        {renderContent()}
      </div>
    </div>
  );
}
