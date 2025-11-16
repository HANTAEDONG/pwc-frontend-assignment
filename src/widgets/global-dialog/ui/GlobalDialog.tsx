"use client";

import { X, XCircle } from "lucide-react";
import { useUiDialog } from "@/entities/ui";
import type { UiDialogPayload } from "@/entities/ui";
import { Button, Modal } from "@/shared/ui";
import { FavoriteForm } from "@/features/favorite-form/ui/favorite-form";
import { DEFAULT_USER_EMAIL } from "@/shared/config/user";
import { FavoriteDetailDialogContent } from "./components/favorite-detail-dialog-content";

interface DialogContentProps {
  payload: UiDialogPayload | null;
  onClose: () => void;
}

type DialogMaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "1000px";

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
        <Button type="button" variant="outline" onClick={onClose}>
          취소
        </Button>
        <Button type="button" variant="danger" onClick={onClose}>
          삭제
        </Button>
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
        <Button
          onClick={onClose}
          variant="ghost"
          className="h-auto w-auto p-0 text-gray-400 hover:text-gray-600"
          aria-label="닫기"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex flex-col items-center mb-6">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger-surface text-danger">
          <XCircle className="h-8 w-8" />
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
        <Button onClick={handleConfirm} variant="danger" className="w-full">
          삭제
        </Button>
        <Button onClick={onClose} variant="outline" className="w-full">
          취소
        </Button>
      </div>
    </div>
  );
}

function FavoriteFormDialogContent({ payload, onClose }: DialogContentProps) {
  const handleSuccess = () => {
    onClose();
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2.5 border-b border-gray-border px-5 py-2">
        <h2 className="text-2xl font-bold text-gray-900 leading-[1.4166666666666667em] whitespace-nowrap flex-shrink-0">
          {payload?.editingId ? "관심기업 수정" : "관심기업 생성"}
        </h2>
        <Button
          onClick={onClose}
          variant="ghost"
          className="h-auto w-auto flex-shrink-0 p-0 text-gray-900 hover:text-gray-700"
          aria-label="닫기"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      <div className="px-5 py-4">
        <FavoriteForm
          email={DEFAULT_USER_EMAIL}
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
        <Button type="button" variant="outline" onClick={onClose}>
          취소
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          로그아웃
        </Button>
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
        <Button type="button" variant="primary" onClick={onClose}>
          확인
        </Button>
      </div>
    </div>
  );
}

export function GlobalDialog() {
  const { activeDialog, dialogPayload, closeDialog } = useUiDialog();

  if (activeDialog === "none") {
    return null;
  }

  const getMaxWidth = (): DialogMaxWidth => {
    switch (activeDialog) {
      case "deleteFavoriteConfirm":
        return "md";
      case "favoriteDetail":
        return "2xl";
      case "favoriteForm":
        return "1000px";
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
    activeDialog === "favoriteDetail"
      ? "max-h-[90vh] overflow-y-auto"
      : undefined;

  const isOpen = true;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeDialog}
      maxWidth={maxWidth}
      contentClassName={contentClassName || undefined}
    >
      {renderContent()}
    </Modal>
  );
}
