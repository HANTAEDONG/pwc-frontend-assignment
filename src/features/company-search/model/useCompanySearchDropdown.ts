"use client";

import {
  useState,
  useDeferredValue,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useCompanies } from "@/entities/company/queries";
import { handleKeyboardNavigation } from "@/shared/lib/keyboard";

export interface UseCompanySearchDropdownOptions {
  onSelect: (companyName: string) => void;
  disabled?: boolean;
}

export interface UseCompanySearchDropdownReturn {
  inputValue: string;
  isOpen: boolean;
  selectedIndex: number;
  selectedCompany: string;
  filteredCompanies: string[];
  isLoading: boolean;
  error: Error | null;
  displayValue: string;
  listRef: React.RefObject<HTMLUListElement>;
  itemRefs: React.MutableRefObject<(HTMLLIElement | null)[]>;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSelect: (companyName: string) => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  handleFocus: () => void;
  close: () => void;
}

export function useCompanySearchDropdown({
  onSelect,
  disabled = false,
}: UseCompanySearchDropdownOptions): UseCompanySearchDropdownReturn {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedCompany, setSelectedCompany] = useState("");
  const deferredKeyword = useDeferredValue(inputValue);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const { data: companies, isLoading, error } = useCompanies();

  const keyword = deferredKeyword.trim().toLowerCase();
  const filteredCompanies = useMemo(() => {
    if (!companies || !keyword) return [];
    return companies.filter((name) => name.toLowerCase().includes(keyword));
  }, [companies, keyword]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const value = e.target.value;
    setInputValue(value);
    setIsOpen(true);
    setSelectedIndex(-1);
    setSelectedCompany("");
  };

  const handleSelect = (companyName: string) => {
    onSelect(companyName);
    setSelectedCompany(companyName);
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

  const handleFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const displayValue = inputValue || selectedCompany;

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
  };
}
