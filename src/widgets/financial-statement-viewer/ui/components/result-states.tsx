import { Button } from "@/shared/ui";
import { isAppError } from "@/shared/api/AppError";
import { Box } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = "재무제표를 불러오는 중입니다.",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
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
      <div className="mb-4 text-danger">
        <svg
          className="h-12 w-12"
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

export function mapErrorToUiMessage(error: unknown): string {
  if (isAppError(error)) {
    // 네트워크/권한/검증/기타 HTTP 코드에 따른 사용자 메시지 매핑
    if (error.code === "NETWORK_ERROR") {
      return "네트워크 오류가 발생했습니다. 연결을 확인한 뒤 다시 시도해주세요.";
    }
    if (error.code === "VALIDATION_ERROR" || error.statusCode === 422) {
      return "요청 값이 올바르지 않습니다. 필수 입력을 다시 확인해주세요.";
    }
    if (error.statusCode === 401 || error.statusCode === 403) {
      return "접근 권한이 없습니다. 로그인 상태 또는 권한을 확인해주세요.";
    }
    if (error.statusCode === 404) {
      return "데이터를 찾을 수 없습니다. 입력 값을 변경해 보세요.";
    }
    if (error.statusCode && error.statusCode >= 500) {
      return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }
    return error.message || "오류가 발생했습니다. 다시 시도해주세요.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "재무제표 조회 중 오류가 발생했습니다.";
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
