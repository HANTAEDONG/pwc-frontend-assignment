"use client";

import { type RefObject } from "react";

import { Button } from "@/shared/ui/button";
import { ICONS } from "@/shared/ui/icons";
import { useUiDialog } from "@/entities/ui";
import type { FavoriteSectionRef } from "./favorite-section";

interface FavoriteActionsProps {
  sectionRef: RefObject<FavoriteSectionRef>;
}

export function FavoriteActions({ sectionRef }: FavoriteActionsProps) {
  const { openDialog } = useUiDialog();

  const handleCreateClick = () => {
    openDialog("favoriteForm");
  };

  const handleDeleteClick = () => {
    const tableRef = sectionRef.current?.getTableRef();
    if (tableRef) {
      const selectedIds = tableRef.getSelectedIds();
      if (selectedIds.length > 0) {
        tableRef.deleteSelected();
      }
    }
  };

  return (
    <div className="flex h-auto sm:h-[59px] w-full sm:w-[310px] items-end gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
      <Button
        variant="fill"
        className="h-[38px] flex-1 sm:flex-none sm:w-[147px] gap-2 rounded-[4px] px-4 py-2 text-sm sm:text-base whitespace-nowrap"
        leftIcon={ICONS.plus}
        onClick={handleCreateClick}
      >
        관심기업 생성
      </Button>
      <Button
        variant="outline"
        className="h-[38px] flex-1 sm:flex-none sm:w-[147px] gap-2 rounded-[4px] px-4 py-2 text-sm sm:text-base whitespace-nowrap"
        leftIcon={ICONS.trash2}
        onClick={handleDeleteClick}
      >
        관심기업 삭제
      </Button>
    </div>
  );
}
