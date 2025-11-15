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
          className="text-left align-middle h-[50px] px-[15px] border-b border-[#C6C6C8] w-[60px]"
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
                "h-5 w-5 rounded-sm border transition-colors flex items-center justify-center",
                allSelected
                  ? "bg-[#FF8700] border-[#FF8700]"
                  : "bg-white border-[#C6C6C8]"
              )}
            >
              {allSelected && (
                <svg
                  className="h-3 w-3 text-white"
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
            "text-left px-4 align-middle border-b border-[#C6C6C8] h-[50px] font-sans font-semibold text-base leading-[26px] tracking-normal tabular-nums",
            companyColumnClassName
          )}
        >
          기업명
        </th>
        <th
          scope="col"
          className={cn(
            "text-left px-4 align-middle border-b border-[#C6C6C8] h-[50px] font-sans font-semibold text-base leading-[26px] tracking-normal tabular-nums",
            createdColumnClassName
          )}
        >
          생성일자
        </th>
        <th
          scope="col"
          className="text-center px-4 align-middle border-b border-[#C6C6C8] h-[50px] w-[74px]"
        ></th>
        <th
          scope="col"
          className="px-2 align-middle border-b border-[#C6C6C8] h-[50px] w-[17px]"
        ></th>
      </tr>
    </thead>
  );
}
