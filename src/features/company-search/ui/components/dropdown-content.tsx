import { DropdownList } from "./dropdown-list";
import { DropdownItem } from "./dropdown-item";
import { LoadingState, ErrorState, EmptyState } from "./dropdown-states";

interface DropdownContentProps {
  isLoading: boolean;
  error: Error | null;
  filteredCompanies: string[];
  selectedIndex: number;
  itemRefs: React.MutableRefObject<(HTMLLIElement | null)[]>;
  onSelect: (company: string) => void;
  listRef: React.RefObject<HTMLUListElement>;
}

export function DropdownContent({
  isLoading,
  error,
  filteredCompanies,
  selectedIndex,
  itemRefs,
  onSelect,
  listRef,
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
          key={`${company}-${index}`}
          company={company}
          isSelected={index === selectedIndex}
          onClick={() => onSelect(company)}
          onRef={(el) => {
            itemRefs.current[index] = el;
          }}
        />
      ))}
    </DropdownList>
  );
}
