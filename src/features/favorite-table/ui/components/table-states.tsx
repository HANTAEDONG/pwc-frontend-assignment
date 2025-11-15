import { Button } from "@/shared/ui";

interface EmptyStateProps {
  searchQuery?: string;
}

function EmptyState({ searchQuery }: EmptyStateProps) {
  if (searchQuery) {
    return (
      <div role="status" aria-live="polite" className="text-center py-12">
        <p className="text-gray-600 text-lg mb-2">
          &quot;{searchQuery}&quot;에 대한 검색 결과가 없습니다.
        </p>
        <p className="text-gray-500">다른 검색어를 입력해보세요.</p>
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite" className="text-center py-12">
      <p className="text-gray-600 text-lg mb-2">등록된 관심 기업이 없습니다.</p>
      <p className="text-gray-500">관심 기업을 등록해보세요.</p>
    </div>
  );
}

export function LoadingRow() {
  return (
    <tr>
      <td colSpan={5} className="px-4 py-12 text-center">
        <div
          role="status"
          aria-live="polite"
          aria-label="데이터 로딩 중"
          className="flex flex-col items-center justify-center"
        >
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
          <p className="text-gray-600">관심 기업 목록을 불러오는 중...</p>
        </div>
      </td>
    </tr>
  );
}

interface ErrorRowProps {
  error: Error;
  onRetry: () => void;
}

export function ErrorRow({ error, onRetry }: ErrorRowProps) {
  return (
    <tr>
      <td colSpan={5} className="px-4 py-12 text-center">
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-6 text-center"
        >
          <h3 className="mb-2 text-lg font-semibold text-red-800">
            데이터를 불러오는 중 오류가 발생했습니다
          </h3>
          <p className="mb-4 text-red-600">
            {error.message || "알 수 없는 오류가 발생했습니다."}
          </p>
          <Button onClick={onRetry} variant="fill">
            다시 시도
          </Button>
        </div>
      </td>
    </tr>
  );
}

export function EmptyRow({ searchQuery }: EmptyStateProps) {
  return (
    <tr>
      <td colSpan={5} className="px-4 py-12 text-center">
        <EmptyState searchQuery={searchQuery} />
      </td>
    </tr>
  );
}
