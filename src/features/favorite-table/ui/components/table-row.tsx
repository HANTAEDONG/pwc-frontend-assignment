import { Check, Trash } from "lucide-react";
import { cn, formatDate } from "@/shared/lib/utils";

import type { FavoriteCompanyListItem } from "@/entities/favorite/api";

interface TableRowProps {
  item: FavoriteCompanyListItem;
  onDelete: (id: number) => void;
  onCompanyClick?: (id: number) => void;
  isDeleting: boolean;
  companyColumnClassName: string;
  createdColumnClassName: string;
  isChecked: boolean;
  onSelect: (checked: boolean) => void;
  isLast?: boolean;
}

export function TableRow({
  item,
  onDelete,
  onCompanyClick,
  isDeleting,
  companyColumnClassName,
  createdColumnClassName,
  isChecked,
  onSelect,
  isLast = false,
}: TableRowProps) {
  return (
    <tr
      className={cn(
        "h-[50px] focus-within:bg-gray-50",
        isChecked ? "bg-primary-muted" : "hover:bg-gray-50"
      )}
    >
      <td
        className={cn(
          "h-[50px] w-[60px] px-[15px]",
          !isLast && "border-b border-gray-border"
        )}
      >
        <label className="relative inline-block cursor-pointer">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => onSelect(e.target.checked)}
            className="sr-only"
            aria-label={`${item.company_name} 선택`}
          />
          <div
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-sm border transition-colors",
              isChecked
                ? "border-primary bg-primary text-primary-foreground"
                : "border-gray-border bg-white"
            )}
          >
            {isChecked && (
              <Check className="h-3 w-3 text-current" strokeWidth={3} />
            )}
          </div>
        </label>
      </td>
      <td
        className={cn(
          "h-[50px] px-4 align-middle",
          !isLast && "border-b border-gray-border",
          companyColumnClassName
        )}
      >
        <button
          onClick={() => onCompanyClick?.(item.id)}
          className="truncate font-sans font-normal text-[16px] leading-normal tracking-normal text-gray-900 align-middle text-left w-full hover:text-gray-600 transition-colors cursor-pointer"
        >
          {item.company_name}
        </button>
      </td>
      <td
        className={cn(
          "h-[50px] px-4 align-middle",
          !isLast && "border-b border-gray-border",
          createdColumnClassName
        )}
      >
        <span className="block whitespace-nowrap font-sans font-normal text-[16px] leading-normal tracking-normal text-gray-900 align-middle">
          {formatDate(item.created_at)}
        </span>
      </td>
      <td
        className={cn(
          "h-[50px] w-[74px] px-4 text-center",
          !isLast && "border-b border-gray-border"
        )}
      >
        <button
          onClick={() => onDelete(item.id)}
          className="text-gray-border transition-colors hover:text-gray-600"
          aria-label={`${item.company_name} 삭제`}
          disabled={isDeleting}
        >
          <Trash className="h-5 w-5" />
        </button>
      </td>
      <td
        className={cn(
          "h-[50px] w-[17px] px-2",
          !isLast && "border-b border-gray-border"
        )}
      ></td>
    </tr>
  );
}
