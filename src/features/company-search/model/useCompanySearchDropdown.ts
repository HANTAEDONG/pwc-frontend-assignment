"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCompanies, getCompaniesRemote } from "@/entities/company/api";
import { handleKeyboardNavigation } from "@/shared/lib/keyboard";
import { debounce } from "@/shared/lib/debounce";

export interface UseCompanySearchDropdownOptions {
  onSelect: (company: string) => void;
  useDart?: boolean;
  disabled?: boolean;
  debounceMs?: number;
  useRemoteApi?: boolean;
}

export interface UseCompanySearchDropdownReturn {
  inputValue: string;
  isOpen: boolean;
  selectedIndex: number;
  selectedCompany: string | null;
  filteredCompanies: string[];
  isLoading: boolean;
  error: Error | null;
  displayValue: string;
  listRef: React.RefObject<HTMLUListElement>;
  itemRefs: React.MutableRefObject<(HTMLLIElement | null)[]>;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSelect: (company: string) => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  handleFocus: () => void;
  close: () => void;
  clear: () => void;
}

export function useCompanySearchDropdown({
  onSelect,
  disabled = false,
  debounceMs = 250,
  useRemoteApi = false,
}: UseCompanySearchDropdownOptions): UseCompanySearchDropdownReturn {
  const [inputValue, setInputValue] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const debouncedSetKeyword = useMemo(() => {
    if (debounceMs && debounceMs > 0) {
      return debounce((keyword: string) => {
        setDebouncedKeyword(keyword);
      }, debounceMs);
    }
    return null;
  }, [debounceMs]);

  useEffect(() => {
    const next = inputValue.trim();
    if (debouncedSetKeyword) {
      debouncedSetKeyword(next);
    } else {
      setDebouncedKeyword(next);
    }
  }, [inputValue, debouncedSetKeyword]);

  const keyword = debouncedKeyword;

  const {
    data: internalCompanies,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["company", "list", useRemoteApi ? "remote" : "local"],
    enabled: !!keyword && keyword.length >= 2,
    queryFn: () => (useRemoteApi ? getCompaniesRemote() : getCompanies()),
  });

  const filteredCompanies = useMemo(() => {
    const list = internalCompanies ?? [];
    const keywordLower = keyword.toLowerCase();
    if (keywordLower.length < 2) return [];
    const result: string[] = [];
    for (let i = 0; i < list.length; i++) {
      const name = list[i];
      if (name.toLowerCase().includes(keywordLower)) {
        result.push(name);
        if (result.length >= 50) break;
      }
    }
    return result;
  }, [internalCompanies, keyword]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const value = e.target.value;
    setInputValue(value);
    setIsOpen(true);
    setSelectedIndex(-1);
    setSelectedCompany(null);
  };

  const handleSelect = (company: string) => {
    onSelect(company);
    setSelectedCompany(company);
    setIsOpen(false);
    setInputValue("");
  };

  const scrollToItem = useCallback((index: number) => {
    const item = itemRefs.current[index];
    if (item && listRef.current) {
      const listRect = listRef.current.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      if (itemRect.top < listRect.top) {
        item.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else if (itemRect.bottom > listRect.bottom) {
        item.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, []);

  useEffect(() => {
    if (selectedIndex >= 0) {
      scrollToItem(selectedIndex);
    }
  }, [selectedIndex, scrollToItem]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      selectedIndex >= 0 &&
      filteredCompanies[selectedIndex]
    ) {
      e.preventDefault();
      e.stopPropagation();
      handleSelect(filteredCompanies[selectedIndex]);
      return;
    }

    handleKeyboardNavigation(e, {
      onEscape: () => {
        e.preventDefault();
        setIsOpen(false);
      },
      onArrowDown: () => {
        e.preventDefault();
        if (filteredCompanies.length > 0) {
          setSelectedIndex((prev) =>
            prev < filteredCompanies.length - 1 ? prev + 1 : prev
          );
        }
      },
      onArrowUp: () => {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      },
    });
  };

  const handleFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const displayValue = inputValue || selectedCompany || "";

  return {
    inputValue,
    isOpen,
    selectedIndex,
    selectedCompany,
    filteredCompanies,
    isLoading,
    error: error as Error | null,
    displayValue,
    listRef,
    itemRefs,
    handleInputChange,
    handleSelect,
    handleKeyDown,
    handleFocus,
    close,
    clear: () => {
      setSelectedCompany(null);
      setInputValue("");
    },
  };
}
