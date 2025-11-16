import { cn } from "@/shared/lib/utils";

interface DropdownItemProps {
  company: string;
  isSelected: boolean;
  onClick: () => void;
  onRef: (el: HTMLLIElement | null) => void;
}

export function DropdownItem({
  company,
  isSelected,
  onClick,
  onRef,
}: DropdownItemProps) {
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
      {company}
    </li>
  );
}
