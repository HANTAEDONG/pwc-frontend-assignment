import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface SearchInputProps {
  value: string;
  placeholder: string;
  disabled: boolean;
  hasError: boolean;
  isOpen: boolean;
  hasInput: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
}

export function SearchInput({
  value,
  placeholder,
  disabled,
  hasError,
  isOpen,
  hasInput,
  onChange,
  onKeyDown,
  onFocus,
}: SearchInputProps) {
  const Icon = hasInput && isOpen ? ChevronUp : ChevronDown;

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
          disabled && "cursor-not-allowed bg-gray-50 text-gray-border"
        )}
      />
      <Icon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
    </div>
  );
}
