"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { FavoriteCompanyListItem } from "@/entities/favorite/api";
import type { UseDeleteFavoriteCompanyReturn } from "../model";

interface UseFavoriteTableStateOptions {
  filteredItems: FavoriteCompanyListItem[];
  deleteMutation: UseDeleteFavoriteCompanyReturn;
  data: { total: number; total_pages: number } | undefined;
}

export interface UseFavoriteTableStateReturn {
  selectedIds: Set<number>;
  deleteModalOpen: boolean;
  pendingDeleteIds: number[];
  detailModalOpen: boolean;
  selectedFavoriteId: number | null;
  allSelected: boolean;
  handleSelectAll: (checked: boolean) => void;
  handleSelectRow: (id: number, checked: boolean) => void;
  handleDeleteClick: (id: number) => void;
  handleConfirmDelete: () => Promise<void>;
  handleCancelDelete: () => void;
  handleDeleteSelected: () => void;
  handleCompanyClick: (id: number) => void;
  handleDetailModalClose: () => void;
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
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<number[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
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
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      for (const id of pendingDeleteIds) {
        await deleteMutation.mutateAsync({
          favorite_id: id,
          email: "test@example.com",
        });
      }
      setSelectedIds(new Set());
      setDeleteModalOpen(false);
      setPendingDeleteIds([]);
    } catch {
      // 에러는 mutation에서 처리됨
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setPendingDeleteIds([]);
  };

  const handleDeleteSelected = () => {
    const selectedArray = Array.from(selectedIds);
    if (selectedArray.length > 0) {
      setPendingDeleteIds(selectedArray);
      setDeleteModalOpen(true);
    }
  };

  const handleCompanyClick = (id: number) => {
    setSelectedFavoriteId(id);
    setDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setDetailModalOpen(false);
    setSelectedFavoriteId(null);
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
    deleteModalOpen,
    pendingDeleteIds,
    detailModalOpen,
    selectedFavoriteId,
    allSelected,
    handleSelectAll,
    handleSelectRow,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    handleDeleteSelected,
    handleCompanyClick,
    handleDetailModalClose,
    handlePageChange,
    shouldShowPagination,
    getSelectedIds,
  };
}
