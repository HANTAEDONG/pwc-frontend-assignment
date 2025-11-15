"use client";

import { InputHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/shared/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  errorId?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, errorId, id, className = "", ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorMessageId = errorId || `${inputId}-error`;

    return (
      <div>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1 block text-sm font-medium text-gray-text"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "block w-full rounded-md border border-gray-border bg-white text-gray-text shadow-sm transition focus:border-primary focus:ring-primary focus-visible:ring-primary sm:text-sm",
            error && "border-danger focus:border-danger focus:ring-danger",
            className
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorMessageId : undefined}
          {...props}
        />
        {error && (
          <div
            id={errorMessageId}
            role="alert"
            className="mt-1 text-sm text-danger"
          >
            {error}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
