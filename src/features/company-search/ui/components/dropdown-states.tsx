interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "검색 중..." }: LoadingStateProps) {
  return (
    <li className="w-full h-10 px-3 py-4 text-sm text-gray-500 rounded-[2px]">
      {message}
    </li>
  );
}

interface ErrorStateProps {
  message?: string;
}

export function ErrorState({
  message = "검색 중 오류가 발생했습니다.",
}: ErrorStateProps) {
  return (
    <li
      role="alert"
      className="w-full h-10 px-3 py-4 text-sm text-red-600 rounded-[2px]"
    >
      {message}
    </li>
  );
}

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({
  message = "검색 결과가 없습니다.",
}: EmptyStateProps) {
  return (
    <li className="w-full h-10 px-3 py-4 text-sm text-gray-500 rounded-[2px]">
      {message}
    </li>
  );
}
