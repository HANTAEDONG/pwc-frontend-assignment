"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  useFavoriteCompaniesQuery,
  useDeleteFavoriteCompany,
} from "@/entities/favorite";
import type {
  FavoriteCompanyListItem,
  PaginatedFavoriteCompanyResponse,
} from "@/entities/favorite/api";

const DEFAULT_EMAIL = "htd0913@gmail.com";

export interface UseFavoriteTableOptions {
  searchQuery?: string;
}

export interface PaginationInfo {
  startIndex: number;
  endIndex: number;
  total: number;
  currentPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export type UseDeleteFavoriteCompanyReturn = ReturnType<
  typeof useDeleteFavoriteCompany
>;

export interface UseFavoriteTableReturn {
  filteredItems: FavoriteCompanyListItem[];
  isLoading: boolean;
  error: Error | null;
  data: PaginatedFavoriteCompanyResponse | undefined;
  page: number;
  searchQuery: string;
  deleteMutation: UseDeleteFavoriteCompanyReturn;
  handleDelete: (id: number) => Promise<void>;
  handleRetry: () => void;
  paginationInfo: PaginationInfo | null;
  handlePreviousPage: () => string;
  handleNextPage: () => string;
}

export function useFavoriteTable({
  searchQuery: externalSearchQuery,
}: UseFavoriteTableOptions = {}): UseFavoriteTableReturn {
  const searchParams = useSearchParams();
  const [internalSearchQuery, setInternalSearchQuery] = useState(
    externalSearchQuery || searchParams?.get("search") || ""
  );
  const page = parseInt(searchParams?.get("page") || "1", 10);

  const searchQuery = externalSearchQuery ?? internalSearchQuery;

  const { data, isLoading, error, refetch } = useFavoriteCompaniesQuery(
    { email: DEFAULT_EMAIL, page },
    { enabled: !!DEFAULT_EMAIL }
  );

  const deleteMutation = useDeleteFavoriteCompany();

  const filteredItems = useMemo(() => {
    if (!data?.items) return [];
    if (!searchQuery) return data.items;

    const query = searchQuery.toLowerCase();
    return data.items.filter((item) =>
      item.company_name.toLowerCase().includes(query)
    );
  }, [data?.items, searchQuery]);

  const handleDelete = async (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteMutation.mutateAsync({
          favorite_id: id,
          email: DEFAULT_EMAIL,
        });
      } catch {
        // 에러는 mutation에서 처리됨
      }
    }
  };

  const handleRetry = () => {
    refetch();
  };

  const paginationInfo = useMemo<PaginationInfo | null>(() => {
    if (!data) return null;

    const startIndex = (page - 1) * data.page_size + 1;
    const endIndex = Math.min(page * data.page_size, data.total);

    return {
      startIndex,
      endIndex,
      total: data.total,
      currentPage: page,
      totalPages: data.total_pages,
      hasPreviousPage: page > 1,
      hasNextPage: page < data.total_pages,
    };
  }, [data, page]);

  const handlePreviousPage = () => {
    const newPage = Math.max(1, page - 1);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", newPage.toString());
    return `?${params.toString()}`;
  };

  const handleNextPage = () => {
    if (!data) return "";
    const newPage = Math.min(data.total_pages, page + 1);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", newPage.toString());
    return `?${params.toString()}`;
  };

  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setInternalSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  return {
    filteredItems,
    isLoading,
    error: error as Error | null,
    data,
    page,
    searchQuery,
    deleteMutation,
    handleDelete,
    handleRetry,
    paginationInfo,
    handlePreviousPage,
    handleNextPage,
  };
}
