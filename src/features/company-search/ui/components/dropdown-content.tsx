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
  variant?: "overlay" | "static";
}

export function DropdownContent({
  isLoading,
  error,
  filteredCompanies,
  selectedIndex,
  itemRefs,
  onSelect,
  listRef,
  variant = "overlay",
}: DropdownContentProps) {
  if (isLoading) {
    return (
      <DropdownList ref={listRef} variant={variant}>
        <LoadingState />
      </DropdownList>
    );
  }

  if (error) {
    return (
      <DropdownList ref={listRef} variant={variant}>
        <ErrorState />
      </DropdownList>
    );
  }

  if (filteredCompanies.length === 0) {
    return (
      <DropdownList ref={listRef} variant={variant}>
        <EmptyState />
      </DropdownList>
    );
  }

  return (
    <DropdownList ref={listRef} variant={variant}>
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
