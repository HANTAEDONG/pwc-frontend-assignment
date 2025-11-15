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
import { useCompanies, useDartCompanies } from "@/entities/company/queries";
import type { CompanyInfo } from "@/entities/company/api";
import { handleKeyboardNavigation } from "@/shared/lib/keyboard";

export interface UseCompanySearchDropdownOptions {
  onSelect: (company: string | CompanyInfo) => void;
  disabled?: boolean;
  useDartApi?: boolean;
}

export interface UseCompanySearchDropdownReturn {
  inputValue: string;
  isOpen: boolean;
  selectedIndex: number;
  selectedCompany: string | CompanyInfo | null;
  filteredCompanies: string[] | CompanyInfo[];
  isLoading: boolean;
  error: Error | null;
  displayValue: string;
  listRef: React.RefObject<HTMLUListElement>;
  itemRefs: React.MutableRefObject<(HTMLLIElement | null)[]>;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSelect: (company: string | CompanyInfo) => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  handleFocus: () => void;
  close: () => void;
}

export function useCompanySearchDropdown({
  onSelect,
  disabled = false,
  useDartApi = false,
}: UseCompanySearchDropdownOptions): UseCompanySearchDropdownReturn {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedCompany, setSelectedCompany] = useState<
    string | CompanyInfo | null
  >(null);
  const deferredKeyword = useDeferredValue(inputValue);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const keyword = deferredKeyword.trim();

  // 백엔드 API 사용 (관심 기업 관리용)
  const {
    data: backendCompanies,
    isLoading: isLoadingBackend,
    error: errorBackend,
  } = useCompanies({
    enabled: !useDartApi && !!keyword && keyword.length > 0,
  });

  // DART API 사용 (재무제표 조회용)
  const {
    data: dartCompanies,
    isLoading: isLoadingDart,
    error: errorDart,
  } = useDartCompanies(keyword || undefined, {
    enabled: useDartApi && !!keyword && keyword.length > 0,
  });

  const companies = useDartApi ? dartCompanies : backendCompanies;
  const isLoading = useDartApi ? isLoadingDart : isLoadingBackend;
  const error = useDartApi ? errorDart : errorBackend;

  const filteredCompanies = useMemo(() => {
    if (!companies) return [];
    if (useDartApi) {
      return companies as CompanyInfo[];
    } else {
      const companyNames = companies as string[];
      const keywordLower = keyword.toLowerCase();
      return companyNames.filter((name) =>
        name.toLowerCase().includes(keywordLower)
      );
    }
  }, [companies, keyword, useDartApi]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const value = e.target.value;
    setInputValue(value);
    setIsOpen(true);
    setSelectedIndex(-1);
    setSelectedCompany(null);
  };

  const handleSelect = (company: string | CompanyInfo) => {
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

  const displayValue =
    inputValue ||
    (useDartApi
      ? (selectedCompany as CompanyInfo)?.corp_name
      : (selectedCompany as string)) ||
    "";

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
