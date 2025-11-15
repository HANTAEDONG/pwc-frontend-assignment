import { Button } from "@/shared/ui";
import { Box } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = "재무제표를 불러오는 중입니다.",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "재무제표 조회 중 오류가 발생했습니다.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-red-500 mb-4">
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          재시도
        </Button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({
  message = "기업명과 보고서 옵션을 선택하여 제무제표를 조회해보세요.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-[65px] h-[65px] mb-4 text-gray-400">
        <Box className="w-full h-full" />
      </div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
