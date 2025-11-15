import { TableContainer } from "@/features/favorite-table/ui/components/table-container";
import { SkeletonHeader } from "./components/skeleton-header";
import { SkeletonRow } from "./components/skeleton-row";

const SKELETON_ROW_COUNT = 5;

interface FavoriteTableSkeletonProps {
  companyColumnClassName?: string;
  createdColumnClassName?: string;
}

export function FavoriteTableSkeleton({
  companyColumnClassName = "w-[55%]",
  createdColumnClassName = "w-[25%]",
}: FavoriteTableSkeletonProps = {}) {
  return (
    <div aria-hidden="true">
      <TableContainer>
        <SkeletonHeader
          companyColumnClassName={companyColumnClassName}
          createdColumnClassName={createdColumnClassName}
        />
        <tbody>
          {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
            <SkeletonRow
              key={index}
              companyColumnClassName={companyColumnClassName}
              createdColumnClassName={createdColumnClassName}
            />
          ))}
        </tbody>
      </TableContainer>
    </div>
  );
}
