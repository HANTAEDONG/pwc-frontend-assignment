"use client";

import { type RefObject, useEffect, useMemo, useState } from "react";

import { Button } from "@/shared/ui";
import { ICONS } from "@/shared/ui/icons";
import { useUiDialog } from "@/entities/ui";
import type { FavoriteSectionRef } from "./favorite-section";

interface FavoriteActionsProps {
  sectionRef: RefObject<FavoriteSectionRef>;
}

export function FavoriteActions({ sectionRef }: FavoriteActionsProps) {
  const { openDialog } = useUiDialog();
  const [selectedCount, setSelectedCount] = useState(0);

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

  useEffect(() => {
    const tableRef = sectionRef.current?.getTableRef();
    if (!tableRef) return;
    // 초기 카운트 동기화
    setSelectedCount(tableRef.getSelectedIds().length);
    // 구독 설정
    const unsubscribe =
      tableRef.subscribeSelectionChange?.((count) => setSelectedCount(count)) ??
      undefined;
    return () => {
      unsubscribe?.();
    };
  }, [sectionRef]);

  const isDeleteDisabled = selectedCount === 0;
  const deleteLabel = useMemo(() => {
    return selectedCount > 0 ? `선택 ${selectedCount}개 삭제` : "관심기업 삭제";
  }, [selectedCount]);

  return (
    <div className="flex h-auto sm:h-[59px] w-full sm:w-[310px] items-end gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
      <Button
        variant="secondary"
        className="h-[38px] flex-1 whitespace-nowrap rounded-[4px] bg-black text-white hover:bg-gray-800 px-4 py-2 text-sm sm:flex-none sm:w-[147px] sm:text-base"
        leftIcon={ICONS.plus}
        onClick={handleCreateClick}
      >
        관심기업 생성
      </Button>
      <Button
        variant="outline"
        className="h-[38px] flex-1 whitespace-nowrap rounded-[4px] border-black bg-white text-black hover:bg-gray-50 px-4 py-2 text-sm sm:flex-none sm:w-[147px] sm:text-base"
        leftIcon={ICONS.trash2}
        onClick={handleDeleteClick}
        disabled={isDeleteDisabled}
        aria-disabled={isDeleteDisabled}
      >
        {deleteLabel}
      </Button>
    </div>
  );
}
