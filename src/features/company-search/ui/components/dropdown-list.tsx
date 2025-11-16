import { forwardRef } from "react";
import { cn } from "@/shared/lib/utils";

interface DropdownListProps {
  children: React.ReactNode;
  variant?: "overlay" | "static";
}

export const DropdownList = forwardRef<HTMLUListElement, DropdownListProps>(
  ({ children, variant = "overlay" }, ref) => {
    return (
      <ul
        ref={ref}
        id="company-search-results"
        role="listbox"
        className={cn(
          "flex w-full flex-col gap-1 rounded-lg border border-gray-border bg-white p-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          variant === "overlay"
            ? "absolute z-10 mt-2 max-h-[232px] overflow-y-auto shadow-dialog"
            : "relative h-[232px] overflow-y-auto"
        )}
      >
        {children}
      </ul>
    );
  }
);

DropdownList.displayName = "DropdownList";
