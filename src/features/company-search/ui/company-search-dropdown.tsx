'use client';

import { useState } from 'react';
import { useCompanySearch } from '@/entities/company';
import { debounce } from '@/shared/lib/debounce';
import { handleKeyboardNavigation, KeyboardKeys } from '@/shared/lib/keyboard';

export interface CompanySearchDropdownProps {
  onSelect: (companyId: string, companyName: string) => void;
  placeholder?: string;
}

export function CompanySearchDropdown({
  onSelect,
  placeholder = '기업명을 검색하세요',
}: CompanySearchDropdownProps) {
  const [keyword, setKeyword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedSearch = debounce((value: string) => {
    setKeyword(value);
  }, 300);

  const { data, isLoading, error } = useCompanySearch(
    { keyword },
    {
      enabled: keyword.length > 0,
      keepPreviousData: true,
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSearch(value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleSelect = (companyId: string, companyName: string) => {
    onSelect(companyId, companyName);
    setIsOpen(false);
    setKeyword('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    handleKeyboardNavigation(e, {
      onEscape: () => setIsOpen(false),
      onArrowDown: () => {
        if (data?.companies && data.companies.length > 0) {
          setSelectedIndex((prev) =>
            prev < data.companies.length - 1 ? prev + 1 : prev
          );
        }
      },
      onArrowUp: () => {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      },
      onEnter: () => {
        if (
          selectedIndex >= 0 &&
          data?.companies &&
          data.companies[selectedIndex]
        ) {
          const company = data.companies[selectedIndex];
          handleSelect(company.id, company.name);
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
        aria-expanded={isOpen}
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
          {data?.companies.length === 0 && (
            <li>검색 결과가 없습니다.</li>
          )}
          {data?.companies.map((company, index) => (
            <li
              key={company.id}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => handleSelect(company.id, company.name)}
              className={`cursor-pointer p-2 ${
                index === selectedIndex ? 'bg-blue-100' : ''
              }`}
            >
              {company.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
