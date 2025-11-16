"use client";

import { useImperativeHandle, forwardRef, useEffect, useRef } from "react";
import { useFavoriteTable, useFavoriteTableState } from "../model";
import { TableContainer } from "./components/table-container";
import { TableHeader } from "./components/table-header";
import { TableBody } from "./components/table-body";
import { Pagination } from "./components/pagination";

export interface FavoriteTableProps {
  searchQuery?: string;
  companyColumnClassName?: string;
  createdColumnClassName?: string;
}

export interface FavoriteTableRef {
  getSelectedIds: () => number[];
  deleteSelected: () => void;
  subscribeSelectionChange: (listener: (count: number) => void) => () => void;
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
      allSelected,
      handleSelectAll,
      handleSelectRow,
      handleDeleteClick,
      handleDeleteSelected,
      handleCompanyClick,
      handlePageChange,
      shouldShowPagination,
      getSelectedIds,
    } = useFavoriteTableState({
      filteredItems,
      deleteMutation,
      data,
    });

    const selectionListenersRef = useRef(
      new Set<(count: number) => void>()
    );

    useEffect(() => {
      const count = selectedIds.size;
      selectionListenersRef.current.forEach((listener) => listener(count));
    }, [selectedIds]);

    useImperativeHandle(ref, () => ({
      getSelectedIds,
      deleteSelected: handleDeleteSelected,
      subscribeSelectionChange: (listener: (count: number) => void) => {
        selectionListenersRef.current.add(listener);
        return () => {
          selectionListenersRef.current.delete(listener);
        };
      },
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
      </>
    );
  }
);
