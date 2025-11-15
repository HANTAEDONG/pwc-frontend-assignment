"use client";

import { Trash2 } from "lucide-react";
import { useUiDialog } from "@/entities/ui";

interface DeleteFavoriteButtonProps {
  favoriteId: string;
}

export function DeleteFavoriteButton({
  favoriteId,
}: DeleteFavoriteButtonProps) {
  const { openDialog } = useUiDialog();

  const handleClick = () => {
    openDialog("deleteFavorite", {
      targetId: favoriteId,
      title: "관심 기업 삭제",
      message: "이 관심 기업을 삭제하시겠습니까?",
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center justify-center rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
    >
      <Trash2 className="mr-1 h-3 w-3" />
      삭제
    </button>
  );
}
