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
    <div className="h-[40px] flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto px-2">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={cn(
          "h-[40px] px-2 sm:px-4 flex items-center gap-1 text-xs sm:text-sm font-normal transition-colors shrink-0",
          currentPage === 1
            ? "text-[#C6C6C8] cursor-not-allowed"
            : "text-gray-800 hover:text-gray-600 cursor-pointer"
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
                className="text-gray-800 px-1 sm:px-2 h-[40px] flex items-center text-xs sm:text-sm"
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
                "h-[40px] min-w-[32px] sm:min-w-[40px] px-2 sm:px-3 flex items-center justify-center text-xs sm:text-sm font-bold rounded transition-colors shrink-0",
                isActive
                  ? "bg-gray-800 text-white cursor-default"
                  : "text-gray-800 hover:text-gray-600 cursor-pointer"
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
          "h-[40px] px-2 sm:px-4 flex items-center gap-1 text-xs sm:text-sm font-normal transition-colors shrink-0",
          currentPage === totalPages
            ? "text-[#C6C6C8] cursor-not-allowed"
            : "text-gray-800 hover:text-gray-600 cursor-pointer"
        )}
        aria-label="다음 페이지"
      >
        <span className="hidden sm:inline">다음</span>
        <span>&gt;</span>
      </button>
    </div>
  );
}
