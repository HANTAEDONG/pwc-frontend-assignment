'use client';

import { useFavorites, useDeleteFavorite } from '@/entities/favorite';
import { Button } from '@/shared/ui';

export interface FavoriteTableProps {
  onEdit?: (id: string) => void;
}

export function FavoriteTable({ onEdit }: FavoriteTableProps) {
  const { data: favorites, isLoading, error } = useFavorites();
  const deleteMutation = useDeleteFavorite();

  const handleDelete = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
      }
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div role="alert">데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  if (!favorites || favorites.length === 0) {
    return <div>등록된 관심 기업이 없습니다.</div>;
  }

  return (
    <section>
      <h2>관심 기업 목록</h2>
      <table>
        <caption className="sr-only">관심 기업 목록 테이블</caption>
        <thead>
          <tr>
            <th scope="col">기업명</th>
            <th scope="col">등록일</th>
            <th scope="col">작업</th>
          </tr>
        </thead>
        <tbody>
          {favorites.map((favorite) => (
            <tr key={favorite.id}>
              <td>{favorite.companyName}</td>
              <td>
                {new Date().toLocaleDateString()}
              </td>
              <td>
                {onEdit && (
                  <Button
                    onClick={() => onEdit(favorite.id)}
                    variant="secondary"
                    size="sm"
                  >
                    수정
                  </Button>
                )}
                <Button
                  onClick={() => handleDelete(favorite.id)}
                  variant="danger"
                  size="sm"
                >
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
