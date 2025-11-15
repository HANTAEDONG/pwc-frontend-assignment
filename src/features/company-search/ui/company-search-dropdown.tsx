"use client";

import { useImperativeHandle, forwardRef } from "react";
import { useCompanySearchDropdown } from "../model";
import type { UseCompanySearchDropdownReturn } from "../model";
import type { CompanyInfo } from "@/entities/company/api";
import { SearchInput } from "./components/search-input";
import { DropdownContent } from "./components/dropdown-content";

export interface CompanySearchDropdownProps {
  onSelect: (company: string | CompanyInfo) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  useDartApi?: boolean; // DART API 사용 여부
}

export interface CompanySearchDropdownRef {
  close: () => void;
}

export const CompanySearchDropdown = forwardRef<
  CompanySearchDropdownRef,
  CompanySearchDropdownProps
>(
  (
    {
      onSelect,
      placeholder = "기업명을 검색하세요",
      disabled = false,
      hasError = false,
      useDartApi = false,
    },
    ref
  ) => {
    const {
      inputValue,
      isOpen,
      selectedIndex,
      filteredCompanies,
      isLoading,
      error,
      displayValue,
      listRef,
      itemRefs,
      handleInputChange,
      handleSelect,
      handleKeyDown,
      handleFocus,
      close,
    }: UseCompanySearchDropdownReturn = useCompanySearchDropdown({
      onSelect,
      disabled,
      useDartApi,
    });

    useImperativeHandle(ref, () => ({
      close,
    }));

    const shouldShowDropdown = isOpen && inputValue;

    return (
      <div className="relative">
        <SearchInput
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          hasError={hasError}
          isOpen={isOpen}
          hasInput={!!inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
        />
        {shouldShowDropdown && (
          <DropdownContent
            isLoading={isLoading}
            error={error}
            filteredCompanies={filteredCompanies}
            selectedIndex={selectedIndex}
            itemRefs={itemRefs}
            onSelect={handleSelect}
            listRef={listRef}
            useDartApi={useDartApi}
          />
        )}
      </div>
    );
  }
);

CompanySearchDropdown.displayName = "CompanySearchDropdown";
