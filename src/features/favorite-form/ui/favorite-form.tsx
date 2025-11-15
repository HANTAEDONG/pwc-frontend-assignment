"use client";

import { useFavoriteForm } from "../model";
import type { UseFavoriteFormOptions } from "../model";
import { CompanySearchField } from "./components/company-search-field";
import { MemoField } from "./components/memo-field";
import { FormActions } from "./components/form-actions";

export type FavoriteFormProps = UseFavoriteFormOptions;

export function FavoriteForm(props: FavoriteFormProps) {
  const {
    form,
    dropdownRef,
    isEditMode,
    isPending,
    handleCompanySelect,
    handleSubmit,
  } = useFavoriteForm(props);

  const {
    register,
    formState: { errors },
  } = form;

  const companyNameError = errors.companyName?.message;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <CompanySearchField
        dropdownRef={dropdownRef}
        onSelect={handleCompanySelect}
        disabled={isEditMode}
        hasError={!!companyNameError}
        register={register}
        isEditMode={isEditMode}
      />
      <MemoField register={register} />
      <FormActions errorMessage={companyNameError} isPending={isPending} />
    </form>
  );
}

export type { FavoriteFormData } from "../model";
