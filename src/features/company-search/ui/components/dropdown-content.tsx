import { DropdownList } from "./dropdown-list";
import { DropdownItem } from "./dropdown-item";
import { LoadingState, ErrorState, EmptyState } from "./dropdown-states";
import type { CompanyInfo } from "@/entities/company/api";

interface DropdownContentProps {
  isLoading: boolean;
  error: Error | null;
  filteredCompanies: string[] | CompanyInfo[];
  selectedIndex: number;
  itemRefs: React.MutableRefObject<(HTMLLIElement | null)[]>;
  onSelect: (company: string | CompanyInfo) => void;
  listRef: React.RefObject<HTMLUListElement>;
  useDartApi: boolean;
}

export function DropdownContent({
  isLoading,
  error,
  filteredCompanies,
  selectedIndex,
  itemRefs,
  onSelect,
  listRef,
  useDartApi,
}: DropdownContentProps) {
  if (isLoading) {
    return (
      <DropdownList ref={listRef}>
        <LoadingState />
      </DropdownList>
    );
  }

  if (error) {
    return (
      <DropdownList ref={listRef}>
        <ErrorState />
      </DropdownList>
    );
  }

  if (filteredCompanies.length === 0) {
    return (
      <DropdownList ref={listRef}>
        <EmptyState />
      </DropdownList>
    );
  }

  return (
    <DropdownList ref={listRef}>
      {filteredCompanies.map((company, index) => (
        <DropdownItem
          key={
            useDartApi
              ? `${(company as CompanyInfo).corp_code}-${index}`
              : `${company as string}-${index}`
          }
          company={company}
          isSelected={index === selectedIndex}
          onClick={() => onSelect(company)}
          onRef={(el) => {
            itemRefs.current[index] = el;
          }}
          useDartApi={useDartApi}
        />
      ))}
    </DropdownList>
  );
}
