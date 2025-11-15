"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: readonly SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  id?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "선택해주세요",
  disabled = false,
  hasError = false,
  id,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchValue("");
        setSelectedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchValue("");
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchValue("");
      setSelectedIndex(-1);
      return;
    }

    if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const option = filteredOptions[selectedIndex];
      if (option) {
        handleSelect(option.value);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      return;
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const item = itemRefs.current[selectedIndex];
      if (item) {
        item.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedIndex]);

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          "flex h-10 w-full cursor-pointer items-center rounded-md border bg-white px-3 pr-10 text-gray-text transition focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-white",
          disabled && "cursor-not-allowed bg-gray-50 text-gray-400",
          hasError
            ? "border-danger"
            : isOpen
            ? "border-primary"
            : "border-gray-border"
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <input
          type="text"
          value={isOpen ? searchValue : selectedOption?.label || ""}
          onChange={(e) => {
            if (!isOpen) setIsOpen(true);
            setSearchValue(e.target.value);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => !disabled && setIsOpen(true)}
          placeholder={selectedOption ? undefined : placeholder}
          disabled={disabled}
          readOnly={!isOpen}
          className="flex-1 bg-transparent text-sm text-gray-text outline-none placeholder:text-gray-400"
          id={id}
        />
        {isOpen ? (
          <ChevronUp className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        ) : (
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        )}
      </div>
      {isOpen && (
        <ul
          ref={listRef}
          className="absolute z-10 mt-2 flex max-h-[232px] w-full flex-col gap-1 overflow-y-auto rounded-lg border border-gray-border bg-white p-3 shadow-dialog [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {filteredOptions.length === 0 ? (
            <li className="h-10 w-full rounded-xs px-3 py-4 text-sm text-gray-500">
              검색 결과가 없습니다.
            </li>
          ) : (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                role="option"
                aria-selected={selectedIndex === index}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex h-10 w-full cursor-pointer items-center rounded-xs px-3 py-4 text-sm text-gray-text transition-colors",
                  selectedIndex === index
                    ? "bg-primary-light text-primary-foreground"
                    : "hover:bg-gray-50",
                  value === option.value && "font-semibold text-gray-900"
                )}
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
