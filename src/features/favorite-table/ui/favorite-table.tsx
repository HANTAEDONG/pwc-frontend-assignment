"use client";

import { useImperativeHandle, forwardRef } from "react";
import { useFavoriteTable, useFavoriteTableState } from "../model";
import { TableContainer } from "./components/table-container";
import { TableHeader } from "./components/table-header";
import { TableBody } from "./components/table-body";
import { DeleteConfirmModal } from "./components/delete-confirm-modal";
import { Pagination } from "./components/pagination";
import { DetailModal } from "./components/detail-modal";

export interface FavoriteTableProps {
  searchQuery?: string;
  companyColumnClassName?: string;
  createdColumnClassName?: string;
}

export interface FavoriteTableRef {
  getSelectedIds: () => number[];
  deleteSelected: () => void;
}

export const FavoriteTable = forwardRef<FavoriteTableRef, FavoriteTableProps>(
  function FavoriteTable(
    {
      searchQuery: externalSearchQuery,
      companyColumnClassName = "w-[55%]",
      createdColumnClassName = "w-[25%]",
    },
    ref
  ) {
    const {
      filteredItems,
      isLoading,
      error,
      searchQuery,
      deleteMutation,
      handleRetry,
      data,
      page,
    } = useFavoriteTable({ searchQuery: externalSearchQuery });

    const {
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
    } = useFavoriteTableState({
      filteredItems,
      deleteMutation,
      data,
    });

    useImperativeHandle(ref, () => ({
      getSelectedIds,
      deleteSelected: handleDeleteSelected,
    }));

    return (
      <>
        <TableContainer>
          <TableHeader
            allSelected={allSelected}
            onSelectAll={handleSelectAll}
            companyColumnClassName={companyColumnClassName}
            createdColumnClassName={createdColumnClassName}
          />
          <tbody className="bg-white">
            <TableBody
              isLoading={isLoading}
              error={error as Error | null}
              items={filteredItems}
              searchQuery={searchQuery || undefined}
              onRetry={handleRetry}
              onDelete={handleDeleteClick}
              onCompanyClick={handleCompanyClick}
              isDeleting={deleteMutation.isPending}
              companyColumnClassName={companyColumnClassName}
              createdColumnClassName={createdColumnClassName}
              selectedIds={selectedIds}
              onSelectRow={handleSelectRow}
            />
          </tbody>
        </TableContainer>
        {shouldShowPagination && data && (
          <div className="w-full flex justify-center mt-4">
            <Pagination
              currentPage={page}
              totalPages={data.total_pages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          count={pendingDeleteIds.length}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
        <DetailModal
          isOpen={detailModalOpen}
          favoriteId={selectedFavoriteId}
          onClose={handleDetailModalClose}
          onSuccess={() => {
            // queryClient가 자동으로 invalidate하므로 별도 처리 불필요
          }}
        />
      </>
    );
  }
);
