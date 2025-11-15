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
        className="absolute z-10 w-full max-h-[232px] mt-2 p-3 gap-1 bg-white border border-gray-300 rounded-md overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shadow-[0px_8px_16px_-2px_rgba(71,71,71,0.24)]"
      >
        {children}
      </ul>
    );
  }
);

DropdownList.displayName = "DropdownList";
