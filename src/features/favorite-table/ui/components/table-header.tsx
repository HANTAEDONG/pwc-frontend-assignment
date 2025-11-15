import { cn } from "@/shared/lib/utils";

interface TableHeaderProps {
  allSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  companyColumnClassName: string;
  createdColumnClassName: string;
}

export function TableHeader({
  allSelected,
  onSelectAll,
  companyColumnClassName,
  createdColumnClassName,
}: TableHeaderProps) {
  return (
    <thead className="bg-gray-50">
      <tr className="h-[50px]">
        <th
          scope="col"
          className="h-[50px] w-[60px] px-[15px] text-left align-middle border-b border-gray-border"
        >
          <label className="relative inline-block cursor-pointer">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="sr-only"
              aria-label="전체 선택"
            />
            <div
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-sm border transition-colors",
                allSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-gray-border bg-white"
              )}
            >
              {allSelected && (
                <svg
                  className="h-3 w-3 text-current"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </label>
        </th>
        <th
          scope="col"
          className={cn(
            "h-[50px] border-b border-gray-border px-4 text-left font-sans text-base font-semibold leading-[26px] tracking-normal tabular-nums text-gray-900",
            companyColumnClassName
          )}
        >
          기업명
        </th>
        <th
          scope="col"
          className={cn(
            "h-[50px] border-b border-gray-border px-4 text-left font-sans text-base font-semibold leading-[26px] tracking-normal tabular-nums text-gray-900",
            createdColumnClassName
          )}
        >
          생성일자
        </th>
        <th
          scope="col"
          className="h-[50px] w-[74px] border-b border-gray-border px-4 text-center align-middle"
        ></th>
        <th
          scope="col"
          className="h-[50px] w-[17px] border-b border-gray-border px-2 align-middle"
        ></th>
      </tr>
    </thead>
  );
}
