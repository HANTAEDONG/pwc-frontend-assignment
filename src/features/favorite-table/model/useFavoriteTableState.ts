"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { FavoriteCompanyListItem } from "@/entities/favorite/api";
import type { UseDeleteFavoriteCompanyReturn } from "../model";
import { useUiDialog } from "@/entities/ui";

interface UseFavoriteTableStateOptions {
  filteredItems: FavoriteCompanyListItem[];
  deleteMutation: UseDeleteFavoriteCompanyReturn;
  data: { total: number; total_pages: number } | undefined;
}

export interface UseFavoriteTableStateReturn {
  selectedIds: Set<number>;
  pendingDeleteIds: number[];
  selectedFavoriteId: number | null;
  allSelected: boolean;
  handleSelectAll: (checked: boolean) => void;
  handleSelectRow: (id: number, checked: boolean) => void;
  handleDeleteClick: (id: number) => void;
  handleDeleteSelected: () => void;
  handleCompanyClick: (id: number) => void;
  handlePageChange: (newPage: number) => void;
  shouldShowPagination: boolean;
  getSelectedIds: () => number[];
}

export function useFavoriteTableState({
  filteredItems,
  deleteMutation,
  data,
}: UseFavoriteTableStateOptions): UseFavoriteTableStateReturn {
  const router = useRouter();
  const { openDialog } = useUiDialog();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [pendingDeleteIds, setPendingDeleteIds] = useState<number[]>([]);
  const [selectedFavoriteId, setSelectedFavoriteId] = useState<number | null>(
    null
  );

  const allSelected = useMemo(() => {
    return (
      filteredItems.length > 0 &&
      filteredItems.every((item) => selectedIds.has(item.id))
    );
  }, [filteredItems, selectedIds]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredItems.map((item) => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      const newSelectedIds = new Set(prev);
      if (checked) {
        newSelectedIds.add(id);
      } else {
        newSelectedIds.delete(id);
      }
      return newSelectedIds;
    });
  };

  const handleDeleteClick = (id: number) => {
    setPendingDeleteIds([id]);
    openDialog("deleteFavoriteConfirm", {
      count: 1,
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync({
            favorite_id: id,
            email: "htd0913@gmail.com",
          });
          setSelectedIds(new Set());
          setPendingDeleteIds([]);
        } catch {}
      },
    });
  };

  const handleConfirmDelete = async () => {
    try {
      for (const id of pendingDeleteIds) {
        await deleteMutation.mutateAsync({
          favorite_id: id,
          email: "htd0913@gmail.com",
        });
      }
      setSelectedIds(new Set());
      setPendingDeleteIds([]);
    } catch {}
  };

  const handleDeleteSelected = () => {
    const selectedArray = Array.from(selectedIds);
    if (selectedArray.length > 0) {
      setPendingDeleteIds(selectedArray);
      openDialog("deleteFavoriteConfirm", {
        count: selectedArray.length,
        onConfirm: handleConfirmDelete,
      });
    }
  };

  const handleCompanyClick = (id: number) => {
    setSelectedFavoriteId(id);
    openDialog("favoriteDetail", {
      favoriteId: id,
      onSuccess: () => {},
    });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const getSelectedIds = () => {
    return Array.from(selectedIds);
  };

  const shouldShowPagination = data ? data.total > 10 : false;

  return {
    selectedIds,
    pendingDeleteIds,
    selectedFavoriteId,
    allSelected,
    handleSelectAll,
    handleSelectRow,
    handleDeleteClick,
    handleDeleteSelected,
    handleCompanyClick,
    handlePageChange,
    shouldShowPagination,
    getSelectedIds,
  };
}
