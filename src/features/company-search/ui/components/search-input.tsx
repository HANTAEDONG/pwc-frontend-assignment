import { ChevronDown, ChevronUp } from "lucide-react";
import { ICONS } from "@/shared/ui/icons";
import { cn } from "@/shared/lib/utils";

interface SearchInputProps {
  value: string;
  placeholder: string;
  disabled: boolean;
  hasError: boolean;
  isOpen: boolean;
  hasInput?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onSearchIconClick: () => void;
  onInputClick?: () => void;
  rightIcon?: "search" | "chevron";
  hoverPointer?: boolean;
}

export function SearchInput({
  value,
  placeholder,
  disabled,
  hasError,
  isOpen,
  hasInput = false,
  onChange,
  onKeyDown,
  onFocus,
  onSearchIconClick,
  onInputClick,
  rightIcon = "search",
  hoverPointer = false,
}: SearchInputProps) {
  return (
    <div className="relative">
      <input
        id="company-search"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onClick={onInputClick}
        autoComplete="off"
        aria-autocomplete="list"
        aria-controls="company-search-results"
        disabled={disabled}
        className={cn(
          "h-10 w-full rounded-md border px-3 pr-10 text-sm text-gray-text transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
          hasError
            ? "border-danger focus:border-danger focus:ring-danger"
            : isOpen
            ? "border-primary"
            : "border-gray-border",
          disabled && "cursor-not-allowed bg-gray-50 text-gray-border",
          hoverPointer && "hover:cursor-pointer"
        )}
      />
      {rightIcon === "search" ? (
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          aria-label="검색 열기"
          onClick={onSearchIconClick}
        >
          {ICONS.search}
        </button>
      ) : (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          {isOpen && hasInput ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      )}
    </div>
  );
}
