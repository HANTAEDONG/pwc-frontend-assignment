import type { FavoriteCompanyListItem } from "@/entities/favorite/api";

import { EmptyRow, ErrorRow, LoadingRow } from "./table-states";
import { TableRow } from "./table-row";

interface TableBodyProps {
  isLoading: boolean;
  error: Error | null;
  items: FavoriteCompanyListItem[];
  searchQuery?: string;
  onRetry: () => void;
  onDelete: (id: number) => void;
  onCompanyClick?: (id: number) => void;
  isDeleting: boolean;
  companyColumnClassName: string;
  createdColumnClassName: string;
  selectedIds: Set<number>;
  onSelectRow: (id: number, checked: boolean) => void;
}

export function TableBody({
  isLoading,
  error,
  items,
  searchQuery,
  onRetry,
  onDelete,
  onCompanyClick,
  isDeleting,
  companyColumnClassName,
  createdColumnClassName,
  selectedIds,
  onSelectRow,
}: TableBodyProps) {
  if (isLoading) {
    return <LoadingRow />;
  }

  if (error) {
    return <ErrorRow error={error} onRetry={onRetry} />;
  }

  if (items.length === 0) {
    return <EmptyRow searchQuery={searchQuery} />;
  }

  return (
    <>
      {items.map((item, index) => (
        <TableRow
          key={item.id}
          item={item}
          onDelete={onDelete}
          onCompanyClick={onCompanyClick}
          isDeleting={isDeleting}
          companyColumnClassName={companyColumnClassName}
          createdColumnClassName={createdColumnClassName}
          isChecked={selectedIds.has(item.id)}
          onSelect={(checked) => onSelectRow(item.id, checked)}
          isLast={index === items.length - 1}
        />
      ))}
    </>
  );
}
