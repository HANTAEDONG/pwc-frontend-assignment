"use client";

import { useImperativeHandle, forwardRef, useState } from "react";
import { useCompanySearchDropdown } from "../model";
import type { UseCompanySearchDropdownReturn } from "../model";
import { SearchInput } from "./components/search-input";
import { DropdownContent } from "./components/dropdown-content";
import { Button, Modal } from "@/shared/ui";
import { X } from "lucide-react";

export interface CompanySearchDropdownProps {
  onSelect: (company: string) => void;
  useDart?: boolean;
  debounceMs?: number;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  useModal?: boolean;
  useRemoteApi?: boolean;
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
      useDart = false,
      debounceMs,
      placeholder = "기업을 검색해주세요",
      disabled = false,
      hasError = false,
      useModal = true,
      useRemoteApi = false,
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
      useDart,
      debounceMs,
      disabled,
      useRemoteApi,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearchIconClick = () => {
      setIsModalOpen(true);
    };

    const handleSelectAndClose = (company: string) => {
      handleSelect(company);
      setIsModalOpen(false);
    };

    useImperativeHandle(ref, () => ({
      close,
    }));

    const shouldShowDropdown =
      isOpen && inputValue && (!useModal || !isModalOpen);

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
          onSearchIconClick={handleSearchIconClick}
          onInputClick={useModal ? handleSearchIconClick : undefined}
          rightIcon={useModal ? "search" : "chevron"}
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
          />
        )}
        {useModal && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            maxWidth="1000px"
          >
            <div>
              <div className="flex items-center justify-between gap-2.5 border-b border-gray-border px-5 py-2">
                <h2 className="text-2xl font-bold text-gray-900 leading-[1.4166666666666667em] whitespace-nowrap flex-shrink-0">
                  기업명 검색
                </h2>
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="ghost"
                  className="h-auto w-auto flex-shrink-0 p-0 text-gray-900 hover:text-gray-700"
                  aria-label="닫기"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="px-5 py-4 space-y-4">
                <div>
                  <label
                    htmlFor="company-search-modal"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    기업을 검색해주세요
                  </label>
                  <input
                    id="company-search-modal"
                    type="text"
                    value={displayValue}
                    placeholder="기업을 검색해주세요"
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    autoComplete="off"
                    aria-autocomplete="list"
                    aria-controls="company-search-results"
                    className="h-10 w-full rounded-md border border-gray-border px-3 text-sm text-gray-text transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={disabled}
                  />
                </div>
                <div className="max-h-[480px] overflow-y-auto">
                  <DropdownContent
                    isLoading={isLoading}
                    error={error}
                    filteredCompanies={filteredCompanies}
                    selectedIndex={selectedIndex}
                    itemRefs={itemRefs}
                    onSelect={handleSelectAndClose}
                    listRef={listRef}
                    variant="static"
                  />
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }
);

CompanySearchDropdown.displayName = "CompanySearchDropdown";
