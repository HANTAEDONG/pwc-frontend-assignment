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
          <button
            onClick={onCancel}
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
            총 {count}개 삭제하시겠습니까?
          </h3>
          <p className="text-sm text-gray-600 mb-1">
            관심기업 삭제시 복구할 수 없습니다.
          </p>
          <p className="text-sm text-gray-600">정말 삭제하시겠습니까?</p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={onConfirm}
            variant="fill"
            className="bg-gray-800 hover:bg-gray-900 text-white w-full"
          >
            삭제
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full border-gray-300 text-gray-700"
          >
            취소
          </Button>
        </div>
      </div>
    </Modal>
  );
}
