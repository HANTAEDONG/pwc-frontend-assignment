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

  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 8; // 최대 표시할 페이지 수

    if (totalPages <= maxVisible) {
      // 전체 페이지가 적으면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 시작 페이지
      pages.push(1);

      let startPage = Math.max(2, currentPage - 2);
      let endPage = Math.min(totalPages - 1, currentPage + 2);

      // 현재 페이지가 앞쪽에 있으면
      if (currentPage <= 4) {
        startPage = 2;
        endPage = 8; // 1, 2, 3, 4, 5, 6, 7, 8까지 표시
      }
      // 현재 페이지가 뒤쪽에 있으면
      else if (currentPage >= totalPages - 3) {
        startPage = totalPages - 7;
        endPage = totalPages - 1;
      }

      // 시작 부분 ellipsis
      if (startPage > 2) {
        pages.push("ellipsis-start");
      }

      // 중간 페이지들
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // 끝 부분 ellipsis
      if (endPage < totalPages - 1) {
        pages.push("ellipsis-end");
      }

      // 마지막 페이지
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="h-[40px] flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto px-2">
      {/* 이전 버튼 */}
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

      {/* 페이지 번호들 */}
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

      {/* 다음 버튼 */}
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
