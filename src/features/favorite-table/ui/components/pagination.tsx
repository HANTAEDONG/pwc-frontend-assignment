"use client";

import { cn } from "@/shared/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePageClick = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageClick(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 8;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - 2);
      let endPage = Math.min(totalPages - 1, currentPage + 2);

      if (currentPage <= 4) {
        startPage = 2;
        endPage = 8;
      } else if (currentPage >= totalPages - 3) {
        startPage = Math.max(2, totalPages - (maxVisible - 2));
        endPage = totalPages - 1;
      }

      if (startPage > 2) {
        pages.push("ellipsis-start");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("ellipsis-end");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex h-10 items-center justify-center gap-1 overflow-x-auto px-2 sm:gap-2">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={cn(
          "flex h-10 shrink-0 items-center gap-1 px-2 text-xs font-medium text-gray-text transition-colors disabled:cursor-not-allowed disabled:text-gray-border sm:px-4 sm:text-sm",
          currentPage !== 1 && "cursor-pointer hover:text-gray-900"
        )}
        aria-label="이전 페이지"
      >
        <span>&lt;</span>
        <span className="hidden sm:inline">이전</span>
      </button>

      <div className="flex items-center gap-0.5 sm:gap-1">
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-10 items-center px-1 text-xs text-gray-500 sm:px-2 sm:text-sm"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              className={cn(
                "flex h-10 min-w-[32px] shrink-0 items-center justify-center rounded-md border px-2 text-xs font-semibold transition-colors sm:min-w-[40px] sm:px-3 sm:text-sm",
                isActive
                  ? "cursor-default border-gray-600 bg-gray-600 text-white"
                  : "cursor-pointer border-transparent text-gray-text hover:border-gray-border hover:text-gray-900"
              )}
              aria-label={`페이지 ${pageNum}`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={cn(
          "flex h-10 shrink-0 items-center gap-1 px-2 text-xs font-medium text-gray-text transition-colors disabled:cursor-not-allowed disabled:text-gray-border sm:px-4 sm:text-sm",
          currentPage !== totalPages && "cursor-pointer hover:text-gray-900"
        )}
        aria-label="다음 페이지"
      >
        <span className="hidden sm:inline">다음</span>
        <span>&gt;</span>
      </button>
    </div>
  );
}
