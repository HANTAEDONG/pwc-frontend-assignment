import { cn } from "@/shared/lib/utils";

interface DropdownItemProps {
  companyName: string;
  isSelected: boolean;
  onClick: () => void;
  onRef: (el: HTMLLIElement | null) => void;
}

export function DropdownItem({
  companyName,
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
        "w-full h-10 px-3 py-4 text-sm transition-colors rounded-[2px] cursor-pointer flex items-center",
        isSelected ? "bg-[#FFB27F] text-white" : "hover:bg-gray-50"
      )}
    >
      {companyName}
    </li>
  );
}
