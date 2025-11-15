import { forwardRef } from "react";

interface DropdownListProps {
  children: React.ReactNode;
}

export const DropdownList = forwardRef<HTMLUListElement, DropdownListProps>(
  ({ children }, ref) => {
    return (
      <ul
        ref={ref}
        id="company-search-results"
        role="listbox"
        className="absolute z-10 mt-2 flex max-h-[232px] w-full flex-col gap-1 overflow-y-auto rounded-lg border border-gray-border bg-white p-3 shadow-dialog [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
    );
  }
);

DropdownList.displayName = "DropdownList";
