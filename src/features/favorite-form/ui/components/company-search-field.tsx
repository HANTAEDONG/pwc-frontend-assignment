import type { UseFormRegister } from "react-hook-form";
import { CompanySearchDropdown } from "@/features/company-search";
import type { CompanySearchDropdownRef } from "@/features/company-search";
import type { FavoriteFormData } from "../../model";

interface CompanySearchFieldProps {
  dropdownRef: React.RefObject<CompanySearchDropdownRef>;
  onSelect: (companyName: string) => void;
  disabled: boolean;
  hasError: boolean;
  register: UseFormRegister<FavoriteFormData>;
  isEditMode: boolean;
}

export function CompanySearchField({
  dropdownRef,
  onSelect,
  disabled,
  hasError,
  register,
  isEditMode,
}: CompanySearchFieldProps) {
  return (
    <div className="mb-6">
      <label
        htmlFor="company-search"
        className="block text-base font-normal text-gray-700 mb-2"
      >
        관심기업 검색
      </label>
      <input
        type="hidden"
        {...register("companyName", {
          required: "기업을 선택해주세요",
          disabled: isEditMode,
        })}
      />
      <CompanySearchDropdown
        ref={dropdownRef}
        onSelect={onSelect}
        disabled={disabled}
        hasError={hasError}
      />
    </div>
  );
}
