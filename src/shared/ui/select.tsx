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
          "w-full h-10 px-3 pr-10 border rounded-md cursor-pointer flex items-center",
          "focus:outline-none focus:ring-0",
          hasError
            ? "border-red-500"
            : isOpen
            ? "border-[#FF8700]"
            : "border-gray-300"
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
          className="flex-1 outline-none bg-transparent"
          id={id}
        />
        {isOpen ? (
          <ChevronUp className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#5F5F62]" />
        ) : (
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#5F5F62]" />
        )}
      </div>
      {isOpen && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full max-h-[232px] mt-2 p-3 gap-1 bg-white border border-gray-300 rounded-md overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shadow-[0px_8px_16px_-2px_rgba(71,71,71,0.24)]"
        >
          {filteredOptions.length === 0 ? (
            <li className="w-full h-10 px-3 py-4 text-sm text-gray-500 rounded-[2px]">
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
                  "w-full h-10 px-3 py-4 text-sm transition-colors rounded-[2px] cursor-pointer flex items-center",
                  selectedIndex === index
                    ? "bg-[#FFB27F] text-white"
                    : "hover:bg-gray-50",
                  value === option.value && "font-semibold"
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
