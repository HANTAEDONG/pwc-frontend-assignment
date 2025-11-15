import { cn } from "@/shared/lib/utils";
import type { CompanyInfo } from "@/entities/company/api";

interface DropdownItemProps {
  company: string | CompanyInfo;
  isSelected: boolean;
  onClick: () => void;
  onRef: (el: HTMLLIElement | null) => void;
  useDartApi: boolean;
}

export function DropdownItem({
  company,
  isSelected,
  onClick,
  onRef,
  useDartApi,
}: DropdownItemProps) {
  const displayName = useDartApi
    ? (company as CompanyInfo).corp_name
    : (company as string);

  return (
    <li
      ref={onRef}
      role="option"
      aria-selected={isSelected}
      onClick={onClick}
      className={cn(
        "w-full h-10 px-3 py-4 text-sm transition-colors rounded-[2px] cursor-pointer flex items-center",
        isSelected ? "bg-[#FFB27F] text-white" : "hover:bg-gray-50"
      )}
    >
      {displayName}
    </li>
  );
}
