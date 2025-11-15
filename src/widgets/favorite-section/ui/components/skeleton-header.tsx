import { cn } from "@/shared/lib/utils";

interface SkeletonHeaderProps {
  companyColumnClassName?: string;
  createdColumnClassName?: string;
}

export function SkeletonHeader({
  companyColumnClassName = "w-[55%]",
  createdColumnClassName = "w-[25%]",
}: SkeletonHeaderProps) {
  return (
    <thead className="bg-gray-50">
      <tr className="h-[50px]">
        <th className="h-[50px] w-[60px] border-b border-gray-border px-[15px]">
          <div className="h-4 w-4 rounded bg-gray-200" />
        </th>
        <th
          className={cn(
            "h-[50px] border-b border-gray-border px-4",
            companyColumnClassName
          )}
        >
          <div className="h-4 w-full rounded bg-gray-200" />
        </th>
        <th
          className={cn(
            "h-[50px] border-b border-gray-border px-4",
            createdColumnClassName
          )}
        >
          <div className="h-4 w-full rounded bg-gray-200" />
        </th>
        <th className="h-[50px] w-[74px] border-b border-gray-border px-4">
          <div className="h-4 w-full rounded bg-gray-200" />
        </th>
        <th className="h-[50px] w-[17px] border-b border-gray-border px-2">
          <div className="h-4 w-full rounded bg-gray-200" />
        </th>
      </tr>
    </thead>
  );
}
