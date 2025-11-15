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
          "w-full h-10 px-3 pr-10 border rounded-md",
          "focus:outline-none focus:ring-0",
          hasError
            ? "border-red-500"
            : isOpen
            ? "border-[#FFB27F]"
            : "border-gray-300"
        )}
      />
      <Icon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#5F5F62]" />
    </div>
  );
}
