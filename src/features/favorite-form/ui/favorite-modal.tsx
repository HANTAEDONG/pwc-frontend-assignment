"use client";

import { FavoriteForm } from "./favorite-form";
import { X } from "lucide-react";
import { Modal } from "@/shared/ui";

const DEFAULT_EMAIL = "test@example.com";

interface FavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingId?: string;
  initialCompanyName?: string;
}

export function FavoriteModal({
  isOpen,
  onClose,
  editingId,
  initialCompanyName,
}: FavoriteModalProps) {
  const handleSuccess = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingId ? "관심기업 수정" : "관심기업 생성"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <FavoriteForm
          email={DEFAULT_EMAIL}
          favoriteId={editingId}
          initialData={
            initialCompanyName
              ? { companyName: initialCompanyName, memo: "" }
              : undefined
          }
          onSuccess={handleSuccess}
        />
      </div>
    </Modal>
  );
}
