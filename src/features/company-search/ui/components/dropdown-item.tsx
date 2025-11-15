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
        "flex h-10 w-full cursor-pointer items-center rounded-xs px-3 py-4 text-sm text-gray-text transition-colors",
        isSelected
          ? "bg-primary-light text-primary-foreground"
          : "hover:bg-gray-50"
      )}
    >
      {displayName}
    </li>
  );
}
