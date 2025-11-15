"use client";

import { X, XCircle } from "lucide-react";
import { Button, Modal } from "@/shared/ui";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  count,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} maxWidth="md">
      <div className="p-6">
        <div className="flex justify-end mb-4">
          <Button
            onClick={onCancel}
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
            총 {count}개 삭제하시겠습니까?
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            관심기업 삭제시 복구할 수 없습니다.
          </p>
          <p className="text-sm text-gray-600">정말 삭제하시겠습니까?</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={onConfirm} variant="danger" className="w-full">
            삭제
          </Button>
          <Button onClick={onCancel} variant="outline" className="w-full">
            취소
          </Button>
        </div>
      </div>
    </Modal>
  );
}
