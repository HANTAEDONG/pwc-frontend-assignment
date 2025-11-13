"use client";

import { useState, useMemo } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useCompanies } from "@/entities/company/queries";
import { debounce } from "@/shared/lib/debounce";
import { handleKeyboardNavigation } from "@/shared/lib/keyboard";

export interface CompanySearchDropdownProps {
  onSelect: (companyName: string) => void;
  placeholder?: string;
}

export function CompanySearchDropdown({
  onSelect,
  placeholder = "기업명을 검색하세요",
}: CompanySearchDropdownProps) {
  const [keyword, setKeyword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedSearch = debounce<(value: string) => void>((value: string) => {
    setKeyword(value);
  }, 300);

  const { data: companies, isLoading, error } = useCompanies();

  const filteredCompanies = useMemo(() => {
    if (!companies || !keyword) return [];
    return companies.filter((name) =>
      name.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [companies, keyword]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSearch(value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleSelect = (companyName: string) => {
    onSelect(companyName);
    setIsOpen(false);
    setKeyword("");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    handleKeyboardNavigation(e, {
      onEscape: () => setIsOpen(false),
      onArrowDown: () => {
        if (filteredCompanies.length > 0) {
          setSelectedIndex((prev) =>
            prev < filteredCompanies.length - 1 ? prev + 1 : prev
          );
        }
      },
      onArrowUp: () => {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      },
      onEnter: () => {
        if (selectedIndex >= 0 && filteredCompanies[selectedIndex]) {
          handleSelect(filteredCompanies[selectedIndex]);
        }
      },
    });
  };

  return (
    <div className="relative">
      <label htmlFor="company-search" className="sr-only">
        기업 검색
      </label>
      <input
        id="company-search"
        type="text"
        placeholder={placeholder}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        aria-autocomplete="list"
        aria-controls="company-search-results"
        className="w-full"
      />
      {isOpen && keyword && (
        <ul
          id="company-search-results"
          role="listbox"
          className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-lg"
        >
          {isLoading && <li>검색 중...</li>}
          {error && <li role="alert">검색 중 오류가 발생했습니다.</li>}
          {filteredCompanies.length === 0 && <li>검색 결과가 없습니다.</li>}
          {filteredCompanies.map((companyName, index) => (
            <li
              key={companyName}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => handleSelect(companyName)}
              className={`cursor-pointer p-2 ${
                index === selectedIndex ? "bg-blue-100" : ""
              }`}
            >
              {companyName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
